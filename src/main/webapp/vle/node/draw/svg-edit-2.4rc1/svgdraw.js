// TODO: Comment me more thoroughly!

function SVGDRAW(node) {
	this.node = node;
	this.content = node.getContent().getContentJSON();
	
	this.svgCanvas = null;
	this.teacherAnnotation = "";		
	this.defaultImage = ""; // svg string to hold starting (or background) svg image
	this.stamps  =  []; // array to hold stamp paths
	this.snapshotsActive  =  false; // boolean to specify whether snapshots are active
	this.snapshots  =  []; // array to hold snapshots
	this.snapsAllowed = 10; // by default, set number of snapshots allowed to 10
	this.descriptionActive =  false; // boolean to specify whether student annotations/descriptions are active
	this.description  =  ""; // string to hold annotation/description text
	this.defaultDescription = ""; // string to hold starting description text
	this.instructions = ""; // string to hold prompt/instructions text
	this.active = -1; // var to hold last selected snapshot.id
	this.index = null; // var to hold currently selected snapshot
	this.warningStackSize = 0;
	this.selected = false; // boolean to specify whether a snapshot is currently selected
	this.warning = false;  // boolean for initial (load) warning state (if snapshots have been saved, not currently selected)
	this.snapTotal = 0; // var to hold total number of snapshots created
	this.playback = "pause"; // var to specify whether snapshot playback mode is active
	this.lz77 = new LZ77(); // lz77 compression object
	
	// json object to hold student data for the node
	this.studentData = {
					"svgString": "",
					"description": "",
					"snapshots": [],
					"snapTotal": 0,
					"selected": null
					};
	this.init(node.getContent().getContentUrl());
}

function Snapshot(svg, id, context){
	this.svg = svg;
	this.id = id;
	//if(context.description != ""){
		//this.description = context.description;  // set snapshot initial description to current
	//}
	//else {
		this.description = context.defaultDescription;
	//}
}

SVGDRAW.prototype.init = function(jsonURL) {
	this.svgCanvas = svg_edit_setup(); // create new svg canvas
	put_locale(this.svgCanvas);
	this.loadModules(jsonURL, this);  // load the background and stamps
};


SVGDRAW.prototype.loadModules = function(jsonfilename, context) {
	
	$.getJSON(jsonfilename, 
		function(data){
			if(data.stamps){
				for (var item in data.stamps) {
					//context.stamps.push(images[item].uri);
					context.stamps.push(data.stamps[item]);
				};
			}
			
			if(data.snapshots_active){
				context.snapshotsActive = data.snapshots_active;
			}
			if(data.description_active){
				context.descriptionActive = data.description_active;
			}
			if(data.description_default) {
				context.defaultDescription = data.description_default;
			}
			if(data.prompt){
				context.instructions = data.prompt;
			}
			if(data.svg_background){
				context.defaultImage = data.svg_background;
			}				
			 var myDataService = new VleDS(vle);
		 	   // or var myDataService = new DSSService(read,write);
			 context.setDataService(myDataService);
			 context.load();   // load preview data, if any, or load default background
		}
	);
};


SVGDRAW.prototype.setDataService = function(dataService) {
	// register VLE Data Service to the svgCanvas object so that
	// it can save back to vle's persistence mechanism.
	this.dataService=dataService;
};


