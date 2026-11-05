(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const EmojiStore = bunny.metro.findByProps("getEmojiUnavailableReason", "getCustomEmojiById")
    || bunny.metro.findByProps("getUsableCustomEmojis");
  const MessageUtils = bunny.metro.findByProps("sendMessage", "editMessage");

  let up = null;
  plugin.default = definePlugin({
    start() {
      if (!MessageUtils?.sendMessage) return;
      up = patcher.before("sendMessage", MessageUtils, (args) => {
        const msg = args[1];
        if (!msg?.content) return;
        // Replace custom emoji syntax with image links for fake nitro
        msg.content = msg.content.replace(/<(a?):(\w+):(\d+)>/g, (match, animated, name, id) => {
          const ext = animated ? "gif" : "webp";
          return `https://cdn.discordapp.com/emojis/${id}.${ext}?size=48`;
        });
      });
    },
    stop() { up?.(); }
  });
})();
