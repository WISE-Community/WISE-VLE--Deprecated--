/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at epigame.html)
 * @constructor
 */
function Epigame(node) {
	this.node = node;
	this.view = node.view;
	this.content = node.getContent().getContentJSON();
	
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
	
	this.showTopScore = true;
};

Epigame.prototype.getGameElement = function() {
	return $('#epigame').get(0);
};


// Call as3 function in identified Flash applet
Epigame.prototype.sendDataToGame = function(value) {
	// Put the string at the bottom of the page, so I can see easily what data has been sent
	//document.getElementById("outputdiv").innerHTML = "<b>Level Data Sent to Game:</b> "+value; 
	// Use callback setup at top of this file.
	this.getgameElement().sendToGame(value);
};

// Call as3 function in identified Flash applet
Epigame.prototype.sendStateToGame = function(value) {
	this.getGameElement().stateToGame(value);
};

/**
 * Check the scores for all the steps that have the given tag and occur
 * before the current step in the project
 * @param tagName the tag name
 * @param functionArgs the arguments to this function
 * @returns the results from the check, the result object
 * contains a pass field and a message field
 */
Epigame.prototype.checkScoreForTags = function(tagName, functionArgs) {
	//default values for the result
	var result = {
		pass:true,
		message:''
	};
	
	//get the minimum required score
	var minScore = functionArgs[0];
	
	//array to accumulate the nodes that the student has not completed with a high enough score
	var nodesFailed = [];

	//the node ids of the steps that come before the current step and have the given tag
	var nodeIds = this.view.getProject().getPreviousNodeIdsByTag(tagName, this.node.id);
	
	if(nodeIds != null) {
		//loop through all the node ids that come before the current step and have the given tag
		for(var x=0; x<nodeIds.length; x++) {
			//get a node id
			var nodeId = nodeIds[x];
			
			if(nodeId != null) {
				//get the latest work for the node
				var latestWork = this.view.state.getLatestWorkByNodeId(nodeId);
				
				if(latestWork != "") {
					//get the top score for the step
					var score = latestWork.response.topScore;
					
					if(score < minScore) {
						//the score is not high enough
						nodesFailed.push(nodeId);
					}
				} else {
					/*
					 * the student does not have any work for the step so we
					 * will add it to our array
					 */
					nodesFailed.push(nodeId);
				}
			}
		}
	}
	
	if(nodesFailed.length != 0) {
		//the student has failed at least one of the steps
		
		//create the message to display to the student
		var message = "You must obtain a score higher than " + minScore + " on these steps before you can work on this step<br>";
		
		//loop through all the failed steps
		for(var x=0; x<nodesFailed.length; x++) {
			var nodeId = nodesFailed[x];
			
			//get the step number and title for the failed step
			var stepNumberAndTitle = this.view.getProject().getStepNumberAndTitle(nodeId);
			
			//add the step number and title to the message
			message += stepNumberAndTitle + "<br>";
		}
		
		//set the fields in the result
		result.pass = false;
		result.message = message;		
	}
	
	return result;
};

/**
 * Get the accumulated score for all the steps with the given tag
 * @param tagName the tag name
 * @param functionArgs the arguments to this function (this is not actually used in this function)
 * @return the accumulated score for all the steps that are tagged
 */
Epigame.prototype.getAccumulatedScoreForTags = function(tagName, functionArgs) {
	var result = 0;
	
	//get all the node ids with the given tag
	var nodeIds = this.view.getProject().getNodeIdsByTag(tagName);

	if(nodeIds != null) {
		//loop through all the node ids
		for(var x=0; x<nodeIds.length; x++) {
			//get a node id
			var nodeId = nodeIds[x];
			
			if(nodeId != null) {
				//get the latest work for the node
				var latestWork = this.view.state.getLatestWorkByNodeId(nodeId);
				
				if(latestWork != "" && latestWork.response != null) {
					
					if(latestWork.response.topScore != null) {
						//get the top score for the step
						var score = latestWork.response.topScore;
						
						//try to convert the score to a number in case it is stored as a string
						score = parseFloat(score);
						
						//check if the score is a number
						if(!isNaN(score)) {
							//the score is a number
							result += score;							
						}
					}
				}
			}
		}
	}
	
	return result;
};

Epigame.prototype.embedGame = function(flashVars) {
	swfobject.embedSWF("app/Main.swf", "epigame", "100%", "100%", "10.2.0", "../../swfobject/expressInstall.swf", flashVars ? flashVars : {});
}

