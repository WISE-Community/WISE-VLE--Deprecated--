/**
 * Sets the OpenResponseNode type as an object of this view
 * @constructor
 * @author patrick lawler
 */
View.prototype.OpenResponseNode = {};
View.prototype.OpenResponseNode.commonComponents = ['StudentResponseBoxSize', 'RichTextEditorToggle', 'StarterSentenceAuthoring', 'Prompt', 'LinkTo', 'CRater'];

/**
 * Generates the authoring page for open response node types
 */
View.prototype.OpenResponseNode.generatePage = function(view){
	this.view = view;
	this.content = this.view.activeContent.getContentJSON();
	
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var promptText = document.createTextNode("Question for Student:");
	var linesText = document.createTextNode("Size of Student Response Box (# rows):");
	var richTextEditorText = document.createTextNode("Use Rich Text Editor");
	
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(document.createTextNode("Open Response Options:"));
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createElement(document, 'div', {id: 'openresponseOptionsContainer'}));
	pageDiv.appendChild(createBreak());

	pageDiv.appendChild(createElement(document, 'div', {id: 'studentResponseBoxSizeContainer'}));
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createElement(document, 'div', {id: 'richTextEditorToggleContainer'}));
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createElement(document, 'div', {id: 'starterSentenceAuthoringContainer'}));
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());

	//display any additional text entry areas for peer/teacher review if necessary
	if(this.view.activeNode.peerReview) {
		pageDiv.appendChild(this.generatePeerReview(this.view.activeNode.peerReview));
		pageDiv.appendChild(createBreak());
		pageDiv.appendChild(createBreak());		
	} else if(this.view.activeNode.teacherReview) {
		pageDiv.appendChild(this.generateTeacherReview(this.view.activeNode.teacherReview));
		pageDiv.appendChild(createBreak());
		pageDiv.appendChild(createBreak());
	}
	
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createElement(document, 'div', {id: 'promptContainer'}));
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createElement(document, 'div', {id: 'cRaterContainer'}));
	
	parent.appendChild(pageDiv);
	this.generateOptions();
};

/**
 * Get the array of common components which is an array with
 * string elements being the name of the common component
 */
View.prototype.OpenResponseNode.getCommonComponents = function() {
	return this.commonComponents;
};

/**
 * Generates the options for an assessment list node
 */
View.prototype.OpenResponseNode.generateOptions = function(){
	var optionsHtml = '<table id="openresponseOptionsTable"><thead><tr><td>Display Answer After Submit</td><td>Lock After Submit</td><td>Complete All Before Exit</td></tr></thead>' + 
		'<tbody><tr><td><label for="displayRadioYes"><input type="radio" name="displayRadio" id="displayRadioYes" value="true" onclick="eventManager.fire(\'openresponseOptionChanged\',\'display\')"/>Yes</label></br>' +
		'<label for="displayRadioNo"><input type="radio" name="displayRadio" id="displayRadioNod" value="false" onclick="eventManager.fire(\'openresponseOptionChanged\',\'display\')"/>No</label></td>' +
		'<td><label for="lockRadioYes"><input type="radio" name="lockRadio" id="lockRadioYes" value="true" onclick="eventManager.fire(\'openresponseOptionChanged\',\'lock\')"/>Yes</label></br>' +
		'<label for="lockRadioNo"><input type="radio" name="lockRadio" id="lockRadioNo" value="false" onclick="eventManager.fire(\'openresponseOptionChanged\',\'lock\')"/>No</label></td>' +
		'<td><label for="completeRadioYes"><input type="radio" name="completeRadio" id="completeRadioYes" value="true" onclick="eventManager.fire(\'openresponseOptionChanged\',\'complete\')"/>Yes</label></br>' +
		'<label for="completeRadioNo"><input type="radio" name="completeRadio" id="completeRadioNo" value="false" onclick="eventManager.fire(\'openresponseOptionChanged\',\'complete\')"/>No</label></td></tr></tbody></table>';
	
	$('#openresponseOptionsContainer').append(optionsHtml);

	$('input[name=displayRadio]').filter('[value=' + this.content.displayAnswerAfterSubmit + ']').attr('checked', true);
	$('input[name=lockRadio]').filter('[value=' + this.content.isLockAfterSubmit + ']').attr('checked', true);
	$('input[name=completeRadio]').filter('[value=' + this.content.isMustCompleteAllPartsBeforeExit + ']').attr('checked', true);
};

