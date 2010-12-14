/**
 * A VisitXAfterYConstraint is an object that represents a constraint specifying
 * that a node or sequence X must be visited after a node or sequence Y.
 * 
 * @author patrick lawler
 */
VisitXAfterYConstraint.prototype = new Constraint();
VisitXAfterYConstraint.prototype.constructor = VisitXAfterYConstraint;
VisitXAfterYConstraint.prototype.parent = Constraint.prototype;
function VisitXAfterYConstraint(opts){
	/* call super */
	Constraint.prototype.constructor.call(this, opts);
	
	/* set the type */
	this.type = 'VisitXAfterYConstraint';
	this.constraintSatisfaction;
	
	/* Set the message if provided, set default if not. The default message is dependent on the modes */
	var msgTitle = this.view.getProject().getNodeById(this.xId).getTitle();
	this.msg = (opts.msg) ? opts.msg : (this.status==1) ? (this.xMode=='node') ? 'All steps will be disabled until you visit ' +
		msgTitle : (this.xMode=='sequenceAll') ? 'You must visit ALL steps in activity ' + msgTitle + ' before the other steps will ' +
		'be re-enabled.' : 'You must visit ANY of the steps in activity ' + msgTitle + ' before any other step will be enabled.' : 
		(this.xMode=='node') ? 'You must visit ' + msgTitle + ' before visiting any other step.' : (this.xMode=='sequenceAll') ? 
		'You must visit ALL steps in activity ' + msgTitle  + ' before visiting any other step.' : 'You must visit ANY of the steps ' +
		'in activity ' + msgTitle + ' before visiting any other step.';
	
	this.setupPatterns();
};

/**
 * Sets up the constraint and satisfaction patterns for this constraint.
 */
VisitXAfterYConstraint.prototype.setupPatterns = function(){
	this.constraintSatisfaction = {
		constraintPattern: {sequential:false,all:undefined,nodeIds:[]},
		satisfactionPattern: {sequential:false,all:undefined,nodeIds:[]},
		toVisitId: undefined
	};
	
	/* setup constraint pattern */
	if(this.yMode=='node'){
		this.constraintSatisfaction.constraintPattern.nodeIds.push(this.yId);
		this.constraintSatisfaction.constraintPattern.all = true;
	} else if(this.yMode=='sequenceAny'){
		this.constraintSatisfaction.constraintPattern.nodeIds = this.view.getProject().getDescendentNodeIds(this.yId);
		this.constraintSatisfaction.constraintPattern.all = false;
	} else if(this.yMode=='sequenceAll'){
		this.constraintSatisfaction.constraintPattern.nodeIds = this.view.getProject().getDescendentNodeIds(this.yId);
		constraintPattern.all = true;
	} else {
		this.view.notificationManager.notify('Invalid constraint pattern setup, aborting.', 3);
		return;
	}
	
	/* setup satisfaction pattern */
	if(this.xMode=='node'){
		this.constraintSatisfaction.satisfactionPattern.nodeIds.push(this.xId);
		this.constraintSatisfaction.satisfactionPattern.all = true;
	} else if(this.xMode=='sequenceAny'){
		this.constraintSatisfaction.satisfactionPattern.nodeIds = this.view.getProject().getDescendentNodeIds(this.xId);
		this.constraintSatisfaction.satisfactionPattern.all = false;
	} else if(this.xMode=='sequenceAll'){
		this.constraintSatisfaction.satisfactionPattern.nodeIds = this.view.getProject().getDescendentNodeIds(this.xId);
		this.constraintSatisfaction.satisfactionPattern.all = true;
	} else {
		this.view.notificationManager.notify('Invalid satisfaction pattern setup, aborting.', 3);
		return;
	}
};

/**
 * Returns true if this constraint is satisfied, returns false otherwise.
 * 
 * @param toVisitPosition
 * @return boolean
 */
VisitXAfterYConstraint.prototype.isSatisfied = function(toVisitPosition){
	/* if the toVisitPosition was specified and resolves to a node, we want to add its id
	 * to the constraintSatisfaction object */
	var toVisitNode = this.view.getProject().getNodeByPosition(toVisitPosition);
	this.constraintSatisfaction.toVisitId = (toVisitNode == null) ? null : toVisitNode.id;
	
	return this._isConstraintSatisfied(this.constraintSatisfaction);
};

