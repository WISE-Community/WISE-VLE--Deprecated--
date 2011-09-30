/**
 * The Constraint Manager object is responsible for managing the
 * constraints for the Navigation Logic.
 * 
 * @author patrick lawler
 */
function ConstraintManager(view){
	this.view = view;
	this.PROJECT_CONSTRAINT_TYPES = ['VisitXBeforeYConstraint', 'NotVisitableXConstraint', 'VisitXOrYConstraint', 
	                                 'WorkOnXBeforeYConstraint', 'WorkOnXConstraint', 'WorkOnXBeforeAdvancingConstraint'];
	this.positionConstraintMap = {};
};

/**
 * Adds a constraint based on the given options. The options object must specify
 * a type (ie VisitXAfterYConstraint) and the view and the rest of the options must be
 * specific to that type.
 * 
 * @param opts
 */
ConstraintManager.prototype.addConstraint = function(opts){
	/* add the view to the options */
	opts.view = this.view;
	
	/* create the constraint */
	var constraint = ConstraintFactory.createConstraint(opts);
	
	/* get the ids of the nodes that this constraint applies to */
	var affectedIds = constraint.getAffectedIds();
	
	/* add this constraint to the position constraint map for each of the
	 * nodes specified in the affectedIds */
	for(var c=0;c<affectedIds.length;c++){
		var pos = this.view.getProject().getPositionById(affectedIds[c]);
		
		/* if there is nothing at this position in the map, create an empty array first */
		if(!this.positionConstraintMap[pos]){
			this.positionConstraintMap[pos] = [];
		}
		
		//check if the constraint already exists for this position
		if(!this.positionContainsConstraint(pos, constraint)) {
			//it does not exist for this position so we will add it
			this.positionConstraintMap[pos].push(constraint);			
		}
	}
	
	//check if we should update the nav constraints
	if(opts.updateAfterAdd) {
		//update the nav constraints
		this.view.updateNavigationConstraints();
	}
};

/**
 * Check if the position contains the same constraint already
 * @param pos a vle position e.g. 0.5
 * @param newConstraint the new constraint we want to check if we 
 * already have
 * @return true if we already have this constraint for this position,
 * false if we do not have this constraint for this position
 */
ConstraintManager.prototype.positionContainsConstraint = function(pos, newConstraint) {
	//get all the constraints for this position
	var positionConstraints = this.positionConstraintMap[pos];
	
	//loop through all the constraints at this position
	for(var x=0; x<positionConstraints.length; x++) {
		//get a constraint
		var constraint = positionConstraints[x];
		
		//compare the type, xId, and yId
		if(constraint.type == newConstraint.type && 
				constraint.xId == newConstraint.xId &&
				constraint.yId == newConstraint.yId) {
			//the three fields are the same so we already have the constraint
			return true;
		}
	}
	
	//we did not find the same constraint
	return false;
};

/**
 * Removes the constraint with the given id.
 * 
 * @param string - constraintId
 */
ConstraintManager.prototype.removeConstraint = function(constraintId){
	/* look at all positions in the constraintMap and remove all constraints
	 * that match the specified id */
	for(var key in this.positionConstraintMap){
		var currentConstraints = this.positionConstraintMap[key];
		for(var t=currentConstraints.length-1;t>=0;t--){
			if(currentConstraints[t].id==constraintId){
				currentConstraints.splice(t,1);
			}
		}
	}
};

/**
 * Checks all of the constraints related to the toVisit position and returns the status.
 * 
 * @param position
 * @return object - status
 */
