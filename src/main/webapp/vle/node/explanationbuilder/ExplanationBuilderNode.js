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

ExplanationBuilderNode.authoringToolDescription = "Students use ideas from their Idea Basket to generate a response"; //xTODO: rename TemplateNode

/**
 * This is the constructor for the Node
 * 
 * xTODO: rename TemplateNode
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 */
function ExplanationBuilderNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
	
	/*
	 * subscribe this node to the 'ideaBasketChanged' so it will know when
	 * anyone outside this step has changed the idea basket
	 */
	view.eventManager.subscribe('ideaBasketChanged', this.ideaBasketChanged, this);
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
ExplanationBuilderNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
	//get the step work id
	var stepWorkId = nodeVisit.id;
	
	//create an ExplanationBuilder object so that we can retrieve the prompt an background
	var explanationBuilder = new ExplanationBuilder(this, this.view);
	explanationBuilder.prompt = explanationBuilder.content.prompt;
	explanationBuilder.background = explanationBuilder.content.background;
	
	var backgroundPath = null;
	
	if(explanationBuilder.background != null && explanationBuilder.background != "") {
		if(explanationBuilder.background.indexOf('http') != -1) {
			//background image path is absolute
			backgroundPath = explanationBuilder.background;
		} else {
			//background image is relative so we need to create the full path to the background image
			backgroundPath = this.view.getConfig().getConfigParam('getContentBaseUrl') + explanationBuilder.background;			
		}
	}
	
	//get the background width and height
	var backgroundWidth = explanationBuilder.backgroundWidth;
	var backgroundHeight = explanationBuilder.backgroundHeight;
	
	//create the div that will contain the ideas
	var explanationBuilderIdeasDivId = childDivIdPrefix + 'explanationBuilderIdeasDiv_' + stepWorkId;
	var explanationBuilderIdeasDiv = createElement(document, 'div', {id: explanationBuilderIdeasDivId, style:'width:' + backgroundWidth + 'px;height:' + backgroundHeight + 'px;border: 1px solid;position:relative'});
	
	//add the explanationBuilderIdeasDiv to the grading div
	$('#' + divId).append(explanationBuilderIdeasDiv);
	
	if(backgroundPath != null) {
		//set the background attributes
		$('#' + explanationBuilderIdeasDivId).css('background-image','url(' + backgroundPath + ')');
		$('#' + explanationBuilderIdeasDivId).css('background-repeat','no-repeat');
		$('#' + explanationBuilderIdeasDivId).css('background-position','left top');		
	}
	
	//get the idea basket for this student
	var ideaBasket = this.view.getIdeaBasketByWorkgroupId(workgroupId);
	
	/*
	 * Get the latest student state object for this step
	 * xTODO: rename templateState to reflect your new step type
	 * 
	 * e.g. if you are creating a quiz step you would change it to quizState
	 */
	var explanationBuilderState = nodeVisit.getLatestWork();
	
	//get the explanation ideas the student used
	var explanationIdeas = explanationBuilderState.explanationIdeas;
	
	//get the student text answer
	var answer = explanationBuilderState.answer;
	
	//loop through all the explanation ideas
	for(var x=0; x<explanationIdeas.length; x++) {
		//get an explanation idea
		var explanationIdea = explanationIdeas[x];
		
		//get the attributes of the explanation idea
		var id = explanationIdea.id;
		var left = explanationIdea.xpos;
		var top  = explanationIdea.ypos;
		var currColor = explanationIdea.color;
		
		var text = "";
		
		if(ideaBasket != null) {
			//get the idea from the basket
			var idea = ideaBasket.getIdeaById(id);
			
			if(idea != null) {
				//get the text for the idea
				text = idea.text;
			}
		}
		
		//create a div for the idea that will be displayed as a rectangle
		var explanationIdeaHtml = '<div class="exIdea" class="selected" title="Click and drag to move; Click to change color" id="' + childDivIdPrefix + 'explanationIdea' 
			+ id + '_' + stepWorkId + '" style="position:absolute; left:' + left + 'px; top:' + top + 'px; background-color:' + currColor + '">' + text + '</div>';
		
		//add the idea div to the explanationBuilderIdeasDiv
		$('#' + explanationBuilderIdeasDivId).append(explanationIdeaHtml);
	}
	
	//create a div to display the student answer
	var explanationBuilderAnswerDiv = childDivIdPrefix + 'explanationBuilderAnswerDiv_' + stepWorkId;
	var answerDiv = createElement(document, 'div', {id: explanationBuilderAnswerDiv});
	$('#' + divId).append(answerDiv);

	//replacen \n with <br>
	answer = this.view.replaceSlashNWithBR(answer);
	
	/*
	 * add a <br> before the answer so there will be a new 
	 * line between the ideas and this text answer
	 */
	answer = "<br>" + answer;
	
	//set the answer in the div
	$('#' + explanationBuilderAnswerDiv).html(answer);
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

/**
 * Get the prompt for this step
 * @return the prompt for this step as a string
 */
ExplanationBuilderNode.prototype.getPrompt = function() {
	var prompt = "";
	
	if(this.content != null) {
		//get the content for the node
		var contentJSON = this.content.getContentJSON();

		//see if the node content has a prompt
		if(contentJSON != null && contentJSON.prompt != null) {
			prompt = contentJSON.prompt;	
		}
	}
	
	//return the prompt
	return prompt;
};

/**
 * Called when the 'ideaBasketChanged' is fired
 * @param type
 * @param args
 * @param obj this node (since this context is not actually in this node
 * because this function is called from an event fire)
 */
ExplanationBuilderNode.prototype.ideaBasketChanged = function(type,args,obj) {
	//get this node
	var thisNode = obj;
	
	/*
	 * make sure this node is the current node the student is on because
	 * all ExplanationBuilderNode steps will be listening for the event
	 * and we only need to update the basket if the student is on 
	 * an ExplanationBuilderNode step.
	 */
	if(thisNode.view.getCurrentNode().id == thisNode.id) {
		//update the idea basket within the step
		thisNode.contentPanel.explanationBuilder.ideaBasketChanged(thisNode.view.ideaBasket);
	}
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