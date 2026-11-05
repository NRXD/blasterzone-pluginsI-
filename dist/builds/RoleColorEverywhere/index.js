(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("Role Color Everywhere active"); },
    stop() {}
  });
})();
