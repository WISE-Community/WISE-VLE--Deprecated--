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

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 */
Surge.prototype.render = function() {
	//display any prompts to the student
	$('#promptDiv').html(this.content.prompt);
	
	var swfHtml = "";
	
	if(this.content.url != null) {
		swfHtml = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="770" height="480" id="surge" align="middle">'
		+ '<param name="allowScriptAccess" value="sameDomain" />'
		+ '<param name="allowFullScreen" value="false" />'
		+ '<param name="movie" value="' + this.content.url + '" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" />	<embed src="' + this.content.url + '" quality="high" bgcolor="#ffffff" width="770" height="480" name="surge" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />'
		+ '</object>';
	}
	
	$('#swfDiv').html(swfHtml);
	
	// load in authored content
	this.sendDataToGame(this.content.levelString);
	
	//load any previous responses the student submitted for this step
	var latestState = this.getLatestState();
	
	if(latestState != null) {
		/*
		 * get the response from the latest state. the response variable is
		 * just provided as an example. you may use whatever variables you
		 * would like from the state object (look at surgeState.js)
		 */
		var latestResponse = latestState.response;
		
		//set the previous student work into the text area
		$('#studentResponseTextArea').val(latestResponse); 
	}
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
Surge.prototype.save = function() {
	//get the answer the student wrote
	var response = $('#studentResponseTextArea').val();
	
	/*
	 * create the student state that will store the new work the student
	 * just submitted
	 */
	var surgeState = new SurgeState(response);
	
	/*
	 * fire the event to push this state to the global view.states object.
	 * the student work is saved to the server once they move on to the
	 * next step.
	 */
	eventManager.fire('pushStudentWork', surgeState);

	//push the state object into this or object's own copy of states
	this.states.push(surgeState);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/surge/surge.js');
}