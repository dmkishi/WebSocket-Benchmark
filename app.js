var express = require('express');
var WebSocket = require('ws');

var app = express();
app.set('port', process.env.PORT || 8080);
app.disable('x-powered-by');

app.use(express.static(__dirname + '/public'));

//var ws = new WebSocket('ws://localhost');

app.listen(app.get('port'), () => {
  console.log(`Express started in ${app.get('env')} mode on http://localhost:${app.get('port')}`);
});
