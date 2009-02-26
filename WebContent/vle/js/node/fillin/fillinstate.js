/**
 * Object for storing state information of FILL-IN item.
 * @author Hiroki Terashima
 */
function FILLINSTATE(textEntryInteractionIndex, response) {
	this.timestamp = new Date();
	this.textEntryInteractionIndex = textEntryInteractionIndex;  // which blank the student answered.
	this.response = response;   // what the student wrote in the blank.
}

FILLINSTATE.prototype.print = function() {
	//alert(this.timestamp + "\n" + this.choiceIdentifier);
}