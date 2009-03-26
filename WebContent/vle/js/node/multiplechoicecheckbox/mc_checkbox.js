/* 
 * Note from Geoff
 * all names labeled mc should be changed to mc_checkbox but will
 * left alone for now and cleaned up later for the sake of getting this
 * working quickly for tim.
 */

function MC_CHECKBOX(xmlDoc) {
	this.loadXMLDoc(xmlDoc);
}

MC_CHECKBOX.prototype.loadXMLDoc = function(xmlDoc) {
	this.xmlDoc = xmlDoc;
	this.responseDeclarations = this.xmlDoc.getElementsByTagName('responseDeclaration');
	this.responseIdentifier = this.xmlDoc.getElementsByTagName('choiceInteraction')[0].getAttribute('responseIdentifier');
	this.promptText = this.xmlDoc.getElementsByTagName('prompt')[0].firstChild.nodeValue;
	this.choices = [];
	this.choiceToValueArray = new Array();

	var choicesDOM = this.xmlDoc.getElementsByTagName('simpleChoice');

	// instantiate choices
	for (var i=0;i<choicesDOM.length;i++) {
		var choice = new CHOICE(choicesDOM[i]);
		this.choices.push(choice);
		this.choiceToValueArray[choice.identifier] = choice.text;
	}

	// find out which choice is the correct choice
	for (var i=0;i<this.responseDeclarations.length;i++) {
		var responseDeclaration = this.responseDeclarations[i];
		if (responseDeclaration.getAttribute('identifier') == this.responseIdentifier) {
			this.correctResponseInterpretation = responseDeclaration.getElementsByTagName('correctResponse')[0].getAttribute('interpretation'); 
		}
	}

}
/**
 * Load states from specified VLE.
 * @param {Object} vle
 */
MC_CHECKBOX.prototype.loadFromVLE = function(node, vle) {
	this.vle = vle;
	this.node = node;
	this.loadState();
	this.render();
}

/**
 * Load the state for this MC given the node and vle but do
 * not call render
 * @param node
 * @param vle
 */
MC_CHECKBOX.prototype.loadForTicker = function(node, vle) {
	this.vle = vle;
	this.node = node;
	this.loadState();
}

/**
 * Loads state from VLE_STATE.
 * @param {Object} vleState
 */
MC_CHECKBOX.prototype.loadState = function() {
	for (var i=0; i < this.vle.state.visitedNodes.length; i++) {
		var nodeVisit = this.vle.state.visitedNodes[i];
		if (nodeVisit.node == this.node) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			}
		}
	}
}

/**
 * Get that student's latest submission for this node that has work. 
 * The node is specific to a student.
 * @param nodeId the id of the node we want the student's work from
 * @return the newest NODE_STATE for this node
 */
MC_CHECKBOX.prototype.getLatestState = function(nodeId) {
	var nodeVisits = this.vle.state.getNodeVisitsByNodeId(nodeId);
	
	/*
	 * loop through all the nodeVisits and find the latest nodeVisit
	 * that has content in the nodeStates
	 */
	for(var x=0; x<nodeVisits.length; x++) {
		//loop through the nodeVisits starting from the end
		var nodeVisit = nodeVisits[nodeVisits.length - (x + 1)];
		if(nodeVisit != null) {
			//an array of nodeStates
			var nodeStates = nodeVisit.nodeStates;
			
			//check if there is anything in the nodeStates
			if(nodeStates != null && nodeStates.length > 0) {
				//get the latest nodeState
				var nodeState = nodeStates[nodeStates.length - 1];
				return nodeState;
			}
		}
	}
	return null;
}

//gets and returns a CHOICE object given the CHOICE's identifier
MC_CHECKBOX.prototype.getCHOICEByIdentifier = function(identifier) {
	for (var i=0;i<this.choices.length;i++) {
		if (this.choices[i].identifier == identifier) {
			return this.choices[i];
		}
	}
	return null;
}

/**
 * Render the MC_CHECKBOX
 */
MC_CHECKBOX.prototype.render = function() {
	// render the prompt
	var promptdiv = document.getElementById('promptDiv');
	promptdiv.innerHTML=this.promptText;

	// render choices
	var radiobuttondiv = document.getElementById('radiobuttondiv');
	while(radiobuttondiv.hasChildNodes()) {
		radiobuttondiv.removeChild(radiobuttondiv.firstChild);
	}
	for(var i=0;i<this.choices.length;i++) {
		var radiobuttonElement = createElement(document, 'input', {'id':this.choices[i].identifier, 'type':'checkbox', 'name':'checkbox', 'value':this.choices[i].identifier, 'class':'checkbox', 'onclick':"javascript:enableCheckAnswerButton('true');"});
		var radiobuttonText = document.createTextNode(this.choices[i].text);
		radiobuttondiv.appendChild(radiobuttonElement);
		radiobuttondiv.appendChild(radiobuttonText);
		radiobuttondiv.appendChild(createElement(document, 'br', {}));
	}
	addClassToElement("checkAnswerButton", "disabledLink");
	addClassToElement("tryAgainButton", "disabledLink");
	clearFeedbackDiv();
	if (this.correctResponseInterpretation == null || this.correctResponseInterpretation == "") {
		// if there is no correct answer to this question (ie, when they're filling out a form),
		// change button to say "save answer" and "edit answer" instead of "check answer" and "try again"
		// and don't show the number of attempts.
		document.getElementById("checkAnswerButton").innerHTML = "Save Answer";
		document.getElementById("tryAgainButton").innerHTML = "Edit Answer";
	} else {
		displayNumberAttempts("This is your", "attempt", states);
	}}

