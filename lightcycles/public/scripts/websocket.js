var WebSocket = (function (Player, Draw) {
	var socket = io.connect('http://brendanross.me:80');
	var waitingTimer;

	socket.on('connect', function() {
		Draw.initialize();
	});

	socket.on('updatePlayers', function(data) {
		var data = JSON.parse(data);
		Player.updatePlayers(data);
	});

	socket.on('updateSelection', function(selection) {
		stopWaitingTimer();
		Draw.drawSelection(selection);
	});

	socket.on('waiting', function() {
		if (!waitingTimer) {
			Draw.drawWaiting();
			waitingTimer = setInterval(function() {
				Draw.drawWaiting();
			}, 1000);
		}
	});

	socket.on('countdown', function(time) {
		stopWaitingTimer();
		Draw.drawCountdown(time);
	});

	socket.on('updateGame', function(data) {
		var game = JSON.parse(data);
		Draw.drawGame(game);
	});

	socket.on('gameOver', function(data) {
		var winner = JSON.parse(data);
		Draw.drawGameOver(winner);
	});

	function stopWaitingTimer() {
		if (waitingTimer) { 
			clearInterval(waitingTimer);
			waitingTimer = undefined;
		}
	}

	var module = {};
	module.updateName = function(name) {
		socket.emit('updateName', name);
	}
	module.updateColor = function(color) {
		socket.emit('updateColor', color);
	}
	module.ready = function(ready) {
		socket.emit('ready');
	}
	module.keypress = function(key) {
		socket.emit('keypress', key);
	}
	return module;

}(Player, Draw));