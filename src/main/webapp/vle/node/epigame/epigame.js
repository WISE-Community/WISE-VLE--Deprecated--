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
};

Epigame.prototype.getGameElement = function() {
	return $("#epigame").get(0);
	//return this.embeddedObject;
};

Epigame.prototype.parseMinScore = function(sourceStr) {
	var result = parseInt(sourceStr);
	if (isNaN(result))
		return 0;
		
	return result;
}

Epigame.prototype.parseTagMultipliers = function(sourceStr) {
	var result = {};
	
	//If the source string exists and is formatted correctly, parse it into the result
	if (sourceStr != null && sourceStr != "" && sourceStr.indexOf(":") != -1) {
		var tagMultStrs = sourceStr.split(";");
		
		for (var i = 0; i < tagMultStrs.length; ++i) {
			var keyValPair = tagMultStrs[i].split(":");
			
			if (keyValPair.length == 2) {
				var value = parseFloat(keyValPair[1]);
				result[keyValPair[0]] = isNaN(value) ? 0 : value;
			}
		}
	}
	
	return result;
};

/**
 * Get the most recent student work entry from any Epigame node by timestamp.
 * @param nodeFilterFunc a function to filter the acceptable results, sig: function(node) { return boolean; }
 * @return the most recent student work object, or null if there is no valid student work
 */
Epigame.prototype.getLatestEpigameWork = function(nodeFilterFunc) {
	var nodeIDs = this.view.getProject().getNodeIdsByNodeType("EpigameNode");
	if (!nodeFilterFunc)
		nodeFilterFunc = function(node) { return true; }
	
	var latestWork = null;
	if (nodeIDs) {
		for (var i = 0; i < nodeIDs.length; ++i) {
			var node = this.view.getProject().getNodeById(nodeIDs[i]);
			if (node && node.studentWork && node.studentWork.length && nodeFilterFunc(node)) {
				var work = node.studentWork[node.studentWork.length - 1];
				//If timestamped later than the latest (or no latest exists), this is the new latest
				if (work && work.response && work.response.timestamp != null
						&& (!latestWork || latestWork.response.timestamp < work.response.timestamp)) {
					latestWork = work;
				}
			}
		}
	}
	return latestWork;
};

/**
 * Check the scores for all the steps that have the given tag and occur
 * before the current step in the project
 * @param tagName the tag name
 * @param scoreProp the property name of the checked score in studentWork
 * @param functionArgs the arguments to this function (minScore, tagMultipliers)
 * @returns the results from the check, the result object
 * contains a pass field and a message field
 */
Epigame.prototype.getTotalScore = function(tagName, functionArgs, scoreProp, readableScoreName, nullifierProp) {
	var tagMultipliers = this.parseTagMultipliers(functionArgs[1]);
	var totalScore = 0;
	var minScore = 0;
	
	//Check for a global override before applying minScore
	if (!(nullifierProp && this.campaignSettings && this.campaignSettings.globalizeReqs && !this.campaignSettings[nullifierProp]))
		minScore = this.parseMinScore(functionArgs[0]);
		
	var nodeIds = this.view.getProject().getNodeIdsByTag(tagName);
	if (nodeIds) {
		for (var i = 0; i < nodeIds.length; ++i) {
			var nodeId = nodeIds[i];
			if (nodeId != null) {
				var latestWork = this.view.state.getLatestWorkByNodeId(nodeId);
				var nodeScore = latestWork.response ? parseFloat(latestWork.response[scoreProp]) : NaN;
				if (!isNaN(nodeScore)) {
					var multiplier = 1;
					if (node.tags) {
						for (var j = 0; j < node.tags.length; ++j) {
							var tagMult = tagMultipliers[node.tags[j]];
							if (!isNaN(tagMult))
								multiplier *= tagMult;
						}
					}
					totalScore += nodeScore * multiplier;
				}
			}
		}
	}
	
	var result = {
		pass: totalScore >= minScore,
		message: totalScore >= minScore ? "" : "Your overall " + readableScoreName + " is " + totalScore + ". This mission requires " + minScore + " or higher."
	};
	result[scoreProp] = totalScore;
	return result;
}

