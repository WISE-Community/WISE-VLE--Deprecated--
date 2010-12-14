/**
 * A WorkOnXBeforeYConstraint is an object that represents a constraint specifying
 * that a node or sequence X must have completed work before visiting a node or 
 * sequence Y.
 * 
 * @author patrick lawler
 */
WorkOnXBeforeYConstraint.prototype = new Constraint();
WorkOnXBeforeYConstraint.prototype.constructor = WorkOnXBeforeYConstraint;
WorkOnXBeforeYConstraint.prototype.parent = Constraint.prototype;
function WorkOnXBeforeYConstraint(opts){
	/* call super */
	Constraint.prototype.constructor.call(this,opts);
	
	/* set type */
	this.type = 'WorkOnXBeforeYConstraint';
	this.constraintSatisfaction;
	
	/* Set the message if provided, set default if not. The default message is dependent on the modes */
	var xTitle = this.view.getProject().getNodeById(this.xId).getTitle();
	var xMsg = (this.xMode=='node') ? 'the step ' + xTitle : (this.xMode=='sequenceAny') ? 'ANY step in activity ' + xTitle :
		'ALL steps in activity ' + xTitle;
	var yTitle = this.view.getProject().getNodeById(this.yId).getTitle();
	var yMsg = (this.status==1) ? (this.yMode=='node') ? ' before this step will be enabled.' : ' before any of the steps for activity ' + 
		yTitle + ' will be enabled.' : (this.yMode=='node') ? ' before visiting the step ' + yTitle + '.' : ' before visiting the activity ' + 
		yTitle + '.';
	this.msg = (opts.msg) ? opts.msg : 'You must complete the work for ' + xMsg + yMsg;
	
	this.setupPatterns();
};

WorkOnXBeforeYConstraint.prototype.setupPatterns = function(){
	/* This constraint takes affect just by running the project, so we
	 * want to set the constraint pattern to undefined */
	this.constraintSatisfaction = {
		constraintPattern: undefined,
		satisfactionPattern: {sequential:false,all:undefined,nodeIds:[],workCompleted:true},
		toVisitId: undefined
	};
	
	/* setup satisfaction pattern */
	if(this.xMode=='node'){
		this.constraintSatisfaction.satisfactionPattern.all = false;
		this.constraintSatisfaction.satisfactionPattern.nodeIds.push(this.xId);
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
}

/**
 * This constraint is satisfied when the yMode is:
 * 
 * node - when the node with the yId has completed work
 * sequenceAny - when any node in the sequence with the yId has completed work
 * sequenceAll - when all nodes in the sequence with the yId has completed work
 * 
 * @param toVisitPosition
 * @return boolean
 */
WorkOnXBeforeYConstraint.prototype.isSatisfied = function(toVisitPosition){
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
WorkOnXBeforeYConstraint.prototype.getAffectedIds = function(){
	if(this.yMode=='node'){
		return [this.yId];
	} else {
		return this.view.getProject().getDescendentNodeIds(this.yId);
	}
	
	return [];
};

/**
 * Given the just rendered node position, returns true if this constraint has
 * been satisfied at least once, returns false otherwise.
 * 
 * @param position
 * @return boolean
 */
WorkOnXBeforeYConstraint.prototype.isDeceased = function(){
	return this.patternMatches(this.constraintSatisfaction.satisfactionPattern, this.view.state.visitedNodes.slice());
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
WorkOnXBeforeYConstraint.prototype.updateMenuStatus = function(menuStatus){
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
WorkOnXBeforeYConstraint.prototype.getTargetId = function(){
	return this.yId;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/constraints/workonxbeforeyconstraint.js');
}