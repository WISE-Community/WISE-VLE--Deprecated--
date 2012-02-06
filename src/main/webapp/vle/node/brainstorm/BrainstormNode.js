/**
 * BrainstormNode
 *
 * @author: patrick lawler
 */

BrainstormNode.prototype = new Node();
BrainstormNode.prototype.constructor = BrainstormNode;
BrainstormNode.prototype.parent = Node.prototype;

BrainstormNode.authoringToolName = "Brainstorm Discussion";
BrainstormNode.authoringToolDescription = "Students post their answer for everyone in the class to read and discuss";

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {BrainstormNode}
 */
function BrainstormNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.audioSupported = true;
	this.serverless = true;
	this.prevWorkNodeIds = [];
};

/**
 * Determines if the this step is using a server back end.
 * @return
 */
BrainstormNode.prototype.isUsingServer = function() {
	if(this.content.getContentJSON().useServer) {
		//we are using a server back end
		this.serverless = false;
		return true;
	} else {
		//we are not using a server back end
		this.serverless = true;
		return false;
	}
};

/**
 * Takes in a state JSON object and returns a BRAINSTORMSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return a BRAINSTORMSTATE object
 */
BrainstormNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return BRAINSTORMSTATE.prototype.parseDataJSONObj(stateJSONObj);
};

NodeFactory.addNode('BrainstormNode', BrainstormNode);

/**
 * Renders the student work into the div. The grading tool will pass in a
 * div id to this function and this function will insert the student data
 * into the div.
 * 
 * @param divId the id of the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 * 
 * TODO: rename TemplateNode
 * Note: you may need to add code to this function if the student
 * data for your step is complex or requires additional processing.
 * look at SensorNode.renderGradingView() as an example of a step that
 * requires additional processing
 */
BrainstormNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
	/*
	 * Get the latest student state object for this step
	 * TODO: rename templateState to reflect your new step type
	 * 
	 * e.g. if you are creating a quiz step you would change it to quizState
	 */
	var brainstormState = nodeVisit.getLatestWork();
	
	/*
	 * get the step work id from the node visit in case we need to use it in
	 * a DOM id. we don't use it in this case but I have retrieved it in case
	 * someone does need it. look at SensorNode.js to view an example of
	 * how one might use it.
	 */
	var stepWorkId = nodeVisit.id;
	
	if(brainstormState != null) {
		/*
		 * TODO: rename templateState to match the variable name you
		 * changed in the previous line above
		 */
		var studentWork = brainstormState.response;
		
		//put the student work into the div
		$('#' + divId).html(studentWork);		
	}
};

BrainstormNode.prototype.getHTMLContentTemplate = function() {
	var content = null;
	if(this.isUsingServer()) {
		//using server
		content = createContent('node/brainstorm/brainfull.html');
	} else {
		//not using server
		content = createContent('node/brainstorm/brainlite.html');
	}
	return content;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/brainstorm/BrainstormNode.js');
};