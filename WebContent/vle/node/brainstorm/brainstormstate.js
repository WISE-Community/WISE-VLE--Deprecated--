/**
 * Object for storing the student's response to the brainstorm
 */
function BRAINSTORMSTATE(response, timestamp){
	this.response = response;
	if(arguments.length == 1) {
		this.timestamp = new Date().toUTCString();
	} else {
		this.timestamp = timestamp;
	};
};

BRAINSTORMSTATE.prototype.getHtml = function() {
	return "timestamp: " + this.timestamp + "<br/>response: " + this.response;
};

BRAINSTORMSTATE.prototype.getDataXML = function() {
	return "<response>" + this.response + "</response><timestamp>" + this.timestamp + "</timestamp>";
};

BRAINSTORMSTATE.prototype.parseDataXML = function(stateXML) {
	var reponse = stateXML.getElementsByTagName("response")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(reponse == undefined || timestamp == undefined) {
		return null;
	} else {
		return new BRAINSTORMSTATE(reponse.textContent, timestamp.textContent);		
	}
};

BRAINSTORMSTATE.prototype.getStudentWork = function() {
	return this.response;
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/brainstorm/brainstormstate.js");