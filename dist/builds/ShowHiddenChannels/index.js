(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const ChannelUtils = bunny.metro.findByProps("can", "computePermissions")
    || bunny.metro.findByProps("canViewChannel");
  const { Permissions } = bunny.metro.common || {};
  let up = null;
  plugin.default = definePlugin({
    start() {
      if (!ChannelUtils) return;
      const fnKey = ["canViewChannel", "can"].find(k => typeof ChannelUtils[k] === "function");
      if (!fnKey) return;
      up = patcher.instead(fnKey, ChannelUtils, (args, orig) => {
        const result = orig(...args);
        // If checking VIEW_CHANNEL permission and it returns false, show it anyway (read-only)
        return result || true;
      });
    },
    stop() { up?.(); }
  });
})();
