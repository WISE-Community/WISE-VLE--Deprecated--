/**
 * A Constraint is an object representation of a constraint to the Navigation Logic.
 * 
 * @author patrick lawler
 */
function Constraint(opts){
	this.type = 'AbstractConstraint';
	this.NODES_WITHOUT_WORK = ['HtmlNode', 'OutsideUrlNode', 'sequence', 'FlashNode'];
	
	/* opts will not be defined when inheriting objects prototypes are constructed,
	 * so bypass this when opts is not defined, otherwise, we want to parse the options
	 * object that was passed in */
	if(opts){
		/* Set the view */
		this.view = opts.view;
		
		/* Set the id */
		this.id = opts.id;
		
		/* Set the status if provided, set default if not. The default is 2 (not visitable). */
		this.status = (opts.status || opts.status===0) ? opts.status : 2;
		
		/* Set the menu status if provided, set default if not. The default is 1 (menu disabled)*/
		this.menuStatus = (opts.menuStatus || opts.menuStatus===0) ? opts.menuStatus : 1;
		
		/* Set the lifespan of this constraint if provide, set default if not. The default is true */
		this.liftOnSatisfaction = (opts.liftOnSatisfaction===false) ? false : true;
		
		/* Set the effective timestamp if one is provided */
		this.effective = opts.effective;
		
		/* Set the mode to the given mode if provided, set default if not. The default mode is 'node' */
		this.xMode = (opts.x) ? (opts.x.mode) ? opts.x.mode : 'node' : undefined;
		this.yMode = (opts.y) ? (opts.y.mode) ? opts.y.mode : 'node' : undefined;
		
		/* get the ids for the given positions */
		this.xId = (opts.x) ? (opts.x.id) ? opts.x.id : undefined : undefined;
		this.yId = (opts.y) ? (opts.y.id) ? opts.y.id : undefined : undefined;
	}
};

/**
 * Sets the message associated with an unsatisfied constraint.
 * 
 * @param msg
 */
Constraint.prototype.setMessage = function(msg){
	this.msg = msg;
};

/**
 * Returns the message associated with an unsatisfied constraint.
 * 
 * @return String - msg
 */
Constraint.prototype.getMessage = function(){
	return this.msg;
};

/**
 * Sets the status number for this constraint
 * 
 * @param num
 */
Constraint.prototype.setStatus = function(num){
	this.status = num;
};

/**
 * Returns the status for this constraint.
 * 
 * @return int - status number
 */
Constraint.prototype.getStatus = function(){
	return this.status;
};

/**
 * Sets whether this constraint should be lifted when met.
 * 
 * @param boolean
 */
Constraint.prototype.setLiftable = function(bool){
	this.liftOnSatisfaction = bool;
};

/**
 * Returns whether this constraint should be lifted when met.
 * 
 * @return boolean
 */
Constraint.prototype.isLiftable = function(){
	return this.liftOnSatisfaction;
};

/**
 * Returns the type of this constraint.
 * 
 * @return String - type
 */
Constraint.prototype.getType = function(){
	return this.type;
};

/**
 * Returns this constraints xId.
 * 
 * @return string - the xId of this constraint
 */
Constraint.prototype.getTargetId = function(){
	throw 'Method getTargetId has not been implemented for constraints of type: ' + this.type;
};

/**
 * The logic of whether this constraint is satisfied is determined by the
 * type of constraint. This method should be overwritten by inheriting classes. 
 * 
 * @param toVisitPosition
 * @param states
 */
Constraint.prototype.isSatisfied = function(toVisitPosition){
	throw 'Method isSatisfied has not been implemented for constraints of type: ' + this.type;
};

/**
 * Returns an array of ids for all nodes/sequences that this constraint affects.
 * This method should be overwritten by inheriting classes.
 * 
 * @return array - node ids
 */
Constraint.prototype.getAffectedIds = function(){
	throw 'Method getAffectedIds has not been implemented for constraints of type: ' + this.type;
};

/**
 * Given a position, returns true if this constraint's life cycle is at an end
 * or if this constraint will no longer have an affect on navigation, returns 
 * false otherwise. This method should be overwritten by inheriting classes.
 * 
 * @param position
 * @return boolean
 */
