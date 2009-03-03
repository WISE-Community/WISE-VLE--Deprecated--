function MC(xmlDoc) {
	this.xmlDoc = xmlDoc;
	this.responseDeclarations = this.xmlDoc.getElementsByTagName('responseDeclaration');
	this.responseIdentifier = this.xmlDoc.getElementsByTagName('choiceInteraction')[0].getAttribute('responseIdentifier');
	this.promptText = this.xmlDoc.getElementsByTagName('prompt')[0].firstChild.nodeValue;
	this.choices = [];

	var choicesDOM = this.xmlDoc.getElementsByTagName('simpleChoice');

	// instantiate choices
	for (var i=0;i<choicesDOM.length;i++) {
		var choice = new CHOICE(choicesDOM[i]);
		this.choices.push(choice);
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
MC.prototype.loadFromVLE = function(node, vle) {
	this.vle = vle;
	this.node = node;
	this.loadState();
	this.render();
}

/**
 * Loads state from VLE_STATE.
 * @param {Object} vleState
 */
MC.prototype.loadState = function() {
	for (var i=0; i < this.vle.state.visitedNodes.length; i++) {
		var nodeVisit = this.vle.state.visitedNodes[i];
		if (nodeVisit.node == this.node) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			}
		}
	}
}

//gets and returns a CHOICE object given the CHOICE's identifier
MC.prototype.getCHOICEByIdentifier = function(identifier) {
	for (var i=0;i<this.choices.length;i++) {
		if (this.choices[i].identifier == identifier) {
			return this.choices[i];
		}
	}
	return null;
}

/**
 * Render the MC
 */
MC.prototype.render = function() {

	// render the prompt
	var promptdiv = document.getElementById('promptDiv');
	promptdiv.innerHTML=this.promptText;

	// render choices
	var radiobuttondiv = document.getElementById('radiobuttondiv');
	while(radiobuttondiv.hasChildNodes()) {
		radiobuttondiv.removeChild(radiobuttondiv.firstChild);
	}

	for(var i=0;i<this.choices.length;i++) {
		var radiobuttonElement = createElement(document, 'input', {'id':this.choices[i].identifier, 'type':'radio', 'name':'radiobutton', 'value':this.choices[i].identifier, 'class':'radiobutton', 'onClick':"javascript:enableCheckAnswerButton('true');"});
		var radiobuttonText = document.createTextNode(this.choices[i].text);
		radiobuttondiv.appendChild(radiobuttonElement);
		radiobuttondiv.appendChild(radiobuttonText);
		radiobuttondiv.appendChild(createElement(document, 'br', {}));
	}
	addClassToElement("checkAnswerButton", "disabledLink");
	addClassToElement("tryAgainButton", "disabledLink");
	clearFeedbackDiv();
	displayNumberAttempts("This is your", "attempt");
}

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
CHOICE.prototype.getFeedbackText = function() {
	if (this.identifier == mc.correctResponseInterpretation) {
		return "CORRECT " + this.feedbackText;
	} else {
		return "INCORRECT " + this.feedbackText;
	}
}


/**
 * 1) if shuffle is on, shuffle choices
 * 2) clears feedbackdiv
 * 3) enables checkAnswerButton
 * 4) hides tryAgainButton
 */
function tryAgain() {
	var isTryAgainDisabled = hasClass("tryAgainButton", "disabledLink");

	if (isTryAgainDisabled) {
		return;
	}

	mc.render();
}

/**
 * Checks Answer and updates display with correctness and feedback
 * Disables "Check Answer" button and enables "Try Again" button
 */
MC.prototype.checkAnswer = function() {
	var isCheckAnswerDisabled = hasClass("checkAnswerButton", "disabledLink");

	if (isCheckAnswerDisabled) {
		return;
	}

	enableRadioButtons(false);        // disable radiobuttons
	addClassToElement("checkAnswerButton", "disabledLink"); // disable checkAnswerButton
	removeClassFromElement("tryAgainButton", "disabledLink");  // show try again button

	var radiobuttondiv = document.getElementById('radiobuttondiv');
	var inputbuttons = radiobuttondiv.getElementsByTagName('input');
	for (var i=0;i<inputbuttons.length;i++) {
		var checked = inputbuttons[i].checked;
		if (checked) {
			var choiceIdentifier = inputbuttons[i].getAttribute('id');  // identifier of the choice that was selected

			// use the identifier to get the correctness and feedback
			var choice = mc.getCHOICEByIdentifier(choiceIdentifier);
			if (choice) {
				var feedbackdiv = document.getElementById('feedbackdiv');
				feedbackdiv.innerHTML = choice.getFeedbackText();
				
				states.push(new MCSTATE(choiceIdentifier));
				if (this.vle != null) {
					this.vle.state.getCurrentNodeVisit().nodeStates.push(new MCSTATE(choiceIdentifier));
				}
			} else {
				alert('error');
			}
		}
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
function enableRadioButtons(doEnable) {	
	var radiobuttons = document.getElementsByName('radiobutton');
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