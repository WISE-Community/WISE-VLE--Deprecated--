/**
 * @constructor
 * @param node
 * @param view
 * @returns
 */
function OPENRESPONSE(node, view) {
	this.node = node;
	this.view = view;
	this.content = node.getContent().getContentJSON();
	
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
	
	//check if there is an associated node whose work we might display in this step
	if(this.node.associatedStartNode != null) {
		//get the node id for the associated node that the student will be reviewing work for
		this.associatedStartNodeId = this.node.associatedStartNode;
		
		//get the associated node object
		this.associatedStartNode = this.view.getProject().getNodeById(this.associatedStartNodeId);
		
		if(this.associatedStartNode != null) {
			//get the content for the associated node
			this.associatedStartNodeContent = this.associatedStartNode.getContent().getContentJSON();			
		}
	}
	
	//check if there is an associated node whose work we might display in this step
	if(this.node.associatedAnnotateNode != null) {
		//get the node id for the associated node that the student will be reviewing work for
		this.associatedAnnotateNodeId = this.node.associatedAnnotateNode;
		
		//get the associated node object
		this.associatedAnnotateNode = this.view.getProject().getNodeById(this.associatedAnnotateNodeId);
		
		if(this.associatedAnnotateNode != null) {
			//get the content for the associated node
			this.associatedAnnotateNodeContent = this.associatedAnnotateNode.getContent().getContentJSON();			
		}
	}
	
	//check if this step is being used for a peer review
	if(this.node.peerReview != null) {
		//values to be set after we retrieve the other student work that this student will be reviewing
		this.otherStudentWorkgroupId = null;
		this.otherStudentStepWorkId = null;
		this.otherStudentNodeVisit = null;
		this.showAuthorContent = false;

		//this will store the peer review as an annotation
		this.annotation = null;	
		
		if(this.node.peerReview == 'annotate') {
			this.openPercentageTrigger = this.content.openPercentageTrigger;
			this.openNumberTrigger = this.content.openNumberTrigger;
			this.openLogicTrigger = this.content.openLogicTrigger;
		}
	}
	
	if(this.node.peerReview != null || this.node.teacherReview != null) {
		//tell the node that it is part of a review sequence
		this.node.setIsPartOfReviewSequence();
		
		//get the custom message to display to the student when the step is not open to work on
		this.stepNotOpenCustomMessage = this.content.stepNotOpenCustomMessage;
	}

	//check if this step is locked
	if(this.view != null && this.view.isLatestNodeStateLocked && this.view.isLatestNodeStateLocked(this.node.id)) {
		//set this flag for future look up
		this.locked = true;
		
		//tell the node that the student has completed it
		this.node.setCompleted();
	}
	
	/*
	 * subscribe this open response to listen for the 'getAnnotationsComplete' event.
	 * this is for when we need to retrieve annotations for the teacher review
	 */
	eventManager.subscribe('getAnnotationsComplete', this.getAnnotationsComplete, this);
};

/**
 * Check if this step needs to be locked by looking at the states
 * and seeing if any of them contain a state with the locked
 * attribute set to true which means the student has previously
 * saved and locked their answer.
 * @return whether the step is locked or not
 */
OPENRESPONSE.prototype.isLocked = function() {
	//loop through all the states
	for(var x=0; x<this.states.length; x++) {
		//get a state
		var state = this.states[x];
		
		//check if the locked attribute is set to true
		if(state.locked) {
			return true;
		}
	}
	
	return false;
};

/**
 * Retrieve the response from the responseBox
 * @return the answer the student wrote in the responseBox
 */
OPENRESPONSE.prototype.getResponse = function() {
	var response = null;
	
	if(this.richTextEditor){
		response = this.richTextEditor.getContent();
	} else {
		response = document.getElementById('responseBox').value;
	}
	
	return response;
};

/**
 * Saves current state of the OpenResponse item
 * - what the students typed
 * - timestamp
 * 
 * Then disable the textarea and save button and show the edit button
 */
OPENRESPONSE.prototype.save = function(saveAndLock,checkAnswer) {
	/*
	 * check if the save button is available. if it is available
	 * it means the student has modified the response. if it
	 * is not available, it means the student has not made any
	 * changes so we do not to do anything.
	 */
	if (this.isSaveAvailable() || this.isSaveAndLockAvailable() || this.isCheckAnswerAvailable()) {
		var response = "";
		
		/* set html to textarea if richtexteditor exists */
		response = this.getResponse();
		
		//check if the student changed their response
		if(this.isResponseChanged() || saveAndLock || checkAnswer) {
			//response was changed so we will create a new state and save it
			var orState = new OPENRESPONSESTATE([response]);
			
			//set the cRaterItemId into the node state if this step is a CRater item
			if(this.content.cRater != null && this.content.cRater.cRaterItemId != null
					&& this.content.cRater.cRaterItemId != '') {
				
				if(checkAnswer && !isNaN(parseInt(this.content.cRater.maxCheckAnswers))) {
					/*
					 * the student has clicked check answer and there is a max 
					 * number of check answer submits specified for this step
					 */
					
					//create the message to display to the student to notify them that there are a limited number of check answers
					var numChancesLeft = this.content.cRater.maxCheckAnswers - (parseInt(this.getNumberOfCRaterSubmits()));
					var submitCheckAnswerMessage = 'You have ' + numChancesLeft;
					if (numChancesLeft > 1) {
						submitCheckAnswerMessage += ' chances';
					} else {
						submitCheckAnswerMessage += ' chance';
					}
					submitCheckAnswerMessage += ' to receive feedback on your answer so this should be your best work!\n\n';	
					submitCheckAnswerMessage += 'Are you ready to receive feedback on this answer?';
							
					//popup a confirm dialog
					var submitCheckAnswer = confirm(submitCheckAnswerMessage);
					
					if(!submitCheckAnswer) {
						//the student has cancelled their check answer submit
						return;
					}
				}
				
				orState.cRaterItemId = this.content.cRater.cRaterItemId;
				
				if (checkAnswer || !(this.content.cRater.displayCRaterScoreToStudent || this.content.cRater.displayCRaterFeedbackToStudent)) {
					/*
					 * set the cRaterItemId into the node state if the student has clicked
					 * check answer or if we are not displaying the score or feedback to
					 * the student in which case we always want to CRater submit because
					 * we are not displaying the check answer button to them.
					 */
					orState.isCRaterSubmit = true;
				}
				
				if(!checkAnswer && this.content.cRater != null && 
						(this.content.cRater.displayCRaterScoreToStudent || this.content.cRater.displayCRaterFeedbackToStudent) 
						&& this.content.cRater.maxCheckAnswers != null && !this.isCRaterMaxCheckAnswersUsedUp()) {
					/*
					 * the student has clicked the save button or made changes and is moving to another step
					 * and we are displaying CRater score or feedback immediately to the student
					 * and the student still has check answer submits left so we will display
					 * a popup to remind them to click the check answer button
					 */
					alert("If you are ready to check your answer, click the 'Check Answer' button.");
				}
			}

			var lock = false;

			if(saveAndLock) {
				//display a confirm message to make sure they want to submit and lock
				lock = confirm("You will not be able to make further edits after submitting this response.  Ready to submit?");
				
				//check if they answered yes
				if(lock) {
					if(this.node.peerReview != null && this.node.peerReview == 'start') {
						/*
						 * set the submitPeerReview attribute in the state so the VLEPostData
						 * handles the peer review work correctly
						 */
						orState.submitForPeerReview = true;
					}
					
					//set the locked attribute in the state
					orState.locked = true;
					
					//disable the response box
					this.lockResponseBox();
					
					//disable the save and lock button
					this.setSaveAndLockUnavailable();
					
					//set the lock flag for future lookup
					this.locked = true;
					
					//tell the node that the student has completed the step
					this.node.setCompleted();
					
					if(this.node.peerReview != null) {
						//this is a peer review of a previous step

						if(this.node.peerReview == 'annotate' && !this.showAuthorContent) {
							//send the annotation for the peer review
							this.postAnnotation(response);
						}
					}
				}
			} 

			if(this.node.peerReview == 'revise' || this.node.teacherReview == 'revise') {
				/*
				 * if the node is a peer/teacher review revise step we will set completed
				 * to true because revise steps do not save and lock
				 */
				
				//tell the node that the student has completed it
				this.node.setCompleted();
			}

			//fire the event to push this state to the global view.states object
			eventManager.fire('pushStudentWork', orState);

			//push the state object into this or object's own copy of states
			this.states.push(orState);

			/*
			 * if we want to check answer immediately (e.g. for CRater), post answer immediately, before going to the next step.
			 * if checkAnswer is true and saveAndLock is false, we will run the CRater check answer
			 * if checkAnswer is true and saveAndLock is true and lock is true, we will run the CRater check answer
			 */
			if (checkAnswer && (!saveAndLock || (saveAndLock && lock))) {
				//set the cRaterItemId into the node state if this step is a CRater item
				if(this.content.cRater != null && this.content.cRater.cRaterItemId != null
						&& this.content.cRater.cRaterItemId != '') {
					/*
					 * post the current node visit to the db immediately without waiting
					 * for the student to exit the step.
					 */
					this.node.view.postCurrentNodeVisit();					
				}
				
				if((this.content.cRater != null && this.content.cRater.maxCheckAnswers != null && this.isCRaterMaxCheckAnswersUsedUp()) || this.isLocked()) {
					//student has used up all of their CRater check answer submits so we will disable the check answer button
					this.setCheckAnswerUnavailable();
				} else {
					//the student still has check answer submits available
					this.setCheckAnswerAvailable();
				}
				
				if(this.content.showPreviousWorkThatHasAnnotation && (this.content.cRater.displayCRaterScoreToStudent || this.content.cRater.displayCRaterFeedbackToStudent) && !this.isLocked()) {
					/*
					 * move the current work to the previous work response box
					 * because we want to display the previous work to the student
					 * and have them re-write another response after they
					 * receive the immediate CRater feedback
					 */
					this.showPreviousWorkThatHasAnnotation($('#responseBox').val());
					
					//clear the response box so they will need to write a new response
					$('#responseBox').val('');
				}
			}

		};

		//turn the save button off
		this.setSaveUnavailable();
	}
};

