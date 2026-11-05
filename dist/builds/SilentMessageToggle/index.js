(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const MessageUtils3 = bunny.metro.findByProps("sendMessage","createBot");
const storage3 = plugin.createStorage();
if (MessageUtils3?.sendMessage && storage3.silent) patcher.before("sendMessage", MessageUtils3, (args) => {
  const content = args[1]?.content;
  if (content && !content.startsWith("@silent")) args[1].content = "@silent " + content;
});
    }} catch(e) {{ plugin.logger.warn("Silent Message Toggle patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
