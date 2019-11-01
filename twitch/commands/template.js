exports.run = async (client, message, channel, userstate, arguments, options) => {
	client.twitch.say(channel, "template");
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		"chatroom_s:this user_a:this number_n:0"
	],
	"channels" : "chat dm",
	"help" : "A template for commands, so I can just copy paste"
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (arguments._command === "template") return true;
	return false;
};