function NavigationLogic(algorithm) {
	this.algorithm = algorithm;
}

/**
 * populates this.visitingOrder array
 * @param {Object} node
 */
NavigationLogic.prototype.findVisitingOrder = function(node) {
	this.visitingOrder.push(node);
	for (var i=0; i < node.children.length; i++) {
		this.findVisitingOrder(node.children[i]);
	}
}

/**
 * Default: return true
 * @param {Object} state
 * @param {Object} nodeToVisit
 */
NavigationLogic.prototype.canVisitNode = function(state, nodeToVisit) {
	if (this.algorithm != null) {
		return this.algorithm.canVisitNode(state.visitedNodes, nodeToVisit);
	}
	return true;
}

/**
 * Returns the next node in sequence, after the specified currentNode.
 * If currentNode is the last node in the sequence, return null;
 * Default: null
 * @param {Object} state
 * @param {Object} currentNode
 */
NavigationLogic.prototype.getNextNode = function(currentNode) {
	if (this.algorithm != null) {
		return this.algorithm.getNextNode(currentNode);
	} else {
		return null;
	}
}

/**
 * Returns the previous node in sequence, before the specified currentNode.
 * If currentNode is the first node in the sequence, return null;
 * @param {Object} state
 * @param {Object} currentNode
 */
NavigationLogic.prototype.getPrevNode = function(currentNode) {
	if (this.algorithm != null) {
		return this.algorithm.getPrevNode(currentNode);
	} else {
		return null;
	}
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/navigation/NavigationLogic.js");