// Benchmark Instructions ------------------------------------------------------
var instructions = [
  {
    is_instruction: true,
    name:           'Benchmark 2',
    time_to_start:  1000,
    duration:       1000,
    interval:       15,
    time_to_live:   3000
  },
  {
    is_instruction: true,
    name:           'Benchmark 2',
    time_to_start:  1000,
    duration:       1000,
    interval:       10,
    time_to_live:   3000
  },
  {
    is_instruction: true,
    name:           'Benchmark 2',
    time_to_start:  1000,
    duration:       1000,
    interval:       5,
    time_to_live:   3000
  },
  {
    is_instruction: true,
    name:           'Benchmark 2',
    time_to_start:  1000,
    duration:       1000,
    interval:       3,
    time_to_live:   3000
  }
];


// Benchmark Formulas ----------------------------------------------------------
// Send dummy data to server at specified intervals
function benchmark2(instr, data) {
  var sampleLength = data[0].length;

  var benchmarkInterval = setInterval(function() {
    if (data.length) {
      ws.send(data.pop());
    } else {
      clearInterval(benchmarkInterval);
    }
  }, instr.interval);

  ws.onmessage = function(evt) {
    var msg = JSON.parse(evt.data);
    newMsg('<li>COMPLETED! ' + msg.i + '/' + msg.cnt + ' text frames ' +
           '(consisting of about ' + sampleLength + ' characters each) sent ' +
           'at ' + instr.interval + ' ms. intervals over a duration of ' +
           msg.total_dur + ' ms.</li>');
    benchmarks.next();
  };
}

// Make dummy motion orientation data
function benchmark2Data(instr) {
  var cnt = Math.floor(instr.duration / instr.interval);
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


// Lib -------------------------------------------------------------------------
// Initiate benchmark by sending benchmark instructions to the server, then
// immediately commence benchmark testing. Re instructions, we won't bother with
// server responses and assume succesful transmission; this keeps the code
// simple and makes timing calculations easier.
function Benchmarks(instructions) {
  this.instructions = instructions || [];
}
Benchmarks.prototype = {
  next: function() {
    if (this.instructions.length === 0) return this.end();

    var instruction = this.instructions.shift();

    // Do all prep work first...
    newMsg('<li>Starting <i>' + instruction.name + '</i>....</li>');
    var benchmarkFuncName     = instruction.name.toLowerCase().replace(/ /,'');
    var benchmarkDataFuncName = benchmarkFuncName + 'Data';
    var data = window[benchmarkDataFuncName](instruction);

    // ...then send instruction and begin benchmark testing.
    ws.send(JSON.stringify(instruction));
    setTimeout(function() {
      window[benchmarkFuncName](instruction, data);
    }, instruction.time_to_start);
  },
  start: function() {
    this.next();
  },
  end: function() {
    newMsg('<li>All benchmark tests completed.</li>');
  }
};

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



// Main ------------------------------------------------------------------------
newMsg('<li>Commencing benchmark tests.</li>');
var benchmarks = new Benchmarks(instructions);


var url = getWebSocketURL();
newMsg('<li>Establishing WebSocket connection at <code>' + url + '</code>....</li>');


var ws = new WebSocket(url);
ws.onerror = function(evt) {
  newMsg('<li>ERROR: Unable to connect!</li>' +
         '<li>ERROR: Ensure the companion Node.js app is running.</li>' +
         '<li>ERROR: Aborting benchmark.</li>');
};
ws.onmessage = function(evt) {
  // This shouldn't happen.
  console.error(evt);
};
ws.onopen = function(evt) {
  newMsg('<li>SUCCESS! WebSocket connection established.</li>');
  benchmarks.start();
};
