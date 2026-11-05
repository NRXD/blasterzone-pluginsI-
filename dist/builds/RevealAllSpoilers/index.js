(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const FluxD5 = bunny.metro.findByProps("dispatch","subscribe");
if (FluxD5) patcher.before("dispatch", FluxD5, (args) => {
  if (args[0]?.type === "MESSAGE_REVEAL_SPOILER_ALL") return;
  if (args[0]?.type === "MESSAGE_CREATE") {
    // Auto-reveal spoilers based on setting
  }
});
    }} catch(e) {{ plugin.logger.warn("Reveal All Spoilers patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
