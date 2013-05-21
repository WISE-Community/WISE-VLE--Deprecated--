/*
 * ext-description.js
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2013 Jonathan Lim-Breitbart
 *
 * Allows users to add a description/annotation to their drawing
 * Requires 'ext-description.css' to be included in 'extension' directory
 * JQuery UI with dialogs and sliders plus accompanying css also required
 * 
 * TODO: i18n
 */

svgEditor.addExtension("Description", function(S) {
	
	// public extension variables and methods (accessible via svgEditor object)
	svgEditor.ext_description = {
		content: '', // String to store the description text
		loaded: false, // Boolean to indicate whether extension has finished loading
		/** 
		 * Sets the stored description text to the given value and updates the UI display
		 * 
		 * @param value String for description text
		 */
		set: function(value){
			this.content = value;
			if(value && value !== ''){
				$('#description span.minimized').text(value);
			} else {
				$('#description span.minimized').text('(Click to add)');
			}
			this.changed(value); // call description update listener
		},
		/** 
		 * Returns the stored description text
		 * 
		 * @param value String for description text
		 */
		get: function(){
			return this.content;
		},
		/**
		 * Toggles the UI to be maximized or minimized; Accessible via svgEditor object
		 * 
		 * @param close Boolean to indicate whether we should be closing the input field or not
		 */
		toggle: function(close){
			if(close){
				$('#description').css('height','30px');
				$('#description_content').hide();
				$('#description_edit').show();
				$('#description_collapse').hide();
				$('#description span.maximized').hide();
				$('#description span.minimized').show();
			}
			else {
				$('#description').css('height','125px');
				$('#description_content').css('height','75px').show().focus();
				$('#description_edit').hide();
				$('#description_collapse').show();
				$('#description span.minimized').hide();
				$('#description span.maximized').show();
			}
		},
		/**
		 * Listener function that is called when the description has been updated
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
		var displaytext = '<div id="description"><div id="description_wrapper">'+
			'<div class="description_header" title="Click to edit"><div class="description_header_text"><span class="panel_title">Description:</span>'+
			' <span class="maximized">(Enter your text in the box below)</span><span class="minimized">(Click to add)</span>'+
			'</div><div class="description_buttons">'+
			'<a id="description_edit" title="Edit Description">Edit</a>'+
			'<button id="description_collapse" class="ui-button ui-state-default" title="Save">Save</button></div></div>'+
			'<textarea id="description_content" class="description_input"></textarea></div></div>';
		
		// add extension UI components to page
		$('#workarea').append(displaytext);
		
		// save current description text on keyup events in the description content input field
		$('#description_content').on('keyup', function(event){
			var value = $('#description_content').val();
			svgEditor.ext_description.set(value);
			svgEditor.ext_description.changed(); // call extension update listener
			//svgEditor.changed = true;
		});
		
		// bind click events to toggle the description input display
		$('#description_edit, .description_header span').on('click', function(){
			svgEditor.ext_description.toggle(false);
		});
		$('#description_collapse').on('click', function(){
			svgEditor.ext_description.toggle(true);
		});
		
		svgEditor.ext_description.toggle(true);
		
		// set extension loaded variable to true and call extension loaded listener
		svgEditor.ext_description.loaded = true;
		svgEditor.ext_description.loadComplete();
	};
	
	return {
		name: "Description",
		callback: function() {
			//add extension css
			var csspath = 'extensions/ext-description.css';
			var fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", csspath);
			document.getElementsByTagName("head")[0].appendChild(fileref);
			
			setupDisplay(); // setup extension UI components and events
		}
	};
});