var socket = io.connect('http://localhost:80');
var gameOver = false;
var waitingTimer;
var textFocus = false;

socket.on('connect', function() {
	socket.emit('newPlayer');
	initialize();
	drawSelectScreen(context);
});

socket.on('startGame', function(data) {
	clearInterval(waitingTimer);

	var game = JSON.parse(data);
	drawBoard(context);
	drawPlayers(context, game);
});

socket.on('updateGame', function(data) {
	var game = JSON.parse(data);

	drawPlayers(context, game);
});

socket.on('gameOver', function(data) {
	players = JSON.parse(data);

	drawGameOver(context, players.currentPlayer, players.winningPlayer);
	gameOver = false;
});

socket.on('tie', function(data) {
	drawGameOver(context);
	gameOver = false;
});

socket.on('reset', function() {
	clearInterval(waitingTimer);
	drawBoard(context);
});

socket.on('updatePointer', function(data) {
	selection = JSON.parse(data).selection;
	drawPointer(context, selection);
});

socket.on('waiting',function(){
	waitingTimer = setInterval(function() { drawWaiting(context) }, 1000);
});

socket.on("death", function(data) {
	var walls = data;
	drawBoard(context);
	drawWalls(context, walls);
});

socket.on("setColor", function(data) {
	$('#colorPicker').spectrum("set", data);
});

socket.on('updateusers', function(data) {
	users = JSON.parse(data);

	$('#players').empty();
	for(i=1; i<=4; i++) {
		player = users["player"+i];
		if(player) {
			$('#players').append("<div><span style='color:"+ player.color +"'>" + player.player + "</span></div>");
		}
	}
});

socket.on('updateChat', function(player, color, message) {
	$('#conversation').append("<span style='color:"+ color +"'><b>" + player + ":</b></span> " + message + "<br>");
	$("#conversation").scrollTop($("#conversation")[0].scrollHeight);
});