ConstraintManager.prototype.getVisitableStatus = function(position){
	var status = {value:0, msg:'', menuStatus: {}};
	var constraints = [];
	var processed = [];
	
	/* get all related constraints on the position to visit */
	if(position){
		constraints = constraints.concat(this.getAllRelatedConstraints(position));
	}
	
	/* check with each constraint to see if it is satisfied, if not, update
	 * status with appropriate value and msg. If there is more than one constraint
	 * that effects the status we want to use the most restrictive (the higher number)*/
	for(var a=0;a<constraints.length;a++){
		/* check to make sure that we do not process the same constraint twice */
		if(processed.indexOf(constraints[a])==-1){
			if(!constraints[a].isSatisfied(position)){
				/* constraint not satisfied, collect the messages, set status value to the
				 * most restrictive and have the constraint update the menuStatus */
				status.value = Math.max(status.value,constraints[a].getStatus());
				status.msg += ' ' + constraints[a].getMessage();
				constraints[a].updateMenuStatus(status.menuStatus);
			}
			
			/* add constraint to processed array */
			processed.push(constraints[a]);
		}
	}
	
	/* we also need to update the menuStatus for any project level constraints
	 * that need to be met */
	var projectConstraints = this.getProjectConstraints();
	for(var o=0;o<projectConstraints.length;o++){
		projectConstraints[o].updateMenuStatus(status.menuStatus);
	}
	
	/* return the status */
	return status;
};

/**
 * When a node is rendered, checks all constraints associated with that node's
 * position and removes any whose life is at an end.
 * 
 * @param position
 * @return
 */
ConstraintManager.prototype.nodeRendered = function(position){
	/* get the constraints associated with this position */
	var constraints = this.getAllRelatedConstraints(position);
	
	/* we also need to check all project level constraints */
	constraints = constraints.concat(this.getProjectConstraints());
	
	/* if the contraint's life cycle is at an end, get all affected positions
	 * and remove this constraint from all of them */
	for(var k=0;k<constraints.length;k++){
		/* check for death */
		if(constraints[k].isDeceased(position)){
			/* get all nodeIds involving this constraint */
			var affectedIds = constraints[k].getAffectedIds();
			/* iterate through ids and remove this constraint from array with associated position */
			for(var l=0;l<affectedIds.length;l++){
				/* look up by position and remove */
				var pos = this.view.getProject().getPositionById(affectedIds[l]);
				
				/*
				 * remove the constraint from the map, this returns an array
				 * with the removed constraint as the first element in the array
				 */
				var removedConstraint = this.positionConstraintMap[pos].splice(this.positionConstraintMap[pos].indexOf(constraints[k]), 1);
				
				//perform any cleanup required after removing the constraint
				this.removeConstraintCleanup(removedConstraint[0]);
			}
		}
	}
};

/**
 * Given a position, gets and returns an array of all constraints associated 
 * with that position, including any ancestor sequences whose constraints may 
 * affect the rendering of the position filtered by the types that are specific
 * to the given location (leaving || toVisit). 
 * 
 * @param position
 * @return array - constraints
 */
ConstraintManager.prototype.getAllRelatedConstraints = function(position){
	var currentConstraintArray = [];
	
	/* get any constraints associated with this position */
	if(this.positionConstraintMap[position]){
		currentConstraintArray = this.positionConstraintMap[position];
	}
	
	/* if the position does not contain a dot, then there are no ancestors
	 * to this position, so just return an array of any constraints related
	 * to this position, otherwise, return a concatenated array of any constraints
	 * related to this position with those of all ancestors.
	 */
	if(!position || position.indexOf('.')==-1){
		return currentConstraintArray;
	} else {
		var posArr = position.split('.');
		var ancestorPosition = posArr.splice(posArr.length - 1,1).join('.');
		return this.getAllRelatedConstraints(ancestorPosition).concat(currentConstraintArray);
	}
};

/**
 * Returns an array of all the constraints that are being managed.
 * 
 * @return array - constraints
 */
ConstraintManager.prototype.getAllConstraints = function(){
	var constraints = [];
	var processed = [];
	
	/* look at each key in the positionConstraintMap for any constraints and
	 * add any to the constraints array that have not already been processed */
	for(var key in this.positionConstraintMap){
		/* get the constraints associated with the current key */
		var currentConstraints = this.positionConstraintMap[key];
		
		/* cycle through the currentConstraints */
		for(var q=0;q<currentConstraints.length;q++){
			/* if not already processed, add it to the constraints array as well
			 * as the processed array so that we know we've already handled this one */
			if(processed.indexOf(currentConstraints[q]) == -1){
				constraints.push(currentConstraints[q]);
				processed.push(currentConstraints[q]);
			}
		}
	}
	
	/* return the constraints */
	return constraints;
};