Epigame.prototype.checkStepScore = function(tagName, scoreProp, readableScoreName, functionArgs) {
	//get the minimum required score
	var minScore = this.parseMinScore(functionArgs[0]);
	
	//array to accumulate the nodes that the student has not completed with a high enough score
	var nodesFailed = [];
	
	//the node ids of the steps that have the given tag
	var nodeIds = this.view.getProject().getNodeIdsByTag(tagName);
	if (nodeIds != null) {
		for(var i = 0; i < nodeIds.length; ++i) {
			var nodeId = nodeIds[i];
			if (nodeId != null) {
				//get the latest work for the node
				var latestWork = this.view.state.getLatestWorkByNodeId(nodeId);
				if (latestWork && latestWork.response) {
					//get the top score for the step
					var topScore = parseFloat(latestWork.response[scoreProp]);
					if (isNaN(topScore) || topScore < minScore) {
						//Score doesn't exist or is too low
						nodesFailed.push({id:nodeId, score:topScore});
					}
				} else {
					//If no work, consider it an incompletion failure
					nodesFailed.push({id:nodeId, score:NaN});
				}
			}
		}
	}
	
	if (nodesFailed.length) {
		//the student has failed at least one of the steps
		
		//create the message to display to the student
		var message = "This mission requires a " + readableScoreName + " of " + minScore + " or higher "
			+ (nodesFailed.length == 1 ? "on the following mission:<br>" : "on each of the following missions:<br>");
		
		//loop through all the failed steps
		for(var i = 0; i < nodesFailed.length; ++i) {
			var failData = nodesFailed[i];
			
			//get the step number and title for the failed step
			var failNode = this.view.getProject().getNodeById(failData.id);
			var stepNumberAndTitle = failNode.parent.title + " - " + failNode.title;
			
			//make a note explaining the player's progress toward the goal
			var scoreText = isNaN(failData.score) ? "Not yet completed" : "Your score: " + failData.score;
			
			//add the step number and title to the message
			message += stepNumberAndTitle + " (" + scoreText + ")<br>";
		}
		
		return {
			pass: false,
			message: message
		};
	}
	
	return {
		pass: true,
		message: ""
	};
};

Epigame.prototype.getLatestCompletionByNodeId = function(nodeID) {
	var node = this.view.getProject().getNodeById(nodeID);
	if (node && node.studentWork) {
		//Reverse iterate until we hit one with success
		var i = node.studentWork.length;
		while (i--) {
			var work = node.studentWork[i];
			if (work && work.response && work.response.success) {
				return work;
			}
		}
	}
	
	//None found
	return null;
};

Epigame.prototype.isNodeCompleted = function(nodeId) {
	return this.getLatestCompletionByNodeId(nodeId) != null;
};

Epigame.prototype.checkCompletedAll = function(tagName, functionArgs) {
	//array to accumulate the nodes that the student has not completed with a high enough score
	var nodesFailed = [];
	
	//the node ids of the steps that have the given tag
	var nodeIds = this.view.getProject().getNodeIdsByTag(tagName);
	if (nodeIds != null) {
		for(var i = 0; i < nodeIds.length; ++i) {
			var nodeId = nodeIds[i];
			if (nodeId && !this.isNodeCompleted(nodeId)) {
				nodesFailed.push(nodeId);
			}
		}
	}
	
	if (nodesFailed.length) {
		//the student has failed at least one of the steps
		
		//create the message to display to the student
		var message = "You must complete the following mission(s) before playing this one:<br>";
		
		//loop through all the failed steps
		for(var i = 0; i < nodesFailed.length; ++i) {
			var nodeId = nodesFailed[i];
			
			//get the step number and title for the failed step
			var failNode = this.view.getProject().getNodeById(nodeId);
			var stepNumberAndTitle = failNode.parent.title + " - " + failNode.title;
			
			//add the step number and title to the message
			message += stepNumberAndTitle + "<br>";
		}
		
		return {
			pass: false,
			message: message
		};
	}
	
	return {
		pass: true,
		message: ""
	};
};

