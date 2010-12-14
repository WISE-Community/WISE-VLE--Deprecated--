/*
 * MatchSequenceNode
 */

MatchSequenceNode.prototype = new Node();
MatchSequenceNode.prototype.constructor = MatchSequenceNode;
MatchSequenceNode.prototype.parent = Node.prototype;
MatchSequenceNode.authoringToolName = "Match & Sequence";
MatchSequenceNode.authoringToolDescription = "Students drag and drop choices into boxes";
function MatchSequenceNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
};

/**
 * Takes in a state JSON object and converts it into an MSSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return an MSSTATE object
 */
MatchSequenceNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return MSSTATE.prototype.parseDataJSONObj(stateJSONObj);
};


MatchSequenceNode.prototype.onExit = function() {
	
};

MatchSequenceNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/matchsequence/matchsequence.html');
};

NodeFactory.addNode('MatchSequenceNode', MatchSequenceNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/matchsequence/MatchSequenceNode.js');
};