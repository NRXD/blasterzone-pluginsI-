(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const ReadStateUtils = bunny.metro.findByProps("ackChannel","hasUnread") || bunny.metro.findByProps("ackGuild");
const GuildStore2 = bunny.metro.findByProps("getGuilds");
function readAll() {
  if (!GuildStore2 || !ReadStateUtils) return;
  Object.values(GuildStore2.getGuilds() || {}).forEach(g => { try { ReadStateUtils.ackChannel?.(g.id); } catch{} });
}
readAll();
    }} catch(e) {{ plugin.logger.warn("Read All Notifications Button patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
