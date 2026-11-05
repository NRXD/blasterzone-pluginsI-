(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const MessageUtils4 = bunny.metro.findByProps("sendMessage","editMessage");
const storage4 = plugin.createStorage();
const rules = storage4.rules || [];
if (MessageUtils4?.sendMessage && rules.length) {
  patcher.before("sendMessage", MessageUtils4, (args) => {
    let content = args[1]?.content || "";
    rules.forEach(r => { if (r.from && r.to) content = content.replaceAll(r.from, r.to); });
    if (args[1]) args[1].content = content;
  });
}
    }} catch(e) {{ plugin.logger.warn("Text Replace patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
