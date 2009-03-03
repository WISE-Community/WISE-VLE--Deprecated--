/**
 * Object for storing state information of MultipleChoice item.
 */
function MCSTATE(choiceIdentifier) {
	this.timestamp = new Date();
	this.choiceIdentifier = choiceIdentifier;   // which choice the student chose.
}

MCSTATE.prototype.print = function() {
	//alert(this.timestamp + "\n" + this.choiceIdentifier);
}

MCSTATE.prototype.getDataXML = function() {
	return "<choiceIdentifier>" + this.choiceIdentifier + "</choiceIdentifier><timestamp>" + this.timestamp + "</timestamp";
}