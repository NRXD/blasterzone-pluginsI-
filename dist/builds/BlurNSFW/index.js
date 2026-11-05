(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const ImageComp = bunny.metro.findByProps("renderImage") || bunny.metro.findByDisplayName?.("Image");
// Apply blur overlay to NSFW channel images — toggled by tap
    }} catch(e) {{ plugin.logger.warn("Blur NSFW patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
