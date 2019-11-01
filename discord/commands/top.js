exports.run = async (client, message, arguments, options, permission) => {
	
	const number = arguments.number;
	
	plebLimit = 10;
	if ((number > plebLimit || number < 1) && permission > 3) {
		message.channel.send(message.author + ", please specify a number from 1 to " + plebLimit);
		return false;
	}
	
	if (number < 1) {
		message.channel.send(message.author + ", please specify a number greater than or equal to 1");
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
	
	top.forEach((e, i) => { top[i] = e.join(": ").replace("_", "\\_") });
	
	message.channel.send(message.author + ", The top " + number + " are:\n" + top.join(", "));
	
	return;
};

exports.config = {
	"cooldown" : 30,
	"sharedCooldown" : false,
	"permission" : 5,
	"syntax" : [
		"number_n:5"
	],
	"usage" : [
		"([number : 5])"
	],
	"channels" : "spam",
	"help" : "show the top n currency holders"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "top") return true;
	return false;
};