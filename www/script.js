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

// Send benchmark instruction to server and begin benchmark. Server should echo
// back the instruction as acknowledgement (and abort if otherwise.)
function startBenchmark(instruction) {
  newMsg('<li>Starting <i>' + instruction.name + '</i>.</li>');

  ws.onmessage = function(evt) {
    clearTimeout(instructionTimeout);

    if (evt.data !== JSON.stringify(instruction)) {
      newMsg('<li>ERROR: Bad response from server.</li>' +
             '<li>ERROR: Aborting benchmark.</li>');
    }

    var benchmarkFuncName = instruction.name.toLowerCase().replace(/ /,'');
    window[benchmarkFuncName](instruction);
  };

  var instructionTimeout = setTimeout(function() {
    newMsg('<li>ERROR: Server did not respond to benchmark instruction!</li>' +
           '<li>ERROR: Aborting benchmark.</li>');
  }, instruction.ttl);

  ws.send(JSON.stringify(instruction));
}


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
  startBenchmark({
    instruction:       true,
    name:              'Benchmark 1',
    description:       '',
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
function benchmark1(inst) {
  var data = makeBenchmark1Data(Math.floor(inst.benchmark_dur / inst.test_interval));

  setTimeout(function() {
    var benchmark_interval = setInterval(function() {
      if (data.length) ws.send(data.pop());
      else             clearInterval(benchmark_interval); 
    }, inst.interval);
  }, inst.time_to_benchmark);
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
