$(function(){
	window.addEventListener('keydown', keyDown);

	function keyDown(){

		if(textFocus) { return true; }

		var keyData;
		if(event.keyCode === 37){
			keyData = {key:'left'};
		}
		else if(event.keyCode === 38){
			keyData = {key:'up'};
		}
		else if(event.keyCode === 39){
			keyData = {key:'right'};
		}
		else if(event.keyCode === 40){
			keyData = {key:'down'};
		}
		else if(event.keyCode === 82) {
			if(!gameOver) { keyData = { key:'r' }; }
		}
		else if(event.keyCode === 13) {
			keyData = { key: 'enter' };
		}
		else if(event.keyCode === 66){
			keyData = {key:'b'};
		}
		else{
			return;
		}
		socket.emit('keyPress', JSON.stringify(keyData));
	}
});