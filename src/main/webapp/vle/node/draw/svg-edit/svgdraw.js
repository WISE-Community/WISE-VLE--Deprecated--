// TODO: add option to specify drawing canvas dimensions, add option to specify starting foreground (editable) student drawing

/**
 * @constructor
 * @param node
 * @returns
 */
function SVGDRAW(node) {
	this.node = node;
	this.view = node.view;
	this.content = node.getContent().getContentJSON();
	
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
	
	this.svgCanvas = null;
	this.teacherAnnotation = "";
	this.defaultBackground = ""; // svg string to hold starting (or background) svg image
	this.toolbarOptions = null; // object to hold tool visibility options
	this.stamps  =  []; // array to hold stamp paths
	this.snapshotsActive  =  false; // boolean to specify whether snapshots are active
	this.descriptionActive =  false; // boolean to specify whether student annotations/descriptions are active
	this.description  =  ""; // string to hold annotation/description text
	this.snapDescriptions = {}; // Object to hold the snapshot descriptions
	this.defaultDescription = ""; // string to hold starting description text
	this.instructions = ""; // string to hold prompt/instructions text
	this.active = -1; // var to hold last selected snapshot.id
	this.selected = false; // boolean to specify whether a snapshot is currently selected
	this.snapTotal = 0; // var to hold total number of snapshots created
	this.lz77 = new LZ77(); // lz77 compression object
	// json object to hold updated student data for the node
	this.studentData = {
			"svgString": "",
			"description": "",
			"snapshots": [],
			"snapTotal": 0,
			"selected": null
			};
	
	svgEditor.changed = false, // boolean to specify whether student data has changed and should be saved on exit
	
	this.init(node.getContent().getContentUrl());
	
	if(this.content.autoScoring != null) {
		if(this.content.autoScoring.autoScoringCriteria == null || this.content.autoScoring.autoScoringCriteria == '') {
			//auto scoring criteria is null or empty string so we will hide the div that contains the 'Check Work' button
			$('#autoGradeWorkButtonDiv').hide();
		} else {
			//show the hide work button
			$('#autoGradeWorkButtonDiv').show();
		}		
	}
};

SVGDRAW.prototype.init = function(jsonURL) {
	var enableStep = true;
	var message = '';
	var workToImport = [];
	
	//process the tag maps if we are not in authoring mode
	if(this.view.authoringMode == null || !this.view.authoringMode) {
		//get the tag map results
		var tagMapResults = this.processTagMaps();
		
		//get the result values
		enableStep = tagMapResults.enableStep;
		message = tagMapResults.message;
		workToImport = tagMapResults.workToImport;
	}
	
	if(workToImport != null) {
		this.workToImport = workToImport;		
	}
	
	this.loadModules(jsonURL, this);  // process backgrounds, stamps, snapshots, descriptions, hidden tool options
};


