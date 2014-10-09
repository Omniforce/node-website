function Pointer(){
	this.selection = 2;

	this.move = function(direction) {
		if (direction == "up") {
			this.selection--;
			if (this.selection < 2) { this.selection = 2; }
		}
		else if(direction == "down") {
			this.selection++;
			if (this.selection > 4) { this.selection = 4; }
		}
	}
}
module.exports = new Pointer();