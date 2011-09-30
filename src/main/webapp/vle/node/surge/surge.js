/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at surge.html)
 */
function Surge(node) {
	this.node = node;
	this.view = node.view;
	this.content = node.getContent().getContentJSON();
	
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
};

//identify the Flash applet in the DOM - Provided by Adobe on a section on their site about the AS3 ExternalInterface usage.
Surge.prototype.thisMovie = function(movieName) {
    if(navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName];
    } else {
        return document[movieName];
    }
};


// Call as3 function in identified Flash applet
Surge.prototype.sendDataToGame = function(value) {
    // Put the string at the bottom of the page, so I can see easily what data has been sent
    //document.getElementById("outputdiv").innerHTML = "<b>Level Data Sent to Game:</b> "+value; 
    // Use callback setup at top of this file.
   this.thisMovie("surge").sendToGame(value);
};

// Call as3 function in identified Flash applet
Surge.prototype.sendStateToGame = function(value) {
	this.thisMovie("surge").stateToGame(value);
};

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 */
Surge.prototype.render = function() {
	//display any prompts to the student
	$('#promptDiv').html(this.content.prompt);
	
	var	swfHtml = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="770" height="480" id="surge" align="middle">'
		+ '<param name="allowScriptAccess" value="sameDomain" />'
		+ '<param name="allowFullScreen" value="false" />'
		+ '<param name="movie" value="surge.swf" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" />'
		+ '<embed src="surge.swf" quality="high" bgcolor="#ffffff" width="770" height="480" name="surge" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />'
		+ '</object>';
	
	$('#swfDiv').html(swfHtml);	
};

/**
 * Swf->js call when the swf has finished loading and is accessible by js
 */
function gameLoaded() {
	// load in authored content
	surge.sendDataToGame(surge.content.levelString);
	
	// load in student data
	//var lastState = '{"phase3":{"timeStart":0,"scoreAbsolute":0,"timeEnd":0,"scoreRelative":0,"description":""},"outcomeAbsolute":0,"trialID":0,"outcomeRelative":0,"trialTimeStart":0,"phase1":{"timeStart":0,"scoreAbsolute":0,"timeEnd":0,"scoreRelative":0,"description":""},"trialTimeSend":0,"scoreAbsolute":0,"stepID":0,"phase2":{"timeStart":0,"scoreAbsolute":0,"timeEnd":0,"scoreRelative":0,"description":""},"scoreRelative":0,"sessionID":0}';

	var lastState = '{"outcomeAbsoluteText":"","trialTimeSend":0,"phases":[{"description":"","timeStart":0,"scoreAbsolute":0,"phaseID":0,"timeEnd":0,"scoreRelative":0},{"description":"","timeStart":0,"scoreAbsolute":0,"phaseID":0,"timeEnd":0,"scoreRelative":0},{"description":"","timeStart":0,"scoreAbsolute":0,"phaseID":0,"timeEnd":0,"scoreRelative":0}],"scoreAbsolute":0,"stepID":0,"scoreRelative":0,"sessionID":0,"outcomeAbsolute":0,"trialID":0,"outcomeRelative":0,"trialTimeStart":0}';
	
	if (surge.getLatestState() != null) {
		lastState = JSON.stringify(surge.getLatestState().response);
	}
	
	// override it for now
	surge.sendStateToGame(lastState);	
};

/**
 * Function called by the game SWF when a new
 * report string needs reporting. For example,
 * when entering a new phase
 */
function reportString(value) {
	surge.save(value);
	//$("#studentWorkDiv").append("STATE:"+value +"<br/><br/>");
};

/**
 * This function retrieves the latest student work
 *
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
Surge.prototype.getLatestState = function() {
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
 * the .html file for this step (look at surge.html).
 */
Surge.prototype.save = function(st) {
	
	var stateJSON = JSON.parse(st);
	
	/*
	 * create the student state that will store the new work the student
	 * just submitted
	 */
	var surgeState = new SurgeState(stateJSON);
	
	/*
	 * fire the event to push this state to the global view.states object.
	 * the student work is saved to the server once they move on to the
	 * next step.
	 */
	eventManager.fire('pushStudentWork', surgeState);

	//push the state object into this or object's own copy of states
	this.states.push(surgeState);
	
	/*
	 * post the current node visit to the db immediately without waiting
	 * for the student to exit the step.
	 */
	this.node.view.postCurrentNodeVisit(this.node.view.state.getCurrentNodeVisit());
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/surge/surge.js');
}