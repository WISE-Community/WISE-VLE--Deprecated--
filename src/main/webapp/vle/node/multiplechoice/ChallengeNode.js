/**
 * Challenge Node
 */
ChallengeNode.prototype = new MultipleChoiceNode();
ChallengeNode.prototype.constructor = ChallengeNode;
ChallengeNode.prototype.parent = MultipleChoiceNode.prototype;
ChallengeNode.authoringToolName = "Challenge Question";
ChallengeNode.authoringToolDescription = "Students answer a multiple choice question. If they get the answer wrong, they will need to revisit a previous step before trying again.";

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {ChallengeNode}
 */
function ChallengeNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
}

NodeFactory.addNode('ChallengeNode', ChallengeNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/multiplechoice/ChallengeNode.js');
}