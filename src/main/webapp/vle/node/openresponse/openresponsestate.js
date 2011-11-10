/**
 * Object for storing state information of OpenResponse item.
 * @constructor
 * @author Hiroki Terashima
 */
function OPENRESPONSESTATE(response, timestamp, locked, submitPeerReview) {
	this.type = "or";
	
	//this is a single element array that contains the response the student wrote
	this.response = response;
	
	if(!timestamp) {
		//if the second argument (timestamp) was ommitted just set it to the current time
		this.timestamp = Date.parse(new Date());
	} else {
		this.timestamp = timestamp;
	}
	this.locked = locked;
	this.submitPeerReview = submitPeerReview;
};

OPENRESPONSESTATE.prototype.print = function() {
};

OPENRESPONSESTATE.prototype.getHtml = function() {
	return "timestamp: " + this.timestamp + "<br/>response: " + this.response;
};


/**
 * Takes in a state JSON object and returns an OPENRESPONSESTATE object
 * @param stateJSONObj a state JSON object
 * @return a OPENRESPONSESTATE object
 */
OPENRESPONSESTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	
	//set the attributes of the OPENRESPONSESTATE object
	var response = stateJSONObj.response;
	var timestamp = stateJSONObj.timestamp;
	var submitPeerReview = stateJSONObj.submitPeerReview;
	var locked = stateJSONObj.locked;
	
	//return the OPENRESPONSESTATE object
	//create a new OPENRESPONSESTATE object
	var orState = new OPENRESPONSESTATE(response, timestamp, locked, submitPeerReview);
	
	return orState;
};

/**
 * Returns what the student typed
 * @return the answer the student typed
 */
OPENRESPONSESTATE.prototype.getStudentWork = function() {
	var studentWork = this.response;
	
	//check if the response is an array
	if(this.response != null && this.response.constructor.toString().indexOf("Array") != -1) {
		/*
		 * response is an array so we will use the toString() of the array
		 * which should give us just the text within it
		 */
		studentWork = this.response.toString();
	}
	return studentWork;
};

OPENRESPONSESTATE.prototype.isLocked = function() {
	return this.locked;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/openresponse/openresponsestate.js');
}