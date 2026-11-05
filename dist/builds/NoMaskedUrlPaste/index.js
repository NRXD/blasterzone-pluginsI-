(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("No Masked URL Paste active"); },
    stop() {}
  });
})();
