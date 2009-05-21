/**
 * An object that contains Annotation objects 
 */

function Annotations() {
	this.annotationsArray = null;
}

/**
 * Adds the Annotation object to its array 
 * @param annotation an Annotation object
 */
Annotations.prototype.addAnnotation = function(annotation) {
	this.annotationsArray.push(annotation);
}

/**
 * Takes in an xml object and returns an array filled with annotation objects
 * example xml
 * <annotations>
 * 		<annotationEntry>
 * 			<runId>null</runId>
 * 			<nodeId>a3s2</nodeId>
 * 			<toWorkgroup>139</toWorkgroup>
 * 			<fromWorkgroup>2</fromWorkgroup>
 * 			<type>comment</type>
 * 			<value>great job</value>
 * 		</annotationEntry>
 * 		<annotationEntry>
 * 			<runId>null</runId>
 * 			<nodeId>a3s3</nodeId>
 * 			<toWorkgroup>139</toWorkgroup>
 * 			<fromWorkgroup>138</fromWorkgroup>
 * 			<type>comment</type>
 * 			<value>you suck</value>
 * 		</annotationEntry>
 * </annotations>
 * 
 * @param annotationsXML an xml object that contains annotations
 * @return an array filled with annotation objects
 */
Annotations.prototype.parseDataXML = function(annotationsXML) {
	var annotations = new Annotations();
	
	//the array to store the annotation objects
	annotations.annotationsArray = new Array();
	
	//the annotationEntry xml objects
	var annotationEntries = annotationsXML.getElementsByTagName("annotationEntry");
	
	//loop through the annotationEntry xml objects
	for(var x=0; x<annotationEntries.length; x++) {
		//get the annotationEntry xml object
		var annotationXML = annotationEntries[x];
		
		//create an annotation object
		var annotation = Annotation.prototype.parseDataXML(annotationXML);

		//alert(annotation.runId + "\n" + annotation.nodeId + "\n" + annotation.toWorkgroup + "\n" + annotation.fromWorkgroup + "\n" + annotation.type + "\n" + annotation.annotation);
		
		//add the annotation object to the array
		annotations.annotationsArray.push(annotation);
	}
	
	return annotations;
}

/**
 * Retrieves the latest annotation for the given nodeId
 * @param nodeId the nodeId to retrieve the annotation for
 * @return the latest annotation for the nodeId or null if none are found
 * 		for the nodeId
 */
Annotations.prototype.getLatestAnnotationForNodeId = function(nodeId) {
	var annotation = null;
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		tempAnnotation = this.annotationsArray[x];
		
		if(tempAnnotation.nodeId == nodeId) {
			annotation = tempAnnotation;
		}
	}
	
	return annotation;
}

/**
 * Retrieves all the annotations for a nodeId
 * @param nodeId the nodeId to retrieve annotations for
 * @return an array containing the annotations for the nodeId
 */
Annotations.prototype.getAnnotationsByNodeId = function(nodeId) {
	var annotations = new Array();
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.nodeId == nodeId) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
}

/**
 * Retrieves all the annotations for the toWorkgroup (student workgroup)
 * @param toWorkgroup the student workgroup id
 * @return an array containing the annotations for the toWorkgroup
 */
Annotations.prototype.getAnnotationsByToWorkgroup = function(toWorkgroup) {
	var annotations = new Array();
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.toWorkgroup == toWorkgroup) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
}

/**
 * Retrieves all the annotations for with the given nodeId and toWorkgroup
 * @param nodeId the id of the node
 * @param toWorkgroup the id of the student workgroup
 * @return an array containing the annotations with the nodeId and toWorkgroup
 */
Annotations.prototype.getAnnotationsByNodeIdAndToWorkgroup = function(nodeId, toWorkgroup) {
	var annotations = new Array();
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.nodeId == nodeId && annotation.toWorkgroup == toWorkgroup) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
}

/**
 * Retrieves the latest annotation with the given nodeId and toWorkgroup
 * @param nodeId the id of the node
 * @param toWorkgroup the id of the student workgroup
 * @return the latest annotation for the given nodeId and toWorkgroup
 */
Annotations.prototype.getLatestAnnotationByNodeIdAndToWorkgroupAndFromWorkgroup = function(nodeId, toWorkgroup, fromWorkgroup) {
	var annotation = null;
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var tempAnnotation = this.annotationsArray[x];
		
		if(tempAnnotation.nodeId == nodeId && tempAnnotation.toWorkgroup == toWorkgroup && tempAnnotation.fromWorkgroup == fromWorkgroup) {
			annotation = tempAnnotation;
		}
	}
	
	return annotation;
}

/**
 * Retrieves all the annotations for the given fromWorkgroup (workgroup giving the comment/grade)
 * @param fromWorkgroup the workgroup giving the comment/grade
 * @return an array of annotations written by the fromWorkgroup
 */
Annotations.prototype.getAnnotationsByFromWorkgroup = function(fromWorkgroup) {
	var annotations = new Array();
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.fromWorkgroup == fromWorkgroup) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
}

/**
 * Retrieves all the annotations with the given type 
 * @param type the type of annotation e.g. comment, grade, etc.
 * @return an array containing all the annotations with the given type
 */
Annotations.prototype.getAnnotationsByType = function(type) {
	var annotations = new Array();
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.type == type) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
}

