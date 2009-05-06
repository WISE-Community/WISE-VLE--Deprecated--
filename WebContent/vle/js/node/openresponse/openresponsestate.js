/**
 * Object for storing state information of OpenResponse item.
 * @author Hiroki Terashima
 */
function OPENRESPONSESTATE(response, timestamp) {
	this.response = response;   // which choice the student chose.
	if(arguments.length == 1) {
		//if the second argument (timestamp) was ommitted just set it to the current time
		this.timestamp = new Date().toUTCString();
	} else {
		this.timestamp = timestamp;
	}
}

OPENRESPONSESTATE.prototype.print = function() {
	//alert(this.timestamp + "\n" + this.choiceIdentifier);
}

OPENRESPONSESTATE.prototype.getHtml = function() {
	return "timestamp: " + this.timestamp + "<br/>response: " + this.response;
}

OPENRESPONSESTATE.prototype.getDataXML = function() {
	return "<response>" + this.response + "</response><timestamp>" + this.timestamp + "</timestamp>";
}

OPENRESPONSESTATE.prototype.parseDataXML = function(stateXML) {
	var reponse = stateXML.getElementsByTagName("response")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(reponse == undefined || timestamp == undefined) {
		return null;
	} else {
		return new OPENRESPONSESTATE(reponse.textContent, timestamp.textContent);		
	}
}

/**
 * Returns what the student typed
 * @return the answer the student typed
 */
OPENRESPONSESTATE.prototype.getStudentWork = function() {
	return this.response;
}