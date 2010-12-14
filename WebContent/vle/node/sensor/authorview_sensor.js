/**
 * Sets the SensorNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.SensorNode = {};
View.prototype.SensorNode.commonComponents = ['StudentResponseBoxSize', 'StarterSentenceAuthoring', 'Prompt', 'LinkTo'];

/**
 * Generates the authoring page for open response node types
 */
View.prototype.SensorNode.generatePage = function(view){
	this.view = view;
	this.content = this.view.activeContent.getContentJSON();
	
	var xLabel = '';
	if(this.content.graphParams.xlabel != null) {
		xLabel = this.content.graphParams.xlabel;
	}
	
	var xMin = '';
	if(this.content.graphParams.xmin != null) {
		xMin = this.content.graphParams.xmin;
	}
	
	var xMax = '';
	if(this.content.graphParams.xmax != null) {
		xMax = this.content.graphParams.xmax;
	}
	
	var yLabel = '';
	if(this.content.graphParams.ylabel != null) {
		yLabel = this.content.graphParams.ylabel;
	}
	
	var yMin = '';
	if(this.content.graphParams.ymin != null) {
		yMin = this.content.graphParams.ymin;
	}
	
	var yMax = '';
	if(this.content.graphParams.ymax != null) {
		yMax = this.content.graphParams.ymax;
	}
	
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old
	parent.removeChild(document.getElementById('dynamicPage'));
	
	
	//create the choose sensor authoring elements
	var chooseSensorTypeText = document.createTextNode('Choose the sensor type:');
	var chooseMotionRadioButton = createElement(document, 'input', {type: 'radio', id: 'motionRadioButton', name: 'chooseSensorType', value: 'motion', onclick: 'eventManager.fire("sensorUpdateSensorType","motion")'});
	var chooseMotionRadioButtonText = document.createTextNode('Motion Sensor');
	var chooseTemperatureRadioButton = createElement(document, 'input', {type: 'radio', id: 'temperatureRadioButton', name: 'chooseSensorType', value: 'temperature', onclick: 'eventManager.fire("sensorUpdateSensorType","temperature")'});
	var chooseTemperatureRadioButtonText = document.createTextNode('Temperature Sensor');
	
	var sensorType = this.getSensorType();
	if(sensorType == 'motion') {
		chooseMotionRadioButton.checked = true;
	} else if(sensorType == 'temperature') {
		chooseTemperatureRadioButton.checked = true;
	}
	
	//create the x axis authoring elements
	var xUnitsText = document.createTextNode('X Axis Units:');
	var xUnitsInput = createElement(document, 'input', {type: 'input', id: 'xUnitsInput', name: 'xLabelInput', value: xLabel, onchange: 'eventManager.fire("sensorUpdateXUnits")'});
	var xMinText = document.createTextNode('Min X:');
	var xMinInput = createElement(document, 'input', {type: 'input', id: 'xMinInput', name: 'xMinInput', value: xMin, onchange: 'eventManager.fire("sensorUpdateXMin")'});
	var xMaxText = document.createTextNode('Max X:');
	var xMaxInput = createElement(document, 'input', {type: 'input', id: 'xMaxInput', name: 'xMaxInput', value: xMax, onchange: 'eventManager.fire("sensorUpdateXMax")'});
	
	//create the y axis authoring elements
	var yUnitsText = document.createTextNode('Y Axis Units:');
	var yUnitsInput = createElement(document, 'input', {type: 'input', id: 'yUnitsInput', name: 'yLabelInput', value: yLabel, onchange: 'eventManager.fire("sensorUpdateYUnits")'});
	var yMinText = document.createTextNode('Min Y:');
	var yMinInput = createElement(document, 'input', {type: 'input', id: 'yMinInput', name: 'yMinInput', value: yMin, onchange: 'eventManager.fire("sensorUpdateYMin")'});
	var yMaxText = document.createTextNode('Max Y:');
	var yMaxInput = createElement(document, 'input', {type: 'input', id: 'yMaxInput', name: 'yMaxInput', value: yMax, onchange: 'eventManager.fire("sensorUpdateYMax")'});
	
	//create new
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var promptText = document.createTextNode("Prompt for Student:");
	var linesText = document.createTextNode("Size of Student Response Box (# rows):");
	var richTextEditorText = document.createTextNode("Use Rich Text Editor");
	
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createElement(document, 'div', {id: 'promptContainer'}));
	pageDiv.appendChild(createBreak());
	
	//insert the sensor type radio buttons
	pageDiv.appendChild(chooseSensorTypeText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(chooseMotionRadioButton);
	pageDiv.appendChild(chooseMotionRadioButtonText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(chooseTemperatureRadioButton);
	pageDiv.appendChild(chooseTemperatureRadioButtonText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	//insert the x axis graph parameters
	pageDiv.appendChild(xUnitsText);
	pageDiv.appendChild(xUnitsInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(xMinText);
	pageDiv.appendChild(xMinInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(xMaxText);
	pageDiv.appendChild(xMaxInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	//insert the y axis graph parameters
	pageDiv.appendChild(yUnitsText);
	pageDiv.appendChild(yUnitsInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(yMinText);
	pageDiv.appendChild(yMinInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(yMaxText);
	pageDiv.appendChild(yMaxInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	

	
	pageDiv.appendChild(createElement(document, 'div', {id: 'studentResponseBoxSizeContainer'}));
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	//pageDiv.appendChild(createElement(document, 'div', {id: 'richTextEditorToggleContainer'}));
	//pageDiv.appendChild(createBreak());
	//pageDiv.appendChild(createBreak());
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
	
	
	parent.appendChild(pageDiv);
};

/**
 * Get the array of common components which is an array with
 * string elements being the name of the common component
 */
View.prototype.SensorNode.getCommonComponents = function() {
	return this.commonComponents;
};

/**
 * Generates and returns the lines element for the html
 * and set the value from the content.
 */
View.prototype.SensorNode.generateLines = function(){
	return createElement(document, 'input', {type: 'text', id: 'linesInput', value: this.content.assessmentItem.interaction.expectedLines, onkeyup: 'eventManager.fire("openResponseLinesChanged")'});
};


/**
 * Generates the starter sentence input options for this open response
 */
View.prototype.SensorNode.generateStarter = function(){
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
View.prototype.SensorNode.generatePeerReview = function(peerReviewType) {
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
	} else if(peerReviewType == 'revise') {
		//create label and text area
		var peerReviewAuthoredReviewText = document.createTextNode('Enter the canned review: ');
		var peerReviewAuthoredReviewInput = createElement(document, 'textarea', {id: 'peerReviewAuthoredReviewInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponsePeerReviewAuthoredReviewUpdated")'});
		
		//add the label and text area to the div that we will return
		peerReviewDiv.appendChild(peerReviewAuthoredReviewText);
		peerReviewDiv.appendChild(peerReviewAuthoredReviewInput);
		
		//set any previously set values for the authoredWork
		peerReviewAuthoredReviewInput.value = this.content.authoredReview;
	}
	
	return peerReviewDiv;
};

/**
 * Create a div the will display text areas for teacher review attributes if necessary
 */
View.prototype.SensorNode.generateTeacherReview = function(peerReviewType) {
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
View.prototype.SensorNode.starterChanged = function(){
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
View.prototype.SensorNode.starterUpdated = function(){
	/* update content */
	this.content.starterSentence.sentence = document.getElementById('starterSentenceInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Generates and returns an HTML Input Element of type checkbox 
 * used to determine whether a rich text editor should be used.
 */
View.prototype.SensorNode.generateRichText = function(){
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
View.prototype.SensorNode.updateRichText = function(){
	this.content.isRichTextEditorAllowed = document.getElementById('richTextChoice').checked;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.SensorNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

/**
 * Updates the content with the value from the textarea
 */
View.prototype.SensorNode.peerReviewAuthoredWorkUpdated = function(){
	this.content.authoredWork = document.getElementById('peerReviewAuthoredWorkInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content with the value from the text input
 */
View.prototype.SensorNode.peerReviewPercentageTriggerUpdated = function(){
	this.content.openPercentageTrigger = document.getElementById('peerReviewOpenPercentageTriggerInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content with the value from the text input
 */
View.prototype.SensorNode.peerReviewNumberTriggerUpdated = function(){
	this.content.openNumberTrigger = document.getElementById('peerReviewOpenNumberTriggerInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content with the value from the textarea
 */
View.prototype.SensorNode.peerReviewAuthoredReviewUpdated = function(){
	this.content.authoredReview = document.getElementById('peerReviewAuthoredReviewInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.SensorNode.populatePrompt = function() {
	$('#promptInput').val(this.content.prompt);
};

/**
 * Updates the content's prompt to match that of what the user input
 */
View.prototype.SensorNode.updatePrompt = function(){
	/* update content */
	this.content.prompt = document.getElementById('promptInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.SensorNode.populateStudentResponseBoxSize = function() {
	$('#studentResponseBoxSizeInput').val(this.content.expectedLines);
};

/**
 * Updates the number of line elements for this open response to that
 * input by the user.
 */
View.prototype.SensorNode.updateStudentResponseBoxSize = function(){
	/* update content */
	this.content.expectedLines = document.getElementById('studentResponseBoxSizeInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.SensorNode.populateRichTextEditorToggle = function() {
	$('#richTextEditorToggleInput').attr('checked', this.content.isRichTextEditorAllowed);
};

View.prototype.SensorNode.updateRichTextEditorToggle = function(){
	/* update content */
	this.content.isRichTextEditorAllowed = document.getElementById('richTextEditorToggleInput').checked;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.SensorNode.populateStarterSentenceAuthoring = function() {
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

View.prototype.SensorNode.updateStarterSentenceAuthoring = function(){
	/* update content */
	this.content.starterSentence.display = $('input[name=starterRadio]:checked').val();
	
	this.content.starterSentence.sentence = $('#starterSentenceAuthoringInput').val();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Get the sensor type from the content
 */
View.prototype.SensorNode.getSensorType = function() {
	return this.content.sensorType;
};

/**
 * Save the sensor type to the content
 */
View.prototype.SensorNode.updateSensorType = function() {
	this.content.sensorType = $('input[name=chooseSensorType]:checked').val();
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the x units/label to the content
 */
View.prototype.SensorNode.updateXUnits = function() {
	//get the x units and set it into the graph params
	this.content.graphParams.xlabel = $('#xUnitsInput').val();
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the min x value to the content
 */
View.prototype.SensorNode.updateXMin = function() {
	//get the value the author input for the min x value
	var xMin = $('#xMinInput').val();
	
	if(xMin == null || xMin == '') {
		//if the author entered nothing we will set it to null
		xMin = null;
	}
	
	//get the x min and set it into the graph params
	this.content.graphParams.xmin = xMin;
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the max x value to the content
 */
View.prototype.SensorNode.updateXMax = function() {
	//get the value the author input for the max x value
	var xMax = $('#xMaxInput').val();
	
	if(xMax == null || xMax == '') {
		//if the author entered nothing we will set it to null
		xMax = null;
	}
	
	//get the x max and set it into the graph params
	this.content.graphParams.xmax = xMax;
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the y units/label to the content
 */
View.prototype.SensorNode.updateYUnits = function() {
	//get the y units and set it into the graph params
	this.content.graphParams.ylabel = $('#yUnitsInput').val();
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the min y value to the content
 */
View.prototype.SensorNode.updateYMin = function() {
	//get the value the author input for the min y value
	var yMin = $('#yMinInput').val();
	
	if(yMin == null || yMin == '') {
		//if the author entered nothing we will set it to null
		yMin = null;
	}
	
	//get the y units and set it into the graph params
	this.content.graphParams.ymin = yMin;
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Save the max y value to the content
 */
View.prototype.SensorNode.updateYMax = function() {
	//get the value the author input for the max y value
	var yMax = $('#yMaxInput').val();
	
	if(yMax == null || yMax == '') {
		//if the author entered nothing we will set it to null
		yMax = null;
	}
	
	//get the y units and set it into the graph params
	this.content.graphParams.ymax = yMax;
	
	//fire source updated event
	this.view.eventManager.fire('sourceUpdated');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/sensor/authorview_sensor.js');
};