(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("Auto DND While Playing active"); },
    stop() {}
  });
})();
