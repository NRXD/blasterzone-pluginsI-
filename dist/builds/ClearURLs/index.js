(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");

  const TRACKERS = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","fbclid","gclid","ref","referrer","_ga","mc_cid","mc_eid","yclid","ymclid","si","igshid","source"];

  function cleanUrl(url) {
    try {
      const u = new URL(url);
      TRACKERS.forEach(p => u.searchParams.delete(p));
      return u.toString();
    } catch { return url; }
  }

  function cleanText(text) {
    if (!text) return text;
    return text.replace(/https?:\/\/\S+/g, (url) => cleanUrl(url));
  }

  let up = null;
  plugin.default = definePlugin({
    start() {
      if (!FluxDispatcher) return;
      up = patcher.before("dispatch", FluxDispatcher, (args) => {
        const action = args[0];
        if (!action) return;
        if ((action.type === "MESSAGE_CREATE" || action.type === "MESSAGE_UPDATE") && action.message?.content) {
          action.message = { ...action.message, content: cleanText(action.message.content) };
        }
      });
    },
    stop() { up?.(); }
  });
})();
