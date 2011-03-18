/*
 * This is the object that we use to perform rendering and logic in a
 * sensor step
 */

/**
 * The constructor for the sensor object that we use to peform rendering
 * and logic in a sensor step
 * @param node the step we are on
 * @param view the vle view
 */
function SENSOR(node) {
	//the step we are on
	this.node = node;
	
	//get the view from the node
	this.view = this.node.view;
	
	//the content for the step
	this.content = node.getContent().getContentJSON();
	
	/*
	 * a timestamp used for calculating the amount of time the sensor has
	 * been collecting data. this is only updated in startCollecting() and
	 * dataReceived()
	 */
	this.timeCheck = null;
	
	/*
	 * the amount of time that the sensor has been collecting data. this
	 * will be used as the x value (time) for the sensor data.
	 */
	this.elapsedTime = 0;
	
	if(node.studentWork != null) {
		//the student has work from previous visits to this step
		this.states = node.studentWork; 
	} else {
		//the student does not have any previous work for this step
		this.states = [];  
	};
	
	//the sensor state that will contain the student work
	this.sensorState = this.getLatestState();
	
	//flag to keep track of whether the student has change any axis range value this visit
	this.axisRangeChanged = false;
	
	if(this.content != null) {
		//get the graph parameters for displaying the data to the student
		this.graphParams = this.parseGraphParams(this.content.graphParams);
		
		//get the sensor type e.g. 'motion' or 'temperature'
		this.sensorType = this.content.sensorType;
	}
	
	/*
	 * flag to keep track of whether the student has modified the graph
	 * by retrieving data from the sensor
	 */
	this.graphChanged = false;
	
	//the names for the different types of graphs
	this.graphNames = {
			distance:"distance",
			velocity:"velocity",
			acceleration:"acceleration",
			temperature:"temperature"
	};
	
	//the units for the different types of graphs
	this.graphUnits = {
			distance:"m",
			velocity:"m/s",
			acceleration:"m/s^2",
			temperature:"C",
			time:"s"
	};

	//insert the prediction name and unit values into the graphNames and graphUnits arrays
	if(this.sensorType == "motion") {
		var graphName = "distance prediction";
		this.graphNames.prediction = graphName;
		this.graphUnits[graphName] = "m";
	} else if(this.sensorType == "temperature") {
		var graphName = "temperature prediction";
		this.graphNames.prediction = graphName;
		this.graphUnits[graphName] = "C";
	}
	
	/*
	 * used to store the plot variable returne from $.plot() so that we can access
	 * it from other functions
	 */
	this.globalPlot = null;
	
	/*
	 * flag to determine whether we need to clear the graph data when the student
	 * clicks the Start button. we want to clear the graph when they click the
	 * Start button the first time for each new visit of the step. subsequent
	 * clicks of the Start button during the same visit will cause the graph 
	 * data to append to the existing graph data.
	 */
	this.clearDataOnStart = true;
	
	//get the prediction from the previous step if there is a prevWorkNodeIds
	this.getPreviousPrediction();
};

/**
 * Render the sensor step
 */
SENSOR.prototype.render = function() {
	if(this.content.requirePredictionBeforeEnter && this.node.prevWorkNodeIds.length != 0 && this.sensorState.predictionArray.length == 0) {
		/*
		 * this step requires a prediction before opening, there is an associated prevWorkNodeId
		 * and there is no prediction so we will lock the student out of this step until they
		 * create the prediction in the previously associated step
		 */
		
		var prevWorkNodeId = this.node.prevWorkNodeIds[0];
		var prevWorkNodeTitle = this.view.getProject().getStepNumberAndTitle(prevWorkNodeId);
		
		//display the message to tell the student to create a prediction in the previously associated step
		document.getElementById('promptDiv').innerHTML = "You must make a prediction in step <a style=\"color:blue;text-decoration:underline;cursor:pointer\" onclick=\"eventManager.fire(\'renderNode\', [\'" + this.view.getProject().getPositionById(prevWorkNodeId) + "\'])\">" + prevWorkNodeTitle + "</a> before you can work on this step.";
		this.hideAllInputFields();
	} else {
		//set the prompt into the step
		document.getElementById('promptDiv').innerHTML = this.content.prompt;

		//plot the sensor data from the student's previous visit, if any
		this.plotData();
		
		//add the graph labels
		this.setupGraphLabels();
		
		//set the axis values
		this.setupAxisValues();
		
		//show the graph options if necessary
		this.showGraphOptions();
		
		//display the annotations, if any
		this.setupAnnotations();
		
		/*
		 * get the student's previous response, if any, and re-populate
		 * the response textarea with it
		 */
		var response = this.getResponseFromSensorState();
		$("#responseTextArea").val(response);
		
		//set the size of the text area
		$("#responseTextArea").attr('rows', this.content.expectedLines);
		$("#responseTextArea").attr('cols', 80);
		
		if(this.content.enableSensor != null && this.content.enableSensor == false) {
			//disable the sensor buttons
			this.disableSensorButtons();
		} else {
			/*
			 * insert the applet into the html. we need to insert it dynamically
			 * because the we need to dynamically determine what type of sensor
			 * we expect by looking at the content for this step
			 */
			this.insertApplet();		
		}
		
		if(!this.content.createPrediction) {
			//disable the prediction buttons
			this.disablePredictionButtons();
		}
		
		//display the starter sentence button if necessary
		this.displayStarterSentenceButton();
		
		/*
		 * used to determine if the student is click dragging on the graph
		 * for use when they are creating a prediction
		 */
		this.mouseDown = false;
		$("#graphDiv").bind('mousedown', {thisSensor:this},(function(event) {
			event.data.thisSensor.mouseDown = true;
		}));
		$("#graphDiv").bind('mouseup', {thisSensor:this},(function(event) {
			event.data.thisSensor.mouseDown = false;
		}));

		/*
		 * used to hide or show the annotation tool tips. if the student has
		 * their mouse in the graph div we will hide the annotation tool tips
		 * so that they don't block them from clicking on the plot points.
		 * when the mouse cursor is outside of the graph div we will show the
		 * annotation tool tips for them to view.
		 */
		$("#graphDiv").bind('mouseover', (function(event) {
			$(".activeAnnotationToolTip").hide();
		}));
		$("#graphDiv").bind('mouseleave', (function(event) {
			$(".activeAnnotationToolTip").show();
		}));
	}
};

/**
 * Get the latest student work for this step
 * @return the latest student work state object
 */
SENSOR.prototype.getLatestState = function() {
	//a new sensor state will be returned if there are no states
	var latestState = new SENSORSTATE();
	
	if(this.states != null && this.states.length > 0) {
		//get the last state in the states array
		latestState = this.states[this.states.length - 1];
	}
	
	return latestState;
};

/**
 * This is called when the student has started to collect data
 */
SENSOR.prototype.startCollecting = function() {
	if(this.clearDataOnStart) {
		/*
		 * clear the graph data and annotations because the student
		 * is re-collecting the graph data from scratch
		 */
		this.clearData();
		
		/*
		 * set this to false so that the next time they click the Start button
		 * their data won't be cleared. instead the data will be appended
		 * and the graph will start back up from where they stopped
		 */
		this.clearDataOnStart = false;
	}
	
	//get the current date
	var currentDate = new Date();
	
	//get the current time in milliseconds
	this.timeCheck = currentDate.getTime();
};

/**
 * This is called when the student has stopped collecting data
 */
SENSOR.prototype.stopCollecting = function() {
	//get the current date
	var currentDate = new Date();
	
	//get the current time in milliseconds
	var stopTime = currentDate.getTime();

	//update the timeCheck
	this.timeCheck = stopTime;
};

/**
 * This is called when the student clears the data they have collected
 */
