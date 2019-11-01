exports.run = async (client) => {
	client.log("log", "[TWITCH TEMPLATE ACTION]");
	return;
};

exports.config = {
	"cooldown" : 20,
	"initial" : 10,
	"time" : ["00:32:20","00:32:30"]
	
};

exports.condition = (client) => {
	return false;
};