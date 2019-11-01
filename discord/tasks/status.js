exports.run = async (client) => {
	const liveStati = [
		(() => client.discord.user.setPresence({
			game: {
				name: "Erick's stream",
				type: "WATCHING"
			}
		})),
		(() => client.discord.user.setPresence({
			game: {
				name: "Erick's stream",
				type: "LISTENING"
			}
		}))
	];
	
	const deadStati = [
		(() => client.discord.user.setPresence({
			game: {
				name: "you closely",
				type: "WATCHING"
			}
		})),
		(() => client.discord.user.setPresence({
			game: {
				name: "AI debates",
				type: "LISTENING"
			}
		})),
		(() => client.discord.user.setPresence({
			game: {
				name: "the voices",
				type: "LISTENING"
			}
		})),
		(() => client.discord.user.setPresence({
			game: {
				name: "apocalyptic movies",
				type: "WATCHING"
			}
		})),
		(() => client.discord.user.setPresence({
			game: {
				name: "Terminator",
				type: "WATCHING"
			}
		})),
		(() => client.discord.user.setPresence({
			game: {
				name: "god",
				type: "PLAYING"
			}
		}))
	];
	
	if (client.twitch.liveStatus) {
		var i = Math.floor(Math.random()*liveStati.length);
		liveStati[i]();
	} else {
		var i = Math.floor(Math.random()*deadStati.length);
		deadStati[i]();
	}
	
	return;
};

exports.config = {
	"cooldown" : 50,
	"initial" : 10
};

exports.condition = (client) => {
	return true;
};