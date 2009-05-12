/**
 * Sample VisibilityLogic. Only show the node if the node is a leaf node.
 * @param {Object} rootNode
 */
function OnlyShowLeafNode(rootNode) {
	this.rootNode = rootNode;
	this.visibleNodes = [];  // array of nodes that are visible
}

OnlyShowLeafNode.prototype.isNodeVisible = function(state, nodeToVisit) {
	if (nodeToVisit.children.length == 0) {
		return true;	
	}
	return false;
}

OnlyShowLeafNode.prototype.getNextVisibleNode = function(state, node) {
	if (this.isNodeVisible(state, node)) {
		return node;
	} else {
		for (var i=0; i < node.children.length; i++) {
			return null || this.getNextVisibleNode(state, node.children[i]);
		}
		return null;
	}
}
