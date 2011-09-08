/**
 * A WorkOnXBeforeAdvancingConstraint is an object that represents a constraint specifying
 * that a node or sequence X must have completed work before visiting any other step.
 * 
 * @author patrick lawler
 */
WorkOnXBeforeAdvancingConstraint.prototype = new Constraint();
WorkOnXBeforeAdvancingConstraint.prototype.constructor = WorkOnXBeforeAdvancingConstraint;
WorkOnXBeforeAdvancingConstraint.prototype.parent = Constraint.prototype;
function WorkOnXBeforeAdvancingConstraint(opts){
	/* call super */
	Constraint.prototype.constructor.call(this, opts);
	
	/* set type */
	this.type = 'WorkOnXBeforeAdvancingConstraint';
	this.constraintSatisfaction;
	
	/* Set the message if provided, set default if not. The default message is dependent on the modes */
	var xTitle = this.view.getProject().getNodeById(this.xId).getTitle();
	var xMsg = (this.xMode=='node') ? "the step '" + xTitle + "'" : (this.xMode=='sequenceAny') ? "ANY step in activity '" + xTitle  + "'":
		"ALL steps in activity '" + xTitle + "'";
	
	//default button name will be the 'save' button
	var buttonName = 'save';
	
	if(opts.buttonName != null) {
		/*
		 * check if there is a different button name we need them to click
		 * such as the 'submit' button
		 */
		buttonName = opts.buttonName;
	}
	
	if(opts.msg) {
		this.msg = opts.msg;
	} else {
		this.msg = "You must complete the work for " + xMsg + " before moving ahead. If you are satisfied with your answer, click the '" + buttonName + "' button.";
	}
	
	this.setupPatterns();
};

/**
 * Sets up the constraint and satisfaction patterns for this constraint
 */
WorkOnXBeforeAdvancingConstraint.prototype.setupPatterns = function(){
	/* setup the constraint satisfaction object with the constraint and satisfaction patterns */
	this.constraintSatisfaction = {
		constraintPattern: {sequential:false,all:undefined,nodeIds:[]},
		satisfactionPattern: {sequential:false,all:undefined,nodeIds:[],workCompleted:true},
		toVisitId: undefined
	};
	
	/* setup trigger (constraint) pattern and satisfaction patterns */
	if(this.xMode=='node'){
		//turn on constraint when we the student visits this node
		this.constraintSatisfaction.constraintPattern.nodeIds.push(this.xId);
		
		//turn off the constraint when the student has worked on this node
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
WorkOnXBeforeAdvancingConstraint.prototype.isSatisfied = function(toVisitPosition){
	/* if the toVisitPosition was specified and resolves to a node, we want to add its id
	 * to the constraintSatisfaction object */
	var toVisitNode = this.view.getProject().getNodeByPosition(toVisitPosition);
	this.constraintSatisfaction.toVisitId = (toVisitNode == null) ? null : toVisitNode.id;
	
	return this._isConstraintSatisfied(this.constraintSatisfaction);
};

/**
 * Returns the ids of the nodes that this constraint applies to. Returns
 * an empty array if nothing is affected. The nodes that will be constrained
 * are the ones that come after the current step.
 * @return array - nodeIds of affected nodes
 */
WorkOnXBeforeAdvancingConstraint.prototype.getAffectedIds = function(){
	var affectedIds = [];
	
	//get all the node ids in the order that they appear in the project
	var nodeIds = this.view.getProject().getNodeIds();
	
	//flag for determining if a node is before the node that is constrained
	var nodeIdIsBeforeThisId = true;
	
	//loop through all the node ids
	for(var x=0; x<nodeIds.length; x++) {
		//check if this is before the constrained node
		if(!nodeIdIsBeforeThisId) {
			/*
			 * the node is after the constrained node so we will add
			 * it to the array of affected nodes
			 */
			affectedIds.push(nodeIds[x]);
		}
		
		if(nodeIds[x] == this.xId) {
			/*
			 * we have found the constrained node so every node after
			 * this will be added to the array of affected nodes
			 */
			nodeIdIsBeforeThisId = false;
		}
	}
	
	return affectedIds;
};

/**
 * This constraint will have no effect once it is satisfied, so we do not need to
 * check the liftOnSatisfaction boolean, return true if this constraint has
 * been satisfied, false otherwise.
 * 
 * @param position
 * @return boolean
 */
WorkOnXBeforeAdvancingConstraint.prototype.isDeceased = function(position){
	return this.patternMatches(this.constraintSatisfaction.satisfactionPattern,this.view.state.visitedNodes.slice());
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
WorkOnXBeforeAdvancingConstraint.prototype.updateMenuStatus = function(menuStatus){
	/* This constraint will only affect the menu if the step or sequence specified
	 * by this id has been visited but work has not been completed yet */
	if(!this.isSatisfied(null, null)){

		//get all the node ids in the order that they appear in the project
		var nodeIds = this.view.getProject().getNodeIds();
		
		//flag for determining if a node is before the node that is constrained
		var nodeIdIsBefore = true;
		
		//loop through all the node ids
		for(var x=0; x<nodeIds.length; x++) {
			//check if this is before the constrained node
			if(!nodeIdIsBefore) {
				/*
				 * the node is after the constrained node so we will set
				 * the menu status of the node to disabled so it will
				 * appear greyed out to the student since they won't
				 * be able to visit it until the constraint is satisfied
				 */
				menuStatus[nodeIds[x]] = (menuStatus[nodeIds[x]]) ? Math.max(menuStatus[nodeIds[x]], this.menuStatus) : this.menuStatus;
			}
			
			if(nodeIds[x] == this.xId) {
				/*
				 * we have found the constrained node so every node after
				 * this will be disabled
				 */
				nodeIdIsBefore = false;
			}
		}
	}
};

/**
 * Returns the Id of the node that this constraint was created for.
 * 
 * @return string - id
 */
WorkOnXBeforeAdvancingConstraint.prototype.getTargetId = function(){
	return this.xId;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/constraints/workonxbeforeadvancingconstraint.js');
}