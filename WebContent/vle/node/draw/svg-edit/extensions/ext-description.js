/*
 * ext-description.js
 *
 * Licensed under the Apache License, Version 2
 *
 * Copyright(c) 2010 Jonathan Breitbart
 *
 * Allows users to add a description/annotation to their drawing
 * JQuery UI with dialogs and sliders plus accompanying css also required
 */

var descriptionLoaded = false; // wise4 var to indicate when extension has finished loading

svgEditor.addExtension("Description", function(S) {
	
	svgEditor.description = 'Enter text here....'; // initialize default description
	
	function setupDisplay(){
		
		var displaytext = '<div id="description"><div id="description_wrapper">'+
			'<div class="description_header"><div class="description_header_text">Description'+
			'<span>&nbsp(Enter your text in the box below)</span></div><div class="description_buttons">'+
			'<button id="description_edit" title="Edit Description">Edit</button>'+
			'<div id="description_collapse" style="display:none"><a title="Close">X</a></div></div></div>'+
			'<textarea id="description_content" class="description_input" rows="4"></textarea></div></div>';
		
		$('#svg_editor').append(displaytext);
		
		$('#description_content').keyup(function(){
			var value = $('#description_content').val();
			svgEditor.description = value;
		});
		
		$('#description_edit').click(function(){
			$('#description_content').focus();
		});
		
		$('#description_collapse').click(function(){
			svgEditor.toggleDescription(true);
		});
		
		$('#description_content').focus(function(){
			svgEditor.toggleDescription(false);
		});
		
		svgEditor.toggleDescription(true);
		
		descriptionLoaded = true;
	};
	
	svgEditor.toggleDescription = function(close){
		if(close){
			$('#workarea').css('bottom','98px');
			$('#description').css('height','74px');
			$('#description_content').css('height','15px');
			$('#description_edit').show();
			$('#description_collapse').hide();
			// resize window to fit canvas
			var height, width;
			if(window.outerHeight){
				height = window.outerHeight;
				width = window.outerWidth;
				window.resizeTo(width+1,height+1);
			} else { // for IE
				height = document.body.clientWidth; 
				width = document.body.clientHeight;
				self.resizeTo(width+1,height+1);
			}
		}
		else {
			$('#workarea').css('bottom','158px');
			$('#description').css('height','134px');
			$('#description_content').css('height','75px');
			$('#description_edit').hide();
			$('#description_collapse').show();
			// resize window to fit canvas
			var height, width;
			if(window.outerHeight){
				height = window.outerHeight;
				width = window.outerWidth;
				window.resizeTo(width-1,height-1);
			} else { // for IE
				height = document.body.clientWidth; 
				width = document.body.clientHeight;
				self.resizeTo(width-1,height-1);
			}
		}
	};
	
	return {
		name: "Description",
		callback: function() {
			//add extension css
			var csspath = '/vlewrapper/vle/node/draw/svg-edit/extensions/ext-description.css'; // corrected path for wise4
			var fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", csspath);
			document.getElementsByTagName("head")[0].appendChild(fileref);
			
			setupDisplay();
		}
	};
});