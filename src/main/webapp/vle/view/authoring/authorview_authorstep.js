/**
 * Functions specific to step authoring
 * 
 * @author patrick lawler
 * @author jonathan breitbart
 */

/**
 * Shows the author step dialog
 */
View.prototype.showAuthorStepDialog = function(){
	$('#previewFrame').src = 'empty.html';
	//$('#authorStepDialog').dialog('open');
	$('#authorStepDialog').show();
	$('#overlay').show();
	//$.colorbox({href:'#authorStepDialog',inline:true,width:'98%',height:'98%',title:'Edit Step',overlayClose:false,showClose:false,onComplete:function(){eventManager.fire("previewFrameLoaded");},buttons:{'Save':function(){eventManager.fire("saveStep");},'Save and Close':function(){eventManager.fire("saveAndCloseStep");},'Close':function(){eventManager.fire("closeStep");}}});
	/*
	 * scroll to the top of the page because the author step 
	 * dialog shows up at the top and the author would have
	 * to otherwise scroll up themselves
	 */
	//window.scrollTo(0,0);
};

/**
 * Hides the author step dialog
 */
View.prototype.hideAuthorStepDialog = function(){
	//$.colorbox.close();
	$('#authorStepDialog').hide();
	$('#overlay').hide();
	//$('#authorStepDialog').dialog('close');
};

/**
 * Sets the initial state of the authoring step dialog window
 */
View.prototype.setInitialAuthorStepState = function(){
	/*
	 * this.activeContent is the content object that contains the
	 * latest content that is being authored, this may contain
	 * content that is not yet saved to the server. this does not
	 * contain the injected contentBaseUrl.
	 * 
	 * this.preservedContentString is the content string that
	 * is currently saved to the server. this does not contain the
	 * injected contentBaseUrl.
	 * 
	 * this.activeNode.content is the content object that is used
	 * in the preview step. it currently does not contain the injected 
	 * contentBaseUrl but after previewStep() is called, the content
	 * object will contain the injected contentBaseUrl.
	 */
	
	/*
	 * set active content as copy of the active node's content.
	 * this will serve as a temporary buffer for the content
	 * that is being authored. 
	 */
	this.activeContent = createContent(this.activeNode.content.getContentUrl());
	
	/*
	 * obtain the content string that is currently saved to the server.
	 * whenever the authored content is saved to the server, this string
	 * will be updated so that it always mirrors the content saved on the
	 * server.
	 */
	this.preservedContentString = this.activeNode.content.getContentString();
	
	/* set step saved boolean */
	this.stepSaved = true;
	
	/* set radiobutton for easy/advanced mode */
	if(this.easyMode){
		document.getElementById('easyTrue').checked = true;
	} else {
		document.getElementById('easyFalse').checked = true;
	}
	
	/* set refresh as typing mode */
	document.getElementById('refreshCheck').checked = this.updateNow;
	
	/* generate the authoring */
	if(this.easyMode){
		this[this.resolveType(this.activeNode.type)].generatePage(this);

		this.insertCommonComponents();
	} else {
		this.generateAdvancedAuthoring();
	}
	
	/*
	 * clear out the preview frame, we do this so that the previous step the
	 * author previewed does not still show up if they are now authoring a
	 * note step
	 */
	//$('body', window.frames['previewFrame'].document).html("");
	$('#previewFrame').html('');
	
	//clear out the previous nodeId value in the preview frame
	//window.frames['previewFrame'].nodeId = null;
	$('#previewFrame').nodeId = null;
	
	/* show in preview frame */
	this.previewStep();
};

/**
 * Returns the appropriate type for the purposes of authoring of the given node type.
 * In most cases, it is the node type itself. i.e. MatchSequenceNode = MatchSequenceNode,
 * but sometimes it's not: NoteNode = OpenResponseNode.
 */
View.prototype.resolveType = function(type){
	if(type=='NoteNode'){
		return 'OpenResponseNode';
	} else if(type=='ChallengeNode'){
		return 'MultipleChoiceNode';
	} else if(type=='BranchNode'){
		return 'MultipleChoiceNode';
	} else {
		return type;
	}
};