/**
 * Send the response back as an annotation. Used for Peer Review. 
 * @param response
 */
OPENRESPONSE.prototype.postAnnotation = function(response) {
	//obtain the parameters needed to post the annotation
	var runId = this.view.getConfig().getConfigParam('runId');
	var nodeId = this.otherStudentNodeVisit.nodeId;
	var toWorkgroup = this.otherStudentWorkgroupId;
	var fromWorkgroup = this.view.getUserAndClassInfo().getWorkgroupId();
	var type = "comment";
	var value = response;
	var stepWorkId = this.otherStudentStepWorkId;
	var action = "peerReviewAnnotate";
	var periodId = this.view.getUserAndClassInfo().getPeriodId();
	
	//get the url
	var postAnnotationsUrl = this.view.getConfig().getConfigParam('postAnnotationsUrl');
	
	//compile the args into an object for cleanliness
	var postAnnotationsUrlArgs = {runId:runId,
								  nodeId: nodeId,
								  toWorkgroup:toWorkgroup,
								  fromWorkgroup:fromWorkgroup,
								  annotationType:type,
								  value:encodeURIComponent(value),
								  stepWorkId: stepWorkId,
								  action:action,
								  periodId:periodId};
	
	//create the view's annotations object if it does not exist
	if(this.view.annotations == null) {
		this.view.annotations = new Annotations();
	}
	
	//create the annotation locally to keep our local copy up to date
	var annotation = new Annotation(runId, nodeId, toWorkgroup, fromWorkgroup, type, value, stepWorkId);
	
	//add the annotation to the view's annotations
	this.view.annotations.updateOrAddAnnotation(annotation);
	
	//a callback function that does nothing
	var postAnnotationsCallback = function(text, xml, args) {};
	
	//post the annotation to the server
	this.view.connectionManager.request('POST', 1, postAnnotationsUrl, postAnnotationsUrlArgs, postAnnotationsCallback);
};

/**
 * Save the student work and lock the step so the student can't
 * change their answer
 */
OPENRESPONSE.prototype.saveAndLock = function() {
	var doSaveAndLock=true;
	var doCheckAnswer=false;
	this.save(doSaveAndLock,doCheckAnswer);
};

/**
 * Save the student work and lock the step so the student can't
 * change their answer
 */
OPENRESPONSE.prototype.checkAnswer = function() {
	var doSaveAndLock=false;
	var doCheckAnswer=true;
	
	if(this.content.isLockAfterSubmit) {
		doSaveAndLock = true;
	}
	
	this.save(doSaveAndLock,doCheckAnswer);
};


/**
 * The student has modified their response so we will perform
 * whatever we will set the Save button available.
 */
OPENRESPONSE.prototype.responseEdited = function() {
	this.setSaveAvailable();
	
	if(this.content.cRater != null && this.content.cRater.maxCheckAnswers != null && this.isCRaterMaxCheckAnswersUsedUp()) {
		//student has used up all of their CRater check answer submits so we will disable the check answer button
		this.setCheckAnswerUnavailable();
	} else {
		this.setCheckAnswerAvailable();
	}
	
	displayNumberAttempts("This is your", "revision", this.states);
};

/**
 * Turn the save button on so the student can click it
 */
OPENRESPONSE.prototype.setSaveAvailable = function() {
	$('#saveButton').removeAttr('disabled');
};

/**
 * Turn the save button off so the student can't click it.
 * This is used when the data is saved and there is no need
 * to save.
 */
OPENRESPONSE.prototype.setSaveUnavailable = function() {
	$('#saveButton').attr('disabled','disabled');
};

/**
 * Determine whether the save button is available or not.
 * @return true if the save button is available, false is greyed out
 * and is not available
 */
OPENRESPONSE.prototype.isSaveAvailable = function() {
	if($('#saveButton').attr('disabled')=='disabled'){
		return false;
	} else {
		return true;
	}
};

/**
 * Turn the save button on so the student can click it
 */
OPENRESPONSE.prototype.setSaveAndLockAvailable = function() {
	$('#saveAndLockButton').removeAttr('disabled');
};

/**
 * Turn the save button off so the student can't click it.
 * This is used when the data is saved and there is no need
 * to save.
 */
OPENRESPONSE.prototype.setSaveAndLockUnavailable = function() {
	$('#saveAndLockButton').attr('disabled','disabled');
};

/**
 * Determine whether the save button is available or not.
 * @return true if the save button is available, false is greyed out
 * and is not available
 */
OPENRESPONSE.prototype.isSaveAndLockAvailable = function() {
	if($('#saveAndLockButton').attr('disabled')=='disabled'){
		return false;
	} else {
		return true;
	}
};



/**
 * Turn the save button on so the student can click it
 */
OPENRESPONSE.prototype.setCheckAnswerAvailable = function() {
	$('#checkAnswerButton').removeAttr('disabled');
};

/**
 * Turn the save button off so the student can't click it.
 * This is used when the data is saved and there is no need
 * to save.
 */
OPENRESPONSE.prototype.setCheckAnswerUnavailable = function() {
	$('#checkAnswerButton').attr('disabled','disabled');
};

/**
 * Determine whether the save button is available or not.
 * @return true if the save button is available, false is greyed out
 * and is not available
 */
OPENRESPONSE.prototype.isCheckAnswerAvailable = function() {
	if($('#checkAnswerButton').attr('disabled')=='disabled'){
		return false;
	} else {
		return true;
	}
};

/**
 * Determines whether the student has changed their response
 * by comparing the previous state with the current state.
 * @return whether the student changed their response
 */
OPENRESPONSE.prototype.isResponseChanged = function() {
	//obtain the previous state
	var previousState = this.states[this.states.length - 1];
	
	var previousResponse = "";
	
	if(previousState != null) {
		previousResponse = previousState.response;
	}
	
	var currentResponse = this.getResponse();
	
	//check if there were any changes
	if(previousResponse != currentResponse) {
		//there were changes
		return true;
	} else {
		//there were no changes
		return false;
	}
};

/**
 * Hide all the divs in the openresponse.html 
 */
