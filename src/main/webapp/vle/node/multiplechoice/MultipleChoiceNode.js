/*
 * MultipleChoiceNode
 */

MultipleChoiceNode.prototype = new Node();
MultipleChoiceNode.prototype.constructor = MultipleChoiceNode;
MultipleChoiceNode.prototype.parent = Node.prototype;
MultipleChoiceNode.authoringToolName = "Multiple Choice";
MultipleChoiceNode.authoringToolDescription = "Students answer a multiple choice question";

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
 * @param divId the id of the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 */
MultipleChoiceNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
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
	
	$('#' + divId).html(studentWork);
};

NodeFactory.addNode('MultipleChoiceNode', MultipleChoiceNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/multiplechoice/MultipleChoiceNode.js');
}