Constraint.prototype.isDeceased = function(position){
	throw 'Method isDeceased has not been implemented for constraints of type: ' + this.type;
};

/**
 * Given a menuStatus object, updates all nodeIds keys in the object that
 * are affected by this constraint with the greater of the existing menuClass
 * value for that nodeId or the menuClass specified in this constraint. The
 * menuStatus can be 0 = no change in menu visibility, 1 = disabled in menu, 2 =
 * not visible in menu. This method should be overwritten by inheriting classes.
 * 
 * @param object - menuStatus
 */
Constraint.prototype.updateMenuStatus = function(menuStatus){
	throw 'Method updateMenuStatus has not been implemented for constraints of type: ' + this.type;
};

/**
 * Returns a JSON options object representing this constraint which can be used to create
 * a new constraint. 
 * 
 * @return object - options
 */
Constraint.prototype.getOptionsJSON = function(){
	var opts = {};
	
	opts.type = this.type;
	opts.status = this.status;
	opts.menuStatus = this.menuStatus;
	opts.liftOnSatisfaction = this.liftOnSatisfaction;
	opts.effective = this.effective;
	
	if(this.xMode && this.xId){
		opts.x = {};
		opts.x.mode = this.xMode;
		opts.x.id = this.xId;
	}
	
	if(this.yMode && this.yId){
		opts.y = {};
		opts.y.mode = this.yMode;
		opts.y.id = this.yId;
	}
	
	return opts;
};

/**
 * Returns true if the node with the given nodeId has been visited if the
 * given workCompleted resolves to null or if the node has work completed
 * if the workCompleted resolves to true, returns false otherwise.
 * 
 * @param nodeId
 * @param workCompleted
 * @return boolean
 */
Constraint.prototype.nodeVisited = function(nodeId, workCompleted){
	if(!workCompleted){
		return this.view.getState().getNodeVisitsByNodeId(nodeId).length > 0;
	} else {
		/* if the node is a type without work, then we just need to return if it was visited */
		if(this.NODES_WITHOUT_WORK.indexOf(this.view.getProject().getNodeById(nodeId).getType()) != -1){
			return this.nodeVisited(nodeId);
		} else {
			return (this.view.getState().getLatestWorkByNodeId(nodeId) == "") ? false : true;
		}
	}
};

/**
 * Given a constraintSatisfaction object ({constraintPattern:{},satisfactionPattern:{}}), 
 * searches all node visits for all instances of the constraint pattern and satisfaction 
 * pattern and returns true if the trigger pattern is never found or if for each constraint
 * pattern an associated satisfaction pattern is found, returns false otherwise.
 * 
 * @param object - constraintSatisfaction
 * @return boolean
 */
Constraint.prototype._isConstraintSatisfied = function(constraintSatisfaction){
	/* copy the current node visits of the state */
	var nodeVisits = this.getEffectiveNodeVisits(this.view.getState().visitedNodes.slice(), constraintSatisfaction.effective);
	
	/* While there are nodeVisits, search for the constraint pattern, then
	 * search for the satisfaction pattern. If the satisfaction pattern
	 * has not completed, then return false, otherwise, return true. */
	while(nodeVisits != null && nodeVisits.length > 0){
		/* search for the trigger pattern if one was specified */
		nodeVisits = (constraintSatisfaction.constraintPattern) ? this.patternMatches(constraintSatisfaction.constraintPattern, nodeVisits) : nodeVisits;
		
		/* search for the satisfaction pattern if the constraint pattern was found */
		if(nodeVisits != null){
			remainingNodeVisits = this.patternMatches(constraintSatisfaction.satisfactionPattern, nodeVisits, constraintSatisfaction.toVisitId);
			
			/* If nodeVisits is null at this point, that means the trigger (constraint) was found
			 * but the satisfaction pattern was not, we need to return false. If the
			 * remainingNodeVisits size is different than that of nodeVisits, then the
			 * satisfaction pattern was found and if there is no constraint pattern, then
			 * we will want to return true */
			if(remainingNodeVisits==null){
				return false;
			} else if(remainingNodeVisits.length != nodeVisits.length && !constraintSatisfaction.constraintPattern){
				return true;
			}
			
			/* set the nodeVisits for the next iteration */
			nodeVisits = remainingNodeVisits;
		}
	}
	
	return true;
};

