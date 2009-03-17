/**
 * Object for storing state information of MultipleChoiceCheckBox item.
 * The choices array contains all the choices the student chose for a
 * single submission.
 */
function MCCBSTATE(timestamp) {
	this.choices = new Array();
	this.isCorrect = null;
	
	if(arguments.length == 1) {
		this.timestamp = timestamp;
	} else {
		this.timestamp = new Date();
	}
}

/*
 * Add a choice that the student chose
 */
MCCBSTATE.prototype.addChoice = function(choice) {
	this.choices.push(choice);
}

MCCBSTATE.prototype.print = function() {
	//alert(this.timestamp + "\n" + this.choiceIdentifier);
}

MCCBSTATE.prototype.getDataXML = function() {
	var dataXML = "<choices>";
	for(var x=0; x<this.choices.length; x++) {
		dataXML += "<choice>" + this.choices[x] + "</choice>";
	}
	
	dataXML += "</choices>";
	dataXML += "<timestamp>" + this.timestamp + "</timestamp>";
	
	return dataXML;
}

MCCBSTATE.prototype.parseDataXML = function(stateXML) {
	var choiceIdentifier = stateXML.getElementsByTagName("choiceIdentifier")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(choiceIdentifier == undefined || timestamp == undefined) {
		return null;
	} else {
		return new MCCBSTATE(choiceIdentifier.textContent, timestamp.textContent);		
	}
}