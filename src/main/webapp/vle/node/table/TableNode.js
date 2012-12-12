/*
 * This a template Node that developers can use to create new 
 * step types. Copy this file and rename it to 
 *
 * <new step type>Node.js
 * e.g. for example if you are creating a quiz step type it would
 * look something like QuizNode.js
 * 
 * and then in this file change all occurrences of the word 'TemplateNode' to 
 * 
 * <new step type>Node
 * 
 * e.g. for example if you are creating a quiz step type you would
 * change it to be QuizNode
 */

TableNode.prototype = new Node(); //TODO: rename TemplateNode
TableNode.prototype.constructor = TableNode; //TODO: rename both occurrences of TableNode
TableNode.prototype.parentNode = Node.prototype; //TODO: rename TemplateNode

/*
 * the name that displays in the authoring tool when the author creates a new step
 * 
 * TODO: rename TemplateNode
 * TODO: rename Template to whatever you would like this step to be displayed as in
 * the authoring tool when the author creates a new step
 */
TableNode.authoringToolName = "Table"; 

TableNode.authoringToolDescription = "Students fill out a table"; //TODO: rename TemplateNode

TableNode.tagMapFunctions = [
	{functionName:'importWork', functionArgs:[]},
	{functionName:'showPreviousWork', functionArgs:[]}
];

/**
 * This is the constructor for the Node
 * 
 * TODO: rename TemplateNode
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 */
function TableNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
	
	this.tagMapFunctions = this.tagMapFunctions.concat(TableNode.tagMapFunctions);
}

/**
 * This function is called when the vle loads the step and parses
 * the previous student answers, if any, so that it can reload
 * the student's previous answers into the step.
 * 
 * TODO: rename TemplateNode
 * 
 * @param stateJSONObj
 * @return a new state object
 */
TableNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	/*
	 * TODO: rename TEMPLATESTATE
	 * 
	 * make sure you rename TEMPLATESTATE to the state object type
	 * that you will use for representing student data for this
	 * type of step. copy and modify the file below
	 * 
	 * vlewrapper/WebContent/vle/node/template/templatestate.js
	 * 
	 * and use the object defined in your new state.js file instead
	 * of TEMPLATESTATE. for example if you are creating a
	 * quiz step type you would copy the file above to
	 * 
	 * vlewrapper/WebContent/vle/node/quiz/quizstate.js
	 * 
	 * and in that file you would define QUIZSTATE and therefore
	 * would change the TEMPLATESTATE to QUIZSTATE below
	 */ 
	return TableState.prototype.parseDataJSONObj(stateJSONObj);
};

/**
 * This function is called if there needs to be any special translation
 * of the student work from the way the student work is stored to a
 * human readable form. For example if the student work is stored
 * as an array that contains 3 elements, for example
 * ["apple", "banana", "orange"]
 *  
 * and you wanted to display the student work like this
 * 
 * Answer 1: apple
 * Answer 2: banana
 * Answer 3: orange
 * 
 * you would perform that translation in this function.
 * 
 * Note: In most cases you will not have to change the code in this function
 * 
 * TODO: rename TemplateNode
 * 
 * @param studentWork
 * @return translated student work
 */
TableNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * This function is called when the student exits the step. It is mostly
 * used for error checking.
 * 
 * TODO: rename TemplateNode
 * 
 * Note: In most cases you will not have to change anything here.
 */
TableNode.prototype.onExit = function() {
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
		}
	}
};

/**
 * Renders the student work into the div. The grading tool will pass in a
 * div id to this function and this function will insert the student data
 * into the div.
 * 
 * @param displayStudentWorkDiv the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 * 
 * TODO: rename TemplateNode
 * Note: you may need to add code to this function if the student
 * data for your step is complex or requires additional processing.
 * look at SensorNode.renderGradingView() as an example of a step that
 * requires additional processing
 */
