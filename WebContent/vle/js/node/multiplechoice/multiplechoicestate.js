/**
 * Object for storing state information of MultipleChoice item.
 */

function MCSTATE(choiceIdentifier, timestamp) {
	this.choiceIdentifier = choiceIdentifier;   // which choice the student chose.
	this.isCorrect = null;
	
	if(arguments.length == 1) {
		//if the second argument (timestamp) was ommitted just set it to the current time
		this.timestamp = new Date();
	} else {
		this.timestamp = timestamp;
	}
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