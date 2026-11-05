(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const FluxD = bunny.metro.findByProps("dispatch","subscribe");
const storage = plugin.createStorage();
if (FluxD && storage.name) {
  setTimeout(() => {
    FluxD.dispatch({ type: "LOCAL_ACTIVITY_UPDATE", activity: {
      name: storage.name || "BlasterZone", details: storage.details || "", state: storage.state || "",
      type: 0, timestamps: storage.showTime ? { start: Date.now() } : undefined,
      application_id: "1045800378228281345"
    }});
  }, 3000);
}
    }} catch(e) {{ plugin.logger.warn("Custom RPC patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
