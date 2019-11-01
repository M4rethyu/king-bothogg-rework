exports.run = async (client) => {
	
	const logChannel = client.discord.logChannel()
	logChannel.send(
	"[BACKUP]: Created at '" + new Date() + "'",
	{
		files: [{
			attachment: './modules/permanentData.json',
			name: 'permanentData.json'
		}]
	});
	
	client.log("console", "Created backup in " + logChannel);
	
	return;
};

exports.config = {
	"time" : ["00:32:20"]
};

exports.condition = (client) => {
	return true;
};