SVGDRAW.prototype.loadCallback = function(studentWorkJSON, context) {
		var annotationValue;
		// check for previous work and load it
		var svgString;
		if (studentWorkJSON){
			try {
				svgString = studentWorkJSON.svgString;
			} catch(err) {
				svgString = studentWorkJSON;
			}
			// check whether svg string was compressed (for backwards compatibility)
			//if($.isArray(svgString)){
				//svgString = context.decompress(svgString);
			//}
			context.svgCanvas.setSvgString(svgString);
			
			if(context.dataService.vle.getConfig().getConfigParam('mode') == 'run'){
				//check if annotations were retrieved
				if(context.dataService.vle.annotations != null) {
					//see if there were any annotations for this step
					var annotation = context.dataService.vle.annotations.getLatestAnnotationForNodeId(context.dataService.vle.getCurrentNode().id);
					if (annotation != null) {
						var annotationValue = annotation.value;
						//annotationValue = '<g><title>teacher</title><text xml:space="preserve" text-anchor="middle" font-family="serif" font-size="24" stroke-width="0" stroke="#000000" fill="#000000" id="svg_3" y="55.5" x="103">annotation</text></g>';
						this.teacherAnnotation = annotationValue;
						context.svgCanvas.setSvgString(svgString.replace("</svg>", this.teacherAnnotation + "</svg>"));
						context.svgCanvas.setCurrentLayer('Layer 1');
					}
				}
	
				var processGetDrawAnnotationResponse = function(responseText, responseXML) {
					//parse the xml annotations object that contains all the annotations
					var annotation = annotations.getLatestAnnotationForNodeId(context.dataService.vle.getCurrentNode().id);
					vle.annotations;
					var annotationValue = annotation.value;
					//annotationValue = '<g><title>teacher</title><text xml:space="preserve" text-anchor="middle" font-family="serif" font-size="24" stroke-width="0" stroke="#000000" fill="#000000" id="svg_3" y="55.5" x="103">annotation</text></g>';
					context.svgCanvas.setSvgString(svgString.replace("</svg>", annotationValue + "</svg>"));
					context.svgCanvas.setCurrentLayer('Layer 1');
				};
				//context.dataService.vle.connectionManager.request('GET', 3, 'http://localhost:8080/vlewrapper/vle/echo.html', {}, processGetDrawAnnotationResponse);
				
				var getAnnotationsParams = {
												runId: context.dataService.vle.getConfig().getConfigParam('runId'),
												toWorkgroup: context.dataService.vle.getUserAndClassInfo().getWorkgroupId(),
												fromWorkgroup: context.dataService.vle.getUserAndClassInfo().getTeacherWorkgroupId(),
												periodId: context.dataService.vle.getUserAndClassInfo().getPeriodId()
										   };
				
				//get all the annotations (TODO: uncomment when using webapp/portal)
				//context.dataService.vle.connectionManager.request('GET', 3, context.dataService.vle.getConfig().getConfigParam('getAnnotationsUrl'), getAnnotationsParams, processGetDrawAnnotationResponse);
			}

		} else if (context.defaultImage){ // if no previous work, load default (starting) drawing
			var svgString = context.defaultImage.replace("</svg>", "<g><title>student</title></g></svg>"); // add blank student layer
			context.svgCanvas.setSvgString(svgString);
		}
		
		context.initDisplay(studentWorkJSON,context); // initiate stamps, description, snapshots
};

SVGDRAW.prototype.saveToVLE = function() {
	// strip out annotations
	if (this.teacherAnnotation != "") {
		svgStringToSave = svgStringToSave.replace(this.teacherAnnotation, "");
	}
	//this.studentData.svgString = this.compress(this.svgCanvas.getSvgString());
	this.studentData.svgString = this.svgCanvas.getSvgString();
	this.studentData.description = this.description;
	this.studentData.snapshots = this.snapshots;
	this.studentData.snapTotal = this.snapTotal;
	if(this.selected == true){
		this.studentData.selected = this.active;
	} else {
		this.studentData.selected = -1;
	}
	var data = this.studentData;
	this.dataService.save(data);
};

SVGDRAW.prototype.load = function() {
	this.dataService.load(this, this.loadCallback);	
};

