(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const MessageUtils = bunny.metro.findByProps("uploadFiles", "sendMessage");
if (MessageUtils?.uploadFiles) patcher.before("uploadFiles", MessageUtils, (args) => {
  const files = args[0]?.uploads;
  if (!Array.isArray(files)) return;
  files.forEach(f => { if (f.filename) f.filename = Math.random().toString(36).slice(2) + "." + f.filename.split(".").pop(); });
});
    }} catch(e) {{ plugin.logger.warn("Anonymise File Names patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
