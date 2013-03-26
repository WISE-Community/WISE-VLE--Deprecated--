/*
 * MultipleChoiceNode
 */

MultipleChoiceNode.prototype = new Node();
MultipleChoiceNode.prototype.constructor = MultipleChoiceNode;
MultipleChoiceNode.prototype.parent = Node.prototype;
MultipleChoiceNode.authoringToolName = "Multiple Choice";
MultipleChoiceNode.authoringToolDescription = "Students answer a multiple choice question";

MultipleChoiceNode.tagMapFunctions = [
	{functionName:'importWork', functionArgs:[]},
	{functionName:'showPreviousWork', functionArgs:[]}
];

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {MultipleChoiceNode}
 */
function MultipleChoiceNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	
	//mainly used for the ticker
	this.mc = null;
	this.contentBase;
	this.contentPanel;
	this.audioSupported = true;
	this.prevWorkNodeIds = [];
	
	this.tagMapFunctions = this.tagMapFunctions.concat(MultipleChoiceNode.tagMapFunctions);
};

/**
 * Takes in a state JSON object and converts it into an MCSTATE object
 * @param stateJSONObj a state JSON object
 * @return an MCSTATE object
 */
MultipleChoiceNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return MCSTATE.prototype.parseDataJSONObj(stateJSONObj);
};

/**
 * Retrieves the latest student work for this node and returns it in
 * a query entry object
 * @param vle the vle that this node has been loaded into, this vle
 * 		is related to a specific student, so all the work in this vle
 * 		is for just one student
 * @return a MultipleChoiceQueryEntry that contains the latest student
 * 		work for this node. return null if this student has not accessed
 * 		this step yet.
 */
MultipleChoiceNode.prototype.getLatestWork = function(vle) {
	var latestState = null;
	
	//setup the mc object by loading in the content of the step
	this.mc = new MC(loadXMLString(this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue));
	
	//load the states from the vle into the mc object
	this.mc.loadForTicker(this, vle);
	
	//get the most recent student work for this step
	latestState = this.mc.getLatestState(this.id);
	
	if(latestState == null) {
		//the student has not accessed or completed this step yet
		return null;
	}
	
	//create and return a query entry object
	return new MultipleChoiceQueryEntry(vle.getWorkgroupId(), vle.getUserName(), this.id, this.mc.promptText, latestState.getIdentifier(), this.mc.getCHOICEByIdentifier(latestState.getIdentifier()).text);
};

/**
 * Get the html string representation of the student work
 * @param work the student node state that we want to display
 * @return an html string that will display the student work
 */
MultipleChoiceNode.prototype.getStudentWorkHtmlView = function(work) {
	var latestState = work;
	var html = '';
	
	if(latestState != null && typeof latestState == 'object') {
		//get the student response as a string
		html = latestState.response + '';
	}
	
	return html;
};
/**
 * Returns the prompt for this node by loading the MC content and then
 * obtaining it from the MC
 * @return the prompt for this node
 */
MultipleChoiceNode.prototype.getPrompt = function() {
	var prompt = "";
	
	if(contentJSON != null) {
		//get the content for the node
		var contentJSON = this.content.getContentJSON();

		//see if the node content has an assessmentItem
		if(contentJSON != null && contentJSON.assessmentItem != null) {
			//obtain the prompt
			var assessmentItem = contentJSON.assessmentItem;
			var interaction = assessmentItem.interaction;
			prompt = interaction.prompt;	
		}
	}
				
	//return the prompt
	return prompt;
};

/**
 * Create a query container that will contain all the query entries
 * @param vle the vle that this node has been loaded into, this vle
 * 		is related to a specific student, so all the work in this vle
 * 		is for just one student
 * @return a MultipleChoiceQueryContainer that will contain all the
 * 		query entries for a specific nodeId as well as accumulated 
 * 		metadata about all those entries such as count totals, etc.
 */
MultipleChoiceNode.prototype.makeQueryContainer = function(vle) {
	//setup the mc object by loading in the content of the step
	this.mc = new MC(loadXMLString(this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue));
	
	//load the states from the vle into the mc object
	this.mc.loadForTicker(this, vle);
	
	//create and return a query container object
	return new MultipleChoiceQueryContainer(this.id, this.mc.promptText, this.mc.choiceToValueArray);
};

/**
 * Returns the human readable value of the work
 * @param studentWork the human readable answer
 * @return the human readable value of the choice the student chose
 */
MultipleChoiceNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

MultipleChoiceNode.prototype.onExit = function() {
	
};

MultipleChoiceNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/multiplechoice/multiplechoice.html');
};

