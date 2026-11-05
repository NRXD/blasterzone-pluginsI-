(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      patcher.before("dispatch", FluxDispatcher, (args) => {
  if (args[0]?.type === "DOMAIN_MIGRATION_WARNING" || args[0]?.type === "TRUST_DOMAIN_WARNING") args[0] = null;
});
const LinkUtils = bunny.metro.findByProps("handleClick", "openExternal") || bunny.metro.findByProps("isTrustedDomain");
if (LinkUtils?.isTrustedDomain) patcher.instead("isTrustedDomain", LinkUtils, () => true);
    }} catch(e) {{ plugin.logger.warn("Always Trust patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
