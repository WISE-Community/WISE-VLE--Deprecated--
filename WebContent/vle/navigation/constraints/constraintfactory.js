/**
 * The constraint factory is responsible for parsing the options and creating
 * and returning the appropriate constraint.
 *
 * @author patrick lawler
 */
function ConstraintFactory(){};

/**
 * Given an options object, creates and returns the appropriate constraint.
 */
ConstraintFactory.createConstraint = function(opts){
	if(opts.type=='NotVisitableXConstraint'){
		return new NotVisitableXConstraint(opts);
	} else if(opts.type=='VisitXAfterYConstraint'){
		return new VisitXAfterYConstraint(opts);
	} else if(opts.type=='VisitXBeforeYConstraint'){
		return new VisitXBeforeYConstraint(opts);
	} else if(opts.type=='VisitXOrYConstraint'){
		return new VisitXOrYConstraint(opts);
	} else if(opts.type=='WorkOnXBeforeYConstraint'){
		return new WorkOnXBeforeYConstraint(opts);
	} else if(opts.type=='WorkOnXConstraint'){
		return new WorkOnXConstraint(opts);
	} else if(opts.type=='WorkOnXBeforeAdvancingConstraint'){
		return new WorkOnXBeforeAdvancingConstraint(opts);
	} else {
		throw 'I do not know how to create Constraints of type ' + opts.type;
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/constraints/constraintfactory.js');
}