SVGDRAW.prototype.loadModules = function(jsonfilename, context) {
	var view = this.node.view;
	
	var myDataService = new VleDS(vle);
 	// or var myDataService = new DSSService(read,write);
	context.setDataService(myDataService);
	
	var data = context.content;
	
	if(data.stamps && data.stamps.length > 0){
		context.stamps = []; // clear out stamps array
		for (var x=0; x<data.stamps.length; x++) {
			context.stamps.push(data.stamps[x]);
		};
	}
	if(data.defaultSnapshots && data.defaultSnapshots.length > 0){
		context.defaultSnapshots = data.defaultSnapshots;
	}
	if(data.snapshots_active){
		context.snapshotsActive = data.snapshots_active;
	}
	if(data.snapshots_max){
		context.snapshots_max = data.snapshots_max;
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
	if(data.toolbar_options){
		context.toolbarOptions = data.toolbar_options;
		if(!context.toolbarOptions.hasOwnProperty('importStudentAsset')){
			context.toolbarOptions.importStudentAsset = false;
		}
	}
	if(data.img_background && view.utils.isNonWSString(data.img_background)){
		var bgUrl = data.img_background;
		var position = 'left-top';
		var xPos = 1, yPos = 1;
		view.utils.getImageDimensions(data.img_background,function(dimensions){
			var height = dimensions.height, width = dimensions.width;
			if(data.bg_position){
				position = data.bg_position;
			}
			var rightX = 599-width;
			var centerX = (rightX+1)/2;
			var bottomY = 449-height;
			var middleY = (bottomY+1)/2;
			if(position=='left-top'){
				xPos = 1, yPos = 1;
			} else if(position=='left-middle') {
				xPos = 1, yPos = middleY;
			} else if(position=='left-bottom') {
				xPos = 1, yPos = bottomY;
			} else if(position=='right-top') {
				xPos = rightX, yPos = 1;
			} else if(position=='right-middle') {
				xPos = rightX, yPos = middleY;
			} else if(position=='right-bottom') {
				xPos = rightX, yPos = bottomY;
			} else if(position=='center-top') {
				xPos = centerX, yPos = 1;
			} else if(position=='center-middle') {
				xPos = centerX, yPos = middleY;
			} else if(position=='center-bottom') {
				xPos = centerX, yPos = bottomY;
			} 
			context.defaultBackground = '<svg width="600" height="450" xmlns="http://www.w3.org/2000/svg" ' +
				'xmlns:xlink="http://www.w3.org/1999/xlink"><g><title>teacher</title>' +
				'<image x="' + xPos + '" y="' + yPos + '" width="' + width + '" height="' + height + '" xlink:href="' + bgUrl + '" /></g></svg>';
			context.load();   // load preview data, if any, or load default background
		});
	} else if(data.svg_background && view.utils.isNonWSString(data.svg_background)){
		context.defaultBackground = data.svg_background;
		context.load();   // load preview data, if any, or load default background
	} else {
		context.load();   // load preview data, if any, or load default background
	}
};


SVGDRAW.prototype.setDataService = function(dataService) {
	// register VLE Data Service to the svgDraw object so that
	// it can save back to vle's persistence mechanism.
	// add a function to svgDraw that will save the data to vle (wise4)
	this.dataService=dataService;
};


SVGDRAW.prototype.loadCallback = function(studentWorkJSON, context) {
		var annotationValue;
		// set default blank canvas, TODO: perhaps de-hard code dimensions
		var defaultSvgString = '<svg width="600" height="450" xmlns="http://www.w3.org/2000/svg">' +
			'<!-- Created with SVG-edit - http://svg-edit.googlecode.com/ --><g><title>student</title></g></svg>';
		
		// check for previous work and load it
		var svgString;
		if (studentWorkJSON){
			if(studentWorkJSON.snapshots && studentWorkJSON.snapshots.length === 0){
				try{
					svgString = studentWorkJSON.svgString;
				} catch(err) {
					svgString = studentWorkJSON;
				}
				// handle legacy instances where student layer was not named "student" on creation
				if(svgString.indexOf("<title>Layer 1</title>") != -1){
					svgString = svgString.replace("<title>Layer 1</title>", "<title>student</title>");
				}
				svgEditor.loadFromString(svgString);
			}
		} else if (context.defaultBackground && !context.defaultSnapshots){ // if no previous work and no default snaps, load default background drawing
			//TODO: Perhaps modify this to allow foreground (editable) starting drawings as well
			svgString = context.defaultBackground.replace("</svg>", "<g><title>student</title></g></svg>"); // add blank student layer
			svgEditor.loadFromString(svgString);
		} else { // create blank student layer
			svgEditor.loadFromString(defaultSvgString);
		}
		context.initDisplay(studentWorkJSON,context); // initiate stamps, description, snapshots, prompt
};

SVGDRAW.prototype.saveToVLE = function() {
	if(svgEditor.changed){
		// strip out annotations (TODO: remove; not used anymore)
		if (this.teacherAnnotation !== "") {
			svgStringToSave = svgStringToSave.replace(this.teacherAnnotation, "");
		}
		this.studentData.svgString = svgCanvas.getSvgString();
		this.studentData.description = svgEditor.ext_description.content();
		var snaps = svgEditor.ext_snapshots.content(),
			snapDescriptions = this.snapDescriptions;
		// add descriptions to each snapshot
		for(var i=0; i<snaps.length; i++){
			var description = '',
				id = snaps[i].id;
			if(snapDescriptions.hasOwnProperty(id)){
				description = snapDescriptions[id];
			}
			snaps[i].description = description;
		}
		this.studentData.snapshots = snaps;
		this.studentData.snapTotal = svgEditor.ext_snapshots.total();
		this.studentData.selected = svgEditor.ext_snapshots.open();
		this.save();
	}
};

/**
 * Save the student work
 */
SVGDRAW.prototype.save = function() {
	var data = this.studentData;
	
	/* compress nodeState data */
	var compressedData = "--lz77--" + this.lz77.compress(JSON.stringify(data));
	var autoScore = this.autoScore;
	var autoFeedback = this.autoFeedback;
	var autoFeedbackKey = this.autoFeedbackKey;
	var checkWork = this.checkWork;

	//create a new svgdrawstate
	var svgDrawState = new SVGDRAWSTATE(compressedData, null, autoScore, autoFeedback, autoFeedbackKey, checkWork);
	
	//fire the event to push this state to the global view.states object
	this.view.pushStudentWork(this.node.id, svgDrawState);
	
	//push the state object into this object's own copy of states
	this.states.push(svgDrawState);	
	
    this.data = data;
    
    //clear out the auto score and auto feedback
    this.autoScore = null;
	this.autoFeedback = null;
	this.autoFeedbackKey = null;
	this.checkWork = null;
};

SVGDRAW.prototype.load = function() {
	this.dataService.load(this, this.loadCallback);	
};

// populate instructions, stamp images, description/annotation text, and snapshots (wise4)
SVGDRAW.prototype.initDisplay = function(data,context) {
	if(svgEditor.ext_snapshots && svgEditor.ext_snapshots.isLoaded() && svgEditor.ext_prompt && svgEditor.ext_prompt.isLoaded() &&
			svgEditor.ext_stamps && svgEditor.ext_stamps.isLoaded() && svgEditor.ext_description && svgEditor.ext_description.isLoaded()
			&& svgEditor.ext_importstudentasset && svgEditor.ext_importstudentasset.isLoaded()){
		
		var promptExt = svgEditor.ext_prompt,
			descriptionExt = svgEditor.ext_description,
			stampsExt = svgEditor.ext_stamps,
			snapshotsExt = svgEditor.ext_snapshots;
		
		// initiate prompt/instructions
		if(context.instructions && context.instructions !== ""){
			promptExt.content(context.instructions); // set content
			if(!data){
				// if student hasn't saved any work, show prompt
				promptExt.show();
			}
		} else {
			// no prompt set, so remove prompt UI elements
			$('#tool_prompt').remove();
			$('#prompt_dialog').remove();
		}
		
		//initiate snapshots
		if(context.snapshotsActive){
			snapshotsExt.max(context.snapshots_max);
			if(context.snapshots_max < 11){
				svgEditor.maxDrawSize = 40960;
			} else {
				svgEditor.maxDrawSize = 20480;
			}
			if(data && data.snapshots && data.snapshots.length > 0){
				// load existing snapshots
				snapshotsExt.content(data.snapshots, data.selected, data.snapTotal, function(){
					snapshotsExt.min(1).toggleDisplay(false);
					if(context.descriptionActive){
						$('#description').show();
					}
				});
			} else {
				snapshotsExt.content([], null, null, function(){
					snapshotsExt.min(1).toggleDisplay(false);
				});
			}
			
		} else {
			// snapshots are disabled, so remove UI elements
			$('#tool_snapshot').remove();
			$('#snapshotpanel').remove();
		}
		
		//initiate stamps
		if(context.stamps.length > 0){
			stampsExt.content(context.stamps);
		} else {
			$('#tools_stamps').remove();
			$('#tool_stamp').remove();
		}
		
		$('#tool_prompt').insertAfter('#tool_snapshot');
	
		// initiate description/annotation
		if(context.descriptionActive){
			if (context.snapshotsActive) { // check whether snapshots are active
				var i = 0;
				if (data && data.selected > -1) { // check whether a snapshot is selected
					for (i; i<data.snapshots.length; i++) {
						// set description content based on selected snapshot
						if (data.snapshots[i].id === data.selected) {
							descriptionExt.content(data.snapshots[i].description);
							break;
						}
					}
				} else {
					if(snapshotsExt.open() < 0){
						$('#description').hide();
					}
				}
				
				// populate descriptions object
				if (data){
					i = 0;
					for (i; i<data.snapshots.length; i++) {
						var snap = data.snapshots[i];
						context.snapDescriptions[snap.id] = snap.description;
					}
				}
				
				// hide description display on playback
				$('#snap_loop, #snap_play').on('mouseup', function(){
					$('#description').hide();
				});
				// show description display when paused
				$('#snap_pause').on('mouseup', function(){
					$('#description').show();
				});
				// update description header text
				$('.description_header_text span.panel_title').text('Frame Description:');
				// set header preview text position
				var left = $('#description .panel_title').width() + 12;
				var right = $('#description .description_buttons').width() + 15;
				$('#description span.minimized').css({'left': left, 'right': right});
				
				//$('#description_collapse').hide();
			} else {
				if(data.description && data.description!=""){
					descriptionExt.content(data.description);
					
				} else if (context.defaultDescription!="") {
					descriptionExt.content(context.defaultDescription);
				}
			}
		} else {
			$('#description').remove();
		}
		
		// process tool visibilty options
		if(context.toolbarOptions){
			for(var key in context.toolbarOptions){
				if (context.toolbarOptions.hasOwnProperty(key)) {
					if(context.toolbarOptions[key] === false){
						context.hideTools(key);
					}
				}
			}
			if(!context.toolbarOptions.pencil && !context.toolbarOptions.line && !context.toolbarOptions.rectangle &&
					!context.toolbarOptions.ellipse && !context.toolbarOptions.polygon && !context.toolbarOptions.text){
				$('#colors').hide();
			}
		}
		
		// setup content changed listener functions
		snapshotsExt.changed = function(){
			console.log('snapshots changed');
			svgEditor.changed = true;
			if(context.descriptionActive){
				var activeId = snapshotsExt.open();
				if(activeId > -1){
					var snaps = snapshotsExt.content(),
						snapDescriptions = context.snapDescriptions;
					// add descriptions to each snapshot
					var description  = '';
					if(snapDescriptions.hasOwnProperty(activeId)){
						description = snapDescriptions[activeId];
					}
					descriptionExt.content(description);
					$('#description').show();
					// set header preview text position
					var left = $('#description .panel_title').width() + 12;
					var right = $('#description .description_buttons').width() + 15;
					$('#description span.minimized').css({'left': left, 'right': right});
				} else {
					$('#description').hide();
				}
			}
		};
		
		descriptionExt.changed = function(){
			console.log('description changed');
			svgEditor.changed = true;
			this.description = descriptionExt.content();
			if(context.snapshotsActive){
				var activeId = snapshotsExt.open();
				if(activeId > -1){
					context.snapDescriptions[activeId] = this.description;
				}
			}
		};
		
		setTimeout(function(){
			$('#closepath_panel').insertAfter('#path_node_panel');
			svgCanvas.undoMgr.resetUndoStack(); // reset undo stack to prevent users from deleting stored starting image
			$("#tool_undo").addClass("tool_button_disabled").addClass("disabled");
			$('#fit_to_canvas').mouseup();
			$('#loading_overlay').fadeOut();
			//$('#overlay_content').dialog('close');
		},500);
	}
	else {
		setTimeout(function(){
			context.initDisplay(data,context);
		},100);
	}
};


// hide specified set of drawing tools
// TODO: should we remove the options from the DOM instead?
SVGDRAW.prototype.hideTools = function(option){
	if(option==='pencil'){
		$('#tool_fhpath').hide();
	} else if(option==='line'){
		$('#tool_line').hide();
	} else if(option==='connector'){
		$('#mode_connect').hide();
	} else if (option==='rectangle'){
		$('#tools_rect_show').hide();
	} else if(option==='ellipse'){
		$('#tools_ellipse_show').hide();
	} else if(option==='polygon'){
		$('#tool_path').hide();
	} else if (option==='text'){
		$('#tool_text').hide();
	} else if (option==='importStudentAsset'){
		$('#tool_import_student_asset').hide();
	}
};

/**
 * Auto grade the drawing
 */
SVGDRAW.prototype.autoGradeWork = function() {
	//create the object that will auto grade the drawing
	var scorer = new DrawScorer();
	
	if(this.content.autoScoring != null) {
		
		//get the max number of times the student can check work
		var maxCheckWorkChances = this.getMaxCheckWorkChances();
		
		//get the number of check work chances the student has used
		var checkWorkChancesUsed = this.getCheckWorkChancesUsed();
		
		if(maxCheckWorkChances == null || maxCheckWorkChances == "" || checkWorkChancesUsed < maxCheckWorkChances) {
			/*
			 * there is no max check work chances or the student still has 
			 * check work chances left so we will score the work
			 */
			
			var checkWork = false;
			var chancesLeft = null;
			
			if(maxCheckWorkChances == null || maxCheckWorkChances == "") {
				//max check work chances has not been set so we will check the work
				checkWork = true;
			} else {
				//we will notify the student of how many check work chances they have left
				
				//get the number of check work chances left
				chancesLeft = maxCheckWorkChances - checkWorkChancesUsed;
				
				//get the submit confirmation message if any
				var submitConfirmationMessage = this.content.autoScoring.submitConfirmationMessage;
				
				if(submitConfirmationMessage != null && submitConfirmationMessage != '') {
					//the submit confirmation message was provided so we will use it
					
					//replace # with the actual number of submit chances left
					submitConfirmationMessage = submitConfirmationMessage.replace(/#/g, chancesLeft);
					
					//ask the student if they are sure they want to submit their work now
					checkWork = confirm(submitConfirmationMessage);
				} else {
					var message = 'You have ' + chancesLeft;
					
					if(chancesLeft == 1) {
						message += ' chance ';
					} else {
						message += ' chances ';
					}
					
					message += 'left to receive feedback on your answer so this should be your best work!\n\n';
					message += 'Are you ready to receive feedback on this answer?';
					
					//ask the student if they are sure they want to check the work now
					checkWork = confirm(message);
				}
			}
			
			if(checkWork) {
				//we will score the work
				
				//set the grading specification depending on the criteria
				if(this.content.autoScoring.autoScoringCriteria == 'methane') {
					scorer.parseXMLSpec("autograde/MethaneSpec.xml");
				} else if(this.content.autoScoring.autoScoringCriteria == 'ethane') {
					scorer.parseXMLSpec("autograde/EthaneSpec.xml");
				} else {
					//error
					return;
				}
				
				if (this.teacherAnnotation != "") {
					svgStringToSave = svgStringToSave.replace(this.teacherAnnotation, "");
				}
				this.studentData.svgString = svgCanvas.getSvgString();
				this.studentData.description = svgEditor.description;
				this.studentData.snapshots = svgEditor.snapshots;
				this.studentData.snapTotal = svgEditor.snapTotal;
				if(svgEditor.selected == true){
					this.studentData.selected = svgEditor.active;
				} else {
					this.studentData.selected = -1;
				}
				
				//score the drawing
				scorer.scoreDrawing(this.studentData);
				
				//get the score
				var scoreObject = this.studentData.rubricScore;
				
				var score = null;
				var key = null;
				
				if(scoreObject != null) {
					score = scoreObject.score;
					key = scoreObject.key;
				}
				
				//get the feedback
				var feedback = this.getFeedbackByKey(key);
				
				var message = '';
				
				//display the score if we need to
				if(this.content.autoScoring.autoScoringDisplayScoreToStudent) {
					message += 'Auto score returned: ' + score + " out of 5.";
				}
				
				//display the feedback if we need to
				if(this.content.autoScoring.autoScoringDisplayFeedbackToStudent) {
					if(message != '') {
						//add line breaks if we are displaying the score
						message += '\n\n';
					}
					
					message += feedback;
				}
				
				//set the score and feedback so we can access them later when we save the svgdrawstate
				this.autoScore = score;
				this.autoFeedback = message;
				this.autoFeedbackKey = key;
				this.checkWork = true;
				
				//save the student work with the score and feedback
				this.saveToVLE();
				
				if(this.content.autoScoring.autoScoringDoNotDisplayFeedbackToStudentOnLastChance && chancesLeft == 1) {
					alert('Good Job!\n\nYou have used up all your chances to submit.\n\nYou can continue to edit your drawing if you need to.');
				} else {
					//show the Feedback button at the top right of the vle next to the previous and next arrows
					this.view.displayNodeAnnotation(this.node.id);
					
					//display the feedback in a popup dialog
					eventManager.fire("showNodeAnnotations",[this.node.id]);
				}
			}
		} else {
			//the student does not have anymore check work chances
			alert('Good Job!\n\nYou have used up all your chances to submit.\n\nYou can continue to edit your drawing if you need to.');
		}
	}
};

/**
 * Get the feedback for the given score
 * @param score the score we want feedback for
 */
SVGDRAW.prototype.getFeedbackByScore = function(score) {
	var feedback = '';
	
	if(this.content.autoScoring != null) {
		if(this.content.autoScoring.autoScoringFeedback != null) {
			
			//loop through all the feedback objects
			for(var x=0; x<this.content.autoScoring.autoScoringFeedback.length; x++) {
				//get a feedback object
				var autoScoringFeedbackObject = this.content.autoScoring.autoScoringFeedback[x];
				
				if(autoScoringFeedbackObject != null) {
					//compare the score
					if(score == autoScoringFeedbackObject.score) {
						//we found the score we want so we will get the feedback 
						feedback = autoScoringFeedbackObject.feedback;
						
						//break out of the for loop
						break;
					}
				}
			}
		}		
	}
	
	return feedback;
};

/**
 * Get the feedback for the given key
 * @param key the key we want feedback for
 */
SVGDRAW.prototype.getFeedbackByKey = function(key) {
	var feedback = '';
	
	if(this.content.autoScoring != null) {
		if(this.content.autoScoring.autoScoringFeedback != null) {
			
			//loop through all the feedback objects
			for(var x=0; x<this.content.autoScoring.autoScoringFeedback.length; x++) {
				//get a feedback object
				var autoScoringFeedbackObject = this.content.autoScoring.autoScoringFeedback[x];
				
				if(autoScoringFeedbackObject != null) {
					//compare the key
					if(key == autoScoringFeedbackObject.key) {
						//we found the key we want so we will get the feedback 
						feedback = autoScoringFeedbackObject.feedback;
						
						//break out of the for loop
						break;
					}
				}
			}
		}		
	}
	
	return feedback;
};

/**
 * Get the max number of check work chances
 */
SVGDRAW.prototype.getMaxCheckWorkChances = function() {
	var checkWorkChances = null;
	
	if(this.content.autoScoring != null) {
		if(this.content.autoScoring.autoScoringCheckWorkChances != null) {
			checkWorkChances = this.content.autoScoring.autoScoringCheckWorkChances;
		}
	}
	
	return checkWorkChances;
};

/**
 * Get the number of times the student has checked their work for this step
 */
SVGDRAW.prototype.getCheckWorkChancesUsed = function() {
	var checkWorkChancesUsed = 0;
	
	if(this.states != null) {
		//loop through all the node states for this step
		for(var x=0; x<this.states.length; x++) {
			//get a node state
			var state = this.states[x];
			
			if(state.checkWork) {
				/*
				 * the checkWork value is set to true so this is work that 
				 * the student had auto graded and received feedback on
				 */
				checkWorkChancesUsed++;
			}
		}
	}
	
	return checkWorkChancesUsed;
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
    		var data = _data;
    		/* compress nodeState data */
			data = "--lz77--" + this.lz77.compress($.stringify(_data));
			this.vle.saveState(data,this.vleNode);
	        this.data = data;
	    },

	    load: function(context,callback) {
	    	//this.data = this.vle.getLatestStateForCurrentNode();
			var data = this.vle.getLatestStateForCurrentNode();
			
			if((data == null || data == '') && context.workToImport != null && context.workToImport.length > 0) {
				/*
				 * the student has not done any work for this step yet and
				 * there is work to import so we will use the work to import
				 */
				var nodeState = context.workToImport[context.workToImport.length - 1];
				
				if(nodeState != null) {
					data = nodeState.data;
				}
			}
			
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
	    }
	  };

})();

