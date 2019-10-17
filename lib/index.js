const fs = require('fs');
const path = require('path');
const http = require('http');
const util = require('./util');
const basename = path.basename;
const server = require('./server');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');

exports = module.exports = (options = {}) => {
	const parsedOptions = Object.assign({}, {		
		port: options.port || process.env.PORT || 3000
	}, options)

	server.init(options);
	server.onRequest = server.onRequest.bind(server);

	app.disable('x-powered-by');
	app.use(compression());

	app.use('/api/:submitType', server.onRequest);

	app.get('*', server.onRequest);

	//dont check content-type and just always try to parse body as json
	app.post('*', bodyParser.json({ type: () => true }), server.onRequest);

	app.listen(parsedOptions, () => util.log(`Prerender server accepting requests on port ${parsedOptions.port}`))

	return server;
};

//Loop through files in /plugins folder
fs.readdirSync(__dirname + '/plugins').forEach((filename) => {
	//return nothing if type of file is not JavaScript
	if (!/\.js$/.test(filename)) return;
	//Exclude extension from filename
	var name = basename(filename, '.js');

	function load() {
		return require('./plugins/' + name);
	};
	//Assign funtion to exports object
	Object.defineProperty(exports, name, {
		value: load
	});
});