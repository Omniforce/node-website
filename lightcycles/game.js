var Enum = require('enum');

function Game() {
	this.players = [];
	this.maxPlayers = 4;
	this.selectedMaxPlayers = 4;

	this.gameStates = new Enum(['menu', 'waiting', 'intro', 'playing', 'completed']);
	this.gameState = this.gameStates.menu;

	this.directions = new Enum(['up', 'down', 'left', 'right']);
	this.keyToDirection = {
		37: this.directions.left,
		38: this.directions.up,
		39: this.directions.right,
		40: this.directions.down
	}

	this.startingPlayerStates = [
		{ x: 10,  y: 60,  direction: this.directions.right },
		{ x: 110, y: 60,  direction: this.directions.left },
		{ x: 60,  y: 10,  direction: this.directions.down },
		{ x: 60,  y: 110, direction: this.directions.up }
	];

	this.walls = [];
	this.width = 120;
	this.height = 120;

	var instance = this;

	// ------------------------------------
	// |             PLAYERS              |
	// ------------------------------------

	this.addPlayer = function(socket) {
		if (this.players.length < this.maxPlayers) {
			var newPlayer = require('./player.js')(this.directions);

			socket.playerId = newPlayer.uuid;
			this.players.push(newPlayer);
		}
	}

	this.removePlayer = function(socket) {
		var i = getPlayerIndex(socket);
		if (i > -1) {
			this.players.splice(i, 1);
		}
	}

	this.getPlayer = function(socket) {
		return this.players.find(function(player) {
			return player.uuid == socket.playerId;
		});
	}

	this.isPlayer = function(socket) {
		var i = getPlayerIndex(socket);
		return i > -1;
	}

	this.getReadyPlayers = function() {
		return this.players.filter(function(player) {
			return player.isReady();
		});
	}

	this.getAlivePlayers = function() {
		return this.players.filter(function(player) {
			return player.alive;
		});
	}

	this.atMaxPlayers = function(socket) {
		return this.players.length >= this.maxPlayers;
	}

	this.changePlayerDirection = function(socket, key) {
		var currentPlayer = this.getPlayer(socket);
		var newDirection = this.keyToDirection[key];

		if (newDirection != getOppositeDirection(currentPlayer.previousDirection)) {
			currentPlayer.direction = newDirection;
		}
	}

	function getPlayerIndex(socket) {
		return instance.players.findIndex(function(player) {
			return player.uuid == socket.playerId;
		});
	}

	function getOppositeDirection(direction) {
		switch(direction) {
			case instance.directions.up:
				return instance.directions.down;
			case instance.directions.left:
				return instance.directions.right;
			case instance.directions.down:
				return instance.directions.up;
			default: // right
				return instance.directions.left;
		}
	}

	// ------------------------------------
	// |             Gameplay             |
	// ------------------------------------

	this.resetGame = function() {
		this.walls = [];

		var readyPlayers = this.getReadyPlayers();
		for(p in readyPlayers) {
			var player = readyPlayers[p];
			var startingState = this.startingPlayerStates[p];
			player.reset(startingState.x, startingState.y, startingState.direction);
		}
	}

	this.tick = function() {
		var alivePlayers = this.getAlivePlayers();
		for(p in alivePlayers) {
			var player = alivePlayers[p];
			player.move(this.walls);

			if (player.hasLeftBoundries(this.width, this.height) || player.hasHitWall(this.walls)) {
				player.alive = false;
				this.filterDeadPlayersWalls(player);
			}

			for(op in alivePlayers) {
				var otherPlayer = alivePlayers[op];
				if (player != otherPlayer && player.isTouchingPlayer(otherPlayer)) {
					player.alive = false;
					this.filterDeadPlayersWalls(player);

					otherPlayer.alive = false;
					this.filterDeadPlayersWalls(otherPlayer);
				}
			}
		}

		alivePlayers = this.getAlivePlayers();
		if (alivePlayers.length < 2) {
			this.gameState = this.gameStates.completed;
		}
	}

	this.jsonifyGame = function() {
		var plist = [];

		var alivePlayers = this.getAlivePlayers();
		for(p in alivePlayers) {
			var player = this.players[p];
			plist.push({
				x: player.x,
				y: player.y,
				color: player.color,
				alive: player.alive
			});
		}

		return { walls: this.walls, players: plist }
	}

	this.filterDeadPlayersWalls = function(player) {
		this.walls = this.walls.filter(function(segment) {
			return player.uuid != segment.playerId;
		});
	}
}

module.exports = function() {
	return new Game();
}