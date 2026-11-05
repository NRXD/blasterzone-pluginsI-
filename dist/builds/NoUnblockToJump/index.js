(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("No Unblock To Jump active"); },
    stop() {}
  });
})();
