exports.run = async (client) => {
	client.log("log", "[DISCORD TEMPLATE ACTION]");
	return;
};

exports.config = {
	"cooldown" : 20,
	"initial" : 10,
	"time" : ["13:37:42"]
	
};

exports.condition = (client) => {
	return false;
};