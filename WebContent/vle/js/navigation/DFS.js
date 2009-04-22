/**
 * Core NavigationLogic: Depth-First-Search (http://en.wikipedia.org/wiki/Depth-first_search)
 * Need: rootnode, 
 * def dfs(v):
 *   mark v as visited
 *   preorder-process(v)
 *   for all vertices i adjacent to v such that i not visited
 *       dfs(i)
 *   postorder-process(v)
 */
function DFS(rootNode) {
	this.rootNode = rootNode;
	this.visitingOrder = [];  // sequence-ordering of nodes.
	
	this.findVisitingOrder(rootNode);
}

/**
 * populates this.visitingOrder array
 * @param {Object} node
 */
DFS.prototype.findVisitingOrder = function(node) {
	if(node){
		this.visitingOrder.push(node);
		for (var i=0; i < node.children.length; i++) {
			this.findVisitingOrder(node.children[i]);
		}
	};
}

/**
 * Returns true iff nodeToVisit has already been visited,
 * or is the next node in the DFS-sequence to visit.
 * @param {Object} visitedNodes
 * @param {Object} nodeToVisit
 */
DFS.prototype.canVisitNode = function(visitedNodes, nodeToVisit) {
	return true;   // for now, canVisitNode= true...DFS should only define the SEQUENCE, not Constraints
	// find the deepest node that user has already visited
	if (visitedNodes.length == 0) {
		return true;
	}
	var deepestSoFar = this.findDeepestSoFar(0,0,visitedNodes);
	var nextNodeInSequence = this.getNextNode(deepestSoFar.node);
	
	if (this.isBefore(nodeToVisit, deepestSoFar.node) || 
	        (nextNodeInSequence != null && nextNodeInSequence == nodeToVisit) ) {
		return true;
	}
	alert('you cannot visit this node yet. Please visit ALL prior pages.');
	return false;
}

/**
 * Returns the deepest/furthest node that the user has visited
 * in the DFS-sequence.
 * @param {Object} currentIndex index within the DFS.visitedNodes array
 * @param {Object} deepestSoFar index of the deepest Node so far within 
 *     the DFS.visitedNodes array
 */
DFS.prototype.findDeepestSoFar = function(currentIndex, deepestSoFarIndex, visitedNodes) {
	if (currentIndex == visitedNodes.length) {
		return visitedNodes[deepestSoFarIndex];
	} 
	if (this.isBefore(visitedNodes[deepestSoFarIndex].node,
	                  visitedNodes[currentIndex].node)) {
		return this.findDeepestSoFar(currentIndex+1,currentIndex, visitedNodes);
	} else {
		return this.findDeepestSoFar(currentIndex+1,deepestSoFarIndex, visitedNodes);
	}
}
/**
 * Returns true iff node1 should be visited before node2
 * in the DFS sequence. If node1 == node2, returns false.
 * @param {Object} node1
 * @param {Object} node2
 * 
 */
DFS.prototype.isBefore = function(node1, node2) {
	var indexOfNode1 = this.visitingOrder.indexOf(node1);
	var indexOfNode2 = this.visitingOrder.indexOf(node2);	
	if (indexOfNode1 == -1 || indexOfNode2 == -1) {
		alert("node visiting error");
		alert("1:" + indexOfNode1);
		alert("2:" + indexOfNode2);
		return;
	}
	return indexOfNode1 <= indexOfNode2;
}

/**
 * Returns the next node to visit in the DFS sequence
 * after specified node. If the node is the last node,
 * return null
 * @param {Object} node
 */
DFS.prototype.getNextNode = function(node) {
	var indexOfNode = this.visitingOrder.indexOf(node);
	if (indexOfNode == this.visitingOrder.length) {
		return null;
	}
	return this.visitingOrder[indexOfNode+1];
}

/**
 * Returns the next node to visit in the DFS sequence
 * after specified node. If the node is the last node,
 * return null
 * @param {Object} node
 */
DFS.prototype.getPrevNode = function(node) {
	//alert('prevnode!');
	var indexOfNode = this.visitingOrder.indexOf(node);
	if (indexOfNode == 0) {
		return null;
	}
	return this.visitingOrder[indexOfNode-1];
}