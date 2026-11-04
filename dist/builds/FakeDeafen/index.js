// BlasterZone — Fake Deafen plugin
// Spec 3 / Bunny plugin format
// Appear deafened to others but hear everything locally

(function() {
  const { plugin, api } = bunny;
  const { patcher, flux } = api;

  const storage = plugin.createStorage();

  // Find Discord modules
  const MediaEngine = bunny.metro.findByProps("setLocalDeaf", "setLocalMute")
    || bunny.metro.findByProps("setDeaf", "setMute");
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const VoiceStateUtils = bunny.metro.findByProps("updateSelfDeaf", "updateSelfMute");
  const RTCConnection = bunny.metro.findByProps("getMediaEngine")
    || bunny.metro.findByProps("updateVideoQuality");

  let unpatchDeaf = null;
  let unpatchDispatch = null;
  let isActive = false;

  function enable() {
    if (isActive) return;
    isActive = true;

    // Patch setLocalDeaf — make Discord think we're deafened but don't actually deafen audio
    if (MediaEngine && MediaEngine.setLocalDeaf) {
      unpatchDeaf = patcher.instead("setLocalDeaf", MediaEngine, function(args, orig) {
        // args[0] = deaf (bool), args[1] = channelId
        // Always call with false locally (keep hearing), but send true to server via dispatch
        orig(false, args[1]);
      });
    }

    // Intercept outgoing voice state updates — spoof deaf=true to gateway
    if (FluxDispatcher) {
      unpatchDispatch = patcher.before("dispatch", FluxDispatcher, function(args) {
        const action = args[0];
        if (!action) return;

        // When user manually deafens or we toggle, spoof the outgoing state
        if (action.type === "AUDIO_TOGGLE_SELF_DEAF" || action.type === "VOICE_STATE_UPDATE") {
          // Let the action through but mark it as deafened for the gateway
          if (action.type === "AUDIO_TOGGLE_SELF_DEAF") {
            args[0] = { ...action, deaf: true };
          }
        }

        // Intercept gateway identify/update — ensure server sees us as deafened
        if (action.type === "GATEWAY_DISPATCH" && action.event === "VOICE_STATE_UPDATE") {
          if (action.data && action.data.self_deaf === false) {
            args[0] = {
              ...action,
              data: { ...action.data, self_deaf: true }
            };
          }
        }
      });
    }

    // Directly patch the voice state outgoing
    if (VoiceStateUtils && VoiceStateUtils.updateSelfDeaf) {
      patcher.instead("updateSelfDeaf", VoiceStateUtils, function(args, orig) {
        // Send deaf=true to server regardless of what Discord thinks locally
        orig(true);
      });
    }

    plugin.logger.info("Fake Deafen enabled");
  }

  function disable() {
    if (!isActive) return;
    isActive = false;
    unpatchDeaf?.();
    unpatchDispatch?.();
    unpatchDeaf = null;
    unpatchDispatch = null;
    plugin.logger.info("Fake Deafen disabled");
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
      const { FormSwitch, FormSection, FormText } = bunny.metro.common.components
        || bunny.metro.findByProps("FormSwitch", "FormSection")
        || {};

      const [on, setOn] = React.useState(storage.enabled !== false);

      function toggle(val) {
        storage.enabled = val;
        setOn(val);
        val ? enable() : disable();
      }

      if (!FormSwitch) {
        return React.createElement(bunny.metro.common.components.Text || "Text", null,
          "Fake Deafen: " + (on ? "ON" : "OFF")
        );
      }

      return React.createElement(FormSection, { title: "Fake Deafen" },
        React.createElement(FormSwitch, {
          label: "Fake Deafen",
          subLabel: "Appear deafened to others, still hear everything locally",
          value: on,
          onValueChange: toggle,
        })
      );
    }
  });
})();
