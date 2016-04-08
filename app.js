const HTTP_PORT  = 8000;

var server  = require('http').createServer();
var express = require('express');
var app     = express();
var wss     = new (require('ws').Server)({ server: server });
var colors  = require('colors');
var ip      = require('ip');


var benchmarks = {
  isActive: false,
  set: function(benchmarkName, ws, msg) {
    benchmarks.isActive = true;
    return benchmarks[benchmarkName](ws, msg);
  },
  benchmark1: function(ws, msg) {
    setTimeout(function() {
      ws.send(JSON.stringify({
        i:         i,
        cnt:       cnt,
        total_dur: endTime - startTime
      }));
      benchmarks.isActive = false;
    }, msg.time_to_live);

    var i         = 0;
    var cnt       = Math.floor(msg.duration / msg.interval);
    var startTime = Date.now() + msg.time_to_start;
    var endTime;

    return function(rawMsg) {
      console.log(++i);
      if (i === cnt) endTime = Date.now();
    };
  },
  benchmark2: function(ws, msg) {
    setTimeout(function() {
      ws.send(JSON.stringify({
        i:         i,
        cnt:       cnt,
        total_dur: endTime - startTime
      }));
      benchmarks.isActive = false;
    }, msg.time_to_live);

    var i         = 0;
    var cnt       = Math.floor(msg.duration / msg.interval);
    var startTime = Date.now() + msg.time_to_start;
    var endTime;

    return function(rawMsg) {
      var msg = JSON.parse(rawMsg);
      console.log(++i, msg);
      if (i === cnt) endTime = Date.now();
    };
  },
  benchmark3: function(ws, msg) {
    setTimeout(function() {
      benchmarks.isActive = false;
    }, msg.time_to_live);

    return function(rawMsg) {
      ws.send(rawMsg);
    }; 
  }
};



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
  console.log('WebSocket opened!'.green);

  var benchmark;

  ws.on('message', (rawMsg) => {
    if (!benchmarks.isActive) {
      var msg = JSON.parse(rawMsg);
      var benchmarkName = msg.name.toLowerCase().replace(/ /,'');
      benchmark = benchmarks.set(benchmarkName, ws, msg);
      console.log('New instruction:\n'.green, msg);
    } else {
      benchmark(rawMsg);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed!'.red);
  });
});
