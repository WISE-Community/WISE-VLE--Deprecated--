/**
 * Object for storing the student's response to the glue
 */
function GLUESTATE(response, timestamp){
	this.response = response;
	if(arguments.length == 1) {
		this.timestamp = new Date().toUTCString();
	} else {
		this.timestamp = timestamp;
	};
};

GLUESTATE.prototype.getHtml = function() {
	return "timestamp: " + this.timestamp + "<br/>response: " + this.response;
};

GLUESTATE.prototype.getDataXML = function() {
	return "<response>" + this.response + "</response><timestamp>" + this.timestamp + "</timestamp>";
};

GLUESTATE.prototype.parseDataXML = function(stateXML) {
	var reponse = stateXML.getElementsByTagName("response")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(reponse == undefined || timestamp == undefined) {
		return null;
	} else {
		return new GLUESTATE(reponse.textContent, timestamp.textContent);		
	}
};