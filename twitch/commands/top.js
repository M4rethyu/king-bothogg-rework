exports.run = async (client, message, channel, userstate, arguments, options) => {
	const number = arguments.number;
	
	if (number > 5 && userstate.permission > 3) {
		client.twitch.say(channel, "@" + userstate.username + ", please specify a number from 1-5");
		return false;
	}
	
	if (number < 1) {
		client.twitch.say(channel, "@" + userstate.username + ", please specify a number >= 1");
		return false;
	}
	
	const map = client.persist("currency.amount");
	const names = Object.getOwnPropertyNames(map);
	
	var top = new Array(names.length);
	var i = 0;
	for (const name of names) {
		const amount = map[name];
		top[i] = [name, amount];
		i++;
	}
	
	top.sort((a, b) => { return b[1] - a[1]; });
	
	top = top.slice(0, number);
	
	top.forEach((e, i) => { top[i] = e.join(": ") });
	console.log(top)
	
	client.twitch.say(channel, "@" + userstate.username + ", The top " + number + " are: " + top.join(", "));
	
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 5,
	"syntax" : [
		"number_n:5"
	],
	"channels" : "chat",
	"help" : "Show the top n nidcoin holders"
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (arguments._command === "top") return true;
	return false;
};