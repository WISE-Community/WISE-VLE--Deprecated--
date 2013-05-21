/*
 * ext-prompt.js
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2013 Jonathan Lim-Breitbart
 *
 * Adds a prompt/instructions tool to svg-edit
 * Requires 'ext-prompt.css' to be included in 'extension' directory
 * jQuery UI with dialogs plus accompanying css also required
 * TODO: i18n
 */
 
svgEditor.addExtension("Prompt", function(S) {
	
	var defaultPrompt = 'This is a prompt.'; // default prompt content
	
	// public extension variables and methods (accessible via svgEditor object)
	svgEditor.ext_prompt = {
		content: '', // String to store the prompt html content
		loaded: false, // Boolean to indicate whether extension has finished loading
		/** 
		 * Sets the stored prompt to the given value and updates the UI display
		 * 
		 * @param value String for prompt content
		 */
		set: function(value) {
			this.content = value;
			$('#prompt_content').html(value);
			this.changed(value); // call extension update listener
		},
		/** 
		 * Returns the stored prompt
		 * 
		 * @returns String representing prompt content
		 */
		get: function() {
			return this.content;
		},
		/**
		 * Listener function that is called when the prompt content has been updated
		 */
		changed: function(){
			// optional: override with custom actions
		},
		/**
		 * Listener function that is called when the extension has fully loaded
		 */
		loadComplete: function(){
			// optional: override with custom actions
		}
	};

	
	function setupDisplay(){
		// setup extension UI components
		var linktext = '<div id="tool_prompt" class="extension_link">' +
			'<a class="label tool_prompt" title="Review Instructions">Review Instructions</a>' +
			'<img class="tool_prompt" src="extensions/prompt.png" ' + // TODO: create svg icon
			'title="Review Instructions" alt="icon" />' +
			'</div>';
		var dialogtxt = '<div id="prompt_dialog" title="Instructions" style="display:none;">' +
			'<div id="prompt_content" class="ui-dialog-content-content"></div></div>';
		
		// add extension UI components to page
		$('#tools_top').append(linktext);
		$('#svg_editor').append(dialogtxt);
		
		// setup jQuery UI dialog to view prompt content
		$('#prompt_dialog').dialog({
			resizable: false,
			modal: true,
			autoOpen:false,
			width:650,
			buttons: [
				{
			    	text: 'OK',
			    	click: function() {
			    		$(this).dialog('close');
					}
			    }
			]
		});
		
		// bind link click event to open prompt dialog
		$('.tool_prompt').on('click', function(){
			$('#prompt_dialog').dialog('open');
		});
		
		svgEditor.ext_prompt.set(defaultPrompt); // set initial prompt content
		
		// set extension loaded variable to true and call extension loaded listener
		svgEditor.ext_prompt.loaded = true;
		svgEditor.ext_prompt.loadComplete();
	}
	
	return {
		name: "Prompt",
		callback: function() {
			//add extension css
			var csspath = 'extensions/ext-prompt.css';
			var fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", csspath);
			document.getElementsByTagName("head")[0].appendChild(fileref);
			
			setupDisplay(); // setup extension UI components and events
		}
	};
});