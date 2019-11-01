exports.run = async (client, message, arguments, options, permission) => {
	const backup = client.discord.tasks.get("backup");
	if (backup.config.ready) backup.run(client);
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 3,
	"syntax" : [
		
	],
	"channels" : "console",
	"help" : "Create a backup of 'permanentData.json', and send it to the log channel"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "backup") return true;
	return false;
};