OPENRESPONSE.prototype.hideAll = function() {
	$('#promptDisplayDiv').hide();
	$('#originalPromptDisplayDiv').hide();
	$('#associatedWorkDisplayDiv').hide();
	$('#annotationDisplayDiv').hide();
	$('#starterParent').hide();
	$('#responseDisplayDiv').hide();
	$('#buttonDiv').hide();
};

/**
 * Hide all the divs in the openresponse.html and just display a message
 */
OPENRESPONSE.prototype.onlyDisplayMessage = function(message) {
	//set the node closed because the student can't work on it yet
	this.node.setStepClosed();
	
	//hide all the divs
	this.hideAll();
	
	//display the prompt div
	$('#promptDisplayDiv').show();
	
	//remove the text in this label div
	document.getElementById('promptLabelDiv').innerHTML = '';
	
	//set the prompt div to this message
	document.getElementById('orPromptDiv').innerHTML = message;
};

/**
 * Render this OpenResponse item
 */
OPENRESPONSE.prototype.render = function() {
	var enableStep = true;
	var message = '';
	var workToImport = [];
	
	//process the tag maps if we are not in authoring mode
	if(this.view.authoringMode == null || !this.view.authoringMode) {
		//get the tag map results
		var tagMapResults = this.processTagMaps();
		
		//get the result values
		enableStep = tagMapResults.enableStep;
		message = tagMapResults.message;
		workToImport = tagMapResults.workToImport;
	}
	
	/*
	 * check if this is a peer/teacher review annotation step and it is locked.
	 * a peer/teacher review annotation step becomes locked once the student
	 * submits their annotation.
	 */
	if((this.node.peerReview == 'annotate' || this.node.teacherReview == 'annotate') && 
			this.locked) {
		//disable save buttons
		this.setSaveUnavailable();
		this.setSaveAndLockUnavailable();
		this.setCheckAnswerUnavailable();
		
		//display this message in the step frame
		this.onlyDisplayMessage('<p>You have successfully reviewed the work submitted by <i>Team Anonymous</i>.</p><p>Well done!</p>');

		return;
	}
	

	
	//check if we need to display the save and lock button
	if(this.node.peerReview != null || this.node.teacherReview != null) {
		if(this.node.peerReview == 'start' || this.node.peerReview == 'annotate' ||
				this.node.teacherReview == 'start' || this.node.teacherReview == 'annotate') {
			/*
			 * this is the start step for the peer review where the student
			 * submits their original work or the step where they annotate
			 * another student's work
			 */
			$('#saveAndLockButton').show();
		}
	} else if (this.content.cRater && (this.content.cRater.displayCRaterScoreToStudent || this.content.cRater.displayCRaterFeedbackToStudent)) {
		// if this is a CRater-enabled item and we are displaying the score or feedback to the student, also show the "check" button
		$('#checkAnswerButton').show();
		
		if((this.content.cRater != null && this.content.cRater.maxCheckAnswers != null && this.isCRaterMaxCheckAnswersUsedUp()) || this.isLocked()) {
			//student has used up all of their CRater check answer submits so we will disable the check answer button
			this.setCheckAnswerUnavailable();
		} else {
			//the student still has check answer submits available so we will enable the check answer button
			this.setCheckAnswerAvailable();
		}
	} else if (this.content.isLockAfterSubmit) {
		// this node is set to lock after the student submits the answer. show saveAndLock button
		$('#saveAndLockButton').show();
	}
	
	if(this.view != null && this.view.activeNode != null) {
		//we are in authoring step preview mode so we will just show the regular openresponse display
		this.displayRegular();
		
		//check if we need to display the save and lock button
		if(this.node.peerReview != null || this.node.teacherReview != null) {
			if(this.node.peerReview == 'start' || this.node.peerReview == 'annotate' ||
					this.node.teacherReview == 'start' || this.node.teacherReview == 'annotate') {
				/*
				 * this is the start step for the peer review where the student
				 * submits their original work or the step where they annotate
				 * another student's work
				 */
				$('#saveAndLockButton').show();
			}
			
			/*
			 * display the appropriate divs that the student would see for peer/teacher review
			 */
			if(this.node.peerReview == 'annotate' || this.node.teacherReview == 'annotate') {
				//set more informative labels
				document.getElementById('promptLabelDiv').innerHTML = 'instructions';
				document.getElementById('responseLabelDiv').innerHTML = 'your feedback for <i>Team Anonymous</i>:';
				
				//display the prompt
				document.getElementById('originalPromptTextDiv').innerHTML = '[Prompt from the first peer review step will display here]';
				$('#originalPromptDisplayDiv').show();
				
				/*
				 * display the other student's work or a message saying there is no other student work
				 * available yet
				 */
				document.getElementById('associatedWorkLabelDiv').innerHTML = 'work submitted by <i>Team Anonymous</i>:';		
				document.getElementById('associatedWorkTextDiv').innerHTML = '[Work from a random classmate will display here]';
				$('#associatedWorkDisplayDiv').show();
			} else if(this.node.peerReview == 'revise' || this.node.teacherReview == 'revise') {
				//set more informative labels
				document.getElementById('promptLabelDiv').innerHTML = 'instructions';
				document.getElementById('responseLabelDiv').innerHTML = 'your second draft:';
				
				//set the original prompt text and make it visible
				document.getElementById('originalPromptTextDiv').innerHTML = '[Prompt from the first peer review step will display here]';
				$('#originalPromptDisplayDiv').show();
				
				//set the original work text and make it visible
				document.getElementById('associatedWorkLabelDiv').innerHTML = 'your original response&nbsp;&nbsp;&nbsp;<a id="toggleSwitch" onclick="toggleDetails2()">show/hide text';
				document.getElementById('associatedWorkTextDiv').innerHTML = "[Student's work from first peer review step will display here]";
				$('#associatedWorkDisplayDiv').show();
				
				//hide the original work
				$('#associatedWorkTextDiv').hide();
				
				//display the div that says "text is hidden"
				$('#associatedWorkTextDiv2').show();
				
				//set the annotation text and make it visible
				document.getElementById('annotationLabelDiv').innerHTML = '<i>Team Anonymous</i> has given you the following feedback:';
				document.getElementById('annotationTextDiv').innerHTML = '[Feedback from classmate or teacher will display here]';
				$('#annotationDisplayDiv').show();
			}
		}
		
	} else if(this.associatedStartNode != null) {
		if(this.node.peerReview != null) {
			//this is a peer review of a previous step
			
			if(this.node.peerReview == 'annotate') {
				//this is the step where the student writes comments on their classmates work. retrieve other student work if not in preview
				if (this.view.getConfig().getConfigParam("mode") == "run") {					
					this.retrieveOtherStudentWork();
				}
			} else if(this.node.peerReview == 'revise') {
				/*
				 * this is the step where the student reads the comments from their classmate
				 * and revises their original work
				 */
				if (this.view.getConfig().getConfigParam("mode") == "run") {
					this.retrieveAnnotationAndWork();
				}
			}
		} else if(this.node.teacherReview != null) {
			if(this.node.teacherReview == 'annotate') {
				//this is the step where the student annotates the authored work
				this.displayTeacherWork();
			} else if(this.node.teacherReview == 'revise') {
				/*
				 * this is the step where the student reads comments from their teacher
				 * and revises their work
				 */
				if (this.view.getConfig().getConfigParam("mode") == "run") {
					this.retrieveTeacherReview();
				}
			}
		} else {
			//this is a self review of a previous step
			//implement me later
		}
	} else {
		/*
		 * this is just a regular open response so we will just show
		 * the regular divs and populate them
		 */
		this.displayRegular();
	}

	if(this.content.showPreviousWorkThatHasAnnotation && this.node.type != 'NoteNode') {
		/*
		 * show the previous work that has a teacher comment annotation.
		 * this is not available for note steps.
		 */
		this.showPreviousWorkThatHasAnnotation(null, 'comment');
	}
	
	if(this.content.showPreviousWorkThatHasAnnotation && this.content.cRater &&
			(this.content.cRater.displayCRaterScoreToStudent || this.content.cRater.displayCRaterFeedbackToStudent)) {
		//show the previous work that has a CRater annotation
		this.showPreviousWorkThatHasAnnotation(null, 'cRater');
	}
	
	//import any work if necessary
	this.importWork(workToImport);
	
	if (this.content.isLockAfterSubmit) {
		// this node is set to lock after the student submits the answer. show saveAndLock button
		$("#saveButton").hide();
	}
	
	//check if this step is locked
	if(this.locked) {
		//the step is locked so we will disable the response box and save and lock button
		this.lockResponseBox();
		this.setSaveAndLockUnavailable();
	} else {
		//make the save and lock button clickable
		this.setSaveAndLockAvailable();
	}
};

