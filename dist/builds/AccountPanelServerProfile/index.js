(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("Account Panel Server Profile active"); },
    stop() {}
  });
})();
