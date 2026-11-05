// BlasterZone — Desktop Spoof plugin
// Patches gateway identify to spoof Windows desktop client

(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;

  const storage = plugin.createStorage();

  const SPOOF_TARGETS = {
    WINDOWS: { label: "Windows", os: "Windows", browser: "Discord Client", device: "" },
    MAC:     { label: "macOS",   os: "Mac OS X", browser: "Discord Client", device: "" },
    LINUX:   { label: "Linux",   os: "Linux",    browser: "Discord Client", device: "" },
  };

  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const SocketModule = bunny.metro.findByProps("identify", "sendHeartbeat")
    || bunny.metro.findByProps("socket", "identify");
  const GatewaySocket = bunny.metro.findByProps("send", "_socket")
    || bunny.metro.findByProps("handleSend");

  let unpatches = [];
  let isActive = false;
  let currentTarget = "WINDOWS";

  function getProperties() {
    const t = SPOOF_TARGETS[currentTarget] || SPOOF_TARGETS.WINDOWS;
    return {
      os: t.os,
      browser: t.browser,
      device: t.device,
      browser_version: "stable",
      os_version: "",
      referrer: "",
      referring_domain: "",
      referrer_current: "",
      referring_domain_current: "",
      release_channel: "stable",
      client_build_number: 999999,
      client_event_source: null
    };
  }

  function enable() {
    if (isActive) return;
    isActive = true;
    currentTarget = storage.target || "WINDOWS";

    // Hook gateway IDENTIFY payload — spoof properties
    if (FluxDispatcher) {
      unpatches.push(patcher.before("dispatch", FluxDispatcher, function(args) {
        const action = args[0];
        if (!action) return;

        if (action.type === "GATEWAY_IDENTIFY") {
          if (action.properties) {
            Object.assign(action.properties, getProperties());
          }
        }

        // Also hook the raw socket identify if accessible
        if (action.type === "IDENTIFY" && action.d?.properties) {
          Object.assign(action.d.properties, getProperties());
        }
      }));
    }

    // Try patching the socket send directly
    if (GatewaySocket?.send) {
      unpatches.push(patcher.before("send", GatewaySocket, function(args) {
        try {
          const data = typeof args[0] === "string" ? JSON.parse(args[0]) : args[0];
          if (data?.op === 2 && data?.d?.properties) {
            Object.assign(data.d.properties, getProperties());
            args[0] = typeof args[0] === "string" ? JSON.stringify(data) : data;
          }
        } catch (e) {}
      }));
    }

    plugin.logger.info(`Desktop Spoof enabled: ${currentTarget}`);
  }

  function disable() {
    if (!isActive) return;
    isActive = false;
    unpatches.forEach(u => u?.());
    unpatches = [];
  }

  plugin.default = definePlugin({
    start() {
      if (storage.enabled !== false) enable();
    },
    stop() {
      disable();
    },
    SettingsComponent() {
      const { React } = bunny.metro.common;
      const Forms = bunny.metro.common.components
        || bunny.metro.findByProps("FormSection", "FormSwitch")
        || {};
      const { FormSection, FormSwitch, FormText, Pressable, Text } = Forms;

      const [on, setOn] = React.useState(storage.enabled !== false);
      const [target, setTarget] = React.useState(storage.target || "WINDOWS");

      function toggleEnabled(val) {
        storage.enabled = val;
        setOn(val);
        val ? enable() : disable();
      }

      function pickTarget(t) {
        storage.target = t;
        currentTarget = t;
        setTarget(t);
      }

      return React.createElement(FormSection, { title: "Desktop Spoof" },
        FormSwitch && React.createElement(FormSwitch, {
          label: "Enable Desktop Spoof",
          subLabel: "Spoof your gateway identify as a desktop client",
          value: on,
          onValueChange: toggleEnabled,
        }),
        React.createElement(FormSection, { title: "Spoof Target" },
          Object.keys(SPOOF_TARGETS).map(k =>
            React.createElement(Pressable || "TouchableOpacity", {
              key: k,
              onPress: () => pickTarget(k),
              style: {
                paddingVertical: 10, paddingHorizontal: 16,
                backgroundColor: target === k ? "#5865F2" : "transparent",
                borderRadius: 6, marginVertical: 2,
              }
            },
              React.createElement(Text || "Text", {
                style: { color: target === k ? "#fff" : "#888", fontWeight: target === k ? "700" : "400" }
              }, SPOOF_TARGETS[k].label)
            )
          )
        )
      );
    }
  });
})();
