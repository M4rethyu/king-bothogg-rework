exports.run = async (client) => {
	const guild = client.discord.guilds.find(g => g.id == "159712694671245312");
	//const guild = client.discord.guilds.find(g => g.id == "437644282933936130");
	const time = (new Date()).getTime();
	
	promises = [];
	
	for (var channel of guild.channels.filter(c => c.type == "text")) {
		promises.push(channel[1].fetchMessages());
	}
	
	const promise = Promise.all(promises.map(p => p.catch(e => null)));
	
	const arr = await promise;
	
	var ids = [];
	arr.forEach(c => {
		if (c) {
			ids = ids.concat(c.filter(m => time - m.createdTimestamp < 12 * 3600 * 1000).map(m => m.author.id));
		}
	});
	
	ids = ids.filter(e => !(client.discord.consoleChannel().members.keyArray().includes(e))); // Filter out mods
	
	if ((typeof client.discord.stalked) == "undefined") {
		client.discord.stalked = [];
	}
	
	if (client.discord.stalked.length > 0) {
		client.discord.stalked.shift();
	}
	
	ids = ids.filter(e => !(client.discord.stalked.includes(e))); // Filter out already stalked people
	
	while (client.discord.stalked.length < 6 && ids.length > 0) {
		const random = Math.floor(Math.random() * ids.length);
		const id = ids.splice(random, 1)[0];
		client.discord.stalked.push(id);
		ids = ids.filter(i => i != id);
	}
	
	client.log("log", "now stalking " + client.discord.stalked.map(id => client.discord.users.find(u => u.id == id).tag).join(", "));
	return;
};

exports.config = {
	"cooldown" : 4 * 3600,
	"initial" : 5
};

exports.condition = (client) => {
	return false;
};