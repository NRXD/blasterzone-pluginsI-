(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const ThemeManager = bunny.metro.findByProps("updateTheme", "setTheme")
    || bunny.metro.findByProps("getCurrentTheme");
  const SemanticColors = bunny.metro.findByProps("BG_BASE_PRIMARY", "BACKGROUND_PRIMARY");
  let overrides = null;
  plugin.default = definePlugin({
    start() {
      if (!SemanticColors) { plugin.logger.warn("Colors not found"); return; }
      overrides = patcher.after("resolveSemanticColor", SemanticColors, (args, res) => {
        if (typeof res === "string" && (res === "#313338" || res === "#2b2d31" || res === "#1e1f22")) return "#000000";
        return res;
      });
    },
    stop() { overrides?.(); }
  });
})();
