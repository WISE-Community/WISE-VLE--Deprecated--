function FILLIN(xmlDoc) {
	this.loadXMLDoc(xmlDoc);
}

FILLIN.prototype.loadXMLDoc = function(xmlDoc) {
  this.xmlDoc = xmlDoc;
  this.itemBody = this.xmlDoc.getElementsByTagName('itemBody')[0];
  this.responseDeclarations = this.xmlDoc.getElementsByTagName('responseDeclaration');
  this.interactiveDivHtml = null;
  this.html = "";
  this.elementSS = [];
  this.textEntryInteractions = [];
  var textEntryInteractions = this.itemBody.getElementsByTagName('textEntryInteraction');
  for (var i=0; i < textEntryInteractions.length; i++) {
	  var textEntryInteraction = new TEXTENTRYINTERACTION(textEntryInteractions[i]);
	  textEntryInteraction.setResponseDeclaration(this.responseDeclarations);
	  this.textEntryInteractions.push(textEntryInteraction);
  }
}

/**
 * Load states from specified VLE.
 * @param {Object} vle
 */
FILLIN.prototype.loadFromVLE = function(node, vle) {
	this.vle = vle;
	this.node = node;
	this.loadState();
	this.render();
}

/**
 * Obtains a handle on the vle so that the fillin can access the
 * state of the VLE when it checks answer.
 */
FILLIN.prototype.setVLE = function(vle) {
	this.vle = vle;
}

/**
 * Loads state from VLE_STATE.
 * @param {Object} vleState
 */
FILLIN.prototype.loadState = function() {
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
 * Renders the Fill-in step at specified textInteractionEntryIndex state. All 
 * textInteractionEntries before the specified index will reveal the correct response.
 */
FILLIN.prototype.render = function(textInteractionEntryIndex) {
	this.html = "";
	clearFeedbackDiv();
	removeClassFromElement("checkAnswerButton", "disabledLink");
	addClassToElement("tryAgainButton", "disabledLink");
	addClassToElement("nextButton", "disabledLink");

	// render the interactions
	for (var i=0; i < this.textEntryInteractions.length; i++) {
		var oldNode = this.textEntryInteractions[i];
	}
	
	this.generateNonInteractiveDivHtml(this.itemBody);
	var nonInteractiveDiv = document.getElementById('nonInteractiveDiv');
	nonInteractiveDiv.innerHTML=this.html;
	
	var interactiveDiv = document.getElementById('interactiveDiv');
	interactiveDiv.innerHTML=this.generateInteractiveDivHtml(textInteractionEntryIndex);
}

/**
 * Generates html for the interactiveDiv, which is basically the text input box.
 */
FILLIN.prototype.generateInteractiveDivHtml = function(textInteractionEntryIndex) {
	var textInteractionEntry = this.textEntryInteractions[parseInt(textInteractionEntryIndex)];
	if(textInteractionEntry){
		var responseId = textInteractionEntry.responseIdentifier;
		var expectedLength = textInteractionEntry.expectedLength;
		var humanIndex = parseInt(textInteractionEntryIndex)+1;
		return "<b>Answer for blank #"+humanIndex+": </b><input maxLength=\""+expectedLength+"\" id=\"responseBox\" type=\"text\"></input>";
	};
}

/**
 * Generates html for the nonInteractiveDiv. This is the part with no interactivity.
 */
FILLIN.prototype.generateNonInteractiveDivHtml = function(node) {
	var children = node.childNodes;
	for (var i=0; i < children.length; i++) {
		if (children[i].nodeName == "htmltext" && children[i].firstChild) {
			this.html += children[i].firstChild.nodeValue;
		} else if (children[i].nodeName == "textEntryInteraction") {
			var responseIdStr = children[i].getAttribute('responseIdentifier');
			var responseId = responseIdStr.substring(responseIdStr.indexOf("_")+1, responseIdStr.length);
			if (parseInt(responseId) < currentTextEntryInteractionIndex) {
				var studentResponse;
				// changing to actual student response -- if not found, revert to correct answer
				for(var z=0;z<states.length;z++){
					if(states[z].textEntryInteractionIndex==currentTextEntryInteractionIndex - 1){
						studentResponse = states[z].response;
					};
				};
				if(studentResponse==null){
					studentResponse = this.textEntryInteractions[parseInt(responseId)].responseDeclaration.correctResponse;
				};
				this.html += "<input type=\'text\' class=\"completedBlank\" disabled value=\""+ studentResponse +"\"></input>";
			} else {
				var humanIndex = parseInt(responseId)+1;
				if (responseId == currentTextEntryInteractionIndex) {    // add activeBlank class if the box is current box.
				    this.html += "<input type=\'text\' class=\"activeBlank\" name =\"activeBlank\" disabled value=\"#"+ humanIndex +"\"></input>";				
				} else {
					this.html += "<input type=\'text\' disabled value=\"#"+ humanIndex +"\"></input>";				
				}
			}
		}
		this.generateNonInteractiveDivHtml(children[i]);
	}
}

/**
 * Lets students try again. Keeps currentTextEntryInteractionIndex the same and enables and disables buttons.
 * Clears FeedbackDiv and inputbox
 */
FILLIN.prototype.tryAgain = function() {
	var isTryAgainDisabled = hasClass("tryAgainButton", "disabledLink");

	if (isTryAgainDisabled) {
		return;
	}
	
	removeClassFromElement("checkAnswerButton", "disabledLink");
	addClassToElement("tryAgainButton", "disabledLink");
	setResponseBoxEnabled(true);
	clearFeedbackDiv();
	clearResponseBox();
}

FILLIN.prototype.checkAnswer = function() {
	var isCheckAnswerDisabled = hasClass("checkAnswerButton", "disabledLink");

	if (isCheckAnswerDisabled) {
		return;
	}

	removeClassFromElement("tryAgainButton", "disabledLink");
	addClassToElement("checkAnswerButton", "disabledLink");
	setResponseBoxEnabled(false);

	var inputElement = document.getElementById('responseBox');
	var studentAnswerText = inputElement.value;
	var textEntryInteraction = this.textEntryInteractions[currentTextEntryInteractionIndex];
	
	// add a new STATE
	states.push(new FILLINSTATE(currentTextEntryInteractionIndex, studentAnswerText));
	if (this.vle != null) {
		this.vle.state.getCurrentNodeVisit().nodeStates.push(new FILLINSTATE(currentTextEntryInteractionIndex, studentAnswerText));
	}
	
	// update feedback
	var feedbackDiv = document.getElementById("feedbackDiv");
	if (textEntryInteraction.isCorrect(studentAnswerText)) {
		removeClassFromElement("feedbackDiv", "incorrect");
		addClassToElement("feedbackDiv", "correct");	
		addClassToElement("tryAgainButton", "disabledLink");
		removeClassFromElement("nextButton", "disabledLink");
		
		feedbackDiv.innerHTML = "Correct.";
		document.getElementsByName("activeBlank")[0].value = studentAnswerText;   // display activeBlank with correctAnswer
		if (currentTextEntryInteractionIndex+1 < this.textEntryInteractions.length) {
		} else {
			addClassToElement("nextButton", "disabledLink");
			feedbackDiv.innerHTML += " You successfully filled all of the blanks.  Impressive work!";			
			feedbackDiv.innerHTML += " You successfully filled " + this.textEntryInteractions.length + " blanks in " + states.length + " tries.";			
		}
	} else {
		removeClassFromElement("feedbackDiv", "correct");
		addClassToElement("feedbackDiv", "incorrect");		
		feedbackDiv.innerHTML = "Not correct or misspelled";
	}
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/fillin/fillin.js");