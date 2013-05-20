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

var descriptionLoaded = false; // wise4 var to indicate when extension has finished loading

svgEditor.addExtension("Description", function(S) {
	
	svgEditor.description = 'Enter text here....'; // initialize default description
	
	function setupDisplay(){
		
		svgEditor.toggleDescription = function(close){
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
		};
		
		var displaytext = '<div id="description"><div id="description_wrapper">'+
			'<div class="description_header" title="Click to edit"><div class="description_header_text"><span class="panel_title">Description:</span>'+
			' <span class="maximized">(Enter your text in the box below)</span><span class="minimized">(Click to add)</span>'+
			'</div><div class="description_buttons">'+
			'<a id="description_edit" title="Edit Description">Edit</a>'+
			'<button id="description_collapse" class="ui-button ui-state-default" title="Save">Save</button></div></div>'+
			'<textarea id="description_content" class="description_input"></textarea></div></div>';
		
		$('#workarea').append(displaytext);
		
		$('#description_content').on('keyup', function(event){
			var value = $('#description_content').val();
			if(value && value !== ''){
				$('#description span.minimized').text(value);
			} else {
				$('#description span.minimized').text('(Click to add)');
			}
			svgEditor.description = value;
			svgEditor.changed = true;
		});
		
		$('#description_edit, .description_header span').on('click', function(){
			svgEditor.toggleDescription(false);
		});
		
		$('#description_collapse').on('click', function(){
			svgEditor.toggleDescription(true);
		});
		
		//$('#workarea').css('bottom','100px');
		
		svgEditor.toggleDescription(true);
		
		descriptionLoaded = true;
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
			
			setupDisplay();
		}
	};
});