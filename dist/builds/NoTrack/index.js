(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const FluxD4 = bunny.metro.findByProps("dispatch","subscribe");
const TRACK_EVENTS = ["TRACK","SCIENCE","METRICS","ANALYTICS","IDENTIFY","PAGE","CLICK"];
if (FluxD4) patcher.before("dispatch", FluxD4, (args) => {
  if (TRACK_EVENTS.includes(args[0]?.type)) args[0] = null;
});
// Also block outgoing analytics requests
const AnalyticsUtils = bunny.metro.findByProps("track","identify","page") || bunny.metro.findByProps("AnalyticsActionHandlers");
if (AnalyticsUtils?.track) patcher.instead("track", AnalyticsUtils, () => {});
    }} catch(e) {{ plugin.logger.warn("No Track patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