/**
 * Inserts the link div into the current step's authoring and processes existing links.
 */
View.prototype.insertLinkTo = function(){
	/* move the linkto into the prompt div for this node and show it */
	try{
		var linkDiv = document.getElementById('linkContainer').removeChild(document.getElementById('linkDiv'));
		document.getElementById('promptDiv').appendChild(linkDiv);
	} catch (e){/* do nothing */}
	
	/* process the links for this step */
	this.linkManager.processExistingLinks(this);
};


/**
 * Changes the boolean value of easyMode to that of the given value
 */
View.prototype.authorStepModeChanged = function(val){
	if(this.stepSaved || confirm('You are about to switch authoring mode but have not saved your changes. If you continue, your changes will be lost. Do you wish to continue?')){
		if(val=='true'){
			this.easyMode = true;
		} else {
			this.easyMode = false;
		}
		
		this.cleanupCommonComponents();
		this.setInitialAuthorStepState();
	} else {
		/* user canceled put selection back */
		if(this.easyMode){
			document.getElementById('easyTrue').checked = true;
		} else {
			document.getElementById('easyFalse').checked = true;
		}
	}
};

/**
 * Changes the boolean value of updateNow to that selected by the user in the document
 */
View.prototype.updateRefreshOption = function(){
	this.updateNow = document.getElementById('refreshCheck').checked;
};

/**
 * generates the text area to author content when in advanced authoring mode
 */
View.prototype.generateAdvancedAuthoring = function(){
	var parent = document.getElementById('dynamicParent');
	
	/* remove any existing elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create elements for authoring content */
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var ta = createElement(document, 'textarea', {id:'sourceTextArea', style:'width:100%;height:100%', onkeyup:'eventManager.fire("sourceUpdated")'});
	parent.appendChild(pageDiv);
	pageDiv.appendChild(ta);
	
	/* fill with active node's content string */
	ta.style.width = '100%';
	ta.style.height = '100%';
	ta.value = this.activeContent.getContentString();
};

/**
 * saves the currently open step's content and hides the authoring dialog.
 * saving is performed even if nothing has changed because we need to revert
 * the activeNode.content back to the content that does not contain the
 * injected contentBaseUrl.
 */
View.prototype.closeOnStepSaved = function(success){
	if(success || confirm('Save failed, do you still want to exit?')){
		this.cleanupCommonComponents();
		document.getElementById('dynamicPage').innerHTML = '';
		// remove any tinyMCE instances
		if(typeof tinymce != 'undefined'){
			for(var i=0; i<tinymce.editors.length; i++){
				tinymce.editors[i].remove();
			}
		}
		// remove any rich text toggles
		$('.rtToggles').remove();
		
		this.hideAuthorStepDialog();
		
		/*
		 * the activeNode.content contains the injected contentBaseUrl content
		 * so we need to replace it with the content that does not have
		 * the injected contentBaseUrl
		 */
		this.activeNode.content.setContent(this.preservedContentString);
		
		this.activeNode.baseHtmlContent = undefined;
		this.activeNode = undefined;
		this.activeContent = undefined;
		this.activeTA = undefined;
		this.preservedContent = undefined;
		this.stepSaved = true;
	}
};

/**
 * Prompts user if they are trying to exit before saving and hides the authoring dialog if they wish to continue
 */
View.prototype.closeStep = function(){
	if(this.stepSaved || confirm('Changes have not been saved, do you still wish to exit?')){
		this.closeOnStepSaved(true);
	}
};

/**
 *  refreshes the preview 
 */
View.prototype.refreshNow = function(){
	this.sourceUpdated(true);
};

/**
 * Get the hints for authoring
 * @return a hint object or null if the step does not have hints
 */
View.prototype.getAuthoringHints = function() {
	var hints = null;
	
    //check if this step already has hints
    if(this.activeContent != null) {
    	if(this.activeContent.getContentJSON() != null) {
    		//get the hints from the active content
    		hints = this.activeContent.getContentJSON().hints;
    	}
    }
    
    return hints;
};