/**
 * Show the previous work that has had a teacher comment annotation.
 * @param previousResponse an optional argument which is the previous work which
 * we will show without having to look it up
 * @param annotationType an optional argument which is the type of annotation
 */
OPENRESPONSE.prototype.showPreviousWorkThatHasAnnotation = function(previousResponse, annotationType) {
	
	if(previousResponse != null) {
		//display the previous response div
		$('#previousResponseDisplayDiv').show();
		
		//set the student response into the previous response disabled textarea
		$('#previousResponseBox').val(previousResponse);
		
		//clear the response box so the student will have to type a new response
		$('#responseBox').val('');
	} else {
		//get the annotation attributes that we will use to look up the teacher comment annotation
		var runId = this.view.getConfig().getConfigParam('runId');
		var nodeId = this.view.currentNode.id;
		var toWorkgroup = this.view.getUserAndClassInfo().getWorkgroupId();
		var fromWorkgroups = null;
		var type = null;
		var stepWorkId = null;
		
		if(annotationType != null) {
			//use the annotation type that was passed in
			type = annotationType;
		}
		
		if(annotationType == 'cRater') {
			//crater annotations have fromWorkgroup=-1
			fromWorkgroups = [-1];
		} else {
			//get the teacher and shared teacher workgroups
			fromWorkgroups = this.view.getUserAndClassInfo().getAllTeacherWorkgroupIds();
		}
		
		//get the latest annotation for this step with the given parameters
		var latestAnnotation = this.view.annotations.getLatestAnnotation(runId, nodeId, toWorkgroup, fromWorkgroups, type, stepWorkId);
		
		if(latestAnnotation != null) {
			//get the step work id that the annotation was for
			var stepWorkId = latestAnnotation.stepWorkId;
			
			//get the node visit with the step work id
			var annotationNodeVisit = this.view.state.getNodeVisitById(stepWorkId);

			//get the annotation post time
			var annotationPostTime = latestAnnotation.postTime;
			
			//get all the node visits for this step
			var nodeVisitsForNodeId = this.view.state.getNodeVisitsByNodeId(nodeId);
			
			//whether to show the previous work
			var showPreviousResponse = true;
			
			if(nodeVisitsForNodeId != null) {
				
				/*
				 * we will loop through all the node visits and look for any work that
				 * is newer than the annotation. if there is no new work after the
				 * annotation it means the student has not revised their work based
				 * on the annotation so we will display their previous response
				 * in the greyed out previous response box and clear out the
				 * regular response box so that they need to type a new response.
				 */ 
				for(var x=0; x<nodeVisitsForNodeId.length; x++) {
					//get a node visit
					var tempNodeVisit = nodeVisitsForNodeId[x];
					
					if(tempNodeVisit != null) {
						//get the latest node state for the node visit
						var nodeState = tempNodeVisit.getLatestWork();
						
						//get the response from the node state
						var response = this.node.getStudentWorkString(nodeState.response);
						
						if(response != null && response != "") {
							//get the post time for the node visit
							var tempPostTime = tempNodeVisit.visitPostTime;
							
							//get the node state timestamp
							//var nodeStateTimestamp = nodeState.timestamp;
							
							if(tempPostTime > annotationPostTime) {
								/*
								 * the node visit post time is later than the annotation
								 */
								showPreviousResponse = false;
							}
						}
					}
				}				
			}
			
			if(showPreviousResponse) {
				/*
				 * we are going to show the previous response and clear out the response textarea
				 * so that the student needs to write a new response based on the new annotation
				 * they have received
				 */
				
				if(annotationType == 'cRater' && latestAnnotation != null) {
					if(latestAnnotation.value != null && latestAnnotation.value.length > 0) {
						//get the annotation value which contains the student response submitted to CRater
						var latestCRaterValue = latestAnnotation.value[latestAnnotation.value.length - 1];
						
						if(latestCRaterValue != null && latestCRaterValue.studentResponse != null && latestCRaterValue.studentResponse.response != null) {
							//get the student response
							var response = this.node.getStudentWorkString(latestCRaterValue.studentResponse.response);
							
							//display the previous response div
							$('#previousResponseDisplayDiv').show();
							
							//set the student response into the previous response disabled textarea
							$('#previousResponseBox').val(response);
							
							//clear the response box so the student will have to type a new response
							$('#responseBox').val('');
						}
					}
				} else {
					if(annotationNodeVisit != null) {
						//get all the node states in the node visit
						var nodeStates = annotationNodeVisit.nodeStates;
						
						if(nodeStates != null && nodeStates.length != 0) {
							//get the last node state
							var nodeState = nodeStates[nodeStates.length - 1];
							
							if(nodeState != null) {
								//get the student response
								var response = nodeState.response;
								response = this.node.getStudentWorkString(response);
								
								//display the previous response div
								$('#previousResponseDisplayDiv').show();
								
								//set the student response into the previous response disabled textarea
								$('#previousResponseBox').val(response);
								
								//clear the response box so the student will have to type a new response
								$('#responseBox').val('');
							}
						}
					}
				}
			}
		}
	}
};

/**
 * This is when the step is just a regular open response and not
 * a special peer review or teacher review. We will just display
 * the normal divs and populate their values like normal.
 */
OPENRESPONSE.prototype.displayRegular = function() {
	//display the regular divs such as prompt, starter, and response
	this.showDefaultDivs();
	
	//populate the divs
	this.showDefaultValues();
	
	//set the response if there were previous revisions
	this.setResponse();
	
	/* start the rich text editor if specified */
	if(this.content.isRichTextEditorAllowed){
		var context = this;
		var loc = window.location.toString();
		var vleLoc = loc.substring(0, loc.indexOf('/vle/')) + '/vle/';
		
		$('#responseBox').tinymce({
			// Location of TinyMCE script
			script_url : '/vlewrapper/vle/jquery/tinymce/jscripts/tiny_mce/tiny_mce.js',
			
			// General options
			theme : "advanced",
			plugins : "emotions",
			
			// Theme options
			theme_advanced_buttons1: 'bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,emotions,|,forecolor,backcolor,|,formatselect,fontselect,fontsizeselect',
			theme_advanced_buttons2: '',
			theme_advanced_buttons3: '',
			theme_advanced_buttons4: '',
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			relative_urls: false,
			remove_script_host: true,
			document_base_url: vleLoc,
			
			onchange_callback: function(ed){
				/* add change listener */
		        context.responseEdited();
		    },
			setup: function(ed){
				// store editor as prototype variable
				context.richTextEditor = ed;
				
				/* add keyup listener */
		        ed.onKeyUp.add(context.responseEdited, context);
		    }
		});
	}
	
	/*
	 * perform any final tasks after we have finished rendering
	 */
	this.doneRendering();
};

/**
 * This is for displaying the authored work for the student to
 * review.
 */
