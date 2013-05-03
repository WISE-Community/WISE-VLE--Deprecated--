EpigameNode.prototype = new Node();
EpigameNode.prototype.constructor = EpigameNode;
EpigameNode.prototype.parent = Node.prototype;

/*
 * the name that displays in the authoring tool when the author creates a new step
 */
EpigameNode.authoringToolName = "Epigame"; 

/*
 * will be seen by the author when they add a new step to their project to help
 * them understand what kind of step this is
 */
EpigameNode.authoringToolDescription = "Game step for Surge: The Fuzzy Chronicles";

/*
 * The tag map functions that are available for this step type
 */
EpigameNode.tagMapFunctions = [
	{functionName:"checkCompletedAll", functionArgs:[]},
	{functionName:"checkCompletedAny", functionArgs:[]},
	{functionName:"checkStepPerformance", functionArgs:["Score to Unlock"]},
	{functionName:"checkStepExplanation", functionArgs:["Score to Unlock"]},
	{functionName:"getTotalPerformance", functionArgs:["Score to Unlock (optional)", "Tag Multipliers (advanced)"]},
	{functionName:"getTotalExplanation", functionArgs:["Score to Unlock (optional)", "Tag Multipliers (advanced)"]},
	{functionName:"getTotalAdaptive", functionArgs:["Score to Unlock (optional)"]}
];

EpigameNode.prototype.getQuizData = function(customURL) {
	var content = null;
	
	if (customURL && customURL != "") {
		content = createContent(customURL);
	} else {
		if (!this.defaultQuizContent)
			this.defaultQuizContent = createContent("node/epigame/adaptiveQuizData.json");
			
		content = this.defaultQuizContent;
	}
	return content.getContentJSON();
};

EpigameNode.prototype.getAdaptiveMissionData = function(customURL) {
	var content = null;
	
	if (customURL && customURL != "") {
		content = createContent(customURL);
	} else {
		if (!this.defaultAdaptiveMissionContent) {
			this.defaultAdaptiveMissionContent = createContent("node/epigame/adaptiveMissionData.json");		
		}
			
		content = this.defaultAdaptiveMissionContent;
	}
	return content.getContentJSON();
};

/**
 * This is the constructor for the Node
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 */
function EpigameNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
	
	this.tagMapFunctions = this.tagMapFunctions.concat(EpigameNode.tagMapFunctions);
}

/**
 * This function is called when the vle loads the step and parses
 * the previous student answers, if any, so that it can reload
 * the student's previous answers into the step.
 * 
 * @param stateJSONObj
 * @return a new state object
 */
EpigameNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return EpigameState.prototype.parseDataJSONObj(stateJSONObj);
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
 * @param studentWork
 * @return translated student work
 */
EpigameNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * Notify the HTML so it can save state on exit if desired.
 */
EpigameNode.prototype.onExit = function() {
	//check if the content panel has been set
	if (this.contentPanel && this.contentPanel.save) {
		//tell the content panel to save
		this.contentPanel.save();
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
 * @param workgroupId the id of the workgroup this work belongs to
 * 
 * Note: you may need to add code to this function if the student
 * data for your step is complex or requires additional processing.
 * look at SensorNode.renderGradingView() as an example of a step that
 * requires additional processing
 */
EpigameNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
	var gradingText = "";
	// Get all the trials (ie states) for this nodevisit
	var nodeStates = nodeVisit.nodeStates;
	
	if (nodeStates.length > 0) {
		
		//get the best score
		//gradingText += "<span style='font-weight:bold;'>Best medal earned for this level: "+nodeStates[nodeStates.length-1].getStudentWork().response.topScoreText+"</span><br/><br/>";
		
		//get the number of trials during this node visit.
		//gradingText += "This visit has " + nodeStates.length + " trial(s).<br/><br/>";
		
		//loop through the trials from newest to oldest so that the newest displays at the top
		for (var i = nodeStates.length - 1; i >= 0; --i) {
			//gradingText += "<b>Trial #"+(i+1)+"</b><br/>"
			gradingText += JSON.stringify(nodeStates[i].getStudentWork().response) + "<br/><br/>";
		}

		//put the student work into the div
		$('#' + divId).html(gradingText);
	}
};

/**
 * Get the html file associated with this step that we will use to
 * display to the student.
 * 
 * @return a content object containing the content of the associated
 * html for this step type
 */
EpigameNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/epigame/epigame.html');
};