/**
 * Returns an array of all the project constraints that are being managed.
 * 
 * @return array - constraints
 */
ConstraintManager.prototype.getProjectConstraints = function(){
	var projectConstraints = [];
	
	/* get all of the constraints */
	var constraints = this.getAllConstraints();
	
	/* cycle through to find the project level constraints */
	for(var r=0;r<constraints.length;r++){
		if(this.PROJECT_CONSTRAINT_TYPES.indexOf(constraints[r].type) != -1){
			projectConstraints.push(constraints[r]);
		}
	}
	
	/* return the project constraints */
	return projectConstraints;
};

/**
 * When/If student data is first loaded and if the project constraints have
 * already been processed, processes the state to re-create/remove any needed
 * dynamically defined constraints.
 */
ConstraintManager.prototype.processStateConstraints = function(){
	/* check to see in the project constraint processing is complete and the 
	 * state has been loaded before proceeding. If it is not, exit. */
	if(this.canProcessStateConstraints()){
		/* get ChallengeNode nodeVisits keyed by id */
		var challengeVisits = this.view.state.getNodeVisitsByNodeType('ChallengeNode');
		for(var nodeId in challengeVisits){
			/* check to see if a constraint is needed for the challenge node with nodeId */
			if(this.isConstraintNeededForChallenge(challengeVisits[nodeId])){
				/* set up vars for creating constraint */
				var node = this.view.getProject().getNodeById(nodeId);
				var toNodeId = node.getContent().getContentJSON().assessmentItem.interaction.attempts.navigateTo;
				
				/* create the constraint */
				this.view.eventManager.fire('addConstraint', {type:'VisitXBeforeYConstraint', x:{id:toNodeId, mode:'node'}, y:{id:node.id, mode:'node'}, status: 1, menuStatus:0, effective:  Date.parse(new Date())});
			}
		}
	
		/* get assessment list nodeVisits keyed by id */
		var assessmentVisits = this.view.state.getNodeVisitsByNodeType('AssessmentListNode');
		
		/* iterate each and check to see if the work was completed, if it was, then
		 * no constraint is needed, if not, then we need to add a constraint if isMustCompleteAllPartsBeforeExit
		 * == true */
		for(var nodeId in assessmentVisits){
			if(this.view.state.getLatestWorkByNodeId(nodeId) == ''){
				/* no work found */
				if(this.view.getProject().getNodeById(nodeId).getContent().getContentJSON().isMustCompleteAllPartsBeforeExit){
					/* author specified that student must complete work before going to any other step, so create a constraint */
					this.view.eventManager.fire('addConstraint',{type:'WorkOnXConstraint', x:{id:nodeId, mode:'node'}});
				}
			}
		}
		
		/* get branch nodeVisits keyed by id */
		var branchVisits = this.view.state.getNodeVisitsByNodeType('BranchNode');
		
		/* loop through all node ids and see if work was completed, if so, we need to
		 * remove the constraints for the branch specified in the content for that choice */
		for(var nodeId in branchVisits){
			var response = this.view.state.getLatestWorkByNodeId(nodeId);
			if(response != ''){
				var node = this.view.getProject().getNodeById(nodeId);
				
				/* we need to disallow further work on this branch node */
				this.view.eventManager.fire('addConstraint', {type:'NotVisitableXConstraint', x:{id:node.id, mode:'node'}, status:1, menuStatus:0, msg:'You can only answer this question once.'});
				
				/* get the choice Id based on the response */
				var content = node.getContent().getContentJSON(), choiceId = null;
				for(var u=0;u<content.assessmentItem.interaction.choices.length;u++){
					if(content.assessmentItem.interaction.choices[u].text == response){
						choiceId = content.assessmentItem.interaction.choices[u].identifier;
					}
				}
				
				/**
				 * Remove the constraints that are associated with the choice in
				 * the student's response.
				 */
				for(var v=0;v<content.branches.length;v++){
					/* if the determined choiceId is in the choiceIds of this branch, then
					 * we need to remove the specified constraints for this branch */
					if(content.branches[v].choiceIds.indexOf(choiceId) != -1){
						for(var w=0;w<content.branches[v].constraintIds.length;w++){
							this.view.eventManager.fire('removeConstraint', content.branches[v].constraintIds[w]);
						}
					}
				}
			}
		}
		
		/* have the navigation update its constraints */
		this.view.eventManager.fire('updateNavigationConstraints');
		
		/* navigation was waiting for the state processing to complete,
		 * so we need to complete the navigation loading here */
		this.view.isNavigationComponentLoaded = true;
		this.view.eventManager.fire('navigationLoadingComplete');
	}
};

