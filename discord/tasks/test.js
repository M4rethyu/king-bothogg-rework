exports.run = async (client) => {
	client.log("log", "[DISCORD TEST ACTION]");
	return;
};

exports.config = {
	
};

exports.condition = (client) => {
	return true;
};