/*
 * ext-prompt.js
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2013 Jonathan Lim-Breitbart
 *
 * Adds a dialog to svg-edit that displays a prompt or instructions
 * 
 * Dependencies:
 * - Accompanying css file ('ext-prompt.css' should be included in 'extensions' directory)
 * - jQuery UI with dialogs plus accompanying css
 * - Icon for link to open prompt (prompt.png)
 * 
 * TODO: i18n
 */
 
svgEditor.addExtension("Prompt", function(S) {
	
	/* Private variables */
	var content = 'This is a prompt.', // String to store the prompt html content
		loaded = false; // Boolean to indicate whether extension has finished loading
	
	/* Private functions */
	function setContent(value){
		$('#prompt_content').html(value);
		
		if(!loaded){
			// on first load, set extension loaded variable to true and call extension loaded listener
			loaded = true;
			svgEditor.ext_stamps.loadComplete();
		}
	}
	
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
		
		setContent(content); // set initial prompt content
	}
	
	/* Public API (accessible via svgEditor object) */
	svgEditor.ext_prompt = {
		/** 
		 * Gets or sets the stored prompt text and updates the UI display
		 * 
		 * @param value String prompt content
		 * @returns String prompt content
		 * @returns Object this
		 */
		content: function(_){
			if(!arguments.length){ return content; } // no arguments, so return content
			
			if(typeof _ === 'string'){
				content = _;
				setContent(_);
				this.changed(); // call content update listener
			}
			return this;
		},
		/** 
		 * Gets whether extensions has completely loaded
		 * 
		 * @returns Boolean
		 */
		isLoaded: function(){
			return loaded;
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