exports.run = async (client, message, arguments, options, permission) => {
	const rn = Math.random();
	
	var type;
	if (rn <= 0.4) {
		type = "no";
	} else if (rn <= 0.6) {
		type = "maybe";
	} else if (rn <= 1.0) {
		type = "yes";
	}
	
	if (options.get("secret")) {
		switch(options.get("secret")[0]) {
			case 1:
				type = "no";
				break;
			case 2:
				type = "maybe";
				break;
			case 3:
				type = "yes";
				break;
		}
	}
	
	const answers = client.answers.commands.ask[type]
	const answer = answers[Math.floor(Math.random()*answers.length)];
	
	message.channel.send(answer);
	return;
};

exports.config = {
	"cooldown" : 5,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		""
	],
	"channels" : "spam",
	"help" : "A template for responses, so I can just copy paste"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (message.mentions.users.has(client.discord.user.id) && message.content.endsWith("?")) return true;
	return false;
};