const HTTP_PORT  = 8000;
const RELAY_PORT = 9999; // To pd, Max/MSP, etc.
const RELAY_NAME = 'pd'

var server  = require('http').createServer();
var express = require('express');
var app     = express();
var wss     = new (require('ws').Server)({ server: server });
var net     = require('net');
var colors  = require('colors');
var ip      = require('ip');


// Connect to relay application
console.log(`Connecting to ${RELAY_NAME} at port ${RELAY_PORT}...`);
var relay = net.connect(RELAY_PORT)
  .on('connect', () => {
    console.log(`${'SUCCESS!'.green} Relaying device motion data to `,
                `${RELAY_NAME}.`);
  })
  .on('error', () => {
    console.error(`${'ERROR'.red}: Failed to connect to ${RELAY_NAME}. Ensure`,
                  `the application is open with a patch listening to port`,
                  `${RELAY_PORT}.`);
    process.exit();
  })
  .on('close', () => {
    console.error(`${'ERROR'.red}: Disconnected from ${RELAY_NAME}.`);
    process.exit();
  });


// Start HTTP server
console.log('Starting up the HTTP server....');
app.use(express.static(__dirname + '/www'));
server.on('request', app);
server.listen(HTTP_PORT, () => {
  console.log(`${'SUCCESS!'.green} Serving at:`);
  console.log(`  http://localhost:${HTTP_PORT}`);
  console.log(`  http://${ip.address()}:${HTTP_PORT}`);
  console.log('Hit CTRL-C to exit.'.gray);
});


// Manage WebSockets
var users = [];
wss.on('connection', (ws) => {
  var uid = getUID();
  users.push(uid);
  console.log(`${'CONNECT'.green}: User ${uid} connected. Total users:`,
              `${users.length}`);

  ws.on('message', (msg) => {
    // console.log(`User ${uid}: ${msg}`);
    json = JSON.parse(msg);
    relay.write(`u${uid} ${json.compass} ${json.roll} ${json.pitch};`);
  });

  ws.on('close', () => {
    users.splice(users.indexOf(uid), 1);
    console.log(`${'DISCONNECT'.red}: User ${uid} disconnected. Total users:`,
                `${users.length}`);
  });
});
 

// Return smallest integer not in users[] starting from 0.
function getUID() {
  users.sort();
  for (var i = 0; i < users.length; ++i)
    if (i < users[i]) return i;
  return i;
}
