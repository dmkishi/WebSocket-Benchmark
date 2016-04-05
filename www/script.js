var interval = 15;
var flash          = document.getElementById('js-flash'),
    compass_output = document.getElementById('js-compass-output'),
    roll_output    = document.getElementById('js-roll-output'),
    pitch_output   = document.getElementById('js-pitch-output'),
    compass, roll, pitch;


function getWebSocketURL() {
  var loc      = window.location,
      protocol = (loc.protocol === 'https:') ? 'wss://' : 'ws://';
  return protocol + loc.host + loc.pathname;
}


window.ondeviceorientation = function(evt) {
  compass = compass_output.innerHTML = evt.alpha;
  roll    = roll_output.innerHTML    = evt.beta;
  pitch   = pitch_output.innerHTML   = evt.gamma;
};


flash.innerHTML = 'Establishing WebSocket connection...';
var ws = new WebSocket(getWebSocketURL());
ws.onopen = function(evt) {
  flash.innerHTML = 'Success! WebSocket connection established.'
  setInterval(function() {
    ws.send(JSON.stringify({ compass: compass, roll: roll, pitch: pitch }));
  }, interval);
};