SENSOR.prototype.clearData = function() {
	//clear the data from the graph and annotations
	this.sensorState.clearSensorData();
	
	//delete the annotations for the sensor data
	this.sensorState.removeSensorAnnotations();
	
	//remove the sensor annotations text boxes and delete buttons from the UI
	this.deleteSensorAnnotationsFromUI();
	
	//remove the annotation tool tips for the sensor data line from the UI
	this.removeAnnotationToolTipData();
	
	/*
	 * plot the graph again, there will be no sensor data so the 
	 * graph will essentially be blank
	 */
	this.plotData();
	
	//reset the elapsed time
	this.elapsedTime = 0;
	
	//update the flag since the graph has been cleared
	this.graphChanged = true;
};

/**
 * This is called when the sensor sends data to the applet
 * @param type the type of data (not used)
 * @param count some count value from the sensor (not used)
 * @param data the data from the sensor
 */
SENSOR.prototype.dataReceived = function(type, count, data) {
	//get the current date
	var currentDate = new Date();
	
	//get the current time in milliseconds
	var currentTime = currentDate.getTime();
	
	if(this.sensorState.sensorDataArray.length == 0) {
		//this is the first data point so we will set the elapsedTime value to 0
		this.elapsedTime = 0;
	} else {
		//update the amount of time that the sensor has been collecting data
		this.elapsedTime += currentTime - this.timeCheck;		
	}
	
	//update the time check
	this.timeCheck = currentTime;
	
	if(data != null) {
		if(data.constructor.toString().indexOf('Array') != -1) {
			/*
			 * data is an array so we just want the first element
			 * of the array since there is usually only one element.
			 * sometimes there are multiple elements but they are very
			 * close together in value so we aren't really losing
			 * much data. I'm not sure why data sometimes contains
			 * more than one element.
			 */
			data = data[0];
		} else {
			//data is not an array
		}
	}
	
	/*
	 * round the x vale to the nearest hundredth. elapsedTime is in milliseconds
	 * so we need to divide by 1000 to get seconds
	 */
	var x = parseFloat((this.elapsedTime / 1000).toFixed(2));
	
	//round the y value to the nearest hundredth
	var y = parseFloat(data.toFixed(2));
	
	//save the data point into the sensor state.
	this.sensorState.dataReceived(x, y);
	
	//update the graph
	this.plotData();
	
	//update the flag since the graph has changed
	this.graphChanged = true;
};

/**
 * Generate the data array that we will send to the graph to plot
 * @param state a SENSORSTATE object
 * @return an array containing data that will be used to plot
 * the data onto a graph
 */
SENSOR.prototype.generateGraphDataArray = function(state) {
	var dataArray = [];
	
	if(state != null) {
		//get the data array from the state
		var sensorDataArray = state.sensorDataArray;
		
		if(sensorDataArray != null) {

			/*
			 * the interval that we want to display data points. this is used
			 * to smooth out the graphs for the student and to spread out the
			 * data points so they aren't all clustered together.
			 * e.g. if the sampleInterval is set to 5, we will only show every
			 * 5th data point in the graph to the student
			 */
			var sampleInterval = 3;
			
			//loop through all the elements in the data array
			for(var i=0; i<sensorDataArray.length; i++) {
				
				/*
				 * check if we want to display this data point in regards
				 * to the sample interval
				 */
				if(i % sampleInterval == 0) {
					//get the data array element
					var sensorData = sensorDataArray[i];
					
					//get the time
					var x = sensorData.x;
					
					//get the y value. this may be distance or temp or etc.
					var y = sensorData.y;
					
					/*
					 * add the x, y data point into the array. flot expects
					 * the each element in the array to be an array.
					 */
					dataArray.push([x, y]);					
				}
			}
		}		
	}
	
	return dataArray;
};

/**
 * Get the previous response the student typed into the textarea
 * @return
 */
SENSOR.prototype.getPreviousResponse = function() {
	var previousResponse = "";
	
	//get the latest state
	var previousState = this.getLatestState();
	
	if(previousState != null) {
		//get the previous response
		previousResponse = previousState.response;
	}
	
	return previousResponse;
};

/**
 * Get the data array from the current sensor state
 * @return an array containing the sensor points that will
 * be used to plot on the graph
 */
SENSOR.prototype.getDataArray = function() {
	//get the graph data array from the current state 
	var graphDataArray = this.generateGraphDataArray(this.sensorState);
	
	return graphDataArray;
};

/**
 * Parse the graph parameters from the step content
 * @return an object we can use to pass to the flot graph to
 * specify how the graph should look
 */
SENSOR.prototype.parseGraphParams = function(contentGraphParams) {
	//create the object that will contain the graph params
	var graphParams = {};
	
	//create an xaxis object
	graphParams.xaxis = {};
	
	//create a yaxis object
	graphParams.yaxis = {};
	
	if(contentGraphParams != null) {
		if(contentGraphParams.xmin != null && contentGraphParams.xmin != "") {
			//set the xmin value
			graphParams.xaxis.min = contentGraphParams.xmin;
		}

		if(contentGraphParams.xmax != null && contentGraphParams.xmax != "") {
			//set the xmax value
			graphParams.xaxis.max = contentGraphParams.xmax;
		}

		if(contentGraphParams.ymin != null && contentGraphParams.ymin != "") {
			//set the ymin value
			graphParams.yaxis.min = contentGraphParams.ymin;
		}

		if(contentGraphParams.ymax != null && contentGraphParams.ymax != "") {
			//set the ymax value
			graphParams.yaxis.max = contentGraphParams.ymax;
		}
	}
	
	/*
	 * if the sensor state contains axis values it will override
	 * the axis values from the content
	 */
	if(this.sensorState != null) {
		if(this.sensorState.xMin != null) {
			//set the xmin value from the sensor state
			graphParams.xaxis.min = this.sensorState.xMin;
		}
		
		if(this.sensorState.xMax != null) {
			//set the xmax value from the sensor state
			graphParams.xaxis.max = this.sensorState.xMax;
		}
		
		if(this.sensorState.yMin != null) {
			//set the ymin value from the sensor state
			graphParams.yaxis.min = this.sensorState.yMin;
		}
		
		if(this.sensorState.yMax != null) {
			//set the ymax value from the sensor state
			graphParams.yaxis.max = this.sensorState.yMax;
		}
	}
	
	//turn lines and points on
	graphParams.series = {lines:{show:true}, points:{show:true}};
	
	//allow points to be hoverable and clickable
	graphParams.grid = {hoverable:true, clickable:true};
	
	return graphParams;
};

/**
 * Get the graphParams object that we will pass to the flot
 * graph to specify how the graph should look
 * @return
 */
SENSOR.prototype.getGraphParams = function() {
	//parse the graph params
	this.graphParams = this.parseGraphParams(this.content.graphParams);
	
	return this.graphParams;
};

/**
 * Save the student work for this step. This includes the sensor
 * data and the response the student typed. The this.sensorState
 * has the sensorDataArray already populated. The sensorDataArray
 * is updated whenever dataReceived() is called.
 */
SENSOR.prototype.save = function() {
	//get the response the student typed
	var response = this.getResponseFromTextArea();
	
	//get the previous student work
	var latestState = this.getLatestState();
	var previousResponse = '';
	
	if(latestState != null) {
		//get the previous response
		var previousResponse = latestState.response;
	}
	
	/*
	 * check that the student has changed the response or the graph or any annotations
	 */
	if(response != previousResponse || this.graphChanged || this.annotationsChanged || this.axisRangeChanged) {
		//set the student response into the state
		this.sensorState.response = response;
		
		if(!this.graphChanged) {
			//graph has not changed so we will need to use the graph data from the latest state
			this.sensorState.sensorDataArray = latestState.sensorDataArray;
		}
		
		//fire the event to push this state to the global view.states object
		eventManager.fire('pushStudentWork', this.sensorState);

		//push the state object into the local copy of states
		this.states.push(this.sensorState);		
	}
	
	/*
	 * changes have been saved or there were no changes so we will reset
	 * the flag back to false
	 */
	this.graphChanged = false;
	this.annotationsChanged = false;
	this.axisRangeChanged = false;
};

/**
 * Get the response the student wrote
 * @return the text in the textarea
 */
