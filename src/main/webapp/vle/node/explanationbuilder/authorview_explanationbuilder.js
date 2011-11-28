/**
 * Sets the TemplateNode type as an object of this view
 * @constructor
 * xTODO: rename TemplateNode
 */
View.prototype.ExplanationBuilderNode = {};

/*
 * Add the name of the common component that this step will use. The
 * common components will be handled by the authoring tool. You will
 * need to create div elements with the appropriate id for the
 * authoring tool to insert the component into. Any additional custom
 * authoring components specific to your step type will be written 
 * by you in the generatePage() function. You may leave the array
 * empty if you are not using any common components.
 * 
 * Here are the available common components
 * 'Prompt'
 * 'LinkTo'
 * 'StudentResponseBoxSize'
 * 'RichTextEditorToggle'
 * 'StarterSentenceAuthoring'
 * 
 * If you use a common components, you must create a div with the
 * appropriate id, here are the respective ids
 * 'promptContainer'
 * (LinkTo does not require a div)
 * 'studentResponseBoxSizeContainer'
 * 'richTextEditorToggleContainer'
 * 'starterSentenceAuthoringContainer'
 * 
 * 
 * xTODO: rename TemplateNode
 */
View.prototype.ExplanationBuilderNode.commonComponents = [];

/**
 * Generates the authoring page. This function will create the authoring
 * components such as textareas, radio buttons, check boxes, etc. that
 * authors will use to author the step. For example if the step has a
 * text prompt that the student will read, this function will create
 * a textarea that will allow the author to type the text that the
 * student will see. You will also need to populate the textarea with
 * the pre-existing prompt if the step has been authored before.
 * 
 * xTODO: rename TemplateNode
 */
