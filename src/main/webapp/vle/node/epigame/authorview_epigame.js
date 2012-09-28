/**
 * Sets the EpigameNode type as an object of this view
 * @constructor
 */
View.prototype.EpigameNode = {};

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
View.prototype.EpigameNode.commonComponents = [];

View.prototype.EpigameNode.modes = ["mission", "tutorial", "adaptiveMission", "adaptiveQuiz", "editor", "map"];

/**
 * Generates the authoring page. This function will create the authoring
 * components such as textareas, radio buttons, check boxes, etc. that
 * authors will use to author the step. For example if the step has a
 * text prompt that the student will read, this function will create
 * a textarea that will allow the author to type the text that the
 * student will see. You will also need to populate the textarea with
 * the pre-existing prompt if the step has been authored before.
 */
View.prototype.EpigameNode.generatePage = function(view){
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

	//create a new div that will contain the authoring components
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	
	var authoringSwfDiv = createElement(document, 'div', {id: 'authoringSwfDiv'});
	
	/*
	//create the label for the radio buttons that the author will use to select the swf source option
	var sourceDiv = $(document.createElement('div')).attr('id','sourceDiv');
	var sourceLabel = $(document.createElement('div')).text('SURGE activity source file (swf):');
	
	//create the radio buttons and labels for each source option
	var sourceLabelDefault = $(document.createElement('span')).text('Default (use level editor)');
	var sourceRadioDefault = $(createElement(document, 'input', {id: 'defaultSource', type: 'radio', name: 'sourceSelect', value: 'false'})).prop('checked',true);
	var sourceLabelCustom = $(document.createElement('span')).text('Custom');
	var sourceRadioCustom = $(createElement(document, 'input', {id: 'customSource', type: 'radio', name: 'sourceSelect', value: 'true'}));
	sourceDiv.append(sourceLabel).append(sourceRadioDefault).append(sourceLabelDefault).append(sourceRadioCustom).append(sourceLabelCustom);
	*/
	
	//Custom SWF selection
	var swfUrlDiv = $(createElement(document, 'div', {id:'swfUrlDiv'}));
	var swfUrlLabel = $(document.createElement('span')).text('Custom swf file (Leave blank for default):');
	var swfUrlInput = $(createElement(document, 'input', {id: 'swfUrlInput', type:'text', size:'36', onchange:"eventManager.fire('epigameSwfUrlChanged')"}));
	var swfBrowseButton = $(createElement(document, 'button', {id: 'swfBrowseButton', onclick:'eventManager.fire("epigameBrowseClicked")'})).text('Browse');
	swfUrlDiv.append(swfUrlLabel).append(createBreak()).append(swfUrlInput).append(swfBrowseButton);
	
	//Mode selection
	var modeSelectorDiv = $(createElement(document, 'div', {id:'modeSelectorDiv'}));
	var modeSelectorLabel = $(document.createElement('span')).text('Step type:');
	
	var modeLabels = ["Standard Mission", "Tutorial Mission", "Adaptive Mission", "Adaptive Quiz", "Mission Editor", "Star Map"];
	var modeSelector = $(createElement(document, 'select', {id:'modeSelector', onchange:"eventManager.fire('epigameChangeMode')"}));
	for (var i = 0; i < this.modes.length; ++i) {
		modeSelector.append($(createElement(document, 'option', {value: this.modes[i]})).html(modeLabels[i]));
	}
	modeSelectorDiv.append(modeSelectorLabel).append(createBreak()).append(modeSelector);
	
	//Mission data input
	var levelStringDiv = $(createElement(document, 'div', {id:'levelStringDiv'}));
	var levelStringLabel = $(createElement(document, 'span', {id:'levelStringLabel'})).text('Mission String:');
	var levelStringTextArea = createElement(document, 'input', {id: 'levelStringTextArea', type: 'text', size: '45', onchange:"eventManager.fire('epigameUpdateLevelString')"});
	levelStringDiv.append(levelStringLabel).append(createBreak()).append(levelStringTextArea);
	
	//add the authoring components to the page
	//$(pageDiv).append(sourceDiv);
	//pageDiv.appendChild(createBreak());
	//pageDiv.appendChild(authoringSwfDiv);
	$(pageDiv).append(swfUrlDiv);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	$(pageDiv).append(modeSelectorDiv);
	pageDiv.appendChild(createBreak());
	$(pageDiv).append(levelStringDiv);
	//pageDiv.appendChild(createElement(document, 'button', {id:"importLevelButton", value:"import level", onclick:"editorLoaded()"}));

	//add the page to the parent
	parent.appendChild(pageDiv);
	
	//$("#dynamicPage").append("<p>Hola</a>");
	
	// append script used to communicate with flash
	/*
	var jsFunctions = '<script type="text/javascipt">\nfunction receiveLevelData(value) {\n'+
		'alert("receiveleveldata");\n'+
		'//sendDataToGame(value);\n' +
	'};\n</script>\n';
	*/
	//$("#dynamicPage").append(jsFunctions);

	

	 
	/*
	// identify the Flash applet in the DOM - Provided by Adobe on a section on their site about the AS3 ExternalInterface usage.
	function thisMovie(movieName) {
		if (navigator.appName.indexOf("Microsoft") != -1) {
			return window[movieName];
		} else {
			return document[movieName];
		}
	}


	// Call as3 function in identified Flash applet
	function sendDataToGame(value) {
		// Put the string at the bottom of the page, so I can see easily what data has been sent
		document.getElementById("outputdiv").innerHTML = "<b>Level Data Sent to Game:</b> "+value; 

		// Use callback setup at top of this file.
		thisMovie("epigame").sendToGame(value);
	}
	*/
	
	var levelString = "";
	//var useCustomSwf = false;
	var customUri = "";
	var mode = "mission";
	
	if (this.content != null) {
		//get the existing level string
		levelString = this.content.levelString;
		
		/*if(this.content.useCustomSwf != 'undefined'){
			useCustomSwf = this.content.useCustomSwf;
		}*/
		if (this.content.customUri){
			customUri = this.content.customUri;
		}
		
		if (this.content.mode) {
			mode = this.content.mode;
		}
	}
	
	//populate the fields
	$('#swfUrlInput').val(customUri);
	$('#levelStringTextArea').val(levelString);
	$('#modeSelector').val(mode);
	
	// get the source setting from the content and select corresponding radio button
	/*
	$('input[name="sourceSelect"]').each(function(){
		if($(this).val() == useCustomSwf){
			$(this).prop('checked',true);
		}
	});
	*/
	this.updateModeSelection();
	
	//get the url from the content and set it into the authoring textarea
	/*
	var authoringSwfHtml = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="770" height="480" id="leveleditor" align="middle">'
	+ '<param name="allowScriptAccess" value="sameDomain" />'
	+ '<param name="allowFullScreen" value="false" />'
	+ '<param name="movie" value="/vlewrapper/vle/node/epigame/leveleditor.swf" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" />	<embed src="/vlewrapper/vle/node/epigame/leveleditor.swf" quality="high" bgcolor="#ffffff" width="770" height="480" name="leveleditor" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />'
	+ '</object>';
	
	$('#authoringSwfDiv').html(authoringSwfHtml);
	//set change event listener for source radio buttons
	$('input[name="sourceSelect"]').change(function(){
		eventManager.fire('epigameUpdateSource');
	});
	*/
};

