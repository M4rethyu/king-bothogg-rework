exports.run = async (client) => {
	client.log("log", "awarding chatters a nidcoin");
	
	const chatters = (await client.twitch.viewerlist("king_nidhogg")).chatters;
	var list = chatters.broadcaster.concat(chatters.vips, chatters.moderators, chatters.staff, chatters.admins, chatters.global_mods, chatters.viewers);
	
	list.forEach(name => {
		if (client.twitch.config.bots.includes(name)) return;
		const amount = client.currency(name, 1);
	});
};

exports.config = {
	"cooldown" : 60,
	"initial" : 5,
	
};

exports.condition = (client) => {
	return client.twitch.liveStatus;
};