OPENRESPONSE.prototype.displayTeacherWork = function() {
	//check that the original node is locked
	var isOriginalNodeLocked = this.view.isLatestNodeStateLocked(this.associatedStartNode.id);
	
	if(!isOriginalNodeLocked) {
		//original step is not locked
		
		//display message telling student to go back and submit that original step
		this.onlyDisplayMessage('<p>To start this step you must first submit a response in step <b><a style=\"color:blue\" onclick=\"eventManager.fire(\'renderNode\', [\'' + this.view.getProject().getPositionById(this.associatedStartNode.id) + '\']) \">' + this.view.getProject().getStepNumberAndTitle(this.associatedStartNode.id) + '</a></b> (link).</p>');
	} else {
		//original step is locked
		
		//get the authored work
		var teacherWorkText = this.content.authoredWork;
		
		//replace \n with <br>
		teacherWorkText = this.replaceSlashNWithBR(teacherWorkText);
		
		//show regular divs such as prompt, starter, and response and populate them
		this.showDefaultDivs();
		this.showDefaultValues();

		//set more informative labels
		document.getElementById('promptLabelDiv').innerHTML = 'instructions';
		document.getElementById('responseLabelDiv').innerHTML = 'your feedback for <i>Team Anonymous</i>:';
		
		//display the original prompt
		document.getElementById('originalPromptTextDiv').innerHTML = this.associatedStartNode.getPeerReviewPrompt();
		$('#originalPromptDisplayDiv').show();
		
		//display the authored work for the student to review
		document.getElementById('associatedWorkLabelDiv').innerHTML = 'work submitted by <i>Team Anonymous</i>:' ;		
		document.getElementById('associatedWorkTextDiv').innerHTML = teacherWorkText;
		$('#associatedWorkDisplayDiv').show();
		
		//set the response if there were previous revisions
		this.setResponse();
	}
	
	/*
	 * perform any final tasks after we have finished retrieving
	 * any other work and have displayed it to the student
	 */
	this.doneRendering();
};

/**
 * Called after annotations are received so that we can then obtain
 * the teacher annotation and display it to the student
 * @param type
 * @param args
 * @param obj
 */
OPENRESPONSE.prototype.getAnnotationsComplete = function(type,args,obj) {
	if(args[0] == obj.node.id) {
		obj.displayTeacherReview();
	}
};

/**
 * This is for displaying the teacher annotation to the student so the student
 * can revise their work.
 */
OPENRESPONSE.prototype.displayTeacherReview = function() {
	//check if the original node and the annotate node is locked
	var isOriginalNodeLocked = this.view.isLatestNodeStateLocked(this.associatedStartNode.id);
	var isAnnotateNodeLocked = this.view.isLatestNodeStateLocked(this.associatedAnnotateNode.id);
	
	var startNodeTitle = "";
	if(this.associatedStartNode != null) {
		//get the step number and node title for the start node
		startNodeTitle = this.view.getProject().getStepNumberAndTitle(this.associatedStartNode.id);
	}
	
	var annotateNodeTitle = "";
	if(this.associatedAnnotateNode != null) {
		//get the step number and node title for the annotate node
		annotateNodeTitle = this.view.getProject().getStepNumberAndTitle(this.associatedAnnotateNode.id);
	}
	
	if(!isOriginalNodeLocked) {
		//student still needs to submit work for the original step before they can work on this step
		this.onlyDisplayMessage('<p>To start this step you must first submit a response in step <b><a style=\"color:blue\" onclick=\"eventManager.fire(\'renderNode\', [\'' + this.view.getProject().getPositionById(this.associatedStartNode.id) + '\']) \">' + startNodeTitle + '</a></b> (link).</p>');
	} else if(!isAnnotateNodeLocked){
		//student still needs to submit work for the annotate step before they can work on this step
		this.onlyDisplayMessage('<p>To start this step you must first submit a response in step <a style=\"color:blue\" onclick=\"eventManager.fire(\'renderNode\', [\'' + this.view.getProject().getPositionById(this.associatedAnnotateNode.id) + '\']) \">' + annotateNodeTitle + '</a></b> (link).</p>');
	} else {
		/*
		 * student has submitted work for original and annotate step
		 * so we can now try to get the teacher annotation for their work
		 */
		
		var latestCommentAnnotationForStep = '';
		
		if(this.view.annotations != null) {
			//get the latest comment annotation for the original step
			var latestCommentAnnotationForStep = this.view.annotations.getLatestAnnotation(
					this.view.getConfig().getConfigParam('runId'),
					this.associatedStartNode.id,
					this.view.getUserAndClassInfo().getWorkgroupId(),
					this.view.getUserAndClassInfo().getAllTeacherWorkgroupIds(),
					'comment'
					);
			
			//check if there was an annotation
			if(latestCommentAnnotationForStep == null) {
				/*
				 * teacher has not given an annotation to the student's work so
				 * they can't work on this step yet
				 */
				this.onlyDisplayMessage('<p>Your teacher has not yet reviewed the response you submitted in step <b>"' + startNodeTitle + '"</b> yet.</p><p>Please return to this step again later.</p>');
				
				/*
				 * perform any final tasks after we have finished retrieving
				 * any other work and have displayed it to the student
				 */
				this.doneRendering();
				
				return;
			} else {
				//teacher has written an annotation so this student can work on this step
				latestCommentAnnotationForStep = this.replaceSlashNWithBR(latestCommentAnnotationForStep.value);
			}
		}
		
		//get the latest node state for the original step
		var associatedOriginalLatestNodeState = this.view.getLatestStateForNode(this.associatedStartNode.id);
		
		//get the text written for the latest node state for the original step
		var latestWorkForassociatedStartNode = associatedOriginalLatestNodeState.response;
		
		//replace \n with <br>
		var latestWorkForassociatedStartNodeHtml = this.replaceSlashNWithBR(latestWorkForassociatedStartNode);
		
		//show regular divs such as prompt, starter, and response and populate them
		this.showDefaultDivs();
		this.showDefaultValues();
		
		//set more informative labels
		document.getElementById('promptLabelDiv').innerHTML = 'instructions';
		document.getElementById('responseLabelDiv').innerHTML = 'your second draft:';
		
		//set the original prompt text and make it visible
		document.getElementById('originalPromptTextDiv').innerHTML = this.associatedStartNodeContent.assessmentItem.interaction.prompt;
		$('#originalPromptDisplayDiv').show();
		
		//set the original work text and make it visible
		document.getElementById('associatedWorkLabelDiv').innerHTML = 'your first response to the question&nbsp;&nbsp;<a id="toggleSwitch" onclick="toggleDetails2()">show/hide text';
		document.getElementById('associatedWorkTextDiv').innerHTML = latestWorkForassociatedStartNodeHtml;
		$('#associatedWorkDisplayDiv').show();
		
		//hide the original work
		$('#associatedWorkTextDiv').hide();
		
		//display the div that says "text is hidden"
		$('#associatedWorkTextDiv2').show();
		
		//set the teacher annotation text and make it visible
		document.getElementById('annotationLabelDiv').innerHTML = 'teacher feedback';
		document.getElementById('annotationTextDiv').innerHTML = latestCommentAnnotationForStep;
		$('#annotationDisplayDiv').show();
		
		/* set value of text area base on previous work, if any */
		if (this.states!=null && this.states.length > 0) {
			//set their previous revision to when they last worked on this step
			document.getElementById('responseBox').value = this.states[this.states.length - 1].response;
			this.setSaveUnavailable();
			displayNumberAttempts("This is your", "revision", this.states);
			
			//tell the node that the student has completed it
			this.node.setCompleted();
		} else {
			document.getElementById("numberAttemptsDiv").innerHTML = "This is your first revision.";
			
			if(latestWorkForassociatedStartNode != null && latestWorkForassociatedStartNode != '') {
				//set the latest work from the original step in the responseBox so the student can revise it
				document.getElementById('responseBox').value = latestWorkForassociatedStartNode;
			}
		};
	}
	
	/*
	 * perform any final tasks after we have finished retrieving
	 * any other work and have displayed it to the student
	 */
	this.doneRendering();
};

/**
 * Retrieves annotations if necessary and then displays the teacher review
 * to the student for them to revise their work.
 */
OPENRESPONSE.prototype.retrieveTeacherReview = function() {
	if(this.view.annotations == null) {
		/*
		 * retrieve the annotations. this OPENRESPONSE is subscribed to listen
		 * for getAnnotationsComplete and when that event is fired it will
		 * call getAnnotationsComplete() which calls displayTeacherReview()
		 */
		this.view.getAnnotations(this.node.id);
	} else {
		//display the teacher review to the student
		this.displayTeacherReview();
	}
};

/**
 * Make the request to retrieve the other student work
 */
