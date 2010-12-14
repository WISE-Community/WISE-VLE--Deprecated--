
function ASSESSMENTLIST(node) {
	this.node = node;
	this.content = node.getContent().getContentJSON();
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
};


/**
 * Render the AssessmentList
 */
ASSESSMENTLIST.prototype.render = function() {
	/* if student has already done this step
	 * && isLockAfterSubmit is true
	 * && is displayAnswerSubmit is false,
	 * don't show the step, just display
	 * the fact that they've already completed it.
	 */
	if (this.content.isLockAfterSubmit
			&& !this.content.displayAnswerAfterSubmit
			&& this.isSubmitted()) {
		this.lockScreen();
		return;
	};
	
	/* render the overall prompt for the whole step */
	$("#promptDiv").html(this.content.prompt);

	var assessmentHTML = "";
	/* for each assessment in the list, render them */
	for (var i=0; i<this.content.assessments.length; i++) {
		var assessment = this.content.assessments[i];
		assessmentHTML += this.getHTML(assessment,i);
	};
	$("#assessmentsDiv").html(assessmentHTML);
	$("#submitButtonDiv").html('<input id="submitButton" type="button" onclick="submit()" value="Submit the Questionnaire"></input>');

	//disable and grey out the submit button
	this.setSaveUnavailable();
	
	/* if student has already done this step, don't show the step, just display
	 * the fact that they've already completed it.
	 */
	if (this.states != null && this.states.length > 0 && this.content.isLockAfterSubmit) {
		this.lockScreen();
		return;
	};
	
	this.node.view.eventManager.fire('contentRenderComplete', this.node.id, this.node);
};

ASSESSMENTLIST.prototype.submit = function() {
	var allCompleted = this.isAllPartsCompleted();
	
	if (allCompleted) {
		if (this.content.isLockAfterSubmit) {
			doLockStep=confirm("Click 'OK' to save and lock this step.  Your data will be saved and you will not be able to make any more changes.\nIf you want to keep working on this step, click 'Cancel'.");
			if (doLockStep==true) { 
				this.setSaveUnavailable();
				var isSubmit = true;
				this.save(isSubmit);
				this.lockScreen();
			} 
		} else {
			this.setSaveUnavailable();
			var isSubmit = false;
			this.save(isSubmit);
		};
	} else {
		/* all not completed yet, notify user and have them finish */
		alert("Please answer all the questions before submitting this questionnaire.");
	};
};

/**
 * Returns true iff all parts have been completed 
 */
ASSESSMENTLIST.prototype.isAllPartsCompleted = function() {
	var totalRadioCount = $('.choicesDiv').length; /* total number of radio assessments, including follow-ups */
	var radioNumChecked = 0;
	/* check that all radio button assessment have been answered */
	$('input:radio:checked').each(function() {
		radioNumChecked++;
	});

	if (totalRadioCount != radioNumChecked) {
		return false;
	}

	var textBoxesAllComplete = true;
	/* check that all textboxes have been populated */
	$(".textboxTextArea").each(function() { 
		if ($(this).val() == null || $(this).val() == "") {
			textBoxesAllComplete = false;
	    }
	}); 
	return textBoxesAllComplete;
};

/**
 * Saves the current page.
 */
ASSESSMENTLIST.prototype.save = function(isSubmit) {
	var alState = new ASSESSMENTLISTSTATE();
	alState.isSubmit = isSubmit;
	for (var i=0; i<this.content.assessments.length; i++) {
		var assessment = this.content.assessments[i];
		var assessmentState = {};
		assessmentState.id = assessment.id;
		assessmentState.type = assessment.type;
		assessmentState.response = this.getResponse(assessment);
		alState.assessments.push(assessmentState);
	};
	
	//fire the event to push this state to the global view.states object
	eventManager.fire('pushStudentWork', alState);
	
	this.states.push(alState);
};

/**
 * Returns student's current response to be saved for the specified assessment object.
 * @param assessmentJSON JSON obj of assessment item.
 *   Currently, we only support assessments of type 
 *   - "radio" (for multiple choice)
 *   - "text" (for open response)
 * @return html string
 */
ASSESSMENTLIST.prototype.getResponse = function(assessmentJSON) {
	if (assessmentJSON.type == "text") {
		var text = $("#"+assessmentJSON.id+"textbox").val();
		if (text != null && text != "") {
			var response = {};
			response.text = text;
			return response;
		} else {
			return null;
		}
	} else if  (assessmentJSON.type == "radio") {
		var choiceId = $("input[name='" + assessmentJSON.id + "']:checked").val();
		if (choiceId != null && choiceId != "") {
			var response = {};
			response.id = choiceId;
			// get text of choice from assessment obj
			for (var x=0; x < assessmentJSON.choices.length; x++) {
				if (assessmentJSON.choices[x].id == choiceId) {
					response.text = assessmentJSON.choices[x].text;
				}
			}
			return response; 
		} else {
			return null;
		}
	};
	return "";
};

/**
 * Returns HTML string to display in the assessmentlist page for the specified assessment
 * @param assessmentJSON JSON obj of assessment item.
 *   Currently, we only support assessments of type 
 *   - "radio" (for multiple choice)
 *   - "text" (for open response)
 *   @index: 0-based index of this assessment in the whole step.
 * @return html string
 */
