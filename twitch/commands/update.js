exports.run = async (client, message, channel, userstate, arguments, options) => {
	
	client.log("log+", "UPDATING REPOSITORY");
	
	const exec = require("child_process").exec;
	
	exec("git pull", (err, stdout, stderr) => {
		process.stdout.write(stdout)
	});
	setTimeout(function() {
		exec("refresh", (err, stdout, stderr) => {
			process.stdout.write(stdout)
		});
	}, 1000);
	
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		
	],
	"channels" : "chat",
	"help" : "Updates the repository."
};

exports.condition = (client, message, channel, userstate, arguments, options) => {
	if (arguments._command === "update") return true;
	return false;
};