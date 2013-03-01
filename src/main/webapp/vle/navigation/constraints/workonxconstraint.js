/**
 * A WorkOnXConstraint is an object that represents a constraint specifying
 * that a node or sequence X must have completed work before visiting any other step.
 * 
 * @author patrick lawler
 */
WorkOnXConstraint.prototype = new Constraint();
WorkOnXConstraint.prototype.constructor = WorkOnXConstraint;
WorkOnXConstraint.prototype.parent = Constraint.prototype;
function WorkOnXConstraint(opts){
	/* call super */
	Constraint.prototype.constructor.call(this, opts);
	
	/* set type */
	this.type = 'WorkOnXConstraint';
	this.constraintSatisfaction;
	
	/* Set the message if provided, set default if not. The default message is dependent on the modes */
	var xTitle = this.view.getProject().getNodeById(this.xId).getTitle();
	var xMsg = (this.xMode=='node') ? 'the step ' + xTitle : (this.xMode=='sequenceAny') ? 'ANY step in activity ' + xTitle :
		'ALL steps in activity ' + xTitle;
	this.msg = (opts.msg) ? opts.msg : 'You must complete the work for ' + xMsg + ((this.status==1) ? ' before any other step will ' +
		'be enabled.' : ' before visiting any other step.');
	
	this.setupPatterns();
};

/**
 * Sets up the constraint and satisfaction patterns for this constraint
 */
WorkOnXConstraint.prototype.setupPatterns = function(){
	/* setup the constraint satisfaction object with the constraint and satisfaction patterns */
	this.constraintSatisfaction = {
		constraintPattern: {sequential:false,all:undefined,nodeIds:[]},
		satisfactionPattern: {sequential:false,all:undefined,nodeIds:[],workCompleted:true},
		toVisitId: undefined
	};
	
	/* setup trigger (constraint) pattern and satisfaction patterns */
	if(this.xMode=='node'){
		this.constraintSatisfaction.constraintPattern.nodeIds.push(this.xId);
		this.constraintSatisfaction.satisfactionPattern.nodeIds.push(this.xId);
	} else if(this.xMode=='sequenceAny'){
		this.constraintSatisfaction.constraintPattern.nodeIds = this.view.getProject().getDescendentNodeIds(this.xId);
		this.constraintSatisfaction.constraintPattern.all = false;
		this.constraintSatisfaction.satisfactionPattern.nodeIds = this.view.getProject().getDescendentNodeIds(this.xId);
		this.constraintSatisfaction.satisfactionPattern.all = false;
	} else if(this.xMode=='sequenceAll'){
		this.constraintSatisfaction.constraintPattern.nodeIds = this.view.getProject().getDescendentNodeIds(this.xId);
		this.constraintSatisfaction.constraintPattern.all = false;
		this.constraintSatisfaction.satisfactionPattern.nodeIds = this.view.getProject().getDescendentNodeIds(this.xId);
		this.constraintSatisfaction.satisfactionPattern.all = true;
	} else {
		this.view.notificationManager.notify('Invalid satisfaction pattern setup, aborting.', 3);
		return;
	}
};

/**
 * This constraint is satisfied if the the steps related to the xId have not
 * been visited or if they have been visited, the work has been completed.
 * 
 * @param toVisitPosition
 */
WorkOnXConstraint.prototype.isSatisfied = function(toVisitPosition){
	/* if the toVisitPosition was specified and resolves to a node, we want to add its id
	 * to the constraintSatisfaction object */
	var toVisitNode = this.view.getProject().getNodeByPosition(toVisitPosition);
	this.constraintSatisfaction.toVisitId = (toVisitNode == null) ? null : toVisitNode.id;
	
	// only invoke the WorkOnXConstraint when the student is on node X.
	if (this.xId == this.view.getProject().getNodeByPosition(this.view.getCurrentPosition()).id) {
		return this._isConstraintSatisfied(this.constraintSatisfaction);		
	}
	return true;
};

/**
 * Returns the ids of the nodes that this constraint applies to. Returns
 * an empty array if nothing is affected.
 * 
 * @return array - nodeIds of affected nodes
 */
WorkOnXConstraint.prototype.getAffectedIds = function(){
	/* this constraint affects all ids except those related to the xId */
	var allIds = this.view.getProject().getLeafNodes().map(function(node){return node.id;});
	if(this.xMode=='node') {
		allIds.splice(allIds.indexOf(this.xId),1);
		return allIds;
	} else {
		/* retrieve the descendents for the xId */
		var xIds = this.view.getProject().getDescendentNodeIds(this.xId);
		
		/* remove them from the allIds array */
		for(var j=0;j<xIds.length;j++){
			allIds.splice(allIds.indexOf(xIds[j]),1);
		}
		
		/* return the array */
		return allIds;
	}
};

/**
 * This constraint will have no effect once it is satisfied, so we do not need to
 * check the liftOnSatisfaction boolean, return true if this constraint has
 * been satisfied, false otherwise.
 * 
 * @param position
 * @return boolean
 */
WorkOnXConstraint.prototype.isDeceased = function(position){
	return this.patternMatches(this.constraintSatisfaction.satisfactionPattern,this.view.getState().visitedNodes.slice());
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
WorkOnXConstraint.prototype.updateMenuStatus = function(menuStatus){
	/* This constraint will only affect the menu if the step or sequence specified
	 * by this id has been visited but work has not been completed yet */
	if(!this.isSatisfied(null, null)){
		var node = this.view.getProject().getNodeById(this.xId);
	
		/* get all node and sequence node ids */
		var allIds = this.view.getProject().getLeafNodes().map(function(node){return node.id;});
		allIds = allIds.concat(this.view.getProject().getSequenceNodes().map(function(node){return node.id;}));
		
		/* remove all ids related to the xId */
		allIds.splice(allIds.indexOf(this.xId), 1);
		
		if(this.xMode=='node'){
			/* this is a node, also remove the sequence parent of this node id */
			allIds.splice(allIds.indexOf(node.parent.id), 1);
		} else {
			/* this is a sequence, also remove all of its descendent node ids */
			var descendents = this.view.getProject().getDescendentNodeIds(this.xId, true);
			for(var v=0;v<descendents.length;v++){
				allIds.splice(allIds.indexOf(descendents[v]),1);
			}
		}
		
		/* update the given menuStatus */
		for(var n=0;n<allIds.length;n++){
			menuStatus[allIds[n]] = (menuStatus[allIds[n]]) ? Math.max(menuStatus[allIds[n]], this.menuStatus) : this.menuStatus;
		}
	}
};

/**
 * Returns the Id of the node that this constraint was created for.
 * 
 * @return string - id
 */
WorkOnXConstraint.prototype.getTargetId = function(){
	return this.xId;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/constraints/workonxconstraint.js');
}