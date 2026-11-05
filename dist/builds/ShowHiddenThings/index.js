(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const ChannelUtils2 = bunny.metro.findByProps("can","computePermissions");
if (ChannelUtils2?.can) patcher.instead("can", ChannelUtils2, (args, orig) => {
  const result = orig(...args);
  return result || false; // expose hidden without granting access
});
    }} catch(e) {{ plugin.logger.warn("Show Hidden Things patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
