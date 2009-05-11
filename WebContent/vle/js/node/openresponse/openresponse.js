function OPENRESPONSE(xmlDoc) {
  this.xmlDoc = xmlDoc;
  if(this.xmlDoc.getElementsByTagName('prompt')[0].firstChild){
  	this.promptText = this.xmlDoc.getElementsByTagName('prompt')[0].firstChild.nodeValue;
  } else {
  	this.promptText = "";
  };
  this.expectedLines = this.xmlDoc.getElementsByTagName('extendedTextInteraction')[0].getAttribute('expectedLines');
  this.vle = null;
  this.states = [];
  this.customJournalTimestamp;
  this.answered = false;
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
		if(this.isCustomJournalEntry()){
			if(this.vle.getNodeById(this.xmlDoc.getAttribute('id'))){
				//custom journal entry node already exists, just update here
				var node = this.vle.getNodeById(this.xmlDoc.getAttribute('id'));
				this.states.push(new CUSTOMJOURNALENTRYSTATE(document.getElementById('responseBox').value, new Date().toUTCString(), this.xmlDoc.getAttribute('id'), document.getElementById('promptInput').value));
				this.vle.state.getCurrentNodeVisit().nodeStates.push(new CUSTOMJOURNALENTRYSTATE(document.getElementById('responseBox').value, new Date().toUTCString(), this.xmlDoc.getAttribute('id'), document.getElementById('promptInput').value)); 
				
				//update title and prompt if necessary
				if(node.title!=document.getElementById('promptInput').value){
					node.element.getElementsByTagName('prompt')[0].firstChild.nodeValue = document.getElementById('promptInput').value;
					node.element.setAttribute('title', document.getElementById('promptInput').value);
					node.title = document.getElementById('promptInput').value;
					this.vle.renderNode('J:0');
				};
			} else {
				//custom journal entry node does not exist, create, create state and re-render the journal
				var customNode = this.createNode();
				this.vle.state.setCurrentNodeVisit(customNode);
				this.states.push(new CUSTOMJOURNALENTRYSTATE(document.getElementById('responseBox').value, new Date().toUTCString(), this.xmlDoc.getAttribute('id'), document.getElementById('promptInput').value));
				this.vle.state.getCurrentNodeVisit().nodeStates.push(new CUSTOMJOURNALENTRYSTATE(document.getElementById('responseBox').value, new Date().toUTCString(), this.xmlDoc.getAttribute('id'), document.getElementById('promptInput').value));
				this.vle.getNodeById('J:0').setParameters(this.xmlDoc.getAttribute('id'));
				this.vle.renderNode('J:0');
			};
			document.getElementById('promptInput').setAttribute('disabled', 'disabled');
		} else {
			this.states.push(new OPENRESPONSESTATE(document.getElementById('responseBox').value));
			if (this.vle != null) {
				this.vle.state.getCurrentNodeVisit().nodeStates.push(new OPENRESPONSESTATE(document.getElementById('responseBox').value));
			}
		};
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
		if(this.isCustomJournalEntry()){
			document.getElementById('promptInput').removeAttribute('disabled');
		};
	}
}

/**
 * Render this OpenResponse item
 */
OPENRESPONSE.prototype.render = function() {
	
	// render the prompt
	document.getElementById('promptType').removeChild(document.getElementById('promptDiv'));
	if(this.isCustomJournalEntry()){
		document.getElementById('type').innerHTML = 'title';
		this.createCustomPrompt();
		if(this.promptText==null || this.promptText=="Your title here"){
			this.promptText = "";
		};
		document.getElementById('promptInput').value = this.promptText;
		this.customJournalTimestamp = new Date().toUTCString();
		if(this.states!=null && this.states.length > 0){
			document.getElementById('promptInput').setAttribute('disabled', 'disabled');
		}
	} else {
		this.createStandardPrompt();
		document.getElementById('promptDiv').innerHTML=convertToHTML(this.promptText);
		document.getElementById('type').innerHTML = 'question';
	};

	// set text area size: set row based on expectedLines
	document.getElementById('responseBox').setAttribute('rows', this.expectedLines);
	if (this.states!=null && this.states.length > 0) {
		document.getElementById('responseBox').value = this.states[this.states.length - 1].response;
		removeClassFromElement("editButton", "disabledLink");
		addClassToElement("saveButton", "disabledLink");
		setResponseBoxEnabled(false);
		displayNumberAttempts("This is your", "revision", this.states);
	} else {
		document.getElementById("numberAttemptsDiv").innerHTML = "This is your first revision.";
		this.clean();
	}
}