/**
 * Returns the ids of the nodes that this constraint applies to. Returns
 * an empty array if nothing is affected.
 * 
 * @return array - nodeIds of affected nodes
 */
VisitXAfterYConstraint.prototype.getAffectedIds = function(){
	/* this constraint affects all ids except those related to the xId */
	var allIds = this.view.getProject().getLeafNodes().map(function(node){return node.id;});
	var xIds = (this.xMode=='node') ? [this.xId] : this.view.getProject().getDescendentNodeIds(this.xId);
	
	/* remove any ids related to xId from allIds */
	for(var a=0;a<xIds.length;a++){
		allIds.splice(allIds.indexOf(xIds[a]),1);
	}
	
	return allIds;
};

/**
 * Given the just rendered node position, returns true if this constraint has
 * been satisfied once and liftOnSatisfaction is true, returns false otherwise.
 * 
 * @param position
 * @return boolean
 */
VisitXAfterYConstraint.prototype.isDeceased = function(position){
	if(this.liftOnSatisfaction){
		var remaining = this.patternMatches(this.constraintSatisfaction.constraintPattern,this.view.state.visitedNodes.slice());
		if(remaining){
			return this.patternMatches(this.constraintSatisfaction.satisfactionPattern,remaining);
		}
	}
	
	return false;
};

/**
 * Given a menuStatus object, updates all position keys in the object that
 * are affected by this constraint with the greater of the existing menuClass
 * value for that position or the menuClass specified in this constraint. The
 * menuStatus can be 0 = no visibility restriction in menu, 1 = disabled in menu, 
 * 2 = not visible in menu.
 * 
 * @param object - menuStatus
 */
VisitXAfterYConstraint.prototype.updateMenuStatus = function(menuStatus){
	if(this.xMode=='node') {
		/* since the mode is node, this constraint affects all other nodes except
		 * that specified by the xId so we want to get all project nodes and remove
		 * the xId and its parent's (sequence) id */
		var node = this.view.getProject().getNodeById(this.xId);
		var allNodeIds = this.view.getProject().getLeafNodes().slice().map(function(node){return node.id;});
		var allSequenceIds = this.view.getProject().getSequenceNodes().slice().map(function(node){return node.id;});
		var affectedIds = [];
		
		/* remove the xId from allNodeIds and the nodes parent from allSequenceIds,
		 * then add them to the affectedIds array */
		allNodeIds.splice(allNodeIds.indexOf(this.xId),1);
		allSequenceIds.splice(allSequenceIds.indexOf(node.parent.id),1);
		
		var affectedIds = allSequenceIds.concat(allNodeIds);
	} else {
		/* since the mode is sequenc, this constraint affects all other sequences
		 * and their children nodes, so we want to get all project nodes and remove
		 * this sequence and its children's ids */
		var seqNode = this.view.getProject().getNodeById(this.xId);
		var children = seqNode.parent.children.slice();
		children.splice(children.indexOf(seqNode),1);
		var affectedSequenceIds = children.map(function(node){return node.id;});
		var affectedIds = affectedSequenceIds.slice();
		
		/* iterate through affectedSequences, adding all of their descendent ids to
		 * the affectedIds array */
		for(var p=0;p<affectedSequenceIds.length;p++){
			affectedIds = affectedIds.concat(this.view.getProject().getDescendentNodeIds(affectedSequenceIds[p], true));
		}
	}
	
	/* update the given menuStatus */
	for(var n=0;n<affectedIds.length;n++){
		menuStatus[affectedIds[n]] = (menuStatus[affectedIds[n]]) ? Math.max(menuStatus[affectedIds[n]], this.menuStatus) : this.menuStatus;
	}
};

/**
 * Returns the Id of the node that this constraint was created for.
 * 
 * @return string - id
 */
VisitXAfterYConstraint.prototype.getTargetId = function(){
	return this.yId;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/constraints/visitxafteryconstraint.js');
}