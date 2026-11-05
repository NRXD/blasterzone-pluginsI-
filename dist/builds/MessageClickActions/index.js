(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const FluxD2 = bunny.metro.findByProps("dispatch","subscribe");
// Gesture handling — double-tap to reply via dispatch
if (FluxD2) patcher.before("dispatch", FluxD2, (args) => {
  if (args[0]?.type === "MESSAGE_DOUBLE_CLICK") {
    FluxD2.dispatch({ type: "CREATE_PENDING_REPLY", message: args[0].message, channel: args[0].channel, shouldMention: true });
  }
});
    }} catch(e) {{ plugin.logger.warn("Message Click Actions patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
