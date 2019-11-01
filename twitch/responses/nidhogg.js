exports.run = async (client, message, channel, userstate, arguments, options) => {
	const name = userstate.username;
	
	var n = 1; var sum = 1;
	var nAdd = client.persist("twitch.commands.nidhogg." + name);
	var sumAdd = client.persist.twitchCommandTotal("nidhogg");
	
	if ((typeof nAdd) == "number") n += nAdd
	if ((typeof sumAdd) == "number") sum += sumAdd
	
	const name = userstate["display-name"];
	
	client.twitch.say(channel, "@" + name + " " + client.answers.nidhogg + " (" + n + " times by " + name + ", " + sum + " times total)");
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		
	],
	"channels" : "chat",
	"help" : "Corrects misspellings of \"Nidhogg\"."
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (client.spelling.findMisspellings(message, "nidhogg")) return true;
	return false;
};