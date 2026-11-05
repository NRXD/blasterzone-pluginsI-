(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const PresenceStore2 = bunny.metro.findByProps("getStatus","getUserPresence") || bunny.metro.findByProps("getPlatform");
// Injects platform icon (desktop/mobile/web) next to user status
    }} catch(e) {{ plugin.logger.warn("Platform Indicators patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