/**
 * SAMPLE choiceDOM:
 *
 * <simpleChoice fixed="true" identifier="choice 1">
 *  <feedbackInline identifier="choice 1" showHide="show">Computers are much, much faster than this!  Almost everything a computer does involves adding numbers together. Even drawing a simple shape on the screen can force the computer to add hundreds, if not thousands, of numbers together</feedbackInline>
 *   It can add them together about once a second.
 * </simpleChoice>
 */
function CHOICE(choiceDOM) {
	this.dom = choiceDOM;
	this.identifier = this.dom.getAttribute('identifier');
	this.text = this.dom.lastChild.nodeValue;    // text choices that students will see.. can be html
	this.feedbackText = this.dom.getElementsByTagName('feedbackInline')[0].firstChild.nodeValue;
}

/**
 * returns the final feedbacktext, which includes
 * if it's correct, correct response
 * AND
 * feedback associated with this choice
 * PAS-1075 stuff would go in this function
 */
CHOICE.prototype.getFeedbackText = function(mcObj) {
	if(mcObj.correctResponseInterpretation == null || mcObj.correctResponseInterpretation == "") {
		/*
		 * if there is no correct answer, just return the feedback,
		 * this situation may occur when the student is just filling
		 * out a form
		 */
		return this.feedbackText;
	} else if (this.identifier == mcObj.correctResponseInterpretation) {
		return "CORRECT " + this.feedbackText;
	} else {
		return "INCORRECT " + this.feedbackText;
	}
}


/**
 * Checks Answer and updates display with correctness and feedback
 * Disables "Check Answer" button and enables "Try Again" button
 */
MC_CHECKBOX.prototype.checkAnswer = function() {
	var isCheckAnswerDisabled = hasClass("checkAnswerButton", "disabledLink");

	if (isCheckAnswerDisabled) {
		return;
	}

	enableCheckBoxes(false);        // disable radiobuttons
	addClassToElement("checkAnswerButton", "disabledLink"); // disable checkAnswerButton
	removeClassFromElement("tryAgainButton", "disabledLink");  // show try again button

	var radiobuttondiv = document.getElementById('radiobuttondiv');
	var inputbuttons = radiobuttondiv.getElementsByTagName('input');
	var mcState = new MCCBSTATE();
	for (var i=0;i<inputbuttons.length;i++) {
		var checked = inputbuttons[i].checked;
		if (checked) {
			var choiceIdentifier = inputbuttons[i].getAttribute('id');  // identifier of the choice that was selected

			// use the identifier to get the correctness and feedback
			var choice = this.getCHOICEByIdentifier(choiceIdentifier);
			if (choice) {
				
				var feedbackdiv = document.getElementById('feedbackdiv');
				feedbackdiv.innerHTML = choice.getFeedbackText(this);
				//var mcState = new MCCBSTATE(choiceIdentifier);
				mcState.addChoice(choiceIdentifier);
				//mcState.isCorrect = (choiceIdentifier == this.correctResponseInterpretation);
				//states.push(mcState);
				//alert('vle:' + this.vle);
				
				
				//alert('node:' + this.node);
				if (this.node != null) {
					//alert('firing: ' + this.node.nodeSessionEndedEvent + ";");
					// we're loading from the VLE, and have access to the node, so fire the ended session event
					this.node.nodeSessionEndedEvent.fire(null);
				}
			} else {
				alert('error');
			}
		}
	}
	states.push(mcState);
	
	if (this.vle != null) {
		this.vle.state.getCurrentNodeVisit().nodeStates.push(mcState);
	}
}

/**
 * enable checkAnswerButton
 * OR
 * disable checkAnswerButton
 */
function enableCheckAnswerButton(doEnable) {

	if (doEnable == 'true') {
		removeClassFromElement("checkAnswerButton", "disabledLink"); // disable checkAnswerButton
	} else {
		addClassToElement("checkAnswerButton", "disabledLink"); // disable checkAnswerButton
	}
}


/**
 * Enables radiobuttons so that user can click on them
 */
function enableCheckBoxes(doEnable) {	
	var radiobuttons = document.getElementsByName('checkbox');
	for (var i=0; i < radiobuttons.length; i++) {
		if (doEnable == 'true') {
			radiobuttons[i].removeAttribute('disabled');
		} else {
			radiobuttons[i].setAttribute('disabled', 'true');
		}
	}
}

/**
 * Clears HTML inside feedbackdiv
 */
function clearFeedbackDiv() {
	var feedbackdiv = document.getElementById('feedbackdiv');
	feedbackdiv.innerHTML = "";
}