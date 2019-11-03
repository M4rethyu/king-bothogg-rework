// Discord-related functions

const fetch = require("node-fetch");

module.exports = (client) => {
	// Special channels
	client.discord.logChannel = () =>
	{
		return client.discord.channels.get(client.discord.config.logID[0]);
	}
	client.discord.consoleChannel = () =>
	{
		return client.discord.channels.get(client.discord.config.consoleID[0]);
	}
	client.discord.spamChannel = () =>
	{
		return client.discord.channels.get(client.discord.config.spamID[0]);
	}
	client.discord.askChannel = () =>
	{
		return client.discord.channels.get(client.discord.config.askID[0]);
	}
	client.discord.cultChannel = () =>
	{
		return client.discord.channels.get(client.discord.config.cultID[0]);
	}
	client.discord.pummelChannel = () =>
	{
		return client.discord.channels.get(client.discord.config.pummelID[0]);
	}
	
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
	
	// Resolve discord-objects
	client.discord.resolveChannel = (message, string) => { // Resolve Discord channel
		const guild = message.guild;
		const regexes = [/^<#([0-9]+)>/, /^#?([a-z0-9\-]+)/]; // Patterns a channel can have
		const searchparams = ["id", "name"]; // Property of the channel that the regex extracts
		if (regexes.length != searchparams.length) client.log("warn", "regexes and searchparams have different length in resolveChannel"); // Debug help
		string = string.trim();
		var channel = null;
		var res = null;
		
		for (const i in regexes) {
			const regex = regexes[i];
			const search = searchparams[i];
			res = regex.exec(string);
			if (res != null) {
				if (guild && guild.available) { // Check if it's actually a guild
					channel = guild.channels.find(c => c[search] == res[1]); // Get channel by property
				} else {
					channel = client.discord.channels.find(c => c[search] == res[1]); // Get channel by property
				}
				if (channel) { // If a channel was found, return it
					string = string.replace(regex, "") // Remove the channel-resolvable from the string
					return [string, channel];
				}
			}
		}
		
		return [string, channel];
	}
	client.discord.resolveUser = (message, string) => { // Resolve Discord user
		const guild = message.guild;
		const regexes = [/^<@!?([0-9]+)>/, /^(.+#[0-9]{4})/]; // Patterns a user can have
		const searchparams = ["id", "tag"]; // Property of the user that the regex extracts
		if (regexes.length != searchparams.length) client.log("warn", "regexes and searchparams have different length in resolveChannel"); // Debug help
		string = string.trim();
		
		var user = null;
		var res = null;
		
		for (const i in regexes) {
			const regex = regexes[i];
			const search = searchparams[i];
			res = regex.exec(string);
			if (res != null) {
				if (guild && guild.available) { // Check if it's actually a guild
					user = guild.members.find(m => m.user[search] == res[1]).user; // Get user by property
				} else {
					user = client.discord.users.find(u => u[search] == res[1]); // Get user by property
				}
				if (user) { // If a user was found, return it
					string = string.replace(regex, "") // Remove the user-resolvable from the string
					return [string, user];
				}
			}
		}
		return [string, user];
	}
	client.discord.resolveMember = (message, string) => { // Resolve Discord member
		const guild = message.guild;
		const regexes = [/^<@!?([0-9]+)>/, /^(.+#[0-9]{4})/]; // Patterns a member can have
		const searchparams = ["id", "tag"]; // Property of the member that the regex extracts
		if (regexes.length != searchparams.length) client.log("warn", "regexes and searchparams have different length in resolveChannel"); // Debug help
		string = string.trim();
		
		var member = null;
		var res = null;
		
		for (const i in regexes) {
			const regex = regexes[i];
			const search = searchparams[i];
			res = regex.exec(string);
			if (res != null) {
				if (guild && guild.available) { // Check if it's actually a guild
					member = guild.members.find(m => m.user[search] == res[1]); // Get member by property
				} else {
					// Don't get members outside of the guild
				}
				if (member) { // If a member was found, return it
					string = string.replace(regex, "") // Remove the member-resolvable from the string
					return [string, member];
				}
			}
		}
		return [string, member];
	}
	client.discord.resolveRole = (message, string) => { // Resolve Discord member
		const guild = message.guild;
		const regexes = [/^<@&([0-9]+)>/, /^(.+)/]; // Patterns a role can have
		const searchparams = ["id", "name"]; // Property of the role that the regex extracts
		if (regexes.length != searchparams.length) client.log("warn", "regexes and searchparams have different length in resolveChannel"); // Debug help
		string = string.trim();
		
		var role = null;
		var res = null;
		
		for (const i in regexes) {
			const regex = regexes[i];
			const search = searchparams[i];
			res = regex.exec(string);
			if (res != null) {
				if (guild && guild.available) { // Check if it's actually a guild
					role = guild.roles.find(r => r[search] == res[1]); // Get role by property
				} else {
					role = client.discord.roles.find(r => r[search] == res[1]); // Get role by property
				}
				if (role) { // If a role was found, return it
					string = string.replace(regex, "") // Remove the role-resolvable from the string
					return [string, role];
				}
			}
		}
		return [string, role];
	}
	
}