// populate instructions, stamp images, description/annotation text, and snapshots (wise4)
SVGDRAW.prototype.initDisplay = function(data,context) {
	if(data.snapTotal){
		context.snapTotal = data.snapTotal;	
	}
	// initiate prompt/instructions
	if(context.instructions && context.instructions != ""){
		$('#prompt_text').html(context.instructions);
		
		$('#prompt_dialog').dialog({
			bgiframe: true,
			resizable: false,
			modal: true,
			autoOpen:false,
			width:400,
			buttons: {
				'OK': function() {
					$(this).dialog('close');
				}
			}
		});

		$('#tool_prompt').click(function(){
			$('#prompt_dialog').dialog('open');
		});
		
		$('#tool_prompt').attr("style","display:inline");
		
		if(!vle.getLatestStateForCurrentNode()){
			$('#prompt_dialog').dialog('open');
		}
	}
	
	//initiate snapshots
	if(context.snapshotsActive == true){
		$('#tool_snapshot').attr("style","display:inline");
		
		if(data.snapshots && data.snapshots.length > 0){
			for (var i=0; i<data.snapshots.length; i++) {
				context.snapshots.push(data.snapshots[i]);
				var current = context.snapshots[i].svg;
				context.addSnapshot(current,i,context); // add snap to snapshot panel
			};
			if(data.selected > -1){
				context.active = data.selected;
				context.selected = true;
				for(var i=0; i<data.snapshots.length; i++){
					if(data.snapshots[i].id == context.active){
						context.index = i;
						context.snapCheck(context);
						// scroll snap images panel depending on selected snapshot
						//TODO: Figure out why this isn't working
						var page = Math.floor(context.index/3);
						$("#snap_images").attr({ scrollTop: page * 375 });
					}
				}
			} else {
				context.warning = true;
			}
		}
		
		if (context.descriptionActive=='false'){
			$('#snap_description_wrapper').hide();
		}
		
		$('#new_snap_dialog').dialog({
			bgiframe: true,
			resizable: false,
			modal: true,
			autoOpen:false,
			buttons: {
				'Yes': function() {
					context.newSnapshot(context);
					$(this).dialog('close');
				},
				Cancel: function() {
					$(this).dialog('close');
				}
			}
		});

		$('.snapshot_new').click(function(){
			context.checkSnapshots(context);
			//$('#new_snap_dialog').dialog('open');
		});
		
		$('#snapwarning_dialog').dialog({
			bgiframe: true,
			resizable: false,
			modal: true,
			autoOpen:false,
			width:490,
			buttons: {
				'Continue': function() {
					context.openSnapshot(context.index,true,context);
					$(this).dialog('close');
				},
				Cancel: function() {
					$(this).dialog('close');
				}
			}
		});
		
		$('#snapnumber_dialog').dialog({
			bgiframe: true,
			resizable: false,
			modal: true,
			autoOpen:false,
			width:420,
			buttons: {
				'OK': function() {
					$(this).dialog('close');
				}
			}
		});
		
		$('#deletesnap_dialog').dialog({
			bgiframe: true,
			resizable: false,
			modal: true,
			autoOpen:false,
			width:350,
			buttons: {
				'Yes': function() {
					if ($(".snap:eq(" + context.index + ")").hasClass("hover")) {
						context.warning = true;
						$('#snap_description_wrapper').hide();
					}
					context.snapshots.splice(context.index,1);
					$(".snap:eq(" + context.index + ")").fadeOut(1000, function(){$(this).remove()});
					$(this).dialog('close');
					setTimeout(function(){
						context.snapCheck(context);
			    		context.updateNumbers();
						if(context.snapshots.length < 2){
							$('#playback').hide();
						}
			    	},1100);
				},
				Cancel: function() {
					$(this).dialog('close');
					context.snapCheck(context);
					$(".snap:eq(" + context.index + ")").click(function(){context.snapClick(this,context);}, 300);
				}
			}
		});
		
		// initialize playback speed slider
		$('#play_speed').slider({
			max: 10,
			min: 1,
			step: 1,
			value: 1,
			slide: function(event, ui) {
				context.changeSpeed(ui.value,context);
			}
		});
		
		context.changeSpeed($('#play_speed').slider('value'),context); // update playback speed
		
		// Bind snapshot playback controls
		$('img.snap_controls').click(function(){
			var mode = $(this).attr('id');
			var speed = 1000/$('#play_speed').slider('value');
			context.snapPlayback(mode,speed,context);
		});
		
		context.warningStackSize = 0; // set warning stack checker to 0 on intial load
		
		// bind mouseup events to snap checker function
		$("#tools_top,#tools_left,#svgcanvas,#close_snapshots,#tools_bottom").mouseup(function(){
			setTimeout(function(){
				context.snapCheck(context);
			},50);
		});
	}
	
	// initiate description/annotation
	if(context.descriptionActive == true){
		if (context.snapshotsActive == true) { // check whether snapshots are active
			// TODO: Check if this is necessary - context.description should already be set correctly
			if (data.selected > -1) {
				for (var i=0; i<data.snapshots.length; i++) {
					if (data.snapshots[i].id == data.selected) {
						context.description = data.snapshots[i].description;
					}
				}
			} else /*if (context.defaultDescription!="")*/ {
				//context.description = context.defaultDescription;
				$('#snap_description_wrapper').hide();
				$('#draw_description_wrapper').hide();
			}
			
			$('#snap_description_content').keyup(function(){
				$('#snap_description_commit').removeAttr("disabled");
			});
			
			// Save description text
			$('#snap_description_commit').click(function(){
				var value = $('#snap_description_content').val();
				$('#draw_description_content').html(value);
				for (var i=0; i<context.snapshots.length; i++) {
					if (context.snapshots[i].id == context.active) {
						context.snapshots[i].description = value;
						$(this).attr("disabled", "disabled");
					}
				}
			});
			$('#edit_description').click(function(){
				$('#tool_snapshot').click();
				$('#snap_description_content').focus();
			});
			$('#draw_description_header').text('Snapshot Description:');
			$('#draw_description_content').css('width',440);
			$('#snap_description_commit').attr("disabled", "disabled");
		} else {
			$('#snap_description_wrapper').hide();
			if(data.description && data.description!=""){
				context.description = data.description;
				$('#draw_description_content').html(data.description);
				$('#show_description').click();
				// TODO: Once Firefox supports text-overflow css property, remove this (and jquery.text-overflow.js plugin)
				$('#draw_description_content').ellipsis();
			} else if (context.defaultDescription!="") {
				context.description = context.defaultDescription;
				$('#draw_description_content').html(context.defaultDescription);
			}
			
			// Show description panel on link click
			$('#tool_description, #edit_description').click(function(){
				if (!$('#descriptionpanel').is(':visible')) { // prevent text from being overridden if panel is already visible
					$('#description_commit').attr("disabled", "disabled");
					$('#description_close').attr("disabled", "disabled");
					$('#description_content').val(context.description); // populate description text
					// center description panel in window
					var height = $('#descriptionpanel').height();
					var width = $('#descriptionpanel').width();
					$('#descriptionpanel').css({
						top: $(window).height() / 2 - height / 2,
						left: $(window).width() / 2 - width / 2
					});
					$("#overlay").show();
					$('#descriptionpanel').show(); // show description panel
				}
			});
			
			$('#edit_description').click(function(){
				$('#description_content').focus();
			});
			
			// Save description text
			$('#description_commit').click(function(){
				var value = $('#description_content').val();
				context.description = value;
				//if(value!="" && value!=context.defaultDescription){
					$('#draw_description_content').html(value);
					// TODO: Once Firefox supports text-overflow css property, remove this (and jquery.text-overflow.js plugin)
					$('#show_description').click();
					$('#draw_description_content').ellipsis();
				//}
				$(this).attr("disabled", "disabled");
			});
			
			// Save description text and close dialogue
			$('#description_close').click(function(){
				var value = $('#description_content').val();
				context.description = value;
				//if(value!="" && value!=context.defaultDescription){
					$('#draw_description_content').html(value);
					// TODO: Once Firefox supports text-overflow css property, remove this (and jquery.text-overflow.js plugin)
					$('#show_description').click();
					$('#draw_description_content').ellipsis();
				//}
				$('#descriptionpanel').hide();
				$("#overlay").hide();
			});
			
			$('#description_content').keyup(function(){
				$('#description_commit').removeAttr("disabled");
				$('#description_close').removeAttr("disabled");
			});
			
			$('#close_description').click(function(){
				$('#descriptionpanel').hide();
				$("#overlay").hide();
			});
			
			$('#tool_description').attr("style", "display:inline"); // show add description link/button
		}
	} else if(context.descriptionActive == false){
		$('#snap_description_wrapper').hide();
		$('#draw_description_wrapper').hide();
	}
	
	//initiate stamps
	if(context.stamps.length > 0){
		this.svgCanvas.setStampImages(context.stamps);
		var stamptxt = "";
		for (var i=0; i<context.stamps.length; i++){
			var num = i*1 + 1;
			//stamptxt += "<img id='" + i + "' class='tool_image' title='" + context.stamps[i].title + "' src=" + context.stamps[i].uri + " alt='Stamp " + num + "' height='" + height + "' width= '" + width + "'></div>";
			// max stamp preview image height and width are hard-coded in css now (max 50px)
			stamptxt += "<img id='" + i + "' class='tool_image' title='" + context.stamps[i].title + "' src=" + context.stamps[i].uri + " alt='Stamp " + num + "' />";
		}
		$('#stamp_images').append(stamptxt);
		// set first image as default (selected)
		this.svgCanvas.setStamp(0);
		context.setStampPreview(0,context);
		$("#stamp_images > #0").addClass("tool_image_current");
		
		// bind click event to set selected stamp image (wise4)
		$('.tool_image').click(function(){
			var index = $(this).attr('id');
			context.svgCanvas.setStamp(index);
			$('.tool_image').each(function(i){
				if ($(this).attr("id") == index) {
					$(this).addClass("tool_image_current");
				} else {$(this).removeClass("tool_image_current");};
			});
			context.setStampPreview(index,context);
			$('#tools_stamps').fadeOut("slow");
		});
	} else {
		$('#tool_image').hide(); // if no stamps are defined, hide stamp tool button
	}
	
	var drawlimittxt = '<div id="drawlimit_dialog" title="Drawing is Too Big">' +
		'<div class="ui-state-error"><span class="ui-icon ui-icon-alert" style="float:left"></span>' +
		'Warning! Your current drawing is too large.</div>' +
		'<div class="ui-dialog-content-content">If you would like to save this drawing, please delete some of the items in the picture.  Thank you!' +
		'</div></div>';
	
	$('#svg_editor').append(drawlimittxt);
	
	$('#drawlimit_dialog').dialog({
		bgiframe: true,
		resizable: false,
		modal: true,
		autoOpen:false,
		width:420,
		buttons: {
			'OK': function() {
				$(this).dialog('close');
			}
		}
	});
	
	// whenever user has modified drawing canvas, check whether current drawing is too large (>20k)
	// TODO: add text tool changes to this code
	$("#svgcanvas").mouseup(function(){
		setTimeout(function(){
			var mode = context.svgCanvas.getMode();
			if(mode != "select" && mode != "multiselect" && mode != "zoom" && mode != "path"){
				context.checkDrawSize(context);
			}
		},60);
	});
	
	// reset undo stack
	this.svgCanvas.resetUndo();
	$("#tool_undo").addClass("tool_button_disabled");
};

