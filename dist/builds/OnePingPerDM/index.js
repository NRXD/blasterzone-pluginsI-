(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const NotifUtils = bunny.metro.findByProps("playSound","shouldPlayNotificationSound") || bunny.metro.findByProps("playNotificationSound");
const dmCooldowns = new Map();
if (NotifUtils?.playSound) patcher.before("playSound", NotifUtils, (args) => {
  const channelId = args[1];
  if (!channelId) return;
  const now = Date.now();
  if (dmCooldowns.has(channelId) && now - dmCooldowns.get(channelId) < 5000) { args[0] = null; return; }
  dmCooldowns.set(channelId, now);
});
    }} catch(e) {{ plugin.logger.warn("One Ping Per DM patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
