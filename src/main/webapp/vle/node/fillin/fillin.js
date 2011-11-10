/**
 * @constructor
 * @param node
 * @returns
 */
function FILLIN(node) {
	this.node = node;
	this.content = this.node.getContent().getContentJSON();
	
	this.states = [];
    if(node.states != null) {
    	this.states = node.states;
    };
	
	this.customCheck = null;
	this.interactiveDivHtml = null;
	this.html = "";
	this.elementSS = [];
	this.textEntryInteractions = [];
	
	/* set up textentryinteraction objects */
	for(var i=0;i<this.content.assessmentItem.interaction.length;i++){
		if(this.content.assessmentItem.interaction[i].type=='textEntryInteraction'){
			var textInteraction = new TEXTENTRYINTERACTION(this.content.assessmentItem.interaction[i]);
			textInteraction.setResponseDeclaration(this.content.assessmentItem.responseDeclarations);
			this.textEntryInteractions.push(textInteraction);
		};
	};
	
	/* set custom check function if it has been defined */
	if(this.content.customCheck){
		this.customCheck = new Function('states', this.content.customCheck);
	};
};

/**
 * Renders the Fill-in step at specified textInteractionEntryIndex state. All 
 * textInteractionEntries before the specified index will reveal the correct response.
 */
FILLIN.prototype.render = function(textInteractionEntryIndex) {
	this.html = "";
	clearFeedbackDiv();
	//removeClassFromElement("checkAnswerButton", "disabledLink");
	$('#checkAnswerButton').parent().removeClass('ui-state-disabled');
	//addClassToElement("tryAgainButton", "disabledLink");
	$('#tryAgainButton').parent().addClass('ui-state-disabled');
	//addClassToElement("nextButton", "disabledLink");
	$('#nextButton').parent().addClass('ui-state-disabled');
	
	this.generateNonInteractiveDivHtml();
	var nonInteractiveDiv = document.getElementById('nonInteractiveDiv');
	nonInteractiveDiv.innerHTML=this.html;
	
	var interactiveDiv = document.getElementById('interactiveDiv');
	interactiveDiv.innerHTML=this.generateInteractiveDivHtml(textInteractionEntryIndex);
	
	this.node.view.eventManager.fire('contentRenderComplete', this.node.id, this.node);
};

/**
 * Generates html for the interactiveDiv, which is basically the text input box.
 */
FILLIN.prototype.generateInteractiveDivHtml = function(textInteractionEntryIndex) {
	var textInteractionEntry = this.textEntryInteractions[parseInt(textInteractionEntryIndex)];
	if(textInteractionEntry){
		var responseId = textInteractionEntry.textInteraction.responseIdentifier;
		var expectedLength = textInteractionEntry.textInteraction.expectedLength;
		var humanIndex = parseInt(textInteractionEntryIndex)+1;
		return "<b>Answer for blank #"+humanIndex+": </b><input maxLength=\""+expectedLength+"\" id=\"responseBox\" type=\"text\"></input>";
		this.html += "<script type=\"text/javascript\">document.getElementById(\"responseBox\").focus();</script>";
	};
};

/**
 * Generates html for the nonInteractiveDiv. This is the part with no interactivity.
 */
FILLIN.prototype.generateNonInteractiveDivHtml = function() {
	for (var i=0; i < this.content.assessmentItem.interaction.length; i++) {
		if (this.content.assessmentItem.interaction[i].type == "htmltext") {
			this.html += this.content.assessmentItem.interaction[i].text;
		} else if (this.content.assessmentItem.interaction[i].type == "textEntryInteraction") {
			var responseIdStr = this.content.assessmentItem.interaction[i].responseIdentifier;
			var responseId = responseIdStr.substring(responseIdStr.indexOf("_")+1, responseIdStr.length);
			
			if (parseInt(responseId) < currentTextEntryInteractionIndex) {
				var studentResponse;
				// changing to actual student response -- if not found, revert to correct answer
				for(var z=0;z<this.states.length;z++){
					if(this.states[z].textEntryInteractionIndex==responseId){
						studentResponse = this.states[z].response;
					};
				};
				if(studentResponse==null){
					studentResponse = this.textEntryInteractions[parseInt(responseId)].responseDeclaration.correctResponses[0];
				};
				this.html += "<input type=\'text\' class=\"completedBlank\" disabled value=\""+ studentResponse +"\"></input>";
			} else {
				var humanIndex = parseInt(responseId)+1;
				if (responseId == currentTextEntryInteractionIndex) {    // add activeBlank class if the box is current box.
				    this.html += "<input type=\'text\' class=\"activeBlank\" name =\"activeBlank\" disabled value=\"#"+ humanIndex +"\"></input>";				
				} else {
					this.html += "<input type=\'text\' disabled value=\"#"+ humanIndex +"\"></input>";				
				};
			};
		};
	};
};

