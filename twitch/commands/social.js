exports.run = async (client, message, channel, userstate, arguments, options) => {
	client.twitch.linkSocialMedia(channel);
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		
	],
	"channels" : "chat dm",
	"help" : "Link Erick's social media."
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (arguments._command === "social") return true;
	return false;
};