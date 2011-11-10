
/**
 * @constructor
 * @param state
 * @param timestamp
 * @returns
 */
function SVGDRAWSTATE(state, timestamp) {
	this.type = "html";
	this.data = state;
	
	if(timestamp == null) {
		this.timestamp = new Date().getTime();
	} else {
		this.timestamp = timestamp;
	}
};

/**
 * Takes in a state JSON object and returns an SVGDRAWSTATE object
 * @param stateJSONObj a state JSON object
 * @return a SVGDRAWSTATE object
 */
SVGDRAWSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	//create a new SVGDRAWSTATE object
	var state = new SVGDRAWSTATE();
	
	//set the attributes of the SVGDRAWSTATE object
	state.data = stateJSONObj.data;
	state.timestamp = stateJSONObj.timestamp;
	
	//return the SVGDRAWSTATE object
	return state;
};

/**
 * Get the student work.
 * @return the student's work
 */
SVGDRAWSTATE.prototype.getStudentWork = function() {
	return this.data;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/draw/svg-edit/svgdrawstate.js');
};