$(function() {
	var $infoForm = $('#infoForm');
	var $nameInput = $('#name');
	var $colorInput = $('#color');
	var $readyButton = $('#readyButton');

	$infoForm.submit(function() {
		return false;
	});

	$nameInput.blur(function() {
		if($nameInput.val()) {
			WebSocket.updateName($nameInput.val());
		}
	});

	$colorInput.blur(function() {
		WebSocket.updateColor($colorInput.val());
	});

	$readyButton.click(function(){
		WebSocket.ready();
    }); 

	var keys = [37, 38, 39, 40, 82, 13, 66];
    window.onkeydown = function(e) {
    	var key = e.keyCode ? e.keyCode : e.which;
    	if (keys.indexOf(key) > -1) {
    		WebSocket.keypress(key);
    	}
    }
});