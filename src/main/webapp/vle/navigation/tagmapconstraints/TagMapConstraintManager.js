/**
 * Create the tag map constraint manager
 * @param view the view
 */
function TagMapConstraintManager(view) {
	this.view = view;
	this.activeTagMapConstraints = [];
};

//value to turn on console output for debugging purposes
TagMapConstraintManager.DEBUG = false;

/**
 * Output the message to the console for debugging purposes if
 * TagMapConstraintManager.DEBUG is set to true.
 * @param message the message to display in the console
 */
TagMapConstraintManager.debugOutput = function(message) {
	if(TagMapConstraintManager.DEBUG) {
		console.log(message);
	}
};

/**
 * Add all the global tag map constraints that affect the project navigation.
 * Step tag map constraints will be processed later when the step is rendered.
 */
TagMapConstraintManager.prototype.addGlobalTagMapConstraints = function() {
	
	if(this.activeTagMapConstraints == null) {
		//create the active tag map constraints array if it does not exist
		this.activeTagMapConstraints = [];
	}
	
	//get all the node ids in the project
	var nodeIds = this.view.getProject().getAllNodeIds();
	
	//loop through all the node ids
	for(var x=0; x<nodeIds.length; x++) {
		//get a node id
		var nodeId = nodeIds[x];
		
		//get the position
		var nodePosition = this.view.getProject().getPositionById(nodeId);
		
		//get a node
		var node = this.view.getProject().getNodeById(nodeId);
		
		var tagMaps = null;

		if(node.tagMaps != null) {
			//get the tag maps for this step
			tagMaps = node.tagMaps;
		}
		
		//check if there are any tag maps
		if(tagMaps != null) {
			
			//loop through all the tag maps
			for(var y=0; y<tagMaps.length; y++) {
				
				//get a tag map
				var tagMapObject = tagMaps[y];
				
				if(tagMapObject != null) {
					//get the variables for the tag map
					var tagName = tagMapObject.tagName;
					var functionName = tagMapObject.functionName;
					var functionArgs = tagMapObject.functionArgs;
					var additionalFunctionArgs = {};
					var customMessage = '';
					
					//make the the tag map constraint active if the constraint is not satisfied
					this.addActiveTagMapConstraintIfNecessary(nodeId, tagName, functionName, functionArgs, additionalFunctionArgs, customMessage);
				}
			}
		}
	}
};

/**
 * Add tag map constraints for a step
 * @param nodeId the node id of the step
 */
TagMapConstraintManager.prototype.addTagMapConstraints = function(nodeId) {
	//add tag map constraints for the step if any
	this.addTagMapConstraintsForNode(nodeId);
	
	//get the activity node id
	var parentNodeId = this.view.getProject().getParentNodeId(nodeId);
	
	//add tag map constraints for the activity if any
	this.addTagMapConstraintsForNode(parentNodeId);
};

/**
 * Add tag map constraints for a node
 * @param nodeId the id of the node
 */
TagMapConstraintManager.prototype.addTagMapConstraintsForNode = function(nodeId) {
	//get a node
	var node = this.view.getProject().getNodeById(nodeId);
	
	var tagMaps = null;
	
	if(node.tagMaps != null) {
		//get the tag maps for this step
		tagMaps = node.tagMaps;
	}
	
	//check if there are any tag maps
	if(tagMaps != null) {
		
		//loop through all the tag maps
		for(var y=0; y<tagMaps.length; y++) {
			
			//get a tag map
			var tagMapObject = tagMaps[y];
			
			if(tagMapObject != null) {
				//get the variables for the tag map
				var tagName = tagMapObject.tagName;
				var functionName = tagMapObject.functionName;
				var functionArgs = tagMapObject.functionArgs;
				var additionalFunctionArgs = {};
				var customMessage = '';
				
				//make the the tag map constraint active if the constraint is not satisfied
				this.addActiveTagMapConstraintIfNecessary(nodeId, tagName, functionName, functionArgs, additionalFunctionArgs, customMessage);
			}
		}
	}
};

/**
 * The student is trying to move to another step so we will
 * process the tag map constraints to make sure they are allowed
 * to move.
 * @param nextNodeId the id of the next step the student is 
 * trying to move to
 * @return an object containing a boolean value of whether the
 * student is allowed to move and a message to display if they
 * are not allowed to move
 */
