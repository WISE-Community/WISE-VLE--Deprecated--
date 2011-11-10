
SensorNode.prototype = new Node();
SensorNode.prototype.constructor = SensorNode;
SensorNode.prototype.parentNode = Node.prototype;
SensorNode.authoringToolName = "Graph/Sensor";
SensorNode.authoringToolDescription = "Students plot points on a graph and can use a USB probe to collect data";

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {SensorNode}
 */
function SensorNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
}

SensorNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return SENSORSTATE.prototype.parseDataJSONObj(stateJSONObj);
};

SensorNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

SensorNode.prototype.onExit = function() {
	//check if the content panel has been set
	if(this.contentPanel) {
		
		if(this.contentPanel.save) {
			//tell the content panel to save
			this.contentPanel.save();
		}
		
		try {
			/*
			 * check if the onExit function has been implemented or if we
			 * can access attributes of this.contentPanel. if the user
			 * is currently at an outside link, this.contentPanel.onExit
			 * will throw an exception because we aren't permitted
			 * to access attributes of pages outside the context of our
			 * server.
			 */
			if(this.contentPanel.onExit) {
				try {
					//run the on exit cleanup
					this.contentPanel.onExit();					
				} catch(err) {
					//error when onExit() was called, e.g. mysystem editor undefined
				}
			}	
		} catch(err) {
			/*
			 * an exception was thrown because this.contentPanel is an
			 * outside link. we will need to go back in the history
			 * and then trying to render the original node.
			 */
			history.back();
			//setTimeout(function() {thisObj.render(this.ContentPanel)}, 500);
		}
	}
};

/**
 * Renders the student work into the div
 * @param divId the id of the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 */
SensorNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
	//create a SENSOR object that we will use to perform all the graphing logic for us
	var sensor = new SENSOR(this, this.view);
	
	if(childDivIdPrefix == null) {
		//the default child div id prefix will be "" if none is provided
		childDivIdPrefix = "";
	}
	
	//get the step work id from the node visit
	var stepWorkId = nodeVisit.id;
	
	/*
	 * get the student work, in this case the student work is
	 * the sensor state
	 */
	var sensorState = nodeVisit.getLatestWork();
	
	//set the sensor state into our sensor object
	sensor.sensorState = sensorState;
	
	/*
	 * get the data array from the sensor state in the format
	 * that we can send to flot
	 */
	var graphDataArray = sensor.generateGraphDataArray(sensorState);
	
	//get the graph parameters from the content
	var graphParams = sensor.parseGraphParams(this.content.getContentJSON().graphParams);

	//create the sensor graph div that we will use to display the graph
	var sensorGraphDiv = createElement(document, 'div', {id: childDivIdPrefix + 'sensorGraphDiv_' + stepWorkId, style:'width:400px;height:200px;'});
	
	//create the div that will display the check boxes to filter the lines (if this graph has multiple lines, if not, this will be empty)
	var sensorGraphCheckBoxesDiv = createElement(document, 'div', {id: childDivIdPrefix + 'sensorGraphCheckBoxesDiv_' + stepWorkId});
	
	//create the div that will display the student annotations for the graph
	var sensorAnnotationsDiv = createElement(document, 'div', {id: childDivIdPrefix + 'sensorAnnotationsDiv_' + stepWorkId});
	
	//create the response div that we will use to display what the student typed
	var sensorResponseDiv = createElement(document, 'div', {id: childDivIdPrefix + 'sensorResponseDiv_' + stepWorkId});
	
	//add all the divs to the main work div 
	$('#' + divId).append(sensorGraphDiv);
	$('#' + divId).append(sensorGraphCheckBoxesDiv);
	$('#' + divId).append(sensorAnnotationsDiv);
	$('#' + divId).append(sensorResponseDiv);
	
	//plot the graph in the sensor graph div
	sensor.plotData(sensorGraphDiv.id, sensorGraphCheckBoxesDiv.id);
	
	/*
	 * used to hide or show the annotation tool tips. if the teacher has
	 * their mouse in the graph div we will hide the annotation tool tips
	 * so that they don't block them from viewing the plot points.
	 * when the mouse cursor is outside of the graph div we will show the
	 * annotation tool tips for them to view.
	 */
	$("#" + sensorGraphDiv.id).bind('mouseover', (function(event) {
		$(".activeAnnotationToolTip").hide();
	}));
	$("#" + sensorGraphDiv.id).bind('mouseleave', (function(event) {
		$(".activeAnnotationToolTip").show();
	}));
	
	//get the annotations as a string
	var annotationsHtml = sensorState.getAnnotationsHtml();
	
	//set the annotations text
	$('#' + sensorAnnotationsDiv.id).html(annotationsHtml);
	
	//get the student response that was typed
	var response = sensorState.response;
	
	//replace \n with <br> so that the line breaks are displayed for the teacher
	response = this.view.replaceSlashNWithBR(response);
	
	//insert the response the student typed
	$('#' + sensorResponseDiv.id).html(response);
};

SensorNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/sensor/sensor.html');
};

NodeFactory.addNode('SensorNode', SensorNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/sensor/SensorNode.js');
};