OPENRESPONSE.prototype.renderLite = function(){
	//prompt
	document.getElementById('promptType').removeChild(document.getElementById('promptDiv'));
	this.createStandardPrompt();
	document.getElementById('promptDiv').innerHTML=convertToHTML(this.promptText);
	document.getElementById('type').innerHTML = 'question';
	
	//response
	document.getElementById('responseBox').setAttribute('rows', this.expectedLines);
	document.getElementById('responseBox').setAttribute('onkeyup', 'answered()');
	if (this.states!=null && this.states.length > 0) {
		document.getElementById('responseBox').value = this.states[this.states.length - 1].response;
	};
};

/**
 * Load states and VLE and then calls renderLite
 */
OPENRESPONSE.prototype.loadLite = function(node, vle){
	this.vle = vle;
	this.node = node;
	this.setState();
	this.renderLite();
};

OPENRESPONSE.prototype.checkAnswerLite = function(){
	var orState = new OPENRESPONSESTATE(document.getElementById('responseBox').value);
	this.states.push(orState);
	if (this.vle != null) {
		this.vle.state.getCurrentNodeVisit().nodeStates.push(orState);
	};
	
	return orState;
};

OPENRESPONSE.prototype.setState = function() {
	for (var i=0; i < this.vle.state.visitedNodes.length; i++) {
		var nodeVisit = this.vle.state.visitedNodes[i];
		if (nodeVisit.node.id == this.node.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				this.states.push(nodeVisit.nodeStates[j]);
			}
		}
	}
}

/**
 * resets the elements to original clean state
 */
 OPENRESPONSE.prototype.clean = function(){
 	document.getElementById('responseBox').value = "";
 	removeClassFromElement("saveButton", "disabledLink");
	addClassToElement("editButton", "disabledLink");
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
	if(states){
		this.states = states;
	};
}


OPENRESPONSE.prototype.setVLE = function(vle){
	this.vle = vle;
};

OPENRESPONSE.prototype.isCustomJournalEntry = function(){
	var id;
	if(this.xmlDoc.getAttribute){
		id = this.xmlDoc.getAttribute('id');
		if(id.charAt(0)=='J' && id.charAt(2)=='0' && id.charAt(4)=='S'){
			return true;
		} else {
			return false;
		};
	};
	return false;
};

OPENRESPONSE.prototype.createStandardPrompt = function(){
	var div = createElement(document, 'div', {id: 'promptDiv'});
	document.getElementById('promptType').appendChild(div);
};

OPENRESPONSE.prototype.createCustomPrompt = function(){
	var div = createElement(document, 'div', {id: 'promptDiv'});
	var input = createElement(document, 'input', {id: 'promptInput', type: 'text'});
	div.appendChild(input);
	document.getElementById('promptType').appendChild(div);
};

OPENRESPONSE.prototype.createNode = function(){
	var journalEntryNode = new CustomJournalEntryNode("JournalEntryNode");
	journalEntryNode.parent = this.vle.journal.rootNode;
	journalEntryNode.id = this.xmlDoc.getAttribute('id');
	journalEntryNode.title = document.getElementById('promptInput').value;
	this.vle.journal.rootNode.addChildNode(journalEntryNode);
	journalEntryNode.element = this.xmlDoc;
	journalEntryNode.element.setAttribute('title', document.getElementById('promptInput').value);
	journalEntryNode.element.getElementsByTagName('prompt')[0].firstChild.nodeValue = document.getElementById('promptInput').value;
	journalEntryNode.vle = this.vle;
	return journalEntryNode;
};