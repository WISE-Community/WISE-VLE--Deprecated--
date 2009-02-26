/**
 * Sample VisibilityLogic: OnlyShowSelectedNodes. 
 *   User specifies an array of nodeIds that can be visible.
 * @param {Object} rootNode
 * @param {Object} nodeIdArray array of nodes that are visible
 */
function OnlyShowSelectedNodes(rootNode, nodeIdArray) {
	this.rootNode = rootNode;
	this.visibleNodes = [];  // array of nodes that are visible
	
	// populate visibleNodes array
	for (var i=0; i < nodeIdArray.length; i++) {
		var nodeId = nodeIdArray[i];
		var node = rootNode.getNodeById(nodeId);
		this.visibleNodes.push(node);
	}
}

OnlyShowSelectedNodes.prototype.isNodeVisible = function(state, nodeToVisit) {
	if (this.visibleNodes.indexOf(nodeToVisit) > -1) {
		return true;
	}
	return false;
}

OnlyShowSelectedNodes.prototype.getNextVisibleNode = function(state, node) {
	if (this.isNodeVisible(state, node)) {
		return node;
	} else {
		for (var i=0; i < node.children.length; i++) {
			return null || this.getNextVisibleNode(state, node.children[i]);
		}
		return null;
	}
}
