(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const FluxDispatcher = bunny.metro.findByProps("dispatch", "subscribe");
  const MessageStore = bunny.metro.findByProps("getMessage", "getMessages");

  const deletedMessages = new Map();
  const editedMessages = new Map();
  let up = null;

  plugin.default = definePlugin({
    start() {
      if (!FluxDispatcher) return;
      up = patcher.before("dispatch", FluxDispatcher, (args) => {
        const action = args[0];
        if (!action) return;

        if (action.type === "MESSAGE_DELETE") {
          const msg = MessageStore?.getMessage?.(action.channelId, action.id);
          if (msg) {
            deletedMessages.set(action.id, { ...msg, deleted: true });
            // Cancel the delete — keep message visible with [deleted] marker
            args[0] = {
              type: "MESSAGE_UPDATE",
              message: {
                ...msg,
                content: "~~" + msg.content + "~~ *(deleted)*",
                edited_timestamp: new Date().toISOString(),
              },
              optimistic: false,
            };
          }
        }

        if (action.type === "MESSAGE_UPDATE" && action.message) {
          const { id, channel_id, content } = action.message;
          const orig = MessageStore?.getMessage?.(channel_id, id);
          if (orig && orig.content !== content) {
            editedMessages.set(id, orig.content);
          }
        }
      });
    },
    stop() {
      up?.();
      deletedMessages.clear();
      editedMessages.clear();
    }
  });
})();
