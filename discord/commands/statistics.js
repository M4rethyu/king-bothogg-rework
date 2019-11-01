exports.run = async (client, message, arguments, options, permission) => {
	
	const excludeErick = (options.get("e")?true:false)
	
	const map = client.persist("currency.amount");
	//if (map == undefined) return false;
	
	var top10 = [];
	var sum = 0;
	const names = Object.getOwnPropertyNames(map);
	names.forEach(name => {
		if (excludeErick && name == "king_nidhogg") return;
		
		if (top10.length < 10) top10.push([name, map[name]]);
		else {
			for (var i = 9; i > 0; i--) {
				if (top10[i][1] > map[name]) {
					if (i == 9) break;
					else top10[i+1] = [name, map[name]];
				}
			}
		}
		
		sum += map[name];
	});
	const n = names.length + (excludeErick?-1:0);
	const avg = sum/n
	
	top10.forEach(e => e.join(": "));
	
	message.channel.send("[OUTPUT]: " + 
		"\nTotal viewers with " + client.answers.currencies + ": " + n +
		"\nTotal amount of " + client.answers.currencies + ": " + sum +
		"\nAverage amount of " + client.answers.currencies + ": " + avg
	);
	
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 3,
	"syntax" : [
		
	],
	"channels" : "spam",
	"help" : "Statistics on nidcoins"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "statistics") return true;
	return false;
};