OPENRESPONSE.prototype.retrieveOtherStudentWork = function() {
	//get the url
	var getPeerReviewUrl = this.view.getConfig().getConfigParam('getPeerReviewUrl');
	
	//get the parameters to retrieve the other student work
	var action = "studentRequest";
	var runId = this.view.getConfig().getConfigParam('runId');
	var workgroupId = this.view.getUserAndClassInfo().getWorkgroupId();
	var periodId = this.view.getUserAndClassInfo().getPeriodId();
	var nodeId = this.associatedStartNodeId;
	var openPercentageTrigger = this.openPercentageTrigger;
	var openNumberTrigger = this.openNumberTrigger;
	var openLogicTrigger = this.openLogicTrigger;
	var peerReviewAction = "annotate";
	var classmateWorkgroupIds = this.view.getUserAndClassInfo().getWorkgroupIdsInClass().toString();
	
	//compile the parameters into an object for cleanliness
	var getPeerReviewUrlArgs = {
			action:action,
			runId:runId,
			workgroupId:workgroupId,
			periodId:periodId,
			nodeId:nodeId,
			openPercentageTrigger:openPercentageTrigger,
			openNumberTrigger:openNumberTrigger,
			openLogicTrigger:openLogicTrigger,
			peerReviewAction:peerReviewAction,
			classmateWorkgroupIds:classmateWorkgroupIds
	};
	
	//make the request
	this.view.connectionManager.request('GET', 1, getPeerReviewUrl, getPeerReviewUrlArgs, this.retrieveOtherStudentWorkCallback, [this]);
};

/**
 * Parses the other student work response and then renders everything in the vle.
 * Everything includes, the prompt for the associated node, the other student work,
 * and the text box for this current to write their peer review.
 * @param text a JSON string containing a NodeVisit from the other student
 * @param xml
 * @param args contains the PEERREVIEWANNOTATE object so we can have access to it
 */
OPENRESPONSE.prototype.retrieveOtherStudentWorkCallback = function(text, xml, args) {
	//get the or object
	var thisOr = args[0];
	
	//clear this variable to make sure we don't use old data
	thisOr.otherStudentNodeVisit = null;
	
	//check if there was any text response
	if(text != null && text != "") {
		//there was text returned so we will parse it, the text should be a NodeVisit in JSON form
		var peerWorkToReview = $.parseJSON(text);
		
		var peerWorkText = "";
		
		var startNodeTitle = "";
		if(thisOr.associatedStartNode != null) {
			//get the step number and node title for the start node
			startNodeTitle = thisOr.view.getProject().getStepNumberAndTitle(thisOr.associatedStartNode.id);
		}
		
		//handle error cases
		if(peerWorkToReview.error) {
			if(peerWorkToReview.error == 'peerReviewUserHasNotSubmittedOwnWork') {
				//the user has not submitted work for the original step
				thisOr.onlyDisplayMessage('<p>To start this step you must first submit a response in step <b><a style=\"color:blue\" onclick=\"eventManager.fire(\'renderNode\', [\'' + thisOr.view.getProject().getPositionById(thisOr.associatedStartNode.id) + '\']) \">' + startNodeTitle + '</a></b> (link).</p>');
			} else if(peerWorkToReview.error == 'peerReviewNotAbleToAssignWork' || peerWorkToReview.error == 'peerReviewNotOpen') {
				/*
				 * server was unable to assign student any work to review, most likely because there was no available work to assign
				 * or
				 * the peer review has not opened yet
				 */
				
				if(thisOr.stepNotOpenCustomMessage != null && thisOr.stepNotOpenCustomMessage != "") {
					//use the custom authored message
					thisOr.onlyDisplayMessage(thisOr.stepNotOpenCustomMessage.replace(/associatedStartNode.title/g, startNodeTitle));
				} else {
					//use the default message
					thisOr.onlyDisplayMessage('<p>This step is not available yet.</p></p><p>More of your peers need to submit a response for step <b>"' + startNodeTitle + '"</b>. <br/>You will then be assigned a response to review.</p><p>Please return to this step again in a few minutes.</p>');	
				}
			}
			
			//check if we should show the authored work
			if(peerWorkToReview.error == 'peerReviewShowAuthoredWork') {
				//show the authored work for the student to review
				peerWorkText = thisOr.content.authoredWork;
				thisOr.showAuthorContent = true;
			} else {
				return;
			}
		} else {
			//set the variables for the other student
			thisOr.otherStudentWorkgroupId = peerWorkToReview.workgroupId;
			thisOr.otherStudentStepWorkId = peerWorkToReview.stepWorkId;
			thisOr.otherStudentNodeVisit = peerWorkToReview.nodeVisit;
			
			peerWorkText = thisOr.associatedStartNode.getPeerReviewOtherStudentWork(thisOr.otherStudentNodeVisit);
		}
		
		//reaplce \n with <br>
		peerWorkText = thisOr.replaceSlashNWithBR(peerWorkText);
		
		//show regular divs such as prompt, starter, and response and populate them
		thisOr.showDefaultDivs();
		thisOr.showDefaultValues();
		
		//set more informative labels
		document.getElementById('promptLabelDiv').innerHTML = 'instructions';
		document.getElementById('responseLabelDiv').innerHTML = 'your feedback for <i>Team Anonymous</i>:';
		
		//display the prompt
		document.getElementById('originalPromptTextDiv').innerHTML = thisOr.associatedStartNode.getPeerReviewPrompt();
		$('#originalPromptDisplayDiv').show();
		
		/*
		 * display the other student's work or a message saying there is no other student work
		 * available yet
		 */
		document.getElementById('associatedWorkLabelDiv').innerHTML = 'work submitted by <i>Team Anonymous</i>:';		
		document.getElementById('associatedWorkTextDiv').innerHTML = peerWorkText;
		$('#associatedWorkDisplayDiv').show();
		
		//set the response if there were previous revisions 
		thisOr.setResponse();
	}
	
	/*
	 * perform any final tasks after we have finished retrieving
	 * any other work and have displayed it to the student
	 */
	thisOr.doneRendering();
};

/**
 * Retrieve the annotation and work for the peer review revise step.
 */
OPENRESPONSE.prototype.retrieveAnnotationAndWork = function() {
	//get the url
	var getPeerReviewUrl = this.view.getConfig().getConfigParam('getPeerReviewUrl');
	
	//get the parameters
	var action = "studentRequest";
	var runId = this.view.getConfig().getConfigParam('runId');
	var workgroupId = this.view.getUserAndClassInfo().getWorkgroupId();
	var periodId = this.view.getUserAndClassInfo().getPeriodId();
	var nodeId = this.associatedStartNodeId;
	var peerReviewAction = "revise";
	var classmateWorkgroupIds = this.view.getUserAndClassInfo().getWorkgroupIdsInClass().toString();
	
	//compile the parameters into an object for cleanliness
	var getPeerReviewUrlArgs = {
			action:action,
			runId:runId,
			workgroupId:workgroupId,
			periodId:periodId,
			nodeId:nodeId,
			peerReviewAction:peerReviewAction,
			classmateWorkgroupIds:classmateWorkgroupIds
	};
	
	//make the request
	this.view.connectionManager.request('GET', 1, getPeerReviewUrl, getPeerReviewUrlArgs, this.retrieveAnnotationAndWorkCallback, [this]);
};

/**
 * Parses the annotation and work and display it.
 * @param text
 * @param xml
 * @param args
 */
