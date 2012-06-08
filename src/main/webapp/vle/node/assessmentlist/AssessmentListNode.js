AssessmentListNode.prototype = new Node();
AssessmentListNode.prototype.constructor = AssessmentListNode;
AssessmentListNode.prototype.parent = Node.prototype;
AssessmentListNode.authoringToolName = "Questionnaire";
AssessmentListNode.authoringToolDescription = "Students answer a collection of questions that require text or multiple choice answers";
AssessmentListNode.prototype.i18nEnabled = true;
AssessmentListNode.prototype.i18nPath = "/vlewrapper/vle/node/assessmentlist/i18n/";
AssessmentListNode.prototype.supportedLocales = {
			"en_US":"en_US",
			"ja":"ja",
			"nl":"nl",
			"nl_GE":"nl",
			"nl_DE":"nl"
};

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {AssessmentListNode}
 */
function AssessmentListNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
};

AssessmentListNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return ASSESSMENTLISTSTATE.prototype.parseDataJSONObj(stateJSONObj);
};

/**
 * Sets up a WorkOnXConstraint before rendering so that students will
 * not be able to navigate to any other step before completing work on
 * this step if that was specified in the content.
 * 
 * @param contentPanel
 * @param studentWork
 */
AssessmentListNode.prototype.render = function(contentPanel,studentWork, disable){
	// add constraints
	this.addConstraints();
	
	/* call super */
	Node.prototype.render.call(this, contentPanel, studentWork, disable);
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
AssessmentListNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
    // Get the latest student state object for this step
	var assessmentListState = nodeVisit.getLatestState();
	
	// get human readable work string
	var showAutoScoreResult = true;
	var readableStudentWork = assessmentListState.getStudentWorkString(showAutoScoreResult);
	$('#' + divId).html(readableStudentWork);
};

/**
 * Override of Node.overridesIsCompleted
 * Specifies whether the node overrides Node.isCompleted
 */
AssessmentListNode.prototype.overridesIsCompleted = function() {
	return true;
};

/**
 * Override of Node.isCompleted
 * Get whether the step is completed or not
 * @return a boolean value whether the step is completed or not
 */
AssessmentListNode.prototype.isCompleted = function() {
	var nodeVisitsForThisNode = this.view.state.getNodeVisitsByNodeId(this.id);
	if (nodeVisitsForThisNode != null) {
		for (var i=0; i < nodeVisitsForThisNode.length; i++) {
			var nodeVisitForThisNode = nodeVisitsForThisNode[i];
			if (nodeVisitForThisNode.nodeStates != null) {
				for (var k=0;k<nodeVisitForThisNode.nodeStates.length;k++) {
					var nodeState = nodeVisitForThisNode.nodeStates[k];
					if (nodeState.isSubmit || nodeState.submit) {
						return true;
					}
				}
			}
		}
	}
	return false;
};

/**
 * Returns the prompt for this node by loading the content and then
 * obtaining it from the object
 * @return the prompt for this node
 */
AssessmentListNode.prototype.getPrompt = function() {
	//get the content for the node
	var contentJSON = this.content.getContentJSON();

	var prompt = null;
	
	//see if the node content has an assessmentItem
	if(contentJSON.prompt != null) {
		//obtain the prompt
		prompt = contentJSON.prompt + "<br/>";	
	}
	// add the prompts from each part
	for (var i=0; i < contentJSON.assessments.length; i++) {
		var assessment = contentJSON.assessments[i];
		prompt += "Part " + (i+1) + ": " + assessment.prompt;
		// if radio assessment, also show choices
		if (assessment.type == "radio") {
			prompt += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;Choices:<br/>";
				for (var x=0; x<assessment.choices.length; x++) {
					prompt += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + assessment.choices[x].text;
					if (x != (assessment.choices.length - 1)) {
						prompt += "<br/>";
					}
				}
		}
		prompt += "<br/>";
	}
				
	//return the prompt
	return prompt;
};

