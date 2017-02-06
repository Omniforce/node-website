function Menu() {
	this.selection = 2

	this.getSelection = function() {
		return this.selection;
	}

	this.updateSelection = function(key) {
		if (key == 38) { this.moveUp(); }
		else if (key == 40) { this.moveDown(); }
	}

	this.moveUp = function() {
		this.selection = Math.max(this.selection - 1, 2);
	}

	this.moveDown = function() {
		this.selection = Math.min(this.selection + 1, 4);
	}
}

module.exports = function() {
	return new Menu();
}