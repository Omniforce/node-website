const uuidV4 = require('uuid/v4');
const Moniker = require('moniker');
const randomColor = require('random-color');

function Player(directions) {
	this.uuid = uuidV4();
	this.name = Moniker.choose();
	this.color = randomColor(0.99, 0.99).hexString();
	this.ready = false;
	this.alive = false;
	this.directions = directions;

	this.direction;
	this.previousDirection;
	this.x;
	this.y;

	this.isReady = function() {
		return this.ready;
	}

	this.reset = function(x, y, direction) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.previousDirection = direction;
		this.alive = true;
	}

	this.move = function(walls) {
		walls.push({ playerId: this.uuid, x: this.x, y: this.y, color: this.color });
		this.previousDirection = this.direction;

		switch(this.direction) {
			case directions.up:
				this.y -= 1;
				break;
			case directions.left:
				this.x -= 1;
				break;
			case directions.down:
				this.y += 1;
				break;
			default: // right
				this.x += 1;
				break;
		}
	}

	this.isTouchingPlayer = function(player) {
		return (this.x == player.x && this.y == player.y);
	}

	this.hasHitWall = function(walls) {
		var x = this.x;
		var y = this.y;

		return walls.reduce(function(acc, segment) {
			return acc || (x == segment.x && y == segment.y);
		}, false);
	}

	this.hasLeftBoundries = function(boundX, boundY) {
		return (this.x < 0) || (this.x >= boundX) || (this.y < 0) || (this.y >= boundY);
	}
}

module.exports = function(directions) {
	return new Player(directions);
}