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
    name:              'Benchmark 1',
    description:       'sdasdfasdfasdf',
    time_to_benchmark: 1000,
    benchmark_dur:     1000,
    test_interval:     15,
    ttl:               3000
  });
};
ws.onmessage = function(evt) {
  // This shouldn't happen.
  console.error(evt);
};


// 4 ***************************************************************************
function doBenchmark1(inst) {
  newMsg('<li>Starting <i>' + inst.name + '</i>.</li>');
  ws.onmessage = function(evt) {
    window.clearTimeout(inst_timeout);

    if (evt.data !== JSON.stringify(inst)) {
      newMsg('<li>ERROR: Bad response from server.</li>' +
             '<li>ERROR: Aborting benchmark.</li>');
    }

    var data = makeBenchmark1Data(Math.floor(inst.benchmark_dur / inst.test_interval));
    window.setTimeout(function() {
      var benchmark = window.setInterval(function() {
        if (!data.length) {
          window.clearInterval(benchmark);
        }
        ws.send(data.pop());
      }, inst.interval);
    }, inst.time_to_benchmark);
  };
  
  ws.send(JSON.stringify(inst));
  var inst_timeout = window.setTimeout(function() {
    newMsg('<li>ERROR: Server did not respond to benchmark instruction!</li>' +
           '<li>ERROR: Aborting benchmark.</li>');
  }, inst.ttl);
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
