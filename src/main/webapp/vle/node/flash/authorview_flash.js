/**
 * Sets the FlashNode type as an object of this view
 * @constructor
 * TODO: rename FlashNode
 */
View.prototype.FlashNode = {};

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
 * TODO: rename FlashNode
 */
View.prototype.FlashNode.commonComponents = [];

/**
 * Generates the authoring page. This function will create the authoring
 * components such as textareas, radio buttons, check boxes, etc. that
 * authors will use to author the step. For example if the step has a
 * text prompt that the student will read, this function will create
 * a textarea that will allow the author to type the text that the
 * student will see. You will also need to populate the textarea with
 * the pre-existing prompt if the step has been authored before.
 * 
 * TODO: rename FlashNode
 */
View.prototype.FlashNode.generatePage = function(view){
	
	this.view = view;
	
	this.projectPath = this.view.getProjectFolderPath();
	
	this.flashvarCount = -1;
	
	//get the content of the step
	this.content = this.view.activeContent.getContentJSON();
	
	//get the html element that all the authoring components will be located
	var parent = document.getElementById('dynamicParent');
	
	/*
	 * wipe out the div that contains the authoring components because it
	 * may still be populated with components from a previous step since we re-use the div id
	 */
	var pageDiv = $('#dynamicPage').html('').css({'width':'100%','height':'100%'}).addClass('authorContent');
	
	var promptDiv = $(document.createElement('div')).addClass('authorComponent');
	
	//create the label for the textarea that the author will write the prompt in
	var promptLabel = $(document.createElement('div')).text('Introductory Content (optional):');
	//create the textarea that the author will write the prompt in
	var promptTextArea = $(createElement(document, 'textarea', {id: 'promptTextArea', name: 'promptTextArea', onkeyup:"eventManager.fire('flashPromptChanged')"})).css({'width':'100%','min-height':'100px'});
	
	//create rich text hide/show links div
	var richtextToggleDiv = $(document.createElement('div'));
	
	//create rich text hide and show links
	var richtextShow = $(createElement(document, 'a', {id: 'showRichText', title: 'Rich Text', onclick:"eventManager.fire('flashShowRichText')"})).text('Rich Text').addClass('richTextToggle');
	var richtextHide = $(createElement(document, 'a', {id: 'hideRichText', title: 'HTML', onclick:"eventManager.fire('flashHideRichText')"})).text('HTML').addClass('richTextToggle');
	
	richtextToggleDiv.append(richtextShow).append(richtextHide);
	
	promptDiv.append(promptLabel).append(promptTextArea).append(richtextToggleDiv);
	
	var swfUrlDiv = $(document.createElement('div')).addClass('authorComponent');
	
	//create the label for the textarea that the author will write the swf url in
	var swfUrlLabel = $(document.createElement('span')).text('Flash (swf) URL:');
	//create the textarea that the author will write the swf url in
	var swfUrlInput = $(createElement(document, 'input', {id: 'swfUrlInput', type:'text', size:'50', onchange:"eventManager.fire('flashSwfUrlChanged')"}));
	//create the browse button that allows author to choose swf from project assets
	var swfBrowseButton = $(createElement(document, 'button', {id: 'swfBrowseButton', onclick:'eventManager.fire("flashBrowseClicked")'})).text('Browse');
	
	swfUrlDiv.append(swfUrlLabel).append(swfUrlInput).append(swfBrowseButton);
	
	var swfDimensionsDiv = $(document.createElement('div')).addClass('authorComponent');
	
	//create the label for the dimensions section
	var swfDimensionsLabel = $(document.createElement('div')).text('Dimensions (px):');
	//create the label for the textarea that the author will write the height in
	var swfHeightLabel = $(document.createElement('span')).text('Height:');
	//create the textarea that the author will write the height in
	// TODO: add validation (only allow digits)
	var swfHeightInput = createElement(document, 'input', {id: 'swfHeightInput', type:'text', size:'4', onchange:"eventManager.fire('flashSwfHeightChanged')"});
	
	//create the label for the textarea that the author will write the width in
	var swfWidthLabel = $(document.createElement('span')).text('Width:');
	//create the textarea that the author will write the width in
	// TODO: add validation (only allow digits)
	var swfWidthInput = createElement(document, 'input', {id: 'swfWidthInput', type:'text', size:'4', onchange:"eventManager.fire('flashSwfWidthChanged')"});
	
	swfDimensionsDiv.append(swfDimensionsLabel).append(swfHeightLabel).append(swfHeightInput).append(swfWidthLabel).append(swfWidthInput);
	
	var advancedDiv = $(document.createElement('div')).addClass('authorSection');
	
	//create the label for the advanced section
	var advancedLabel = $(document.createElement('div')).text('Advanced Options:');
	
	var flashvarsDiv = $(document.createElement('div')).addClass('authorComponent');
	
	//create the label for the flashvars section
	var flashvarsLabel = $(document.createElement('div')).text('Optional Load Parameters (flashvars)');
	//create add flashvar button
	var flashvarButton = $(createElement(document, 'button', {id: 'addFlashvar', onclick: 'eventManager.fire("flashAddFlashvar")'})).text('Add new flashvar');
	
	flashvarsDiv.append(flashvarsLabel).append(flashvarButton);
	
	var dataDiv = $(document.createElement('div')).addClass('authorComponent');
	//create the checkbox that the author will use to enable/disable data logging
	var enableDataCbx = $(createElement(document, 'input', {id: 'enableDataCbx', type:'checkbox', name: 'enableDataCbx'}));
	enableDataCbx.change(function(){
		eventManager.fire('flashEnableDataChanged');
	});
	//create the label for the checkbox that the author will use to enable/disable data logging
	var enableDataLabel = $(document.createElement('span')).text('Enable student data logging');
	
	dataDiv.append(enableDataCbx).append(enableDataLabel);
	
	var gradingDiv = $(document.createElement('div')).addClass('authorComponent').css('display','none').attr('id','gradingDiv');
	//create the checkbox that the author will use to enable/disable grading
	var enableGradingCbx = $(createElement(document, 'input', {id: 'enableGradingCbx', type:'checkbox', name: 'enableGradingCbx'}));
	enableGradingCbx.change(function(){
		eventManager.fire('flashEnableGradingChanged');
	});
	//create the label for the checkbox that the author will use to enable/disable grading
	var enableGradingLabel = $(document.createElement('span')).text('Enable grading');
	
	gradingDiv.append(enableGradingCbx).append(enableGradingLabel);
	
	var gradingTypeDiv = $(document.createElement('div')).addClass('authorComponent').css('display','none').attr('id','gradingTypeDiv');
	
	//create the label for the radio buttons that the author will use to select the grading format
	var gradingTypeLabel = $(document.createElement('div')).text('Grading Mode:');
	//create the radio buttons and labels for each grading type
	var gradingLabelData = $(document.createElement('span')).text('Student Data String');
	var gradingRadioData = $(createElement(document, 'input', {id: 'dataGradingType', type: 'radio', name: 'gradingType', value: 'data'})).prop('checked',true);
	var gradingLabelFlash = $(document.createElement('span')).text('Flash Display');
	var gradingRadioFlash = $(createElement(document, 'input', {id: 'flashGradingType', type: 'radio', name: 'gradingType', value: 'flashDisplay'}));
	var gradingLabelCustom = $(document.createElement('span')).text('Custom');
	var gradingRadioCustom = $(createElement(document, 'input', {id: 'customGradingType', type: 'radio', name: 'gradingType', value: 'custom'}));
	
	gradingTypeDiv.append(gradingTypeLabel).append(gradingRadioFlash).append(gradingLabelFlash).append(gradingRadioData).append(gradingLabelData).append(gradingRadioCustom).append(gradingLabelCustom);
	
	advancedDiv.append(advancedLabel).append(flashvarsDiv).append(createBreak()).append(dataDiv).append(gradingDiv).append(gradingTypeDiv);
	
	//add the authoring components to the page
	pageDiv.append(swfUrlDiv).append(createBreak()).append(swfDimensionsDiv).append(createBreak()).append(promptDiv).append(createBreak()).append(advancedDiv);
	
	//set change event listener for grading type radio buttons
	$('input[name="gradingType"]').change(function(){
		eventManager.fire('flashGradingTypeChanged');
	});
	
	// populate swf url if it has been authored before
	if(this.content.activity_uri != '') {
		this.populateSwfUrl();
	}
	
	//populate the dimensions if this step has been authored before
	this.populateSwfDimensions();
	
	// populate the advanced options (data logging, grading)
	this.populateAdvancedOptions();
	
	// bind change events on key/value fields to updateFlashvars
	$('.flashvarInput').live('keyup',function(){
		eventManager.fire('flashFlashvarsChanged');
	});
	
	// enable rich text eidtor for prompt
	this.enableRichTextEditing($('#promptTextArea'),function() {eventManager.fire('flashPromptChanged');});
	
	// populate the prompt text that has been authored before
	this.populatePrompt();
};