OPENRESPONSE.prototype.retrieveAnnotationAndWorkCallback = function(text, xml, args) {
	//get the or object
	var thisOr = args[0];
	
	if(text != null && text != "") {
		//parse the JSON object that contains the annotation and work
		var annotationAndWork = $.parseJSON(text);
		
		var annotationText = "";
		
		var startNodeTitle = "";
		if(thisOr.associatedStartNode != null) {
			//get the step number and node title for the start node
			startNodeTitle = thisOr.view.getProject().getStepNumberAndTitle(thisOr.associatedStartNode.id);
		}
		
		var annotateNodeTitle = "";
		if(thisOr.associatedAnnotateNode != null) {
			//get the step number and node title for the annotate node
			annotateNodeTitle = thisOr.view.getProject().getStepNumberAndTitle(thisOr.associatedAnnotateNode.id);
		}
		
		//handle error cases
		if(annotationAndWork.error) {
			if(annotationAndWork.error == 'peerReviewUserHasNotSubmittedOwnWork') {
				//the user has not submitted work for the original step
				thisOr.onlyDisplayMessage('<p>To start this step you must first submit a response in step <b><a style=\"color:blue\" onclick=\"eventManager.fire(\'renderNode\', [\'' + thisOr.view.getProject().getPositionById(thisOr.associatedStartNode.id) + '\']) \">' + startNodeTitle + '</a></b> (link).</p>');
			} else if(annotationAndWork.error == 'peerReviewUserHasNotBeenAssignedToClassmateWork') {
				//user has not been assigned to any classmate work yet, most likely because there is no available work to assign
				thisOr.onlyDisplayMessage('<p>This step is not available yet.</p></p><p>More of your peers need to submit a response for step <b>"' + startNodeTitle + '"</b>. <br/>You will then be assigned a response to review.</p><p>Please return to step "' + annotateNodeTitle + '" in a few minutes.</p>');
			} else if(annotationAndWork.error == 'peerReviewUserHasNotAnnotatedClassmateWork') {
				//the user has not reviewed the assigned classmate work yet
				thisOr.onlyDisplayMessage('<p>To start this step you must first submit a response in step <a style=\"color:blue\" onclick=\"eventManager.fire(\'renderNode\', [\'' + thisOr.view.getProject().getPositionById(thisOr.associatedAnnotateNode.id) + '\']) \">' + annotateNodeTitle + '</a></b> (link).</p>');
			} else if(annotationAndWork.error == 'peerReviewUserWorkHasNotBeenAssignedToClassmate' || annotationAndWork.error == 'peerReviewUserWorkHasNotBeenAnnotatedByClassmate') {
				/*
				 * the user's work has not been assigned to a classmate yet
				 * or
				 * the user's classmate has not reviewed the user's work yet
				 */
				
				if(thisOr.stepNotOpenCustomMessage != null && thisOr.stepNotOpenCustomMessage != "") {
					//use the custom authored message
					thisOr.onlyDisplayMessage(thisOr.stepNotOpenCustomMessage.replace(/associatedStartNode.title/g, startNodeTitle).replace(/associatedAnnotateNode.title/g, annotateNodeTitle));
				} else {
					//use the default message
					thisOr.onlyDisplayMessage('<p>This step is not available yet.</p><p>Your response in step <b>"' + startNodeTitle + '"</b> has not been reviewed by a peer yet.</p><p>More of your peers need to submit a response for step <b>"' + annotateNodeTitle + '"</b>.</p><p>Please return to this step in a few minutes.</p>');
				}
			}
			
			//check if we should show the authored review
			if(annotationAndWork.error == 'peerReviewShowAuthoredReview') {
				//check if the student has performed the review of the author work
				
				//obtain the work for the associated annotate node
				var associatedAnnotateNodeWork = thisOr.view.getStudentWorkForNodeId(thisOr.associatedAnnotateNode.id);

				/*
				 * if the latest work for the reviewing step is locked, it means the student
				 * has submitted the review for the author and they can go on to this
				 * step where they receive the author review and revise their own work
				 */
				if(thisOr.view.isLatestNodeStateLocked(thisOr.associatedAnnotateNode.id)) {
					//show the authored review
					annotationText = thisOr.content.authoredReview;
				} else {
					//the user has not reviewed the authored work yet
					thisOr.onlyDisplayMessage('<p>To start this step you must first submit a response in step <a style=\"color:blue\" onclick=\"eventManager.fire(\'renderNode\', [\'' + thisOr.view.getProject().getPositionById(thisOr.associatedAnnotateNode.id) + '\']) \">' + annotateNodeTitle + '</a>.</p>');
					return;
				}
			} else {
				return;
			}
		} else {
			//there was no error so we will get the annotation
			var annotation = annotationAndWork.annotation;
			annotationText = annotation.value;
		}
		
		//replace \n with <br>
		annotationText = thisOr.replaceSlashNWithBR(annotationText);
		
		//get the node visit
		var nodeVisit = NODE_VISIT.prototype.parseDataJSONObj(annotationAndWork.nodeVisit, thisOr.view);
		
		//get the latest state from the node visit
		var latestWork = nodeVisit.getLatestWork();
		var latestWorkText = "";
		var latestWorkHtml = "";
		
		if(latestWork != null) {
			//get the response string the student wrote
			latestWorkText = thisOr.node.getStudentWorkString(latestWork.response);
			
			//replace \n with <br>
			latestWorkHtml = thisOr.replaceSlashNWithBR(latestWorkText);			
		}
		
		//show regular divs such as prompt, starter, and response and populate them
		thisOr.showDefaultDivs();
		thisOr.showDefaultValues();
		
		//set more informative labels
		document.getElementById('promptLabelDiv').innerHTML = 'instructions';
		document.getElementById('responseLabelDiv').innerHTML = 'your second draft:';
		
		//set the original prompt text and make it visible
		document.getElementById('originalPromptTextDiv').innerHTML = thisOr.associatedStartNodeContent.assessmentItem.interaction.prompt;
		$('#originalPromptDisplayDiv').show();
		
		//set the original work text and make it visible
		document.getElementById('associatedWorkLabelDiv').innerHTML = 'your original response&nbsp;&nbsp;&nbsp;<a id="toggleSwitch" onclick="toggleDetails2()">show/hide text';
		document.getElementById('associatedWorkTextDiv').innerHTML = latestWorkHtml;
		$('#associatedWorkDisplayDiv').show();
		
		//hide the original work
		$('#associatedWorkTextDiv').hide();
		
		//display the div that says "text is hidden"
		$('#associatedWorkTextDiv2').show();
		
		//set the annotation text and make it visible
		document.getElementById('annotationLabelDiv').innerHTML = '<i>Team Anonymous</i> has given you the following feedback:';
		document.getElementById('annotationTextDiv').innerHTML = annotationText;
		$('#annotationDisplayDiv').show();
		
		/* set value of text area base on previous work, if any */
		if (thisOr.states!=null && thisOr.states.length > 0) {
			document.getElementById('responseBox').value = thisOr.states[thisOr.states.length - 1].response;
			thisOr.setSaveUnavailable();
			displayNumberAttempts("This is your", "revision", thisOr.states);
			
			//tell the node that the student has completed it
			thisOr.node.setCompleted();
		} else {
			document.getElementById("numberAttemptsDiv").innerHTML = "This is your first revision.";
			
			if(latestWork != null && latestWorkText != null) {
				if(thisOr.richTextEditor != null) {
					thisOr.richTextEditor.setContent(latestWorkText);
				} else {
					//set the latest work in the responseBox
					document.getElementById('responseBox').value = latestWorkText;	
				}
			}
		}
	}
	
	/*
	 * perform any final tasks after we have finished retrieving
	 * any other work and have displayed it to the student
	 */
	thisOr.doneRendering();
};

/**
 * Places the starter sentence, if provided, at the top of the
 * response and appends any of the student's work after it.
 */
OPENRESPONSE.prototype.showStarter = function(){
	if(this.content.starterSentence.display != '0'){

		//get the response box element
		var responseBox = document.getElementById('responseBox');
		
		//update normally if rich text editor is not available
		if(!this.richTextEditor){
			//set the starter sentence appending the students work
			responseBox.value = this.content.starterSentence.sentence + '\n\n' + responseBox.value;
		} else {//otherwise, we need to set it in the editor instance
			this.richTextEditor.setContent(this.content.starterSentence.sentence + '<br/><br/>' + this.richTextEditor.getContent());
		};
	} else {
		this.node.view.notificationManager.notify("There is no starter sentence specified for this step", 3);
	};
};

/**
 * Get the prompt for displaying in a PeerReviewNode
 * @return the prompt for this open response content
 */
OPENRESPONSE.prototype.getPeerReviewPrompt = function() {
	var peerReviewPrompt = "";
	if(this.content != null && this.content.assessmentItem != null) {
		peerReviewPrompt += this.content.assessmentItem.interaction.prompt;	
	}
	return peerReviewPrompt;
};

/**
 * Get the latest student work from the passed in JSON NodeVisit
 * @param otherStudentWorkJSONObj a JSON NodeVisit object
 * @return the latest student work from the passed in JSON NodeVisit
 */
