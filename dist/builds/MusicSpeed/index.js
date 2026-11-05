// BlasterZone — MusicSpeed plugin
// Control audio playback rate on all HTMLMediaElement (video/audio) in Discord.
// Shortcuts: Slow (0.85x) | Normal (1x) | Fast (1.15x)
// From ツcore v3.18.0 Music Speed feature — exact same values.

(function() {
  const { plugin, api } = bunny;
  const { patcher, React, ReactNative } = api;
  const { View, Text, TouchableOpacity, StyleSheet } = ReactNative;

  const storage = plugin.createStorage();

  const SPEEDS = {
    SLOW:   { label: "Slow",   rate: 0.85, icon: "🐢" },
    NORMAL: { label: "Normal", rate: 1.00, icon: "▶️" },
    FAST:   { label: "Fast",   rate: 1.15, icon: "⚡" },
  };

  let currentSpeed = "NORMAL";
  let activeElements = new Set();
  let origPlay = null;
  let origSrcSetter = null;

  // ── apply rate to every tracked media element ──────────────────────────
  function applyRate(rate) {
    for (const el of activeElements) {
      try {
        if (!el.paused || el.readyState >= 2) {
          el.playbackRate = rate;
          el.defaultPlaybackRate = rate;
        }
      } catch(_) {}
    }
    // also blast any live elements not yet tracked
    try {
      document.querySelectorAll('audio, video').forEach(el => {
        el.playbackRate = rate;
        el.defaultPlaybackRate = rate;
        activeElements.add(el);
      });
    } catch(_) {}
  }

  // ── hook HTMLMediaElement.play to catch new elements ───────────────────
  function hookMediaElements() {
    if (origPlay) return;
    try {
      origPlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function() {
        const rate = SPEEDS[currentSpeed]?.rate ?? 1;
        try {
          this.playbackRate = rate;
          this.defaultPlaybackRate = rate;
          activeElements.add(this);
          // clean up GC'd refs
          if (activeElements.size > 50) {
            for (const el of activeElements) {
              if (!el.isConnected) activeElements.delete(el);
            }
          }
        } catch(_) {}
        return origPlay.apply(this, arguments);
      };
    } catch(_) {}
  }

  function unhookMediaElements() {
    if (origPlay) {
      try { HTMLMediaElement.prototype.play = origPlay; } catch(_) {}
      origPlay = null;
    }
    activeElements.clear();
  }

  function setSpeed(key) {
    currentSpeed = key;
    storage.set("speed", key);
    applyRate(SPEEDS[key].rate);
  }

  // ── Settings UI ────────────────────────────────────────────────────────
  const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    label: {
      color: "#b5bac1",
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    row: {
      flexDirection: "row",
      gap: 8,
    },
    btn: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: "#2b2d31",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    btnActive: {
      backgroundColor: "#1a3a5c",
      borderColor: "#5865f2",
    },
    btnIcon: {
      fontSize: 22,
      marginBottom: 4,
    },
    btnLabel: {
      color: "#b5bac1",
      fontSize: 13,
      fontWeight: "600",
    },
    btnLabelActive: {
      color: "#ffffff",
    },
    btnRate: {
      color: "#5865f2",
      fontSize: 11,
      marginTop: 2,
    },
    hint: {
      color: "#6d6f78",
      fontSize: 11,
      marginTop: 14,
      textAlign: "center",
    },
  });

  function SettingsComponent() {
    const [speed, setSpeedState] = React.useState(currentSpeed);

    function handlePress(key) {
      setSpeed(key);
      setSpeedState(key);
    }

    return React.createElement(View, { style: styles.container },
      React.createElement(Text, { style: styles.label }, "Playback Speed"),
      React.createElement(View, { style: styles.row },
        Object.entries(SPEEDS).map(([key, s]) =>
          React.createElement(
            TouchableOpacity,
            {
              key,
              style: [styles.btn, speed === key && styles.btnActive],
              onPress: () => handlePress(key),
            },
            React.createElement(Text, { style: styles.btnIcon }, s.icon),
            React.createElement(Text, { style: [styles.btnLabel, speed === key && styles.btnLabelActive] }, s.label),
            React.createElement(Text, { style: styles.btnRate }, s.rate + "x"),
          )
        )
      ),
      React.createElement(Text, { style: styles.hint },
        "Affects all Discord audio and video. Pitch changes with speed."
      )
    );
  }

  // ── plugin lifecycle ───────────────────────────────────────────────────
  definePlugin({
    start() {
      const saved = storage.get("speed");
      if (saved && SPEEDS[saved]) currentSpeed = saved;

      hookMediaElements();
      // apply saved rate immediately to any elements already playing
      applyRate(SPEEDS[currentSpeed].rate);
    },

    stop() {
      unhookMediaElements();
      // reset all tracked elements to 1x on disable
      applyRate(1);
    },

    SettingsComponent,
  });
})();
