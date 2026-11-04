(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  let up = null;
  plugin.default = definePlugin({
    start() {
      if (!FluxDispatcher) return;
      up = patcher.before("dispatch", FluxDispatcher, (args) => {
        if (args[0]?.type === "TYPING_START") { args[0] = null; }
      });
    },
    stop() { up?.(); }
  });
})();
