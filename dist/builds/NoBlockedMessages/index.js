(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const FluxD3 = bunny.metro.findByProps("dispatch","subscribe");
if (FluxD3) patcher.before("dispatch", FluxD3, (args) => {
  if (args[0]?.type === "MESSAGE_CREATE" && args[0]?.message?.blocked) args[0] = null;
});
    }} catch(e) {{ plugin.logger.warn("No Blocked Messages patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
