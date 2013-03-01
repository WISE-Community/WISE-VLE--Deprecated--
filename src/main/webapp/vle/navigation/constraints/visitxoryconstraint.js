/**
 * A VisitXOrYConstraint is an object that represents a constraint specifying
 * that either a node or sequence X can be visited or a node or sequence Y, but
 * not both.
 * 
 * @author patrick lawler
 */
VisitXOrYConstraint.prototype = new Constraint();
VisitXOrYConstraint.prototype.constructor = VisitXOrYConstraint;
VisitXOrYConstraint.prototype.parent = Constraint.prototype;
function VisitXOrYConstraint(opts){
	/* call super */
	Constraint.prototype.constructor.call(this, opts);
	
	/* set type */
	this.type = 'VisitXOrYConstraint';
	
	/* Set the message if provided, set default if not. The default message is dependent on the mode */
	var xTitle = this.view.getProject().getNodeById(this.xId).getTitle();
	var xName = (this.xMode=='node') ? 'step ' : 'activity ';
	var yTitle = this.view.getProject().getNodeById(this.yId).getTitle();
	var yName = (this.yMode=='node') ? 'step ' : 'activity ';
	this.msg = (opts.msg) ? opts.msg : 'You are only allowed to visit the ' + xName + xTitle + ' OR the ' + 
			yName + yTitle + ', ' + ((opts.status==1) ? ' the other will be disabled.' : 'NOT both.');
};

/**
 * This constraint is satisfied if:
 * 
 * None of the x nodes or y nodes have been visited
 * If a x node is visited, then the toVisitPosition is neither x nor y or is in x
 * If a y node is visited, then the toVisitPosition is neither x nor y or is in y
 * 
 * @param toVisitPosition
 * @return boolean
 */
VisitXOrYConstraint.prototype.isSatisfied = function(toVisitPosition){
	var xIds = this.getXIds();
	var yIds = this.getYIds();
	var toVisitNode = this.view.getProject().getNodeByPosition(toVisitPosition);
	var toVisitId = (toVisitNode) ? toVisitNode.id : null;
	
	/* If any of the xIds have been visited, this constraint is satisfied if
	 * the toVisitPosition is not in the yIds. If any of the yIds have been
	 * visited, this constraint is satisfied if the toVisitPosition is not in
	 * the xIds. If none of the xIds or yIds has been visited, this constraint
	 * is satisfied. If the toVisitPosition is not specified or is in neither
	 * the xIds nor yIds, then this constraint is satisfied. */
	var xVisited = this.anyVisited(xIds);
	var yVisited = this.anyVisited(yIds);
	
	if((xVisited || xVisited===0) && (yVisited || yVisited===0)){
		if(xVisited < yVisited){
			if(toVisitId && yIds.indexOf(toVisitId) != -1){
				return false;
			}
		} else {
			if(toVisitId && xIds.indexOf(toVisitId) != -1){
				return false;
			}
		}
	} else if((xVisited || xVisited===0) && toVisitId && yIds.indexOf(toVisitId) != -1){
		return false;
	} else if((yVisited || yVisited===0) && toVisitId && xIds.indexOf(toVisitId) != -1){
		return false;
	}
	
	return true;
};

/**
 * Returns the ids of the nodes that this constraint applies to. Returns
 * an empty array if nothing is affected.
 * 
 * @return array - nodeIds of affected nodes
 */
VisitXOrYConstraint.prototype.getAffectedIds = function(){
	return this.getXIds().concat(this.getYIds());
};

/**
 * Returns all Ids related to the xId.
 */
VisitXOrYConstraint.prototype.getXIds = function(){
	var xIds = [];
	
	if(this.xMode=='node'){
		xIds.push(this.xId);
	} else {
		xIds = this.view.getProject().getDescendentNodeIds(this.xId);
	}
	
	return xIds;
};

/**
 * Returns all Ids related to the yId.
 */
VisitXOrYConstraint.prototype.getYIds = function(){
	var yIds = [];
	
	if(this.yMode=='node'){
		yIds.push(this.yId);
	} else {
		yIds = this.view.getProject().getDescendentNodeIds(this.yId);
	}
	
	return yIds;
};

/**
 * Given an array of ids, returns the position of the first visited
 * in the array. If none have been visited, returns null.
 * 
 * @param array - ids
 * @return boolean
 */
VisitXOrYConstraint.prototype.anyVisited = function(ids){
	/* get the nodeVisits and iterate through looking up each id, when the first
	 * is found, return the index at that position */
	var nodeVisits = this.view.getState().visitedNodes;
	for(var u=0;u<nodeVisits.length;u++){
		if(ids.indexOf(nodeVisits[u].nodeId) != -1){
			return u;
		}
	}
	
	return null;
};

/**
 * This constraint is always in effect, so will always return false.
 */
VisitXOrYConstraint.prototype.isDeceased = function(){
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
VisitXOrYConstraint.prototype.updateMenuStatus = function(menuStatus){
	/* for this constraint, the menu status will be dependent on whether any of
	 * the steps related to either the xId or yId has been visited */
	var xIds = [], yIds = [], affectedIds = [];
	
	/* collect the xIds */
	xIds.push(this.xId);
	if(this.xMode!='node'){
		xIds = xIds.concat(this.view.getProject().getDescendentNodeIds(this.xId, true));
	}
	
	/* collect the yIds */
	yIds.push(this.yId);
	if(this.yMode!='node'){
		yIds = yIds.concat(this.view.getProject().getDescendentNodeIds(this.yId, true));
	}
	
	/* set the affectedIds based on which, if any, have been visited */
	var xVisited = this.anyVisited(xIds);
	var yVisited = this.anyVisited(yIds);
	if((xVisited || xVisited===0) && (yVisited || yVisited===0)){
		/* both x and y have been visited, so see which was visited first */
		if(xVisited < yVisited){
			affectedIds = yIds;
		} else {
			affectedIds = xIds;
		}
	} else if(xVisited || xVisited===0){
		/* only x has been visited */
		affectedIds = yIds;
	} else if(yVisited || yVisited===0){
		/* only y has been visited */
		affectedIds = xIds;
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
VisitXOrYConstraint.prototype.getTargetId = function(){
	return this.yId;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/constraints/visitxoryconstraint.js');
}