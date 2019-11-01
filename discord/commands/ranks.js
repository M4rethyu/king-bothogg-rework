exports.run = async (client, message, arguments, options, permission) => {
	const channel = message.channel;
	
	var string = "The available ranks are:```"
	
	var abbrLength = 0;
	var nameLength = 0;
	for (const entry of client.discord.ranks) {
		if (entry[0] == "template") continue;
		const rank = entry[1];
		const abbr = rank.abbreviation.length;
		const name = rank.name.length;
		if (abbrLength < abbr) abbrLength = abbr;
		if (nameLength < name) nameLength = name;
	}
	
	for (const entry of client.discord.ranks) {
		if (entry[0] == "template") continue;
		const rank = entry[1];
		string += "\n" + rank.abbreviation + " ".repeat(abbrLength - rank.abbreviation.length) + " | ";
		string += rank.name + " ".repeat(nameLength - rank.name.length) + "  ";
		string += "(" + rank.help + ")";
	}
	string += "```";
	
	channel.send(string);
	return;
};

exports.config = {
	"cooldown" : 30,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		
	],
	"channels" : "spam",
	"help" : "Show all available ranks"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "ranks") return true;
	return false;
};