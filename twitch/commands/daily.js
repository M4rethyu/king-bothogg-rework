exports.run = async (client, message, channel, userstate, arguments, options) => {
	const usedDaily = client.persist("currency.usedDaily." + userstate.username) || false;
	if (usedDaily) return false;
	
	const amount = Math.floor(Math.random()*21) + 10;
	client.currency(userstate.username, amount);
	
	client.twitch.say(channel, "@" + userstate.username + ", you gained " + amount + " " + client.answers.currencies + " for a total of " + client.currency(userstate.username));
	client.persist("currency.usedDaily." + userstate.username, true);
	return true;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		
	],
	"channels" : "chat",
	"help" : "A template for commands, so I can just copy paste"
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (arguments._command === "daily") return true;
	return false;
};