/**
 * Returns true if both the state data has been loaded and the project
 * constraint processing has completed, false otherwise.
 * 
 * @return boolean
 */
ConstraintManager.prototype.canProcessStateConstraints = function(){
	return this.view.viewStateLoaded && this.view.isProjectConstraintProcessingComplete;
};

/**
 * Walks through a Challenge Node's nodeVisits and determines if a constraint is needed
 * for this Challenge Node. This is only necessary when the states are first loaded.
 * 
 * @param nodeVisits
 * @return
 */
ConstraintManager.prototype.isConstraintNeededForChallenge = function(nodeVisits){
	/* keep track of the state of the challenge node as we step through the given
	 * nodeVisits: 0=no work, 1=work completed and correct, 2=work completed, incorrect
	 * and visited navigateTo node, 3=work completed, incorrect and did not visit 
	 * navigateTo node. */
	var currentChallengeState = 0;
	
	/* cycle (walk through) the nodeVisits for this challenge node */
	for(var f=0;f<nodeVisits.length;f++){
		if(nodeVisits[f].getLatestState()){
			if(nodeVisits[f].getLatestState().isCorrect){
				/* work completed and is correct */
				currentChallengeState = 1;
			} else {
				/* not correct, the student should have navigated to the navigateTo node */
				if(this.visitedNavigateToNode(this.view.getProject().getNodeById(nodeVisits[f].nodeId), nodeVisits[f].visitStartTime + 1)){
					currentChallengeState = 2;
				} else {
					currentChallengeState = 3;
				}
			}
		}
	}
	
	/* if the currentChallengeState is 3 at this point, then we need a constraint,
	 * for all other states, we do not */
	return (currentChallengeState==3) ? true : false;
};

/**
 * Returns true if the navigateTo node specified in the given node's content 
 * has been visited after the given start time, returns false otherwise.
 * 
 * @param object - node
 * @param timestampe - startTime
 * @return boolean
 */
ConstraintManager.prototype.visitedNavigateToNode = function(node, startTime){
	var toVisitId = node.getContent().getContentJSON().assessmentItem.interaction.attempts.navigateTo;
	var nodeVisits = this.view.state.getNodeVisitsByNodeId(toVisitId);
	var nodeVisits = Constraint.prototype.getEffectiveNodeVisits(nodeVisits.slice(), startTime);
	for(var a=0;a<nodeVisits.length;a++){
		if(nodeVisits[a].nodeId == toVisitId){
			return true;
		}
	}
	
	return false;
};

/**
 * Perform cleanup tasks after a constraint is removed
 * @param constraint the constraint object
 */
ConstraintManager.prototype.removeConstraintCleanup = function(constraint) {
	
	if(constraint != null) {
		if(constraint.type == 'VisitXBeforeYConstraint') {
			//get the Y nodeId that is now no longer constrained
			var nodeId = constraint.yId;
			
			//display a bubble notifying the student that they can try the question again
			//eventManager.fire('displayMenuBubble', [nodeId, 'You can now visit this step when you are ready']);
			eventManager.fire('displayMenuBubble', [nodeId, 'You can now visit the yellow highlighted step when you are ready']);
			
			//highlight the Y step
			eventManager.fire('highlightStepInMenu', [nodeId]);		
		}
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/constraints/constraintmanager.js');
}