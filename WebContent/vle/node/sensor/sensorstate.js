/*
 * This is the object that we use to save student data from a sensor step
 */

/**
 * The constructor for the sensor state
 * @param response the text response the student typed
 * @param sensorDataArray an array containing data from the sensor
 * @param annotationArray an array containing objects that represent annotations
 * for points on the graph 
 * @param timestamp the time the sensor state was created
 */
function SENSORSTATE(response, sensorDataArray, annotationArray, timestamp) {
	//the text response the student wrote
	this.response = "";
	
	//an array of the data points retrieved from the sensor
	this.sensorDataArray = [];
	
	//an array of annotations the student has created
	this.annotationArray = [];
	
	if(response != null) {
		//set the response if it was provided to the constructor
		this.response = response;
	}
	
	if(sensorDataArray != null) {
		//set the data array if it was provided to the constructor
		this.sensorDataArray = sensorDataArray;
	}
	
	if(annotationArray != null) {
		//set the data array if it was provided to the constructor
		this.annotationArray = annotationArray;
	}
	
	if(timestamp == null) {
		//set the timestamp to the current time if timestamp is not provided
		this.timestamp = new Date().getTime();
	} else {
		this.timestamp = timestamp;
	}
};

/**
 * Creates a SENSORSTATE object from the data in the JSON object
 * @param stateJSONObj a JSON object containing data for a SENSORSTATE
 * @return a SENSORSTATE object with the attributes populated
 */
SENSORSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	//get the student response
	var response = stateJSONObj.response;
	
	//get the sensor data array
	var sensorDataArray = stateJSONObj.sensorDataArray;
	
	//get the annotation array
	var annotationArray = stateJSONObj.annotationArray;
	
	//get the timestamp
	var timestamp = stateJSONObj.timestamp;

	//create a SENSORSTATE object
	var sensorState = new SENSORSTATE(response, sensorDataArray, annotationArray, timestamp);
	
	return sensorState;
};

/**
 * Adds an element into the sensor data array. This is called when
 * the student is using the sensor to collect data.
 * @param x the x value of the data
 * @param y the y value of the data
 */
SENSORSTATE.prototype.dataReceived = function(x, y) {
	//create an object that contains the x, y points
	var sensorData = {
			x: x,
			y: y
	};
	
	//add the sensor data object to the sensor data array
	this.sensorDataArray.push(sensorData);
};

/**
 * Clears the sensor data array. This is called when the student
 * clicks on the Clear button.
 */
SENSORSTATE.prototype.clearSensorData = function() {
	//clear the sensor data array by setting it to a new empty array
	this.sensorDataArray = [];
};

/**
 * Clears the annotation array. This is called when the student
 * clicks the Clear button or when they re-collect new graph data.
 */
SENSORSTATE.prototype.clearAnnotations = function() {
	//clear the sensor data array by setting it to a new empty array
	this.annotationArray = [];
};

/**
 * We will just return this SENSORSTATE object as the student work
 * because it contains the sensor data as well as the student response
 * @return the student work
 */
SENSORSTATE.prototype.getStudentWork = function() {
	var studentWork = this;
	
	return studentWork;
};

/**
 * Get an annotation object given the seriesName and dataIndex
 * @param seriesName the name of the graph line
 * e.g.
 * 'distance'
 * 'velocity'
 * 'acceleration'
 * 'temperature'
 * @param dataIndex the index on the graph line
 * @return an annotation object or null if none was found to match
 */
SENSORSTATE.prototype.getAnnotation = function(seriesName, dataIndex) {
	var annotation = null;
	
	//loop through all the annotations
	for(var x=0; x<this.annotationArray.length; x++) {
		//get an annotation
		var tempAnnotation = this.annotationArray[x];
		
		//check if the series name and data index match
		if(tempAnnotation.seriesName == seriesName && tempAnnotation.dataIndex == dataIndex) {
			//values match so we have found the annotation we want
			annotation = tempAnnotation;
			
			//jump out of the for loop
			break;
		}
	}
	
	return annotation;
};

/**
 * Add a new annotation to the annotation array
 * @param seriesName the name of the graph line
 * e.g.
 * 'distance'
 * 'velocity'
 * 'acceleration'
 * 'temperature'
 * @param dataIndex the index on the graph line
 * @param dataText the text representation of the data point
 * e.g.
 * 'distance [8.445 s, 0.1 m]'
 */
SENSORSTATE.prototype.addAnnotation = function(seriesName, dataIndex, dataText) {
	var annotation = {
		seriesName:seriesName,
		dataIndex:dataIndex,
		dataText:dataText,
		annotationText:""
	};
	
	this.annotationArray.push(annotation);
};

/**
 * Delete the annotation from the annotation array
 * @param seriesName the name of the graph line
 * e.g.
 * 'distance'
 * 'velocity'
 * 'acceleration'
 * 'temperature'
 * @param dataIndex the index on the graph line
 */
SENSORSTATE.prototype.deleteAnnotation = function(seriesName, dataIndex) {
	//loop through all the annotations
	for(var x=0; x<this.annotationArray.length; x++) {
		//get an annotation
		var annotation = this.annotationArray[x];

		//check if the series name and data index match
		if(annotation.seriesName == seriesName && annotation.dataIndex == dataIndex) {
			//remove the annotation from the array
			this.annotationArray.splice(x, 1);
		}
	}
};

/**
 * Save the text the student has written for the annotation
 * @param seriesName the name of the graph line
 * e.g.
 * 'distance'
 * 'velocity'
 * 'acceleration'
 * 'temperature'
 * @param dataIndex the index on the graph line
 * @param annotationText the text the student has written for the annotation
 */
SENSORSTATE.prototype.editAnnotation = function(seriesName, dataIndex, annotationText) {
	//loop through all the annotations
	for(var x=0; x<this.annotationArray.length; x++) {
		//get an annotation
		var annotation = this.annotationArray[x];
		
		//check if the series name and data index match
		if(annotation.seriesName == seriesName && annotation.dataIndex == dataIndex) {
			//set the text the student wrote
			annotation.annotationText = annotationText;
		}
	}
};

/**
 * Get the human readable form of the annotations as a string
 * @return a string containing the human readable form of the annotations
 * e.g.
 * distance [11.61 s, 0.72 m]: this is where it was the highest
 * velocity [13.87 s, -0.09 m/s]: this is where it was the fastest
 */
SENSORSTATE.prototype.getAnnotationsHtml = function() {
	var annotationsHtml = "<br>";
	
	//loop through all the annotations
	for(var x=0; x<this.annotationArray.length; x++) {
		//get an annotation
		var annotation = this.annotationArray[x];
		var dataText = annotation.dataText;
		var annotationText = annotation.annotationText;
		var seriesName = annotation.seriesName;
		
		/*
		 * get the human readable form of the annotation
		 * e.g.
		 * distance [11.61 s, 0.72 m]: this is where it was the highest
		 */
		annotationsHtml += seriesName + " [" + dataText + "]: " + annotationText;
		annotationsHtml += "<br>";
	}
	
	return annotationsHtml;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/sensor/sensorstate.js');
}