exports.run = async (client, message, arguments, options, permission) => {
	
	category = arguments.category;
	
	if (!category) { // No category specified
		message.channel.send(message.author + ", please specify a category (\"map\", )");
		return;
	}
	switch(category) {
		case "map": // Category is maps -> select a map from a list
			const maps = ["pummel town", "rusty ruins", "winterglow", "pirate paradise"]; // Map options
			const map = maps[Math.floor(Math.random()*maps.length)]; // Select one map
			message.channel.send("The map \"" + map + "\" was selected"); // Output result in chat
			break;
		default: // Unknown category specified
			message.channel.send(message.author + ", please specify a valid category (\"map\", )");
			return;
	}
	
	return;
};

exports.config = {
	"cooldown" : 30,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		"category_w"
	],
	"usage" : [
		"[category] -> \"map\", "
	],
	"channels" : "pummel",
	"help" : "Utilities for pummel party"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "pummel") return true;
	return false;
};