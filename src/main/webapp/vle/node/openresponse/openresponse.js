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
OPENRESPONSE.prototype.save = function(saveAndLock) {
	/*
	 * check if the save button is available. if it is available
	 * it means the student has modified the response. if it
	 * is not available, it means the student has not made any
	 * changes so we do not to do anything.
	 */
	if (this.isSaveAvailable() || this.isSaveAndLockAvailable()) {
		var response = "";
		
		/* set html to textarea if richtexteditor exists */
		response = this.getResponse();
		
		//check if the student changed their response
		if(this.isResponseChanged() || saveAndLock) {
			//response was changed so we will create a new state and save it
			var orState = new OPENRESPONSESTATE([response]);
			
			//set the cRaterItemId into the node state if this step is a CRater item
			if(this.content.cRater != null && this.content.cRater.cRaterItemId != null) {
				orState.cRaterItemId = this.content.cRater.cRaterItemId;
			}

			if(saveAndLock) {
				//display a confirm message to make sure they want to submit and lock
				var lock = confirm("You will not be able to make further edits after submitting this response.  Ready to submit?");
				
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
	this.save(true);
};

/**
 * The student has modified their response so we will perform
 * whatever we will set the Save button available.
 */
OPENRESPONSE.prototype.responseEdited = function() {
	this.setSaveAvailable();
	displayNumberAttempts("This is your", "revision", this.states);
};

/**
 * Turn the save button on so the student can click it
 */
OPENRESPONSE.prototype.setSaveAvailable = function() {
	//removeClassFromElement("saveButton", "ui-state-disabled");
	$('#saveButton').parent().removeClass('ui-state-disabled');
};

/**
 * Turn the save button off so the student can't click it.
 * This is used when the data is saved and there is no need
 * to save.
 */
OPENRESPONSE.prototype.setSaveUnavailable = function() {
	//addClassToElement("saveButton", "ui-state-disabled");
	$('#saveButton').parent().addClass('ui-state-disabled');
};

/**
 * Determine whether the save button is available or not.
 * @return true if the save button is available, false is greyed out
 * and is not available
 */
OPENRESPONSE.prototype.isSaveAvailable = function() {
	//return !hasClass("saveButton", "ui-state-disabled");
	return !$('#saveButton').parent().hasClass('ui-state-disabled');
};

/**
 * Turn the save button on so the student can click it
 */
OPENRESPONSE.prototype.setSaveAndLockAvailable = function() {
	//removeClassFromElement("saveAndLockButton", "ui-state-disabled");
	$('#saveAndLockButton').parent().removeClass('ui-state-disabled');
};

/**
 * Turn the save button off so the student can't click it.
 * This is used when the data is saved and there is no need
 * to save.
 */
OPENRESPONSE.prototype.setSaveAndLockUnavailable = function() {
	//addClassToElement("saveAndLockButton", "ui-state-disabled");
	$('#saveAndLockButton').parent().addClass('ui-state-disabled');
};

/**
 * Determine whether the save button is available or not.
 * @return true if the save button is available, false is greyed out
 * and is not available
 */
OPENRESPONSE.prototype.isSaveAndLockAvailable = function() {
	//return !hasClass("saveAndLockButton", "ui-state-disabled");
	return !$('#saveAndLockButton').parent().hasClass('ui-state-disabled');
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
	document.getElementById('promptDisplayDiv').style.display = 'none';
	document.getElementById('originalPromptDisplayDiv').style.display = 'none';
	document.getElementById('associatedWorkDisplayDiv').style.display = 'none';
	document.getElementById('annotationDisplayDiv').style.display = 'none';
	document.getElementById('starterParent').style.display = 'none';
	document.getElementById('responseDisplayDiv').style.display = 'none';
	document.getElementById('buttonDiv').style.display = 'none';
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
	document.getElementById('promptDisplayDiv').style.display = 'block';
	
	//remove the text in this label div
	document.getElementById('promptLabelDiv').innerHTML = '';
	
	//set the prompt div to this message
	document.getElementById('orPromptDiv').innerHTML = message;
};

/**
 * Render this OpenResponse item
 */
OPENRESPONSE.prototype.render = function() {
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
			document.getElementById('saveAndLockButtonDiv').style.display = 'block';
		}
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
				document.getElementById('saveAndLockButtonDiv').style.display = 'block';
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
				document.getElementById('originalPromptDisplayDiv').style.display = 'block';
				
				/*
				 * display the other student's work or a message saying there is no other student work
				 * available yet
				 */
				document.getElementById('associatedWorkLabelDiv').innerHTML = 'work submitted by <i>Team Anonymous</i>:';		
				document.getElementById('associatedWorkTextDiv').innerHTML = '[Work from a random classmate will display here]';
				document.getElementById('associatedWorkDisplayDiv').style.display = 'block';
			} else if(this.node.peerReview == 'revise' || this.node.teacherReview == 'revise') {
				//set more informative labels
				document.getElementById('promptLabelDiv').innerHTML = 'instructions';
				document.getElementById('responseLabelDiv').innerHTML = 'your second draft:';
				
				//set the original prompt text and make it visible
				document.getElementById('originalPromptTextDiv').innerHTML = '[Prompt from the first peer review step will display here]';
				document.getElementById('originalPromptDisplayDiv').style.display = 'block';
				
				//set the original work text and make it visible
				document.getElementById('associatedWorkLabelDiv').innerHTML = 'your original response&nbsp;&nbsp;&nbsp;<a id="toggleSwitch" onclick="toggleDetails2()">show/hide text';
				document.getElementById('associatedWorkTextDiv').innerHTML = "[Student's work from first peer review step will display here]";
				document.getElementById('associatedWorkDisplayDiv').style.display = 'block';
				
				//hide the original work
				document.getElementById('associatedWorkTextDiv').style.display = 'none';
				
				//display the div that says "text is hidden"
				document.getElementById('associatedWorkTextDiv2').style.display = 'block';
				
				//set the annotation text and make it visible
				document.getElementById('annotationLabelDiv').innerHTML = '<i>Team Anonymous</i> has given you the following feedback:';
				document.getElementById('annotationTextDiv').innerHTML = '[Feedback from classmate or teacher will display here]';
				document.getElementById('annotationDisplayDiv').style.display = 'block';
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
		document.getElementById('originalPromptDisplayDiv').style.display = 'block';
		
		//display the authored work for the student to review
		document.getElementById('associatedWorkLabelDiv').innerHTML = 'work submitted by <i>Team Anonymous</i>:' ;		
		document.getElementById('associatedWorkTextDiv').innerHTML = teacherWorkText;
		document.getElementById('associatedWorkDisplayDiv').style.display = 'block';
		
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
	if(thisOr.associatedStartNode != null) {
		//get the step number and node title for the start node
		startNodeTitle = thisOr.view.getProject().getStepNumberAndTitle(thisOr.associatedStartNode.id);
	}
	
	var annotateNodeTitle = "";
	if(thisOr.associatedAnnotateNode != null) {
		//get the step number and node title for the annotate node
		annotateNodeTitle = thisOr.view.getProject().getStepNumberAndTitle(thisOr.associatedAnnotateNode.id);
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
		document.getElementById('originalPromptDisplayDiv').style.display = 'block';
		
		//set the original work text and make it visible
		document.getElementById('associatedWorkLabelDiv').innerHTML = 'your first response to the question&nbsp;&nbsp;<a id="toggleSwitch" onclick="toggleDetails2()">show/hide text';
		document.getElementById('associatedWorkTextDiv').innerHTML = latestWorkForassociatedStartNodeHtml;
		document.getElementById('associatedWorkDisplayDiv').style.display = 'block';
		
		//hide the original work
		document.getElementById('associatedWorkTextDiv').style.display = 'none';
		
		//display the div that says "text is hidden"
		document.getElementById('associatedWorkTextDiv2').style.display = 'block';
		
		//set the teacher annotation text and make it visible
		document.getElementById('annotationLabelDiv').innerHTML = 'teacher feedback';
		document.getElementById('annotationTextDiv').innerHTML = latestCommentAnnotationForStep;
		document.getElementById('annotationDisplayDiv').style.display = 'block';
		
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
		document.getElementById('originalPromptDisplayDiv').style.display = 'block';
		
		/*
		 * display the other student's work or a message saying there is no other student work
		 * available yet
		 */
		document.getElementById('associatedWorkLabelDiv').innerHTML = 'work submitted by <i>Team Anonymous</i>:';		
		document.getElementById('associatedWorkTextDiv').innerHTML = peerWorkText;
		document.getElementById('associatedWorkDisplayDiv').style.display = 'block';
		
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
		
		//get the latest work from the node visit
		var latestWork = nodeVisit.getLatestWork();
		
		//replace \n with <br>
		var latestWorkHtml = thisOr.replaceSlashNWithBR(latestWork);
		
		//show regular divs such as prompt, starter, and response and populate them
		thisOr.showDefaultDivs();
		thisOr.showDefaultValues();
		
		//set more informative labels
		document.getElementById('promptLabelDiv').innerHTML = 'instructions';
		document.getElementById('responseLabelDiv').innerHTML = 'your second draft:';
		
		//set the original prompt text and make it visible
		document.getElementById('originalPromptTextDiv').innerHTML = thisOr.associatedStartNodeContent.assessmentItem.interaction.prompt;
		document.getElementById('originalPromptDisplayDiv').style.display = 'block';
		
		//set the original work text and make it visible
		document.getElementById('associatedWorkLabelDiv').innerHTML = 'your original response&nbsp;&nbsp;&nbsp;<a id="toggleSwitch" onclick="toggleDetails2()">show/hide text';
		document.getElementById('associatedWorkTextDiv').innerHTML = latestWorkHtml;
		document.getElementById('associatedWorkDisplayDiv').style.display = 'block';
		
		//hide the original work
		document.getElementById('associatedWorkTextDiv').style.display = 'none';
		
		//display the div that says "text is hidden"
		document.getElementById('associatedWorkTextDiv2').style.display = 'block';
		
		//set the annotation text and make it visible
		document.getElementById('annotationLabelDiv').innerHTML = '<i>Team Anonymous</i> has given you the following feedback:';
		document.getElementById('annotationTextDiv').innerHTML = annotationText;
		document.getElementById('annotationDisplayDiv').style.display = 'block';
		
		/* set value of text area base on previous work, if any */
		if (thisOr.states!=null && thisOr.states.length > 0) {
			document.getElementById('responseBox').value = thisOr.states[thisOr.states.length - 1].response;
			thisOr.setSaveUnavailable();
			displayNumberAttempts("This is your", "revision", thisOr.states);
			
			//tell the node that the student has completed it
			thisOr.node.setCompleted();
		} else {
			document.getElementById("numberAttemptsDiv").innerHTML = "This is your first revision.";
			
			if(latestWork != null && latestWork != '') {
				if(thisOr.richTextEditor != null) {
					if(latestWork.constructor.toString().indexOf('Array') != -1) {
						//latestWork is an array so we will use the first element in it
						thisOr.richTextEditor.setContent(latestWork[0]);	
					} else {
						thisOr.richTextEditor.setContent(latestWork);
					}
				} else {
					//set the latest work in the responseBox
					document.getElementById('responseBox').value = latestWork;	
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
	document.getElementById('promptDisplayDiv').style.display = 'block';
	document.getElementById('starterParent').style.display = 'block';
	document.getElementById('responseDisplayDiv').style.display = 'block';
	document.getElementById('buttonDiv').style.display = 'block';
};

/**
 * Set the prompt, starter, and response values
 */
OPENRESPONSE.prototype.showDefaultValues = function() {
	if(this.content.starterSentence.display=='1' || this.content.starterSentence.display=='2'){
		document.getElementById('starterParent').style.display = 'block';
	} else {
		document.getElementById('starterParent').style.display = 'none';
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

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/openresponse/openresponse.js');
}