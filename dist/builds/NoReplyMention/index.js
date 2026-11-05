(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const MessageUtils2 = bunny.metro.findByProps("sendMessage","createBot");
if (MessageUtils2?.sendMessage) patcher.before("sendMessage", MessageUtils2, (args) => {
  const msg = args[1];
  if (msg?.messageReference) msg.allowedMentions = { ...(msg.allowedMentions || {}), repliedUser: false };
});
    }} catch(e) {{ plugin.logger.warn("No Reply Mention patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