ASSESSMENTLIST.prototype.getHTML = function(assessmentJSON,index) {
	var html = "<div id='"+assessmentJSON.id+"Div' class='"+assessmentJSON.type+" assessment'>" +
	    "<div id='"+assessmentJSON.id+"PromptDiv' class='promptDiv'><span class='partSpan'>" + (index+1) + ".&nbsp;&nbsp;</span>"+assessmentJSON.prompt+"</div>";
	if (assessmentJSON.type == "text") {
		html += this.getHTMLText(assessmentJSON);
	} else if  (assessmentJSON.type == "radio") {
		html += this.getHTMLRadio(assessmentJSON);
	};
	html += "</div>";
	return html;
};

/**
 * Returns HTML String to display a radio button assessment, like multiple choice. The assessment object
 * is passed in as JSON object, and is of type radio.
 * @param radioJSON
 * @return
 */
ASSESSMENTLIST.prototype.getHTMLRadio = function(radioJSON) {
	var html = "";
	
	if(radioJSON.choices.length > 0) {
		html = "<div id='"+radioJSON.id+"choicesDiv' class='choicesDiv'>";
		var lastChosenChoiceId = this.getLastSavedResponse(radioJSON);
		for (var i=0;i<radioJSON.choices.length;i++) {
			var choice = radioJSON.choices[i];
			html+="<div id='"+choice.id+"choiceDiv' class='choiceDiv'>";
			if (lastChosenChoiceId != null && lastChosenChoiceId == choice.id) {
			    html += "<input class='interactable' type='radio' name='"+radioJSON.id+"' value='"+choice.id+"' onchange='javascript:assessmentListChanged()' checked>";
			} else {
			    html += "<input class='interactable' type='radio' name='"+radioJSON.id+"' value='"+choice.id+"' onchange='javascript:assessmentListChanged()'>";
			}
			html += "<span class='choicetextSpan'>"+choice.text+"</span>"
			    +"</div>";
		};
		html += "</div>";
	}

	return html;
};

/**
 * Returns HTML String to display a textbox assessment, like open response. The assessment object
 * is passed in as JSON object, and is of type text.
 * @param textJSON
 * @return
 */
ASSESSMENTLIST.prototype.getHTMLText = function(textJSON) {
	var html = "<div id='"+textJSON.id+"textboxDiv' class='textboxDiv'>";
	var starterprompt = "";
	/* display starter prompt if specified */
	if (textJSON.starter != null && textJSON.starter.text != null) {
		if (textJSON.starter.display == 1 || textJSON.starter.display == 2) {
			starterprompt = textJSON.starter.text;
		};
	};

	html += "<textarea id='"+textJSON.id+"textbox' class='textboxTextArea interactable' onkeypress='javascript:assessmentListChanged()'>";
	var lastSavedResponse = this.getLastSavedResponse(textJSON);
	if (lastSavedResponse != null) {
		html += lastSavedResponse;
	} else {
		html += starterprompt;
	}
	html += "</textarea>";
	html += "</div>";	
	return html;
};

/**
 * Returns true iff student has "submitted" (ie locked) 
 * this step, so no more editing can be done.
 * @param assessmentJSON
 * @return
 */
ASSESSMENTLIST.prototype.isSubmitted = function() {
	if (this.states && this.states.length > 0) {
		for (var i=0; i < this.states.length; i++) {
			if (this.states[i].submit) {
				return true;
			}
		}
	}
	return false;
};

ASSESSMENTLIST.prototype.getLastSavedResponse = function(assessmentJSON) {
	if (this.states && this.states.length > 0) {
		var latestState = this.states[this.states.length-1];
		for (var i=0; i<latestState.assessments.length; i++) {
			if (latestState.assessments[i].id == assessmentJSON.id) {
				//check if the response is null
				if(latestState.assessments[i].response != null) {
					//the student does have a previous response/answer
					if (assessmentJSON.type == "radio") {
						return latestState.assessments[i].response.id;
					} else if (assessmentJSON.type == "text") {
						return latestState.assessments[i].response.text;
					};
				} else {
					//the student does not have a previous response/answer
					return null;
				}
			};
		};
	};
	return null;
};

/**
 * disables user from making any more changes
 */
ASSESSMENTLIST.prototype.lockScreen = function() {
	$("#submitButton").attr("disabled","disabled");
	$(".interactable").attr("disabled","disabled");
	$(".stepAlreadyCompleteDiv").html("You have completed this step.");
};


/**
 * Turn the save button on so the student can click it
 */
ASSESSMENTLIST.prototype.setSaveAvailable = function() {
	//removeClassFromElement("saveButton", "disabledLink");
	$("#submitButton").removeClass("disabledLink");
	$("#submitButton").attr("disabled", false);
};

/**
 * Turn the save button off so the student can't click it.
 * This is used when the data is saved and there is no need
 * to save.
 */
ASSESSMENTLIST.prototype.setSaveUnavailable = function() {
	//addClassToElement("saveButton", "disabledLink");
	$("#submitButton").addClass("disabledLink");	
	$("#submitButton").attr("disabled", true);
};

/**
 * Determine whether the save button is available or not.
 * @return true if the save button is available, false is greyed out
 * and is not available
 */
ASSESSMENTLIST.prototype.isSaveAvailable = function() {
	return !$("#submitButton").hasClass("disabledLink");
};

ASSESSMENTLIST.prototype.assessmentListChanged = function() {
	this.setSaveAvailable();
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/assessmentlist/assessmentlist.js');
};