View.prototype.ExplanationBuilderNode.generatePage = function(view){
	this.view = view;
	
	//get the content of the step
	this.content = this.view.activeContent.getContentJSON();
	
	//get the html element that all the authoring components will be located
	var parent = document.getElementById('dynamicParent');
	
	/*
	 * wipe out the div that contains the authoring components because it
	 * may still be populated with the authoring components from a previous
	 * step the author has been authoring since we re-use the div id
	 */
	parent.removeChild(document.getElementById('dynamicPage'));

	//create a new div that will contain the authroing components
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	
	//create the label for the textarea that the author will write the prompt in
	var promptText = document.createTextNode("Prompt for Student:");
	
	/*
	 * create the textarea that the author will write the prompt in
	 * 
	 * onkeyup will fire the 'templateUpdatePrompt' event which will
	 * be handled in the <new step type name>Events.js file
	 * 
	 * For example if you are creating a quiz step you would look in
	 * your quizEvents.js file.
	 * 
	 * when you add new authoring components you will need to create
	 * new events in the <new step type name>Events.js file and then
	 * create new functions to handle the event
	 */
	var promptTextArea = createElement(document, 'textarea', {id: 'promptTextArea', rows:'10', cols:'85', onkeyup:"eventManager.fire('explanationBuilderUpdatePrompt')"});
	
	//create the text for the enable student text area checkbox
	var enableStudentTextAreaText = document.createTextNode("Enable Student Response Box:");
	
	//create the checkbox for enabling the student text area
	var enableStudentTextAreaCheckBox = createElement(document, 'input', {id: 'enableStudentTextAreaCheckBox', type: 'checkbox', onclick: 'eventManager.fire("explanationBuilderUpdateEnableStudentTextAreaCheckBox")'});
	
	//create the label for the textarea that the author will write the instructions in
	var instructionsText = document.createTextNode("Instructions for Student:");
	
	//get the instructions
	var instructionsValue = this.content.instructions;
	
	if(instructionsValue == null) {
		//set instructions to empty string if instructions is not in the content
		instructionsValue = "";
	}
	
	//create the textarea that the author will write the instructions in
	var instructionsTextArea = createElement(document, 'textarea', {id: 'instructionsTextArea', rows:'10', cols:'85', onkeyup:"eventManager.fire('explanationBuilderUpdateInstructions')"});

	//populate the instructions text area
	instructionsTextArea.value = instructionsValue;
	
	//get the existing background url
	var background = this.content.background;
	
	//the label for the background url input
	var backgroundImageUrlLabel = document.createTextNode("Background Image Url");
	var localImageLabel = document.createTextNode(" - image you have uploaded to the project, e.g. assets/image.jpg");
	var absoluteImageLabel = document.createTextNode(" - image from the internet, e.g. http://www.website.com/image.jpg");
	var maxImageSizeLabel = document.createTextNode(" - max image size that you will be able to view is 680x480 (680x320 with student response box)");
	
	//the text input for the background url
	var backgroundImageUrl = createElement(document, 'input', {type: 'text', id: 'backgroundImageUrl', name: 'backgroundImageUrl', value: background, size:60, onchange: 'eventManager.fire("explanationBuilderUpdateBackgroundImageUrl")'});
	
	//add the authoring components to the page
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(promptTextArea);
	pageDiv.appendChild(createBreak());
	
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(enableStudentTextAreaText);
	pageDiv.appendChild(enableStudentTextAreaCheckBox);
	pageDiv.appendChild(createBreak());
	
	pageDiv.appendChild(instructionsText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(instructionsTextArea);	
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(backgroundImageUrlLabel);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(localImageLabel);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(absoluteImageLabel);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(maxImageSizeLabel);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(backgroundImageUrl);
	
	//add the page to the parent
	parent.appendChild(pageDiv);
	
	//populate the prompt if this step has been authored before
	this.populatePrompt();
	
	//populate the enable student text area checkbox
	if(this.content.enableStudentTextArea) {
		enableStudentTextAreaCheckBox.checked = true;
	}
};

/**
 * Get the array of common components which is an array with
 * string elements being the name of the common component
 * 
 * xTODO: rename TemplateNode
 */
View.prototype.ExplanationBuilderNode.getCommonComponents = function() {
	return this.commonComponents;
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 * 
 * xTODO: rename TemplateNode
 */
View.prototype.ExplanationBuilderNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

/**
 * Populate the authoring textarea where the user types the prompt that
 * the student will read
 * 
 * xTODO: rename TemplateNode
 */
View.prototype.ExplanationBuilderNode.populatePrompt = function() {
	//get the prompt from the content and set it into the authoring textarea
	$('#promptTextArea').val(this.content.prompt);
};

/**
 * Updates the content's prompt to match that of what the user input
 * 
 * xTODO: rename TemplateNode
 */
View.prototype.ExplanationBuilderNode.updatePrompt = function(){
	/* update content */
	this.content.prompt = document.getElementById('promptTextArea').value;
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content's prompt to match that of what the user input
 * 
 * xTODO: rename TemplateNode
 */
View.prototype.ExplanationBuilderNode.updateBackgroundImageUrl = function(){
	/* update content */
	this.content.background = document.getElementById('backgroundImageUrl').value;
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the instructions in the content
 */
View.prototype.ExplanationBuilderNode.updateInstructions = function(){
	/* update content */
	this.content.instructions = $('#instructionsTextArea').val();
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update whether to display the student text area or not
 */
View.prototype.ExplanationBuilderNode.updateEnableStudentTextAreaCheckBox = function() {
	//update the content
	this.content.enableStudentTextArea = this.isChecked($('#enableStudentTextAreaCheckBox').attr('checked'));
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Determine if the value is checked or not
 * @param the string 'checked' or the value null
 * @return true if the value is 'checked'
 */
View.prototype.ExplanationBuilderNode.isChecked = function(value) {
	var checked = false;
	
	//check if the value is the string 'checked' or boolean value true
	if(value == 'checked' || value == true) {
		checked = true;
	} else {
		checked = false;
	}
	
	return checked;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * xTODO: rename template to your new folder name
	 * xTODO: rename authorview_template
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/authorview_quiz.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/explanationbuilder/authorview_explanationbuilder.js');
};