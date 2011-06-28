/**
 * Sets the SurgeNode type as an object of this view
 */
View.prototype.SurgeNode = {};

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
 */
View.prototype.SurgeNode.commonComponents = [];

/**
 * Generates the authoring page. This function will create the authoring
 * components such as textareas, radio buttons, check boxes, etc. that
 * authors will use to author the step. For example if the step has a
 * text prompt that the student will read, this function will create
 * a textarea that will allow the author to type the text that the
 * student will see. You will also need to populate the textarea with
 * the pre-existing prompt if the step has been authored before.
 */
View.prototype.SurgeNode.generatePage = function(view){
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
	 * onkeyup will fire the 'surgeUpdatePrompt' event which will
	 * be handled in the surgeEvents.js file
	 * 
	 * when you add new authoring components, you will need to create
	 * new events in the surgeEvents.js file and then
	 * create new functions to handle the event
	 */
	var promptTextArea = createElement(document, 'textarea', {id: 'promptTextArea', rows:'20', cols:'85', onkeyup:"eventManager.fire('surgeUpdatePrompt')"});
	
	var swfUrlLabel = document.createTextNode("SWF URL:");
	var swfUrlInput = createElement(document, 'input', {id: 'swfUrlInput', type:'text', size:'50', onchange:"eventManager.fire('surgeUpdatedSwfUrlInput')"});
	
	var levelStringLabel = document.createTextNode("Level String:");
	var levelStringTextArea = createElement(document, 'textarea', {id: 'levelStringTextArea', rows:'20', cols:'85', onchange:"eventManager.fire('surgeUpdateLevelString')"});
	
	var authoringSwfDiv = createElement(document, 'div', {id: 'authoringSwfDiv'});
	
	//add the authoring components to the page
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(promptTextArea);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(swfUrlLabel);
	pageDiv.appendChild(swfUrlInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(levelStringLabel);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(levelStringTextArea);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(authoringSwfDiv);

	//add the page to the parent
	parent.appendChild(pageDiv);
	
	//populate the prompt if this step has been authored before
	this.populatePrompt();
	
	if(this.content.url) {
		$('#swfUrlInput').val(this.content.url);
	}
	
	if(this.content.levelString) {
		$('#levelStringTextArea').val(this.content.levelString);
	}
	
	var authoringSwfHtml = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="770" height="480" id="leveleditor" align="middle">'
	+ '<param name="allowScriptAccess" value="sameDomain" />'
	+ '<param name="allowFullScreen" value="false" />'
	+ '<param name="movie" value="http://funkypear.com/SURGE194510/leveleditor.swf" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" />	<embed src="http://funkypear.com/SURGE194510/leveleditor.swf" quality="high" bgcolor="#ffffff" width="770" height="480" name="leveleditor" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />'
	+ '</object>';
	
	$('#authoringSwfDiv').html(authoringSwfHtml);
};

/**
 * Get the array of common components which is an array with
 * string elements being the name of the common component
 */
View.prototype.SurgeNode.getCommonComponents = function() {
	return this.commonComponents;
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.SurgeNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

/**
 * Populate the authoring textarea where the user types the prompt that
 * the student will read
 */
View.prototype.SurgeNode.populatePrompt = function() {
	//get the prompt from the content and set it into the authoring textarea
	$('#promptTextArea').val(this.content.prompt);
};

/**
 * Updates the content's prompt to match that of what the user input
 */
View.prototype.SurgeNode.updatePrompt = function(){
	/* update content */
	this.content.prompt = $('#promptTextArea').val();
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content's swf url to match that of what the user input
 */
View.prototype.SurgeNode.updateSwfUrl = function(){
	/* update content */
	this.content.url = $('#swfUrlInput').val();
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content's level string to match that of what the user input
 */
View.prototype.SurgeNode.updateLevelString = function(){
	/* update content */
	this.content.levelString = $('#levelStringTextArea').val();
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/surge/authorview_surge.js');
};