SENSOR.prototype.getResponseFromTextArea = function() {
	//get the textarea
	var responseTextArea = document.getElementById('responseTextArea');
	
	//get the text in the textarea
	return responseTextArea.value;
};

/**
 * Get the response from the sensor state
 * @return the response text from the current sensor state
 */
SENSOR.prototype.getResponseFromSensorState = function() {
	var response = "";
	
	//get the latest state
	var state = this.sensorState;
	
	if(state != null) {
		//get the response
		response = state.response;
	}
	
	return response;
};

/**
 * Plot the data onto the graph so the student can see it.
 * @param plotDivId the id of the div we will use to plot the graph
 * @param graphCheckBoxesDivId the id of the div we will put the filter check boxes in
 */
SENSOR.prototype.plotData = function(plotDivId, graphCheckBoxesDivId) {
	if(plotDivId == null) {
		//this will be the default plotDivId if none is provided as an argument
		plotDivId = "graphDiv";
	}
	
	if(graphCheckBoxesDivId == null) {
		//this will be the default graphCheckBoxesDivId if none is provided as an argument
		graphCheckBoxesDivId = "graphCheckBoxesDiv";
	}
	
	//get the data array that contains the points that we will plot on the graph
	var dataArray = this.getDataArray();

	//get the graph params
	var graphParams = this.getGraphParams();
	
	//get the prediction array
	var predictionArray = this.getPredictionArray();
	
	if(this.sensorType == 'motion') {
		//this is a motion sensor step
		
		var dataSets = [];
		                
		if(this.content.enableSensor != null && this.content.enableSensor == false) {
			//sensor is disabled so we only need to show the prediction line
			
			dataSets.push({data:predictionArray, label:this.getGraphLabel("prediction"), color:3, name:this.getGraphName("prediction"), checked:true});
		} else {
			//sensor is enabled
			
			//put the data array into the data sets
			dataSets.push({data:dataArray, label:this.getGraphLabel("distance"), color:0, name:"distance", checked:true});
			
			if(this.content.showVelocity) {
				//calculate the velocity data array from the distance array
				var velocityArray = this.calculateVelocityArray(dataArray);
				dataSets.push({data:velocityArray, label:this.getGraphLabel("velocity"), color:1, name:"velocity", checked:false});
			}
			
			if(this.content.showAcceleration) {
				//calculate the acceleration data array from the velocity array
				var accelerationArray = this.calculateAccelerationArray(velocityArray);
			    dataSets.push({data:accelerationArray, label:this.getGraphLabel("acceleration"), color:2, name:"acceleration", checked:false});				
			}
			
		    if(this.content.createPrediction || this.sensorState.predictionArray.length != 0) {
		    	//display the prediction if create prediction is enabled or if there is data in the prediction array
		    	dataSets.push({data:predictionArray, label:this.getGraphLabel("prediction"), color:3, name:this.getGraphName("prediction"), checked:true});		    	
		    }
		}
	    
	    //set the data set to a global variable so we can access it in other places
	    this.globalDataSets = dataSets;
	    
		//plot the data onto the graph and create the filter check box options
	    this.setupPlotFilter(plotDivId, graphCheckBoxesDivId);
	} else if(this.sensorType == 'temperature') {
		//this is a temperature sensor step
		
		var dataSets = [];
		                
		if(this.content.enableSensor != null && this.content.enableSensor == false) {
			//sensor is disabled so we only need to show the prediction
			dataSets.push({data:predictionArray, label:this.getGraphLabel("prediction"), color:3, name:this.getGraphName("prediction"), checked:true});
		} else {
			//sensor is enabled
			
			//put the data array into the data sets
			dataSets.push({data:dataArray, label:this.getGraphLabel("temperature"), name:"temperature", checked:true});
			
		    if(this.content.createPrediction || this.sensorState.predictionArray.length != 0) {
		    	//display the prediction if create prediction is enabled or if there is data in the prediction array
		    	dataSets.push({data:predictionArray, label:this.getGraphLabel("prediction"), color:3, name:this.getGraphName("prediction"), checked:true});		    	
		    }
		}
		
		//set the data set to a global variable so we can access it in other places
		this.globalDataSets = dataSets;
		
		//plot the data onto the graph
		//this.globalPlot = $.plot($("#" + plotDivId), dataSets, graphParams);
		
		//plot the data onto the graph and create the filter check box options
	    this.setupPlotFilter(plotDivId, graphCheckBoxesDivId);
	} else {
		//this is a generic sensor step without any specific type
		
		//create the data sets array
		var dataSets = [];
		
		dataSets.push({data:dataArray});
		
	    if(this.content.createPrediction || this.sensorState.predictionArray.length != 0) {
	    	//display the prediction if create prediction is enabled or if there is data in the prediction array
	    	dataSets.push({data:predictionArray, label:this.getGraphLabel("prediction"), color:3, name:this.getGraphName("prediction"), checked:true});		    	
	    }
		
		//set the data set to a global variable so we can access it in other places
		this.globalDataSets = dataSets;
		
		//plot the data onto the graph
		this.globalPlot = $.plot($("#" + plotDivId), dataSets, graphParams);	
	}
	
	//setup the graph so that when the student hovers over a point it displays the values in a tooltip
	this.setupPlotHover(plotDivId);
	
	//setup the graph so that when the student clicks on a point, it creates an annotation
	this.setupPlotClick();
	
	//delete all the annotation tool tips from the UI
	this.removeAllAnnotationToolTips();
	
	//highlight the points on the graph that the student has create annotations for
	this.highlightAnnotationPoints(null, null, dataSets);
};

/**
 * Calculate the velocity array given the distance array
 * @param distanceArray an array of distance points. each element in the
 * distance array is also an array that looks like this [<time>,<distance>]
 * @return an array of velocity points. each element in the velocity
 * array is also an array that looks like this [<time>,<velocity>]
 */
SENSOR.prototype.calculateVelocityArray = function(distanceArray) {
	return this.calculateDerivativeArray(distanceArray);
};

/**
 * Calculate the acceleration array given the velocity array
 * @param velocityArray an array of velocity points. each element in the
 * velocity array is also an array that looks like this [<time>,<velocity>]
 * @return an array of acceleration points. each element in the acceleration
 * array is also an array that looks like this [<time>,<acceleration>]
 */
SENSOR.prototype.calculateAccelerationArray = function(velocityArray) {
	return this.calculateDerivativeArray(velocityArray);
};

/**
 * Calculate the derivative array by calculating the rate of change
 * of the points in the given data array
 * @param dataArray an array containing data points. each element in the
 * array is also an array and looks like this [<x>,<y>]
 * @return an array containing the derivative values
 */
SENSOR.prototype.calculateDerivativeArray = function(dataArray) {
	//the array we will store the derivative values in
	var derivativeArray = [];
	
	//loop through all the points in the data array
	for(var x=0; x<dataArray.length; x++) {
		//get the index of the previous point
		var previousPointIndex = x - 1;
		
		//make sure the previous point exists
		if(previousPointIndex >= 0) {
			//get the previous point
			var point1 = dataArray[previousPointIndex];
			
			//get the current point
			var point2 = dataArray[x];
			
			//get the x and y values of the previous point
			var point1x = point1[0];
			var point1y = point1[1];
			
			//get the x and y values of the current point
			var point2x = point2[0];
			var point2y = point2[1];
			
			var derivativePoint = [];
			
			//get the difference between the y values of the points
			var derivativeY = point2y - point1y;
			
			//get the difference between the x values of the points
			var derivativeX = point2x - point1x;
			
			//calculate the rate of change to get the derivative value
			var derivativeValue = derivativeY / derivativeX;
			
			//use the x value of the current point as the x value for the derivative point
			derivativePoint[0] = point2x;
			
			//round the derivative value to the nearest hundredth and set it as the y value for the derivative point
			derivativePoint[1] = parseFloat(derivativeValue.toFixed(2));
			
			//add the derivative point to our array
			derivativeArray.push(derivativePoint);
		}
	}
	
	return derivativeArray;
};

/**
 * Setup the graph so that when the student mouseovers a point it displays
 * the x,y values for that point.
 */