/**
 * Given a pattern object, searches the given nodeVisits for the pattern specified
 * by the object. If found, truncates and returns the remaining nodeVisits at the
 * point directly following the nodeVisit that completed the pattern. If not found
 * returns null. 
 * 
 * An example pattern object: {sequential: true, all: false, nodeIds:[id1, id2,...,idn]}
 * 
 * @param object - pattern
 * @param array - nodeVisits
 * @return array (nodeVisits) || null
 */
Constraint.prototype.patternMatches = function(pattern, nodeVisits, toVisitId){
	if(!pattern.all){
		return this.matchAny(pattern.nodeIds, nodeVisits, toVisitId, pattern.workCompleted, pattern.workCorrect);
	} else if(pattern.sequential){
		return this.matchAllSequential(pattern.nodeIds, nodeVisits, toVisitId, pattern.workCompleted);
	} else if(!pattern.sequential){
		return this.matchAllNonSequential(pattern.nodeIds, nodeVisits, toVisitId, pattern.workCompleted);
	} else {
		this.view.notificationManager.notify('Invalid pattern object!',3);
		return null;
	}
};

/**
 * Given an array of nodeIds and an array of nodeVisits, iterates through the nodeVisits
 * and nodeIds. If a nodeId matches the nodeId in the nodeVisit and workCompleted is not
 * specified, returns an array of the remaining nodeVisits. If the nodeId matches the nodeId
 * and workCompleted is specified, returns the remaining nodeVisits if work has been completed
 * for that nodeVisit. If none of the Ids are found or if the workCompleted was specified and
 * none of the nodeVisits for that nodeId were found, returns null.
 * 
 * @param array - nodeIds
 * @param array - nodeVisits
 * @param toVisitId
 * @param boolean - workCompleted
 * @param boolean - workCorrect whether the work needs to be correct in order to satisfy the constraint
 * @return array (nodeVisits) || null
 */
Constraint.prototype.matchAny = function(nodeIds, nodeVisits, toVisitId, workCompleted, workCorrect){
	/* copy the nodeVisits and add the toVisitId as a fake nodeVisit if passed in */
	var copiedNodeVisits = nodeVisits.slice();
	if(toVisitId){
		copiedNodeVisits.push({nodeId:toVisitId});
	}
	
	/* Iterate through the nodeVisits and check for each of the nodeIds */
	for(var b=0;b<copiedNodeVisits.length;b++){
		for(var c=0;c<nodeIds.length;c++){
			if(copiedNodeVisits[b].nodeId==nodeIds[c]){
				var node = this.view.getProject().getNodeById(nodeIds[c]);
				
				if(workCompleted && this.NODES_WITHOUT_WORK.indexOf(node.getType()) == -1){
					
					/*
					 * check if the node is part of a review sequence because
					 * we need to handle is slightly differently considering
					 * the fact that sometimes the step may not be open for
					 * the student to work on in which case we can't constrain
					 * them otherwise they would be stuck and would not be able
					 * to advance
					 */
					if(node.isPartOfReviewSequence()) {
						if(node.isOpen()) {
							//node is open for student to work on
							
							if(node.isCompleted()) {
								//student has completed the step so we will not constrain
								return nodeVisits.slice(b + 1);
							} else {
								//student has not completed the step so we will constrain
								return null;
							}
						} else {
							//node is not open for student to work on so we will not constrain
							return nodeVisits.slice(b + 1);
						}
					//} else if (node.type == "AssessmentListNode" || node.type == 'ExplanationBuilderNode') {
					} else if (node.overridesIsCompleted()){
						// if the node is not completed, student
						// has not completed the step so we will constrain.
						if (node.isCompleted()) {
							return nodeVisits.slice(b + 1);
						} else {
							return null;
						}
					} else {
						/* check the latest work to see if there is any */
						if(copiedNodeVisits[b].getLatestWork() != ""){
							return nodeVisits.slice(b + 1);
						}
					}
				} else if(workCorrect && this.NODES_WITHOUT_WORK.indexOf(node.getType()) == -1){
					//the work needs to be correct in order to satisfy the constraint
					
					//get the latest work
					var latestWork = copiedNodeVisits[b].getLatestWork();
					
					if(latestWork != null) {
						if(latestWork.isCorrect) {
							//the work is correct
							return nodeVisits.slice(b + 1);
						}
					}
				} else {
					return nodeVisits.slice(b + 1);
				}
			}
		}
	}
	
	/* none of the nodeIds were found, return null */
	return null;
};