Epigame.prototype.loadMission = 		function(missionStr) { this.embedGame({mode:"playmission", mission:missionStr}); }
Epigame.prototype.loadMissionEditor = 	function(missionStr) { this.embedGame({mode:"editmission", mission:missionStr}); }
Epigame.prototype.loadBlankEditor = 	function() { this.embedGame({mode:"editmission"}); }
Epigame.prototype.loadMap = 			function() { this.embedGame({mode:"playcampaign"}); }
Epigame.prototype.loadTutorial = 		function() { this.embedGame({mode:"playtutorial"}); }
Epigame.prototype.loadAdaptiveMission = function(index) { this.embedGame({mode:"playmissioncat", catIndex:index}); }
Epigame.prototype.loadAdaptiveQuiz = 	function(index) { this.embedGame({mode:"playquiz", catIndex:index}); }

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 */
Epigame.prototype.render = function() {
	//whether we want to allow the student to work on this step
	var enableStep = true;
	
	/*
	 * a message to display to the student at the top of the step
	 * usually used to display error messages when they need to
	 * complete a previous step before being able to work on the
	 * current step
	 */
	var message = '';
	
	//the accumulated score among a family tag of steps
	var accumulatedScore = 0;
	
	//Whether this is running normally in the VLE (outside authoring mode)
	var runMode = this.view.authoringMode == null || !this.view.authoringMode;
	
	//Coalesce required parameters
	if (!this.content.mode)
		this.content.mode = "mission";
	if (!this.content.levelString)
		this.content.levelString = "";
	
	//process the tag maps if we are not in authoring mode
	if(runMode) {
		var tagMapResults = this.processTagMaps();
		
		//get the result values
		enableStep = tagMapResults.enableStep;
		message = tagMapResults.message;
		
		if(enableStep) {
			//the student is able to work on this step
			
			//display any prompts to the student
			$('#promptDiv').html(this.content.prompt);
			
			/*
			var epigameSource = 'epigame.swf';
			
			if("useCustomSwf" in this.content && this.content.useCustomSwf == 'true'){
				if("customUri" in this.content  && this.content.customUri != ''){
					epigameSource = this.content.customUri;
				}
			}
			
			<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="100%" height="100%" id="epigameApp" align="middle">
				<param name="movie" value="' + epigameSource + '"/>
				<param name="wmode" value="opaque"/>
				<param name="quality" value="high"/>
				<param name="bgcolor" value="#000000"/>
				<param name="allowScriptAccess" value="sameDomain"/>
				<!--[if !IE]>-->
				<object type="application/x-shockwave-flash" data="Untitled-1.swf" width="100%" height="100%">
					<param name="movie" value="Untitled-1.swf"/>
					<param name="wmode" value="opaque"/>
					<param name="allowScriptAccess" value="sameDomain"/>
					<param name="quality" value="high"/>
					<param name="bgcolor" value="#000000"/>
				<!--<![endif]-->
					<a href="http://www.adobe.com/go/getflash">
						<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" />
					</a>
				<!--[if !IE]>-->
				</object>
				<!--<![endif]-->
			</object>
			var	swfHtml = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="770" height="480" id="epigame" align="middle">'
				+ '<param name="allowScriptAccess" value="sameDomain" />'
				+ '<param name="allowFullScreen" value="false" />'
				+ '<param name="wmode" value="opaque" />'
				+ '<param name="movie" value="' + epigameSource + '" />'
				+ '<param name="quality" value="high" />'
				+ '<param name="bgcolor" value="#ffffff" />'
				+ '<embed src="' + epigameSource + '" wmode="opaque" quality="high" bgcolor="#ffffff" width="770" height="480" name="epigame" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />'
				+ '</object>';
			
			$('#swfDiv').html(swfHtml);	
			*/
			//this.loadMission(this.content.levelString);
			
			if(this.showTopScore) {
				//show the top score for the current step
				this.displayTopScore();
			}
		}
	}
	
	if (enableStep) {
		if (this.content.mode == "mission") {
			if (runMode) {
				this.loadMission(this.content.levelString);
			} else {
				this.loadMissionEditor(this.content.levelString);
			}
		} else if (this.content.mode == "editor") {
			this.loadMissionEditor(this.content.levelString);
		} else if (this.content.mode == "adaptiveMission") {
			this.loadAdaptiveMission(0);
		} else if (this.content.mode == "adaptiveQuiz") {
			this.loadAdaptiveQuiz(this.content.levelString);
		} else if (this.content.mode == "map") {
			this.loadMap();
		} else if (this.content.mode == "tutorial") {
			this.loadTutorial();
		}
	}
	
	//if there is a message, display it to the student
	$('#messageDiv').html(message);
};

/**
 * Process the tag maps and obtain the results
 * @return an object containing the results from processing the
 * tag maps. the object contains two fields
 * enableStep
 * message
 */