SENSOR.prototype.setupPlotHover = function(plotDivId) {
	$("#" + plotDivId).unbind("plothover");
	
	if(plotDivId == null) {
		//this will be the default plotDivId if none is provided
		plotDivId = "graphDiv";
	}
    var previousPoint = null;
    
    /*
     * bind this function to the plothover event. the thisSensor object
     * will be passed into the function and accessed through event.data.thisSensor
     */
    $("#" + plotDivId).bind("plothover", {thisSensor:this}, function (event, pos, item) {

        if (item) {
            if (previousPoint != item.datapoint) {
                previousPoint = item.datapoint;
                
                //remove the existing tooltip
                $("#tooltip").remove();
                
                //get the x and y values from the point the mouse is over
                var x = parseFloat(item.datapoint[0].toFixed(2));
                var y = parseFloat(item.datapoint[1].toFixed(2));
                
                //get the units for the x and y values
                var xUnits = event.data.thisSensor.getGraphUnits("time");
                var yUnits = event.data.thisSensor.getGraphUnits(item.series.name);
                
                //create the text that we will display in the tool tip
                var toolTipText = item.series.label + ": " + x + " " + xUnits + ", " + y + " " + yUnits;
                
                //display the tool tip
                event.data.thisSensor.showTooltip(item.pageX, item.pageY, toolTipText);
            }
        } else {
        	//remove the tool tip
            $("#tooltip").remove();
            previousPoint = null;            
        }
        
        //check if the student is click dragging to create prediction points
        if(event.data.thisSensor.mouseDown) {
        	if(event.data.thisSensor.content.createPrediction) {
        		//add prediction point
            	event.data.thisSensor.predictionReceived(pos.x, pos.y);
            	
            	//plot the graph again so the new point is displayed
            	event.data.thisSensor.plotData();        		
        	}
        }
    });
};

/**
 * Display the tool tip for the point on the graph the student has their mouse over.
 * @param x the x position to display the tool tip at
 * @param y the y position to display the tool tip at
 * @param toolTipText the text to display in the tool tip
 */
SENSOR.prototype.showTooltip = function(x, y, toolTipText) {
    $('<div id="tooltip">' + toolTipText + '</div>').css( {
        position: 'absolute',
        //display: 'none',
        top: y + 20,
        left: x + 20,
        border: '1px solid #fdd',
        padding: '2px',
        'background-color': '#fee',
        opacity: 0.8
    }).appendTo("body").fadeIn(200);
};

/**
 * Setup the graph so that when the student clicks on a data point it creates
 * an annotation.
 */
SENSOR.prototype.setupPlotClick = function() {
	$("#graphDiv").unbind("plotclick");
	
	/*
	 * bind the plotclick event to this function. the thisSensor object
	 * will be passed into the function and accessed through event.data.thisSensor
	 */
    $("#graphDiv").bind("plotclick", {thisSensor:this}, function (event, pos, item) {
        if (item) {
        	//student has clicked on a point
        	
            //get the name of the graph line
            var seriesName = item.series.name;
            
        	if(seriesName.indexOf("prediction") == -1 || event.data.thisSensor.content.createPrediction) {
        		/*
        		 * the plot line that was clicked was not a prediction line
        		 * or create prediction is enabled. this is just to prevent
        		 * modification of the prediction if create prediction is 
        		 * disabled
        		 */
        		
            	//highlight the data point that was clicked
                event.data.thisSensor.globalPlot.highlight(item.series, item.datapoint);
                
                //get the index of the point for the graph line
                var dataIndex = item.dataIndex;
                
                //get the data point x,y values
                var dataPoint = item.datapoint;
                
                //create an annotation
                event.data.thisSensor.createAnnotation(seriesName, dataIndex, dataPoint);        		
        	}
        } else {
        	//student has clicked on an empty spot on the graph
        	
        	//check if this step allows the student to create a prediction
        	if(event.data.thisSensor.content.createPrediction) {
        		//create the prediction point
        		event.data.thisSensor.predictionReceived(pos.x, pos.y);
        		
        		//plot the graph again so the point is displayed
            	event.data.thisSensor.plotData();
        	}
        }
    });
};

/**
 * Setup the plot filter so students can turn on/off the different
 * lines in the graph when there is more than one line displayed
 */
SENSOR.prototype.setupPlotFilter = function(plotDivId, graphCheckBoxesDivId) {
    //get the div where we display the checkboxes
    var graphCheckBoxesDiv = $("#" + graphCheckBoxesDivId);
    
    //get the graph params
    var graphParams = this.getGraphParams();
    
    /*
     * save this into thisSensor so that the filterDataSets can access it
     * since the context within filterDataSets will be different when
     * it gets called
     */
    var thisSensor = this;
    
    /*
     * Filters the graph lines depending on which ones are checked in the options
     */
    function filterDataSets() {
    	//the array that will contain the graph lines we want to display
    	var dataToDisplay = [];

    	//get all the data sets
    	var dataSets = thisSensor.globalDataSets;

    	if(graphCheckBoxesDiv.length == 0) {
    		//we could not find the checkboxes div so we will just display all the graph lines
    		dataToDisplay = dataSets;
    	} else {
    		//we found the checkboxes div so we will filter graph lines
    		
    		//get all the check boxes that were checked
        	graphCheckBoxesDiv.find("input:checked").each(function() {
        		//get the name of the graph line
        		var index = $(this).attr("name");
        		
        		//make sure that graph line exists
        		if(index && dataSets[index]) {
        			//put the graph line into the array to display
        			dataToDisplay.push(dataSets[index]);
        		}
        	});	
    	}

    	//display the graph lines that we want to display
    	thisSensor.globalPlot = $.plot($("#" + plotDivId), dataToDisplay, graphParams);
    	
    	//delete all the annotation tool tips form the UI
    	thisSensor.removeAllAnnotationToolTips();
    	
    	//highlight the points that have annotations
    	thisSensor.highlightAnnotationPoints(null, null, dataToDisplay);
    }
    
    //check if we have created the check boxes
    if(graphCheckBoxesDiv.html() == "") {
    	//we have not created the check boxes
    	
    	//loop through all the data sets and create a check box for each
    	$.each(this.globalDataSets, function(index, val) {
    		var checked = "";
    		
    		//check if we should the check box for this data set should be initially checked
    		if(val.checked) {
    			checked = "checked='checked'";
    		}
    		
    		//add the check box
	    	graphCheckBoxesDiv.append("<br><input type='checkbox' name='" + index + "' " + checked + " id='graphOption" + index + "'>");
	    	
	    	//add the name of the data set next to the check box
	    	graphCheckBoxesDiv.append("<label for='graphOption" + index + ">" + val.label + "</label>");
	    });
    	
    	//have the filterDataSets be called when any of the check boxes are clicked
    	graphCheckBoxesDiv.find("input").click(filterDataSets);
    }
    
    //filter the data sets
    filterDataSets();
};

/**
 * Add the annotations to the UI
 */
SENSOR.prototype.setupAnnotations = function() {
	/*
	 * clear any existing annotations, this is needed when the student
	 * clicks on the current step again in the left nav menu because
	 * the html does not get cleared but render() gets called again
	 */
	$("#graphAnnotationsDiv").html("");

	//get the annotations
	var annotationArray = this.sensorState.annotationArray;
	
	//loop through all the annotations
	for(var x=0; x<annotationArray.length; x++) {
		//get an annotation
		var annotation = annotationArray[x];
		
		//get the name of the graph line
		var seriesName = annotation.seriesName;
		
		//get the index of the point on the graph line
		var dataIndex = annotation.dataIndex;
		
		//get the data text which contains the x,y values
		var dataText = annotation.dataText;
		
		//get the text the student wrote for the annotation
		var annotationText = annotation.annotationText;
		
		//add the annotation to the UI
		this.addAnnotationToUI(seriesName, dataIndex, dataText, annotationText);
	}
};

/**
 * Highlight the points that have annotations
 * @param sensorState
 * @param plot
 * @param dataSets the data sets currently displayed on the graph
 */
