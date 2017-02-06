function Socket(io) {
	var game = require('./game.js')();
	var menu = require('./menu.js')();

	clients = [];

	var countdownSpeed = 1000;
	var tickSpeed = 18;

	io.on('connection', function (socket) {
		connect(socket);

		socket.on('updateName', function(name) { updateName(socket, name); });
		socket.on('updateColor', function(color) { updateColor(socket, color); });
		socket.on('ready', function() { ready(socket); });
		socket.on('keypress', function(key) { keypress(socket, key); })
		socket.on('disconnect', function() { disconnect(socket); });

	});

	function connect(socket) {
		clients.push(socket);

		if (!game.atMaxPlayers()) {
			game.addPlayer(socket);
		}
		sendPlayers();

		catchUp(socket);
	}

	function updateName(socket, name) {
		var player = game.getPlayer(socket);
		if (player) { player.name = name; }

		sendPlayers();
	}

	function updateColor(socket, color) {
		var player = game.getPlayer(socket);
		if (player) { player.color = color; }

		sendPlayers();
	}

	function catchUp(socket) {
		var gameState = game.gameState;

		if (gameState == game.gameStates.menu) {
			socket.emit('updateSelection', menu.selection);
		} else if (gameState == game.gameStates.waiting) {
			socket.emit('waiting');
		} else if (gameState == game.gameStates.playing) {
			socket.emit('updateGame', JSON.stringify(game.jsonifyGame()));
		} else if (gameState == game.gameStates.completed) {
			var alivePlayers = game.getAlivePlayers();
			data = (alivePlayers.length > 0) ? alivePlayers[0] : null;
			socket.emit("gameOver", JSON.stringify(data));
		} 
	}

	function ready(socket) {
		var player = game.getPlayer(socket);
		if (player) {
			player.ready = !player.ready;
			sendPlayers();
			tryStartingGame();
		}
	}

	function keypress(socket, key) {
		if (game.isPlayer(socket)) {
			var gameState = game.gameState;

			if (gameState == game.gameStates.menu) {
				if (key == 13) {
					game.selectedMaxPlayers = menu.selection;
					game.gameState = game.gameStates.waiting;
					tryStartingGame();
				} else {
					menu.updateSelection(key);
					io.emit('updateSelection', menu.selection);
				}
			} else if (gameState == game.gameStates.waiting) {
				if (key == 66) {
					game.gameState = game.gameStates.menu;
					io.emit('updateSelection', menu.selection);
				}
			} else if (gameState == game.gameStates.playing) {
				game.changePlayerDirection(socket, key);
			} else if (gameState == game.gameStates.completed) {
				if (key == 66) {
					game.gameState = game.gameStates.menu;
					io.emit('updateSelection', menu.selection);
				}
			}
		}
	}

	function tryStartingGame() {
		if(game.gameState == game.gameStates.waiting) {
			var readyPlayers = game.getReadyPlayers();
			if(readyPlayers.length >= game.selectedMaxPlayers) {
				game.gameState = game.gameStates.intro;
				startIntro(3);
			} else {
				io.emit('waiting');
			}
		}
	}

	function startIntro(time) {
		if (time > 0) {
			setTimeout(function() {
				io.emit("countdown", time);
				startIntro(time-1);
			}, countdownSpeed);
		} else {
			startGame();
		}
	}

	function startGame() {
		game.gameState = game.gameStates.playing;

		game.resetGame();
		tick();
	}

	function tick() {
		if (game.gameState == game.gameStates.playing) {
			game.tick();

			io.emit('updateGame', JSON.stringify(game.jsonifyGame()));
			setTimeout(tick, tickSpeed);
		} else {
			if (game.gameState == game.gameStates.completed) {
				gameOver();
			} else {
				game.gameState == game.gameStates.menu;
				menu.selection = 2;
				io.emit('updateSelection', menu.getSelection());
			}
		}
	}

	function gameOver() {
		var alivePlayers = game.getAlivePlayers();
		data = (alivePlayers.length > 0) ? alivePlayers[0] : null;
		io.emit("gameOver", JSON.stringify(data));
	}

	function disconnect(socket) {
		var i = clients.indexOf(socket);
		if (i > -1) { clients.splice(i, 1); }

		var player = game.getPlayer(socket);
		game.removePlayer(socket);
		game.filterDeadPlayersWalls(player);
		sendPlayers();

		if (noClients()) {
			game.gameState = game.gameStates.menu;
			menu.selection = 2;
		}
	}

	function sendPlayers() {
		for(c in clients) {
			var client = clients[c];
			var data = {
				"players": game.players,
				"currentPlayer": game.getPlayer(client)
			}
			client.emit("updatePlayers", JSON.stringify(data));
		}
	}

	function noClients() {
		return clients.length < 1;
	}
}

module.exports = Socket;