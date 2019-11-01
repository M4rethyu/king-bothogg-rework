exports.run = async (client, message, arguments, options, permission) => {
	var answer = Math.random() < 0.5?"heads":"tails";
	
	if (options.get("secret")) {
		switch(options.get("secret")[0]) {
			case 1:
				answer = "heads";
				break;
			case 2:
				answer = "tails";
				break;
		}
	}
	
	message.channel.send(answer);
	return;
};

exports.config = {
	"cooldown" : 5,
	"sharedCooldown" : false,
	"permission" : 5,
	"syntax" : [
		
	],
	"channels" : "spam",
	"help" : "Flip a coin"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "coinflip") return true;
	return false;
};