SENSOR.prototype.highlightAnnotationPoints = function(sensorState, plot, dataSets) {
	if(sensorState == null) {
		//use this.sensorState as the default sensor state if sensorState was note provided
		sensorState = this.sensorState;
	}
	
	if(plot == null) {
		//use this.globalPlot as the default if plot was not provided
		plot = this.globalPlot;
	}
	
	//get the annotations
	var annotationArray = sensorState.annotationArray;
	
	//loop through all the annotations
	for(var i=0; i<annotationArray.length; i++) {
		//get an annotation
		var annotation = annotationArray[i];
		
		//get the name of the graph line
		var seriesName = annotation.seriesName;
		
		if(dataSets != null) {
			//check if the annotation is on one of the data sets that are currently displayed
			if(!this.dataSetContainsName(dataSets, seriesName)) {
				/*
				 * it is not from one of the currently displayed data sets
				 * so we do not need to display this annotation
				 */
				continue;
			}
		}
		
		//get the index of the point on the graph line
		var dataIndex = annotation.dataIndex;
		
		//get the graph line
		var series = this.getSeriesByName(plot, seriesName);
		
		if(series != null) {
			//add the annotation tool to tip the UI
			this.addAnnotationToolTipToUI(seriesName, dataIndex, annotation.annotationText);
		}
	}
};

/**
 * Get the graph line object given the plot object and the name
 * of the graph line
 * @param plot the plot object returned from $.plot()
 * @param seriesName the name of the graph line
 * @return the grapha line object (aka series)
 */
SENSOR.prototype.getSeriesByName = function(plot, seriesName) {
	//get the array that contains all the graph line objects
	var seriesArray = plot.getData();
	
	//loop through all the graph lines
	for(var x=0; x<seriesArray.length; x++) {
		//get a graph line
		var series = seriesArray[x];
		
		//compare the graph line name
		if(series.name == seriesName) {
			//the name matches so we have found the graph line we want
			return series;
		}
	}
	
	return null;
};

/**
 * Get the units for the graph given the graph type
 * @param graphType
 * e.g.
 * 'distance'
 * 'velocity'
 * 'acceleration'
 * 'temperature'
 * @return the units for the graph type
 * e.g.
 * 'm'
 * 'm/s'
 * 'm/s^2'
 * 'C'
 * 's'
 */
SENSOR.prototype.getGraphUnits = function(graphType) {
	return this.graphUnits[graphType];
};

/**
 * Get the graph label for the given graph type
 * @param graphType
 * e.g.
 * 'distance'
 * 'velocity'
 * 'acceleration'
 * 'temperature'
 * @return the label that we will display in the legend
 * e.g.
 * 'distance (m)'
 * 'velocity (m/s)'
 * 'acceleration (m/s^2)'
 * 'temperature (C)'
 */
SENSOR.prototype.getGraphLabel = function(graphType) {
	//get the name of the graph
	var graphName = this.graphNames[graphType];
	
	//get the units
	var graphUnits = this.graphUnits[graphName];
	
	return graphName + " (" + graphUnits + ")";
};

/**
 * Get the graph name given the graph type
 * @param graphType the type of the graph
 * e.g.
 * "prediction"
 * @return the graph name
 */
SENSOR.prototype.getGraphName = function(graphType) {
	var graphName = this.graphNames[graphType];
	
	return graphName;
};

/**
 * Add the annotation to the UI
 * @param seriesName the name of the graph line
 * @param dataIndex the index on the graph line for the data point
 * @param dataText the text containing the x,y values of the data point
 * @param annotationText the text the student wrote for the annotation
 */
SENSOR.prototype.addAnnotationToUI = function(seriesName, dataIndex, dataText, annotationText) {
	//create the html that will represent the annotation
	var annotationHtml = "";
	
	//the class we will give to the annotation div
	var annotationClass = "";
	
	//whether we will allow the student to edit the annotation
	var enableEditing = "";
	
	if(seriesName.indexOf("prediction") != -1 && !this.content.createPrediction) {
		/*
		 * the annotation is for the prediction line and create prediction
		 * is disabled so we will not allow them to edit this annotation
		 */
		enableEditing = "disabled";
	}
	
	//get the series name we will use in the DOM
	var domSeriesName = this.getDOMSeriesName(seriesName);
	
	//set the class determined by whether this annotation is for sensor data or prediction
	if(seriesName.indexOf("prediction") != -1) {
		annotationClass = "predictionAnnotation";
	} else {
		annotationClass = "sensorAnnotation";
	}
	
	annotationHtml += "<div id='" + domSeriesName + dataIndex + "AnnotationDiv' class='" + annotationClass + "'>";
	
	//add the annotation text label that displays the x,y values for the point
	annotationHtml += seriesName + " [" + dataText + "]: ";
	
	//add the text input where the student can type
	annotationHtml += "<input id='" + domSeriesName + dataIndex + "AnnotationInputText' type='text'  value='" + annotationText + "' onchange='editAnnotation(\"" + seriesName + "\", " + dataIndex + ")' size='50' " + enableEditing + "/>";
	
	//add the delete button to delete the annotation
	annotationHtml += "<input id='" + domSeriesName + dataIndex + "AnnotationDeleteButton' type='button' value='Delete' onclick='deleteAnnotation(\"" + seriesName + "\", " + dataIndex + ")' " + enableEditing + "/>";
	annotationHtml += "</div>";
	
	//add the annotation html to the div where we put all the annotations
	$("#graphAnnotationsDiv").append(annotationHtml);
};

/**
 * Delete the annotation html for the given annotation
 * @param seriesName the name of the graph line
 * @param dataIndex the index on the graph line for the data point
 */
SENSOR.prototype.deleteAnnotationFromUI = function(seriesName, dataIndex) {
	//get the series name with spaces replaced with underscores
	var domSeriesName = this.getDOMSeriesName(seriesName);
	
	//remove the annotation from the UI
	$("#" + domSeriesName + dataIndex + "AnnotationDiv").remove();
};

/**
 * Delete all the annotations from the annotation div
 */
SENSOR.prototype.deleteAllAnnotationsFromUI = function() {
	$("#graphAnnotationsDiv").html("");
};

/**
 * Delete the sensor annotations from the UI
 */
SENSOR.prototype.deleteSensorAnnotationsFromUI = function() {
	$(".sensorAnnotation").remove();
};

/**
 * Delete the prediction annotations from the UI
 */
SENSOR.prototype.deletePredictionAnnotationsFromUI = function() {
	$(".predictionAnnotation").remove();
};

/**
 * Create a new annotation in the sensor state and also in the html UI
 * @param seriesName the name of the graph line
 * @param dataIndex the index on the graph line for the data point
 * @param dataPoint the x, y data point in an array [x,y]
 */
SENSOR.prototype.createAnnotation = function(seriesName, dataIndex, dataPoint) {
	//get the y units
	var graphYUnits = this.getGraphUnits(seriesName);
	
	//get the x units
	var graphXUnits = this.getGraphUnits("time");
	
	//get the text representation of the data point
	var dataText = dataPoint[0] + " " + graphXUnits + ", " + dataPoint[1] + " " + graphYUnits;
	
	//check if there is already an annotation for the given point
	var annotation = this.sensorState.getAnnotation(seriesName, dataIndex);
	
	if(annotation == null) {
		//annotation does not exist for this point so we will make it
		
		//add the annotation to the UI
		this.addAnnotationToUI(seriesName, dataIndex, dataText, "");
		
		//add the annotation to the sensor state
		this.sensorState.addAnnotation(seriesName, dataIndex, dataText);
		
		//set this flag so we know that we will need to save student data since it has changed
		this.annotationsChanged = true;
	} else {
		//annotation already exists for this point
		//TODO: highlight the annotation row in the #graphAnnotationsDiv
	}
	
	//add the annotation tool tip tot he UI
	this.addAnnotationToolTipToUI(seriesName, dataIndex, "");
};

/**
 * Delete the annotation from the UI and the sensor state
 * @param seriesName the name of the graph line
 * @param dataIndex the index on the graph line for the data point
 */
