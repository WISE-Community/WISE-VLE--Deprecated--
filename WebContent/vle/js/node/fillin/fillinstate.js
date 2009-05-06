/**
 * Object for storing state information of FILL-IN item.
 * @author Hiroki Terashima
 */

/**
 * For re-creating the student's vle_state from their xml for
 * researcher/teacher display
 */
function FILLINSTATE(textEntryInteractionIndex, response, timestamp) {
	this.textEntryInteractionIndex = textEntryInteractionIndex;  // which blank the student answered.
	this.response = response;   // what the student wrote in the blank.
	
	if(arguments.length == 2) {
		//if the third argument (timestamp) was ommitted just set it to the current time
		this.timestamp = new Date().toUTCString();
	} else {
		this.timestamp = timestamp;
	}
}

FILLINSTATE.prototype.print = function() {
	//alert(this.timestamp + "\n" + this.choiceIdentifier);
}

FILLINSTATE.prototype.getDataXML = function() {
	return "<textEntryInteractionIndex>" + this.textEntryInteractionIndex + "</textEntryInteractionIndex><response>" + this.response + "</response><timestamp>" + this.timestamp + "</timestamp>";
}

FILLINSTATE.prototype.parseDataXML = function(stateXML) {
	var textEntryInteractionIndex = stateXML.getElementsByTagName("textEntryInteractionIndex")[0];
	var response = stateXML.getElementsByTagName("response")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(textEntryInteractionIndex == undefined || response == undefined || timestamp == undefined) {
		return null;
	} else {
		return new FILLINSTATE(textEntryInteractionIndex.textContent, response.textContent, timestamp.textContent);
	}
}

/**
 * Returns what the student typed
 * @return the answer the student typed
 */
FILLINSTATE.prototype.getStudentWork = function() {
	return this.response;
}