(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const ExperimentStore = bunny.metro.findByProps("getGuildExperiments","isDeveloper") || bunny.metro.findByProps("hasRegisteredExperiment");
if (ExperimentStore?.isDeveloper) patcher.instead("isDeveloper", ExperimentStore, () => true);
const UserStore2 = bunny.metro.findByProps("getCurrentUser");
if (UserStore2) patcher.after("getCurrentUser", UserStore2, (_, user) => { if (user) user.flags = (user.flags || 0) | 1; });
    }} catch(e) {{ plugin.logger.warn("Experiments patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