SENSOR.prototype.deleteAnnotation = function(seriesName, dataIndex) {
	//delete the annotation from the UI
	this.deleteAnnotationFromUI(seriesName, dataIndex);
	
	//delete the annotation from the sensor state
	this.sensorState.deleteAnnotation(seriesName, dataIndex);
	
	//get the graph line
	var series = this.getSeriesByName(this.globalPlot, seriesName);
	
	if(series != null) {
		//remove the highlight on the point on the graph that this annotation was for
		this.globalPlot.unhighlight(series, dataIndex);		
	}
	
	//delete the annotation tool tip from the UI
	var domSeriesName = this.getDOMSeriesName(seriesName);
	$("#annotationToolTip" + domSeriesName + dataIndex).remove();
	
	//set this flag so we know that we will need to save student data since it has changed
	this.annotationsChanged = true;
};

/**
 * The student has edited the annotation text for the annotation so
 * we will update it in the sensor state annotation
 * @param seriesName the name of the graph line
 * @param dataIndex the index on the graph line for the data point
 * @param annotationText the text the student has written
 */
SENSOR.prototype.editAnnotation = function(seriesName, dataIndex, annotationText) {
	//update the annotation in the sensor state
	this.sensorState.editAnnotation(seriesName, dataIndex, annotationText);
	
	var domSeriesName = this.getDOMSeriesName(seriesName);
	
	//update the annotation tool tip on the graph
	$("#annotationToolTip" + domSeriesName + dataIndex).html(annotationText);
	
	if(annotationText != null && annotationText != "") {
		//show the annotation tool tip on the graph
		$('#annotationToolTip' + domSeriesName + dataIndex).show();
		$('#annotationToolTip' + domSeriesName + dataIndex).addClass("activeAnnotationToolTip").removeClass("hiddenAnnotationToolTip");
	} else {
		//hide the annotation tool tip on the graph if the annotation text is ""
		$('#annotationToolTip' + domSeriesName + dataIndex).hide();
		$('#annotationToolTip' + domSeriesName + dataIndex).addClass("hiddenAnnotationToolTip").removeClass("activeAnnotationToolTip");
	}
	
	//set this flag so we know that we will need to save student data since it has changed
	this.annotationsChanged = true;
};

/**
 * Insert the applet into the html
 * @return
 */
SENSOR.prototype.insertApplet = function() {
	//the otml file determines what type of sensor the applet expects
	var otmlFileName = "";
	
	if(this.sensorType == 'motion') {
		//this is a motion sensor step
		//otmlFileName = "motion.otml";
		otmlFileName = "/distance.otml";
	} else if(this.sensorType == 'temperature') {
		//this is a temperature sensor step
		//otmlFileName = "temperature.otml";
		otmlFileName = "/temperature.otml";
	}
	
	/*
	 * get the document url, it will look something like
	 * http://wise4.telscenter.org/vlewrapper/vle/vle.html
	 */ 
	var documentURL = document.URL;
	
	//get the index of vlewrapper
	var vlewrapperPos = documentURL.indexOf("vlewrapper");
	
	/*
	 * get everything up to after vlewrapper so codebase will look something like
	 * http://wise4.telscenter.org/vlewrapper/
	 */
	var codebase = documentURL.substring(0, vlewrapperPos + "vlewrapper".length + 1);
	
	/*
	 * create the html applet tag that we will insert into the sensor.html
	 * we insert the otmlFileName as the "resource" param
	 */
	
	var host = "http://" + location.host;
	
	/*
	var appletHtml = '<applet id="sensorApplet" codebase="' + codebase + 'vle/node/sensor" ' + 
	'code="org.concord.sensor.applet.OTSensorApplet" ' + 
	'width="1" height="1" ' + 
	'archive="sensorJars/response-cache-0.1.0-SNAPSHOT.jar,' + 
	'sensorJars/framework-0.1.0-SNAPSHOT.jar,' + 
	'sensorJars/swing-0.1.0-SNAPSHOT.jar,' + 
	'sensorJars/frameworkview-0.1.0-SNAPSHOT.jar,' +
	'sensorJars/data-0.2.0-SNAPSHOT.jar,' +
	'sensorJars/jug-1.1.2.jar,' +
	'sensorJars/sensor-native-0.1.0-SNAPSHOT.jar,' +
	'sensorJars/apple-support-0.1.0-SNAPSHOT.jar,' +
	'sensorJars/sensor-0.2.0-SNAPSHOT.jar,' +
	'sensorJars/jdom-1.0.jar,' +
	'sensorJars/rxtx-comm-2.1.7-r2.jar,' +
	'sensorJars/otrunk-0.2.0-SNAPSHOT.jar,' +
	'sensorJars/sensor-applets-0.1.0-SNAPSHOT.jar ' +
	'"MAYSCRIPT="true"> ' + 
	'<param name="resource" value="' + otmlFileName + '"/> ' + 
	'<param name="name" value="sensor"/> ' +
	'<param name="listenerPath" value="jsListener"/> ' +
	'<param name="MAYSCRIPT" value="true"/>Your browser is completely ignoring the applet tag!' +
	'</applet>';
	*/

	/*
	//var appletHtml = '<applet id="sensorApplet" codebase="' + codebase + 'vle/node/sensor" ' + 
	var appletHtml = '<applet id="sensorApplet" codebase="http://localhost:8080/jnlp/jnlp" ' +
	'code="org.concord.sensor.applet.OTSensorApplet" ' + 
	'width="1" height="1" ' + 
	'archive="org/concord/sensor-native/sensor-native__V0.1.0-20101013.205003-476,' + 
	'org/concord/otrunk/otrunk__V0.2.0-20101008.002809-256,' + 
	'org/concord/framework/framework__V0.1.0-20101008.002809-556,' + 
	'org/concord/frameworkview/frameworkview__V0.1.0-20101008.002809-399,' +
	'jug/jug/jug__V1.1.2,' +
	'jdom/jdom/jdom__V1.0,' +
	'org/concord/sensor/sensor__V0.2.0-20100907.180413-275,' +
	'org/concord/data/data__V0.2.0-20101008.002809-280,' +
	'org/concord/sensor/sensor-applets/sensor-applets__V0.1.0-20101018.134018-59.jar" ' +
	'MAYSCRIPT="true"> ' + 
	'<param name="resource" value="' + otmlFileName + '"/> ' + 
	'<param name="name" value="sensor"/> ' +
	'<param name="listenerPath" value="jsListener"/> ' +
	'<param name="MAYSCRIPT" value="true"/>Your browser is completely ignoring the applet tag!' +
	'</applet>';
	*/
	
	
	//var appletHtml = '<applet id="sensorApplet" codebase="http://localhost:8080/jnlp" ' +
	var appletHtml = '<applet id="sensorApplet" codebase="' + host + '/jnlp" ' +
	'code="org.concord.sensor.applet.OTSensorApplet" ' + 
	'width="1" height="1" ' + 
	'archive="org/concord/sensor-native/sensor-native.jar,' + 
	'org/concord/otrunk/otrunk.jar,' + 
	'org/concord/framework/framework.jar,' + 
	'org/concord/frameworkview/frameworkview.jar,' +
	'jug/jug/jug.jar,' +
	'jdom/jdom/jdom.jar,' +
	'org/concord/sensor/sensor.jar,' +
	'org/concord/data/data.jar,' +
	'org/concord/sensor/sensor-applets/sensor-applets.jar" ' +
	'MAYSCRIPT="true"> ' + 
	'<param name="resource" value="' + otmlFileName + '"/> ' + 
	'<param name="name" value="sensor"/> ' +
	'<param name="listenerPath" value="jsListener"/> ' +
	'<param name="MAYSCRIPT" value="true"/>Your browser is completely ignoring the applet tag!' +
	'</applet>';
	
	
	//insert the applet into the sensor.html
	document.getElementById('sensorAppletDiv').innerHTML = appletHtml;
};

/**
 * Set the labels for the graph
 */