Epigame.prototype.checkCompletedAny = function(tagName, functionArgs) {
	//the node ids of the steps that have the given tag
	var nodeIds = this.view.getProject().getNodeIdsByTag(tagName);
	if (nodeIds && nodeIds.length) {
		for(var i = 0; i < nodeIds.length; ++i) {
			var nodeId = nodeIds[i];
			if (nodeId && this.isNodeCompleted(nodeId)) {
				return { pass: true, message: "" };
			}
		}
	} else {
		return { pass: true, message: "" };
	}
	
	//Failed all steps
	//create the message to display to the student
	var message = "To play this mission, complete at least one of the following missions first:<br>";
	
	//loop through all the failed steps
	for(var i = 0; i < nodeIds.length; ++i) {
		var nodeId = nodeIds[i];
		
		//get the step number and title for the failed step
		var failNode = this.view.getProject().getNodeById(nodeId);
		var stepNumberAndTitle = failNode.parent.title + " - " + failNode.title;
		
		//add the step number and title to the message
		message += stepNumberAndTitle + "<br>";
	}
	
	return {
		pass: false,
		message: message
	};
};

Epigame.prototype.getTotalPerformance = function(tagName, functionArgs) {
	return this.getTotalScore(tagName, functionArgs, "highScore_performance", "Performance Score", "showPerfScore");
};
Epigame.prototype.getTotalExplanation = function(tagName, functionArgs) {
	return this.getTotalScore(tagName, functionArgs, "highScore_explanation", "Explanation Score", "showExplScore");
};
Epigame.prototype.getTotalAdaptive = function(tagName, functionArgs) {
	return this.getTotalScore(tagName, functionArgs, "finalScore", "Warp Score", "showWarpScore");
};

Epigame.prototype.checkStepPerformance = function(tagName, functionArgs) {
	if (this.campaignSettings && this.campaignSettings.globalizeReqs && !this.campaignSettings.showPerfScore)
		return {pass:true, message:""};
	return this.checkStepScore(tagName, "highScore_performance", "Performance Score", functionArgs);
};

Epigame.prototype.checkStepExplanation = function(tagName, functionArgs) {
	if (this.campaignSettings && this.campaignSettings.globalizeReqs && !this.campaignSettings.showExplScore)
		return {pass:true, message:""};
		
	return this.checkStepScore(tagName, "highScore_explanation", "Explanation Score", functionArgs);
};

Epigame.prototype.checkStepAdaptive = function(tagName, functionArgs) {
	if (this.campaignSettings && this.campaignSettings.globalizeReqs && !this.campaignSettings.showWarpScore)
		return {pass:true, message:""};
		
	return this.checkStepScore(tagName, "finalScore", "Warp Score", functionArgs);
};

Epigame.prototype.getCampaignSettings = function() {
	//If this node has settings, use those
	if (this.content.settings)
		return this.content.settings;
		
	//Otherwise find the first node in the project with settings and return those
	var nodes = this.node.view.getProject().getLeafNodes();
	if (nodes && nodes.length) {
		for (var i = 0; i < nodes.length; ++i) {
			if (nodes[i] && nodes[i].type == this.node.type && nodes[i].content) {
				var nodeSettings = nodes[i].content.getContentJSON().settings;
				if (nodeSettings)
					return nodeSettings;
			}
		}
	}
	
	//Defaults
	return null;
};

Epigame.prototype.getUserSettings = function(totalPerfScore, totalExplScore, totalWarpScore) {
	var result = {
		perfScore: totalPerfScore,
		explScore: totalExplScore,
		warpScore: totalWarpScore
	};
	
	var work = this.getLatestEpigameWork();
	if (work && work.response.userPrefs) {
		for (var prop in work.response.userPrefs) {
			result[prop] = work.response.userPrefs[prop];
		}
	}
	
	return result;
};

Epigame.prototype.getNodeCompletionCount = function() {
	var count = 0;
	
	if (this.states && this.states.length)
		for (var i = 0; i < this.states.length; ++i)
			if (this.states[i].response && this.states[i].response.success)
				++count;
				
	return count;
};

