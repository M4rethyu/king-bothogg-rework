module.exports = async (client) => {
	client.log("log+", "Discord bot has started"); 
	client.discord.user.setStatus('available');
	
	for (const entry of client.discord.tasks) {
		client.taskTime(entry);
		client.taskCooldown(entry);
	}
	
	
};