/**
 * Get the hints array for authoring
 * @returns an array or null if the step does not have hints
 */
View.prototype.getAuthoringHintsArray = function() {
	var hintsArray = null;
	
	//get the hints if any
	var hints = this.getAuthoringHints();
	
	if(hints != null) {
		//get the hints array from the hints
		hintsArray = hints.hintsArray;
	}
	
	return hintsArray;
};

/**
 * saves hints to local var
 */
View.prototype.saveHint = function(){	
    var hintTextBoxes = $('#hintsTabs').find("textarea");
    
    var newHintsArr = [];
    for(var i=0; i<hintTextBoxes.length; i++) {
    	newHintsArr.push(hintTextBoxes[i].value);
    }    
    var forceShow = $("#forceShowOptions option:selected").val();
    this.activeContent.getContentJSON().hints = {"hintsArray":newHintsArr,"forceShow":forceShow};
};

/**
 * saves all hints for current node to server
 */
View.prototype.saveHints = function(){	
	this.saveHint();    
    eventManager.fire("saveStep");
    $('#editHintsPanel').dialog('close');
};

/**
 * Add new hint to the current node
 */
View.prototype.addHint = function(){
	//get the hints array
	var hintsArr = this.getAuthoringHintsArray();
	
	hintsArr.push(this.getI18NString("authoring_new_hint"));
	eventManager.fire("editHints", [hintsArr.length-1]);
};

/**
 * Deletes the currently opened hint for the current node
 * after deletion, show the next hint if exists. if not exists, show the previous hint
 */
View.prototype.deleteHint = function(){
	// get index of currently-opened tab
	var selectedIndex = $('#hintsTabs').tabs('option', 'selected');
	
	//get the hints array
    var hintsArr = this.getAuthoringHintsArray();
    hintsArr.splice(selectedIndex, 1);
    
    var newTabIndex = 0;  // which tab to open
    if (selectedIndex >= hintsArr.length) {
    	newTabIndex = hintsArr.length - 1;
    } else {
    	newTabIndex = selectedIndex;
    };
    eventManager.fire("editHints", [newTabIndex]);
};

/**
 * opens editHint window
 * @tabIndex which tab index to open
 */
