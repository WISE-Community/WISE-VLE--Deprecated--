/**
 * Sets the HtmlNode type as an object of this view
 * @constructor
 * @author patrick lawler
 */
View.prototype.HtmlNode = {};
View.prototype.HtmlNode.commonComponents = ['Prompt', 'LinkTo'];

View.prototype.HtmlNode.generatePage = function(view){
	this.view = view;
	this.view.activeNode.baseHtmlContent = createContent(this.view.getProject().makeUrl(this.view.activeContent.getContentJSON().src));
	
	var parent = document.getElementById('dynamicParent');
	
	/* wipe out old element */
	parent.removeChild(document.getElementById('dynamicPage'));
	
	/* create new elements */
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	parent.appendChild(pageDiv);
	pageDiv.appendChild(createElement(document, 'div', {id: 'promptContainer'}));
};

/**
 * Get the array of common components which is an array with
 * string elements being the name of the common component
 */
View.prototype.HtmlNode.getCommonComponents = function() {
	return this.commonComponents;
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.HtmlNode.updateContent = function(){
	/* update content object */
	this.view.activeNode.baseHtmlContent.setContent(document.getElementById('promptInput').value);
};

/**
 * Saves the html content to its file
 */
View.prototype.HtmlNode.save = function(close){
	var success = function(t,x,o){
		o.stepSaved = true;
		o.notificationManager.notify('Updated html content on server', 3);
		o.eventManager.fire('setLastEdited');
		if(close){
			o.eventManager.fire('closeOnStepSaved', [true]);
		};
	};
	
	var failure = function(t,x,o){
		o.notificationManager.notify('Failed update of html content on server', 3);
		if(close){
			o.eventManager.fire('closeOnStepSaved', [false]);
		};
	};
	
	// save .ht file and .html file
	/* get json content as string */
	var contentString = encodeURIComponent($.stringify(this.view.activeContent.getContentJSON(),null,3));

	this.view.connectionManager.request('POST', 3, this.view.requestUrl, {forward:'filemanager', projectId:this.view.portalProjectId, command:'updateFile', fileName:this.view.activeNode.content.getFilename(this.view.getProject().getContentBase()), data:contentString}, success, this.view, failure);
	this.view.connectionManager.request('POST', 3, this.view.requestUrl, {forward:'filemanager', projectId:this.view.portalProjectId, command:'updateFile', fileName:this.view.activeNode.baseHtmlContent.getFilename(this.view.getProject().getContentBase()), data:encodeURIComponent(document.getElementById('promptInput').value)}, success, this.view, failure);
};

View.prototype.HtmlNode.populatePrompt = function() {
	//var that = this;
	
	$('#promptInput').val(this.view.activeNode.baseHtmlContent.getContentString());
	
	/*$('textarea#promptInput').tinymce({
		document_base_url : that.view.authoringBaseUrl,
		// Location of TinyMCE script
		script_url : 'jquery/tiny_mce/tiny_mce.js',

		// General options
		theme : "advanced",
		plugins : "fullpage,autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",

		// Theme options
		theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,
		convert_urls : false,

		// Example content CSS (should be your site CSS)
		//content_css : "css/content.css",

		// Drop lists for link/image/media/template dialogs
		//template_external_list_url : "lists/template_list.js",
		//external_link_list_url : "lists/link_list.js",
		//external_image_list_url : "jquery/tiny_mce/getImageList.js",
		//media_external_list_url : "jquery/tiny_mce/getMediaList.js",
		
		onchange_callback : updateContent
	});
	
	function updateContent(inst) {
		var val = tinyMCE.activeEditor.getContent();
		$('#promptInput').val(val);
		eventManager.fire('stepPromptChanged');
	};*/
	
};

/**
 * Forwards updatePrompt to update content and calls sourceUpdated
 */
View.prototype.HtmlNode.updatePrompt = function(){
	this.updateContent();
	this.view.sourceUpdated();
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/html/authorview_html.js');
};