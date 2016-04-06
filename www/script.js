function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Get WebSocket URL assuming it's accessed at the root of the same host.
// E.g. http://localhost:8000               →  ws://localhost:8000
//      https://www.example.com/index.html  →  wss://www.example.com
function getWebSocketURL() {
  return window.location.origin.replace(/^http/i, 'ws');
}

// Append string "msg" into container element, ex. `newMsg('Hi!');`. Closure
// structure ensures the container element is sought only once without polluting
// the global namespace.
var newMsg = (function() {
  var container = document.getElementById('js-message-container');
  return function(msg) {
    container.innerHTML += msg;
  };
})();


// 1 ***************************************************************************
newMsg('<li>Starting benchmark.</li>');


// 2 ***************************************************************************
var url = getWebSocketURL();
newMsg('<li>Making WebSocket connection at <code>' + url + '</code>....</li>');


// 3 ***************************************************************************
var ws = new WebSocket(url);
ws.onerror = function(evt) {
  newMsg('<li>ERROR: Unable to connect!</li>' +
         '<li>ERROR: Ensure the companion Node.js app is running.</li>' +
         '<li>ERROR: Aborting benchmark.</li>');
};
ws.onopen = function(evt) {
  newMsg('<li>SUCCESS!</li>');
  doBenchmark1({
    instruction:       true,
    sig:               getRandomInt(0, 999999),
    name:              'Benchmark 1',
    description:       'sdasdfasdfasdf',
    time_to_benchmark: 1000,
    benchmark_dur:     1000,
    interval:          15,
    ttl:               3000
  });
};
ws.onmessage = function(evt) {
  console.log(evt);
};


// 4 ***************************************************************************
function doBenchmark1(instruction) {
  newMsg('<li>Starting <i>' + instruction.name + '</i>.</li>');
  ws.onmessage = function(evt) {
    window.clearTimeout(instruction_timeout);

    if (evt.data !== String(instruction.sig + 1)) {
      newMsg('<li>ERROR: Bad response from server.</li>' +
             '<li>ERROR: Aborting benchmark.</li>');
    }

    var data = makeBenchmark1Data(666);
    window.setTimeout(function() {
      var benchmark = window.setInterval(function() {
        if (!data.length) {
          window.clearInterval(benchmark);
        }
        ws.send(data.pop());
      }, instruction.interval);
    }, instruction.time_to_benchmark);
  };
  ws.send(JSON.stringify(instruction));
  var instruction_timeout = window.setTimeout(function() {
    newMsg('<li>ERROR: Server did not respond to benchmark instruction!</li>' +
           '<li>ERROR: Aborting benchmark.</li>');
  }, instruction.ttl);
}

function makeBenchmark1Data(cnt) {
  var data = [];
  for (var i = 0; i < cnt; ++i) {
    data.push(JSON.stringify({
      compass: Math.random(),
      roll:    Math.random(),
      pitch:   Math.random()
    }));
  }
  return data;
}