SVGDRAW.prototype.checkDrawSize = function(context){
	var current = context.svgCanvas.getSvgString();
	var compressed = context.lz77.compress(current);
	//alert(current.length*2 + ' ' + compressed.length * 2);
	// if compressed svg string is larger than 20k, alert user and undo latest change
	if(compressed.length * 2 > 20480){
		$('#drawlimit_dialog').dialog('open');
		$('#tool_undo').click();
	}
};
	
SVGDRAW.prototype.checkSnapshots = function(context) {
	if (context.snapshots.length >= context.snapsAllowed) {
		$('#snapnumber_dialog').dialog('open');
		return;
	}
	$('#new_snap_dialog').dialog('open');
};

SVGDRAW.prototype.newSnapshot = function(context) {
	var current = context.svgCanvas.getSvgString();
	//compress snapshot svgstring for data storage
	//var compressed = "--lz77--" + context.lz77.compress(current);
	var id = context.snapTotal;
	//var newSnap = new Snapshot(compressed,context.snapTotal,context);
	var newSnap = new Snapshot(current,context.snapTotal,context);
	context.snapshots.push(newSnap);
	context.snapTotal = id*1 + 1;
	var num = context.snapshots.length-1;
	context.warningStackSize = context.svgCanvas.getUndoStackSize();
	context.active = id;
	context.index = num;
	context.selected = true;
	context.warning = false;
	context.addSnapshot(current,num,context);
	context.description = context.descriptionDefault;
	setTimeout(function(){
		context.snapCheck(context);
	},100);
	$('#snap_description_commit').attr("disabled","disabled");
};

