const HTTP_PORT  = 8000;

var server  = require('http').createServer();
var express = require('express');
var app     = express();
var wss     = new (require('ws').Server)({ server: server });
var colors  = require('colors');
var ip      = require('ip');



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
wss.on('connection', (ws) => {
  var i, cnt, startTime, endTime;

  console.log('WebSocket opened!'.green);

  ws.on('message', (raw_msg) => {
    msg = JSON.parse(raw_msg);

    if (msg.instruction) {
      ws.send(raw_msg);
      i         = 0;
      cnt       = Math.floor(msg.benchmark_dur / msg.test_interval);
      startTime = Date.now() + msg.time_to_benchmark;
      setTimeout(function() {
        console.log(`${i}/${cnt}`);
        console.log(`Total duration: ${endTime - startTime}`);
      }, msg.ttl);
    } else {
      console.log(++i, msg);
      if (i === cnt) endTime = Date.now();
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed!'.red);
  });
});
