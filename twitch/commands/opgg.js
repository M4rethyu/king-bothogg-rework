exports.run = async (client, message, channel, userstate, arguments, options) => {
	client.twitch.say(channel, client.currentAccount());
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		
	],
	"channels" : "chat",
	"help" : "Link Erick's op.gg."
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (arguments._command === "op.gg" || arguments._command === "opgg") return true;
	return false;
};