#!/usr/bin/env node
var prerender = require('./lib');

//Disable the follwing code when testing locally
// var server = prerender();

//Disable the follwing code when deploying to web server
var server = prerender({
    chromeLocation: "/usr/lib/chromium/chrome",
    chromeFlags: [
      "--headless",
      "--disable-gpu",
      "--remote-debugging-port=9222",
      "--hide-scrollbars",
      "--no-sandbox"
    ]
  });

server.use(prerender.sendPrerenderHeader());
server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
server.use(require('prerender-memory-cache-api'));

server.start();