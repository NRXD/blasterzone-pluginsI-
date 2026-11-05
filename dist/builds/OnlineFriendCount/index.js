(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const { React } = bunny.metro.common;
  const RelationshipStore = bunny.metro.findByProps("getFriendIDs", "getRelationshipCount");
  const PresenceStore = bunny.metro.findByProps("getStatus", "getUserPresence");

  plugin.default = definePlugin({
    start() {
      if (!RelationshipStore || !PresenceStore) { plugin.logger.warn("Missing stores"); return; }
      const friends = RelationshipStore.getFriendIDs?.() || [];
      const online = friends.filter(id => {
        const s = PresenceStore.getStatus?.(id);
        return s && s !== "offline" && s !== "invisible";
      });
      plugin.logger.info(`Online friends: ${online.length}/${friends.length}`);
    },
    stop() {}
  });
})();
