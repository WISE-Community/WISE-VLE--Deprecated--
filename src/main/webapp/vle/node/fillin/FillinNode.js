/*
 * FillinNode
 */

FillinNode.prototype = new Node();
FillinNode.prototype.constructor = FillinNode;
FillinNode.prototype.parent = Node.prototype;
FillinNode.authoringToolName = "Fill In";
FillinNode.authoringToolDescription = "Students fill in the missing text blanks in a body of text";

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {FillinNode}
 */
function FillinNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
};

/**
 * Takes in a state JSON object and returns a FILLINSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return a FILLINSTATE object
 */
FillinNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return FILLINSTATE.prototype.parseDataJSONObj(stateJSONObj);
};

FillinNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

FillinNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/fillin/fillin.html');
};

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
FillinNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
	/*
	 * Get the latest student state object for this step
	 * TODO: rename templateState to reflect your new step type
	 * 
	 * e.g. if you are creating a quiz step you would change it to quizState
	 */
	var templateState = nodeVisit.getLatestWork();
	
	/*
	 * get the step work id from the node visit in case we need to use it in
	 * a DOM id. we don't use it in this case but I have retrieved it in case
	 * someone does need it. look at SensorNode.js to view an example of
	 * how one might use it.
	 */
	var stepWorkId = nodeVisit.id;
	
	/*
	 * TODO: rename templateState to match the variable name you
	 * changed in the previous line above
	 */
	var studentWork = templateState.response;
	
	//put the student work into the div
	$('#' + divId).html(studentWork);
};

NodeFactory.addNode('FillinNode', FillinNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/fillin/FillinNode.js');
};