/*
 * This is a branching step object that developers can use to create new
 * step types.
 * 
 * TODO: Copy this file and rename it to
 * 
 * <new step type>.js
 * e.g. for example if you are creating a quiz step it would look
 * something like quiz.js
 *
 * and then put the new file into the new folder
 * you created for your new step type
 *
 * your new folder will look something like
 * vlewrapper/WebContent/vle/node/<new step type>/
 *
 * e.g. for example if you are creating a quiz step it would look something like
 * vlewrapper/WebContent/vle/node/quiz/
 * 
 * 
 * TODO: in this file, change all occurrences of the word 'Branching' to the
 * name of your new step type
 * 
 * <new step type>
 * e.g. for example if you are creating a quiz step it would look
 * something like Quiz
 */

/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at branching.html)
 * 
 * TODO: rename Branching
 * 
 * @constructor
 */
function Branching(node) {
	this.node = node;
	this.view = node.view;
	this.content = node.getContent().getContentJSON();
	this.chosenPathId = null; // which path the student has chosen or was assigned to
	this.chosenPathName = null; //the title of the path that was chosen
	
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
};

/**
 * Translates VLE constants like VLE_WORKGROUP_ID to actual workgroup value
 * @param operand
 */
Branching.prototype.translateOperand = function(operand) {
	if (operand == "VLE_WORKGROUP_ID") {
		if (this.view.getConfig().getConfigParam("mode") == "portalpreview") {
			return 0;
		} else {
			return this.view.getUserAndClassInfo().getWorkgroupId();
		}
	}
	return operand;
};

/**
 * Determine which path to visit
 */
Branching.prototype.getPathToVisit = function() {
	// invoke the branching function and get the results.
	var branchingFunction = this.content.branchingFunction;
	var branchingFunctionParams = this.content.branchingFunctionParams;
	var result = null;
	if (branchingFunction == "mod") {
		var leftOperand = this.translateOperand(branchingFunctionParams[0]);
		var rightOperand = this.translateOperand(branchingFunctionParams[1]);
		result = leftOperand % rightOperand;
	}	
	
	// use the result to determine the path to visit
	var pathToVisit = null;
	for (var i=0; i<this.content.paths.length; i++) {
		var path = this.content.paths[i];
		if (path.branchingFunctionExpectedResults == result) {
			pathToVisit = path;
			break;
		}
	}
	return pathToVisit;
};

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 * 
 * TODO: rename Branching
 * 
 * note: you do not have to use 'promptDiv' or 'studentResponseTextArea', they
 * are just provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at branching.html).
 */
Branching.prototype.render = function() {
	// if showSplashPage is false, we immediately run the branchingFunction and go to the first node in the chosen path.
	if (!this.content.showSplashPage) {

		var pathToVisitJSONObj = this.getPathToVisit();
		if (!pathToVisitJSONObj) {
			this.view.notificationManager.notify("No branching path is available at this time. Please move on to the next step.",3);
			return;
		}
		// inject the nodes in the path into the Project
		this.chosenPathId = pathToVisitJSONObj.identifier;
		
		var chosenSequenceId = pathToVisitJSONObj.sequenceRef;
		var pathSequence = this.view.getProject().getNodeById(chosenSequenceId);  // get the sequence node

		//get the title of the path
		this.chosenPathName = pathSequence.title;
		
		// loop through the nodes in the sequence and add them to the current sequence after the branch node
		for (var i=0; i < pathSequence.children.length; i++) {
			var nodeInPath = pathSequence.children[i];
			// show the nodes in the navigation
			var doDisplay = true;
			nodeInPath.displayInNavigation(doDisplay);
			
			// also preload the nodes in path
			nodeInPath.preloadContent();							
		}

		// check to see if we need to hide this BranchNode.
		if (!this.content.showBranchNodeAfterBranching) {
			var doDisplay = false;
			this.node.displayInNavigation(doDisplay);
		}

		// update navigation logic with changes to the sequence (e.g. skip hidden nodes, etc)
		this.view.updateNavigationLogic();

		// render the next node, which should be the first node of the branched path
		eventManager.fire("renderNextNode");
	} else {
		// show the splash page and let the user choose a branch to go down
	}
};

/**
 * This function retrieves the latest student work
 * 
 * TODO: rename Branching
 * 
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
Branching.prototype.getLatestState = function() {
	var latestState = null;
	
	//check if the states array has any elements
	if(this.states != null && this.states.length > 0) {
		//get the last state
		latestState = this.states[this.states.length - 1];
	}
	
	return latestState;
};

/**
 * This function retrieves the student work from the html ui, creates a state
 * object to represent the student work, and then saves the student work.
 * 
 * TODO: rename Branching
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at branching.html).
 */
Branching.prototype.save = function() {
	//get the answer the student wrote
	var response = {
		"chosenPathId":this.chosenPathId,
		"chosenPathName":this.chosenPathName
	};
	
	/*
	 * create the student state that will store the new work the student
	 * just submitted
	 * 
	 * TODO: rename BranchingState
	 * 
	 * make sure you rename BranchingState to the state object type
	 * that you will use for representing student data for this
	 * type of step. copy and modify the file below
	 * 
	 * vlewrapper/WebContent/vle/node/branching/branchingState.js
	 * 
	 * and use the object defined in your new state.js file instead
	 * of BranchingState. for example if you are creating a new
	 * quiz step type you would copy the file above to
	 * 
	 * vlewrapper/WebContent/vle/node/quiz/quizState.js
	 * 
	 * and in that file you would define QuizState and therefore
	 * would change the BranchingState to QuizState below
	 */
	var branchingState = new BranchingState(response);
	
	/*
	 * fire the event to push this state to the global view.states object.
	 * the student work is saved to the server once they move on to the
	 * next step.
	 */
	eventManager.fire('pushStudentWork', branchingState);

	//push the state object into this or object's own copy of states
	this.states.push(branchingState);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename branching to your new folder name
	 * TODO: rename branching.js
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/quiz.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/branching/branching.js');
}