/**
 * Sets the SurgeNode type as an object of this view
 * @constructor
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
			
	var levelStringLabel = document.createTextNode("Level String:");
	var levelStringTextArea = createElement(document, 'textarea', {id: 'levelStringTextArea', rows:'20', cols:'85', onchange:"eventManager.fire('surgeUpdateLevelString')"});
	
	var authoringSwfDiv = createElement(document, 'div', {id: 'authoringSwfDiv'});
	
	//add the authoring components to the page
	pageDiv.appendChild(authoringSwfDiv);
	//pageDiv.appendChild(createElement(document, 'button', {id:"importLevelButton", value:"import level", onclick:"editorLoaded()"}));
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(levelStringLabel);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(levelStringTextArea);
	pageDiv.appendChild(createBreak());
	

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
		thisMovie("surge").sendToGame(value);
	}
	*/
	
	var levelString = '';
	
	if(this.content != null) {
		//get the existing level string
		levelString = this.content.levelString;
	}
	
	//populate the level string into the textarea
	$('#levelStringTextArea').val(levelString);
		
	var authoringSwfHtml = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="770" height="480" id="leveleditor" align="middle">'
	+ '<param name="allowScriptAccess" value="sameDomain" />'
	+ '<param name="allowFullScreen" value="false" />'
	+ '<param name="movie" value="/vlewrapper/vle/node/surge/leveleditor.swf" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" />	<embed src="/vlewrapper/vle/node/surge/leveleditor.swf" quality="high" bgcolor="#ffffff" width="770" height="480" name="leveleditor" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />'
	+ '</object>';
	
	$('#authoringSwfDiv').html(authoringSwfHtml);
};

/**
 * Imports content.levelString into the leveleditor. Will be called by an event later
 * @param levelString
 * @return
 */
View.prototype.SurgeNode.importLevelStringToEditor = function() {	
	var levelString = this.content.levelString;
	thisMovie("leveleditor").editorImport(levelString);
};

/**
 * Callback (swf->js) for when the leveleditor has been loaded.
 * @return
 */
function editorLoaded() {
	eventManager.fire('surgeImportLevelStringToEditor');
};

function receiveLevelData(value) {
	eventManager.fire("surgeUpdateLevelString", value);
};

//identify the Flash applet in the DOM - Provided by Adobe on a section on their site about the AS3 ExternalInterface usage.
function thisMovie(movieName) {
    if(navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName];
    } else {
        return document[movieName];
    }
};


// Call as3 function in identified Flash applet
function sendDataToGame(value) {
    // Put the string at the bottom of the page, so I can see easily what data has been sent
    //document.getElementById("outputdiv").innerHTML = "<b>Level Data Sent to Game:</b> "+value; 
    // Use callback setup at top of this file.
   thisMovie("surge").sendToGame(value);
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
 * Updates the content's level string to match that of what the user input
 */
View.prototype.SurgeNode.updateLevelString = function(levelStringIn){
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

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/surge/authorview_surge.js');
};