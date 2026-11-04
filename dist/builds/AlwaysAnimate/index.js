(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const AnimationUtils = bunny.metro.findByProps("isAnimated", "getDefaultAvatarURL")
    || bunny.metro.findByProps("canAnimate");
  let up = null;
  plugin.default = definePlugin({
    start() {
      if (!AnimationUtils) return;
      const key = ["isAnimated", "canAnimate"].find(k => typeof AnimationUtils[k] === "function");
      if (!key) return;
      up = patcher.instead(key, AnimationUtils, () => true);
    },
    stop() { up?.(); }
  });
})();
