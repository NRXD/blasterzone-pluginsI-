(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("Don't Round My Timestamps active"); },
    stop() {}
  });
})();
