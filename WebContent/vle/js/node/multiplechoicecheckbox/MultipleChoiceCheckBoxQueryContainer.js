/**
 * MultipleChoiceCheckBoxQueryContainer
 * 
 * An object that contains query entries for a specific 
 * MultipleChoiceCheckBox node.
 */

/**
 * Constructor
 * @param nodeId the nodeId for a specific node
 * @param prompt the prompt for this multiple choice check box question
 * @param choiceIdToValue an array that contains all the choiceIds, the
 * 		index/key of the array is the choiceId, the value is the user
 * 		displayed value
 */
function MultipleChoiceCheckBoxQueryContainer(nodeId, prompt, choiceIdToValue) {
	this.queryEntryArray = new Array();
	this.nodeId = nodeId;
	this.prompt = prompt;
	
	//an array that has (key, value) = (choiceId, choiceValue)
	this.choiceIdToValue = choiceIdToValue;
	this.choiceIdCount = {};
	
	for(var choiceId in this.choiceIdToValue) {
		this.choiceIdCount[choiceId] = 0;
	}	
}

/**
 * Adds a query entry into this container
 * @param queryEntry a MultipleChoiceCheckBoxQueryEntry
 */
MultipleChoiceCheckBoxQueryContainer.prototype.addQueryEntry = function(queryEntry) {
	this.queryEntryArray.push(queryEntry);
	
	var choices = queryEntry.getChoices();
	//update the count for the choiceIds that were chosen
	for(var x=0; x<choices.length; x++) {
		alert(choices[x]);
		this.choiceIdCount[choices[x]] = this.choiceIdCount[choices[x]] + 1;
	}
}

/**
 * Retrieves the number of students that chose the choiceId
 * @param choiceId the id for the choice
 * @return the number of students that chose the choiceId
 */
MultipleChoiceCheckBoxQueryContainer.prototype.retrieveCount = function(choiceId) {
	return this.choiceIdCount[choiceId];
}

/**
 * Retrieves all the choiceIds for this node/question
 * @return an array containing all the choiceIds
 */
MultipleChoiceCheckBoxQueryContainer.prototype.retrieveChoiceIds = function() {
	var choices = new Array();
	for(var choice in this.choiceIdToValue) {
		choices.push(choice);
	}
	return choices;
}

/**
 * Returns an html string that displays accumulated data as well as 
 * individual student data for this node/step
 * @return an html string that displays aggregate data and individual 
 * 		student data
 */
MultipleChoiceCheckBoxQueryContainer.prototype.printContainer = function() {
	var print = "";
	var total = 0;
	
	print += this.prompt;
	
	/* display answers and totals and percentages that students chose e.g.
	 * Accumulated Data
	 * Fish: 1 [12.5%]
	 * Plankton: 2 [25%]
	 * Crustaceans: 2 [25%]
	 * Algae: 2 [25%]
	 * Not enough information: 1 [12.5%]
	 * Total: 8
	 */
	 
	print += "<hr>";
	print += "<b>Accumulated Data</b>";
	print += "<br>";
	
	var choiceIds = this.retrieveChoiceIds();
	
	/*
	 * calculate the total number of choices students have chosen by
	 * accumulating all the counts for all the choiceIds
	 */
	for(var x=0; x<choiceIds.length; x++) {
		var choiceId = choiceIds[x];
		total += this.retrieveCount(choiceId);
	}
	
	/*
	 * loop through all the choices and retrieve the count for each
	 * choiceId and also calculate the percentage for the choiceId
	 * by dividing it with the total from above.
	 */
	for(var z=0; z<choiceIds.length; z++) {
		var choiceId2 = choiceIds[z];
		var percentage = 0;
		var choiceCount = this.retrieveCount(choiceId2);
		if(total != 0) {
			percentage = (choiceCount * 100 / total);
		}
		print += this.choiceIdToValue[choiceId2] + ": " + choiceCount + " [" + percentage + "%]";
		print += "<br>";
	}
	
	print += "Total: " + total;
	print += "<br><hr><br>";
	
	
	/*
	 * display the answers for everyone that answered this question e.g.
	 * 
	 * Individual Data
	 * [User 5] answered
	 * Fish
	 * Plankton
	 * Crustaceans
	 * Algae
	 * Not enough information
	 * 
	 * [User 6] answered
	 * Plankton
	 * Crustaceans
	 * Algae
	 */
	print += "<b>Individual Data</b>";
	print += "<br>";
	
	//loop through all the query entries
	for(var y=0; y<this.queryEntryArray.length; y++) {
		//display the data in the query entry
		print += this.queryEntryArray[y].printEntry();
		print += "<br>";
	}
	
	return print;
}