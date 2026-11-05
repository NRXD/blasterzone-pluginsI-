(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("Voice Chat Double Click active"); },
    stop() {}
  });
})();
