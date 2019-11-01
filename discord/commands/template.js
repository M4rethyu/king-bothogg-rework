exports.run = async (client, message, arguments, options, permission) => {
	message.channel.send("template");
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		"channel_c:this user_u:this number_n:0 role_r"
	],
	"usage" : [
		"[channel]..."
	],
	"channels" : "spam",
	"help" : "A template for commands, so I can just copy paste"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "template") return true;
	return false;
};