/**
 * Lets students try again. Keeps currentTextEntryInteractionIndex the same and enables and disables buttons.
 * Clears FeedbackDiv and inputbox
 */
FILLIN.prototype.tryAgain = function() {
	//if (hasClass("tryAgainButton", "disabledLink")) {
	if ($('#tryAgainButton').parent().hasClass('ui-state-disabled')) {
		return;
	};
	
	//removeClassFromElement("checkAnswerButton", "disabledLink");
	$('#checkAnswerButton').parent().removeClass('ui-state-disabled');
	//addClassToElement("tryAgainButton", "disabledLink");
	$('#tryAgainButton').parent().addClass('ui-state-disabled');
	setResponseBoxEnabled(true);
	clearFeedbackDiv();
	clearResponseBox();
};

FILLIN.prototype.checkAnswer = function() {
	//if (hasClass("checkAnswerButton", "disabledLink")) {
	if ($('#checkAnswerButton').parent().hasClass('ui-state-disabled')) {
		return;
	};

	//removeClassFromElement("tryAgainButton", "disabledLink");
	$('#tryAgainButton').parent().removeClass('ui-state-disabled');
	//addClassToElement("checkAnswerButton", "disabledLink");
	$('#checkAnswerButton').parent().addClass('ui-state-disabled');
	setResponseBoxEnabled(false);

	var studentAnswerText = document.getElementById('responseBox').value;
	var textEntryInteraction = this.textEntryInteractions[currentTextEntryInteractionIndex];
	
	var fillinState = new FILLINSTATE(currentTextEntryInteractionIndex, studentAnswerText);
	// add a new STATE
	this.states.push(fillinState);
	
	//fire the event to push this state to the global view.states object
	eventManager.fire('pushStudentWork', fillinState);
	
	var feedbackDiv = document.getElementById("feedbackDiv");
	if(this.customCheck!=null){
		//custom processing
		var customResponse = this.customCheck(this.states);
		if(customResponse.correct){	
			$('#tryAgainButton').parent().addClass('ui-state-disabled');
			//addClassToElement("tryAgainButton", "disabledLink");
			$('#nextButton').parent().removeClass('ui-state-disabled');
			//removeClassFromElement("nextButton", "disabledLink");
			document.getElementsByName("activeBlank")[0].value = studentAnswerText;
			
			if(customResponse.complete){
				$('#nextButton').parent().addClass('ui-state-disabled');
				//addClassToElement("nextButton", "disabledLink");
			};
		};
		
		feedbackDiv.innerHTML = customResponse.feedback;
	} else{
		// default processing
		if (textEntryInteraction.isCorrect(studentAnswerText)) {
			$('#feedbackDiv').removeClass('incorrect');
			//removeClassFromElement("feedbackDiv", "incorrect");
			$('#feedbackDiv').addClass('correct');
			//addClassToElement("feedbackDiv", "correct");	
			$('#tryAgainButton').parent().addClass('ui-state-disabled');
			//addClassToElement("tryAgainButton", "disabledLink");
			$('#nextButton').parent().removeClass('ui-state-disabled');
			//removeClassFromElement("nextButton", "disabledLink");
			
			feedbackDiv.innerHTML = "Correct.";
			document.getElementsByName("activeBlank")[0].value = studentAnswerText;   // display activeBlank with correctAnswer
			if (currentTextEntryInteractionIndex+1 < this.textEntryInteractions.length) {
			} else {
				$('#nextButton').parent().addClass('ui-state-disabled');
				//addClassToElement("nextButton", "disabledLink");
				feedbackDiv.innerHTML += " You successfully filled all of the blanks.  Impressive work!";			
				feedbackDiv.innerHTML += this.getCorrectText(this.textEntryInteractions.length, this.states.length);			
			};
		} else {
			$('#feedbackDiv').addClass('correct');
			//removeClassFromElement("feedbackDiv", "correct");
			$('#feedbackDiv').removeClass('incorrect');
			//addClassToElement("feedbackDiv", "incorrect");		
			feedbackDiv.innerHTML = "Not correct or misspelled";
		};
	};
};

/**
 * Returns grammatically correct feedback based on the
 * given number of blanks and tries
 */
FILLIN.prototype.getCorrectText = function(blanks, tries){
	var outStr = " You successfully filled ";
	
	if(blanks==1){
		outStr += "1 blank in ";
	} else {
		outStr += blanks + " blanks in ";
	};
	
	if(tries==1){
		outStr += "1 try.";
	} else {
		outStr += tries + " tries.";
	};
	
	return outStr;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/fillin/fillin.js');
};