View.prototype.editHints = function(tabIndex){
     var currentNode = this.activeNode;
	 if($('#editHintsPanel').size()==0){
	    	//the show hintsDiv does not exist so we will create it
	    	$('<div id="editHintsPanel" style="text-align:left"></div>').dialog(
	    			{	autoOpen:false,
	    				closeText:'',
	    				width:650,
	    				modal:false,
	    				resizable:false,
	    				title:'Add/Edit Hints for this Step',
	    				zIndex:3000, 
	    				left:0
	    			}).bind( "dialogbeforeclose", {view:currentNode.view}, function(event, ui) {
	    			    // before the dialog closes, save hintstate
	    		    	if ($(this).data("dialog").isOpen()) {	    		    		
	    		    		//var hintState = new HINTSTATE({"action":"hintclosed","nodeId":event.data.view.getCurrentNode().id});
	    		    		//event.data.view.pushHintState(hintState);
	    		    	};
	    		    }).bind( "tabsselect", {view:currentNode.view}, function(event, ui) {
	    		    	//var hintState = new HINTSTATE({"action":"hintpartselected","nodeId":event.data.view.getCurrentNode().id,"partindex":ui.index});
	    		    	//event.data.view.pushHintState(hintState);
	    		    });
	    };
	    
	    // append hints into one html string
	    var editHintsMenu = "<input type='button' value='add new hint' onclick='eventManager.fire(\"addHint\")'></input>"+
	    	"<input type='button' value='delete current hint' onclick='eventManager.fire(\"deleteHint\")'></input>" +
	    	"<input type='button' value='save hints' onclick='eventManager.fire(\"saveHints\")'></input>" + 
	    	this.getI18NString("authoring_hint_forceShow")+" <select id='forceShowOptions'><option value='never'>"+this.getI18NString("authoring_hint_option_never")+"</option><option value='firsttime'>"+this.getI18NString("authoring_hint_option_firstTimeOnly")+"</option><option value='always'>"+this.getI18NString("authoring_hint_option_always")+"</option></select>";     
	    var hintsStringPart1 = "";   // first part will be the <ul> for text on tabs
	    var hintsStringPart2 = "";   // second part will be the content within each tab
	    
	    //check if this step already has hints
	    if(this.getAuthoringHints() == null) {
	    	//there are no hints for this step so we will make them
			this.activeContent.getContentJSON().hints = {"hintsArray":[],"forceShow":"never"};
	    }
	    
	    //get the hints array from the content we are authoring
	    var hintsArr = this.getAuthoringHintsArray();
	    
	    for (var i=0; i< hintsArr.length; i++) {
	    	var currentHint = hintsArr[i];
	    	hintsStringPart1 += "<li><a href='#tabs-"+i+"'>Hint "+(i+1)+"</a></li>";
	    	hintsStringPart2 += "<div id='tabs-"+i+"'><textarea class='hintTextBox' onblur='eventManager.fire(\"saveHint\")'>"+currentHint+"</textarea></div>";
	    }
	    hintsStringPart1 = "<ul>" + hintsStringPart1 + "</ul>";

	    hintsString = "<div id='hintsTabs'>" + editHintsMenu + hintsStringPart1 + hintsStringPart2 + "</div>";
	    //set the html into the div
	    $('#editHintsPanel').html(hintsString);
	    
	    //make the div visible
	    $('#editHintsPanel').dialog('open');

	    // instantiate tabs 
		$("#hintsTabs").tabs({selected:tabIndex});		
		
		// select forceshow option
	    var hintsForceShow = this.getAuthoringHints().forceShow;
		$("#forceShowOptions [value='"+hintsForceShow+"']").attr("selected", "selected");
};

/**
 * saves the currently open step's content and calls individual step type's
 * save function so that any other tasks can be done at that time.
 * @param close
 * @param bypassUpdateSource boolean whether we want to skip updating the source
 */
View.prototype.saveStep = function(close, bypassUpdateSource){
	/* calls individual step type's save() if it exists */
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].save){
		this[this.resolveType(this.activeNode.type)].save(close);
	}
	
	/* only save activeNode content if it is not an html type or if we are in advanced mode */
	if(!this.activeNode.selfRendering || !this.easyMode){
		//check if we want to skip updating the source (in the case the source is already updated)
		if(!bypassUpdateSource) {
			/* 
			 * we will update the source
			 * we need to update the active content before saving if the user has switched off the refresh as typing
			 */
			this.sourceUpdated(true);
		}
		
		/* get json content as string */
		var contentString = encodeURIComponent($.stringify(this.activeContent.getContentJSON(),null,3));
		
		if(contentString == 'undefined') {
			//the JSON is invalid so we will not save
			alert('Error: JSON is invalid, unable to save step.');
		} else {
			//the JSON is valid so we will save
			
			/* success callback for updating content file on server */
			var success = function(txt,xml,obj){
				obj.stepSaved = true;
				obj.notificationManager.notify('Content saved to server.', 3);
				obj.eventManager.fire('setLastEdited');
				
				//update our local copy of the step content that mirrors the step content on the server
				obj.preservedContentString = obj.activeContent.getContentString();
				
				if(close){
					obj.eventManager.fire('closeOnStepSaved', [true]);
				}
			};
			
			/* failure callback for updating content file on server */
			var failure = function(o,obj){
				obj.notificationManager.notify('Warning: Unable to save content to server!', 3);
				if(close){
					obj.eventManager.fire('closeOnStepSaved', [false]);
				}
			};
			
			/* update content to server */
			this.connectionManager.request('POST', 3, this.requestUrl, {forward:'filemanager', projectId:this.portalProjectId, command:'updateFile', fileName:this.activeContent.getFilename(this.project.getContentBase()), data:contentString},success,this,failure);			
		}
	}
};

