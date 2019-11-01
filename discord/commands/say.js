exports.run = async (client, message, arguments, options, permission) => {
	
	if (!client.discord.config.consoleID.includes(message.channel.id)) {
		message.delete().catch(err => client.log("error", err)); // Delete message if it's not in the console channel, to keep secrecy
		return;
	}
	
	var channel = arguments.channel;
	if (!channel) {
		return false;
	}
	
	var string = arguments._rest.trim();
	
	for (const opt of options) {
		switch(opt) {
		case "d": // Set Message up for sending later
			// MISSING
			break;
		}
	}
	
	if (string == "") return; // Don't send an empty message
	
	channel.send(string);
	
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : false,
	"permission" : 3,
	"syntax" : [
		"channel_c"
	],
	"usage" : [
		"[channel]"
	],
	"channels" : "console",
	"help" : "Make the bot say something"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "say") return true;
	return false;
};