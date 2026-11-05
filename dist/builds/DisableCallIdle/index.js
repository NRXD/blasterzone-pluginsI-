(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const VoiceIdle = bunny.metro.findByProps("setIdleTimeout","clearIdleTimeout") || bunny.metro.findByProps("callIdleTimeout");
if (VoiceIdle?.setIdleTimeout) patcher.instead("setIdleTimeout", VoiceIdle, () => {});
    }} catch(e) {{ plugin.logger.warn("Disable Call Idle patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
