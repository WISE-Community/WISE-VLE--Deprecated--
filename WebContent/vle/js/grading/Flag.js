/**
 * Represents a teacher flagging a specific revision of student work for
 * a specific step
 */

/**
 * Constructor 
 * @param runId
 * @param nodeId
 * @param toWorkgroup
 * @param fromWorkgroup
 * @param studentWork
 * @param postTime
 * @return
 */
function Flag(runId, nodeId, toWorkgroup, fromWorkgroup, studentWork, postTime) {
	this.runId = runId;
	this.nodeId = nodeId; //the node/step related to this annotation
	this.toWorkgroup = toWorkgroup; //the id for the entity that wrote the work
	this.fromWorkgroup = fromWorkgroup; //the id for the entity that is writing feedback/grading
	this.studentWork = studentWork; //the feedback/grading
	this.postTime = postTime;
}


/**
 * Takes an xml object and creates a Flag object
 * @param flagXML an xml object
 * @return a Flag object
 */
Flag.prototype.parseDataXML = function(flagXML) {
	var flag = new Annotation();
	
	//populate the fields from the xml object
	try {
		flag.runId = flagXML.getElementsByTagName("runId")[0].firstChild.nodeValue;
	} catch(err) {
		flag.runId = "";
	}
	
	try {
		flag.nodeId = flagXML.getElementsByTagName("nodeId")[0].firstChild.nodeValue;
	} catch(err) {
		flag.nodeId = "";
	}
	
	try {
		flag.toWorkgroup = flagXML.getElementsByTagName("toWorkgroup")[0].firstChild.nodeValue;
	} catch(err) {
		flag.toWorkgroup = "";
	}
	
	try {
		flag.fromWorkgroup = flagXML.getElementsByTagName("fromWorkgroup")[0].firstChild.nodeValue;
	} catch(err) {
		flag.fromWorkgroup = "";
	}
	
	try {
		flag.studentWork = flagXML.getElementsByTagName("studentWork")[0].firstChild.nodeValue;
	} catch(err) {
		flag.studentWork = "";
	}
	
	//annotation.postTime = annotationXML.getElementsByTagName("postTime")[0].firstChild.nodeValue;
	
	return flag;
}

/**
 * Creates the xml string version of the Flag object
 * @return an xml string representing the Flag object
 */
Flag.prototype.getDataXML = function() {
	var dataXML = "";
	
	dataXML += "<flagEntry>";
	dataXML += "<runId>" + this.runId + "</runId>";
	dataXML += "<nodeId>" + this.nodeId + "</nodeId>";
	dataXML += "<toWorkgroup>" + this.toWorkgroup + "</toWorkgroup>";
	dataXML += "<fromWorkgroup>" + this.fromWorkgroup + "</fromWorkgroup>";
	dataXML += "<value>" + this.studentWork + "</value>";
	dataXML += "</flagEntry>";
	
	return dataXML;
}