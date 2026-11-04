(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const { React } = bunny.metro.common;
  const ImageComponent = bunny.metro.findByProps("MediaAttachment")
    || bunny.metro.findByDisplayName?.("Image")
    || bunny.metro.findByProps("renderImage");
  let up = null;
  plugin.default = definePlugin({
    start() {
      // Patch image component to add zoom gesture
      if (!ImageComponent) { plugin.logger.warn("Image component not found"); return; }
      const key = Object.keys(ImageComponent).find(k => typeof ImageComponent[k] === "function");
      if (!key) return;
      up = patcher.after(key, ImageComponent, (args, res) => {
        if (!res?.props) return;
        // Add zoom hint styling
        res.props.style = [...(Array.isArray(res.props.style) ? res.props.style : [res.props.style || {}]), { transform: [{ scale: 1 }] }];
      });
    },
    stop() { up?.(); }
  });
})();
