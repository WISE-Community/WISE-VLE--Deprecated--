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

NodeFactory.addNode('FillinNode', FillinNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/fillin/FillinNode.js');
};