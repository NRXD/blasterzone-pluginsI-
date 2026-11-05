(function() {{
  const {{ plugin, api }} = bunny;
  const {{ patcher }} = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const storage = plugin.createStorage();
  let unpatches = [];
  function start() {{
    try {{
      const { React } = bunny.metro.common;
const ClientInfo = bunny.metro.findByProps("getClientInfo","getVersionString") || bunny.metro.findByProps("clientVersion");
const DeviceModule = bunny.metro.findByProps("getDeviceInfo") || bunny.metro.findByProps("brand","model");
const info = {
  platform: "iOS",
  device: DeviceModule?.brand || DeviceModule?.model || "iPhone",
  os: "iOS " + (DeviceModule?.systemVersion || "17"),
  appVersion: ClientInfo?.getVersionString?.() || "unknown",
};
plugin.logger.info("Device: " + JSON.stringify(info));
// Store for other plugins to read
globalThis.__BZ_DEVICE__ = info;
    }} catch(e) {{ plugin.logger.warn("Device Info patch failed:", e.message); }}
  }}
  plugin.default = definePlugin({{
    start() {{ start(); }},
    stop() {{ unpatches.forEach(u => u?.()); unpatches = []; }}
  }});
}})();
