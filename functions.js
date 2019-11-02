const fetch = require("node-fetch");

module.exports = (client) => {
	// Handle the running of tasks
	client.taskCooldown = (entry) => { // Handle running a task on cooldown
		const name = entry[0];
		const functions = entry[1];
		
		functions.config.ready = true;
		
		if (!functions.config.cooldown) {
			return;
		}
		
		if (functions.config.cooldown <= 0) {
			return;
		}
		
		functions.lastUsed = (new Date()).getTime() + (-functions.config.cooldown + Math.max(functions.config.initial, 0)) * 1000; // Set initial cooldown (is in seconds)
		
		// Need to give function as argument to localize it, so overwriting the function in this scope doesn't change it inside itself
		executeTask = (executeTask, functions) => {
			const time = (new Date()).getTime();
			const last = functions.lastUsed;
			const cooldown = functions.config.cooldown * 1000; // Cooldown is in seconds
			
			const remaining = last + cooldown - time + 50; // Add 50 to make sure
			
			setTimeout(async function() {
				if (functions.condition(client)) {
					functions.run(client);
				}
				functions.lastUsed = (new Date()).getTime();
				executeTask(executeTask, functions);
			}, remaining);
		}
		executeTask(executeTask, functions);
	}
	client.taskTime = (entry) =>  { // Handle running a task at a set time
		const name = entry[0];
		const functions = entry[1];
		
		functions.config.ready = true;
		
		if (!functions.config.time) {
			return;
		}
		
		var timeA = [];
		for (const string of functions.config.time) {
			//const string = functions.config.time;
			const regex = /([0-9]{2}):([0-9]{2}):([0-9]{2})/;
			const res = regex.exec(string);
			
			if (res == null) {
				client.log("warn", "task " + name + " has invalid time format");
				return;
			}
			
			hour = Number(res[1]);
			min = Number(res[2]);
			sec = Number(res[3]);
			
			if (hour != NaN && min != NaN && sec != NaN) {
				// Time is defined
				if ((hour >= 0 && hour < 24) && (min >= 0 && min < 60) && (sec >= 0 && sec < 60)) {
					// Time is in range
				} else {
					client.log("warn", "task " + name + " has invalid time (out of range)") // Debug help
					return;
				}
			} else {
				client.log("warn", "task " + name + " has invalid time (undefined)") // Debug help
				return;
			}
			
			timeA.push(((hour * 60 + min) * 60 + sec) * 1000);
		}
		
		// Need to give function as argument to localize it, so overwriting the function in this scope doesn't change it inside itself
		executeTask = (executeTask) => {
			const time = (new Date().getTime()) % (24 * 3600 * 1000);
			var delays = [];
			for (const t of timeA) {
				delays.push((t - time + 24 * 3600 * 1000) % (24 * 3600 * 1000) + 50); // Add 50 to make sure
			}
			delay = Math.min(...delays);
			
			setTimeout(async function() {
				if (functions.condition(client)) {
					functions.run(client);
				}
				executeTask(executeTask);
			}, delay);
			// Debug help
			const hours = Math.floor(delay/(3600 * 1000));
			client.log("log", "executing task '" + name + "' in " + hours + " hours, " + Math.floor((delay - hours * 3600 * 1000)/(60 * 1000)) + " minutes");
		}
		executeTask(executeTask);
	}
	
	// Resolve non-specific objects
	client.resolveNumber = (message, string) => { // Resolve number (integer)
		
		const regex = /^([-0-9]+)/; // Pattern a word has
		string = string.trim();
		var res = regex.exec(string);
		
		if (res == null) return [string, null];
		
		number = Number(res[1]);
		if (number == NaN) number = null;
		else string = string.replace(regex, "");
		
		return [string, number];
	}
	client.resolveWord = (message, string) => { // Resolve word
		
		const regex = /^([a-zA-Z0-9]+)/; // Pattern a word has
		string = string.trim();
		var res = regex.exec(string);
		
		if (res == null) return [string, null];
		
		word = res[1];
		string = string.replace(regex, "");
		
		return [string, word];
	}
	
	
	const argTypes = {
		"a" : {
			"name" : "twitch account", // Get a discord account
			"function" : client.twitch.resolveAccount
		},
		"s" : {
			"name" : "twitch streamer", // Difference to account is the "this" value; account-this is message author, streamer-this is message channel
			"function" : client.twitch.resolveAccount
		},
		"c" : {
			"name" : "channel", // Get a discord channel
			"function" : client.discord.resolveChannel
		},
		"u" : {
			"name" : "user", // Get a discord user
			"function" : client.discord.resolveUser
		},
		"m" : {
			"name" : "member", // Get a discord guildmember
			"function" : client.discord.resolveMember
		},
		"r" : {
			"name" : "role", // Get a discord role
			"function" : client.discord.resolveRole
		},
		"n" : {
			"name" : "number (integer)", // Get a number
			"function" : client.resolveNumber
		},
		"w" : {
			"name" : "word", // Get a word
			"function" : client.resolveWord
		}
	};
	
	// Get arguments
	client.getArguments = (context, entry, string) => {
		
		var message;
		var userstate;
		
		// Identify context
		if (context.member) {
			message = context;
		} else if (context["message-type"]) {
			userstate = context;
		} else {
			client.log("error", "no fitting context passed to client.getArguments"); // Debug help
		}
		
		const name = entry[0];
		const functions = entry[1];
		const syntax = functions.config.syntax
		const regex = /([a-zA-Z0-9]+)_([a-z]+):?([a-zA-Z0-9]+)?/
		
		if (syntax.length == 0) {
			return [string, [], null];
		}
		
		var argList = syntax[0].split(/\s+/);
		var argSyntax = new Map();
		for (var arg of argList) {
			const syntax = regex.exec(arg);
			
			if (!syntax) {
				break;
			}
			
			if (argSyntax.has(syntax[1])) client.log("warn", name + " has multiple arguments named " + syntax[1]);
			
			argSyntax.set(syntax[1], {
				"name" : syntax[1],
				"type" : syntax[2],
				"default" : syntax[3] || "none"
			});
		}
		
		var arguments = new Map();
		
		for (const arg of argSyntax) {
			const syntax = arg[1];
			var value;
			
			// Check if the syntax type exists
			if (Object.keys(argTypes).includes(syntax.type)) {
				//[string, value] = argTypes[syntax.type].function(message, string);
				
				const tmp = argTypes[syntax.type].function(message, string);
				string = tmp[0];
				value = tmp[1];
				
				
				// If no value was found, check for the default value
				if (value == null) {
					if (syntax.default == "this") {
						switch(syntax.type) {
							case "a":
								if (userstate) value = userstate.username;
								break;
							case "s":
								if (userstate) value = userstate.channel;
								break;
							case "c":
								if (message) value = message.channel;
								break;
							case "u":
								if (message) value = message.author;
								break;
							case "m":
								if (message) value = message.member;
								break;
							case "n":
								break;
							case "r":
								break;
							default:
						}
					} else if (syntax.default == "default") {
						switch(syntax.type) {
							case "a":
								break;
							case "s":
								break;
							case "c":
								value = client.dicord.logChannel();
								break;
							case "u":
								break;
							case "m":
								break;
							case "n":
								value = 0;
								break;
							case "r":
								break;
							default:
						}
					} else if (syntax.default == "null") {
						// Do nothing
					} else if (syntax.default == "none") {
						// Do nothing
					} else { // Default is no special keyword
						value = argTypes[syntax.type].function(message, syntax.default)[1];
					}
				}
				
				string = string.trim();
				try {
					response = value.name || value.tag || value;
					//console.log("extracted " + syntax.name + "_" + syntax.type + " " + response);
				} catch(err) {
					//console.log("extracted " + syntax.name + "_" + syntax.type + " " + value);
				}
				
				
			} else {
				client.log("warn", name + " has unknown object " + syntax.type); // Debug help
			}
			
			arguments.set(syntax.name, value);
			
		}
		
		for (const key of arguments.keys()) {
			if (arguments.get(key) == null && !(argSyntax.get(key).default == "null")) {
				console.log("arguments include null")
			}
		}
		
		return [string, arguments, 0];
	}
}