SVGDRAW.prototype.addSnapshot = function(svgString,num,context) {
	context.warningStackSize = context.svgCanvas.getUndoStackSize();
	var res = context.svgCanvas.getResolution();
	var multiplier = 150/res.w;
	var snapHeight = res.h * multiplier;
	var snapWidth = 150;
	var snapNum = num*1 + 1;
	var snapHolder = '<div class="snap" title="Click to Open; Click and Drag to Reorder">' +
	'<div class="snap_wrapper"></div>' + 
	'<div class="snap_delete" title="Delete Snapshot"><span>X</span></div>' +
	'<div class="snap_num"><span>' + snapNum + '</span></div>' +
	'</div>';
	$("#snap_images").append(snapHolder);
	
	// create snapshot thumb
	// TODO: Edit regex code to remove hard-coded width and height (600, 450) if we decide to allow authors to specify canvas dimensions
	var snapshot = svgString.replace('<svg width="600" height="450"', '<svg width="' + snapWidth + '" height="' + snapHeight + '"');
	snapshot = snapshot.replace(/<g>/gi,'<g transform="scale(' + multiplier + ')">');
	var snapSvgXml = text2xml(snapshot);
	var $snap = $("div.snap:eq(" + num + ")");
	context.bindSnapshot($snap,context); // Bind snap thumbnail to click function that opens corresponding snapshot
	document.getElementsByClassName("snap_wrapper")[num].appendChild(document.importNode(snapSvgXml.documentElement, true)); // add snapshot thumb to snapshots panel
	$("#snap_images").attr({ scrollTop: $("#snap_images").attr("scrollHeight") });
	$(".snap:eq(" + num + ")").effect("pulsate", { times:1 }, 800);
	if(context.snapshots.length > 1){
		$('#playback').show();
	}
	//context.updateClass(context.index,context);
	//setTimeout(function(){
		//context.snapCheck(context);
	//},100);
};

