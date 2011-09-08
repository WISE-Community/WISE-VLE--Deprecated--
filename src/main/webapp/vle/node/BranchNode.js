/**
 * Branch Node
 */
BranchNode.prototype = new MultipleChoiceNode();
BranchNode.prototype.constructor = BranchNode;
BranchNode.prototype.parent = MultipleChoiceNode.prototype;
function BranchNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/BranchNode.js');
}