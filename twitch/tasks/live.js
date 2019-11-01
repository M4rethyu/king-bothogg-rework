exports.run = async (client) => {
	
	const live = await client.twitch.live("king_nidhogg");
	if (live) { // Is live
		if (client.twitch.liveStatus) { // Was live => continued streaming
			//client.log("log", "Erick continued streaming");
		} else { // Wasn't live => started streaming
			client.log("log+", "Erick started streaming");
			if (client.discord.tasks.get("status").ready) client.discord.tasks.get("status").run(client);
		}
	} else { // Isn't live
		
		
		if (client.twitch.liveStatus) { // Was live => stopped streaming
			client.log("log+", "Erick stopped streaming");
			if (client.discord.tasks.get("status").ready) client.discord.tasks.get("status").run(client);
		} else { // Wasn't live => Isn't streaming
			//client.log("log", "Erick isn't streaming");
		}
	}
	client.twitch.liveStatus = live; // Update live status for next time
	
	return;
};

exports.config = {
	"cooldown" : 20,
	"initial" : 10
};

exports.condition = (client) => {
	return true;
};