// Open a snapshot as current drawing
SVGDRAW.prototype.openSnapshot = function(index,pulsate,context) {
	$('#svgcanvas').stop(true,true); // stop and remove any currently running animations
	$('#snap_description_content').blur();
	var snap = context.snapshots[index].svg;
	// check whether snap svg string was previously compressed (for backwards compatibility)
	/*if(context.snapshots[index].svg.match(/^--lz77--/)){ // check whether data has been previously compressed (for backwards compatibilty)
		snap = context.snapshots[index].svg.replace("--lz77--","");
		snap = context.lz77.decompress(snap);
	} else {
		snap = context.snapshots[index].svg;
		// compress snap svg string if it hasn't already been
		context.snapshots[index].svg = "--lz77--" + context.lz77.compress(context.snapshots[index].svg);
	}*/
	context.svgCanvas.setSvgString(snap);
	if($('#sidepanels').is(':visible')){
		context.svgCanvas.setZoom(.75);
	}
	context.svgCanvas.resetUndo(); // reset the undo/redo stack
	context.warningStackSize = 0;
	$("#tool_undo").addClass("tool_button_disabled");
	if (pulsate==true){
		$('#svgcanvas').effect("pulsate", {times: '1'}, 700); // pulsate new canvas
	}
	context.selected = true;
	context.index = index;
	context.active = context.snapshots[index].id;
	if(context.descriptionActive==true){
		context.description = context.snapshots[index].description;
		$('#snap_description_content').val(context.description);
		if(context.playback=='pause'){
			$('#snap_description_wrapper').show();
			$('#draw_description_wrapper').show();	
		}
	}
	context.updateClass(context.index,context);
	context.warning = false;
	$('#snap_description_commit').attr("disabled","disabled");
};

// Bind snapshot thumbnail to click function that opens corresponding snapshot, delete function, hover function, sorting function
SVGDRAW.prototype.bindSnapshot = function(item,context) {
	$(item).click(function(){context.snapClick(this,context);});
	
	$(item).hover(
		function () {
			if (!$(this).hasClass("active")){
				$(this).addClass('hover');
				$(this).children('.snap_delete').css("opacity",".75");
				$(this).children('.snap_num').css("opacity",".75");
			}
		}, 
		function () {
			if (!$(this).hasClass("active")){
				$(this).children('.snap_delete').css("opacity",".5");
				$(this).children('.snap_num').css("opacity",".5");
				$(this).removeClass('hover');
			}
		}
	);
	
	$(item).children(".snap_delete").click(function(){context.deleteClick(this,context);});
	
	// TODO: Make this sortable binder initiate only once (after first snapshot has been saved)
	$("#snap_images").sortable({
		start: function(event, ui) {
			context.index = $(".snap").index(ui.item);
			ui.item.unbind("click"); // unbind click function
			$("#svgcanvas").stopTime('play'); // stop snap playback
	    },
	    stop: function(event, ui) {
	        setTimeout(function(){
	        	ui.item.click(function(){context.snapClick(this,context);}); // rebind click function
	        }, 300);
	    },
	    update: function(event, ui) {
	    	var newIndex = $(".snap").index(ui.item);
	    	// reorder snapshots array
	    	var current = context.snapshots.splice(context.index,1);
	    	context.snapshots.splice(newIndex,0,current[0]);
	    	setTimeout(function(){
	    		context.updateNumbers();  // reorder snapshot thumbnail labels
	    	},400);
	    },
	    opacity: .6,
	    placeholder: 'placeholder'
	});

};

