module.exports = async (client, address, port) => {
	client.log("log", "Twitch bot has started"); 
	
	// Get summoner accounts
	if (client.league.config.active) {
		client.erick.summonerAccounts = await client.getSummonerAccounts();
		client.log("log", "loaded the LoL accounts: " + Array.from(client.erick.summonerAccounts, o => o.name).join(", "));
	}
	
	for (const entry of client.twitch.tasks) {
		client.taskTime(entry);
		client.taskCooldown(entry);
	}
	
	return;
}