/**
 * Given the option type, updates the corresponding option in the content
 * with the user specified value.
 * 
 * @param String - type
 */
View.prototype.OpenResponseNode.optionChanged = function(type){
	var val = $('input[name=' + type + 'Radio]:checked').val();
	val = (val==="true") ? true : false;
	
	if(type=='display'){
		this.content.displayAnswerAfterSubmit = val;
	} else if(type=='lock'){
		this.content.isLockAfterSubmit = val;
	} else if(type=='complete'){
		this.content.isMustCompleteAllPartsBeforeExit = val;
	}
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};


/**
 * Generates and returns the lines element for the html
 * and set the value from the content.
 */
View.prototype.OpenResponseNode.generateLines = function(){
	return createElement(document, 'input', {type: 'text', id: 'linesInput', value: this.content.assessmentItem.interaction.expectedLines, onkeyup: 'eventManager.fire("openResponseLinesChanged")'});
};


/**
 * Generates the starter sentence input options for this open response
 */
View.prototype.OpenResponseNode.generateStarter = function(){
	//create div for starterSentence options
	var starterDiv = createElement(document, 'div', {id: 'starterDiv'});
	
	//create starter sentence options
	var noStarterInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("openResponseStarterOptionChanged")', value: '0'});
	var starterOnClickInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("openResponseStarterOptionChanged")', value: '1'});
	var starterImmediatelyInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("openResponseStarterOptionChanged")', value: '2'});
	var starterSentenceInput = createElement(document, 'textarea', {id: 'starterSentenceInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponseStarterSentenceUpdated")'});
	var noStarterInputText = document.createTextNode('Do not use starter sentence');
	var starterOnClickInputText = document.createTextNode('Starter sentence available upon request');
	var starterImmediatelyInputText = document.createTextNode('Starter sentence shows immediately');
	var starterSentenceText = document.createTextNode('Starter sentence: ');
	
	starterDiv.appendChild(noStarterInput);
	starterDiv.appendChild(noStarterInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterOnClickInput);
	starterDiv.appendChild(starterOnClickInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterImmediatelyInput);
	starterDiv.appendChild(starterImmediatelyInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterSentenceText);
	starterDiv.appendChild(starterSentenceInput);
	
	//set value of textarea
	starterSentenceInput.value = this.content.starterSentence.sentence;
	
	//set appropriate radio button and enable/disable textarea
	var displayOption = this.content.starterSentence.display;
	
	if(displayOption=='0'){
		starterSentenceInput.disabled = true;
		noStarterInput.checked = true;
	} else if(displayOption=='1'){
		starterOnClickInput.checked = true;
	} else if(displayOption=='2'){
		starterImmediatelyInput.checked = true;
	};
	
	return starterDiv;
};

/**
 * Create a div the will display text areas for peer review attributes if necessary
 */
