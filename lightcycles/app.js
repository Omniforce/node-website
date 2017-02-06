module.exports = function(app, io) {
	var express = require('express');

	app.use('/lightcycles/public', express.static(__dirname + '/public'));

	require('./socket.js')(io);
}