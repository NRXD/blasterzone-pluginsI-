(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const MessageAccessories = bunny.metro.findByProps("renderEmbeds") || bunny.metro.findByDisplayName?.("MessageAccessories");
// Prevents grid grouping of multiple images in one message
    }} catch(e) {{ plugin.logger.warn("No Mosaic patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