TableNode.prototype.renderGradingView = function(displayStudentWorkDiv, nodeVisit, childDivIdPrefix, workgroupId) {
	//create the table object so we can reference the content later
	var table = new Table(this, this.view);
	
	//get the div id
	var divId = displayStudentWorkDiv.attr('id');
	
	/*
	 * Get the latest student state object for this step
	 * TODO: rename templateState to reflect your new step type
	 * 
	 * e.g. if you are creating a quiz step you would change it to quizState
	 */
	var tableState = nodeVisit.getLatestWork();
	
	//get the step work id from the node visit
	var stepWorkId = nodeVisit.id;
	
	//get the student response
	var response = tableState.response;
	response = this.view.replaceSlashNWithBR(response);
	
	if(childDivIdPrefix == null) {
		childDivIdPrefix = '';
	} else if(childDivIdPrefix != null && childDivIdPrefix != '') {
		//add an _ after the child prefix if the child prefix is not empty string
		childDivIdPrefix += '_';
	}
	
	//div to display the table
	var tableTableDataDiv = createElement(document, 'div', {id: divId + '_' + childDivIdPrefix + 'tableTableDataDiv_' + stepWorkId});
	
	//div to display a new line
	var newLineDiv = createElement(document, 'div', {id: divId + '_' + childDivIdPrefix + 'newLineDiv_' + stepWorkId});
	
	//div to display the graph options if the student was required to select them
	var tableGraphOptionsDiv = createElement(document, 'div', {id: divId + '_' + childDivIdPrefix + 'tableGraphOptionsDiv_' + stepWorkId});
	
	//div to display a new line
	var newLine2Div = createElement(document, 'div', {id: divId + '_' + childDivIdPrefix + 'newLineDiv_' + stepWorkId});
	
	var graphDiv = null;
	var newLine3Div = null;
	
	if(table.isGraphingEnabled() && tableState.graphRendered) {
		//div to display the graph
		graphDiv = createElement(document, 'div', {id: divId + '_' + childDivIdPrefix + 'graphDiv_' + stepWorkId, style: 'width:450px; height:250px'});
		
		//div to display a new line
		newLine3Div = createElement(document, 'div', {id: divId + '_' + childDivIdPrefix + 'newLine2Div_' + stepWorkId});
	}
	
	//div to display the student response
	var tableResponseDiv = createElement(document, 'div', {id: divId + '_' + childDivIdPrefix + 'tableResponseDiv_' + stepWorkId});
	
	displayStudentWorkDiv.append(tableTableDataDiv);
	displayStudentWorkDiv.append(newLineDiv);
	
	if(table.isGraphingEnabled() && tableState.graphRendered) {
		var graphOptions = tableState.graphOptions;
		var graphSelectAxesType = graphOptions.graphSelectAxesType;
		var graphWhoSetAxesLimitsType = graphOptions.graphWhoSetAxesLimitsType;
		
		if(graphSelectAxesType == 'studentSelect' || graphWhoSetAxesLimitsType == 'studentSelect') {
			/*
			 * the step has the student select the axes or the axes limits
			 * so we will add the div that we will insert that data into
			 */
			
			//add the graph options div
			displayStudentWorkDiv.append(tableGraphOptionsDiv);
			
			//display a new line
			displayStudentWorkDiv.append(newLine2Div);
		}
		
		//add the graph div
		displayStudentWorkDiv.append(graphDiv);
		
		//display a loading message in the div, this will be overwritten by the graph
		$(graphDiv).html("Loading...");
		
		//display a new line
		displayStudentWorkDiv.append(newLine3Div);
	}

	displayStudentWorkDiv.append(tableResponseDiv);

	//add the table
	$(tableTableDataDiv).html(tableState.getTableHtml());
	
	//newline to separate the graph from the response
	$(newLineDiv).append('<br>');
	
	if(table.isGraphingEnabled() && tableState.graphRendered) {
		//get the graph options
		var graphOptions = tableState.graphOptions;
		var graphSelectAxesType = graphOptions.graphSelectAxesType;
		var columnToAxisMappings = graphOptions.columnToAxisMappings;
		var graphWhoSetAxesLimitsType = graphOptions.graphWhoSetAxesLimitsType;
		var axesLimits = graphOptions.axesLimits;
		
		if(graphSelectAxesType != null) {
			if(graphSelectAxesType == 'studentSelect') {
				//the student selected the axes
				if(columnToAxisMappings != null) {
					
					//loop through all the column to axis mappings
					for(var x=0; x<columnToAxisMappings.length; x++) {
						var columnToAxisMapping = columnToAxisMappings[x];
						
						if(columnToAxisMapping != null) {
							//get the column axis e.g. x or y
							var columnAxis = columnToAxisMapping.columnAxis;
							
							//get the column index
							var columnIndex = columnToAxisMapping.columnIndex;
							
							//get the column header
							var columnHeader = table.getColumnHeaderByIndex(columnIndex, tableState.tableData);
							
							//display the axis and the column header for that axis
							$(tableGraphOptionsDiv).append(columnAxis + ': ' + columnHeader + '<br>');
						}
					}
				}
			}
		}
		
		if(graphWhoSetAxesLimitsType != null) {
			if(graphWhoSetAxesLimitsType == 'studentSelect') {
				//the student selected the axes limits
				if(axesLimits != null) {
					var xMin = axesLimits.xMin;
					var xMax = axesLimits.xMax;
					var yMin = axesLimits.yMin;
					var yMax = axesLimits.yMax;
					
					//display the min/max values
					$(tableGraphOptionsDiv).append('X Min: ' + xMin + '<br>');
					$(tableGraphOptionsDiv).append('X Max: ' + xMax + '<br>');
					$(tableGraphOptionsDiv).append('Y Min: ' + yMin + '<br>');
					$(tableGraphOptionsDiv).append('Y Max: ' + yMax + '<br>');
				}
			}
		}
		
		var isRenderGradingView = true;
		
		//display the graph in the div
		table.makeGraph($(graphDiv), tableState.tableData, tableState.graphOptions, isRenderGradingView);
	}
	
	//add the response
	$(tableResponseDiv).html(response);
};

/**
 * Get the html file associated with this step that we will use to
 * display to the student.
 * 
 * TODO: rename TemplateNode
 * 
 * @return a content object containing the content of the associated
 * html for this step type
 */
TableNode.prototype.getHTMLContentTemplate = function() {
	/*
	 * TODO: rename both occurrences of template
	 * 
	 * e.g. if you are creating a quiz step you would change it to
	 * 
	 * node/quiz/quiz.html
	 */
	return createContent('node/table/table.html');
};

/**
 * Get the html string representation of the student work
 * @param work the student node state that we want to display
 * @return an html string that will display the student work
 */
TableNode.prototype.getStudentWorkHtmlView = function(work) {
	//make an instance of the Table
	var table = new Table(this, this.view);
	
	//get the html representation of the student work
	var html = table.getStudentWorkHtmlView(work);
	
	return html;
};

/*
 * Add this node to the node factory so the vle knows it exists.
 * TODO: rename both occurrences of TemplateNode
 * 
 * e.g. if you are creating a quiz step you would change it to
 * 
 * NodeFactory.addNode('QuizNode', QuizNode);
 */
NodeFactory.addNode('TableNode', TableNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename template to your new folder name
	 * TODO: rename TemplateNode
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/QuizNode.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/table/TableNode.js');
};