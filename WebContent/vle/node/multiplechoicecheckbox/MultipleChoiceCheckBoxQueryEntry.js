/**
 * MultipleChoiceCheckBoxQueryEntry
 * 
 * An object that contains student work for a multiple choice check box node
 * for a specific student.
 */

MultipleChoiceCheckBoxQueryEntry.prototype = new QueryEntry();
MultipleChoiceCheckBoxQueryEntry.prototype.constructor = MultipleChoiceCheckBoxQueryEntry;
MultipleChoiceCheckBoxQueryEntry.prototype.parent = QueryEntry.prototype;

/**
 * Constructor
 * @param dataId the dataId for a specific student
 * @param nodeId the nodeId for a specific node
 * @param prompt the prompt for this multiple choice check box node
 * @param choiceIdToValue an array that contains all the choices the
 * 		student chose. The array contains (key, value) = (choiceId, choiceValue)
 */
function MultipleChoiceCheckBoxQueryEntry(dataId, userName, nodeId, prompt, choiceIdToValue) {
	this.dataId = dataId;
	this.userName = userName;
	this.nodeId = nodeId;
	this.prompt = prompt;
	
	/*
	 * an array of choices that the student chose
	 * (key, value) = (choiceId, choiceValue)
	 */
	this.choiceIdToValue = choiceIdToValue;
}

/**
 * Gets html representation of the student's work
 * @return html that displays the student's work
 */
MultipleChoiceCheckBoxQueryEntry.prototype.printEntry = function() {
	var print = "[" + this.userName + "] answered <br>";
	for(var choiceId in this.choiceIdToValue) {
		print += this.choiceIdToValue[choiceId];
		print += "<br>";
	}
	
	return print;
}

/**
 * Gets the choiceIds of the choices the student chose
 * @return an array of choiceIds that the student chose
 */
MultipleChoiceCheckBoxQueryEntry.prototype.getChoices = function() {
	var choices = new Array();
	for(var choiceId in this.choiceIdToValue) {
		choices.push(choiceId);
	}
	return choices;
}

/**
 * Gets html representation of the student's work for "View Work By Student".
 * @return an html string that displays the prompt and the choices the student chose
 */
MultipleChoiceCheckBoxQueryEntry.prototype.printStudentEntry = function() {
	var print = "";
	
	print += this.prompt;
	print += "<br>";
	
	for(var choiceId in this.choiceIdToValue) {
		print += this.choiceIdToValue[choiceId];
		print += "<br>";
	}
	
	return print;
}