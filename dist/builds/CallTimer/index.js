(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      let startTime = null;
const FluxD = bunny.metro.findByProps("dispatch","subscribe");
if (FluxD) {
  patcher.before("dispatch", FluxD, (args) => {
    if (args[0]?.type === "VOICE_CHANNEL_SELECT" && args[0]?.channelId) startTime = Date.now();
    if (args[0]?.type === "VOICE_CHANNEL_SELECT" && !args[0]?.channelId) startTime = null;
  });
}
    }} catch(e) {{ plugin.logger.warn("Call Timer patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