/**
 * Process the student work to see if we need to display a colored
 * star next to the step in the nav menu
 * @param studentWork the student's epigame state
 */
EpigameNode.prototype.processStudentWork = function(studentWork) {
	//Disabled for now...
	/*
	if(studentWork != null) {
		if(studentWork.response != null && studentWork.response != "") {
			//var className = "";
			var imgPath = '';
			var tooltip = '';
			
			//get the top score
			var topScore = studentWork.response.topScore;
			var scoreAbsolute = studentWork.response.scoreAbsolute;
			
			var best;
			
			if(topScore > scoreAbsolute || topScore == scoreAbsolute){
				best = topScore;
			} else {
				best = scoreAbsolute;
			}
			
			if(best == 10) {
				//className = "bronzeStar";
				imgPath = '/vlewrapper/vle/node/epigame/images/bronzeStar.png';
				tooltip = "You have earned a bronze medal";
			} else if(best == 20) {
				//className = "silverStar";
				imgPath = '/vlewrapper/vle/node/epigame/images/silverStar.png';
				tooltip = "You have earned a silver medal";
			} else if(best == 30) {
				//className = "goldStar";
				imgPath = '/vlewrapper/vle/node/epigame/images/goldStar.png';
				tooltip = "You have earned a gold medal";
			}
			
			//display the star next to the step in the nav menu
			eventManager.fire('updateStepStatusIcon', [this.id, imgPath, tooltip]);
		}
	}
	*/
};

/**
 * Get a tag map function given the function name
 * @param functionName
 * @return 
 */
EpigameNode.prototype.getTagMapFunctionByName = function(functionName) {
	var fun = null;
	
	//get all the tag map function for this step type
	var tagMapFunctions = this.getTagMapFunctions();
	
	//loop through all the tag map functions
	for(var x=0; x<tagMapFunctions.length; x++) {
		//get a tag map function
		var tagMapFunction = tagMapFunctions[x];
		
		if (tagMapFunction != null) {
			//check if the function name matches
			if (functionName == tagMapFunction.functionName) {
				//the function name matches so we have found what we want
				fun = tagMapFunction;
				break;
			}
		}
	};
	
	return fun;
};

EpigameNode.prototype.navHelper = function() {
	var interpretNode = function(node) {
		var result = {
			id: node.id,
			title: node.title,
			type: node.type,
			className: node.className,
			content: null,
			imagePathBase: node.view.nodeIconPaths[node.type],
			tags: node.tags,
			children: []
		};
		
		if (node.children)
			for (var i = 0; i < node.children.length; ++i)
				result.children[i] = interpretNode(node.children[i]);
				
		if (node.content)
			result.content = node.content.getContentJSON();
			
		return result;
	}
	
	return {
		getProjectData: function() {
			var project = env.getProject();
			return {
				root: interpretNode(project.getRootNode()),
				stepTerm: project.getStepTerm(),
				title: project.getTitle()
			};
		},
		toggleNav: function() {
//			eventManager.fire('toggleNavigationVisibility');
			eventManager.fire('navigationPanelToggleVisibilityButtonClicked'); //4.7 switch
			
		},
		executeNode: function(sequenceIndex, stepIndex) {
			var pos = String(sequenceIndex) + "." + String(stepIndex);			
//			eventManager.fire('renderNode', pos);
			view.goToNodePosition(pos);	//4.7 Switch
		}
	};
}();

//Add this node to the node factory so the vle knows it exists.
NodeFactory.addNode('EpigameNode', EpigameNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/epigame/EpigameNode.js');
};