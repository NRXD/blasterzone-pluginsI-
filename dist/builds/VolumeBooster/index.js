(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const AudioStore = bunny.metro.findByProps("setLocalVolume","getLocalVolume");
if (AudioStore?.setLocalVolume) patcher.instead("setLocalVolume", AudioStore, (args, orig) => {
  const vol = Math.min(args[0], 600); // raise cap to 600%
  orig(vol, args[1]);
});
    }} catch(e) {{ plugin.logger.warn("Volume Booster patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