/**
 * Given an array of nodeIds and an array of nodeVisits, checks the nodeVisits
 * to see if all of the nodeIds exist, if all were found, truncates and returns
 * the array of the remaining node visits, if all were not found, returns null.
 * 
 * @param array - nodeIds
 * @param array - nodeVisits
 * @param toVisitId
 * @param boolean - workCompleted
 * @return array (nodeVisits) || null
 */
Constraint.prototype.matchAllNonSequential = function(nodeIds, nodeVisits, toVisitId, workCompleted){
	/* copy the nodeVisits and if toVisitId is specified, add a fake nodeVisit */
	var copiedNodeVisits = nodeVisits.slice();
	if(toVisitId){
		copiedNodeVisits.push({nodeId:toVisitId});
	}
	
	var lastIndex = 0;
	
	/* Search for each of the nodeIds in the copiedNodeVisits keeping track of the
	 * latest index that any of them was found. If workCompleted is specified, we also
	 * need to check if work has been completed for that nodeVisit. If at any point we
	 * cannot find a nodeId in nodeVisits, or if workCompleted has been specified and we
	 * cannot find work for a given nodeId, we need to return null. */
	for(var d=0;d<nodeIds.length;d++){
		/* we need to set a boolean value for whether this node was found in our search */
		var found = false;
		
		for(var e=0;e<copiedNodeVisits.length;e++){
			/* check to see if we found the nodeId we are looking for in the node visits */
			if(nodeIds[d]==copiedNodeVisits[e].nodeId){
				/* if workCompleted has been specified, we also need to check to see if
				 * work has been completed */
				if(workCompleted && this.NODES_WITHOUT_WORK.indexOf(this.view.getProject().getNodeById(nodeIds[d]).getType()) == -1){
					if(copiedNodeVisits[e].getLatestWork() != ""){
						/* set found to true and set the lastIndex */
						found = true;
						lastIndex = Math.max(lastIndex, e);
					}
				} else {
					/* set found to true and set the lastIndex */
					found = true;
					lastIndex = Math.max(lastIndex, e);
				}
			}
		}
		
		if(!found){
			return null;
		}
	}
	
	/* if we made it here, all the nodeIds were found, truncate and return nodeVisits array */
	return nodeVisits.slice(lastIndex + 1);
};

/**
 * Given an array of nodeIds and an array of nodeVisits, iterates through the
 * nodeVisits searching for the nodeIds sequentially. If all of the nodeIds are
 * found sequentially, returns the remaining nodeVisits, otherwise, returns null.
 * 
 * @param array - nodeIds
 * @param array - nodeVisits
 * @return array (nodeVisits) || null
 */
Constraint.prototype.matchAllSequential = function(nodeIds, nodeVisits, toVisitId, workCompleted){
	//TODO - implement me if needed, remove me if not
};

/**
 * Given an array of nodeVisits and an effective timestamp, returns an array
 * of nodeVisits of nodes that were visited only after the given timestamp.
 * 
 * @param array - nodeVisits
 * @param timestamp - effective
 * @return array - nodeVisits
 */
Constraint.prototype.getEffectiveNodeVisits = function(nodeVisits, effective){
	/* only do work if the timestamp was provided */
	if(effective){
		for(var w=0;w<nodeVisits.length;w++){
			/* as soon as a nodeVisit is found with a timestamp >= to the effective
			 * timestamp, return a copy of nodeVisits from that point */
			if(nodeVisits[w].visitStartTime >= effective){
				return nodeVisits.slice(w);
			}
		}
		
		/* none were found, return an empty array with a fake nodeVisit, so that
		 * the pattern search will work */
		return [{nodeId:null}];
	} else {
		return nodeVisits;
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/constraints/constraint.js');
}