/**
 * Update content and reload preview when user changes the content
 */
View.prototype.sourceUpdated = function(now){
	if(this.updateNow || now){
		this.stepSaved = false;
		
		if(this.easyMode){
			/* have the step type authoring update the content */
			this[this.resolveType(this.activeNode.type)].updateContent();
		} else {
			/* update content from source text area */
			this.activeContent.setContent(document.getElementById('sourceTextArea').value);
		}
		
		this.previewStep();
	}
};

/**
 * Previews the activeNode's content in the preview window
 */
View.prototype.previewStep = function(){
	//get the active content
	var contentString = this.activeContent.getContentString();
	
	//inject the asset full asset path
	contentString = this.injectAssetPath(contentString);
	
	//create a new content object
	var contentObj = createContent(this.activeNode.getContent().getContentUrl());
	
	//set the content string of the new content object
	contentObj.setContent(contentString);
	
	//set the new content with the absolute asset paths into the active node 
	this.activeNode.content.setContent(contentObj.getContentJSON());
	
	/* we don't want broken preview steps to prevent the user from saving
	 * content so let's try to catch errors here */
	
	//for HtmlNode steps we need to inject the full asset path into the html content
	if(this.activeNode.type == 'HtmlNode') {
		//get the html content
		var htmlContent = this.activeNode.baseHtmlContent.getContentString();
		
		//inject the full asset path
		htmlContent = this.injectAssetPath(htmlContent);
		
		//set the updated html content back
		this.activeNode.baseHtmlContent.setContent(htmlContent);
	}
	
	try{
		/* render the node */
		this.activeNode.render(window.frames['previewFrame']);
	} catch(e){
		this.notificationManager.notify('Error generating preview for step authoring. The following error was generated: ' + e,1);
	}
};

/**
 * Replace all occurrences of "assets" with the full assets path
 * e.g.
 * "http://wise4.berkeley.edu/curriculum/135/assets"
 * @param contentString a string containing the content from a step
 * @return the content with all occurrences of "assets" replaced with
 * the full assets path
 */
View.prototype.injectAssetPath = function(contentString) {
	var contentBaseUrl = "";
	
	/*
	 * get the content base url which should be the url to the curriculum folder
	 * e.g.
	 * http://wise4.berkeley.edu/curriculum
	 */
	var contentBaseUrl = this.activeNode.getAuthoringModeContentBaseUrl();
	
	//if the contentBaseUrl ends with '/' we will remove it
	if(contentBaseUrl.charAt(contentBaseUrl.length - 1) == '/') {
		contentBaseUrl = contentBaseUrl.substring(0, contentBaseUrl.length - 1);
	}

	var fullProjectFolderPath = null;
	
	if(this.projectMetadata.projectFolder != null) {
		/*
		 * the project folder is in the project meta data
		 * e.g.
		 * /135
		 * 
		 * so the full project folder path will look like
		 * http://wise4.berkeley.edu/curriculum/135
		 */
		fullProjectFolderPath = contentBaseUrl + this.projectMetadata.projectFolder;
	}
	
	//make sure the projectFolder ends with '/'
	if(fullProjectFolderPath.charAt(fullProjectFolderPath.length - 1) != '/') {
		fullProjectFolderPath += '/';
	}
	
	/*
	 * replace any relative references to assets/ with the absolute path to the assets
	 * e.g.
	 * assets/ is replaced with http://wise4.berkeley.edu/curriculum/123/assets/
	 */
	contentString = contentString.replace(/\.\/assets\/|\/assets\/|assets\//gi, fullProjectFolderPath + 'assets/');
	
	return contentString;
};

/**
 * Retrieve path to project folder for current node
 * e.g.
 * "http://wise4.berkeley.edu/curriculum/135/"
 * @return full path to the project folder
 */
View.prototype.getProjectFolderPath = function() {
	var contentBaseUrl = "";
	
	/*
	 * get the content base url which should be the url to the curriculum folder
	 * e.g.
	 * http://wise4.berkeley.edu/curriculum
	 */
	var contentBaseUrl = this.activeNode.getAuthoringModeContentBaseUrl();
	
	//if the contentBaseUrl ends with '/' we will remove it
	if(contentBaseUrl.charAt(contentBaseUrl.length - 1) == '/') {
		contentBaseUrl = contentBaseUrl.substring(0, contentBaseUrl.length - 1);
	}

	var fullProjectFolderPath = null;
	
	if(this.projectMetadata.projectFolder != null) {
		/*
		 * the project folder is in the project meta data
		 * e.g.
		 * /135
		 * 
		 * so the full project folder path will look like
		 * http://wise4.berkeley.edu/curriculum/135
		 */
		fullProjectFolderPath = contentBaseUrl + this.projectMetadata.projectFolder;
	}
	
	//make sure the projectFolder ends with '/'
	if(fullProjectFolderPath.charAt(fullProjectFolderPath.length - 1) != '/') {
		fullProjectFolderPath += '/';
	}
	
	return fullProjectFolderPath;
};

View.prototype.insertCommonComponents = function() {
	var commonComponents = this[this.resolveType(this.activeNode.type)].getCommonComponents();
	if(commonComponents) {
		for(var x=0; x<commonComponents.length; x++) {
			this['insert' + commonComponents[x]]();
		}		
	}
};

View.prototype.cleanupCommonComponents = function() {
	var commonComponents = this[this.resolveType(this.activeNode.type)].getCommonComponents();
	if(commonComponents) {
		for(var x=0; x<commonComponents.length; x++) {
			this['cleanup' + commonComponents[x]]();
		}		
	}
};


/*
 * Prompt functions
 */

View.prototype.insertPrompt = function() {
	this.promptManager.insertPrompt(this);
};

View.prototype.populatePrompt = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].populatePrompt){
		this[this.resolveType(this.activeNode.type)].populatePrompt();
	}
};

