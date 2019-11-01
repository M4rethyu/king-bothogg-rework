exports.run = async (client, message, channel, userstate, arguments, options) => {
	
	amount = arguments.amount;
	target = arguments.user;
	
	if (!amount) {
		client.twitch.say(channel, "@" + target + ", please specify a valid amount")
		return;
	}
	
	const before = client.currency(target);
	client.currency(target, amount);
	const after = client.currency(target);
	
	client.twitch.say(channel, "@" + target + ", " + userstate.username + " gave you " + amount + " " + ((amount == 1)?(client.answers.currency):(client.answers.currencies)) + " for a total of " + after);
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 1,
	"syntax" : [
		"user_a:this amount_n"
	],
	"channels" : "chat",
	"help" : "Add some amount to user's nidcoin balance."
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (arguments._command === "add") return true;
	return false;
};