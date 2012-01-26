function NavigationLogic(algorithm, view) {
	this.algorithm = algorithm;
	this.view = view;
	this.constraintManager = new ConstraintManager(view);
};

/**
 * Tells the constraintManager to update its constraint whenever
 * a node is rendered.
 * 
 * @param position
 */
NavigationLogic.prototype.nodeRendered = function(position){
	this.constraintManager.nodeRendered(position);
};

/**
 * populates this.visitingOrder array
 * @param {Object} node
 */
NavigationLogic.prototype.findVisitingOrder = function(node) {
	this.visitingOrder.push(node);
	for (var i=0; i < node.children.length; i++) {
		this.findVisitingOrder(node.children[i]);
	}
};

/**
 * Given the currentNode, the prospective nodeToVisit and the view
 * state, returns the visitable status (either 0 - can visit, 1 - can visit
 * but disable, 2 - cannot visit)
 * 
 * @return 0/1/2, default: 0
 */
NavigationLogic.prototype.getVisitableStatus = function(position){
	if(this.constraintManager){
		return this.constraintManager.getVisitableStatus(position);
	}
	
	return {value:0, msg:''};
};

/**
 * Given a constraint options object, creates the constraint specified
 * by the options.
 * 
 * @param opts
 */
NavigationLogic.prototype.addConstraint = function(opts){
	this.constraintManager.addConstraint(opts);
};

/**
 * Removes the constraint with the given id.
 * 
 * @param string - constraintId
 */
NavigationLogic.prototype.removeConstraint = function(constraintId){
	this.constraintManager.removeConstraint(constraintId);
};

/**
 * Returns the next node in sequence, after the specified currentNode.
 * If currentNode is the last node in the sequence, return null;
 * @param location = path to node in project (i.e. 0.3.7.2)
 */
NavigationLogic.prototype.getNextNode = function(location) {
	if (this.algorithm != null) {
		return this.algorithm.getNextNode(location);
	} else {
		return null;
	}
};

/**
 * Returns the previous node in sequence, before the specified currentNode.
 * If currentNode is the first node in the sequence, return null;
 * @param location = path to node in project (i.e. 0.3.7.2)
 */
NavigationLogic.prototype.getPrevNode = function(location) {
	if (this.algorithm != null) {
		return this.algorithm.getPrevNode(location);
	} else {
		return null;
	}
};

/**
 * Returns the position of the next visitable node in the project. Returns
 * null if there are no visitable nodes after the given location.
 * 
 * @param location
 * @return location
 */
NavigationLogic.prototype.getNextVisitableNode = function(location){
	var nextNodeLoc = this.getNextNode(location);
	while (nextNodeLoc != null && 
			(this.view.getProject().getNodeByPosition(nextNodeLoc).isSequence() ||
			 this.view.getProject().getNodeByPosition(nextNodeLoc).isHiddenFromNavigation() ||
			 this.getVisitableStatus(nextNodeLoc).value !== 0)) {
		nextNodeLoc = this.getNextNode(nextNodeLoc);
	}
	
	return nextNodeLoc;
};

/**
 * Returns the position of the next node in the project regardless of
 * whether it is visitable or not. Returns null if there are no nodes 
 * after the given location.
 * @param location the node location e.g. 1.5
 * @return the next node location in the project or null if there
 * is none
 */
NavigationLogic.prototype.getNextStepNodeInProject = function(location){
	//get the next node location
	var nextNodeLoc = this.getNextNode(location);
	
	//loop until we find a node that is not a sequence
	while (nextNodeLoc != null && 
			this.view.getProject().getNodeByPosition(nextNodeLoc).isSequence()) {
		nextNodeLoc = this.getNextNode(nextNodeLoc);
	}
	
	return nextNodeLoc;
};

/**
 * Returns the position of the previous visitable node in the project. Returns
 * null if there are no visitable nodes before the given location.
 * 
 * @param location
 * @return location
 */
NavigationLogic.prototype.getPrevVisitableNode = function(location){
	var prevNodeLoc = this.getPrevNode(location);
	while (prevNodeLoc != null && 
			(this.view.getProject().getNodeByPosition(prevNodeLoc).isSequence() || 
			 this.view.getProject().getNodeByPosition(prevNodeLoc).isHiddenFromNavigation() ||
			 this.getVisitableStatus(prevNodeLoc).value !== 0)) {
		prevNodeLoc = this.getPrevNode(prevNodeLoc);
	}
	
	return prevNodeLoc;
};

/**
 * Returns the position of the prev node in the project regardless of
 * whether it is visitable or not. Returns null if there are no nodes 
 * before the given location.
 * @param location the node location e.g. 1.5
 * @return the prev node location in the project or null if there
 * is none
 */
NavigationLogic.prototype.getPrevStepNodeInProject = function(location){
	//get the next node location
	var prevNodeLoc = this.getPrevNode(location);
	
	//loop until we find a node that is not a sequence
	while (prevNodeLoc != null && this.view.getProject().getNodeByPosition(prevNodeLoc).isSequence()) {
		prevNodeLoc = this.getPrevNode(prevNodeLoc);
	}
	
	return prevNodeLoc;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/NavigationLogic.js');
}