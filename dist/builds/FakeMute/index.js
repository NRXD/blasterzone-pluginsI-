// BlasterZone — Fake Mute plugin
// Appear muted to others while still transmitting audio

(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;

  const storage = plugin.createStorage();

  const MediaEngine = bunny.metro.findByProps("setLocalMute", "setLocalDeaf")
    || bunny.metro.findByProps("setMute", "setDeaf");
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const VoiceStateUtils = bunny.metro.findByProps("updateSelfMute", "updateSelfDeaf");

  let unpatches = [];
  let isActive = false;

  function enable() {
    if (isActive) return;
    isActive = true;

    // Prevent actual local muting — keep mic hot
    if (MediaEngine?.setLocalMute) {
      unpatches.push(patcher.instead("setLocalMute", MediaEngine, function(args, orig) {
        // Don't actually mute locally — keep the mic going
        // But let Discord's UI think we're muted
      }));
    }

    // Spoof outgoing voice state to show muted=true
    if (VoiceStateUtils?.updateSelfMute) {
      unpatches.push(patcher.instead("updateSelfMute", VoiceStateUtils, function(args, orig) {
        orig(true); // Always tell server we're muted
      }));
    }

    // Intercept dispatch to spoof mute state going to gateway
    if (FluxDispatcher) {
      unpatches.push(patcher.before("dispatch", FluxDispatcher, function(args) {
        const action = args[0];
        if (!action) return;

        if (action.type === "AUDIO_TOGGLE_SELF_MUTE") {
          args[0] = { ...action, mute: true };
        }
      }));
    }

    plugin.logger.info("Fake Mute enabled");
  }

  function disable() {
    if (!isActive) return;
    isActive = false;
    unpatches.forEach(u => u?.());
    unpatches = [];
    plugin.logger.info("Fake Mute disabled");
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
      const { FormSwitch, FormSection } = bunny.metro.common.components
        || bunny.metro.findByProps("FormSwitch", "FormSection")
        || {};

      const [on, setOn] = React.useState(storage.enabled !== false);

      function toggle(val) {
        storage.enabled = val;
        setOn(val);
        val ? enable() : disable();
      }

      if (!FormSwitch) return null;

      return React.createElement(FormSection, { title: "Fake Mute" },
        React.createElement(FormSwitch, {
          label: "Fake Mute",
          subLabel: "Appear muted to others but keep transmitting audio",
          value: on,
          onValueChange: toggle,
        })
      );
    }
  });
})();
