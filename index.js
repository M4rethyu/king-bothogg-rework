async function main() {
	const tmi = require('tmi.js');
	
	require('dotenv').config();

	const fs = require("fs");
	const { promisify } = require("util");
	const readdir = promisify(require("fs").readdir);

	
	const client = {};
	// Load modules
	client.config = require("./config.json"); // Configuration settings
	client.spelling = require("./modules/spelling.json"); // Spelling correction
	client.answers = require("./modules/answers.json"); // Phrases used across the bot
	client.runeNames = require("./modules/runesReforged.json"); // RunesReforged
	client.runeNames.runeShards = {5001 : "Health", 5002 : "Armor", 5003 : "Magic Resist", 5005 : "Attack Speed", 5007 : "Cooldown Reduction", 5008 : "Adaptive Force"};
	client.erick = require("./modules/erick.json"); // Erick's account names
	client.erick.summonerRunes = [];
	client.dataStorage = require('data-store')({ path: "./modules/permanentData.json"}); // Set persistent storage location
	client.persist = (key, data) => { if (data != undefined) return client.dataStorage.set(key, data); else return client.dataStorage.get(key); }; // Rebind get & set functions
	
	// Set twitch configuration options
	const twitchConfig = require("./twitch/config.json");
	const twitch_opts = {
		identity: {
			username: process.env.TWITCH_USERNAME,
			password: process.env.TWITCH_TOKEN
		},
		channels: twitchConfig.channels
	};
	// Create and bind twitch client
	client.twitch = new tmi.client(twitch_opts); // Twitch Client
	client.twitch.config = twitchConfig;
	// Create and bind discord client
	const Discord = require("discord.js");
	client.discord = new Discord.Client();
	client.discord.config = require("./discord/config.json");
	// Create and bind league client
	const {Kayn, REGIONS} = require('kayn')
	client.league = Kayn(process.env.LEAGUE_TOKEN)({ // Set configuration options
		region: REGIONS.NORTH_AMERICA,
		apiURLPrefix: 'https://%s.api.riotgames.com',
		locale: 'en_US',
		debugOptions: {
			isEnabled: true,
			showKey: false,
		},
		requestOptions: {
			shouldRetry: true,
			numberOfRetriesBeforeAbort: 3,
			delayBeforeRetry: 1000,
			burst: false,
			shouldExitOn403: false,
		},
		cacheOptions: {
			cache: null,
			timeToLives: {
				useDefault: false,
				byGroup: {},
				byMethod: {},
			},
		},
	});
	client.league.config = require("./league/config.json");
	
	require("./discord/functions.js")(client); // Bind functions directly to client
	require("./twitch/functions.js")(client); // Bind functions directly to client
	require("./functions.js")(client); // Bind functions directly to client
	require("./modules/functions.js")(client); // Bind functions directly to client
	
	(async () => { client.twitch.liveStatus = await client.twitch.live("king_nidhogg") })(); // Initiate live status
	
	client.getSummonerAccounts();
	
	client.config.hosted = client.checkHosted(); // Tests if this program is running on glitch
	if (client.config.hosted) {
		const http = require('http');
		const express = require('express');
		const app = express();
		
		if (!(process.env.RUN == "true")) {
			app.get("/", (request, response) => { response.sendStatus(204); });
		app.listen(process.env.PORT);
		}
		
		while (!(process.env.RUN == "true")) {
			client.log("log", "bot is idle");
			await (function(){ return new Promise(resolve => setTimeout(resolve, 5000)); })();
		}
		
		app.get("/", (request, response) => { response.sendStatus(200); });
		app.listen(process.env.PORT);
		setInterval(() => {
			http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
		}, 280000);
	}
	
	
	const init = async () => {
		
		// Twitch command order
		var commandOrder = ["ping", "template"]; // Order, in which the commands will be tested
		var responseOrder = ["erick", "nidhogg", "runes"]; // Order, in which the autoresponses will be tested
		client.twitch.unconditionalResponses = ["erick", "nidhogg"]; // Autoresponses, which will trigger no matter what other things are also triggered by the message
		
		// Load twitch commands
		var cmdMap = new Map();
		var cmdFiles = await readdir("./twitch/commands");
		client.log("log", `Loading a total of ${cmdFiles.length} twitch commands...`);
		cmdFiles.forEach((file, i) => {
			if (!file.endsWith(".js")) return; // only load .js files
			const commandName = file.slice(0,-3)
			client.log("log", `Loading Command: ${commandName}`);
			const command = require(`./twitch/commands/${file}`);
			cmdMap.set(commandName,
				{
					"run" : command.run,
					"condition" : command.condition,
					"config" : command.config,
					"onCooldown" : []
				}
			)
		});
		// Sort twitch commands
		client.twitch.commands = new Map();
		client.log("log", "Sorting twitch commands...");
		commandOrder.forEach(function(element) {
			if (!cmdMap.has(element)) return; // Skip name if corresponding command doesn't exist
			client.twitch.commands.set(element, cmdMap.get(element));
			cmdMap.delete(element);
		});
		client.twitch.commands = new Map([...client.twitch.commands,...cmdMap]);
		client.log("log", "Done sorting twitch commands");
		
		// Load twitch responses
		var resMap = new Map();
		var resFiles = await readdir("./twitch/responses");
		client.log("log", `Loading a total of ${resFiles.length} twitch responses...`);
		resFiles.forEach((file, i) => {
			if (!file.endsWith(".js")) return; // only load .js files
			const responseName = file.slice(0,-3)
			client.log("log", `Loading Response: ${responseName}`);
			const response = require(`./twitch/responses/${file}`);
			resMap.set(responseName,
				{
					"run" : response.run,
					"condition" : response.condition,
					"config" : response.config,
					"onCooldown" : []
				}
			)
		});
		
		// Sort twitch responses
		client.twitch.responses = new Map();
		client.log("log", "Sorting twitch responses...");
		responseOrder.forEach(function(element) {
			if (!resMap.has(element)) return; // Skip name if corresponding response doesn't exist
			client.twitch.responses.set(element, resMap.get(element));
			resMap.delete(element);
		});
		client.twitch.responses = new Map([...client.twitch.responses,...resMap]);
		client.log("log", "Done sorting twitch responses");
		
		// Load twitch events
		var evtFiles = await readdir("./twitch/events/");
		client.log("log", `Loading a total of ${evtFiles.length} twitch events...`);
		evtFiles.forEach(file => {
			const eventName = file.split(".")[0];
			client.log("log", `Loading Event: ${eventName}`);
			const event = require(`./twitch/events/${file}`);
			// Bind the client to any event, before the existing arguments
			// provided by the twitch.js event.
			// This line is awesome by the way. Just sayin'.
			client.twitch.on(eventName, event.bind(null, client));
		});
		client.log("log", "Done loading twitch events.");
		
		// Load twitch tasks
		client.twitch.tasks = new Map()
		var actFiles = await readdir("./twitch/tasks/");
		client.log("log", `Loading a total of ${actFiles.length} twitch tasks...`);
		actFiles.forEach(file => {
			const taskName = file.split(".")[0];
			client.log("log", `Loading task: ${taskName}`);
			const task = require(`./twitch/tasks/${file}`);
			client.twitch.tasks.set(taskName,
				{
					"run" : task.run,
					"condition" : task.condition,
					"config" : task.config,
					"lastUsed" : null
				}
			)
		});
		client.log("log", "Done loading twitch tasks.")
		
		
		// Discord command order
		commandOrder = ["ping", "template"]; // Order, in which the commands will be tested
		responseOrder = ["erick", "nidhogg", "runes"]; // Order, in which the autoresponses will be tested
		client.discord.unconditionalResponses = ["erick", "nidhogg"]; // Autoresponses, which will trigger no matter what other things are also triggered by the message
		
		// Load discord commands
		cmdMap = new Map();
		cmdFiles = await readdir("./discord/commands");
		client.log("log", `Loading a total of ${cmdFiles.length} discord commands...`);
		cmdFiles.forEach((file, i) => {
			if (!file.endsWith(".js")) return; // only load .js files
			const commandName = file.slice(0,-3)
			client.log("log", `Loading Command: ${commandName}`);
			const command = require(`./discord/commands/${file}`);
			cmdMap.set(commandName,
				{
					"run" : command.run,
					"condition" : command.condition,
					"config" : command.config,
					"lastUsed" : null
				}
			)
		});
		// Sort discord commands
		client.discord.commands = new Map();
		client.log("log", "Sorting discord commands...");
		commandOrder.forEach(function(element) {
			if (!cmdMap.has(element)) return; // Skip name if corresponding command doesn't exist
			client.discord.commands.set(element, cmdMap.get(element));
			cmdMap.delete(element);
		});
		client.discord.commands = new Map([...client.discord.commands,...cmdMap]);
		client.log("log", "Done sorting discord commands");
		
		// Load discord responses
		resMap = new Map();
		resFiles = await readdir("./discord/responses");
		client.log("log", `Loading a total of ${resFiles.length} discord responses...`);
		resFiles.forEach((file, i) => {
			if (!file.endsWith(".js")) return; // only load .js files
			const responseName = file.slice(0,-3)
			client.log("log", `Loading Response: ${responseName}`);
			const response = require(`./discord/responses/${file}`);
			resMap.set(responseName,
				{
					"run" : response.run,
					"condition" : response.condition,
					"config" : response.config,
					"lastUsed" : null
				}
			)
		});
		
		// Sort discord responses
		client.discord.responses = new Map();
		client.log("log", "Sorting discord responses...");
		responseOrder.forEach(function(element) {
			if (!resMap.has(element)) return; // Skip name if corresponding response doesn't exist
			client.discord.responses.set(element, resMap.get(element));
			resMap.delete(element);
		});
		client.discord.responses = new Map([...client.discord.responses,...resMap]);
		client.log("log", "Done sorting discord responses");
		
		// Load discord events
		evtFiles = await readdir("./discord/events/");
		client.log("log", `Loading a total of ${evtFiles.length} discord events...`);
		evtFiles.forEach(file => {
			const eventName = file.split(".")[0];
			client.log("log", `Loading Event: ${eventName}`);
			const event = require(`./discord/events/${file}`);
			// Bind the client to any event, before the existing arguments
			// provided by the discord.js event.
			// This line is awesome by the way. Just sayin'.
			client.discord.on(eventName, event.bind(null, client));
		});
		client.log("log", "Done loading discord events.");
		
		// Load discord events
		client.discord.ranks = new Map();
		rankFiles = await readdir("./discord/ranks/");
		client.log("log", `Loading a total of ${rankFiles.length} discord ranks...`);
		rankFiles.forEach(file => {
			const rankName = file.split(".")[0];
			client.log("log", `Loading Rank: ${rankName}`);
			const rank = require(`./discord/ranks/${file}`);
			client.discord.ranks.set(rankName, rank.config);
			client.discord.ranks.get(rankName).help = rank.help;
		});
		client.log("log", "Done loading discord ranks.");
		
		// Load discord tasks
		client.discord.tasks = new Map()
		actFiles = await readdir("./discord/tasks/");
		client.log("log", `Loading a total of ${actFiles.length} discord tasks...`);
		actFiles.forEach(file => {
			const taskName = file.split(".")[0];
			client.log("log", `Loading task: ${taskName}`);
			const task = require(`./discord/tasks/${file}`);
			client.discord.tasks.set(taskName,
				{
					"run" : task.run,
					"condition" : task.condition,
					"config" : task.config,
					"lastUsed" : null
				}
			)
		});
		client.log("log", "Done loading discord tasks.")
		
		
		// Log in twitch client
		client.twitch.connect();
		
		// Log in discord client
		var token;
		if (client.discord.config.testing) token = process.env.DISCORD_TESTTOKEN;
		else token = process.env.DISCORD_TOKEN;
		client.discord.login(token);
	};


	try {
		init();
	} catch(err) {
		client.log("error", err);
	}
}
main();