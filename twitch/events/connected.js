module.exports = async (client, address, port) => {
	client.log("log", "Twitch bot has started"); 
	
	// Get summoner accounts
	client.erick.summonerAccounts = await client.getSummonerAccounts();
	client.log("log", "loaded the LoL accounts: " + Array.from(client.erick.summonerAccounts, o => o.name).join(", "));
	
	for (const entry of client.twitch.tasks) {
		client.taskTime(entry);
		client.taskCooldown(entry);
	}
	
	return;
	
	if (client.league.config.active) {
		(async () => { // Initialize LoL stuff
			// Get LoL Accounts
			client.erick.summonerAccounts = await client.getSummonerAccounts();
			client.log("log", "loaded the LoL accounts: " + Array.from(client.erick.summonerAccounts, o => o.name).join(", "));
			
			// Get runes for active account
			setTimeout(function(){
				client.actions.get("runes").run(client);
			}, 1 * 1000);
		})();
	}
	
	
	const cooldown = {};
	// Set all actions on cooldown initially
	client.actions.forEach((functions, name) => {
		functions.onCooldown = true;
		setTimeout(async function() {
			functions.onCooldown = false;
		}, functions.config.cooldown * 1000);
	});
	
	
	// Run all actions that are off cooldown every 10 seconds
	setInterval(async function() {
		client.actions.forEach((functions, name) => {
			if (!functions.onCooldown && functions.condition(client)) {
				functions.run(client);
				functions.onCooldown = true;
				setTimeout(async function() {
					functions.onCooldown = false;
				}, functions.config.cooldown * 1000);
			}
		});
	}, 10010) // A little extra, so this isn't executed before the cooldown is reset
	
	
	// Resets the !daily command at 3pm EST
	resetDaily = () => {
		// Reset   daily    at                                 EST               3pm
		const t = (24 * 3600 * 1000) - (new Date().getTime() - 5 * 3600 * 1000 - 15 * 3600 * 1000)%(24 * 3600 * 1000);
		setTimeout(async function() {
			client.dataStorage.del("currency.usedDaily");
			resetDaily();
		}, t);
		const hours = Math.floor(t/(3600 * 1000))
		client.log("log", "resetting daily in " + hours + " hours, " + Math.floor((t - hours * 3600 * 1000)/(60 * 1000)) + " minutes");
	}
	resetDaily();
	
	
	return;
}