exports.run = async (client, message, arguments, options, permission) => {
	
	var name = "xmarethyu";
	var amount = 1;
	
	
	var result = client.currency(name, amount);
	//*/
	
	console.log(client.persist("currency.amount." + name))
	console.log(result);
	
	return;
};

exports.config = {
	"cooldown" : 0,
	"sharedCooldown" : true,
	"permission" : 0,
	"syntax" : [
		
	],
	"channels" : "spam",
	"help" : "I'm using this to test code"
};

exports.condition = (client, message, arguments, options, permission) => {
	if (arguments._command === "test") return true;
	return false;
};