/**
 * Calls the currently authored node's update date prompt event if we are in easy
 * mode and one exists, does nothing otherwise.
 */
View.prototype.updatePrompt = function(){
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updatePrompt){
		this[this.resolveType(this.activeNode.type)].updatePrompt();
	}
};

View.prototype.cleanupPrompt = function() {
	this.promptManager.cleanupPrompt();
};


/*
 * StudentResponseBoxSize functions
 */

View.prototype.insertStudentResponseBoxSize = function() {
	this.studentResponseBoxSizeManager.insertStudentResponseBoxSize(this);
};

View.prototype.populateStudentResponseBoxSize = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].populateStudentResponseBoxSize){
		this[this.resolveType(this.activeNode.type)].populateStudentResponseBoxSize();
	}
};

View.prototype.updateStudentResponseBoxSize = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateStudentResponseBoxSize){
		this[this.resolveType(this.activeNode.type)].updateStudentResponseBoxSize();
	}
};

View.prototype.cleanupStudentResponseBoxSize = function() {
	this.studentResponseBoxSizeManager.cleanupStudentResponseBoxSize();
};

/*
 * RichTextEditor functions
 */

View.prototype.insertRichTextEditorToggle = function() {
	this.richTextEditorToggleManager.insertRichTextEditorToggle(this);
};

View.prototype.populateRichTextEditorToggle = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].populateRichTextEditorToggle){
		this[this.resolveType(this.activeNode.type)].populateRichTextEditorToggle();
	}
};

View.prototype.updateRichTextEditorToggle = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateRichTextEditorToggle){
		this[this.resolveType(this.activeNode.type)].updateRichTextEditorToggle();
	}
};

View.prototype.cleanupRichTextEditorToggle = function() {
	this.richTextEditorToggleManager.cleanupRichTextEditorToggle();
};

/**
 * Adds links to show and hide a rich text editor for specified textarea and initializes
 * rich text editor on specified textarea
 * @param id The id of the textarea element on which to activate the rich text editor
 * @param callback A callback function to run when the rich text editor content changes
 */
