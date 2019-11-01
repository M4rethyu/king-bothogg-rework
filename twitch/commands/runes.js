exports.run = async (client, channel, userstate, arguments, options) => {
	client.twitch.say(channel, client.runesToMessage());
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		
	],
	"channels" : "chat dm",
	"help" : "Show runes of active game."
};

exports.condition = (client, channel, userstate, arguments, options) => {
	if (arguments._command === "runes") return true;
	return false;
};