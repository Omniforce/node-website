var canvas;
var context;
var width = 600;
var height = 600;
var cellSize = 5;
var dots = "."

function drawBoard(ctx) {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, width, height);
}

function drawPlayers(ctx, game) {
	if(game.player1.alive){
		drawPlayer(ctx, game.player1.x, game.player1.y, game.player1.color);
	}
	if(game.player2.alive){
		drawPlayer(ctx, game.player2.x, game.player2.y, game.player2.color);
	}
	if(game.player3.alive) {
		drawPlayer(ctx, game.player3.x, game.player3.y, game.player3.color);
	}
	if(game.player4.alive) {
		drawPlayer(ctx, game.player4.x, game.player4.y, game.player4.color);
	}
}

function drawPlayer(ctx, gridx, gridy, color) {
	var x = gridx * cellSize;
	var y = gridy * cellSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, cellSize, cellSize);
}

function drawGameOver(ctx, currentPlayer, winningPlayer) {
	ctx.font = '50pt Gothic';
    ctx.fillStyle = 'white';
    ctx.fillText("GAME OVER", 105, 250);

   	ctx.font = '30pt Gothic';
    if(winningPlayer) {
	    ctx.fillText(winningPlayer + " wins!", 190, 300);
	} else {
		ctx.fillText("It's a tie!", 230, 300);
	}

    ctx.font = '15pt Gothic';
    ctx.fillText("Press r to restart", 235, 330);

    if(currentPlayer === 1) {
    	ctx.fillText("Press b to return to the menu", 190, 350)
    }
}

function drawSelectScreen(ctx) {
	ctx.font = '50pt Gothic';
	ctx.fillStyle = '#18CAE6';
	ctx.fillText("TRON", 200, 250)

	ctx.font = '30pt Gothic';
	ctx.fillStyle = 'white';
	ctx.fillText('Select Number of Players', 100, 300);

	ctx.font = '15pt Gotchic';
	ctx.fillText('2 players', 250, 340);
	ctx.fillText('3 players', 250, 370);
	ctx.fillText('4 players', 250, 400);
}

function drawPointer(ctx, selection) {
	drawBoard(ctx);
	drawSelectScreen(ctx);

	y = 280 + (selection * 30);
	ctx.beginPath();
    ctx.moveTo(230, y-5);
    ctx.lineTo(220, y-15);
    ctx.lineTo(220, y+5);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function initialize() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");

	drawBoard(context);
}

function drawWaiting(ctx){
	drawBoard(ctx);
	ctx.font = '30 Gothic'
	ctx.fillStyle = 'white';
	ctx.fillText('Waiting for players' + dots, 180, 300);

	if(dots.length >= 3) { dots = "."; }
	else { dots += "."; }
}

function drawWalls(ctx, walls){
	console.log(walls);
	for(i=0;i<walls.length;i++){
		if(walls[i]) {
			x = walls[i].x * cellSize;
			y = walls[i].y * cellSize;
			ctx.fillStyle = walls[i].color;
			ctx.fillRect(x, y, cellSize, cellSize);
		}
	}
}

