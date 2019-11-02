exports.run = async (client, message, arguments, options, permission) => {
	
	for (const opt of options) {
		const name = opt[0];
		const args = opt[1];
		switch(name)	{
			case "u":
				if (client.config.hosted) client.discord.commands.get("update").run(client);
				else client.log("warn", "didn't run '!update', because program isn't running on glitch");
				break;
			case "b":
				const backup = client.discord.tasks.get("backup");
				if (backup.config.ready) backup.run(client);
				break;
			default:
				client.log("warn", "used '" + name + "' as an option in shortcuts, has no function");
				break;
		}
	}
	
	message.delete().catch(e => client.log("error", e));
	
	return;
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		"channel_c:this user_u:this number_n:0 role_r"
	],
	"channels" : "spam",
	"help" : "Shortcut syntax to avoid typing out commands"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._string.trim() == "" && !message.content.trim() == "" ) return true;
	return false;
};