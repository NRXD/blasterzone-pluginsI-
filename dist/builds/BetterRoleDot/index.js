(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("Better Role Dot active"); },
    stop() {}
  });
})();
