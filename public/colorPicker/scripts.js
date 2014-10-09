var hexValue;
var redValue;
var greenValue;
var blueValue;

$(function() {
	$(".slider").slider({
		value: 255,
		min: 0,
		max: 255,
		slide: function( event, ui ) {}
	});

	$("#redSlider").on("slide", function(event, ui){
    	$("#redBox").val(ui.value);
    	rgbToHex();
    });
    $("#greenSlider").on("slide", function(event, ui){
    	$("#greenBox").val(ui.value);
    	rgbToHex();
    });
    $("#blueSlider").on("slide", function(event, ui){
    	$("#blueBox").val(ui.value);
    	rgbToHex();
    });
});

function rgbToHex() {
	redValue = parseInt($("#redBox").val()).toString(16);
	greenValue = parseInt($("#greenBox").val()).toString(16);
	blueValue = parseInt($("#blueBox").val()).toString(16);

	if (redValue.length < 2) { redValue = "0" + redValue; }
	else if (redValue == "NaN") { redValue = "00"; }

	if (greenValue.length < 2) { greenValue = "0" + greenValue; }
	else if (greenValue == "NaN") { greenValue = "00"; }

	if (blueValue.length < 2) { blueValue = "0" + blueValue; }
	else if (blueValue == "NaN") { blueValue = "00"; }

	hexValue = redValue + greenValue + blueValue;

	$("#hexBox").val(hexValue);
	changeColor();

	$("#red-slider").slider("value", redValue);
	$("#green-slider").slider("value", greenValue);
	$("#blue-slider").slider("value", blueValue);
}

function hexToRgb() {
	hexValue = $("#hexBox").val();

	if (hexValue.charAt(0) == "#") {
		hexValue = hexValue.slice(1);
	}

	if (hexValue.length == 3) {
		hexValue = hexValue.charAt(0) + hexValue.charAt(0) +
					hexValue.charAt(1) + hexValue.charAt(1) +
					hexValue.charAt(2) + hexValue.charAt(2);
	}

	redValue = parseInt(hexValue.substring(0,2), 16);
	greenValue = parseInt(hexValue.substring(2,4), 16);
	blueValue = parseInt(hexValue.substring(4,6), 16);

	$("#redBox").val(redValue);
	$("#greenBox").val(greenValue);
	$("#blueBox").val(blueValue);

	$("#redSlider").slider("value", redValue);
	$("#greenSlider").slider("value", greenValue);
	$("#blueSlider").slider("value", blueValue);

	changeColor();
}

function changeColor() {

	$("body").animate({
		backgroundColor: "#" + hexValue },
		{ queue: false, duration: 750 }
	);

	$("#colorName").text(ntc.name(hexValue)[1]);

}
