var Draw = (function () {
	var canvas, context, width, height, cellSize, dots;

	var module = {};

	module.initialize = function() {
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		context.textAlign="center"; 

		width = 600;
		height = 600;
		centerX = width/2;
		cellSize = 5;
		dots = ".";
	}

	module.clearScreen = function() {
		context.clearRect(0, 0, width, height);
	}

	module.drawBoard = function() {
		context.fillStyle = "#000000";
		context.fillRect(0, 0, width, height);
	}

	module.drawSelectScreen = function() {
		context.font = '50pt Gothic';
		context.fillStyle = '#18CAE6';
		context.fillText("TRON", centerX, 250)

		context.font = '30pt Gothic';
		context.fillStyle = 'white';
		context.fillText('Select Number of Players', 300, 300);

		context.font = '15pt Gotchic';
		context.fillText('2 players', centerX, 340);
		context.fillText('3 players', centerX, 370);
		context.fillText('4 players', centerX, 400);
	}

	module.drawSelection = function(selection) {
		module.clearScreen();
		module.drawBoard();
		module.drawSelectScreen();

		y = 280 + (selection * 30);
		context.beginPath();
	    context.moveTo(250, y-5);
	    context.lineTo(240, y-15);
	    context.lineTo(240, y+5);
	    context.fillStyle = 'white';
	    context.fill();
	}

	module.drawWaiting = function() {
		module.clearScreen();
		module.drawBoard();

		context.font = '20pt Gothic';
		context.fillStyle = 'white';
		context.fillText('Waiting for enough players to be ready' + dots, centerX, 250);

		context.font = '15pt Gothic';
		context.fillText('Press b to return to menu', centerX, 330);

		if(dots.length >= 3) { dots = "."; }
		else { dots += "."; }
	}

	module.drawCountdown = function(time) {
		module.clearScreen();
		module.drawBoard();

		context.font = "30px Gothic";
		context.fillStyle = 'white';
		context.fillText(time, centerX, 300);
	}

	module.drawGame = function(game) {
		var players = game.players;
		var walls = game.walls;

		module.clearScreen();
		module.drawBoard();


		drawPlayers(players);
		drawWalls(walls);
	}

	module.drawGameOver = function(winner) {
		module.clearScreen();
		module.drawBoard();

		context.font = '50pt Gothic';
	    context.fillStyle = 'white';
	    context.fillText("GAME OVER", centerX, 250);

	   	context.font = '30pt Gothic';
	    if(winner) {
	    	context.fillStyle = winner.color;
		    context.fillText(winner.name + " wins!", centerX, 300);
		} else {
			context.fillText("It's a tie!", centerX, 300);
		}

	    context.font = '15pt Gothic';
	    context.fillStyle = 'white';
	    context.fillText("Press b to return to the menu", centerX, 360)
	}

	function drawPlayers(players) {
		for(p in players) {
			var player = players[p];

			var x = player.x * cellSize;
			var y = player.y * cellSize;
			context.fillStyle = player.color;
			context.fillRect(x, y, cellSize, cellSize);
		}
	}

	function drawWalls(walls) {
		for(w in walls) {
			var segment = walls[w];

			x = segment.x * cellSize;
			y = segment.y * cellSize;
			context.fillStyle = segment.color;
			context.fillRect(x, y, cellSize, cellSize);	
		}
	}

	return module;
}());