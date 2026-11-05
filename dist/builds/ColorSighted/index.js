(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const colorBlindIcons = bunny.metro.findByProps("showColorblindIcons");
if (colorBlindIcons) patcher.instead("showColorblindIcons", colorBlindIcons, () => false);
    }} catch(e) {{ plugin.logger.warn("Color Sighted patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
