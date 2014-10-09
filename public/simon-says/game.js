$(function() {
	var game = new Game();

	$('#start').click(function() {
		game.startGame();
	});
});

function Game() {
	this.sequence = [];
	this.copy = [];
	this.score = 0;
	this.tiles = [$('#green'), $('#red'), $('#yellow'), $('#blue')];

	// ------------------- Game Logic ------------------

	this.startGame = function() {
		$('#start').hide();
		$('#score').show();

		this.sequence = [];
		this.copy = [];
		this.score = 0;

		$('.scoreValue').each(function() {
			$(this).html(0);
		});

		this.newRound();
	}

	this.newRound = function() {
		this.sequence.push(this.randomTile());
		this.copy = this.sequence.slice(0);
		this.display();
	}

	this.checkGame = function(correctInput) {
		if(this.copy.length == 0 && correctInput) {
			this.updateScore();
			this.denyUserInput();
			this.newRound();
		} else if(!correctInput) {
			this.denyUserInput();
			this.endGame();
		}
	}

	this.endGame = function() {
		$('#score').hide();
		$('#gameOver').show();
		setTimeout(function() {
			$('#gameOver').hide();
			$('#start').show();
		}, 3000);
	}

	this.randomTile = function() {
		return Math.floor((Math.random()*4) + 1);
	}

	// ------------------ User Interaction ------------------

	this.allowUserInput = function() {
		var thisGame = this;

		if (Modernizr.touch) {
			$('#simon').on('touchstart', '.tile', function() {
				$(this).addClass('active');
			}).on('touchend', '.tile', function(e) {
				$(this).removeClass('active');
				thisGame.userClick(e);
			});
		} else {
			$('#simon').on('click', '.tile', function(e) {
				thisGame.userClick(e);
			}).on('mousedown', '.tile', function() {
				$(this).addClass('active');
			}).on('mouseup', '.tile', function() {
				$(this).removeClass('active');
			});
		}

		$(window).on('keydown', function() {
			if(event.keyCode === 37 || event.keyCode === 65) { // Yellow (Left and A)
				thisGame.tiles[2].addClass('active');
			} else if(event.keyCode === 38 || event.keyCode === 87) { // Green (Up and W)
				thisGame.tiles[0].addClass('active');
			} else if(event.keyCode === 39 || event.keyCode === 68) { // Red (Right and D)
				thisGame.tiles[1].addClass('active');
			} else if(event.keyCode === 40 || event.keyCode === 83) { // Blue (Down and S)
				thisGame.tiles[3].addClass('active');
			}
		});
		$(window).on('keyup', function() {
			var sudoEvent = {};

			if(event.keyCode === 37 || event.keyCode === 65) { // Yellow (Left and A)
				thisGame.tiles[2].removeClass('active');
				sudoEvent.target = thisGame.tiles[2];
			} else if(event.keyCode === 38 || event.keyCode === 87) { // Green (Up and W)
				thisGame.tiles[0].removeClass('active');
				sudoEvent.target = thisGame.tiles[0];
			} else if(event.keyCode === 39 || event.keyCode === 68) { // Red (Right and D)
				thisGame.tiles[1].removeClass('active');
				sudoEvent.target = thisGame.tiles[1];
			} else if(event.keyCode === 40 || event.keyCode === 83) { // Blue (Down and S)
				thisGame.tiles[3].removeClass('active');
				sudoEvent.target = thisGame.tiles[3];
			} else {
				return;
			}
			thisGame.userClick(sudoEvent);
		});
	}

	this.denyUserInput = function() {
		$('#simon').off('click mousedown mouseup touchstart touchend', '.tile');
		$(window).off('keydown keyup');
	}

	this.userClick = function(e) {
		var clickedTile = $(e.target).attr('class').slice(-1);
		var isCorrect = clickedTile == this.copy.shift();
		this.checkGame(isCorrect);
	}

	// ------------------ Display ------------------

	this.display = function() {
		var i = 0;
		var thisGame = this;
		var interval = setInterval(function() {
			thisGame.lightUpTiles(thisGame.sequence[i]);
			i++;

			if(i >= thisGame.sequence.length) {
				clearInterval(interval);
				thisGame.allowUserInput();
			}
		}, 600);
	}

	this.lightUpTiles = function(tile) {
		$tile = $('.'+tile);
		$tile.animate({
			opacity: 1
		}, 250, function() {
			setTimeout(function() {
				$tile.css('opacity', 0.6);
			}, 250);
		});
	}

	this.updateScore = function(score) {
		var score = this.score++;
		$('.scoreValue').each(function() {
			$(this).html(score + 1);
		});
	}
}