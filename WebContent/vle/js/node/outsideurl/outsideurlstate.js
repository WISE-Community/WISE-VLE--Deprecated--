/**
 * Object for storing state information of OpenResponse item.
 * @author Hiroki Terashima
 */
function OUTSIDEURLSTATE(response) {
	this.timestamp = new Date().toUTCString();
	this.response = response;   // which choice the student chose.
}

OUTSIDEURLSTATE.prototype.print = function() {
	//alert(this.timestamp + "\n" + this.choiceIdentifier);
}

OUTSIDEURLSTATE.prototype.getHtml = function() {
	return "timestamp: " + this.timestamp + "<br/>response: " + this.response;
}