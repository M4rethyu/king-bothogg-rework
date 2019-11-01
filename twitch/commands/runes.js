exports.run = async (client, message, channel, userstate, arguments, options) => {
	client.twitch.say(channel, client.runesToMessage());
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		
	],
	"channels" : "chat dm",
	"help" : "Show runes of active game."
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (arguments._command === "runes") return true;
	return false;
};