/**
 * Process the tag maps and obtain the results
 * @return an object containing the results from processing the
 * tag maps. the object contains three fields
 * enableStep
 * message
 * workToImport
 */
SVGDRAW.prototype.processTagMaps = function() {
	var enableStep = true;
	var message = '';
	var workToImport = [];
	
	//the tag maps
	var tagMaps = this.node.tagMaps;
	
	//check if there are any tag maps
	if(tagMaps != null) {
		
		//loop through all the tag maps
		for(var x=0; x<tagMaps.length; x++) {
			
			//get a tag map
			var tagMapObject = tagMaps[x];
			
			if(tagMapObject != null) {
				//get the variables for the tag map
				var tagName = tagMapObject.tagName;
				var functionName = tagMapObject.functionName;
				var functionArgs = tagMapObject.functionArgs;
				
				if(functionName == "importWork") {
					//get the work to import
					workToImport = this.node.getWorkToImport(tagName, functionArgs);
				} else if(functionName == "showPreviousWork") {
					//show the previous work in the previousWorkDiv
					this.node.showPreviousWork($('#previousWorkDiv'), tagName, functionArgs);
				} else if(functionName == "checkCompleted") {
					//we will check that all the steps that are tagged have been completed
					
					//get the result of the check
					var result = this.node.checkCompleted(tagName, functionArgs);
					enableStep = enableStep && result.pass;
					
					if(message == '') {
						message += result.message;
					} else {
						//message is not an empty string so we will add a new line for formatting
						message += '<br>' + result.message;
					}
				}
			}
		}
	}
	
	if(message != '') {
		//message is not an empty string so we will add a new line for formatting
		message += '<br>';
	}
	
	//put the variables in an object so we can return multiple variables
	var returnObject = {
		enableStep:enableStep,
		message:message,
		workToImport:workToImport
	};
	
	return returnObject;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/draw/svg-edit/svgdraw.js');
};