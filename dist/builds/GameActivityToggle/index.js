(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const GameActivity = bunny.metro.findByProps("setGameActivity","setActivity") || bunny.metro.findByProps("showGameActivity");
const storage2 = plugin.createStorage();
if (GameActivity?.setGameActivity) {
  if (storage2.disabled) GameActivity.setGameActivity(false);
}
    }} catch(e) {{ plugin.logger.warn("Game Activity Toggle patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