SVGDRAW.prototype.deleteClick = function(item,context){
	$(item).parent().unbind("click");
	var index = $(".snap_delete").index(item);
	context.index = index;
	$("#deletesnap_dialog").dialog('open');
};

SVGDRAW.prototype.snapClick = function(item,context){
	context.index = $("div.snap").index(item);
	if(context.warningStackSize == context.svgCanvas.getUndoStackSize() && context.warning == false){
		context.openSnapshot(context.index,true,context);
	} else {
		$('#snapwarning_dialog').dialog("open");
	}
};

SVGDRAW.prototype.updateClass = function(num,context){
	$(".snap").each(function(index){
		if(index != num){
			$(this).removeClass("hover active");
			$(this).children(".snap_delete").css("opacity",".5");
			$(this).children(".snap_num").css("opacity",".5");
		} else {
			$(this).addClass("hover active");
			$(this).children(".snap_delete").css("opacity","1");
			$(this).children(".snap_num").css("opacity","1");
		}
	});
};

SVGDRAW.prototype.snapCheck = function(context){
	if(context.playback == "pause"){
		if(context.warningStackSize == context.svgCanvas.getUndoStackSize()){
			for (var i=0; i<context.snapshots.length; i++){
				if(context.snapshots[i].id == context.active){
					context.index = i;
					if(context.descriptionActive == true){
						// show corresponding description text
						$('#snap_description_content').val(context.snapshots[i].description);
						$('#draw_description_content').html(context.snapshots[i].description);
						$('#snap_description_wrapper').show();
						$('#draw_description_wrapper').show();
						if (!$('#sidepanels').is(':visible')) {
							$('#show_description').click();
						}
					}
					break;
				}
				else {
					context.index = -1;
				}
			}
			context.selected = true;
			context.updateClass(context.index,context);
		} else {
			context.selected = false;
			if (context.descriptionActive == true) {
				if (!$('#sidepanels').is(':visible')) {
					$('#hide_description').click();
				}
				$('#snap_description_wrapper').hide();
				$('#draw_description_wrapper').hide();
			}
			context.updateClass(-1,context);
		}
	}
};

SVGDRAW.prototype.snapPlayback = function(mode,speed,context){
	var index = 0;
	if(context.selected == true){
		for (var i=0; i<context.snapshots.length; i++) {
			if (context.snapshots[i].id == context.active) {
				index = i*1+1;
			}
		}
		if (index > context.snapshots.length - 1) {
			index = 0;
		}
	}
	if (mode=='play' || mode=='loop'){
		if(mode=='play'){
			context.playback = 'play';
		} else {
			context.playback = 'loop';
		}
		$('.snap').unbind('click'); // unbind snap click function
		$('.snap_delete').unbind('click'); // unbind delete click function
		$('#snap_images').sortable('disable');
		$('#play').hide();
		$('#loop').hide();
		if(context.descriptionActive == true){
			$('#snap_description_wrapper').hide();
			$('#draw_description_wrapper').hide();
		}
		$('#pause').attr("style","display:inline !important");
		$("#svgcanvas").everyTime(speed,'play',function(){
			context.openSnapshot(index,false,context);
			var page = Math.floor(index/3);
			$("#snap_images").attr({ scrollTop: page * 375 });
			index = index+1;
			if(index > context.snapshots.length-1){
				if(mode=="loop"){
					index = 0;
				} else {
					context.snapPlayback("pause",speed,context);
				}
				
			}
		},0);
	} else if (mode=="pause") {
		$("#svgcanvas").stopTime('play');
		context.playback = 'pause';
		context.snapCheck(context);
		$('#pause').attr("style","display:none !important");
		$('#play').attr("style","display:inline");
		$('#loop').attr("style","display:inline");
		setTimeout(function(){
        	$('.snap').click(function(){context.snapClick(this,context);}); // rebind snap click function
        	$('.snap_delete').click(function(){context.deleteClick(this,context);}); // rebind delete click function
        	$('#snap_images').sortable('enable');
        }, 300);
	}
};