TagMapConstraintManager.prototype.processTagMapConstraints = function(nextNodeId) {
	var results = {
		canMove:true,
		message:''
	};

	if(nextNodeId != null && nextNodeId != '') {
		//get the current node the student is on
		var currentNode = this.view.getCurrentNode();
		
		//get the current node id
		var currentNodeId = currentNode.id;
		
		if(this.activeTagMapConstraints == null) {
			//create the active tag map constraints array if it does not exist
			this.activeTagMapConstraints = [];
		}
		
		//loop through all the active tag map constraints
		for(var z=0; z<this.activeTagMapConstraints.length; z++) {
			//get a tag map constraint
			var activeTagMapConstraint = this.activeTagMapConstraints[z];
			
			if(activeTagMapConstraint != null) {
				//check the constraint to see if it should still be enforced
				var tempResults = activeTagMapConstraint.checkConstraint(currentNodeId, nextNodeId);
				
				if(tempResults.canMove == false) {
					//get whether the student is allowed to move
					results.canMove = false;
				}
				
				if(tempResults.message != '') {
					//get the message to display to the student if they are not allowed to move
					
					if(results.message != '') {
						//separate messages from different constraints with newlines
						results.message += '\n\n';
					}
					
					//append the message for the constraint
					results.message += tempResults.message;
				}
			}
		}
	}
	
	return results;
};

/**
 * Update the active tag map constraints by re-evaluating the constraints
 * to make sure they should still be active.
 */
TagMapConstraintManager.prototype.updateActiveTagMapConstraints = function() {
	TagMapConstraintManager.debugOutput('updateActiveTagMapConstraints active constraint count before:' + this.activeTagMapConstraints.length);
	
	var results = {
		canMove:true,
		message:''
	};
	
	if(this.view.navigationPanel != null) {
		/*
		 * enable all the steps in the navigation menu because
		 * we will re-apply all the constraints which will grey 
		 * out the steps that are not allowed to be visited
		 */
		this.view.navigationPanel.enableAllSteps();
	}

	//get the current node the student is on
	var currentNode = this.view.getCurrentNode();

	//get the current node id
	var currentNodeId = currentNode.id;

	//get the current position
	var currentPosition = this.view.getProject().getPositionById(currentNodeId);

	//get all the node ids in the project
	var nodeIds = this.view.getProject().getNodeIds();

	if(this.activeTagMapConstraints == null) {
		//create the active tag map constraints array if it does not exist
		this.activeTagMapConstraints = [];
	}

	//loop through all the active tag map constraints
	for(var x=0; x<this.activeTagMapConstraints.length; x++) {
		//get an active tag map constraint
		var activeTagMapConstraint = this.activeTagMapConstraints[x];

		if(activeTagMapConstraint != null) {
			if(activeTagMapConstraint.isSatisfied()) {
				/*
				 * the student has satisfied the constraint so we will
				 * remove the constraint from the activeTagMapConstraints 
				 * array
				 */
				this.activeTagMapConstraints.splice(x, 1);
				
				//move the counter back one since we just removed an element in the array
				x--;
			} else {
				/*
				 * the constraint has not been satisfied so we will enforce it.
				 * this will grey out the steps that are not allowed to be
				 * visited
				 */
				activeTagMapConstraint.constrainNavigation();
			}
		}
	}

	TagMapConstraintManager.debugOutput('updateActiveTagMapConstraints active constraint count after:' + this.activeTagMapConstraints.length);
	
	return results;
};

/**
 * Add the active tag map constraint if it is not satisfied and does not already exist
 * @param nodeId the node id that this constraint is for
 * @param tagName (optional) the tag name used to identify which
 * other nodes that are used in this tag map 
 * @param functionName the name of the tag map function
 * @param functionArgs (optional) an array that contains tag map function args set
 * by the author of the project
 * @param additionalFunctionArgs (optional) an object that contains any additional
 * function args set by the vle
 */
TagMapConstraintManager.prototype.addActiveTagMapConstraintIfNecessary = function(nodeId, tagName, functionName, functionArgs, additionalFunctionArgs, customMessage) {
	//set the default values if the argument was not provided
	
	if(nodeId == null) {
		nodeId == '';
	}

	if(tagName == null) {
		tagName = '';
	}

	if(functionName == null) {
		functionName = '';
	}

	if(functionArgs == null) {
		functionArgs = [];
	}
	
	if(additionalFunctionArgs == null) {
		additionalFunctionArgs = {};
	}
	
	if(customMessage == null) {
		customMessage = '';
	}
	
	//create the tag map constraint
	var tagMapConstraint = TagMapConstraintFactory.createTagMapConstraint(this.view, nodeId, tagName, functionName, functionArgs, additionalFunctionArgs, customMessage);
	
	if(tagMapConstraint != null) {
		if(!tagMapConstraint.isSatisfied() && !this.activeTagMapConstraintExists(nodeId, tagName, functionName, functionArgs, additionalFunctionArgs, customMessage)) {
			/*
			 * the constraint is not satisfied and does not already exist
			 * so we will add it to the active constraints
			 */
			this.activeTagMapConstraints.push(tagMapConstraint);
		}
	}
};

