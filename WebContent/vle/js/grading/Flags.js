/**
 * Keeps track of multiple Flag objects
 */

/**
 * Constructor
 */
function Flags() {
	this.flagsArray = new Array();
}

/**
 * Adds a Flag object to its array of flags
 * @param flag a Flag object
 */
Flags.prototype.addFlag = function(flag) {
	this.flagsArray.push(flag);
}

/**
 * Remove the Flag object with the corresponding data values
 * @param runId
 * @param nodeId
 * @param toWorkgroup
 * @param fromWorkgroup
 * @param studentWork
 */
Flags.prototype.removeFlag = function(runId, nodeId, toWorkgroup, fromWorkgroup, studentWork) {
	//alert("removeFlag: " + "\nrunId: " + runId + "\nnodeId: " + nodeId + "\ntoWorkgroup: " + toWorkgroup + "\nfromWorkgroup: " + fromWorkgroup + "\nstudentWork: " + studentWork);
	for(var x=0; x<this.flagsArray.length; x++) {
		var flag = this.flagsArray[x];
		
		if(flag.runId == runId &&
				flag.nodeId == nodeId &&
				flag.toWorkgroup == toWorkgroup &&
				flag.fromWorkgroup == fromWorkgroup &&
				flag.studentWork == studentWork) {
			this.flagsArray.splice(x, 1);
		}
	}
}

/**
 * Takes in an xml object that contains flags and returns a Flags object
 * @param flagsXML an xml object that contains flag xml objects
 * @return a Flags object that contains Flag objects
 */
Flags.prototype.parseDataXML = function(flagsXML) {
	var flags = new Flags();
	
	//the array to store the flag objects
	flags.flagsArray = new Array();
	
	//the flagEntry xml objects
	var flagEntries = flagsXML.getElementsByTagName("flagEntry");
	
	//loop through the flagEntry xml objects
	for(var x=0; x<flagEntries.length; x++) {
		//get the flagEntry xml object
		var flagXML = flagEntries[x];
		
		//create a flag object
		var flag = Flag.prototype.parseDataXML(flagXML);

		//alert(annotation.runId + "\n" + annotation.nodeId + "\n" + annotation.toWorkgroup + "\n" + annotation.fromWorkgroup + "\n" + annotation.type + "\n" + annotation.annotation);
		
		//add the annotation object to the array
		flags.flagsArray.push(flag);
	}
	
	return flags;
}

/**
 * Retrieve the flag with the corresponding values
 * @param runId
 * @param nodeId
 * @param toWorkgroup
 * @param fromWorkgroup
 * @return a Flag object
 */
Flags.prototype.getFlag = function(runId, nodeId, toWorkgroup, fromWorkgroup) {
	var flag = null;
	
	for(var x=0; x<this.flagsArray.length; x++) {
		var tempFlag = this.flagsArray[x];
		
		if(tempFlag.runId == runId && 
				tempFlag.nodeId == nodeId &&
				tempFlag.toWorkgroup == toWorkgroup && 
				tempFlag.fromWorkgroup == fromWorkgroup) {
			flag = tempFlag;
		}
	}
	
	return flag;
}