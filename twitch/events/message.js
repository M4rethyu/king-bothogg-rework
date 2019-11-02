module.exports = async (client, channel, userstate, message, self) => {
	// Ignore messages sent by the bot itself
	if (self) return;
	// Preparing Variables
	if (userstate["message-type"] == "chat") {
		userstate.channel = channel;
	}
	const username = userstate.username;
	const content = message;
	var string = message;
	
	var arguments = [];
	
	
	var options = new Map();
	// Checks for zero-width-whitespaces ("​") at the end of the string
	var regex = /​+$/;
	var secret = regex.exec(string);
	if (secret) {
		string = string.replace(regex, "");
		content = content.replace(regex, "");
		options.set("secret", [secret[0].length]);
	} // If message author isn't owner, this option will be filtered out below
	
	
	// Set permissionLevel
	var permissionLevel = 5;
	if (userstate.mod) permissionLevel = 3;
	if (client.twitch.config.admins.includes(username)) permissionLevel = 2;
	if (("#" + username) == channel && userstate["message-type"] == "chat") permissionLevel = 1;
	if (client.twitch.config.owner.includes(username)) permissionLevel = 0;
	userstate.permission = permissionLevel;
	permission = permissionLevel;
	
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
				// MISSING: delete message in twitch
				//message.delete().catch(err => client.log("error", err));
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
	
	
	// Differentiate command from response
	var command;
	if (string.startsWith(client.twitch.config.prefix)) {
		string = string.slice(client.twitch.config.prefix.length);
		command = string.split(/\s+/)[0];
		string = string.substring(command.length, string.length).trim();
	}
	
	arguments._command = command;
	arguments._string = string;
	
	var logMessage = "[" + userstate["display-name"] + " | " + ((userstate["message-type"] == "whisper")?"**DM**, ":"/" + channel.substring(1)) + " ] : " + message + " [ ";
	
	checkTrigger = (entry) => { // Checks if a command or response should be run according to condition, cooldown, permission, and channel
		const name = entry[0];
		const functions = entry[1];
		// Note, that arguments of the function were not yet parsed. Only the command name is transferred through the variable "arguments" (if it exists);
		if (functions.condition(client, message, channel, userstate, arguments, options)) {
			// Condition allows running
			// Check cooldown
			if (client.twitch.getCooldown(functions, username) && permissionLevel > 3) {
				// On cooldown
				logMessage += ("(" + (command?"!":"") + name + ") ");
				return false;
			}
			// Check permission
			if (functions.config.permission < permissionLevel) {
				// No permission
				logMessage += ("<" + (command?"!":"") + name + "> ");
				return false;
			}
			// Check channel
			var allowedChannel = false;
			categories = functions.config.channels.split(/\s+/);
			if (userstate["message-type"] == "chat") {
				if (categories.includes("chat")) allowedChannel = true;
			} else if (userstate["message-type"] == "dm") {
				if (categories.includes("dm")) allowedChannel = true;
			} else {
				
			}
			if (!allowedChannel && permissionLevel > 3) {
				//Wrong channel AND not mod
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
		for (const entry of client.twitch.commands.entries()) {
			const name = entry[0];
			const functions = entry[1];
			if (checkTrigger(entry)) {
				
				var args;
				var index;
				[string, args, index] = client./*twitch.*/getArguments(userstate, entry, string);
				
				arguments._rest = string;
				arguments._syntax = index;
				
				for (const key of args.keys()) {
					arguments[key] = args.get(key);
				}
				
				logMessage += ((command?"!":"") + name + " ");
				if (command) commands.push(name);
				else responses.push(name);
				
				functions.run(client, message, channel, userstate, arguments, options);
				
				client.twitch.setCooldown(functions, username);
				
				break; // Stop checking once one command was triggered
			}
		}
	}
	
	// Check hierarchy responses
	if (commands.length == 0) { // Only check through hierarchy, if no command has been used
		for (const entry of client.twitch.responses.entries()) {
			const name = entry[0];
			const functions = entry[1];
			if (client.twitch.unconditionalResponses.includes(name)) continue; // Don't check unconditional responses here
			if (checkTrigger(entry)) {
				
				var args;
				var index;
				[string, args, index] = client.getArguments(userstate, entry, string);
				
				arguments._rest = string;
				arguments._syntax = index;
				
				for (const key of args.keys()) {
					arguments[key] = args.get(key);
				}
				
				logMessage += ((command?"!":"") + name + " ");
				if (command) commands.push(name);
				else responses.push(name);
				
				functions.run(client, message, channel, userstate, arguments, options);
				client.twitch.setCooldown(functions, username);
				
				break; // Stop checking once one responses was triggered
			}
		}
	}
	
	// Check unconditional responses
	for (const entry of client.twitch.responses.entries()) {
		const name = entry[0];
		const functions = entry[1];
		if (!client.twitch.unconditionalResponses.includes(name)) continue; // Only check unconditional responses here
		if (checkTrigger(entry)) {
			
				var args;
				var index;
				[string, args, index] = client.getArguments(userstate, entry, string);
				
				arguments._rest = string;
				arguments._syntax = index;
				
				for (const key of args.keys()) {
					arguments[key] = args.get(key);
				}
				
				logMessage += ((command?"!":"") + name + " ");
				if (command) commands.push(name);
				else responses.push(name);
				
				functions.run(client, message, channel, userstate, arguments, options);
				client.twitch.setCooldown(functions, username);
				
			// Don't stop checking once one responses was triggered (no "break;")
		}
	}
	
	logMessage += "]";
	client.log("twitch", logMessage.replace(/[_*~]/g, "\\$&"));
	
	for (const name of commands.concat(responses)) {
		// Count command usage by users
		var n = client.persist("twitch.commands." + name + "." + username);
		if (n == null) n = 0;
		else client.persist("twitch.commands." + name + "." + username, n + 1);
	}
	
	return;
}