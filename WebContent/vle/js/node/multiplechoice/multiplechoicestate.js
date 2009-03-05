/**
 * Object for storing state information of MultipleChoice item.
 */
function MCSTATE(choiceIdentifier) {
	this.timestamp = new Date();
	this.choiceIdentifier = choiceIdentifier;   // which choice the student chose.
}

function MCSTATE(choiceIdentifier, timestamp) {
	this.timestamp = timestamp;
	this.choiceIdentifier = choiceIdentifier;   // which choice the student chose.
}

MCSTATE.prototype.print = function() {
	//alert(this.timestamp + "\n" + this.choiceIdentifier);
}

MCSTATE.prototype.getDataXML = function() {
	return "<choiceIdentifier>" + this.choiceIdentifier + "</choiceIdentifier><timestamp>" + this.timestamp + "</timestamp>";
}

MCSTATE.prototype.parseDataXML = function(stateXML) {
	var choiceIdentifier = stateXML.getElementsByTagName("choiceIdentifier")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(choiceIdentifier == undefined || timestamp == undefined) {
		return null;
	} else {
		return new MCSTATE(choiceIdentifier.textContent, timestamp.textContent);		
	}
}