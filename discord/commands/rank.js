exports.run = async (client, message, arguments, options, permission) => {
	const channel = message.channel;
	
	target = arguments.member;
	silent = (options.get("s")?true:false);
	
	
	
	if (arguments.rank == null) {
		if (!silent) channel.send(message.author + ", please specify a rank");
		return false;
	}
	
	var abbreviation = arguments.rank.trim();
	abbreviation = abbreviation.toLowerCase();
	
	var rank;
	for (const entry of client.discord.ranks) {
		if (entry[1].abbreviation == abbreviation) {
			rank = entry[1];
			break;
		}
	}
	
	if (typeof rank == "undefined") {
		if (!silent) channel.send(message.author + ", this rank doesn't exist");
		return false;
	}
	
	if (rank.permission < permission) {
		if (!silent) channel.send(message.author + ", you can't assign this rank.");
		return false;
	}
	
	const role = message.guild.roles.find(r => r.id == rank.roleID);
	if (!role) {
		if (!silent) channel.send(message.author + ", this rank's role doesn't exist. Please ping a mod, if you think this is unintended");
		return false;
	}
	
	if (!(target.id == message.author.id) && permission > 3) {
		if (!silent) channel.send(message.author + ", you don't have permission to assign ranks to others");
	}
	
	if (target.roles.find(r => r.id == rank.roleID)) {
		target.removeRole(role)
			.then(
				function(){ if (!silent) channel.send(target + ", you no longer have the '" + rank.name + "' rank"); },
				function(){ if (!silent) channel.send(message.author + ", unfortunately I don't have permission to unassign the '" + rank.name + "' rank"); }
			)
		
	} else {
		target.addRole(role)
			.then(
				function(){ if (!silent) channel.send(target + ", you now have the '" + rank.name + "' rank"); },
				function(){ if (!silent) channel.send(message.author + ", unfortunately I don't have permission to assign the '" + rank.name + "' rank"); }
			)
	}
	
	return;
	
	var target = args[1];
	var targetID;
	if (typeof target == "undefined") {
		target = message.member;
	} else {
		if (permission > 3) {
			if (!silent) channel.send(message.author + ", you don't have permission to assign ranks to others");
			return false;
		}
		if (/<@!\d{1,}>/.test(target)) {
			targetID = target.substring(3,21);
			target = message.guild.members.find(m => m.id == targetID);
		} else if (/<@\d{1,}>/.test(target)) {
			targetID = target.substring(2,20);
			target = message.guild.members.find(m => m.id == targetID);
		} else {
			channel.send(message.author + ", please mention a user to assign a rank (!rank [rank] ([user]))");
			return false;
		}
	}
	
	if (target.roles.find(r => r.id == rank.roleID)) {
		target.removeRole(role)
			.then(
				function(){ channel.send(target + ", you no longer have the '" + rank.name + "' rank"); },
				function(){ channel.send(message.author + ", unfortunately I don't have permission to unassign the '" + rank.name + "' rank"); }
			)
		
	} else {
		target.addRole(role)
			.then(
				function(){ channel.send(target + ", you now have the '" + rank.name + "' rank"); },
				function(){ channel.send(message.author + ", unfortunately I don't have permission to assign the '" + rank.name + "' rank"); }
			)
	}
	
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : false,
	"permission" : 5,
	"syntax" : [
		"rank_w member_m:this"
	],
	"usage" : [
		"[rank] ([user : you])"
	],
	"channels" : "spam",
	"help" : "Assign a rank to yourself, or a user"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "rank") return true;
	return false;
};