OPENRESPONSE.prototype.getPeerReviewOtherStudentWork = function(otherStudentWorkJSONObj) {
	var peerReviewOtherStudentWork = "";
	
	if(otherStudentWorkJSONObj != null) {
		//get the nodeStates from the NodeVisit
		var nodeStates = otherStudentWorkJSONObj.nodeStates;
		if(nodeStates.length > 0) {
			//get the latest state
			var nodeState = nodeStates[nodeStates.length - 1];
			
			//get the response from the state
			var response = nodeState.response;
			
			peerReviewOtherStudentWork += response;
		}
	} else {
		//display this message if there was no other student work
		peerReviewOtherStudentWork += "<p>Responses from your peers are not available yet.</p><p>Please return to this step later.</p>";
	}
	
	return peerReviewOtherStudentWork;
};

/**
 * Disables the response box
 */
OPENRESPONSE.prototype.lockResponseBox = function() {
	document.getElementById('responseBox').disabled = true;	
};

/**
 * Enables the response box
 */
OPENRESPONSE.prototype.unlockResponseBox = function() {
	document.getElementById('responseBox').disabled = false;	
};

/**
 * Make the default divs visible, these include prompt, starter,
 * response, button, divs
 */
OPENRESPONSE.prototype.showDefaultDivs = function() {
	$('#promptDisplayDiv').show();
	$('#starterParent').show();
	$('#responseDisplayDiv').show();
	$('#buttonDiv').show();
};

/**
 * Set the prompt, starter, and response values
 */
OPENRESPONSE.prototype.showDefaultValues = function() {
	if(this.content.starterSentence.display=='1' || this.content.starterSentence.display=='2'){
		$('#starterParent').show();
	} else {
		$('#starterParent').hide();
	};
	
	/* set html prompt element values */
	document.getElementById('orPromptDiv').innerHTML=this.content.assessmentItem.interaction.prompt;
	document.getElementById('promptLabelDiv').innerHTML = 'question';
	
	/* set text area size: set row based on expectedLines */
	document.getElementById('responseBox').setAttribute('rows', this.content.assessmentItem.interaction.expectedLines);
};

/**
 * Appends response to curently-displayed response
 * @param response String response that will be appended at the end of current response
 * @return
 */
OPENRESPONSE.prototype.appendResponse = function(response) {
	if (!this.content.isRichTextEditorAllowed) {
		document.getElementById('responseBox').value += response;
	} else {		
		var contentBefore = this.richTextEditor.getContent();
		var contentAfter = contentBefore + response;
		this.richTextEditor.setContent(contentAfter);
	};
};

/**
 * Set the reponse into the response box
 */
OPENRESPONSE.prototype.setResponse = function() {
	/* set value of text area base on previous work, if any */
	if (this.states!=null && this.states.length > 0) {
		document.getElementById('responseBox').value = this.states[this.states.length - 1].response;
		this.setSaveUnavailable();
		displayNumberAttempts("This is your", "revision", this.states);
	} else {
		document.getElementById("numberAttemptsDiv").innerHTML = "This is your first revision.";
		document.getElementById('responseBox').value = "";
	 	this.setSaveAvailable();
	 	
		/* set starter sentence html element values */
		if(this.content.starterSentence.display=='2'){
			this.showStarter();
		};
	};
};

/**
 * Replace \n with <br> so that the new lines are displayed to the
 * students
 * @param response an array containing the response string or just
 * the response string
 * @return the response string with all \n replaced with <br>
 */
OPENRESPONSE.prototype.replaceSlashNWithBR = function(response) {
	var responseString = '';
	
	//check if the response is an array
	if(response.constructor.toString().indexOf('Array') != -1) {
		//the response is an array so we will obtain the string that is in it
		responseString = response[0];
	} else {
		//the response is a string
		responseString = response;
	}
	
	//replace \n with <br>
	return responseString.replace(/\n/g, '<br>');
};

/*
 * Perform any final tasks after we are done retrieving and rendering
 * any necessary data to the student.
 */
OPENRESPONSE.prototype.doneRendering = function() {

	//create any constraints if necessary
	eventManager.fire('contentRenderComplete', this.node.id, this.node);
};

/**
 * Determine if the student has used up all their CRater check answer submits
 * @return whether the student has used up all their CRater check answer submits
 */
OPENRESPONSE.prototype.isCRaterMaxCheckAnswersUsedUp = function() {
	var result = false;

	//check if this step is a CRater step and if maxCheckAnswers is set
	if(this.content.cRater != null && this.content.cRater.maxCheckAnswers != null) {
		var maxCheckAnswers = this.content.cRater.maxCheckAnswers;
		
		if(!isNaN(parseInt(maxCheckAnswers))) {
			//maxCheckAnswers is a number
			
			//get the number of times the student made a CRater submit aka check answer
			var numCheckAnswers = this.getNumberOfCRaterSubmits();
			
			if(numCheckAnswers >= maxCheckAnswers) {
				//student has checked answer more than or equal to the max allowed
				result = true;
			}			
		}
	}
	
	return result;
};

OPENRESPONSE.prototype.getNumberOfCRaterSubmits = function() {
	var numCRaterSubmits = 0;
	
	//loop through all the node states for this step
	for(var x=0; x<this.states.length; x++) {
		//get a node state
		var nodeState = this.states[x];
		
		if(nodeState != null) {
			if(nodeState.isCRaterSubmit) {
				//the node state was a CRater submit
				numCRaterSubmits++;
			}
		}
	}
	
	return numCRaterSubmits;
};

/**
 * Process the tag maps and obtain the results
 * @return an object containing the results from processing the
 * tag maps. the object contains three fields
 * enableStep
 * message
 * workToImport
 */
OPENRESPONSE.prototype.processTagMaps = function() {
	var enableStep = true;
	var message = '';
	var workToImport = [];
	
	//the tag maps
	var tagMaps = this.node.tagMaps;
	
	//check if there are any tag maps
	if(tagMaps != null) {
		
		//loop through all the tag maps
		for(var x=0; x<tagMaps.length; x++) {
			
			//get a tag map
			var tagMapObject = tagMaps[x];
			
			if(tagMapObject != null) {
				//get the variables for the tag map
				var tagName = tagMapObject.tagName;
				var functionName = tagMapObject.functionName;
				var functionArgs = tagMapObject.functionArgs;
				
				if(functionName == "importWork") {
					//get the work to import
					workToImport = this.node.getWorkToImport(tagName, functionArgs);
				} else if(functionName == "showPreviousWork") {
					//show the previous work in the previousWorkDiv
					this.node.showPreviousWork($('#previousWorkDiv'), tagName, functionArgs);
				} else if(functionName == "showAggregateWork") {
					//show the previous work in the previousWorkDiv
					this.node.showAggregateWork($('#aggregateWorkDiv'), tagName, functionArgs);
				} else if(functionName == "checkCompleted") {
					//we will check that all the steps that are tagged have been completed
					
					//get the result of the check
					var result = this.node.checkCompleted(tagName, functionArgs);
					enableStep = enableStep && result.pass;
					
					if(message == '') {
						message += result.message;
					} else {
						//message is not an empty string so we will add a new line for formatting
						message += '<br>' + result.message;
					}
				}
			}
		}
	}
	
	//put the variables in an object so we can return multiple variables
	var returnObject = {
		enableStep:enableStep,
		message:message,
		workToImport:workToImport
	};
	
	return returnObject;
};

/**
 * Import work if necessary
 * @param workToImport an array of node states to import into this step
 */
OPENRESPONSE.prototype.importWork = function(workToImport) {
	if(workToImport != null && workToImport != "" && workToImport.length != 0) {
		var currentResponse = $('#responseBox').val();
		
		//check if the response box is empty
		if(currentResponse == '') {
			//the response box is empty so we will import the previous work
			var response = '';
			
			for(var x=0; x<workToImport.length; x++) {
				//get one of the work
				var nodeState = workToImport[x];
				
				if(nodeState != null) {
					var type = nodeState.constructor.name;
					if(type == 'OPENRESPONSESTATE') {
						if(response != '') {
							//separate work with a blank line
							response += '\n\n';
						}
						
						//append the response
						response += nodeState.response;
					}
				}
			}
			
			//set the imported work into the response box
			$('#responseBox').val(response);
		}
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/openresponse/openresponse.js');
}