/**
 * Renders the student work into the div. The grading tool will pass in a
 * div id to this function and this function will insert the student data
 * into the div.
 * 
 * @param displayStudentWorkDiv the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 */
MultipleChoiceNode.prototype.renderGradingView = function(displayStudentWorkDiv, nodeVisit, childDivIdPrefix, workgroupId) {
	//create the multiple choice object so we can reference the content later
	var multipleChoice = new MC(this, this.view);
	
	//get the latest state
	var state = nodeVisit.getLatestWork();
	
	var studentWork = "";
	
	//check if there were any choices chosen
	if(state.response) {
		//loop through the array of choices
		for(var x=0; x<state.response.length; x++) {
			if(studentWork != "") {
				//separate each choice with a comma
				studentWork += ", ";
			}
			
			//add the choice to the student work
			studentWork += state.response[x];
		}
		
		if(state.score != null){
			//get the max score
			var maxScore = multipleChoice.getMaxPossibleScore();
			
			studentWork += "<br><br>";
			studentWork += "Auto-Graded Score: " + state.score + "/" + maxScore;
		}
	}
	
	displayStudentWorkDiv.html(studentWork);
};

/**
 * Renders the summary of all students' work into the div. The grading tool will pass in a
 * div id to this function and this function will insert the student data
 * into the div.
 * 
 * @param divId the id of the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupIdToWork the id of the workgroup to work mapping
 * @param dom dom to render the summary into
 * @param graphType bar|pie|barpie
 */
MultipleChoiceNode.prototype.renderSummaryView = function(workgroupIdToWork, dom, graphType) {
	var view = this.view;
	var nodeId = this.id;
	if (dom == null) {
		dom=$("#summaryContent");
	}
	this.displayStepGraph(nodeId,dom,workgroupIdToWork,graphType);
};

/**
 * Determine whether the student has completed the step or not
 * @param nodeState the latest node state for the step
 * @return whether the student has completed the step or not
 */
MultipleChoiceNode.prototype.isCompleted = function(nodeState) {
	var result = false;
	
	if(nodeState != null && nodeState != '') {
		var content = this.content.getContentJSON();
		
		if(content!= null &&
				content.assessmentItem != null &&
				content.assessmentItem.responseDeclaration != null &&
				content.assessmentItem.responseDeclaration.correctResponse != null &&
				content.assessmentItem.responseDeclaration.correctResponse.length > 0) {
			/*
			 * this step has a correct answer so we will check if the
			 * student answered correctly
			 */
			if(nodeState.isCorrect) {
				result = true;
			}
		} else {
			result = true;
		}
	}
	
	return result;
};

/**
 * Display graph (bar graph) for a particular step in step filter mode, like bar graph in MC node filter
 * 
 * @param nodeId ID of step that is filtered and should show the bar graph.
 * @param dom dom to render the summary into
 * @param workgroupIdToWork the id of the workgroup to work mapping
 * @param graphType bar|pie|barpie
 */