/**
 * Adds a new constraint for this assessment list if the content specifies that
 * student must complete work before exiting to another step
 */
AssessmentListNode.prototype.addConstraints = function() {
	if(this.content.getContentJSON().isMustCompleteAllPartsBeforeExit){
		/* author specified that student must complete work before going to any other step, so create a constraint */
		this.view.eventManager.fire('addConstraint',{type:'WorkOnXConstraint', x:{id:this.id, mode:'node'}});
	}
};

/**
 * Override of Node.processStateConstraints
 * Checks to see if the work was completed. If it was, then no constraint is needed.
 * If not, then we need to add a constraint.
 */
AssessmentListNode.prototype.processStateConstraints = function() {
	if(this.view.state.getLatestWorkByNodeId(this.id) == ''){
		/* no work found */
		this.addConstraints();
	}
};

/**
 * This is called when the node is exited
 * @return
 */
AssessmentListNode.prototype.onExit = function() {
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
			if(this.contentPanel.onExit) {
				try {
					//run the on exit cleanup
					this.contentPanel.onExit();					
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
			//setTimeout(function() {thisObj.render(this.ContentPanel)}, 500);
		}
	}	
};

/**
 * Display the work for an assessmentliststate object
 * @param nodeState the node state to display work from
 */
AssessmentListNode.prototype.getHtmlView = function(nodeState) {
	var showAutoScoreResult = false;
	
	var studentWorkSoFar = "";
	var autoScoreTotalScore = 0;   // total auto scored points the student earned
	var autoScoreTotalMaxScore = 0;   // total auto scored points possible
	
	if(nodeState != null) {
		//check if there were any responses
		if(nodeState.assessments) {
			//loop through the array of assessments
			for(var x=0; x<nodeState.assessments.length; x++) {
				if(studentWorkSoFar != "") {
					//separate each response
					studentWorkSoFar += "<br/><br/>";
				}
				
				//add the response to the student work
				studentWorkSoFar += "Part " + (x+1) + ": <br/>";
				var assessment = nodeState.assessments[x];

				if (assessment.type && assessment.response) {
					if (assessment.type == "radio") {
						studentWorkSoFar += assessment.response.text;
						if (assessment.response.autoScoreResult && showAutoScoreResult) {
							// append results from auto score
							var autoScoreResult = assessment.response.autoScoreResult;
							studentWorkSoFar += "<br/>Auto Score Results:<br/>";
							if (autoScoreResult.isCorrect) {
								studentWorkSoFar += "Student got this question CORRECT";
							} else {
								studentWorkSoFar += "Student got this question INCORRECT";							
							}
							var studentScore = autoScoreResult.choiceScore ? autoScoreResult.choiceScore : 0;
							var maxScore = autoScoreResult.maxScore ? autoScoreResult.maxScore : 0;
							studentWorkSoFar += " and received ";
							studentWorkSoFar += studentScore;
							studentWorkSoFar += " points out of ";
							studentWorkSoFar += maxScore;
							
							// update total scores
							autoScoreTotalScore += studentScore;
							autoScoreTotalMaxScore += maxScore;
						}
					} else if (assessment.type == "text") {
						studentWorkSoFar += assessment.response.text;
					}
				}
			}
		}
		
		// append autoScore result summary at the end, if request
		if (showAutoScoreResult && autoScoreTotalMaxScore > 0) {
			studentWorkSoFar += "<br/><br/>";
			studentWorkSoFar += "Auto Score Results Summary: ";
			studentWorkSoFar += "Student got " + autoScoreTotalScore + " points out of " + autoScoreTotalMaxScore;
		}
	}
	
	return studentWorkSoFar;
};

AssessmentListNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/assessmentlist/assessmentlist.html');
};

NodeFactory.addNode('AssessmentListNode', AssessmentListNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/assessmentlist/AssessmentListNode.js');
};