View.prototype.addRichTextAuthoring = function(id,callback){
	var view = this;
	var target = $('#' + id); 
	
	// create rich text hide/show links div
	var richtextToggleDiv = $(document.createElement('div')).addClass('rtToggles');
	// create rich text hide and show links
	var richtextShow = $('<input type="radio" value="showRichText" id="showRich_' + id + '" name="promptToggle_' + id + '" checked="checked" /><label for="showRich_' + id + '">Rich Text</label>');
	var richtextHide = $('<input type="radio" value="hideRichText" id="hideRich_' + id + '" name="promptToggle_' + id + '" /><label for="hideRich_' + id + '">HTML</label>');
	
	richtextToggleDiv.append(richtextShow).append(richtextHide);
	
	// add rich text toggles to DOM
	richtextToggleDiv.insertBefore(target);
	
	// bind show/hide rich text link clicks
	$("input[name='promptToggle_" + id + "']").unbind('change');
	$("input[name='promptToggle_" + id + "']").change(function(){
		if ($("input[name='promptToggle_" + id + "']:checked").val()=='showRichText'){
			view.enableRichTextAuthoring(id,callback);
		} else if ($("input[name='promptToggle_" + id + "']:checked").val()=='hideRichText'){
			if(typeof tinymce != 'undefined' && target.tinymce()){
				target.tinymce().remove();
			}
		}
	});
	
	// create jQuery UI buttonset on rich text toggle radios
	richtextToggleDiv.buttonset();
	richtextToggleDiv.buttonset('refresh');
	
	// enable rich text editor for textarea
	this.enableRichTextAuthoring(id,callback);
};

/**
 * Enables rich text authoring for specified textarea
 * @param id The id of the textarea element on which to activate the rich text editor
 * @param callback A callback function to run when the rich text editor content changes
 */
View.prototype.enableRichTextAuthoring = function(id,callback) {
	var target = $('#' + id);
	var view = this;
	var plugins = "";
	if(view.resolveType(view.activeNode.type)=='HtmlNode'){
		plugins = "fullpage,preview,media,style,layer,table,advhr,advimage,advlist,advimagescale,loremipsum,image_tools,emotions,jqueryinlinepopups,tableextras,searchreplace,contextmenu,paste,directionality,fullscreen,visualchars,xhtmlxtras,template,wordcount";
	} else {
		plugins = "preview,media,style,layer,table,advhr,advimage,advlist,advimagescale,loremipsum,image_tools,emotions,jqueryinlinepopups,tableextras,searchreplace,contextmenu,paste,directionality,fullscreen,visualchars,xhtmlxtras,template,wordcount";
	}
	
	// enable rich text editing on prompt textarea
	target.tinymce({
		// Location of TinyMCE script
		script_url : '/vlewrapper/vle/jquery/tinymce/jscripts/tiny_mce/tiny_mce.js',

		// General options
		doctype : '<!DOCTYPE html>',
		theme : "advanced",
		//plugins : "fullpage,preview,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,jqueryinlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
		plugins: plugins,
		media_strict : false,
		media_dialog_defaults: {bgcolor : "#000000"},
		flash_video_player_absvideourl: false,
		flash_video_player_params: {wmode : "opaque", allowFullScreen : true, src : "/vlewrapper/vle/jquery/tinymce/jscripts/tiny_mce/plugins/media/moxieplayer.swf"},
		skin : "cirkuit",
		//media_use_script : true,
		//forced_root_block : false,
		//force_p_newlines : true,
		
        // Theme options
        theme_advanced_buttons1 : "undo,redo,|,forecolor,backcolor,bold,italic,underline,strikethrough,justifyleft,justifycenter,justifyright,justifyfull,bullist,numlist,outdent,indent",
        theme_advanced_buttons2 : "formatselect,fontselect,fontsizeselect,|,sub,sup,|,charmap,loremipsum,emotions,advhr",
        theme_advanced_buttons3 : "template,|,image,media,|,link,unlink,anchor,|,table,tablecontrols",
        theme_advanced_buttons4 : "cite,abbr,acronym,|,pastetext,pasteword,|,attribs,visualchars|,ltr,rtl,|,cleanup,preview,removeformat,|,search,replace,|,fullscreen,styleprops",//code,
        theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,

		// Example content CSS (should be your site CSS)
		content_css : "/vlewrapper/vle/jquery/tinymce/examples/css/content.css",

		// Drop lists for link/image/media/template dialogs
		//template_external_list_url : "lists/template_list.js",
		
		document_base_url: view.getProjectFolderPath(),
		//add onchange listener
		onchange_callback : function(ed){
			callback();
		},
		setup : function(ed){
			/* add keyUp listener*/
	        ed.onKeyUp.add(function(){
	        	callback();
	        });
	        //ed.onSetContent.add(function(){
	        	//callback();
	        //});
		},
		oninit: function(){
			//view.refreshNow();
		},
		file_browser_callback : 'fileBrowser'
	});
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

/*
 * StartSentence functions
 */

View.prototype.insertStarterSentenceAuthoring = function() {
	this.starterSentenceAuthoringManager.insertStarterSentenceAuthoring(this);
};

View.prototype.populateStarterSentenceAuthoring = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].populateStarterSentenceAuthoring){
		this[this.resolveType(this.activeNode.type)].populateStarterSentenceAuthoring();
	}
};