Epigame.prototype.processTagMaps = function() {
	var enableStep = true;
	var message = '';
	
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
				
				if(functionName == "checkScore") {
					//we will check the score for the steps that are tagged
					
					//get the result of the check
					var result = this.checkScoreForTags(tagName, functionArgs);
					enableStep = enableStep && result.pass;
					
					if(message == '') {
						message += result.message;
					} else {
						//message is not an empty string so we will add a new line for formatting
						message += '<br>' + result.message;
					}
				} else if(functionName == "getAccumulatedScore") {
					//we will get the accumulated score for the steps that are tagged
					
					//get the accumulated score
					accumulatedScore = this.getAccumulatedScoreForTags(tagName, functionArgs);
					
					//display the accumulated score to the student
					$('#accumulatedScoreDiv').html('Accumulated Score: ' + accumulatedScore);
				} else if(functionName == "checkCompleted") {
					//we will check that all the steps that are tagged have been completed
					
					//get the result of the check
					var result = checkCompletedForTags(this, tagName, functionArgs);
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
		message:message
	};
	
	return returnObject;
};

/**
 * Display the top score to the student
 */
Epigame.prototype.displayTopScore = function() {
	//get the latest state
	var latestState = this.getLatestState();
	var topScoreMessage = '';
	
	//make the message to display the top score
	if(latestState != null) {
		topScoreMessage = 'Top Score: ' + latestState.response.topScore;
	} else {
		topScoreMessage = 'Top Score: 0';
	}
	
	//display the top score to the student
	$('#topScoreDiv').html(topScoreMessage);
};

/**
 * Swf->js call when the swf has finished loading and is accessible by js
 */
function gameLoaded() {
	// load in authored content
	epigame.sendDataToGame(epigame.content.levelString);
	
	// load in student data
	//var lastState = '{"phase3":{"timeStart":0,"scoreAbsolute":0,"timeEnd":0,"scoreRelative":0,"description":""},"outcomeAbsolute":0,"trialID":0,"outcomeRelative":0,"trialTimeStart":0,"phase1":{"timeStart":0,"scoreAbsolute":0,"timeEnd":0,"scoreRelative":0,"description":""},"trialTimeSend":0,"scoreAbsolute":0,"stepID":0,"phase2":{"timeStart":0,"scoreAbsolute":0,"timeEnd":0,"scoreRelative":0,"description":""},"scoreRelative":0,"sessionID":0}';

	var lastState = '{"outcomeAbsoluteText":"","trialTimeSend":0,"phases":[{"description":"","timeStart":0,"scoreAbsolute":0,"phaseID":0,"timeEnd":0,"scoreRelative":0},{"description":"","timeStart":0,"scoreAbsolute":0,"phaseID":0,"timeEnd":0,"scoreRelative":0},{"description":"","timeStart":0,"scoreAbsolute":0,"phaseID":0,"timeEnd":0,"scoreRelative":0}],"scoreAbsolute":0,"stepID":0,"scoreRelative":0,"sessionID":0,"outcomeAbsolute":0,"trialID":0,"outcomeRelative":0,"trialTimeStart":0}';
	
	if (epigame.getLatestState() != null) {
		lastState = JSON.stringify(epigame.getLatestState().response);
	}
	
	// override it for now
	epigame.sendStateToGame(lastState);	
};

/**
 * Function called by the game SWF when a new
 * report string needs reporting. For example,
 * when entering a new phase
 */
function reportString(value) {
	epigame.save(value);
	//$("#studentWorkDiv").append("STATE:"+value +"<br/><br/>");
};

/**
 * This function retrieves the latest student work
 *
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
Epigame.prototype.getLatestState = function() {
	var latestState = null;
	
	//check if the states array has any elements
	if(this.states != null && this.states.length > 0) {
		//get the last state
		latestState = this.states[this.states.length - 1];
	}
	
	return latestState;
};

/**
 * This function retrieves the student work from the html ui, creates a state
 * object to represent the student work, and then saves the student work.
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at epigame.html).
 */
Epigame.prototype.save = function(st) {
	
	var stateJSON = JSON.parse(st);
	
	/*
	 * create the student state that will store the new work the student
	 * just submitted
	 */
	var epigameState = new EpigameState(stateJSON);
	
	/*
	 * fire the event to push this state to the global view.states object.
	 * the student work is saved to the server once they move on to the
	 * next step.
	 */
	eventManager.fire('pushStudentWork', epigameState);

	//push the state object into this or object's own copy of states
	this.states.push(epigameState);
	
	/*
	 * process the student work to see if we need to display a bronze,
	 * silver, or gold star next to the step in the nav menu
	 */
	this.node.processStudentWork(epigameState);
	
	if(this.showTopScore) {
		//show the top score for the current step
		this.displayTopScore();
	}
	
	/*
	 * post the current node visit to the db immediately without waiting
	 * for the student to exit the step.
	 */
	this.node.view.postCurrentNodeVisit(this.node.view.state.getCurrentNodeVisit());
	
	//process the tag maps if we are not in authoring mode
	if(this.view.authoringMode == null || !this.view.authoringMode) {
		/*
		 * process the tag maps again so the values are updated such as for
		 * accumulated score
		 */ 
		this.processTagMaps();
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/epigame/epigame.js');
}