// BlasterZone — Gain Boost plugin (ツcore v3.17.0 audio engine)
// Boosts mic gain via AudioContext — capped at 700% (GOD tier)

(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;

  const storage = plugin.createStorage();

  const PRESETS = {
    OFF:     { label: "Off",      mult: 1.0,  pct: "100%" },
    MILD:    { label: "Mild",     mult: 2.0,  pct: "200%" },
    LOUD:    { label: "Loud",     mult: 4.5,  pct: "450%" },
    MAX:     { label: "Max",      mult: 6.0,  pct: "600%" },
    GOD:     { label: "God ⚡",  mult: 7.0,  pct: "700%" },
  };

  let currentPreset = "OFF";
  let gainNode = null;
  let audioCtx = null;
  let sourceNode = null;
  let destNode = null;
  let unpatchGUM = null;

  function getPreset() {
    return PRESETS[currentPreset] || PRESETS.OFF;
  }

  function setGain(mult) {
    if (gainNode) {
      gainNode.gain.setTargetAtTime(mult, audioCtx.currentTime, 0.01);
    }
  }

  function hookGetUserMedia() {
    if (!navigator?.mediaDevices?.getUserMedia) return;

    const orig = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = async function(constraints) {
      const stream = await orig(constraints);

      // Only process audio streams
      const audioTracks = stream.getAudioTracks();
      if (!audioTracks.length) return stream;

      try {
        if (!audioCtx || audioCtx.state === "closed") {
          audioCtx = new AudioContext();
        }

        // Build the gain graph: source → gain → destination
        sourceNode = audioCtx.createMediaStreamSource(stream);
        gainNode = audioCtx.createGain();
        destNode = audioCtx.createMediaStreamDestination();

        gainNode.gain.value = getPreset().mult;

        sourceNode.connect(gainNode);
        gainNode.connect(destNode);

        // Replace the original audio track with our gained output
        const gainedStream = new MediaStream([
          ...stream.getVideoTracks(),
          ...destNode.stream.getAudioTracks()
        ]);

        plugin.logger.info(`Gain hooked: ${getPreset().label} (${getPreset().pct})`);
        return gainedStream;
      } catch (e) {
        plugin.logger.warn("Gain hook failed:", e.message);
        return stream; // fallback to original
      }
    };

    unpatchGUM = () => {
      navigator.mediaDevices.getUserMedia = orig;
    };
  }

  function applyPreset(preset) {
    currentPreset = preset;
    storage.preset = preset;
    const p = getPreset();
    setGain(p.mult);
    plugin.logger.info(`Preset: ${p.label} (${p.pct})`);
  }

  plugin.default = definePlugin({
    start() {
      currentPreset = storage.preset || "OFF";
      hookGetUserMedia();
    },
    stop() {
      unpatchGUM?.();
      unpatchGUM = null;
      if (audioCtx) {
        audioCtx.close().catch(() => {});
        audioCtx = null;
        gainNode = null;
        sourceNode = null;
        destNode = null;
      }
    },
    SettingsComponent() {
      const { React } = bunny.metro.common;
      const Forms = bunny.metro.common.components
        || bunny.metro.findByProps("FormSection", "FormSwitch")
        || {};
      const { FormSection, FormText, Pressable, Text } = Forms;

      const [preset, setPreset] = React.useState(currentPreset);

      function pick(key) {
        applyPreset(key);
        setPreset(key);
      }

      const presetKeys = Object.keys(PRESETS);

      // Fallback if components unavailable
      if (!FormSection) {
        return React.createElement("View", { style: { padding: 16 } },
          presetKeys.map(k =>
            React.createElement("Text", {
              key: k,
              onPress: () => pick(k),
              style: { padding: 8, color: preset === k ? "#5865F2" : "#fff" }
            }, PRESETS[k].label + " " + PRESETS[k].pct)
          )
        );
      }

      return React.createElement(FormSection, { title: "Gain Preset" },
        presetKeys.map(k =>
          React.createElement(Pressable || "TouchableOpacity", {
            key: k,
            onPress: () => pick(k),
            style: {
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: preset === k ? "#5865F2" : "transparent",
              borderRadius: 8,
              marginVertical: 2,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }
          },
            React.createElement(Text || "Text", {
              style: { color: "#fff", fontWeight: preset === k ? "700" : "400", fontSize: 15 }
            }, PRESETS[k].label),
            React.createElement(Text || "Text", {
              style: { color: preset === k ? "#fff" : "#888", fontSize: 13 }
            }, PRESETS[k].pct)
          )
        )
      );
    }
  });
})();
