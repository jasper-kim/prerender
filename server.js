#!/usr/bin/env node
var prerender = require('./lib');

//Disable the follwing code when testing locally
// var server = prerender({
//     chromeLocation: '/usr/bin/google-chrome-stable'
// });

//Disable the follwing code when deploying to web server
var server = prerender();

server.use(prerender.sendPrerenderHeader());
// server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.use(require('prerender-memory-cache'));

server.start();