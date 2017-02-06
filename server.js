var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var logger = require('morgan');

app.use('/public', express.static(__dirname + '/public'));

server.listen(80);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

require('./lightcycles/app.js')(app, io);