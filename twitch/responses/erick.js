exports.run = async (client, message, channel, userstate, arguments, options) => {
	var n = 1; var sum = 1;
	var nAdd = client.persist("twitch.commands.erick." + userstate.username);
	var sumAdd = client.persist.twitchCommandTotal("erick");
	
	if ((typeof nAdd) == "number") n += nAdd
	if ((typeof sumAdd) == "number") sum += sumAdd
	
	client.twitch.say(channel, "@" + userstate["display-name"] + " " + client.answers.erick + " (" + n + " times by " + name + ", " + sum + " times total)");
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		
	],
	"channels" : "chat",
	"help" : "Corrects misspellings of \"Erick\"."
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (client.spelling.findMisspellings(message, "erick")) return true;
	return false;
};