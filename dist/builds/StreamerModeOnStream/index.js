(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("Streamer Mode On Stream active"); },
    stop() {}
  });
})();
