(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("Muted Servers Activity Badge active"); },
    stop() {}
  });
})();