/**
 * Check if the tag map constraint already exists in the activeTagMapConstraints array
 * @param nodeId the node id that this constraint is for
 * @param tagName (optional) the tag name used to identify which
 * other nodes that are used in this tag map 
 * @param functionName the name of the tag map function
 * @param functionArgs (optional) an array that contains tag map function args set
 * by the author of the project
 * @param additionalFunctionArgs (optional) an object that contains any additional
 * function args set by the vle
 */
TagMapConstraintManager.prototype.activeTagMapConstraintExists = function(nodeId, tagName, functionName, functionArgs, additionalFunctionArgs, customMessage) {
	var exists = false;
	
	//set the default values if the argument was not provided
	
	if(nodeId == null) {
		nodeId == '';
	}

	if(tagName == null) {
		tagName = '';
	}

	if(functionName == null) {
		functionName = '';
	}

	if(functionArgs == null) {
		functionArgs = [];
	}
	
	if(additionalFunctionArgs == null) {
		additionalFunctionArgs = {};
	}
	
	if(customMessage == null) {
		customMessage = '';
	}
	
	if(this.activeTagMapConstraints == null) {
		//create the active tag map constraints array if it does not exist
		this.activeTagMapConstraints = [];
	}
	
	//loop through all the active tag map constraints
	for(var x=0; x<this.activeTagMapConstraints.length; x++) {
		//get an active tag map constraint
		var activeTagMapConstraint = this.activeTagMapConstraints[x];
		
		//get all the parameters for the tag map constraint
		var tempNodeId = activeTagMapConstraint.nodeId;
		var tempTagName = activeTagMapConstraint.tagName;
		var tempFunctionName = activeTagMapConstraint.functionName;
		var tempFunctionArgs = activeTagMapConstraint.functionArgs;
		var tempAdditionalFunctionArgs = activeTagMapConstraint.additionalFunctionArgs;
		var tempCustomMessage = activeTagMapConstraint.customMessage;
		
		//commpare the parameters
		if(nodeId == tempNodeId && 
				tagName == tempTagName && 
				functionName == tempFunctionName &&
				JSON.stringify(functionArgs) == JSON.stringify(tempFunctionArgs) &&
				JSON.stringify(additionalFunctionArgs) == JSON.stringify(tempAdditionalFunctionArgs) &&
				customMessage == tempCustomMessage) {
			//all the parameters match so this tag map constraint already exists
			exists = true;
		}
	}
	
	return exists;
}

/**
 * Remove the active tag map constraint with the given parameters
 * @param nodeId the node id that this constraint is for
 * @param tagName (optional) the tag name used to identify which
 * other nodes that are used in this tag map 
 * @param functionName the name of the tag map function
 * @param functionArgs (optional) an array that contains tag map function args set
 * by the author of the project
 * @param additionalFunctionArgs (optional) an object that contains any additional
 * function args set by the vle
 */
TagMapConstraintManager.prototype.removeActiveTagMapConstraint = function(nodeId, tagName, functionName, functionArgs, additionalFunctionArgs, customMessage) {
	if(this.activeTagMapConstraints == null) {
		this.activeTagMapConstraints = [];
	}
	
	if(nodeId == null) {
		nodeId == '';
	}

	if(tagName == null) {
		tagName = '';
	}

	if(functionName == null) {
		functionName = '';
	}

	if(functionArgs == null) {
		functionArgs = [];
	}
	
	if(additionalFunctionArgs == null) {
		additionalFunctionArgs = {};
	}
	
	if(customMessage == null) {
		customMessage = '';
	}
	
	if(this.activeTagMapConstraints == null) {
		//create the active tag map constraints array if it does not exist
		this.activeTagMapConstraints = [];
	}
	
	//loop through the active tag map constraints
	for(var x=0; x<this.activeTagMapConstraints.length; x++) {
		//get an active tag map constraint
		var activeTagMapConstraint = this.activeTagMapConstraints[x];
		
		if(activeTagMapConstraint != null) {
			//get the parameters for the active tag map constraint
			var tempNodeId = activeTagMapConstraint.nodeId;
			var tempTagName = activeTagMapConstraint.tagName;
			var tempFunctionName = activeTagMapConstraint.functionName;
			var tempFunctionArgs = activeTagMapConstraint.functionArgs;
			var tempAdditionalFunctionArgs = activeTagMapConstraint.additionalFunctionArgs;
			var tempCustomMessage = activeTagMapConstraint.customMessage;
			
			//commpare the parameters
			if(nodeId == tempNodeId && 
					tagName == tempTagName && 
					functionName == tempFunctionName &&
					JSON.stringify(functionArgs) == JSON.stringify(tempFunctionArgs) &&
					JSON.stringify(additionalFunctionArgs) == JSON.stringify(tempAdditionalFunctionArgs) &&
					customMessage == tempCustomMessage) {
				//all the parameters match so we will remove this from the array
				this.activeTagMapConstraints.splice(x, 1);
				x--;
			}
		}
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/navigation/tagmapconstraints/TagMapConstraintManager.js');
}