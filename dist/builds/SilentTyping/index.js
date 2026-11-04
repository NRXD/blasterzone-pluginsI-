(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const TypingUtils = bunny.metro.findByProps("startTyping", "stopTyping");
  let up = null;
  plugin.default = definePlugin({
    start() {
      if (TypingUtils?.startTyping) {
        up = patcher.instead("startTyping", TypingUtils, () => {});
      } else if (FluxDispatcher) {
        up = patcher.before("dispatch", FluxDispatcher, (args) => {
          if (args[0]?.type === "TYPING_START_LOCAL") args[0] = null;
        });
      }
    },
    stop() { up?.(); }
  });
})();
