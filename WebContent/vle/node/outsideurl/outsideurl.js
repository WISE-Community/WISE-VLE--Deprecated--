function OPENRESPONSE(xmlDoc) {
  this.xmlDoc = xmlDoc;
  this.promptText = this.xmlDoc.getElementsByTagName('prompt')[0].firstChild.nodeValue;
  this.expectedLines = this.xmlDoc.getElementsByTagName('extendedTextInteraction')[0].getAttribute('expectedLines');
  this.vle = null;
  this.node = null;
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
		if (this.vle != null) {
			var orState = this.vle.createState('openresponse', [document.getElementById('responseBox').value]);
			this.vle.state.getCurrentNodeVisit().nodeStates.push(orState);
			this.states.push(orState);
		} else {
			this.states.push(new OPENRESPONSESTATE([document.getElementById('responseBox').value]));
		};s
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
		displayNumberAttempts("This is your", "revision. Click <i>Save</i> to save your work");
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
	if (states.length > 0) {
			document.getElementById('responseBox').innerHTML = states[states.length - 1].response;
	}
	displayNumberAttempts("This is your", "revision");
	addClassToElement("editButton", "disabledLink");
}

/**
 * Load states from specified VLE.
 * @param {Object} vle
 */
OPENRESPONSE.prototype.loadFromVLE = function(node, vle) {
	this.vle = vle;
	this.node = node;
	this.loadState();
	this.render();
}

/**
 * Loads state from VLE_STATE.
 * @param {Object} vleState
 */
OPENRESPONSE.prototype.loadState = function() {
	for (var i=0; i < this.vle.state.visitedNodes.length; i++) {
		var nodeVisit = this.vle.state.visitedNodes[i];
		if (nodeVisit.node == this.node) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			}
		}
	}
}
