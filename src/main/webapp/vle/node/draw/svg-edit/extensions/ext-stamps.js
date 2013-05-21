/*
 * ext-stamps.js
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2013 Jonathan Lim-Breitbart
 *
 * Adds a stamp tool to svg-edit (an alternative to the built-in image tool)
 * Designed for use in the WISE4 learning environment (http://wise4.berkeley.edu)
 * 
 * Requires 'ext-stamps.css' to be included in 'extension' directory
 * 
 * TODO: i18n
 */
 
svgEditor.addExtension("Stamps", function(S) {
	var getNextId = S.getNextId,
		addSvgElementFromJson = S.addSvgElementFromJson,
		assignAttributes = S.assignAttributes,
		preventClickDefault = S.preventClickDefault,
		getElem = S.getElem,
		getId = S.getId,
		transformPoint = S.transformPoint;
	
	var activeStamp = null; // holds active stamp image
	// default stamp images
	var defaultStamps = [
	    {
		    "title": "Logo (SVG)",
		    "uri": "extensions/logo.svg",
		    "width": 50,
		    "height": 50
		},
		{
		    "title": "Logo (PNG)",
		    "uri": "extensions/logo.png",
		    "width": 50,
		    "height": 50
		}
	]; 
	
	// public extension variables and methods (accessible via svgEditor object)
	svgEditor.ext_stamps = {
		content: [], // Array to store the stamp images
		loaded: false, // Boolean to indicate whether extension has finished loading
		/** 
		 * Sets the stored prompt to the given value and updates the UI display
		 * 
		 * @param value String for prompt content
		 */
		set: function(images) {
			this.content = images;
			addStamps(images);
			this.changed(images); // call extension update listener
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
		 * Listener function that is called when the prompt content has been updated;
		 * Accessible via svgEditor object
		 * 
		 * @param value String for new prompt content
		 */
		changed: function(images){
			// optional: override with custom actions
		},
		/**
		 * Listener function that is called when the extension has fully loaded
		 */
		loadComplete: function(){
			// optional: override with custom actions
		}
	};
	
	function setActive(index){
		activeStamp = svgEditor.ext_stamps.content[index];
		$("#stamp" + index).addClass("tool_stamp_current");
		$('.tool_stamp').each(function(){
			var id = 'stamp' + index;
			if ($(this).attr("id") == id) {
				$(this).addClass("tool_stamp_current");
			} else {$(this).removeClass("tool_stamp_current");};
		});
		setPreview();
	}
	
	function setPreview(){
		var height = activeStamp.height;
		var width = activeStamp.width;
		
		$('#stamp_preview').attr('src',activeStamp.uri);
		setPreviewSize();
		
		// align stamp preview center point to cursor on mousemove
		$('#svgcanvas').on('mousemove', function(e){
			var mode = svgCanvas.getMode();
			if(mode == 'stamp'){
				var current_zoom = svgCanvas.getZoom();
				var offset = $('#workarea').offset();
				var width = activeStamp.width*current_zoom;
				var height = activeStamp.height*current_zoom;
				var x = e.pageX-offset.left-width/2;
				var y = e.pageY-offset.top-height/2;
				$('#stamp_preview').css({'left': x, 'top': y, 'cursor':'crosshair'});
				$('#stamp_preview').show();
			}
		});
		
		$('#svgcanvas').on('mouseleave', function(e){
			$('#stamp_preview').hide();
		});
	}
	
	function setPreviewSize(){
		if(activeStamp){
			var current_zoom = svgCanvas.getZoom();
			var height = activeStamp.height*current_zoom;
			var width = activeStamp.width*current_zoom;
			$('#stamp_preview').height(height).width(width);
		}
	}
	
	function addStamps(images){
		var stamps = images;
		for (var i=0; i<stamps.length; i++){
			var num = i*1 + 1;
			// add stamp preview image to stamp selector
			var stamptxt = "<img id='stamp" + i + "' class='tool_stamp' src='" + encodeURI(stamps[i].uri) + "' title='" + stamps[i].title + "' alt='Stamp " + num + "' />";
			$('#stamp_images').append(stamptxt);
			var height = stamps[i].height, width = stamps[i].width;
			if(height > width || height == width){
				if (height > 75){
					var zoom = 75/height;
					height = height * zoom;
					width = width * zoom;
				}
			} else if (width > height){
				if (width > 75){
					var zoom = 75/height;
					height = height * zoom;
					width = width * zoom;
				}
			}
			console.log ("h: " + height + ' width: ' + width);
			$('#stamp' + i).height(height).width(width);
		}
		// set first image as default (selected)
		setActive(0);
		$("#stamp_images > #0").addClass("tool_stamp_current");
		
		// bind click event to set selected stamp image
		$('.tool_stamp').on('click',function(){
			var index = $(this).attr('id');
			index = index.replace(/^stamp/,'');
			setActive(index);
			$('#tools_stamps').fadeOut("slow");
		});
		
		if(svgEditor.ext_stamps.loaded){
			// extension has already loaded, so call change listener
			svgEditor.ext_stamps.changed();
		} else {
			// set extension loaded variable to true and call extension loaded listener
			svgEditor.ext_stamps.loaded = true;
			svgEditor.ext_stamps.loadComplete();
		}
		
	}
	
	function setupDisplay(){
		// setup extension UI components
		var stampChooser = '<div id="tools_stamps">' +
			'<div class="tools_title">Choose a Stamp:</div>' +
			'<div id="stamp_images"></div>' +
			'</div>';
		var preview = '<img id="stamp_preview" />';
		
		// add extension UI components to page
		$('#svg_editor').append(stampChooser);
		$('#svgcanvas').append(preview);
		
		// close stamp chooser when user clicks on another tool
		$('.tool_button, .push_button').on('click', function(){
			if($(this).attr('id') !== 'tool_stamp'){
				if($('#tools_stamps').is(':visible')){
					$('#tools_stamps').hide();
				}
			}
		});
		
		svgEditor.ext_stamps.set(defaultStamps); // set initial stamp images
	}
	
	return {
		name: "Stamps",
		svgicons: "extensions/stamp.xml",
		buttons: [{
			id: "tool_stamp",
			type: "mode",
			title: "Stamp Tool", 
			events: {
				'click': function() {
					svgCanvas.setMode("stamp");
					var pos = $('#tool_stamp').offset();
					var w = $('#tool_stamp').outerWidth();
					$('#tools_stamps').css({'left': pos.left+w+6, 'top': pos.top - $('#tools_stamps').height()/2});
					if ($('#tools_stamps')) {
						$('#tools_stamps').toggle(); // show/hide stamp selector
					}
				}
			}
		}],
		callback: function() {
			//add extension css
			var csspath = 'extensions/ext-stamps.css';
			var fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", csspath);
			document.getElementsByTagName("head")[0].appendChild(fileref);
			
			setupDisplay();
		},
		zoomChanged: function(opts){
			setPreviewSize();
		},
		mouseDown: function(opts) {
			var mode = svgCanvas.getMode();
			var e = opts.event;
			var current_zoom = svgCanvas.getZoom(),
				x = opts.start_x / current_zoom,
				y = opts.start_y / current_zoom,
				canvasw = svgCanvas.getResolution().w / current_zoom,
				canvash = svgCanvas.getResolution().h / current_zoom;
			if(mode === 'stamp' && x>0 && x<canvasw && y>0 && y<canvash){ //wise4 - don't create new image if cursor is outside canvas boundaries - avoid extraneous elements
				svgCanvas.clearSelection(); // prevent image url dialog from opening when another image is selected and selectNew config option is set to false
				var xlinkns = "http://www.w3.org/1999/xlink";
				var newImage = addSvgElementFromJson({
					"element": "image",
					"attr": {
						"x": x-activeStamp.width/2,
						"y": y-activeStamp.height/2,
						'width': activeStamp.width,
						'height': activeStamp.height,
						"id": getNextId(),
						"opacity": svgCanvas.getFillOpacity(),
						"style": "pointer-events:inherit; display:none;" //hide stamp image initially, show it on mouseUp
					}
				});
				// set image uri to current stamp uri
        		newImage.setAttributeNS(xlinkns, "xlink:href", activeStamp.uri);
				
				$('#tools_stamps').fadeOut("slow");
					
				return {
					started: true
				};
			}
		},
		
		mouseUp: function(opts){
			var e = opts.event;
			var current_zoom = svgCanvas.getZoom(),
				x = opts.mouse_x / current_zoom,
				y = opts.mouse_y / current_zoom;
			var shape = getElem(getId());
			var mode = svgCanvas.getMode();
			if(mode === 'stamp'){
				// when adding an image (stamp), assign dimensions and coordinates without dragging (on mouse click)
				// image dimensions assigned from currStamp
				assignAttributes(shape,{
					'width': activeStamp.width,
					'height': activeStamp.height,
					'x': x-activeStamp.width/2,
					'y': y-activeStamp.height/2,
					"style": "pointer-events:inherit;"
				},1000);
				return {
					keep: true,
					element: shape,
					started: false
				};
			};
		}
		
	};
});