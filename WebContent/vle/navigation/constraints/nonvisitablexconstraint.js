/**
 * A NonvisitableXConstraint is an object that represents a constraint specifying
 * that a node or sequence X cannot be visited.
 * 
 * @author patrick lawler
 */
NotVisitableXConstraint.prototype = new Constraint();
NotVisitableXConstraint.prototype.constructor = NotVisitableXConstraint;
NotVisitableXConstraint.prototype.parent = Constraint.prototype;
function NotVisitableXConstraint(opts){
	/* call super */
	Constraint.prototype.constructor.call(this, opts);
	
	/* set type */
	this.type = 'NotVisitableXConstraint';
	
	/* Set the message if provided, set default if not. The default message is dependent on the mode */
	this.msg = (opts.msg) ? opts.msg : (this.status==1) ? (this.xMode=='node') ?  'This step is currently disabled.' :
		'All of the steps in this activity are currently disabled.' : (this.xMode=='node') ? 'This step is currently not visitable' :
		'None of the steps in this activity are currently visitable.';
};

/**
 * This constraint is never satisfied and will always return false.
 * 
 * @param toVisitPosition
 * @return false
 */
NotVisitableXConstraint.prototype.isSatisfied = function(toVisitPosition){
	return false;
};


/**
 * Returns the ids of the nodes that this constraint applies to. Returns
 * an empty array if nothing is affected.
 * 
 * @return array - nodeIds of affected nodes
 */
NotVisitableXConstraint.prototype.getAffectedIds = function(){
	if(this.xMode=='node'){
		return [this.xId];
	} else if(this.xMode=='sequenceAny' || this.xMode=='sequenceAll'){
		if(this.view.getProject().getNodeById(this.xId).isSequence()){
			return this.view.getProject().getDescendentNodeIds(this.xId);
		} else {
			return [this.xId];
		}
	}
	
	return [];
};

/**
 * This constraint is permanent so is never deceased. If you need a constraint
 * that can be satisfied, try one of the others or combination of others or create
 * a new one.
 * 
 * @return false
 */
NotVisitableXConstraint.prototype.isDeceased = function(){
	return false;
};

/**
 * Given a menuStatus object, updates all nodeId keys in the object that
 * are affected by this constraint with the greater of the existing menuClass
 * value for that position or the menuClass specified in this constraint. The
 * menuStatus can be 0 = no visibility restriction in menu, 1 = disabled in menu, 
 * 2 = not visible in menu.
 * 
 * @param object - menuStatus
 */
NotVisitableXConstraint.prototype.updateMenuStatus = function(menuStatus){
	var affectedIds = [];
	
	if(this.xMode=='node'){
		affectedIds.push(this.xId);
	} else {
		affectedIds.push(this.xId);
		affectedIds = affectedIds.concat(this.view.getProject().getDescendentNodeIds(this.xId, true));
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
NotVisitableXConstraint.prototype.getTargetId = function(){
	return this.xId;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/constraints/nonvisitablexconstraint.js');
}