SENSOR.prototype.setupGraphLabels = function() {
	if(this.content.graphParams != null) {
		//get the x and y labels
		var xLabel = "";
		if(this.content.graphParams.xlabel) {
			xLabel = this.content.graphParams.xlabel;	
		}
		
		var yLabel = "";
		if(this.content.graphParams.ylabel) {
			yLabel = this.content.graphParams.ylabel;
		}
		
		//set the y label
		$('#yLabelDiv').html(yLabel);
		
		//set the x label
		$('#xLabelDiv').html(xLabel);
	}
};

/**
 * Display the starter sentence button if the author has specified to
 * do so
 */
SENSOR.prototype.displayStarterSentenceButton = function() {
	if(this.content.starterSentence) {
		if(this.content.starterSentence.display == "0") {
			//do not show the starter sentence button
			$('#showStarterSentenceButtonDiv').hide();
		} else if(this.content.starterSentence.display == "1" || this.content.starterSentence.display == "2") {
			//show the starter sentence button
			$('#showStarterSentenceButtonDiv').show();

			if(this.content.starterSentence.display == "2") {
				//automatically populate the response box with the starter sentence
				
				//check if the student has submitted a response before
				if(this.states == null || this.states.length == 0) {
					/*
					 * the student has not submitted a response before so this
					 * is the first time they are visiting the step. we will
					 * populate the response textarea with the starter sentence
					 */
					var starterSentence = this.content.starterSentence.sentence;
					
					/*
					 * there should be nothing in the textarea but we will just
					 * append the starter sentence just in case so that we don't
					 * risk overwriting the text that is already in there
					 */
					var response = $("#responseTextArea").val();
					response += starterSentence;
					$("#responseTextArea").val(response);
				}
			}
			
		}
	}
};

/**
 * Append the starter sentence to the response textarea
 */
SENSOR.prototype.showStarterSentence = function() {
	if(this.content.starterSentence) {
		//get the starter sentence
		var starterSentence = this.content.starterSentence.sentence;
		
		//append the starter sentence to the text in the textarea
		var response = $("#responseTextArea").val();
		response += starterSentence;
		$("#responseTextArea").val(response);
	}
};

/**
 * Show the graph check box options if the author has specified to
 */
SENSOR.prototype.showGraphOptions = function() {
	if(this.content.showGraphOptions) {
		//show the graph options
		$('#graphCheckBoxesDiv').show();
	} else {
		//do not show the graph options
		$('#graphCheckBoxesDiv').hide();
	}
};

/**
 * The student has changed the axis range so we will obtain those
 * values and plot the graph again
 */
SENSOR.prototype.updateAxisRange = function() {
	//set this flag so we know the sensor state has changed
	this.axisRangeChanged = true;
	
	//get all the values from the text box inputs
	var xMin = $('#xMinInput').val();
	var xMax = $('#xMaxInput').val();
	var yMin = $('#yMinInput').val();
	var yMax = $('#yMaxInput').val();

	//set the value into the sensor state
	this.sensorState.xMin = xMin;
	this.sensorState.xMax = xMax;
	this.sensorState.yMin = yMin;
	this.sensorState.yMax = yMax;
	
	//parse the graph params again to obtain the new values in the graph params
	this.graphParams = this.parseGraphParams(this.content.graphParams);
	
	//plot the graph again
	this.plotData();
};

/**
 * The student wants to reset the axis range values back to the
 * default values
 */
SENSOR.prototype.resetDefaultAxisRange = function() {
	//set this flag so we know the sensor state has changed
	this.axisRangeChanged = true;
	
	var xMin = "";
	var xMax = "";
	var yMin = "";
	var yMax = "";
	
	if(this.content.graphParams != null) {
		if(this.content.graphParams.xmin != null && this.content.graphParams.xmin != "") {
			//set the xmin value
			xMin = this.content.graphParams.xmin;
		}

		if(this.content.graphParams.xmax != null && this.content.graphParams.xmax != "") {
			//set the xmax value
			xMax = this.content.graphParams.xmax;
		}

		if(this.content.graphParams.ymin != null && this.content.graphParams.ymin != "") {
			//set the ymin value
			yMin = this.content.graphParams.ymin;
		}

		if(this.content.graphParams.ymax != null && this.content.graphParams.ymax != "") {
			//set the ymax value
			yMax = this.content.graphParams.ymax;
		}
	}
	
	//reset the values in the text box inputs
	$('#xMinInput').val(xMin);
	$('#xMaxInput').val(xMax);
	$('#yMinInput').val(yMin);
	$('#yMaxInput').val(yMax);
	
	//reset the values in the sensor state
	this.sensorState.xMin = this.content.graphParams.xmin;
	this.sensorState.xMax = this.content.graphParams.xmax;
	this.sensorState.yMin = this.content.graphParams.ymin;
	this.sensorState.yMax = this.content.graphParams.ymax;
	
	//parse the graph params again to obtain the new values in the graph params
	this.graphParams = this.parseGraphParams(this.content.graphParams);
	
	//plot the graph again
	this.plotData();
};

/**
 * Get the prediction array in a format that we can give to flot to plot
 * @return an array containing arrays with two values [x, y] that represent
 * the prediction points
 */
SENSOR.prototype.getPredictionArray = function() {
	//get the graph data array from the current state 
	var predictionArray = this.generatePredictionArray(this.sensorState);
	
	return predictionArray;
};

/**
 * Generate the prediction array in a format that we can give to flot to plot
 * @param state the sensor state
 * @return an array containing arrays with two values [x, y] that represent
 * the prediction points
 */
SENSOR.prototype.generatePredictionArray = function(state) {
	var predictionArray = [];
	
	if(state != null) {
		//get the data array from the state
		var statePredictionArray = state.predictionArray;
		
		if(statePredictionArray != null) {
			//loop through all the elements in the data array
			for(var i=0; i<statePredictionArray.length; i++) {
				//get the data array element
				var sensorData = statePredictionArray[i];

				//get the time
				var x = sensorData.x;
				
				//get the y value. this may be distance or temp or etc.
				var y = sensorData.y;
				
				/*
				 * add the x, y data point into the array. flot expects
				 * the each element in the array to be an array.
				 */
				predictionArray.push([x, y]);
			}
		}		
	}
	return predictionArray;
};

/**
 * The student has created a prediction point
 * @param x the x value for the point
 * @param y the y value for the point
 */
SENSOR.prototype.predictionReceived = function(x, y) {
	
	if(x != null && y != null) {
		//round x down to the nearest 0.2
		x = Math.round(x * 5) / 5;
		
		y = parseFloat(y.toFixed(2));
		
		//insert the point into the sensor state
		this.sensorState.predictionReceived(x, y);
		
		this.graphChanged = true;
	}
};

/**
 * Hide the sensor buttons
 */
SENSOR.prototype.disableSensorButtons = function() {
	$('#startButton').hide();
	$('#stopButton').hide();
	$('#clearButton').hide();
};

/**
 * Hide the prediction buttons
 */
SENSOR.prototype.disablePredictionButtons = function() {
	$('#clearPredictionButton').hide();
};

/**
 * Setup the axis limit values on the graph
 */
SENSOR.prototype.setupAxisValues = function() {
	var xMin = "";
	var xMax = "";
	var yMin = "";
	var yMax = "";
	
	if(this.content.graphParams != null) {
		if(this.content.graphParams.xmin != null && this.content.graphParams.xmin != "") {
			//set the xmin value
			xMin = this.content.graphParams.xmin;
		}

		if(this.content.graphParams.xmax != null && this.content.graphParams.xmax != "") {
			//set the xmax value
			xMax = this.content.graphParams.xmax;
		}

		if(this.content.graphParams.ymin != null && this.content.graphParams.ymin != "") {
			//set the ymin value
			yMin = this.content.graphParams.ymin;
		}

		if(this.content.graphParams.ymax != null && this.content.graphParams.ymax != "") {
			//set the ymax value
			yMax = this.content.graphParams.ymax;
		}
	}
	
	/*
	 * if the sensor state contains axis values it will override
	 * the axis values from the content
	 */
	if(this.sensorState != null) {
		if(this.sensorState.xMin != null) {
			xMin = this.sensorState.xMin;
		}
		
		if(this.sensorState.xMax != null) {
			xMax = this.sensorState.xMax;
		}
		
		if(this.sensorState.yMin != null) {
			yMin = this.sensorState.yMin;
		}
		
		if(this.sensorState.yMax != null) {
			yMax = this.sensorState.yMax;
		}
	}
	
	//set the axis range values into the input text boxes
	$('#xMinInput').val(xMin);
	$('#xMaxInput').val(xMax);
	$('#yMinInput').val(yMin);
	$('#yMaxInput').val(yMax);
};

