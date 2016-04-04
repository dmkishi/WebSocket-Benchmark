function getWebSocketURL() {
  var loc      = window.location;
  var protocol = (loc.protocol === 'https:') ? 'wss://' : 'ws://';
  return protocol + loc.host + loc.pathname;
}

var ws = new WebSocket(getWebSocketURL());
ws.onopen = function(evt) {
  ws.send('hi');
};
