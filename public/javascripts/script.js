$(document).ready(function(){
	$('.slides').superslides({
		hashchange: true
	});

	document.ontouchmove = function(e) {
		e.preventDefault();
	};

	var slides = document.getElementsByClassName("slides")[0];

	var swipeleft = Hammer(slides).on('swipeleft', function() {
		$(this).superslides('animate', 'next');
	});

	var swiperight = Hammer(slides).on('swiperight', function() {
		$(this).superslides('animate', 'prev');
	});
});