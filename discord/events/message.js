module.exports = async (client, message) => {
	// Ignore messages sent by a bot
	if (message.author.bot) return;
	// Only use Erick's server when hosted, only use mine when running locally
	if (client.config.hosted) {
		if (message.guild.id != "159712694671245312") return false;
	} else {
		if (message.guild.id != "437644282933936130") return false;
	}
	// Preparing variables
	const channel = message.channel;
	const guild = message.guild;
	const username = message.author.username;
	const id = message.author.id;
	
	const content = message.content;
	var string = message.content;
	
	var arguments = [];
	
	
	var options = new Map();
	// Checks for zero-width-whitespaces ("​") at the end of the string
	var regex = /​+$/;
	var secret = regex.exec(string);
	if (secret) {
		string = string.replace(regex, "");
		message.content = message.content.replace(regex, "");
		options.set("secret", [secret[0].length]);
	} // If message author isn't owner, this option will be filtered out below
	
	
	// Set permissionLevel
	var permissionLevel = 5;
	if (client.discord.consoleChannel().members.keyArray().includes(message.author.id)) permissionLevel = 3;
	if (client.discord.config.admins.includes(message.author.id)) permissionLevel = 2;
	//if (false) permissionLevel = 1;
	if (client.discord.config.owner.includes(message.author.id)) permissionLevel = 0;
	var permission = permissionLevel;
	
	// Temporary: block all plebs
	//if (permission > 3) return;
	
	// Extract Options from string
	var regex = /\-[a-zA-Z][a-zA-Z0-9]*(\s+[a-zA-Z0-9]+)*/g
	
	const matches = string.match(regex);
	
	const first = regex.exec(string);
	if (first) {
		string = string.substring(0, first.index);
		
		for (const match of matches) {
			const args = match.trim().split(/\s+/g);
			const name = args.shift();
			options.set(name.substring(1,name.length), args);
		}
	}
	
	// MISSING: Filter opt-arguments with same syntax as command-arguments
	
	// Explicitly define allowed options to use for each permissionLevel (lower permissionlevel (e.g. 3) has permissions of higher permissionlevels (e.g. 5) as well)
	allowedOptions = [
		// Permissionlevel 0
		["t", "p"],
		// Permissionlevel 1
		["t", "x"],
		// Permissionlevel 2
		[],
		// Permissionlevel 3
		[],
		// Permissionlevel 4
		[],
		// Permissionlevel 5
		[]
	]
	
	// Filter disallowed global options
	for (const opt of options) {
		if (permissionLevel == 0) break;
		var allowed = false;
		for (let i = permissionLevel; i < allowedOptions.length; i++) {
			if (allowedOptions[i].includes(opt[0])) {
				allowed = true;
				break;
			}
		}
		if (!allowed) {
			options.delete(opt[0]) // Remove disallowed options
		}
	}
	
	// Execute global options
	for (const opt of options) {
		switch(opt[0]) {
			case "x": // Delete message
				message.delete().catch(err => client.log("error", err));
				break;
			case "t":
				await (new Promise(resolve => setTimeout(resolve, /*change this*/ 0)));
				break;
			case "p":
				if (!opt[1][0]) break;
				permissionLevel = opt[1][0];
				permission = opt[1][0];
				break;
		}
	}
	
	// Do stalker things
	if (client.discord.stalked && client.discord.stalked.includes(message.author.id)) { // Message author is stalked
		if (Math.random() < 0.1) { // Have a chance to react
			message.react(client.discord.emojis.find(e => e.id == "630810684648587295")); // React with :bothogg:
		}
	}
	
	// Differentiate command from response
	var command;
	if (string.startsWith(client.discord.config.prefix)) {
		string = string.slice(client.discord.config.prefix.length);
		command = string.split(/\s+/)[0];
		string = string.substring(command.length, string.length).trim();
	}
	
	arguments._command = command;
	arguments._string = string;
	
	var logMessage = "[" + message.author.tag + " | " + ((channel.type == "dm")?"**DM**":"#" + channel.name) + "] : " + message.content + " [ ";
	
	
	
	checkTrigger = (entry) => { // Checks if a command or response should be run according to condition, cooldown, permission, and channel
		const name = entry[0];
		const functions = entry[1];
		// Note, that arguments of the function were not yet parsed. Only the command name is transferred through the variable "arguments" (if it exists);
		if (functions.condition(client, message, arguments, options, permission)) {
			// Condition allows running
			if (client.discord.getCooldown(functions, id) && permissionLevel > 3) { // Check cooldown
				// On cooldown
				logMessage += ("(" + (command?"!":"") + name + ") ");
				return false;
			}
			if (functions.config.permission < permissionLevel) { // Check permission
				// No permission
				logMessage += ("<" + (command?"!":"") + name + "> ");
				return false;
			}
			// Check channel
			const categories = { // All channel-categories
				"log" : client.discord.config.logID,
				"console" : client.discord.config.consoleID,
				"spam" : client.discord.config.spamID,
				"ask" : client.discord.config.askID,
				"cult" : client.discord.config.cultID,
				"pummel" : client.discord.config.pummelID
			}
			var channels = new Array(); // Initialize array of viable channels
			for (const category of functions.config.channels.split(/\s+/)) {
				if (Object.keys(categories).includes(category)) {
					channels = channels.concat(categories[category]) // Add channels of all categories in config
				} else {
					client.log("warn", (command?"command":"response") + name + " has channel limitation " + category + " which doesn't exist.") // Debug help
				}
			}
			if (!channels.includes(channel.id) && permissionLevel > 3) {
				//       Wrong channel         AND     not mod
				logMessage += ("{" + (command?"!":"") + name + "} ");
				return false;
			}
			return true;
		}
	}
	
	
	var commands = [];
	var responses = [];
	
	// Check commands
	if (command) { // Only check commands, if the prefix was used
		for (const entry of client.discord.commands.entries()) {
			const name = entry[0];
			const functions = entry[1];
			if (checkTrigger(entry)) {
				
				var args;
				var index;
				[string, args, index] = client.getArguments(message, entry, string);
				
				arguments._rest = string;
				arguments._syntax = index;
				
				for (const key of args.keys()) {
					arguments[key] = args.get(key);
				}
				
				logMessage += ((command?"!":"") + name + " ");
				if (command) commands.push(name);
				else responses.push(name);
				
				functions.run(client, message, arguments, options, permission);
				
				client.discord.setCooldown(functions, id);
				
				break; // Stop checking once one command was triggered
			}
		}
	}
	
	// Check hierarchy responses
	if (commands.length == 0) { // Only check through hierarchy, if no command has been used
		for (const entry of client.discord.responses.entries()) {
			const name = entry[0];
			const functions = entry[1];
			if (client.discord.unconditionalResponses.includes(name)) continue; // Don't check unconditional responses here
			if (checkTrigger(entry)) {
				
				var args;
				var index;
				[string, args, index] = client.getArguments(message, entry, string);
				
				arguments._rest = string;
				arguments._syntax = index;
				
				for (const key of args.keys()) {
					arguments[key] = args.get(key);
				}
				
				logMessage += ((command?"!":"") + name + " ");
				if (command) commands.push(name);
				else responses.push(name);
				
				functions.run(client, message, arguments, options, permission);
				client.discord.setCooldown(functions, id);
				
				break; // Stop checking once one responses was triggered
			}
		}
	}
	
	// Check unconditional responses
	for (const entry of client.discord.responses.entries()) {
		const name = entry[0];
		const functions = entry[1];
		if (!client.discord.unconditionalResponses.includes(name)) continue; // Only check unconditional responses here
		if (checkTrigger(entry)) {
			
				var args;
				var index;
				[string, args, index] = client.getArguments(message, entry, string);
				
				arguments._rest = string;
				arguments._syntax = index;
				
				for (const key of args.keys()) {
					arguments[key] = args.get(key);
				}
				
				logMessage += ((command?"!":"") + name + " ");
				if (command) commands.push(name);
				else responses.push(name);
				
				functions.run(client, message, arguments, options, permission);
				client.discord.setCooldown(functions, id);
				
			// Don't stop checking once one responses was triggered (no "break;")
		}
	}
	
	logMessage += "]";
	client.log("discord", logMessage);
	
	return;
}