/**
 * Get the array of common components which is an array with
 * string elements being the name of the common component
 * 
 * TODO: rename FlashNode
 */
View.prototype.FlashNode.getCommonComponents = function() {
	return this.commonComponents;
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 * 
 * TODO: rename FlashNode
 */
View.prototype.FlashNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

/**
 * Populate the authoring textarea where the user types the prompt that
 * the student will read
 */
View.prototype.FlashNode.populatePrompt = function() {
	//get the prompt from the content and set it into the authoring textarea
	if(this.content.prompt){
		if(this.promptRichTextEnabled){
			this.promptRichText.setContent(this.content.prompt);
		} else {
			$('#promptTextArea').val(this.content.prompt);
		}
	}
};

/**
 * Updates the content's prompt to match that of what the user input
 */
View.prototype.FlashNode.updatePrompt = function(){
	/* update content */
	if(this.richTextPromptEnabled){
		this.content.prompt = this.promptRichText.getContent();
	} else {
		this.content.prompt = $('#promptTextArea').val();
	}
	
	// strip out any urls with the full project path (and replace with 'assets/file.jpg')
	var assetPath = this.projectPath + 'assets/';
	var assetPathExp = new RegExp(assetPath,"gi");
	this.content.prompt.replace(assetPathExp,"assets/");
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Populate the swfUrl textarea where the user types the url for the swf file
 */
View.prototype.FlashNode.populateSwfUrl = function() {
	//get the url from the content and set it into the authoring textarea
	$('#swfUrlInput').val(this.content.activity_uri);
};

/**
 * Updates the content's activity_uri to the user input
 * 
 * TODO: rename FlashNode
 */
View.prototype.FlashNode.updateSwfUrl = function(){
	/* update content */
	this.content.activity_uri = $('#swfUrlInput').val();
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Populate the height and width textareas where the user types the dimensions for the swf file
 */
View.prototype.FlashNode.populateSwfDimensions = function() {
	//get the height from the content and set it into the authoring textarea
	$('#swfHeightInput').val(this.content.height);
	
	//get the width from the content and set it into the authoring textarea
	$('#swfWidthInput').val(this.content.width);
};

/**
 * Updates the content's height to the user input
 */
View.prototype.FlashNode.updateSwfHeight = function(){
	/* update content */
	this.content.height = $('#swfHeightInput').val();
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content's width to the user input
 */
View.prototype.FlashNode.updateSwfWidth = function(){
	/* update content */
	this.content.width = $('#swfWidthInput').val();
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Populate the advanced options (student data logging, grading)
 */
View.prototype.FlashNode.populateAdvancedOptions = function() {
	var context = this;
	// get the enable data logging setting from the content and check/uncheck checkbox
	$('#enableDataCbx').prop("checked", this.content.enableData);
	
	// get the enable grading setting from the content and check/uncheck checkbox
	$('#enableGradingCbx').prop("checked", this.content.enableGrading);
	
	// get the grading type setting from the content and select corresponding radio button
	$('input[name="gradingType"]').each(function(){
		if($(this).val() == context.content.gradingType){
			$(this).prop('checked',true);
		}
	});
	
	// if data logging is enabled, show grading checkbox
	if(this.content.enableData){
		$('#gradingDiv').show();
		// if grading is enabled, show grading type selectors
		if(this.content.enableGrading){
			$('#gradingTypeDiv').show();
		}
	}
	// populate any previously stored flashvars
	$.each(this.content.flashvars, function(key,value){
		context.createNewFlashvarInput(key,value);
	});
};

/**
 * Enables/disables student data logging based on the user input
 */
View.prototype.FlashNode.updateEnableData = function(){
	/* update content */
	var dataEnabled = $('#enableDataCbx').prop("checked");
	this.content.enableData = dataEnabled;
	
	// show/hide grading checkbox based on enable data input
	if(dataEnabled){
		$('#gradingDiv').slideDown('fast');
		$('#enableGradingCbx').prop('checked',true);
	} else {
		$('#enableGradingCbx').prop('checked',false);
		$('#gradingDiv').slideUp('fast');
	}
	this.updateEnableGrading();
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Enables/disables grading based on the user input
 */
View.prototype.FlashNode.updateEnableGrading = function(){
	/* update content */
	var gradingEnabled = $('#enableGradingCbx').prop("checked");
	this.content.enableGrading = gradingEnabled;
	
	// show/hide grading type selectors based on enable grading input
	if(gradingEnabled){
		$('#gradingTypeDiv').slideDown('fast');
	} else {
		$('#gradingTypeDiv').slideUp('fast');
	}
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the grading mode based on user input
 */
View.prototype.FlashNode.updateGradingType = function(){
	/* update content */
	var gradingType = $('input[name="gradingType"]:checked').val();
	this.content.gradingType = gradingType;
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Add a new flashvar input section (key and value textareas)
 * @param key The string to use for the key (optional)
 * @param value The string to use for the value (optional)
 */
View.prototype.FlashNode.createNewFlashvarInput = function(key,value){
	var context = this;
	this.flashvarCount ++;
	// create div for new flashvar
	var newFlashvarDiv = $(document.createElement('div')).addClass('flashvar').attr('id','flashvar_' + context.flashvarCount).css('display','none');
	// create label for key textarea
	var keyLabel = $(document.createElement('span')).text('Key:');
	// create the textarea that the author will write the key in
	var keyInput = $(createElement(document, 'input', {type:'text', size:'15'})).addClass('key flashvarInput');
	// populate key input if key param was sent
	if(key && key.replace(/\s/g,"")!=""){
		keyInput.val(key);
	}
	// create label for value textarea
	var valueLabel = $(document.createElement('span')).text('Value:');
	// create the textarea that the author will write the value in
	var valueInput = $(createElement(document, 'input', {type:'text', size:'50'})).addClass('value flashvarInput');
	// populate value input if value param was sent
	if(value && value.replace(/\s/g,"")!=""){
		valueInput.val(value);
	}
	
	// create delete link
	var deleteLink = $(document.createElement('a')).text('X').attr('title','Delete').addClass('deleteFlashvar');
	var index = context.flashvarCount;
	deleteLink.click(function(){
		eventManager.fire('flashDeleteFlashvar',index);
	});
	
	newFlashvarDiv.append(keyLabel).append(keyInput).append(valueLabel).append(valueInput).append(deleteLink);
	
	$('#addFlashvar').before(newFlashvarDiv);
	newFlashvarDiv.slideDown('fast');
};

/**
 * Updates the flashvar key/value pairs
 */
View.prototype.FlashNode.updateFlashvars = function(){
	var context = this;
	this.content.flashvars = {};
	$('.flashvar').each(function(index){
		var key = $('#flashvar_' + index + ' .key').val();
		var value = $('#flashvar_' + index + ' .value').val();
		if(key.replace(/\s/g,"")!=""){
			context.content.flashvars[key] = value;
		}
	});
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Deletes the flashvar key/value pair for specified index
 * @param index The index (count) of the flashvar to be deleted
 */
View.prototype.FlashNode.deleteFlashvar = function(index){
	var key = $('#flashvar_' + index + ' .key').val();
	delete this.content.flashvars[key];
	
	$('#flashvar_' + index).slideUp('fast',function(){$(this).remove();});
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Shows rich text editor for prompt
 */
View.prototype.FlashNode.showRichText = function() {
	if(this.richTextPromptEnabled == false){
		this.enableRichTextEditing($('#promptTextArea'),function() {eventManager.fire('flashPromptChanged');});
		//this.richTextPromptEnabled = true;
	}
};

/**
 * Shows rich text editor for prompt
 */
View.prototype.FlashNode.hideRichText = function() {
	if(this.richTextPromptEnabled == true){
		$('#promptTextArea').tinymce().remove();
		this.richTextPromptEnabled = false;
	}
};

/**
 * Enables rich text editing for specified textarea
 * TODO: make this a component feature (not specific to indiviudal node types)
 * @param target The textarea element on which to activate the rich text editor
 * @param callback A callback function to run when the rich text editor content changes
 */
View.prototype.FlashNode.enableRichTextEditing = function(target,callback) {
	var context = this;
	
	// enable rich text editing on prompt textarea
	target.tinymce({
		// Location of TinyMCE script
		script_url : '/vlewrapper/vle/jquery/tinymce/jscripts/tiny_mce/tiny_mce.js',

		// General options
		theme : "advanced",
		plugins : "preview,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
		media_strict : false,
		//media_use_script : true,
		
        // Theme options
        theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
        theme_advanced_buttons2 : "forecolor,backcolor,|,link,unlink,anchor,image,media,|,cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo",
        theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,advhr",
        theme_advanced_buttons4 : "absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,|,print,|,ltr,rtl,|,fullscreen,help,cleanup,preview",
        theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,

		// Example content CSS (should be your site CSS)
		//content_css : "css/content.css",

		// Drop lists for link/image/media/template dialogs
		//template_external_list_url : "lists/template_list.js",
		//external_link_list_url : "lists/link_list.js",
		//external_image_list_url : "jquery/tiny_mce/getImageList.js",
		//media_external_list_url : "jquery/tiny_mce/getMediaList.js",
		document_base_url: context.projectPath,
		
		onchange_callback : callback,
		setup : function(ed){
			/* add keypress listener */
	        ed.onKeyUp.add(callback);
	        
	        // store editor instance as prototype variable
	        context.promptRichText = ed;
		},
		oninit: function(){
			//populate the prompt if this step has been authored before
			context.populatePrompt();
			context.richTextPromptEnabled = true;
		},
		file_browser_callback : 'fileBrowser'
	});
};

/**
 * Open asset editor dialog and allows user to choose the swf to use for this step
 */
View.prototype.FlashNode.browseFlashAssets = function() {
	var callback = function(field_name, url, type, win){
		url = 'assets/' + url;
		document.getElementById(field_name).value = url;
		
		//fire swfUrlChanged event
		this.eventManager.fire('flashSwfUrlChanged');
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

function fileBrowser(field_name, url, type, win){
	var callback = function(field_name, url, type, win){
		url = 'assets/' + url;
		win.document.getElementById(field_name).value = url;
		// if we are in an image browser
        if (typeof(win.ImageDialog) != "undefined") {
            // we are, so update image dimensions and preview if necessary
            if (win.ImageDialog.getImageData) win.ImageDialog.getImageData();
            if (win.ImageDialog.showPreviewImage) win.ImageDialog.showPreviewImage(url);
        }
        // if we are in a media browser
        if (typeof(win.Media) != "undefined") {
            if (win.Media.preview) win.Media.preview(); // TODO: fix - preview doesn't seem to work until you switch the media type
            //if (win.MediaDialog.showPreviewImage) win.MediaDialog.showPreviewImage(url);
        }
	};
	var params = {};
	params.field_name = field_name;
	params.type = type;
	params.win = win;
	params.callback = callback;
	eventManager.fire('viewAssets',params);
};


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename mw to your new folder name
	 * TODO: rename authorview_mw
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/authorview_quiz.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/flash/authorview_flash.js');
};