const Discord = require('discord.js');

const argTypes = {
		"a" : "twitch user",
		"s" : "twitch chatroom",
		"c" : "channel",
		"u" : "user",
		"m" : "user",
		"r" : "role",
		"n" : "number",
		"w" : "word",
	};

exports.run = async (client, message, arguments, options, permission) => {
	
	showAll = (options.get("all")?true:false) && permission == 0;
	
	commands = client.discord.commands;
	
	helps = new Map();
	
	for (const entry of commands) {
		const name = entry[0];
		const functions = entry[1];
		
		if (functions.config.permission <= 3 && !showAll) {
			continue; // Don't show commands for mod+, unless specified
		}
		
		// Usage
		var usages = [];
		const syntax = functions.config.syntax
		const regex = /([a-zA-Z0-9]+)_([a-z]+):?([a-zA-Z0-9]+)?/
		
		if (!(syntax.length == 0)) {
			for (var argList of syntax) {
				argList = argList.split(/\s+/);
				
				var string = "";
				for (var arg of argList) {
					const syntax = regex.exec(arg);
					
					if (!syntax) {
						break;
					}
					
					const type = argTypes[syntax[2]];
					if (!type) client.log("warn", "argType " + syntax[2] + " doesn't exist (!help)"); // Debug help
					
					const def = syntax[3];
					if (def) string += "([" + type + "]) ";
					else string += "[" + type + "] ";
				}
				usages.push(string);
			}
			
		}
		
		
		helps.set(name, {
			"name" : name,
			"usage" : functions.config.usage,
			"help" : functions.config.help
		});
	}
	
	var fields = [];
	
	for (const help of Array.from(helps.values())) {
		
		var string = help.help;
		
		if (!help.usage) {
			
		} else {
			//string += "\nProvide arguments as ";
			string += "; usage: ";
			string += help.usage.map(s => { return "\"!" + help.name + " " + s + "\" "; }).join(" OR ");
		}
		
		
		
		fields.push({
			"name" : "!" + help.name,
			"value" : string
		});
	}
	
	if (fields.length == 0) console.log("there are no commands to display")
	
	message.channel.send({embed: {
		title: "Available commands:",
		description: "Arguments in () are optional. the value after : is the default.",
		color: 3447003,
		fields: fields,
		timestamp: new Date(),
		footer: {
			icon_url: client.discord.user.avatarURL,
			text: "This is not a cult."
		}
	}
	});
	
	return;
};

exports.config = {
	"cooldown" : 30,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		
	],
	"channels" : "spam",
	"help" : "Show all commands and their usage."
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "help") return true;
	return false;
};