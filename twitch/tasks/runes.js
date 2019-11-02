exports.run = async (client) => {
	client.log("log", "runes task")
	client.getSummonerRunes().then(runes =>  {
		client.erick.summonerRunes = runes;
	});
	return;
};

exports.config = {
	"cooldown" : 60,
	"initial" : 5
	
};

exports.condition = (client) => {
	console.log(client.league.active)
	if (client.league.active) return true;
	return false;
};