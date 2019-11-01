exports.run = async (client, message, arguments, options, permission) => {
	channel = arguments.channel;
	user = arguments.user;
	n = arguments.number;
	
	if (n < 2) {
		channel.send(message.author + ", please specify a number greater than 1");
		return;
	}
	
	if (n > 100) {
		channel.send(message.author + ", please specify a number smaller than or equal to 100");
		return;
	}
	
	var messages;
	
	if (user) {
		// Purge n messages by user
		var fetched;
		do {
			if (fetched) {
				fetched = await channel.fetchMessages({
					"limit" : Math.min(n * 5, 100),
					"before" : fetched.lastKey()
				});
			} else {
				fetched = await channel.fetchMessages({ "limit" : Math.min(n * 5, 100) });
			}
			
			if ((typeof messages) == "undefined" || messages.size <= 0) {
				messages = fetched.filter(m => m.author.id == user.id);
			} else {
				messages.concat(fetched.filter(m => m.author.id == user.id));
			}
		} while (messages.size < n && !(fetched.size < Math.min(n * 5, 100)))
	} else {
		// Purge n messages
		messages = await channel.fetchMessages({"limit" : n});
	}
	
	const keys = messages.firstKey(n);
	
	channel.bulkDelete(keys);
	
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		"channel_c:this user_u:null number_n:2"
	],
	"usage" : [
		"([channel : here]) ([user]) ([number : 2])"
	],
	"channels" : "spam",
	"help" : "Purge a number of messages (by a user) from a channel"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "purge") return true;
	return false;
};