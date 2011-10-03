/**
 * A VisitXBeforeYConstraint is an object that represents a constraint specifying
 * that a node or sequence X must be visited before a node or sequence Y.
 * 
 * @author patrick lawler
 */
VisitXBeforeYConstraint.prototype = new Constraint();
VisitXBeforeYConstraint.prototype.constructor = VisitXBeforeYConstraint;
VisitXBeforeYConstraint.prototype.parent = Constraint.prototype;
function VisitXBeforeYConstraint(opts){
	/* call super */
	Constraint.prototype.constructor.call(this, opts);
	
	/* set the type */
	this.type = 'VisitXBeforeYConstraint';
	this.constraintSatisfaction;
	
	/* Set the message if provided, set default if not. The default message is dependent on the 
	 * mode and the status */
	var msgTitle = this.view.getProject().getStepNumberAndTitle(this.xId);
	this.msg = (opts.msg) ? opts.msg : (this.status==1) ? (this.xMode=='node') ? 'This step will be disabled until you visit ' +
		msgTitle : (this.xMode=='sequenceAll') ? 'This step will be disabled until you visit ALL steps in ' + msgTitle : 'This ' +
		'step will be disabled until you visit ANY of the steps in activiity ' + msgTitle : (this.xMode=='node') ? 'You must visit ' + 
		msgTitle + ' before visiting this step.' : (this.xMode=='sequenceAll') ? 'You must visit ALL steps in activity ' + msgTitle  + 
		' before visiting this step.' : 'You must visit ANY of the steps in activity ' + msgTitle + ' before visiting this step.';
	
	this.setupPatterns();
};

/**
 * Sets up the constraint and satisfaction patterns for this constraint
 */
VisitXBeforeYConstraint.prototype.setupPatterns = function(){
	/* This constraint takes affect just by running the project, so we
	 * want to set the constraint pattern to undefined */
	this.constraintSatisfaction = {
		constraintPattern: undefined,
		satisfactionPattern: {sequential:false,all:undefined,nodeIds:[]},
		toVisitId: undefined,
		effective: this.effective
	};
	
	/* setup satisfaction pattern */
	if(this.xMode=='node'){
		this.constraintSatisfaction.satisfactionPattern.all = false;
		this.constraintSatisfaction.satisfactionPattern.nodeIds.push(this.xId);
		
		//display a bubble next to the X step
		//eventManager.fire('displayMenuBubble', [this.xId, 'You must visit this step before trying to answer again']);
		//eventManager.fire('displayMenuBubble', [this.xId, 'You must visit the yellow highlighted step before trying to answer again']);
		
		//highlight the X step
		eventManager.fire('highlightStepInMenu', [this.xId]);
	} else if(this.xMode=='sequenceAny'){
		this.constraintSatisfaction.satisfactionPattern.all = false;
		this.constraintSatisfaction.satisfactionPattern.nodeIds = this.view.getProject().getDescendentNodeIds(this.xId);
	} else if(this.xMode=='sequenceAll'){
		this.constraintSatisfaction.satisfactionPattern.all = true;
		this.constraintSatisfaction.satisfactionPattern.nodeIds = this.view.getProject().getDescendentNodeIds(this.xId);
	} else {
		this.view.notificationManager.notify('Invalid satisfaction pattern setup, aborting.', 3);
		return;
	}
};

/**
 * This constraint is satisfied when the yMode is:
 * 
 * node - when the node with the yId has been visited
 * sequenceAny - when any node in the sequence with the yId has been visited
 * sequenceAll - when all nodes in the sequence with the yId has been visited
 * 
 * @param toVisitPosition
 * @return boolean
 */
VisitXBeforeYConstraint.prototype.isSatisfied = function(toVisitPosition){
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
VisitXBeforeYConstraint.prototype.getAffectedIds = function(){
	var affectedIds = [];
	
	/* add the node(s) ids that cannot be visited until after */
	if(this.yMode=='node'){
		affectedIds.push(this.yId);
	} else {
		affectedIds = this.view.getProject().getDescendentNodeIds(this.yId);
	}
	
	return affectedIds;
};

/**
 * Given the just rendered node position, returns true if this constraint has
 * been satisfied at least once, returns false otherwise.
 * 
 * @param position
 * @return boolean
 */
VisitXBeforeYConstraint.prototype.isDeceased = function(position){
	return this.patternMatches(this.constraintSatisfaction.satisfactionPattern, this.getEffectiveNodeVisits(this.view.state.visitedNodes.slice(), this.effective));
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
VisitXBeforeYConstraint.prototype.updateMenuStatus = function(menuStatus){
	/* add the yId to the affectedIds array */
	var affectedIds = [this.yId];
	
	if(this.yMode!='node'){	
		/* add this sequence's children */
		affectedIds = affectedIds.concat(this.view.getProject().getDescendentNodeIds(this.yId));
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
VisitXBeforeYConstraint.prototype.getTargetId = function(){
	return this.yId;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/constraints/visitxbeforeyconstraint.js');
}