SVGDRAW.prototype.changeSpeed = function(value, context){
	var speed = 1000/value;
	if (value == 1){
		var label = value + " snap/sec";
	} else {
		var label = value + " snaps/sec";
	}
	$('#current_speed').text(label); // update speed display
	if(context.playback != 'pause'){ // if in playback mode, change current playback speed
		$("#svgcanvas").stopTime('play');
		if(context.playback=='play'){
			context.snapPlayback('play',speed,context);
		} else if (context.playback=='loop'){
			context.snapPlayback('loop',speed,context);
		}
		
	}
};

SVGDRAW.prototype.updateNumbers = function(){
	$(".snap_num > span").each(function(index){
		var num = "" + (index*1 + 1);
		$(this).text(num);
	});
};

SVGDRAW.prototype.setStampPreview = function(index, context){
	var height = context.stamps[index].height;
	var width = context.stamps[index].width;
	$('#stamp_preview').attr('src',context.stamps[index].uri);
	$('#svgcanvas').mousemove(function(e){
		if (context.svgCanvas.getMode() == 'image') {
			if($('#sidepanels').is(':visible')){
				$('#stamp_preview').height(height*.75)
					.width(width*.75);
				$('#stamp_preview').css({'left': e.pageX - height*.75/2, 'top': e.pageY - width*.75/2});
			} else {
				$('#stamp_preview').height(height)
					.width(width);
				$('#stamp_preview').css({'left': e.pageX - height/2, 'top': e.pageY - width/2});
			}
			if (e.pageY < this.offsetTop || e.pageX < this.offsetLeft || e.pageX > $('#svgcanvas').width() + this.offsetLeft || e.pageY > $('#svgcanvas').height() + this.offsetTop) {
				$('#stamp_preview').hide();
			}
			else {
				$('#stamp_preview').show();
			}
			$('#tools_top, #tools_left, #tools_bottom, #sidepanels').mouseenter(function(){
				$('#stamp_preview').hide();
			});
		}
	});
};

// from svg-edit code (svgcanvas.js), converts text to xml (svg xml)
//found this function http://groups.google.com/group/jquery-dev/browse_thread/thread/c6d11387c580a77f
var text2xml = function(sXML) {
	// NOTE: I'd like to use jQuery for this, but jQuery makes all tags uppercase
	//return $(xml)[0];
	var out;
	try{
		var dXML = ($.browser.msie)?new ActiveXObject("Microsoft.XMLDOM"):new DOMParser();
		dXML.async = false;
	} catch(e){ 
		throw new Error("XML Parser could not be instantiated"); 
	};
	try{
		if($.browser.msie) out = (dXML.loadXML(sXML))?dXML:false;
		else out = dXML.parseFromString(sXML, "text/xml");
	}
	catch(e){ throw new Error("Error parsing XML string"); };
	return out;
};

// VLE data service setup
// This happens when the page is loaded
(function() {
	  VleDS = function(_vle){
	    this.data = "";
	    this.annotations = "";
	    this.vle = _vle;
	    this.vleNode=_vle.getCurrentNode();
		this.lz77 = new LZ77();
	  };

	  VleDS.prototype = {
	    save: function(_data) {
			/* compress nodeState data */
			//alert($.stringify(_data).length * 2);
			_data = "--lz77--" + this.lz77.compress($.stringify(_data));
			//alert(_data.length * 2);
			this.vle.saveState(_data,this.vleNode);
	        this.data = _data;
	    },

	    load: function(context,callback) {
			//this.data = this.vle.getLatestStateForCurrentNode();
			var data = this.vle.getLatestStateForCurrentNode();
			/* decompress nodeState data */
			if(typeof data == "string"){ // check whether data has been previously compressed (for backwards compatibilty)
				if (data.match(/^--lz77--/)) {
					//alert('match');
					data = data.replace(/^--lz77--/,"");
					data = $.parseJSON(this.lz77.decompress(data));
				}
			}
			this.data = data;
			callback(this.data,context);
	    },
	    
	    loadAnnotations: function(context,callback) {
	    	//this.annotations = this.vle.get
	    },
		
	    toString: function() {
	      return "VLE Data Service (" + this.vle + ")";
	    },
		
	};

})();

//used to notify scriptloader that this script has finished loading
//if(typeof eventManager != 'undefined'){
	//eventManager.fire('scriptLoaded', 'vle/node/draw/svg-edit-2.4rc1/svgdraw.js');
//};