View.prototype.OpenResponseNode.generatePeerReview = function(peerReviewType) {
	var peerReviewDiv = createElement(document, 'div', {id: 'peerReviewDiv'});
	
	if(peerReviewType == 'start') {
		//do nothing
	} else if(peerReviewType == 'annotate') {
		//create the label and text area for the percentage trigger
		var peerReviewPercentageTriggerText = document.createTextNode('Enter the percentage of the class needed to open this step: ');
		var peerReviewPercentageTrigger = createElement(document, 'input', {type: 'text', id: 'peerReviewOpenPercentageTriggerInput', value: this.content.openPercentageTrigger, onkeyup: 'eventManager.fire("openResponsePeerReviewPercentageTriggerUpdated")'});

		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewPercentageTriggerText);
		peerReviewDiv.appendChild(peerReviewPercentageTrigger);
		peerReviewDiv.appendChild(createBreak());
		
		//create the label and text area for the number trigger
		var peerReviewNumberTriggerText = document.createTextNode('Enter the number of students in the class needed to open this step: ');
		var peerReviewNumberTrigger = createElement(document, 'input', {type: 'text', id: 'peerReviewOpenNumberTriggerInput', value: this.content.openNumberTrigger, onkeyup: 'eventManager.fire("openResponsePeerReviewNumberTriggerUpdated")'});

		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewNumberTriggerText);
		peerReviewDiv.appendChild(peerReviewNumberTrigger);
		peerReviewDiv.appendChild(createBreak());
		
		//create label and text area for the authored work
		var peerReviewAuthoredWorkText = document.createTextNode('Enter the canned work: ');
		var peerReviewAuthoredWorkInput = createElement(document, 'textarea', {id: 'peerReviewAuthoredWorkInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponsePeerReviewAuthoredWorkUpdated")'});
		
		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewAuthoredWorkText);
		peerReviewDiv.appendChild(peerReviewAuthoredWorkInput);
		
		//set any previously set values for the authoredWork
		peerReviewAuthoredWorkInput.value = this.content.authoredWork;
		
		peerReviewDiv.appendChild(createBreak());
		peerReviewDiv.appendChild(createBreak());
		
		//create label and text area for the step not open custom message
		var peerReviewStepNotOpenCustomMessageText = document.createTextNode('Enter the step not open custom message: ');
		var peerReviewStepNotOpenCustomMessageInput = createElement(document, 'textarea', {id: 'peerReviewStepNotOpenCustomMessageInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponsePeerReviewStepNotOpenCustomMessageUpdated")'});
		var peerReviewStepNotOpenCustomMessageNoteText = document.createTextNode('(note: if you delete everything in the textarea, it will re-populate with the default message. also, associatedStartNode.title will be replaced with the title of the first node in the review sequence when this is displayed to the student.)');
		
		//add the label and text area to the div
		peerReviewDiv.appendChild(peerReviewStepNotOpenCustomMessageText);
		peerReviewDiv.appendChild(peerReviewStepNotOpenCustomMessageInput);
		peerReviewDiv.appendChild(createBreak());
		peerReviewDiv.appendChild(peerReviewStepNotOpenCustomMessageNoteText);
		
		//set any previously set values for the step not open custom message
		peerReviewStepNotOpenCustomMessageInput.value = this.content.stepNotOpenCustomMessage;
		
		peerReviewDiv.appendChild(createBreak());
	} else if(peerReviewType == 'revise') {
		//create label and text area
		var peerReviewAuthoredReviewText = document.createTextNode('Enter the canned review: ');
		var peerReviewAuthoredReviewInput = createElement(document, 'textarea', {id: 'peerReviewAuthoredReviewInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponsePeerReviewAuthoredReviewUpdated")'});
		
		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewAuthoredReviewText);
		peerReviewDiv.appendChild(peerReviewAuthoredReviewInput);
		
		//set any previously set values for the authoredWork
		peerReviewAuthoredReviewInput.value = this.content.authoredReview;
		
		peerReviewDiv.appendChild(createBreak());
		peerReviewDiv.appendChild(createBreak());
		
		//create label and text area for the step not open custom message
		var peerReviewStepNotOpenCustomMessageText = document.createTextNode('Enter the step not open custom message: ');
		var peerReviewStepNotOpenCustomMessageInput = createElement(document, 'textarea', {id: 'peerReviewStepNotOpenCustomMessageInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponsePeerReviewStepNotOpenCustomMessageUpdated")'});
		var peerReviewStepNotOpenCustomMessageNoteText = document.createTextNode('(note: if you delete everything in the textarea, it will re-populate with the default message. also, associatedStartNode.title will be replaced with the title of the first node in the review sequence and associatedAnnotateNode.title will be replaced with the title of the second node in the review sequence when this is displayed to the student.)');
		
		//add the label and text area to the div
		peerReviewDiv.appendChild(peerReviewStepNotOpenCustomMessageText);
		peerReviewDiv.appendChild(peerReviewStepNotOpenCustomMessageInput);
		peerReviewDiv.appendChild(createBreak());
		peerReviewDiv.appendChild(peerReviewStepNotOpenCustomMessageNoteText);
		
		//set any previously set values for the step not open custom message
		peerReviewStepNotOpenCustomMessageInput.value = this.content.stepNotOpenCustomMessage;
		
		peerReviewDiv.appendChild(createBreak());
	}
	
	return peerReviewDiv;
};

/**
 * Create a div the will display text areas for teacher review attributes if necessary
 */
