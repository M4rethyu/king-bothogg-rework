/*
const http = require('http');
const fs = require('fs');
const port = 53134;

http.createServer((req, res) => {
	let responseCode = 404;
	let content = '404 Error';

	if (req.url === '/') {
		responseCode = 200;
		content = fs.readFileSync('./server.html');
	}
	
	console.log(req);
	
	res.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
	});

	res.write(content);
	res.end();
})
	.listen(port, () => console.log(arguments));
*/
const http = require('http');
const fs = require('fs');
const url = require('url');
const fetch = require('node-fetch');
const FormData = require('form-data');

const port = 53134;

http.createServer((req, res) => {
	let responseCode = 404;
	let content = '404 Error';

	const urlObj = url.parse(req.url, true);

	console.log(urlObj)

	if (urlObj.query.code) {
		const accessCode = urlObj.query.code;
		const data = new FormData();

		data.append('client_id', '630038787941990414');
		data.append('client_secret', '-DmSDa48E10W6fDxixk16pyuuBJd6MMp');
		data.append('grant_type', 'authorization_code');
		data.append('redirect_uri', 'http://localhost:53134/');
		data.append('scope', 'connections');
		data.append('code', accessCode);

		fetch('https://discordapp.com/api/oauth2/token', {
			method: 'POST',
			body: data,
		})
			.then(discordRes => discordRes.json())
			.then(info => {
				console.log(info);
				return info;
			})
			.then(info => fetch('https://discordapp.com/api/users/@me', {
				headers: {
					authorization: `${info.token_type} ${info.access_token}`,
				},
			}))
			.then(userRes => userRes.json())
			.then(console.log);
	}

	if (urlObj.pathname === '/') {
		responseCode = 200;
		content = fs.readFileSync('./server.html');
	}

	res.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
	});

	res.write(content);
	res.end();
})
	.listen(port);