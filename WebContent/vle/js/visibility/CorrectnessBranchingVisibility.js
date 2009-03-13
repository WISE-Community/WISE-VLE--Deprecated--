/**
 * Sample VisibilityLogic: BranchingVisibility. 
 *   User specifies branch startpoint and branch endpoint
 * @param {Object} rootNode
 * @param {Object} nodeIdArray array of nodes that are visible
 */
function CorrectnessBranchingVisibility() {
	this.rootNode = arguments[0];
	this.visibleNodes = [];  // array of nodes that are visible
	this.branchingNodeId = arguments[1];  // the branching node   
	this.correctBranch = arguments[2];   // visibleNodes when isCorrect=true 
	this.incorrectBranch = arguments[3];  // visibleNodes when isCorrect=false
}

/**
 * Populates visible nodes array. Constructor must have been called
 * before calling this function.
 * @return
 */
/*
CorrectnessBranchingVisibility.prototype.populateVisibleNodesArray = function() {
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
CorrectnessBranchingVisibility.prototype.isNodeVisible = function(state, nodeToVisit, eventType) {
	// look in the state to figure out visible nodes
	var nodeVisitsForBranchNode = state.getNodeVisitsByNodeId(this.branchingNodeId);
	//alert(nodeVisitsForBranchNode.length + ", " + eventType);
	if (eventType == "nodeSessionEndedEvent" && nodeVisitsForBranchNode.length > 0) {
		var isCorrectOnBranchNode = false;
		for (var i=0; i < nodeVisitsForBranchNode.length; i++) {
			if (nodeVisitsForBranchNode[i].nodeStates.length > 0) {
				var isCorrectOnLastNodeVisit = nodeVisitsForBranchNode[i].nodeStates[nodeVisitsForBranchNode[i].nodeStates.length - 1].isCorrect;
				isCorrectOnBranchNode = isCorrectOnLastNodeVisit;
			}
		}

		if (isCorrectOnBranchNode) {
			//alert('iscorrect');
			for (var j=0; j< this.correctBranch.length; j++) {
				this.visibleNodes.push(this.rootNode.getNodeById(this.correctBranch[j]));
			}
		} else {
			//alert('is not correct');
			for (var j=0; j< this.incorrectBranch.length; j++) {
				this.visibleNodes.push(this.rootNode.getNodeById(this.incorrectBranch[j]));
			}
		}
	}
	/*
		for (var k=0; k<state.visitedNodes.length; k++) {
			if (state.visitedNodes[k].node.id == this.branchingNodeId) {
				if (state.visitedNodes[k].nodeStates.length > 0) {
					alert('here');
					if (state.visitedNodes[k].nodeStates[state.visitedNodes[k].nodeStates.length - 1].isCorrect) { 
						alert('iscorrect');
						for (var j=0; j< this.correctBranch.length; j++) {
							this.visibleNodes.push(this.rootNode.getNodeById(this.correctBranch[j]));
						}
					} else {
						alert('is not correct');
						for (var j=0; j< this.incorrectBranch.length; j++) {
							this.visibleNodes.push(this.rootNode.getNodeById(this.incorrectBranch[j]));
						}
					}
				}
			}
		}
	*/
	
	if (this.visibleNodes.indexOf(nodeToVisit) > -1) {
		//alert('node is visible' + nodeToVisit.id);
		return true;
	}
	//alert('node is not visible' + nodeToVisit.id);
	return false;
}

CorrectnessBranchingVisibility.prototype.getNextVisibleNode = function(state, node) {
	if (this.isNodeVisible(state, node)) {
		return node;
	} else {
		for (var i=0; i < node.children.length; i++) {
			return null || this.getNextVisibleNode(state, node.children[i]);
		}
		return null;
	}
}
