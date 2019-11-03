exports.run = async (client, message, channel, userstate, arguments, options) => {
	
	const amount = arguments.amount;
	var target = arguments.target;
	
	if (amount < 0) {
		client.twitch.say(channel, "@" + userstate.username + ", don't be that guy");
		return false;
	}
	
	if (client.currency(userstate.username) < amount) {
		client.twitch.say(channel, "@" + userstate.username + ", you don't have enough " + client.answers.currencies);
		return false;
	}
	
	if (!target) {
		client.twitch.say(channel, "@" + userstate.username + ", please specify a valid target");
		return false;
	}
	
	const before = client.currency(target);
	client.currency(userstate.username, -amount);
	client.currency(target, amount);
	const after = client.currency(target);
	
	client.twitch.say(channel, "@" + target + ", " + userstate.username + " transferred " + amount + " " + ((amount == 1)?(client.answers.currency):(client.answers.currencies)) + " to you for a total of " + after);
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		"target_a amount_n"
	],
	"channels" : "chat",
	"help" : "Give some of your nidcoins to a user."
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (arguments._command === "give") return true;
	return false;
};