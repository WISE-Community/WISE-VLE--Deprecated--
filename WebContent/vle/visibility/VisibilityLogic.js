function VisibilityLogic(algorithm) {
	this.algorithm = algorithm;
}

VisibilityLogic.prototype.isNodeVisible = function(state, nodeToVisit, eventType) {
	if (this.algorithm != null) {
		var soFar = false;
		for (var i=0; i<this.algorithm.length; i++) {
			soFar = soFar || this.algorithm[i].isNodeVisible(state, nodeToVisit, eventType);
		}
		return soFar;
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
		var soFar = node;
		for (var i=0; i<this.algorithm.length; i++) {
			var nextNode = this.algorithm[i].getNextVisibleNode(state, node);
			if (nextNode) {
				soFar = nextNode;
			}
		}
		return soFar;
	}
	return node;
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/visibility/VisibilityLogic.js");