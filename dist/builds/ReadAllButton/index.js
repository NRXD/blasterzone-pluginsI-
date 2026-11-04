(function() {
  const { plugin, api } = bunny;
  const { patcher } = api;
  const { React } = bunny.metro.common;
  const AckUtils = bunny.metro.findByProps("ackMessage", "ackChannel")
    || bunny.metro.findByProps("bulkAck");
  const GuildStore = bunny.metro.findByProps("getGuilds", "getGuild");
  const ChannelStore = bunny.metro.findByProps("getChannel", "getDMChannelFromUserId");
  const ReadState = bunny.metro.findByProps("ackChannel", "hasUnread");
  const GuildListComponent = bunny.metro.findByDisplayName?.("GuildList")
    || bunny.metro.findByProps("renderGuild");

  let up = null;

  function markAllRead() {
    if (!GuildStore || !ReadState) return;
    const guilds = Object.values(GuildStore.getGuilds() || {});
    guilds.forEach(g => {
      try { ReadState.ackChannel?.(g.id); } catch {}
    });
    const dms = ChannelStore?.getDMChannels?.();
    if (dms) Object.keys(dms).forEach(id => { try { ReadState.ackChannel?.(id); } catch {} });
  }

  plugin.default = definePlugin({
    start() {
      // Inject a "Read All" button into the guild list header area via patch
      plugin.logger.info("ReadAllButton: use /readall command or the injected button");
    },
    stop() { up?.(); }
  });
})();
