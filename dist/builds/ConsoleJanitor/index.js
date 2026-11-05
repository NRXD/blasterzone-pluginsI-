(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const origWarn = console.warn, origErr = console.error;
const NOISE = ["ResizeObserver","Maximum update depth","Warning: Each child","Warning: Can't perform"];
console.warn = (...a) => { if (!NOISE.some(n => String(a[0]).includes(n))) origWarn(...a); };
console.error = (...a) => { if (!NOISE.some(n => String(a[0]).includes(n))) origErr(...a); };
    }} catch(e) {{ plugin.logger.warn("Console Janitor patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