/**
 * Get the prediction from the prevWorkNodeIds
 * @return
 */
SENSOR.prototype.getPreviousPrediction = function() {
	if(this.node.prevWorkNodeIds.length > 0) {
		if(this.view.state != null) {
			//get the state from the previous step that this step is linked to
			var predictionState = this.view.state.getLatestWorkByNodeId(this.node.prevWorkNodeIds[0]);
			
			/*
			 * make sure this step doesn't already have a prediction set 
			 * and that there was a prediction state from the previous
			 * associated step before we try to retrieve that prediction and
			 * set it into our prediction array
			 */
			if(this.sensorState.predictionArray.length == 0 && predictionState != null && predictionState != "") {
				/*
				 * make a copy of the prediction array and set it into our sensor state
				 * so we don't accidentally modify the data from the other state
				 */
				this.sensorState.predictionArray = JSON.parse(JSON.stringify(predictionState.predictionArray));
				
				var predictionAnnotations = [];
				
				//get all the prediction annotations
				for(var x=0; x<predictionState.annotationArray.length; x++) {
					var annotation = predictionState.annotationArray[x];
					
					if(annotation.seriesName.indexOf("prediction") != -1) {
						predictionAnnotations.push(annotation);
					}
				}
				
				/*
				 * make a copy of the prediction annotations so we don't accidentally modify
				 * the data in the other state 
				 */ 
				predictionAnnotations = JSON.parse(JSON.stringify(predictionAnnotations));
				
				//add the prediction annotations to our annotation array
				for(var y=0; y<predictionAnnotations.length; y++) {
					this.sensorState.annotationArray.push(predictionAnnotations[y]);
				}
			}
		}
	}
};

/**
 * Delete the prediction points and annotations
 */
SENSOR.prototype.clearPrediction = function() {
	//clear the prediction array
	this.sensorState.predictionArray = [];
	
	//delete the prediction annotations
	this.sensorState.removePredictionAnnotations();
	
	//delete the prediction annotations from the UI
	this.deletePredictionAnnotationsFromUI();
	
	//delete the prediction annotation tool tips on the graph
	this.removeAnnotationToolTipPrediction();
	
	//plot the graph again
	this.plotData();
	
	this.graphChanged = true;
};

/**
 * Delete the prediction annotation tool tips
 */
SENSOR.prototype.removeAnnotationToolTipPrediction = function() {
	this.removeAnnotationToolTip("annotationToolTipPrediction");
};

/**
 * Delete the data annotation tool tips
 */
SENSOR.prototype.removeAnnotationToolTipData = function() {
	this.removeAnnotationToolTip("annotationToolTipData");
};

/**
 * Delete the annotation tool tips for the given class
 * @param annotationToolTipClass the class for the annotation tool tips we want to delete
 */
SENSOR.prototype.removeAnnotationToolTip = function(annotationToolTipClass) {
	$("." + annotationToolTipClass).remove();
};

/**
 * Determine if one data sets has the given name
 * @param dataSets an array of data sets
 * @param name the name of a data set (aka series name)
 * @return whether a data set has the given name
 */
SENSOR.prototype.dataSetContainsName = function(dataSets, name) {
	if(dataSets != null) {
		//loop through all the data sets
		for(var x=0; x<dataSets.length; x++) {
			var dataSet = dataSets[x];
			
			if(dataSet != null && dataSet.name == name) {
				//the name matches
				return true;
			}
		}
	}
	
	//we did not find a match
	return false;
};

/**
 * Delete all the annotation tool tips from the graph
 */
SENSOR.prototype.removeAllAnnotationToolTips = function() {
	$(".activeAnnotationToolTip").remove();
	$(".hiddenAnnotationToolTip").remove();
};

/**
 * Add an annotation tool tip to the graph
 * @param seriesName the name of the series
 * @param dataIndex the index within the series
 * @param annotationText the text the student wrote for the annotation
 */
SENSOR.prototype.addAnnotationToolTipToUI = function(seriesName, dataIndex, annotationText) {
	//use this.globalPlot as the default if plot was not provided
	var plot = this.globalPlot;
	
	//get the graph line
	var series = this.getSeriesByName(plot, seriesName);
	
	if(series != null) {
		//highlight the point
		plot.highlight(series, dataIndex);
		
		//get the point in the series
		var dataPointArray = series.data[dataIndex];
		
		//get the x and y values
		var dataPointObject = {
				x:dataPointArray[0],
				y:dataPointArray[1]
		};
		
		//get the offset of the plot relative to the whole document page
		var plotOffset = plot.offset();
		var xPlotOffset = plotOffset.left;
		var yPlotOffset = plotOffset.top;
		
		//find the pixel position of the point
		var offsetObject = plot.pointOffset(dataPointObject);
		var x = offsetObject.left;
		var y = offsetObject.top;
		
		
		//get the class that we will give to the div
		var annotationToolTipClass = "activeAnnotationToolTip";
		
		if(seriesName.indexOf("prediction") != -1) {
			annotationToolTipClass += " annotationToolTipPrediction";
		} else {
			annotationToolTipClass += " annotationToolTipData";
		}
		
		var domSeriesName = this.getDOMSeriesName(seriesName);
		
		//check if the tool tip div for this annotation already exists
		if($('#annotationToolTip' + domSeriesName + dataIndex).length == 0) {
			//it does not exist so we will make it
		    $('<div id="annotationToolTip' + domSeriesName + dataIndex + '" class="' + annotationToolTipClass + '">' + annotationText + '</div>').css( {
		        position: 'absolute',
		        //display: 'none',
		        top: y + yPlotOffset - 35,
		        left: x + xPlotOffset - 15,
		        border: '1px solid #fdd',
		        padding: '2px',
		        'background-color': '#fee',
		        opacity: 0.8
		    }).appendTo("body").fadeIn(200);
		}
		
	    if(annotationText == null || annotationText == "") {
	    	//hide the annotation tool tip if the annotation text is ""
	    	$('#annotationToolTip' + domSeriesName + dataIndex).hide();
	    	$('#annotationToolTip' + domSeriesName + dataIndex).addClass("hiddenAnnotationToolTip").removeClass("activeAnnotationToolTip");
	    }
	}
};

/**
 * Get the series name that we will use in the DOM. This just means
 * replacing any spaces " " with underscores "_"
 * @param seriesName the name of the series
 * @return the seriesName with spaces replaced with underscores
 */
SENSOR.prototype.getDOMSeriesName = function(seriesName) {
	var domSeriesName = "";
	
	if(seriesName != null) {
		//replace the spaces with underscores
		domSeriesName = seriesName.replace(/ /g, "_");
	}
	
	return domSeriesName;
};

/**
 * Hide all the input fields for when we want to prevent the student from
 * working on this step because they have not yet created a prediction in
 * the previous associated step
 */
SENSOR.prototype.hideAllInputFields = function() {
	$('#startButton').hide();
	$('#stopButton').hide();
	$('#clearButton').hide();
	$('#clearPredictionButton').hide();
	$('#resetDefaultAxisLimitsButton').hide();
	$('#yMaxInput').hide();
	$('#yMinInput').hide();
	$('#xMinInput').hide();
	$('#xMaxInput').hide();
	$('#showStarterSentenceButton').hide();
	$('#responseTextArea').hide();
	$('#saveButton').hide();
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/sensor/sensor.js');
}