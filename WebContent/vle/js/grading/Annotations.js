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