Epigame.prototype.getCurrentValue = function(prop) {
	var work = this.getLatestState();
	if (work && work.response) {
		return work.response[prop];
	}
	return null;
};

Epigame.prototype.getCurrentScore = function(scoreProp) {
	var score = parseInt(getCurrentValue(scoreProp));
	if (!isNaN(score))
		return score;
	return 0;
};

//Retrieve the high score of each type for the current mission/step (May be used by the game SWF)
Epigame.prototype.getCurrentPerfScore = function() { return getCurrentScore("highScore_performance"); };
Epigame.prototype.getCurrentExplScore = function() { return getCurrentScore("highScore_explanation"); };
Epigame.prototype.getCurrentWarpScore = function() { return getCurrentScore("finalScore"); };

//Retrieve the most recent action plan for the current mission/step (May be used by the game SWF)
Epigame.prototype.getCurrentPerfScore = function() { return getCurrentScore("highScore_performance"); };

Epigame.prototype.getCurrentAdaptiveIndex = function(listLength) {
	var catIndex = parseInt(this.node.view.userAndClassInfo.getWorkgroupId());
	if (!listLength || isNaN(catIndex))
		return 0;
		
	while (catIndex >= listLength)
		catIndex -= listLength;
		
	return catIndex;
};

Epigame.prototype.getCurrentQuizData = function() {
	var data = {};
	
	var work = this.getLatestState();
	if (work && work.response) {
		data.quizTimeRemaining = work.response.quizTimeRemaining;
		data.quizQuestionsCompleted = work.response.quizQuestionsCompleted;
		data.quizQuestionsCorrect = work.response.quizQuestionsCorrect;
		data.quizStarted = 1;
	}
	var allQuizData = this.node.getQuizData();
	data.quiz = allQuizData[this.getCurrentAdaptiveIndex(allQuizData.length)];
	
	//Return in string form (Flash seems to handle it better)
	return JSON.stringify(data);
};

Epigame.prototype.getCurrentAdaptiveMissionData = function() {
	var missionTable = this.node.getAdaptiveMissionData();
	//TODO: Account for the possibility of someone screwing up the data
	var missionList = missionTable[this.getCurrentAdaptiveIndex(missionTable.length)];
	var index = this.getNodeCompletionCount();
	
	while (index >= missionList.length)
		index -= missionList.length;
		
	return missionList[index];
};

function embedGameResultCallback(success, id, ref) {
	if (success) {
		epigame.embeddedObject = ref;
		epigame.embeddedID = id;
	}
};

Epigame.prototype.embedGame = function(flashVars) {
	//Defaults
	var url = "app/Main.swf";
	var elementID = "epigame";
	
	//Pull in optional node data
	if (this.content.customUri && this.content.customUri != "")
		url = this.content.customUri;
	if (this.campaignSettings)
		flashVars.campaign = this.serializeCampaignSettings(this.campaignSettings);
	if (this.userSettings)
		flashVars.user = this.serializeUserSettings(this.userSettings);
		
	var encodedFlashVars = {};
	if (flashVars) {
		for (var paramName in flashVars) {
			encodedFlashVars[paramName] = encodeURIComponent(flashVars[paramName]);
		}
	}
	swfobject.embedSWF(url, elementID, "100%", "100%", "10.2.0", "../../swfobject/expressInstall.swf",
						encodedFlashVars, null, null, embedGameResultCallback);
}

Epigame.prototype.loadMission = 		function(missionStr) { this.embedGame({mode:"playmission", mission:missionStr}); }
Epigame.prototype.loadMissionEditor = 	function(missionStr) { this.embedGame({mode:"editmission", mission:missionStr}); }
Epigame.prototype.loadBlankEditor = 	function() { this.embedGame({mode:"editmission"}); }
Epigame.prototype.loadMap = 			function() { this.embedGame({mode:"playcampaign"}); }
Epigame.prototype.loadTutorial = 		function() { this.embedGame({mode:"playtutorial"}); }
Epigame.prototype.loadAdaptiveMission = function(missionStr) { this.embedGame({mode:"playcat", mission:missionStr}); }
Epigame.prototype.loadAdaptiveQuiz = 	function() { this.embedGame({mode:"playquiz"}); }

