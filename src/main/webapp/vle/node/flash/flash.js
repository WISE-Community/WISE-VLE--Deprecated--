/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at surge.html)
 * @constructor
 */
function Flash(node) {
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
Flash.prototype.thisMovie = function(movieName) {
    if(navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName];
    } else {
        return document[movieName];
    }
};

// Call as3 function in identified Flash applet
Flash.prototype.sendStateToFlash = function(value) {
	swfobject.getObjectById("flashContent").importData(value);
};

//Call as3 function in identified Flash applet
Flash.prototype.getStateFromFlash = function() {
	return swfobject.getObjectById("flashContent").exportData();
};

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 */
Flash.prototype.render = function() {
	//display any prompts to the student
	$('#promptDiv').html(this.content.prompt);
	
	var width = this.content.width;
	var height = this.content.height;
	var minPlayerVersion = this.content.minPlayerVersion;
	var activity_uri = this.content.activity_uri;
	
	// flashvars can be used by authors to send starting parameters to the swf on load
	var flashvars = this.content.flashvars;
	
	// if data logging is enabled, add latest student work to the flashvars
	if(this.content.enableData){
		var lastState = '';
		// get latest student state
		if (flash.getLatestState() != null) {
			lastState = JSON.stringify(flash.getLatestState().response.data);
		}
		// add student data to flashvars (needs to be processed by Flash on load)
		flashvars.studentData = lastState;
	}

	var params = {};
	params.quality = "high";
	params.wmode = "opaque";
	params.allowscriptaccess = "sameDomain";
	var attributes = {};
	attributes.id = "flashContent";
	attributes.name = "flashContent";
	attributes.styleclass = "flashContent";
	swfobject.embedSWF(activity_uri, "alternateContent", width, height, minPlayerVersion, "/vlewrapper/vle/swfobject/expressInstall.swf", flashvars, params, attributes);	
};

/**
 * This function retrieves the latest student work in WISE
 *
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
Flash.prototype.getLatestState = function() {
	var latestState = null;
	
	//check if the states array has any elements
	if(this.states != null && this.states.length > 0) {
		//get the last state
		latestState = this.states[this.states.length - 1];
	}
	
	return latestState;
};

/**
 * This function retrieves the student work from the flash swf, creates a state
 * object to represent the student work, and then saves the student work.
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at surge.html).
 */
Flash.prototype.save = function() {
	if(this.content.enableData){
		var studentData = flash.getStateFromFlash();
		
		if(typeof studentData != "undefined"){
			var stateJSON = JSON.parse(studentData);
			
			/*
			 * create the student state that will store the new work the student
			 * just submitted
			 */
			var flashState = new FlashState(stateJSON);
			
			/*
			 * fire the event to push this state to the global view.states object.
			 * the student work is saved to the server once they move on to the
			 * next step.
			 */
			eventManager.fire('pushStudentWork', flashState);

			//push the state object into this or object's own copy of states
			this.states.push(flashState);
		}
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/flash/flash.js');
}