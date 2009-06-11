function TEXTENTRYINTERACTION(textEntryInteractionElement) {
	this.element = textEntryInteractionElement;
	this.responseIdentifier = textEntryInteractionElement.getAttribute('responseIdentifier');
	this.expectedLength = textEntryInteractionElement.getAttribute('expectedLength');
	this.responseDeclaration = null;
	this.parentNode = textEntryInteractionElement.parentNode;

}

TEXTENTRYINTERACTION.prototype.setResponseDeclaration = function(responseDeclarationElements) {
	for (var i = 0; i < responseDeclarationElements.length; i++) {
		if (responseDeclarationElements[i].getAttribute('identifier') == this.responseIdentifier) {
			this.responseDeclaration = new RESPONSEDECLARATION(responseDeclarationElements[i]);
		}
	}
}

TEXTENTRYINTERACTION.prototype.isCorrect = function(studentAnswer) {
	if (studentAnswer == this.responseDeclaration.correctResponse) {
		return true;
	} else {
		for (var i=0; i < this.responseDeclaration.otherCorrectResponses.length; i++) {
			if (studentAnswer == this.responseDeclaration.otherCorrectResponses[i]) {
				return true;
			}
		}
		return false;
	}
}

function RESPONSEDECLARATION(responseDeclarationElement) {
	this.element = responseDeclarationElement;
	this.correctResponse = this.element.getElementsByTagName('correctResponse')[0].getElementsByTagName('value')[0].firstChild.nodeValue;
	this.otherCorrectResponses = [];
	
	var otherResponses = this.element.getElementsByTagName('mapEntry');
	for (var i=0; i < otherResponses.length; i++) {
		this.otherCorrectResponses.push(otherResponses[i].getAttribute('mapKey'));
	}
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/fillin/textentryinteraction.js");	