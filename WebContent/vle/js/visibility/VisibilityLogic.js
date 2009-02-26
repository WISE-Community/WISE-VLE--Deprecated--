function VisibilityLogic(algorithm) {
	this.algorithm = algorithm;
}

VisibilityLogic.prototype.isNodeVisible = function(state, nodeToVisit) {
	if (this.algorithm != null) {
		return this.algorithm.isNodeVisible(state, nodeToVisit);
	}
	return true;
}

/**
 * Returns the node that is visible starting at (and including) the specified node.
 * Returns null if such node cannot be found.
 * @param {Object} node
 */
VisibilityLogic.prototype.getNextVisibleNode = function(state, node) {
	if (this.algorithm != null) {
		return this.algorithm.getNextVisibleNode(state, node);
	}
	return node;
}