$(function(){

	$('#name_form').submit(function(event){
		event.preventDefault();
		console.log('here!');
		var user_name;
		user_name = { new_name: $('#user_name').val() };
		socket.emit('nameChange', JSON.stringify(user_name));
	})

	$("#colorPicker").spectrum({
		clickoutFiresChange: true,
		change: function(color) {
		    socket.emit("setColor", color.toHexString());
		}
	});

	$('#sendMessage').click(function() {
		var message = $('#chatMessage').val();
		if(message.length > 0) {
			$('#chatMessage').val('');
			socket.emit('sendChat', message);
		}
	});

	$('#chatMessage').keypress(function(e) {
		if(e.which == 13) {
			$('#sendMessage').click();
		}
	});

	$('#chatMessage').focus(function() {
		textFocus = true;
	});
	$('#chatMessage').focusout(function() {
		textFocus = false;
	});
	$('#user_name').focus(function() {
		textFocus = true;
	});
	$('#user_name').focusout(function() {
		textFocus = false;
	});
})