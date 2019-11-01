exports.run = async (client) => {
	client.dataStorage.del("currency.usedDaily");
	return;
};

exports.config = {
	"time" : ["20:00:00"]
	
};

exports.condition = (client) => {
	return true;
};