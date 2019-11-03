exports.run = async (client) => {
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
	if (client.league.config.active) return true;
	return false;
};