View.prototype.OpenResponseNode.generateTeacherReview = function(peerReviewType) {
	var peerReviewDiv = createElement(document, 'div', {id: 'peerReviewDiv'});
	
	if(peerReviewType == 'start') {
		//do nothing
	} else if(peerReviewType == 'annotate') {
		//create label and text area
		var peerReviewAuthoreWorkText = document.createTextNode('Enter the canned work: ');
		var peerReviewAuthoredWorkInput = createElement(document, 'textarea', {id: 'peerReviewAuthoredWorkInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponsePeerReviewAuthoredWorkUpdated")'});
		
		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewAuthoreWorkText);
		peerReviewDiv.appendChild(peerReviewAuthoredWorkInput);
		
		//set any previously set values for the authoredWork
		peerReviewAuthoredWorkInput.value = this.content.authoredWork;
	} else if(peerReviewType == 'revise') {
		//do nothing
	}
	
	return peerReviewDiv;
};

/**
 * Updates this content when the starter sentence option has changed.
 */
View.prototype.OpenResponseNode.starterChanged = function(){
	var options = document.getElementsByName('starterRadio');
	var optionVal;
	
	/* get the checked option and update the content's starter sentence attribute */
	for(var q=0;q<options.length;q++){
		if(options[q].checked){
			this.content.starterSentence.display = options[q].value;
			if(options[q].value=='0'){
				document.getElementById('starterSentenceInput').disabled = true;
			} else {
				document.getElementById('starterSentenceInput').disabled = false;
			};
		};
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates content with text in starter sentence textarea
 */
View.prototype.OpenResponseNode.starterUpdated = function(){
	/* update content */
	this.content.starterSentence.sentence = document.getElementById('starterSentenceInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Generates and returns an HTML Input Element of type checkbox 
 * used to determine whether a rich text editor should be used.
 */
View.prototype.OpenResponseNode.generateRichText = function(){
	var richTextChoice = createElement(document, 'input', {id: 'richTextChoice', type: 'checkbox', onclick: 'eventManager.fire("openResponseUpdateRichText")'});
	
	/* set whether this input is checked */
	richTextChoice.checked = this.content.isRichTextEditorAllowed;
	
	//disable the checkbox if the step is for a peer/teacher review sequence
	if(this.view.activeNode.peerReview || this.view.activeNode.teacherReview) {
		richTextChoice.disabled = true;
	}
	
	return richTextChoice;
};

/**
 * Updates the richtext option in the content and updates the preview page.
 */
View.prototype.OpenResponseNode.updateRichText = function(){
	this.content.isRichTextEditorAllowed = document.getElementById('richTextChoice').checked;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.OpenResponseNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

/**
 * Updates the content with the value from the textarea
 */
View.prototype.OpenResponseNode.peerReviewAuthoredWorkUpdated = function(){
	this.content.authoredWork = document.getElementById('peerReviewAuthoredWorkInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content with the value from the text input
 */
View.prototype.OpenResponseNode.peerReviewPercentageTriggerUpdated = function(){
	this.content.openPercentageTrigger = document.getElementById('peerReviewOpenPercentageTriggerInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content with the value from the text input
 */
View.prototype.OpenResponseNode.peerReviewNumberTriggerUpdated = function(){
	this.content.openNumberTrigger = document.getElementById('peerReviewOpenNumberTriggerInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content with the value from the textarea
 */
View.prototype.OpenResponseNode.peerReviewAuthoredReviewUpdated = function(){
	this.content.authoredReview = document.getElementById('peerReviewAuthoredReviewInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.OpenResponseNode.populatePrompt = function() {
	$('#promptInput').val(this.content.assessmentItem.interaction.prompt);
};

/**
 * Updates the content's prompt to match that of what the user input
 */
View.prototype.OpenResponseNode.updatePrompt = function(){
	/* update content */
	this.content.assessmentItem.interaction.prompt = document.getElementById('promptInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.OpenResponseNode.populateStudentResponseBoxSize = function() {
	$('#studentResponseBoxSizeInput').val(this.content.assessmentItem.interaction.expectedLines);
};

/**
 * Updates the number of line elements for this open response to that
 * input by the user.
 */
View.prototype.OpenResponseNode.updateStudentResponseBoxSize = function(){
	/* update content */
	this.content.assessmentItem.interaction.expectedLines = document.getElementById('studentResponseBoxSizeInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.OpenResponseNode.populateRichTextEditorToggle = function() {
	$('#richTextEditorToggleInput').attr('checked', this.content.isRichTextEditorAllowed);
};

View.prototype.OpenResponseNode.updateRichTextEditorToggle = function(){
	/* update content */
	this.content.isRichTextEditorAllowed = document.getElementById('richTextEditorToggleInput').checked;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.OpenResponseNode.populateStarterSentenceAuthoring = function() {
	var displayOption = this.content.starterSentence.display;
	
	$('input[name=starterRadio]').each(function() {
		if($(this).val() == displayOption) {
			$(this).attr('checked', true);
		}
	});
	
	if(displayOption == 2) {
		$('#starterSentenceAuthoringInput').val(this.content.starterSentence.sentence);		
	}
};

View.prototype.OpenResponseNode.updateStarterSentenceAuthoring = function(){
	/* update content */
	this.content.starterSentence.display = $('input[name=starterRadio]:checked').val();
	
	this.content.starterSentence.sentence = $('#starterSentenceAuthoringInput').val();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content with the value from the text input
 */
View.prototype.OpenResponseNode.peerReviewStepNotOpenCustomMessageUpdated = function(){
	var customMessage = $('#peerReviewStepNotOpenCustomMessageInput').val();
	
	if(customMessage == "") {
		//custom message field is empty so we will re-populate it with the default message
		customMessage = '<p>This step is not available yet.</p><p>Your response in step <b>"associatedStartNode.title"</b> has not been reviewed by a peer yet.</p><p>More of your peers need to submit a response for step <b>"associatedAnnotateNode.title"</b>.</p><p>Please return to this step in a few minutes.</p>';
		$('#peerReviewStepNotOpenCustomMessageInput').val(customMessage);
	}
	
	this.content.stepNotOpenCustomMessage = customMessage;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Populate the CRater item id from the content
 */
View.prototype.OpenResponseNode.populateCRater = function() {
	if(this.content.cRater != null && this.content.cRater.cRaterItemId != null) {
		$('#cRaterItemIdInput').val(this.content.cRater.cRaterItemId);		
	}
};

/**
 * Updates the CRater item id to match what the user has input
 */
View.prototype.OpenResponseNode.updateCRater = function(){
	//create the cRater object in the content if it does not exist
	if(this.content.cRater == null) {
		this.content.cRater = {};
	}

	//create the cRater.cRaterItemId in the content if it does not exist
	if(this.content.cRater.cRaterItemId == null) {
		this.content.cRater.cRaterItemId = '';
	}
	
	//create the cRater.displayCRaterFeedbackImmediately in the content if it does not exist
	if(this.content.cRater.displayCRaterFeedbackImmediately == null) {
		this.content.cRater.displayCRaterFeedbackImmediately = false;
	}
	
	//create the cRater.cRaterMaxScore in the content if it does not exist
	if(this.content.cRater.cRaterMaxScore == null) {
		this.content.cRater.cRaterMaxScore = null;
	}
	
	//get the item id the user has entered
	var itemId = document.getElementById('cRaterItemIdInput').value;
	
	//make a verify request to the CRater server with the item id the user has entered
	this.view.makeCRaterVerifyRequest(itemId);
	
	//obtain the CRater server response from our request
	var responseText = this.view.cRaterResponseText;
	
	//check if the item id is valid
	var isCRaterItemIdValid = this.view.checkCRaterVerifyResponse(responseText);
	
	var maxScore = null;
	
	if(isCRaterItemIdValid) {
		//item id is valid so we will display a green valid message to the author
		$('#cRaterItemIdStatus').html('<font color="green">Valid Item Id</font>');
		
		//obtain the max score from the response
		maxScore = this.view.getCRaterMaxScoreFromXML(responseText);
	} else {
		//the item id the author has entered is invalid so we will set it to '' in the content
		itemId = '';
		
		//item id is invalid so we will display a red invalid message to the author
		$('#cRaterItemIdStatus').html('<font color="red">Invalid Item Id</font>');
	}
	
	/* update content */
	this.content.cRater.cRaterItemId = itemId;
	this.content.cRater.cRaterMaxScore = maxScore;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.OpenResponseNode.populateStudentResponseBoxSize = function() {
	$('#studentResponseBoxSizeInput').val(this.content.assessmentItem.interaction.expectedLines);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/openresponse/authorview_openresponse.js');
};