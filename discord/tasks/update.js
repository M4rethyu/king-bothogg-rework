exports.run = async (client) => {
	
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
	
};

exports.condition = (client) => {
	return false;
};