// Twitch-related functions

const fetch = require("node-fetch");

module.exports = (client) => {
	
	// Get and set cooldowns
	client.discord.getCooldown = (functions, id) =>
	{
		const cooldown = functions.config.cooldown
		if ((typeof cooldown) == "number") { // Command has a cooldown
			var sharedCooldown = functions.config.sharedCooldown;
			if ((typeof sharedCooldown) == "undefined") sharedCooldown = true;
			
			const currentTime = (new Date()).getTime();
			if (sharedCooldown) { // Command shares cooldown between all users
				lastTime = functions.lastUsed;
				const remaining = lastTime + cooldown * 1000 - currentTime;
				return (remaining>0?remaining:false);
			} else { // Command starts individual cooldown for each user
				if (!functions.lastUsed) functions.lastUsed = {};
				lastTime = functions.lastUsed[id];
				const remaining = lastTime + cooldown * 1000 - currentTime;
				return (remaining>0?remaining:false);
			}
		}
	}
	client.discord.setCooldown = (functions, id) =>
	{
		var sharedCooldown = functions.config.sharedCooldown;
		if ((typeof sharedCooldown) == "undefined") sharedCooldown = true;
		
		if (sharedCooldown) { // Command shares cooldown between all users
			functions.lastUsed = (new Date()).getTime();
		} else { // Command starts individual cooldown for each user
			if (!functions.lastUsed) functions.lastUsed = {};
			functions.lastUsed[id] = (new Date()).getTime();
		}
	}
	
	// Resolve twitch-objects
	client.twitch.resolveAccount = (userstate, string) => { // Resolve Twitch channel
		//const regexes = [/^<#([0-9]+)>/, /^#?([a-z0-9\-]+)/]; // Patterns a channel can have
		const regex = /^@?([a-zA-Z0-9][a-zA-Z0-9_]{3,24})/; // Pattern a channel can have
		string = string.trim();
		
		var res = regex.exec(string);
		
		var channel;
		if (res) {
			channel = res[1];
			string = string.replace(regex, "");
			channel = channel.toLowerCase();
		} else {
			channel = null;
		}
		
		return [string, channel];
	}
	
}