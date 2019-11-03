const fetch = require("node-fetch");

module.exports = (client) => {
	// Functions bound to client
	client.checkHosted = () =>
	{
		return (process.env.PROJECT_DOMAIN == "m4rethyu-king-bothogg-rework");
	}
	
	client.log = (type, message) =>
	{
		if ((typeof message) != "string") client.log("error", "can't log message of type " + typeof message);
		if ((typeof type) != "string") client.log("error", "can't log type of type " + typeof type);
		
		if (type === "twitch") {
			console.log("[TWITCH]:  " + message);
			if (client.discord.config.useLog) client.discord.logChannel().send("[TWITCH]: " + message.replace(/@[a-zA-Z0-9]{1,}/g, (s => s.replace("@","@​"))));
		} else if (type === "discord") {
			console.log("[DSCRD]: " + message);
		} else if (type === "log") {
			console.log("[LOG]:   " + message);
		} else if (type === "log+") {
			console.log("[LOG+]:  " + message);
			if (client.discord.config.useLog) client.discord.logChannel().send("[LOG]: " + message);
		} else if (type === "console") {
			if (client.discord.config.consoleOutput) {
				console.log("[CONSL]: " + message);
				client.discord.consoleChannel().send("[OUTPUT]: " + message);
			}
		} else if (type === "warn") {
			console.log("[WARN]:  " + message);
		} else if (type === "error") {
			console.log("[ERROR]: " + message);
		} else {
			client.log("error", "unknown logging type: '" + type + "'");
		}
	}
	
	
	client.currency = (name, amount) => 
	{
		var currentAmount = client.persist("currency.amount." + name);
		if ((typeof currentAmount) != "number" || currentAmount == NaN) {
			client.persist("currency.amount." + name, 0);
			currentAmount = 0;
		}
		
		if ((typeof amount) == "number") {
			client.persist("currency.amount." + name, Math.max(currentAmount + amount, 0));
			currentAmount += Math.max(currentAmount + amount, 0);
		}
		
		return client.persist("currency.amount." + name);
	}
	
	client.getSummonerAccounts = () =>
	{
		var promises = [];
		for (const name of client.erick.summonerNames) {
			promises.push(
				fetch("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + process.env.LEAGUE_TOKEN)
					.then(response => response.json())
			)
		}
		
		const promise = Promise.all(promises.map(p => p.catch(e => e)))
			.then(results => {
				return results.filter(o => (o.id != undefined && o.accountId != undefined && o.puuid != undefined && o.name != undefined && o.profileIconId != undefined && o.revisionDate != undefined && o.summonerLevel != undefined));
			})
			.catch(e => client.log("error", e));
		
		return promise;
	}
	
	client.getSummonerRunes = () =>
	{
		var promises = [];
		var online = [];
		var offline = [];
			
		for (const summoner of client.erick.summonerAccounts) {
			promises.push(fetch("https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + summoner.id + "?api_key=" + process.env.LEAGUE_TOKEN)
				.then(response => response.json())
				.then((game) => {
				
				if (game.status != undefined) {
					offline.push(summoner.name);
					return undefined;
				}
				
				// Extract rune IDs from game
				const part = game.participants.filter(s => s.summonerName == summoner.name)[0];
				const perks = part.perks;
				const mainTree = client.runeNames.filter(t => t.id == perks.perkStyle)[0];
				
				const scndTree = client.runeNames.filter(t => t.id == perks.perkSubStyle)[0];
				
				const main0 = mainTree.slots[0].runes.filter(t => t.id == perks.perkIds[0])[0];
				const main1 = mainTree.slots[1].runes.filter(t => t.id == perks.perkIds[1])[0];
				const main2 = mainTree.slots[2].runes.filter(t => t.id == perks.perkIds[2])[0];
				const main3 = mainTree.slots[3].runes.filter(t => t.id == perks.perkIds[3])[0];
				
				const slots = scndTree.slots[1].runes.concat(scndTree.slots[2].runes, scndTree.slots[3].runes);
				
				const scnd0 = slots.filter(t => t.id == perks.perkIds[4])[0];
				const scnd1 = slots.filter(t => t.id == perks.perkIds[5])[0];
				
				const stat0 = client.runeNames.runeShards[perks.perkIds[6]];
				const stat1 = client.runeNames.runeShards[perks.perkIds[7]];
				const stat2 = client.runeNames.runeShards[perks.perkIds[8]];
				
				// Pack runes neatly
				const runes = {
					"accName" : summoner.name,
					"mainTree" : mainTree.name,
					"mainRunes" : [main0.name, main1.name, main2.name, main3.name],
					"scndTree" : scndTree.name,
					"scndRunes" : [scnd0.name, scnd1.name],
					"statRunes" : [stat0, stat1, stat2]
				}
				
				online.push(summoner.name);
				return runes;
			},(err) => {
				client.log("error", err);
				return undefined;
			}));
		}
		
		const promise = Promise.all(promises.map(p => p.catch(e => e)))
			.then(results => {
				client.log("log", "Getting Runes: Online: " + online.join(", ") + " | Offline: " + offline.join(", "))
				return results.filter(o => o != undefined);
			})
			.catch(e => console.log(e));
		
		return promise;
	}
	
	client.runesToMessage = () =>
	{
		var string;
		if (client.erick.summonerRunes.length > 0) {
			const runes = client.erick.summonerRunes[0];
			string =	runes.accName + "'s runes are " + 
						"Primary: " + runes.mainTree + "[" + runes.mainRunes[0] + " > " + runes.mainRunes[1] + " > " + runes.mainRunes[2] + " > " + runes.mainRunes[3] + "], " +
						"Secondary: " + runes.scndTree + "[" + runes.scndRunes[0] + " > " + runes.scndRunes[1] + "], " +
						"Rune Shards: [" + runes.statRunes[0] + " > " + runes.statRunes[1] + " > " + runes.statRunes[2] + "]";
		} else {
			string = "Can't find active game. You can look at Erick's op.gg to see the runes of past games (accounts in twitch description)";
		}
		
		return string;
	}
	
	client.currentAccount = () =>
	{
		var string;
		if (client.erick.summonerRunes.length > 0) {
			const runes = client.erick.summonerRunes[0];
			string =	"Erick is currently playing on https://na.op.gg/summoner/userName=" + runes.accName + ". The other accounts are in the twitch description or here: https://bit.ly/2VYs6R6";
		} else {
			string = "You can find the links to Erick's accounts in the twitch description or here: https://bit.ly/2VYs6R6";
		}
		
		return string;
	}
	
	// Functions bound to client.twitch
	client.twitch.linkSocialMedia = (channel) =>
	{
		client.log("log", "linking social media in " + channel + "'s chat");
		client.twitch.say(channel, client.answers.social);
	}
	
	client.twitch.viewerlist = (name) => {
		client.log("log", "getting viewlist");
		const list = fetch("http://tmi.twitch.tv/group/user/" + name + "/chatters")
			.then(res => res.json());
		return list;
	}
	
	client.twitch.live = async (name) => {
		const streams = await fetch("https://api.twitch.tv/kraken/streams/?oauth_token=" + process.env.TWITCH_TOKEN + "&channel=" + name + "&stream_type=live")
			.then(res => res.json());
		const live = (streams._total == 1);
		return live;
	}
	
	client.twitch.getCooldown = (functions, channel, username) =>
	{
		if ((typeof functions.config.cooldown) == "number") { // Command has a cooldown
			var sharedCooldown = functions.config.sharedCooldown;
			if ((typeof sharedCooldown) == "undefined") sharedCooldown = true;
			if (sharedCooldown) { // Command shares cooldown between all users
				return functions.onCooldown[channel];
			} else { // Command starts individual cooldown for each user
				if (!functions.onCooldown[channel]) functions.onCooldown[channel] = {};
				return functions.onCooldown[channel][username];
			}
		}
	}
	
	client.twitch.setCooldown = (functions, channel, username) =>
	{
		if ((typeof functions.config.cooldown) == "number") { // Command has a cooldown
			var sharedCooldown = functions.config.sharedCooldown;
			if ((typeof sharedCooldown) == "undefined") sharedCooldown = true;
			if (sharedCooldown) { // Command shares cooldown between all users
				functions.onCooldown[channel] = true;
				setTimeout(function(){ functions.onCooldown[channel] = false; }, functions.config.cooldown * 1000);
			} else { // Command starts individual cooldown for each user
				if (!functions.onCooldown[channel]) functions.onCooldown[channel] = {};
				functions.onCooldown[channel][username] = true;
				setTimeout(function(){ functions.onCooldown[channel][username] = false; }, functions.config.cooldown * 1000);
			}
		}
	}
	
	
	// Functions bound to client.league
	client.league.getCurrentRunes = () =>
	{
		
	}
	
	// Functions bound to client.persist
	client.persist.twitchCommandTotal = (name) =>
	{
		if ((typeof name) != "string") return false;
		
		const map = client.persist("twitch.commands." + name);
		if (map == undefined) return false;
		
		var sum = 0;
		const names = Object.getOwnPropertyNames(map);
		names.forEach(name => {
			sum += map[name];
		});
		
		return sum;
	}
	
	// Functions bound to client.spelling
	client.spelling.findMisspellings = (string, word) =>
	{
		const wordDelim = client.spelling.wordDelimiter; // Shorten variable name
		// Make case-insensitive
		string = string.toLowerCase();
		word = word.toLowerCase();
		
		if (client.spelling.misspellings[word] != undefined) {
			for (const misspelling of client.spelling.misspellings[word]) {
				const regex = new RegExp(wordDelim + misspelling + wordDelim);
				if (regex.test(string)) return true;
			}
		}
		return false;
	}
}