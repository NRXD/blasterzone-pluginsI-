(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  plugin.default = definePlugin({
    start() { plugin.logger.info("Copy Emoji Markdown active"); },
    stop() {}
  });
})();
