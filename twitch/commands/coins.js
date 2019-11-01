exports.run = async (client, message, channel, userstate, arguments, options) => {
	
	var self = false;
	var target = arguments.user;
	if (target == userstate.username) self = true;
	
	if (self) { // Check money from themselves
		client.twitch.say(channel, "@" + userstate.username + ", you have " + client.currency(target) + " " + client.answers.currencies);
	} else { // Check money from someone else
		if (userstate.permission > 3) { // Check if user has permission to check money of someone else
			//client.twitch.say(channel, "@" + userstate.username + ", you don't have permission to check someone else's balance");
			return false;
		}
		client.twitch.say(channel, target + " has " + client.currency(target) + " " + client.answers.currencies);
	}
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		"user_a:this"
	],
	"channels" : "chat",
	"help" : "Shows a user's balance."
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (arguments._command === "coins") return true;
	return false;
};