Epigame.prototype.serializeCampaignSettings = function(settings) {
	if (!settings)
		return null;
		
	return "C|@|@"
		+ (settings.showPerfScore ? "|@1" : "|@0")
		+ (settings.showExplScore ? "|@1" : "|@0")
		+ (settings.showWarpScore ? "|@1" : "|@0")
		+ (settings.showQuestions ? "|@1" : "|@0");
};

Epigame.prototype.serializeUserSettings = function(settings) {
	if (!settings)
		return null;
		
	var result = "UD|$";
	var parsed;
	
	result += settings.needsTutorial == "false" ? "0" : "1";
	
	parsed = parseFloat(settings.soundVolume);
	result += "|$" + (isNaN(parsed) ? "" : parsed);
	parsed = parseFloat(settings.musicVolume);
	result += "|#" + (isNaN(parsed) ? "" : parsed);
	
	//Some game data is unused for this implementation, so this lets the game control the defaults
	result += "|$|#|#|$CP";
	
	parsed = parseInt(settings.perfScore);
	result += "|@" + (isNaN(parsed) ? "" : parsed);
	parsed = parseInt(settings.explScore);
	result += "|@" + (isNaN(parsed) ? "" : parsed);
	parsed = parseInt(settings.warpScore);
	result += "|@" + (isNaN(parsed) ? "" : parsed);
	result += "|@";
	
	return result;
};

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
	var message = "";
	
	//Whether this is running normally in the VLE (outside authoring mode)
	var runMode = this.view.authoringMode == null || !this.view.authoringMode;
	
	//Coalesce required parameters
	if (!this.content.mode)
		this.content.mode = "mission";
	if (!this.content.levelString)
		this.content.levelString = "";
		
	//Default settings
	this.campaignSettings = this.getCampaignSettings();
	this.userSettings = null;
	
	//If not in authoring mode...
	if (runMode) {
		//Run the tag map functions to get pass/fail, message, and the three types of scores
		var tagMapResults = this.processTagMaps();
		
		//Build a user settings object for the game
		this.userSettings = this.getUserSettings(tagMapResults.perfScore, tagMapResults.explScore, tagMapResults.warpScore);
		
		//Grab the req-check results
		enableStep = tagMapResults.enableStep;
		message = tagMapResults.message;
	}
	
	if (enableStep) {
		if (this.content.mode == "mission") {
			this.loadMission(this.content.levelString);
			/*
			if (runMode) {
				this.loadMission(this.content.levelString);
			} else {
				this.loadMissionEditor(this.content.levelString);
			}*/
		} else if (this.content.mode == "editor") {
			this.loadMissionEditor(this.content.levelString);
		} else if (this.content.mode == "adaptiveMission") {
			this.loadAdaptiveMission(this.getCurrentAdaptiveMissionData());
		} else if (this.content.mode == "adaptiveQuiz") {
			this.loadAdaptiveQuiz();
		} else if (this.content.mode == "map") {
			this.loadMap();
		} else if (this.content.mode == "tutorial") {
			this.loadTutorial();
		}
	}
	
	//If there is a message, display it to the student.
	//Message and enableStep should be mutually exclusive; if both happen at once, something is wrong
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
	var messages = [];
	var perfScore = 0;
	var explScore = 0;
	var warpScore = 0;
	var result;
	
	var tagMaps = this.node.tagMaps;
	if (tagMaps) {
		for (var i = 0; i < tagMaps.length; ++i) {
			var tagMap = tagMaps[i];
			
			if (tagMap != null) {
				var tagName = tagMap.tagName;
				var funcName = tagMap.functionName;
				var funcArgs = tagMap.functionArgs;
				
				if (funcName == "checkCompletedAll") {
					result = this.checkCompletedAll(tagName, funcArgs);
				} else if (funcName == "checkCompletedAny") {
					result = this.checkCompletedAny(tagName, funcArgs);
				} else if (funcName == "checkStepPerformance") {
					result = this.checkStepPerformance(tagName, funcArgs);
				} else if (funcName == "checkStepExplanation") {
					result = this.checkStepExplanation(tagName, funcArgs);
				} else if (funcName == "getTotalPerformance") {
					result = this.getTotalPerformance(tagName, funcArgs);
				} else if (funcName == "getTotalExplanation") {
					result = this.getTotalExplanation(tagName, funcArgs);
				} else if (funcName == "getTotalAdaptive") {
					result = this.getTotalAdaptive(tagName, funcArgs);
				}
				
				if (result.pass == false)
					enableStep = false;
				if (result.message != "")
					messages.push(result.message);
				if (result.highScore_performance)
					perfScore = result.highScore_performance;
				if (result.highScore_explanation)
					explScore = result.highScore_explanation;
				if (result.finalScore)
					warpScore = result.finalScore;
			}
		}
	}
	
	//We don't want a drop in Warp Score to re-lock a visited mission.
	//If this step already has work registered, it should remain unlocked forever.
	enableStep = enableStep || this.getLatestState() != null;
	
	return {
		enableStep: enableStep,
		message: messages.length ? messages.join("<br>") + "<br>" : "",
		perfScore: perfScore,
		explScore: explScore,
		warpScore: warpScore
	};
};

