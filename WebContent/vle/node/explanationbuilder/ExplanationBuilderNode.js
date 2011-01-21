/*
 * This a template Node that developers can use to create new 
 * step types. Copy this file and rename it to 
 *
 * <new step type>Node.js
 * e.g. for example if you are creating a quiz step type it would
 * look something like QuizNode.js
 * 
 * and then in this file change all occurrences of the word 'TemplateNode' to 
 * 
 * <new step type>Node
 * 
 * e.g. for example if you are creating a quiz step type you would
 * change it to be QuizNode
 */

ExplanationBuilderNode.prototype = new Node(); //xTODO: rename TemplateNode
ExplanationBuilderNode.prototype.constructor = ExplanationBuilderNode; //xTODO: rename TemplateNode
ExplanationBuilderNode.prototype.parentNode = Node.prototype; //xTODO: rename TemplateNode

/*
 * the name that displays in the authoring tool when the author creates a new step
 * 
 * xTODO: rename TemplateNode
 * xTODO: rename Template to whatever you would like this step to be displayed as in
 * the authoring tool when the author creates a new step
 */
ExplanationBuilderNode.authoringToolName = "Explanation Builder"; 

ExplanationBuilderNode.authoringToolDescription = ""; //xTODO: rename TemplateNode

/**
 * This is the constructor for the Node
 * 
 * xTODO: rename TemplateNode
 * 
 * @param nodeType
 * @param view
 */
function ExplanationBuilderNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
}

/**
 * This function is called when the vle loads the step and parses
 * the previous student answers, if any, so that it can reload
 * the student's previous answers into the step.
 * 
 * xTODO: rename TemplateNode
 * 
 * @param stateJSONObj
 * @return a new state object
 */
ExplanationBuilderNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	/*
	 * xTODO: rename TEMPLATESTATE
	 * 
	 * make sure you rename TEMPLATESTATE to the state object type
	 * that you will use for representing student data for this
	 * type of step. copy and modify the file below
	 * 
	 * vlewrapper/WebContent/vle/node/template/templatestate.js
	 * 
	 * and use the object defined in your new state.js file instead
	 * of TEMPLATESTATE. for example if you are creating a
	 * quiz step type you would copy the file above to
	 * 
	 * vlewrapper/WebContent/vle/node/quiz/quizstate.js
	 * 
	 * and in that file you would define QUIZSTATE and therefore
	 * would change the TEMPLATESTATE to QUIZSTATE below
	 */ 
	return ExplanationBuilderState.prototype.parseDataJSONObj(stateJSONObj);
};

/**
 * This function is called if there needs to be any special translation
 * of the student work from the way the student work is stored to a
 * human readable form. For example if the student work is stored
 * as an array that contains 3 elements, for example
 * ["apple", "banana", "orange"]
 *  
 * and you wanted to display the student work like this
 * 
 * Answer 1: apple
 * Answer 2: banana
 * Answer 3: orange
 * 
 * you would perform that translation in this function.
 * 
 * Note: In most cases you will not have to change the code in this function
 * 
 * xTODO: rename TemplateNode
 * 
 * @param studentWork
 * @return translated student work
 */
ExplanationBuilderNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * This function is called when the student exits the step. It is mostly
 * used for error checking.
 * 
 * xTODO: rename TemplateNode
 * 
 * Note: In most cases you will not have to change anything here.
 */
ExplanationBuilderNode.prototype.onExit = function() {
	//check if the content panel has been set
	if(this.contentPanel) {
		try {
			/*
			 * check if the onExit function has been implemented or if we
			 * can access attributes of this.contentPanel. if the user
			 * is currently at an outside link, this.contentPanel.onExit
			 * will throw an exception because we aren't permitted
			 * to access attributes of pages outside the context of our
			 * server.
			 */
			if(this.contentPanel.save) {
				try {
					//run the on exit cleanup
					this.contentPanel.save();					
				} catch(err) {
					//error when onExit() was called, e.g. mysystem editor undefined
				}
			}	
		} catch(err) {
			/*
			 * an exception was thrown because this.contentPanel is an
			 * outside link. we will need to go back in the history
			 * and then trying to render the original node.
			 */
			history.back();
		}
	}
};

/**
 * Renders the student work into the div. The grading tool will pass in a
 * div id to this function and this function will insert the student data
 * into the div.
 * 
 * @param divId the id of the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * 
 * xTODO: rename TemplateNode
 * Note: you may need to add code to this function if the student
 * data for your step is complex or requires additional processing.
 * look at SensorNode.renderGradingView() as an example of a step that
 * requires additional processing
 */
ExplanationBuilderNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix) {
	/*
	 * Get the latest student state object for this step
	 * xTODO: rename templateState to reflect your new step type
	 * 
	 * e.g. if you are creating a quiz step you would change it to quizState
	 */
	var explanationBuilderState = nodeVisit.getLatestWork();
	
	/*
	 * xTODO: rename templateState to match the variable name you
	 * changed in the previous line above
	 */
	var studentWork = explanationBuilderState.getStudentWork();
	
	//put the student work into the div
	$('#' + divId).html(studentWork);
};

/**
 * Get the html file associated with this step that we will use to
 * display to the student.
 * 
 * xTODO: rename TemplateNode
 * 
 * @return a content object containing the content of the associated
 * html for this step type
 */
ExplanationBuilderNode.prototype.getHTMLContentTemplate = function() {
	/*
	 * xTODO: rename both occurrences of template
	 * 
	 * e.g. if you are creating a quiz step you would change it to
	 * 
	 * node/quiz/quiz.html
	 */
	return createContent('node/explanationbuilder/explanationBuilder.html');
};

/*
 * Add this node to the node factory so the vle knows it exists.
 * xTODO: rename both occurrences of TemplateNode
 * 
 * e.g. if you are creating a quiz step you would change it to
 * 
 * NodeFactory.addNode('QuizNode', QuizNode);
 */
NodeFactory.addNode('ExplanationBuilderNode', ExplanationBuilderNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * xTODO: rename template to your new folder name
	 * xTODO: rename TemplateNode
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/QuizNode.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/explanationbuilder/ExplanationBuilderNode.js');
};