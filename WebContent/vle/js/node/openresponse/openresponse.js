function OPENRESPONSE(xmlDoc) {
  this.xmlDoc = xmlDoc;
  this.promptText = this.xmlDoc.getElementsByTagName('prompt')[0].firstChild.nodeValue;
  this.expectedLines = this.xmlDoc.getElementsByTagName('extendedTextInteraction')[0].getAttribute('expectedLines');
  this.vle = null;
  this.states = [];
}

/**
 * Saves current state of the OpenResponse item
 * - what the students typed
 * - timestamp
 * 
 * Then disable the textarea and save button and show the edit button
 */
OPENRESPONSE.prototype.save = function() {
	var isSaveDisabled = hasClass("saveButton", "disabledLink");

	if (!isSaveDisabled) {
		this.states.push(new OPENRESPONSESTATE(document.getElementById('responseBox').value));
		if (this.vle != null) {
			//alert('here');
			this.vle.state.getCurrentNodeVisit().nodeStates.push(new OPENRESPONSESTATE(document.getElementById('responseBox').value));
			//alert('OR.prototype.save:' + this.vle.state.getCurrentNodeVisit().nodeStates.length);
		}
		removeClassFromElement("editButton", "disabledLink");
		addClassToElement("saveButton", "disabledLink");
		setResponseBoxEnabled(false);
	}
}

/**
 * Edits current state of the OpenResponse item
 * 
 * Enable textarea and save button, hide the edit button
 */
OPENRESPONSE.prototype.edit = function() {
	var isEditDisabled = hasClass("editButton", "disabledLink");

	if (!isEditDisabled) {
		removeClassFromElement("saveButton", "disabledLink");
		addClassToElement("editButton", "disabledLink");
		setResponseBoxEnabled(true);
		displayNumberAttempts("This is your", "revision. Click <i>Save</i> to save your work", this.states);
	}
}

/**
 * Render this OpenResponse item
 */
OPENRESPONSE.prototype.render = function() {
	
	// render the prompt
	var promptdiv = document.getElementById('promptDiv');
	promptdiv.innerHTML=this.promptText;

	// set text area size: set row based on expectedLines
	document.getElementById('responseBox').setAttribute('rows', this.expectedLines);
	if (this.states.length > 0) {
		document.getElementById('responseBox').value = this.states[this.states.length - 1].response;
	} else {
		this.clean();
	}
	displayNumberAttempts("This is your", "revision", this.states);
	addClassToElement("editButton", "disabledLink");
}

/**
 * resets the elements to original clean state
 */
 OPENRESPONSE.prototype.clean = function(){
 	document.getElementById('responseBox').value = "";
 	removeClassFromElement("saveButton", "disabledLink");
	setResponseBoxEnabled(true);
 };

/**
 * Load states from specified VLE.
 * @param {Object} vle
 */
OPENRESPONSE.prototype.loadFromVLE = function(node, vle) {
	this.vle = vle;
	this.node = node;
	this.loadState(vle.state);
	this.render();
}

/**
 * Loads state from VLE_STATE.
 * @param {Object} vleState
 */
OPENRESPONSE.prototype.loadState = function(states) {
	this.states = states;
}


OPENRESPONSE.prototype.setVLE = function(vle){
	this.vle = vle;
};