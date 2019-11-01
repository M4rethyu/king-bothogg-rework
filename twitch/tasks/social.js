exports.run = async (client) => {
	client.twitch.linkSocialMedia("king_nidhogg");
	return;
};

exports.config = {
	"cooldown" : 45 * 60,
	"initial" : 45 * 60
};

exports.condition = (client) => {
	return true;
};