/**
 * Retrieves the latest student work for this step.
 * @return the latest state object, or null if none has been submitted
 */
Epigame.prototype.getLatestState = function() {
	var latestState = null;
	
	//Get the latest state, if any states exist
	if (this.states != null && this.states.length > 0) {
		latestState = this.states[this.states.length - 1];
	}
	
	return latestState;
};

/**
 * Returns the number of failed attempts since the last success.
 * @return the number of failed attempts since the last success
 */
Epigame.prototype.getCurrentAttemptCount = function() {
	var count = 0;
	
	//Search states in reverse until we hit a success or run out of states
	var i = this.states.length;
	while (i--) {
		var state = this.states[i];
		if (state.response) {
			if (state.response.success)
				break;
				
			if (state.response.failures)//Standard mission
				count += state.response.failures.length;
			if (state.response.attempts)//Warp mission
				count += state.response.attempts.length;
		}
	}
	
	return count;
};

/**
 * Returns the latest state response string (may be called by the game SWF).
 * @return the stringified response JSON
 */
Epigame.prototype.getLatestReportString = function() {
	var latestState = this.getLatestState();
	return latestState && latestState.response ? JSON.stringify(latestState.response) : null;
};

Epigame.prototype.saveGameState = function(reportString) {
	this.save(reportString);
};

Epigame.prototype.saveExitState = function() {
	var elem = this.getGameElement();
	if (elem && elem.getExitReport) {
		this.save(elem.getExitReport());
	}
};

/**
 * Creates a state object to represent the student work (if any), then saves it.
 */
Epigame.prototype.save = function(st) {
	//Work may be null or undefined if the game isn't loaded.
	//The game will send an empty string if it's not in a meaningful save state.
	//If the work is null or blank, we don't want it saved, so ignore the request.
	if (!st)
		return;
		
	var stateJSON = JSON.parse(decodeURIComponent(st));
	
	//Create the state that will store the new work the student just submitted
	var epigameState = new EpigameState(stateJSON);
	
	//Push this state to the global view.states object.
	eventManager.fire('pushStudentWork', epigameState);

	//Push the state object into this or object's own copy of states
	this.states.push(epigameState);
	
	// Process the student work for nav display
	this.node.processStudentWork(epigameState);
	
	//Post the current node visit to the DB immediately without waiting for exit.
	this.node.view.postCurrentNodeVisit(this.node.view.state.getCurrentNodeVisit());
	
	//Process the tag maps again if we are not in authoring mode (currently no reason to)
	/*
	if (this.view.authoringMode == null || !this.view.authoringMode) {
		this.processTagMaps();
	}
	*/
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/epigame/epigame.js');
}