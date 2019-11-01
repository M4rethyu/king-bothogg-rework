exports.run = async (client, message, arguments, options, permission) => {
	message.channel.send("template");
	return;
};

exports.config = {
	"cooldown" : 15,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		"channel_c:this user_u:this number_n:0 role_r"
	],
	"channels" : "spam",
	"help" : "A template for responses, so I can just copy paste"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (message.content.startsWith("template")) return true;
	return false;
};