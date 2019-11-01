exports.run = async (client, message, channel, userstate, arguments, options) => {
	client.twitch.say(channel, client.runesToMessage());
	return;
};

exports.config = {
	"cooldown" : 30,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		
	],
	"channels" : "chat",
	"help" : "Show runes of current game."
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	const wordDelim = client.spelling.wordDelimiter;
	const sentDelim = client.spelling.sentenceDelimiter;
	
	content = message.toLowerCase();
	
	// Sentence has word staring with "w", followed by "runes"
	var regex1 = new RegExp(sentDelim + "[^.!?;]*(\\bw\\w+\\b)" + "[^.!?;]*" + "runes" + "[^.!?;]*" + sentDelim, "g");
	// Sentence has "runes" and ends in "?"
	var regex2 = new RegExp(sentDelim + "[^.!?;]*" + "runes" + "[^.!?;]*" + "\\?", "g");
	
	if (regex1.test(content) || regex2.test(content)) return true;
	return false;
};