exports.run = async (client, channel, userstate, arguments, options) => {
	client.twitch.say(channel, "!duo");
	return;
};

exports.config = {
	"cooldown" : 30,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		
	],
	"channels" : "chat",
	"help" : "Show duo partner."
};

exports.condition = (client, channel, userstate, arguments, options) => {
	const wordDelim = client.spelling.wordDelimiter;
	const sentDelim = client.spelling.sentenceDelimiter;
	
	content = content.toLowerCase();
	
	// Sentence has "who", followed by "duo"
	var regex1 = new RegExp(sentDelim + "[^.!?;]*who" + "[^.!?;]*" + "duo" + "[^.!?;]*" + sentDelim, "g");
	// Sentence has "duo" and ends in "?"
	var regex2 = new RegExp(sentDelim + "[^.!?;]*" + "duo" + "[^.!?;]*" + "\\?", "g");
	
	if (regex1.test(content) || regex2.test(content)) return true;
	return false;
};