/**
 * Imports content.levelString into the leveleditor. Will be called by an event later
 * @param levelString
 * @return
 */
View.prototype.EpigameNode.importLevelStringToEditor = function() {
	var levelString = this.content.levelString;
	//thisMovie("leveleditor").editorImport(levelString);
};

/**
 * Callback (swf->js) for when the leveleditor has been loaded.
 * @return
 */
function editorLoaded() {
	eventManager.fire('epigameImportLevelStringToEditor');
};

function receiveLevelData(value) {
	eventManager.fire("epigameUpdateLevelString", value);
};

// Call as3 function in identified Flash applet
function sendDataToGame(value) {
	// Put the string at the bottom of the page, so I can see easily what data has been sent
	//document.getElementById("outputdiv").innerHTML = "<b>Level Data Sent to Game:</b> "+value; 
	// Use callback setup at top of this file.
	//thisMovie("epigame").sendToGame(value);
};

/**
 * Get the array of common components which is an array with
 * string elements being the name of the common component
 */
View.prototype.EpigameNode.getCommonComponents = function() {
	return this.commonComponents;
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.EpigameNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

/**
 * Updates the content's level string to match that of what the user input
 */
View.prototype.EpigameNode.updateLevelString = function(levelStringIn){
	/* update content */
	if (levelStringIn != null) {
		$('#levelStringTextArea').val(levelStringIn);
	} 
	
	// get the level content from the editor
	
	this.content.levelString = $('#levelStringTextArea').val();
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content's customUri to the user input
 */
View.prototype.EpigameNode.updateSwfUrl = function(){
	/* update content */
	this.content.customUri = $('#swfUrlInput').val();
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the source mode based on user input
 */
View.prototype.EpigameNode.updateSwfSource = function(){
	// update content
	/*
	var useCustom = $('input[name="sourceSelect"]:checked').val();
	this.content.useCustomSwf = useCustom;
	
	if(useCustom == 'true'){
		$('#swfUrlDiv').show();
		$('#authoringSwfDiv').hide();
	} else {
		$('#swfUrlDiv').hide();
		$('#authoringSwfDiv').show();
	}
	*/
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

View.prototype.EpigameNode.updateModeSelection = function(){
	var selectedMode = $('#modeSelector').val();
	var index = this.modes.indexOf(selectedMode);
	
	if (index == -1) {
		//Invalid, use default and overwrite the current field value
		index = 0;
		selectedMode = this.modes[index];
		$('#modeSelector').val(selectedMode);
	}
	
	var dataDiv = $('#levelStringDiv');
	var dataLabel = $('#levelStringLabel');
	var dataField = $('#levelStringTextArea');
	
	switch (index) {
		//Use data value as mission string
		case 0://Mission
		case 4://Editor
			dataLabel.text("Mission Data String:");
			dataDiv.show();
			break;
		
		/*
		//Use data value as adaptive index/identifier
		case 2://Adaptive Mission
		case 3://Adaptive Quiz
			dataLabel.text("Mission/Question Index (integer):");
			dataDiv.show();
			break;
		*/
		
		//Ignore data value
		default:
			dataLabel.text("");
			dataDiv.hide();
			break;
	}
	
	this.content.mode = selectedMode;
	
	//Update the preview
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Open asset editor dialog and allows user to choose the swf to use for this step
 */
View.prototype.EpigameNode.browseFlashAssets = function() {
	var callback = function(field_name, url, type, win){
		url = 'assets/' + url;
		document.getElementById(field_name).value = url;
		
		//fire swfUrlChanged event
		this.eventManager.fire('epigameSwfUrlChanged');
	};
	var params = {};
	params.field_name = 'swfUrlInput';
	params.type = 'flash';
	params.buttonText = 'Please select a file from the list.';
	params.extensions = ['swf', 'flv'];
	params.win = null;
	params.callback = callback;
	eventManager.fire('viewAssets',params);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/epigame/authorview_epigame.js');
};