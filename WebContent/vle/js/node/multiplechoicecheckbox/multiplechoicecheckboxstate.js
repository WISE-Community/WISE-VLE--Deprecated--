/**
 * Object for storing state information of MultipleChoiceCheckBox item.
 * The choices array contains all the choices the student chose for a
 * single submission.
 */
function MCCBSTATE(timestamp, choicesArray) {
	this.isCorrect = null;

	//use the current time or the argument timestamp passed in
	if(arguments.length == 0) {
		this.timestamp = new Date();
	} else {
		this.timestamp = timestamp;
	}
	
	//if a choices array was passed in, set it, otherwise create an empty array
	if(arguments.length == 2){
		this.choices = choicesArray;
	} else {
		this.choices = new Array();
	}
}

/*
 * Add a choice that the student chose
 */
MCCBSTATE.prototype.addChoice = function(choice) {
	this.choices.push(choice);
}


/**
 * Returns xml representation of this student state for student data logging
 * and storage in the db.
 * @return an xml string that contains the student's work which includes
 * 		the choices they chose and a timestamp
 */
MCCBSTATE.prototype.getDataXML = function() {
	var dataXML = "<choices>";
	for(var x=0; x<this.choices.length; x++) {
		dataXML += "<choice>" + this.choices[x] + "</choice>";
	}
	dataXML += "</choices>";
	dataXML += "<timestamp>" + this.timestamp + "</timestamp>";
	
	return dataXML;
}

/**
 * Creates a state object from an xml object. Used to convert xml
 * into a real object such as when loading a project in the authoring
 * tool.
 * 
 * @param an xml object
 * @return a state object
 */
MCCBSTATE.prototype.parseDataXML = function(stateXML) {
	var choicesXML = stateXML.getElementsByTagName("choices")[0];
	var choicesXMLArray = choicesXML.getElementsByTagName("choice");
	var choiceArray = new Array();
	
	//loop through all the choices
	for(var x=0; x<choicesXMLArray.length; x++) {
		var choice = choicesXMLArray[x];
		var choiceValue = choice.textContent;
		choiceArray.push(choiceValue);
	}
	
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(timestamp == undefined || choiceArray.length == 0) {
		return null;
	} else {
		/*
		 * create and return the state if we've obtained sufficient data
		 * from the xml
		 */ 
		return new MCCBSTATE(timestamp.textContent, choiceArray);		
	}
}

/**
 * Returns the array of choices the student chose
 * @return the array of choice identifiers the student chose
 */
MCCBSTATE.prototype.getStudentWork = function() {
	return this.choices;
}