View.prototype.updateStarterSentenceAuthoring = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateStarterSentenceAuthoring){
		this[this.resolveType(this.activeNode.type)].updateStarterSentenceAuthoring();
	}
};

View.prototype.cleanupStarterSentenceAuthoring = function() {
	this.starterSentenceAuthoringManager.cleanupStarterSentenceAuthoring();
};


/*
 * LinkTo functions
 */

View.prototype.cleanupLinkTo = function() {
	this.linkManager.cleanupLinkTo();
};

/*
 * CRater functions
 */

/**
 * Inserts the CRater authoring items
 */
View.prototype.insertCRater = function() {
	this.cRaterManager.insertCRater(this);
};

/**
 * Populates the values in the CRater authoring items with the values
 * from the authored content
 */
View.prototype.populateCRater = function() {
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].populateCRater){
		this[this.resolveType(this.activeNode.type)].populateCRater();
	}
};

/**
 * Updates the CRater authored content
 */
View.prototype.updateCRater = function(){
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateCRater){
		this[this.resolveType(this.activeNode.type)].updateCRater();
	}
};

/**
 * The author changed the CRater item id
 */
View.prototype.cRaterItemIdChanged = function(){
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].cRaterItemIdChanged){
		this[this.resolveType(this.activeNode.type)].cRaterItemIdChanged();
	}
};

/**
 * Updates the CRater feedback
 */
View.prototype.updateCRaterFeedback = function(args){
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateCRaterFeedback){
		this[this.resolveType(this.activeNode.type)].updateCRaterFeedback(args);
	}
};

/**
 * Updates the CRater display feedback immediately value
 */
View.prototype.updateCRaterDisplayFeedbackImmediately = function(){
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateCRaterDisplayFeedbackImmediately){
		this[this.resolveType(this.activeNode.type)].updateCRaterDisplayFeedbackImmediately();
	}
};

/**
 * Updates the CRater display feedback immediately value
 */
View.prototype.updateCRaterDisplayScoreToStudent = function(){
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateCRaterDisplayScoreToStudent){
		this[this.resolveType(this.activeNode.type)].updateCRaterDisplayScoreToStudent();
	}
};

/**
 * Updates the CRater display feedback immediately value
 */
View.prototype.updateCRaterDisplayFeedbackToStudent = function(){
	if(this.easyMode && this[this.resolveType(this.activeNode.type)] && this[this.resolveType(this.activeNode.type)].updateCRaterDisplayFeedbackToStudent){
		this[this.resolveType(this.activeNode.type)].updateCRaterDisplayFeedbackToStudent();
	}
};

/**
 * Removes the CRater authoring items from the authorstep page and
 * clears input values
 */
View.prototype.cleanupCRater = function() {
	this.cRaterManager.cleanupCRater();
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_authorstep.js');
}