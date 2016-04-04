var express = require('express');

var app = express();
app.set('port', process.env.PORT || 8080);
app.disable('x-powered-by');