MultipleChoiceNode.prototype.displayStepGraph = function(nodeId,dom,workgroupIdToWork,graphType) {

	function translateChoiceTextToColorHex(choiceText, choiceIndex) {
		if (choiceText == "red") {
			return "FF0000";
		} else if (choiceText == "green") {
			return "00FF00";
		} else if (choiceText == "blue") {
			return "0000FF";
		} else if (choiceText == "yellow") {
			return "FFFF00";
		} else if (choiceText == "black") {
			return "FFFFFF";
		} else if (choiceText == "purple") {
			return "7D26CD";
		} else if (choiceText == "orange") {
			return "FFA500";
		}
		return ["b01717","0323cb","896161","ecb0b0","fbd685","b4bec3","cf33e1","37c855","7D26CD","FFFFFF"][choiceIndex];  // return default colors based on choice index to avoid collision
	};
	
	var choiceToCount = {};
	if (workgroupIdToWork === null) {
		workgroupIdToWork = nodeIdToWork[nodeId];
	}
	var workgroupIdsInClass = this.view.userAndClassInfo.getWorkgroupIdsInClass();
	var mcChoices = [];
	var mcChoiceColors = [];  // display color for each choice.
	var node = this.view.project.getNodeById(nodeId);
	var mcContent = node.content.getContentJSON();
	/* add each choice object from the content to the choices array */
	for(var a=0;a<mcContent.assessmentItem.interaction.choices.length;a++){
		var mcChoiceText = mcContent.assessmentItem.interaction.choices[a].text;
		mcChoices.push(mcChoiceText);
		mcChoiceColors.push(translateChoiceTextToColorHex(mcChoiceText, a));
	}

	//loop through all the students in the class
	for (var i=0; i<workgroupIdsInClass.length; i++) {
		var workgroupIdInClass = workgroupIdsInClass[i];

		//get the choice the student answered
		var workByWorkgroup = null

		if(workgroupIdToWork[workgroupIdInClass] != null) {
			workByWorkgroup = workgroupIdToWork[workgroupIdInClass].response;
			
			if(workByWorkgroup != null) {
				if (choiceToCount[workByWorkgroup] == null) {
					choiceToCount[workByWorkgroup] = 0;
				}

				//increment the choice
				choiceToCount[workByWorkgroup] += 1;
			}
		}
	}
	var choicesCountArray = [];
	var maxChoiceCountSoFar = 0;  // keep track of maximum count here
	// now loop thru mcChoices and tally up 
	for (var k=0; k<mcChoices.length; k++) {
		var mcChoiceText = mcChoices[k];

		//get the total count for this choice
		var finalCount = choiceToCount[mcChoiceText];
		if (typeof finalCount == "undefined") {
			finalCount = 0;
		}

		/*
		 * add the count for this choice so that the graphing utility
		 * knows how many students chose this choice
		 */
		choicesCountArray.push(finalCount);

		if (finalCount > maxChoiceCountSoFar) {
			/*
			 * update the highest count for any choice to determine the
			 * max y value
			 */
			maxChoiceCountSoFar = finalCount;
		}
	}

	var xLabelStr = "|"+mcChoices.join("|");
	var xLabelStr2 = mcChoices.join("|");
	var colorStr = mcChoiceColors.join("|");
	var tallyStr = choicesCountArray.join(",");

	/*
	 * construct googlecharts url and set realTimeMonitorGraphImg src.
	 * e.g.
	 * http://chart.apis.google.com/chart?chxl=0:|Oscar|Monkey|Oski|Dodo&chxr=1,0,5&chxt=x,y&chbh=a&chs=300x225&cht=bvg&chco=A2C180&chd=t:1,5,0,0&chds=0,5&chp=0&chma=|2&chtt=Student+Responses
	 */

	var realTimeMonitorGraphImgSrc = "http://chart.apis.google.com/chart?chxl=0:"+xLabelStr+"&chxr=1,0,"+(maxChoiceCountSoFar+1)+"&chxt=x,y&chbh=a&chs=300x225&cht=bvg&chco=A2C180&chd=t:"+tallyStr+"&chds=0,"+(maxChoiceCountSoFar+1)+"&chco="+colorStr+"&chp=0&chma=|2&chtt=Student+Responses";
	var realTimeMonitorGraphImgSrc2 = "http://chart.apis.google.com/chart?cht=p&chs=250x100&chd=t:"+tallyStr+"&chl="+xLabelStr2+"&chco="+colorStr;
	//display the appropriated graph type(s) in the dom
	if (graphType == "bar") {
		$(dom).append('<img id="realTimeMonitorGraphImg" src="'+realTimeMonitorGraphImgSrc+'" width="300" height="225" alt="Student Responses"></img>');
	} else if (graphType == "pie") {
		$(dom).append('<img id="realTimeMonitorGraphImg2" src="'+realTimeMonitorGraphImgSrc2+'" width="500" height="200" alt="Student Responses"></img>');
	} else if (graphType == "barpie") {
		$(dom).append('<img id="realTimeMonitorGraphImg" src="'+realTimeMonitorGraphImgSrc+'" width="300" height="225" alt="Student Responses"></img>');
		$(dom).append('<img id="realTimeMonitorGraphImg2" src="'+realTimeMonitorGraphImgSrc2+'" width="500" height="200" alt="Student Responses"></img>');
	} else {
		$(dom).append('<img id="realTimeMonitorGraphImg" src="'+realTimeMonitorGraphImgSrc+'" width="300" height="225" alt="Student Responses"></img>');
		$(dom).append('<img id="realTimeMonitorGraphImg2" src="'+realTimeMonitorGraphImgSrc2+'" width="500" height="200" alt="Student Responses"></img>');
	}

	$(dom).show();
};

/**
 * Returns the criteria value for this node based on student response.
 */
MultipleChoiceNode.prototype.getCriteriaValue = function() {
	var result = null;
	var latestState = view.getLatestStateForNode(this.id);
	if(latestState != null && latestState != '' && latestState.choices != null) {
		return latestState.choices;
	}
	return result;
};

NodeFactory.addNode('MultipleChoiceNode', MultipleChoiceNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/multiplechoice/MultipleChoiceNode.js');
}