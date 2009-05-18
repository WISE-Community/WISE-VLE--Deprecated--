/**
 * An object that represents one annotation. A comment by itself is considered
 * one annotation. The grade is also considered one annotation by itself. This
 * means if the teacher writes a comment and a grade, the teacher will be
 * creating two annotations.
 */

/**
 * Constructor
 */
function Annotation(runId, nodeId, toWorkgroup, fromWorkgroup, type, value, postTime) {
	this.runId = runId;
	this.nodeId = nodeId; //the node/step related to this annotation
	this.toWorkgroup = toWorkgroup; //the id for the entity that wrote the work
	this.fromWorkgroup = fromWorkgroup; //the id for the entity that is writing feedback/grading
	this.type = type; //specifies the type of annotation
	this.value = value; //the feedback/grading
	this.postTime = postTime;
}

/**
 * Parses an annotation xml object into an Annotation object
 * @param annotationXML an xml object containing an annotation XML
 * @return an annotation object
 */
Annotation.prototype.parseDataXML = function(annotationXML) {
	var annotation = new Annotation();
	
	//populate the fields from the xml object
	annotation.runId = annotationXML.getElementsByTagName("runId")[0].firstChild.nodeValue;
	annotation.nodeId = annotationXML.getElementsByTagName("nodeId")[0].firstChild.nodeValue;
	annotation.toWorkgroup = annotationXML.getElementsByTagName("toWorkgroup")[0].firstChild.nodeValue;
	annotation.fromWorkgroup = annotationXML.getElementsByTagName("fromWorkgroup")[0].firstChild.nodeValue;
	annotation.type = annotationXML.getElementsByTagName("type")[0].firstChild.nodeValue;
	annotation.value = annotationXML.getElementsByTagName("value")[0].firstChild.nodeValue;
	//annotation.postTime = annotationXML.getElementsByTagName("postTime")[0].firstChild.nodeValue;
	
	return annotation;
}

/**
 * Returns the xml string value for this Annotation object
 * @return xml string
 */
Annotation.prototype.getDataXML = function() {
	var dataXML = "";
	
	dataXML += "<annotationEntry>";
	dataXML += "<runId>" + this.runId + "</runId>";
	dataXML += "<nodeId>" + this.nodeId + "</nodeId>";
	dataXML += "<toWorkgroup>" + this.toWorkgroup + "</toWorkgroup>";
	dataXML += "<fromWorkgroup>" + this.fromWorkgroup + "</fromWorkgroup>";
	dataXML += "<type>" + this.type + "</type>";
	dataXML += "<value>" + this.value + "</value>";
	dataXML += "</annotationEntry>";
	
	return dataXML;
}
