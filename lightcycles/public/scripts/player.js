var Player = (function () {
	var module = {};

	module.updatePlayers = function(data) {
		var $nameInput = $('#name');
		var $colorInput = $('#color');
		var $infoForm = $('#info');

		var players = data.players;
		var currentPlayer = data.currentPlayer;

		updatePlayerList(players);

		if(currentPlayer) {
			displayForm(currentPlayer);
		}
	}

	return module;

	function updatePlayerList(players) {
		var $playersList = $('#playersList');

		$playersList.empty();
		for(var i=0; i<players.length; i++) {
			var player = players[i];
			var isReady = player.ready ? "ready" : "not-ready";

			var $newLi = $('<li class="list-group-item"><div class="ready-indicator pull-left ' + isReady + '"></div><div class="" style="color:' + player.color + '">' + player.name + '</div></li>');
			$playersList.append($newLi);
		}
	}

	function displayForm(currentPlayer) {
		var $infoForm = $('#info');
		var $nameInput = $('#name');
		var $colorInput = $('#color');
		var $readyButton = $('#readyButton');

		$infoForm.show();
		$nameInput.attr("placeholder", currentPlayer.name);

		$colorInput.val(currentPlayer.color);
		$colorInput.css('background-color', currentPlayer.color);

		if(currentPlayer.ready) {
			$readyButton.removeClass('btn-success').addClass("btn-danger");
			$readyButton.text("Unready!")
		} else {
			$readyButton.removeClass('btn-danger').addClass("btn-success");
			$readyButton.text("Ready!")
		}
	}

}());