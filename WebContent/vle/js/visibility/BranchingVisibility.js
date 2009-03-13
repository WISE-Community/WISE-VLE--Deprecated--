/**
 * Sample VisibilityLogic: BranchingVisibility. 
 *   User specifies branch startpoint and branch endpoint
 * @param {Object} rootNode
 * @param {Object} nodeIdArray array of nodes that are visible
 */
function BranchingVisibility() {
	this.rootNode = arguments[0];
	this.visibleNodes = [];  // array of nodes that are visible
	this.branches = [];   // possible branches. elements are an array of (event, visible node array) 
	                 
	
	for (var i=1; i < arguments.length; i++) {
		this.branches.push(arguments[i]);
	}
}

/**
 * Populates visible nodes array. Constructor must have been called
 * before calling this function.
 * @return
 */
/*
BranchingVisibility.prototype.populateVisibleNodesArray = function() {
	// populate visibleNodes array
	for (var i=0; i < nodeIdArray.length; i++) {
		var nodeId = nodeIdArray[i];
		var node = rootNode.getNodeById(nodeId);
		this.visibleNodes.push(node);
	}
}
*/

/**
 * State is VLE_STATE
 */
BranchingVisibility.prototype.isNodeVisible = function(state, nodeToVisit) {
	// look in the state to figure out visible nodes	
	for (var i=0; i<this.branches.length; i++) {
		for (var k=0; k<state.visitedNodes.length; k++) {
			if (state.visitedNodes[k].node.id == this.branches[i][0]) {
				// this means that the specified node has been visited already
				//alert('this.branches: ' + this.branches[i][0] + ", " + state.visitedNodes.length);
				//alert('a: ' + state.visitedNodes[k].nodeStates.length);
				if (state.visitedNodes[k].nodeStates.length > 0) {
					//alert('here');
					if (state.visitedNodes[k].nodeStates[state.visitedNodes[k].nodeStates.length - 1].isCorrect) { 
						//alert('iscorrect');
						for (var j=0; j< this.branches[i][1].length; j++) {
							this.visibleNodes.push(this.rootNode.getNodeById(this.branches[i][1][j]));
						}
					}
				}
			}
		}
	}
	
	if (this.visibleNodes.indexOf(nodeToVisit) > -1) {
		//alert('node is visible' + nodeToVisit.id);
		return true;
	}
	//alert('node is not visible' + nodeToVisit.id);
	return false;
}

BranchingVisibility.prototype.getNextVisibleNode = function(state, node) {
	if (this.isNodeVisible(state, node)) {
		return node;
	} else {
		for (var i=0; i < node.children.length; i++) {
			return null || this.getNextVisibleNode(state, node.children[i]);
		}
		return null;
	}
}
