/*
 * This is a template step object that developers can use to create new
 * step types.
 * 
 * TODO: Copy this file and rename it to
 * 
 * <new step type>.js
 * e.g. for example if you are creating a quiz step it would look
 * something like quiz.js
 *
 * and then put the new file into the new folder
 * you created for your new step type
 *
 * your new folder will look something like
 * vlewrapper/WebContent/vle/node/<new step type>/
 *
 * e.g. for example if you are creating a quiz step it would look something like
 * vlewrapper/WebContent/vle/node/quiz/
 * 
 * 
 * TODO: in this file, change all occurrences of the word 'TEMPLATE' to the
 * name of your new step type
 * 
 * <new step type>
 * e.g. for example if you are creating a quiz step it would look
 * something like QUIZ
 */

/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at template.html)
 * 
 * TODO: rename TEMPLATE
 * 
 * @constructor
 */
function Table(node, view) {
	this.node = node;
	this.view = view;
	this.content = node.getContent().getContentJSON();
	
	if(node.studentWork != null) {
		this.states = node.studentWork; 
	} else {
		this.states = [];  
	};
	
	//boolean values used to determine whether the student has made any changes
	this.tableChanged = false;
	this.responseChanged = false;
	
	if(this.states.length == 0) {
		//populate the work from a previous step if a populatePreviousWorkNodeId has been set
		this.populatePreviousWork();
	}
	
	//get the default cell size from the authored content
	this.globalCellSize = this.content.globalCellSize;
	
	if(this.globalCellSize == null || this.globalCellSize == '') {
		//the author has not specified a default cell size so we will just use 10
		this.globalCellSize = 10;
	}
	
	//value used to remember whether the student has rendered the graph
	this.graphRendered = false;
};

/**
 * Populate the work from the previous step if a populatePreviousWorkNodeId has been set
 */
Table.prototype.populatePreviousWork = function() {
	//get the populatePreviousWorkNodeId
	var populatePreviousWorkNodeId = this.node.populatePreviousWorkNodeId;
	
	//check if populatePreviousWorkNodeId has been set
	if(populatePreviousWorkNodeId != null && populatePreviousWorkNodeId != "") {
		//populatePreviousWorkNodeId has been set
		
		if(this.view.state != null) {
			//get the state from the previous step that this step is linked to
			var previousWorkState = this.view.state.getLatestWorkByNodeId(populatePreviousWorkNodeId);
			
			if(previousWorkState != null && previousWorkState != "") {
				//make a copy of the previous work
				var previousWorkStateCopy = JSON.parse(JSON.stringify(previousWorkState));
				
				/*
				 * make a new table state and only populate the table data since
				 * we want the response textarea to be blank
				 */
				previousWorkStateCopy = new TableState("", previousWorkStateCopy.tableData);
				
				//add the state to the array of states
				this.states.push(previousWorkStateCopy);
			}
		}
	}
};

/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 * 
 * TODO: rename TEMPLATE
 * 
 * note: you do not have to use 'promptDiv' or 'studentResponseTextArea', they
 * are just provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at template.html).
 */
Table.prototype.render = function() {
	//check if we need to hide everything below the table
	if(this.content.hideEverythingBelowTable) {
		this.hideEverythingBelowTable();
	} else {
		this.showEverythingBelowTable();
	}
	
	//display the prompt to the student
	$('#promptDiv').html(this.content.prompt);
	
	//display the prompt2 which is between the table and the student textarea
	$('#prompt2Div').html(this.content.prompt2);
	
	//make a table
	var tableDisplay = document.createElement('table');
	
	//get the table data
	var tableData = this.content.tableData;
	
	//get the latest state
	var latestState = this.getLatestState();
	
	//loop through all the rows
	for(var y=0; y<this.content.numRows; y++) {
		
		//make a row
		var tr = document.createElement('tr');
		
		//loop through all the columns in the row
		for(var x=0; x<this.content.numColumns; x++) {	
			
			//make a cell
			var td = document.createElement('td');
			
			//get the values for the cell from the content
			var cellData = tableData[x][y];
			var cellText = cellData.text;
			var cellUneditable = cellData.uneditable;
			var cellSize = cellData.cellSize;
			
			if(cellSize == null || cellSize == '') {
				//cell size is not defined so we will just use the global cell size
				cellSize = this.globalCellSize;
			}
			
			if(latestState != null) {
				if(latestState.tableData != null) {
					if(latestState.tableData[x] != null) {
						if(latestState.tableData[x][y] != null) {
							/*
							 * if the student has worked on this step before, the
							 * student values will be used in the cells instead of
							 * the values from the content
							 */
							cellText = latestState.tableData[x][y].text;							
						}
					}
				}
			}
			
			/*
			 * create the text input that will represent the cell and
			 * where the student can edit the text in the cell
			 */
			var cellTextInput = document.createElement('input');
			cellTextInput.id = 'tableCell_' + x + '-' + y;
			cellTextInput.name = 'tableCell_' + x + '-' + y;
			cellTextInput.value = cellText;
			cellTextInput.size = cellSize;
			cellTextInput.onchange = studentTableChanged;
			
			if(cellUneditable) {
				//disable the cell if necessary
				cellTextInput.disabled = true;
			}
			
			//add the elements to the UI
			td.appendChild(cellTextInput);
			tr.appendChild(td);
		}
		
		tableDisplay.appendChild(tr);
	}
	
	//clear out the existing table
	$('#tableDiv').html('');
	
	//add the newly generated table
	$('#tableDiv').append(tableDisplay);
	
	//get the starter sentence
	var starterSentence = this.content.starterSentence;
	
	//load any previous responses the student submitted for this step
	var latestState = this.getLatestState();
	
	if(latestState != null) {
		/*
		 * get the response from the latest state. the response variable is
		 * just provided as an example. you may use whatever variables you
		 * would like from the state object (look at templatestate.js)
		 */
		var latestResponse = latestState.response;
		
		//set the previous student work into the text area
		$('#studentResponseTextArea').val(latestResponse);
	} else {
		/*
		 * the student has not submitted any work for this step so we will
		 * set the starter sentence into the student textarea
		 */
		$('#studentResponseTextArea').val(starterSentence);
	}
	
	if(this.content.hideEverythingBelowTable || starterSentence == null || starterSentence == "") {
		//hide the starter sentence button if starter sentence is not set
		$('#showStarterSentenceDiv').hide();
	} else {
		//show the starter sentence button since this step has a starter sentence
		$('#showStarterSentenceDiv').show();
	}
	
	if(this.isGraphingEnabled()) {
		//graphing is enabled so we will show the graphing options
		this.displayGraphOptions();
		
		if(this.isGraphPreviouslyRendered()) {
			//populate the graph since the student previously rendered it
			this.makeGraph();
			
			/*
			 * set this back to false since the student has not clicked
			 * the 'Make Graph' button at this time. the graphRendered
			 * value is like the tableChanged value in that it keeps
			 * track of whether something has changed and now needs to
			 * be saved. in this case we set it to false because the
			 * graph was previously rendered and not currently rendered.
			 * if the student clicks 'Make Graph' again, we will set
			 * this to true.
			 */
			this.graphRendered = false;
		} else {
			/*
			 * the graph was not previously rendered so we will suggest
			 * the student to click "Make Graph"
			 */
			this.displayGraphMessage(' <font color="red">Click "Make Graph" to graph the data</font>');
		}
	}
};

/**
 * Get the html string representation of the student work for this step
 * @param work the student work node state
 * @returns an html string that will display the student work for this step
 */
Table.prototype.getStudentWorkHtmlView = function(work) {
	//make a table
	var html = "<table>";

	//get the table data
	var tableData = this.content.tableData;
	
	//get the latest state
	var latestState = work;
	
	//loop through all the rows
	for(var y=0; y<this.content.numRows; y++) {
		
		//make a row
		html += "<tr>";
		
		//loop through all the columns in the row
		for(var x=0; x<this.content.numColumns; x++) {	
			
			//make a cell
			html += "<td>";
			
			//get the values for the cell from the content
			var cellData = tableData[x][y];
			var cellText = cellData.text;
			var cellUneditable = cellData.uneditable;
			var cellSize = cellData.cellSize;
			
			if(cellSize == null || cellSize == '') {
				//cell size is not defined so we will just use the global cell size
				cellSize = this.globalCellSize;
			}
			
			if(latestState != null) {
				if(latestState.tableData != null) {
					if(latestState.tableData[x] != null) {
						if(latestState.tableData[x][y] != null) {
							/*
							 * if the student has worked on this step before, the
							 * student values will be used in the cells instead of
							 * the values from the content
							 */
							cellText = latestState.tableData[x][y].text;							
						}
					}
				}
			}
			
			/*
			 * create the text input that will represent the cell
			 */
			var cellTextInput = document.createElement('input');
			cellTextInput.id = 'tableCell_' + x + '-' + y;
			cellTextInput.name = 'tableCell_' + x + '-' + y;
			cellTextInput.type = 'text';
			cellTextInput.value = cellText;
			cellTextInput.size = cellSize;
			
			/*
			 * create the input cell, all cells will not be editable 
			 * since this function is only for display purposes
			 */ 
			html += "<input ";
			html += "id='htmlViewTableCell_" + x + "_" + y + "' ";
			html += "name='htmlViewTableCell_" + x + "_" + y + "' ";
			html += "value='" + cellText + "' ";
			html += "size='" + cellSize + "' ";
			html += "disabled='disabled' ";
			html += "/>";
			
			html += "</td>";
		}
		
		html += "</tr>";
	}
	
	html += "</table>";
	
	if(latestState.response != null && latestState.response != '') {
		//display the text response the student wrote
		html += "<p>" + latestState.response + "</p>";
	}
	
	return html;
};

/**
 * This function retrieves the latest student work
 * 
 * TODO: rename TEMPLATE
 * 
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
Table.prototype.getLatestState = function() {
	var latestState = null;
	
	//check if the states array has any elements
	if(this.states != null && this.states.length > 0) {
		//get the last state
		latestState = this.states[this.states.length - 1];
	}
	
	return latestState;
};

/**
 * This function retrieves the student work from the html ui, creates a state
 * object to represent the student work, and then saves the student work.
 * 
 * TODO: rename TEMPLATE
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at template.html).
 */
Table.prototype.save = function() {
	if(this.responseChanged || this.tableChanged || this.graphRendered || this.graphOptionsChanged) {
		//get the answer the student wrote
		var response = $('#studentResponseTextArea').val();
		
		var studentTableData = this.getStudentTableData();
		
		//get whether the student has rendered the graph for the recent table data
		var graphRendered = this.graphRendered;
		
		if(this.responseChanged && !this.tableChanged && !this.graphRendered && !this.graphOptionsChanged) {
			/*
			 * the response was changed, but nothing else was, so we will
			 * use the previous value of graphRendered. this is needed
			 * for the case when the graph was previously rendered and
			 * the student came back to this step, and then changed the
			 * response but never changed the graph. in this case
			 * graphRendered would be false but we need it to be true
			 * so we will reuse the previous graphRendered value. we
			 * need it to be true so that when the student leaves and
			 * comes back, the graph will be rendered.
			 */
			graphRendered = this.isGraphPreviouslyRendered();
		}
		
		/*
		 * get the graph options such as which columns are graphed on which axes
		 * so that we can repopulate the graph when the student returns to this step
		 */
		var graphOptions = this.getGraphOptions();
		
		/*
		 * create the student state that will store the new work the student
		 * just submitted
		 * 
		 * TODO: rename TEMPLATESTATE
		 * 
		 * make sure you rename TEMPLATESTATE to the state object type
		 * that you will use for representing student data for this
		 * type of step. copy and modify the file below
		 * 
		 * vlewrapper/WebContent/vle/node/template/templatestate.js
		 * 
		 * and use the object defined in your new state.js file instead
		 * of TEMPLATESTATE. for example if you are creating a new
		 * quiz step type you would copy the file above to
		 * 
		 * vlewrapper/WebContent/vle/node/quiz/quizstate.js
		 * 
		 * and in that file you would define QUIZSTATE and therefore
		 * would change the TEMPLATESTATE to QUIZSTATE below
		 */
		var tableState = new TableState(response, studentTableData, graphRendered, graphOptions);
		
		/*
		 * fire the event to push this state to the global view.states object.
		 * the student work is saved to the server once they move on to the
		 * next step.
		 */
		eventManager.fire('pushStudentWork', tableState);

		//push the state object into this or object's own copy of states
		this.states.push(tableState);		
	}
	
	//set these boolean values back to false since we have just saved
	this.tableChanged = false;
	this.responseChanged = false;
};

/**
 * Get the student table data
 * @return the student table data with the values the student entered
 * into the table
 */
Table.prototype.getStudentTableData = function() {
	//make a copy of the table data from the content
	var studentTableData = JSON.parse(JSON.stringify(this.content.tableData));
	
	//loop through all the columns
	for(var x=0; x<this.content.numColumns; x++) {
	
		//loop through all the rows
		for(var y=0; y<this.content.numRows; y++) {
			//get the text in the given x, y cell
			var tableCellText = $('#tableCell_' + x + '-' + y).val();
			
			//update the cell in the table data
			studentTableData[x][y].text = tableCellText;
		}
	}
	
	return studentTableData;
};

/**
 * Reset the table back to the original value in the content
 */
Table.prototype.reset = function() {
	//get the original table values from the content
	var tableData = this.content.tableData;
	
	//check if there is a populatePreviousWorkNodeId
	var populatePreviousWorkNodeId = this.node.populatePreviousWorkNodeId;
	
	if(populatePreviousWorkNodeId != null && populatePreviousWorkNodeId != "") {
		//there is a populatePreviousWorkNodeId
		
		//get the latest work from the populatePreviousWorkNodeId
		var previousWorkState = this.view.state.getLatestWorkByNodeId(populatePreviousWorkNodeId);
		
		if(previousWorkState != null && previousWorkState != "") {
			//use the data from this populatePreviousWorkNodeId to reset the table
			tableData = previousWorkState.tableData;		
		}
	}
	
	//loop through all the columns
	for(var x=0; x<this.content.numColumns; x++) {
		
		//loop through all the rows
		for(var y=0; y<this.content.numRows; y++) {
			/*
			 * set the value in the cell back to the original value whether from the 
			 * content or a previous step
			 */
			$('#tableCell_' + x + '-' + y).val(tableData[x][y].text);
		}
	}
	
	//notify this Table object that the student has changed the table
	this.studentTableChanged();
};

/**
 * Set the tableChanged boolean to true
 */
Table.prototype.studentTableChanged = function() {
	this.tableChanged = true;
	
	/*
	 * the table has changed so we will set this to false so
	 * the next time the student visits this step it will not
	 * populate the graph. the student must click 'Make Graph'
	 * in order to save the graph after the table has changed.
	 */
	this.graphRendered = false;
	
	if(this.isGraphingEnabled()) {
		/*
		 * display the message to tell the student to click the
		 * 'Make Graph' button to make the graph with the new
		 * table data
		 */
		this.displayGraphMessage(' <font color="red">Table has changed, click "Make Graph" to graph the new data</font>');
	}
};

/**
 * Set the reponseChanged boolean to true
 */
Table.prototype.studentResponseChanged = function() {
	this.responseChanged = true;
};

/**
 * Set the reponseChanged boolean to true
 */
Table.prototype.studentGraphOptionsChanged = function() {
	this.graphOptionsChanged = true;
	
	/*
	 * the graph options have changed so we will set this to false so
	 * the next time the student visits this step it will not
	 * populate the graph. the student must click 'Make Graph'
	 * in order to save the graph after any of the graph options
	 * have changed.
	 */
	this.graphRendered = false;
};

/**
 * Append the starter sentence into the student response textarea
 */
Table.prototype.showStarterSentence = function() {
	//get the starter sentence
	var starterSentence = this.content.starterSentence;
	
	//get the student response that is currently in the textarea
	var studentResponse = $('#studentResponseTextArea').val();
	
	//append the starter sentence into the student textarea
	$('#studentResponseTextArea').val(studentResponse + starterSentence);
	
	this.studentResponseChanged();
};

/**
 * Hide all the divs below the table except for the save button div
 */
Table.prototype.hideEverythingBelowTable = function() {
	$('#prompt2Div').hide();
	$('#showStarterSentenceDiv').hide();
	$('#responseDiv').hide();
};

/**
 * Show all the divs below the table
 */
Table.prototype.showEverythingBelowTable = function() {
	$('#prompt2Div').show();
	$('#showStarterSentenceDiv').show();
	$('#responseDiv').show();
};

/**
 * Check if graphing is enabled for this step
 * @return whether graphing is enabled for this step
 */
Table.prototype.isGraphingEnabled = function() {
	var result = false;
	
	if(this.content.graphOptions != null && this.content.graphOptions.enableGraphing) {
		//graphing is enabled
		result = true;
	}
	
	return result;
};

/**
 * Display the graph options such as the 'Make Graph' button and
 * the axis select drop down if this step is authored to let the
 * student select the axes.
 */
Table.prototype.displayGraphOptions = function() {
	//show the div that contains all the graph elements
	$('#graphParentDiv').show();
	
	//clear out the graph options in case it already contains elements
	$('#graphOptionsDiv').html('');
	
	//show the graph options div
	$('#graphOptionsDiv').show();
	
	/*
	 * hide the div where the graph will be displayed. this will
	 * be shown once the student clicks 'Make Graph'
	 */
	$('#graphDiv').hide();
	
	var latestState = this.getLatestState();
	
	if(this.content.graphOptions.graphSelectAxesType == null || this.content.graphOptions.graphSelectAxesType == '') {
		//do nothing
	} else if(this.content.graphOptions.graphSelectAxesType == 'authorSelect') {
		//don't need to do anything since 'Make Graph' button is always displayed
	} else if(this.content.graphOptions.graphSelectAxesType == 'studentSelect') {
		//create the drop downs to let the student select the x an y axes
		var selectXAxis = $('<select id="studentSelectXAxis">');
		var selectYAxis = $('<select id="studentSelectYAxis">');
		
		selectXAxis.change({thisTable:this}, function(event) {
			event.data.thisTable.graphOptionsChanged = true;
		});
		
		selectYAxis.change({thisTable:this}, function(event) {
			event.data.thisTable.graphOptionsChanged = true;
		});
		
		//loop through all the columns
		for(var z=0; z<this.content.numColumns; z++) {
			//get a column header
			var columnHeader = this.getColumnHeaderByIndex(z);
			
			//add this column header to the x and y drop down
			selectXAxis.append($('<option>').attr('value', z).text(columnHeader));
			selectYAxis.append($('<option>').attr('value', z).text(columnHeader));
		}
		
		//add the labels and drop downs for the x and y axis
		$('#graphOptionsDiv').append('X Axis: ');
		$('#graphOptionsDiv').append(selectXAxis);
		$('#graphOptionsDiv').append('<br>');
		$('#graphOptionsDiv').append('Y Axis: ');
		$('#graphOptionsDiv').append(selectYAxis);
		
		//populate the axis drop downs
		if(latestState != null) {
			//get the graph options from the latest student work
			var graphOptions = latestState.graphOptions;
			
			if(graphOptions != null) {
				//get the array that contains the column to axis mappings
				var columnToAxisMappings = graphOptions.columnToAxisMappings;
				
				if(columnToAxisMappings != null) {
					//loop through all the column to axis mappings
					for(var x=0; x<columnToAxisMappings.length; x++) {
						//get an object that contains the column index and column axis
						var columnToAxisMapping = columnToAxisMappings[x];
						
						if(columnToAxisMapping != null) {
							//get the column index and column axis
							var columnIndex = columnToAxisMapping.columnIndex;
							var columnAxis = columnToAxisMapping.columnAxis;
							
							if(columnAxis == 'x') {
								//set the x axis drop down to the value the student previously set it to
								selectXAxis.val(columnIndex);
							} else if(columnAxis == 'y') {
								//set the y axis drop down to the value the student previously set it to
								selectYAxis.val(columnIndex);
							}
						}
					}
				}
			}
		}
	}
};

/**
 * Get the column indexes that we will graph
 * @param graphOptions (optional) the graph options which contains
 * the graph type, columnToAxisMappings, and perhaps other graph options.
 * this is passed in when it is called from the grading tool.
 * the student vle does not need this argument.
 * @returns an array containing objects that have a columnIndex
 * and columnAxis
 */
Table.prototype.getColumnIndexesToGraph = function(graphOptions) {
	var result = null;
	
	if(graphOptions == null) {
		//graph options were not provided so we will look at the step content
		if(this.content.graphOptions.graphSelectAxesType == 'authorSelect') {
			/*
			 * the author selected the axes so we will retrieve the
			 * graph axes from the step content
			 */
			result = this.content.graphOptions.columnToAxisMappings;
		} else if(this.content.graphOptions.graphSelectAxesType == 'studentSelect') {
			/*
			 * the student is supposed to select the axes so we will
			 * retrieve the values they chose from the drop downs
			 */
			var xColumnIndex = $('#studentSelectXAxis').val();
			var yColumnIndex = $('#studentSelectYAxis').val();
			
			//create the object for the x axis
			var xColumnObject = {
				columnIndex:xColumnIndex,
				columnAxis:'x'
			};
			
			//create the object for the y axis
			var yColumnObject = {
				columnIndex:yColumnIndex,
				columnAxis:'y'
			};
			
			//put the objects in an array
			result = [xColumnObject, yColumnObject];
		}
	} else {
		//the graph options were provided so we will get the columnToAxisMappings from it
		result = graphOptions.columnToAxisMappings;
	}
	
	return result;
};

/**
 * Get the column header by the column index
 * @param index the column index (starts at 0)
 * @param tableData (optional) the table data the student submitted.
 * this argument is passed in when called from the grading tool.
 * the student vle does not need to provide this argument.
 * @returns the column header
 */
Table.prototype.getColumnHeaderByIndex = function(index, tableData) {
	var columnHeader = '';
	
	var studentTableData  = null;
	
	if(tableData == null) {
		//get the data from the student table 
		studentTableData = this.getStudentTableData();
	} else {
		//the table data was passed in as an argument
		studentTableData = tableData;
	}
	
	if(studentTableData != null) {
		//get the column with the given index
		var column = studentTableData[index];
		
		if(column != null) {
			/*
			 * get the first row of the column since that will
			 * be the row where the header is
			 */
			cellData = column[0];
			
			if(cellData != null) {
				//get the text from the cell
				columnHeader = cellData.text;
			}
		}
	}
	
	return columnHeader;
};

/**
 * The student has clicked the make graph button so we will make the graph
 * @param divId (optional) the div id to make the graph in. this argument
 * will be passed in when called from the grading tool. the student vle
 * does not need to provide this argument.
 * @param tableData (optional) the student table data. this argument
 * will be passed in when called from the grading tool. the student vle
 * does not need to provide this argument.
 * @param graphOptions (optional) the graph options. this argument
 * will be passed in when called from the grading tool. the student vle
 * does not need to provide this argument.
 */
Table.prototype.makeGraph = function(divId, tableData, graphOptions) {
	
	if(divId == null) {
		//the default div id to make the graph in
		divId = 'graphDiv';
		
		//show the graph div that will display the graph
		$('#' + divId).show();
	}
	
	//clear the graph div id to remove any existing graph
	$('#' + divId).html('');
	
	/*
	 * get the table data in the format google wants it in.
	 * we store it in Array[x][y] and google wants it in
	 * Array[y][x].
	 */
	var dataInGoogleFormat = this.getDataInGoogleFormat(tableData, graphOptions);

	var data = null;
	
	try {
		//create the data
		data = google.visualization.arrayToDataTable(dataInGoogleFormat);
	} catch(e) {
		//inform the student that the data in the table is invalid
		this.displayGraphMessage(' <font color="red">Error: Data in table is invalid, please fix and try again</font>');
	}
	
	if(data != null) {
		//get the column indexes we will graph
		var columnIndexesToGraph = this.getColumnIndexesToGraph(graphOptions);
		
		var hTitle = '';
		var hMinValue = this.xMin;
		var hMaxValue = this.xMax;
		var vTitle = '';
		var vMinValue = this.yMin;
		var vMaxValue = this.yMax;
		
		if(columnIndexesToGraph != null) {
			//loop through all the objects in the array
			for(var x=0; x<columnIndexesToGraph.length; x++) {
				//get an object
				var columnObject = columnIndexesToGraph[x];
				
				//get the column index and column axis
				var columnIndex = columnObject.columnIndex;
				var columnAxis = columnObject.columnAxis;
				
				if(columnAxis == 'x') {
					//get the column header for the x axis
					hTitle = this.getColumnHeaderByIndex(columnIndex, tableData);
				} else if(columnAxis == 'y') {
					/*
					 * get the column header for the y axis, if there are
					 * multiple columns that will be displayed on the
					 * y axis, we will separate them with a comma
					 */
					if(vTitle != '') {
						vTitle += ', ';
					}
					vTitle += this.getColumnHeaderByIndex(columnIndex, tableData);
				}
			}		
		}

		//create the options to tell google how to display the graph
		var options = {
			title: hTitle + ' vs. ' + vTitle,
			hAxis: {title: hTitle},
			vAxis: {title: vTitle},
			forceIFrame: false
		};

		var chart = null;
		
		if(this.content.graphOptions != null) {
			//get the graph type we will display
			var graphType = this.content.graphOptions.graphType;

			if(graphType == 'scatterPlot') {
				chart = new google.visualization.ScatterChart(document.getElementById(divId));
			} else if(graphType == 'lineGraph') {
				chart = new google.visualization.LineChart(document.getElementById(divId));
			} else if(graphType == 'barGraph') {
				chart = new google.visualization.ColumnChart(document.getElementById(divId));
			} else if(graphType == 'pieGraph') {
				chart = new google.visualization.PieChart(document.getElementById(divId));
			}
		}

		try {
			//tell google to draw the graph
			chart.draw(data, options);
			this.graphRendered = true;
			this.clearGraphMessage();
		} catch(e) {
			//inform the student that we were unable to draw the chart
			this.displayGraphMessage(' <font color="red">Error: Unable to draw chart</font>');
		}
	}
};

/**
 * Get the table data in the format google wants it in.
 * we store it in Array[x][y] and google wants it in
 * Array[y][x].
 * 
 * e.g. here is a table with data
 * |time|distance|
 * |   0|       0|
 * |   1|      10|
 * |   2|      20|
 * 
 * we store it like this
 * [
 * 	[time, 0, 1, 2],
 * 	[distance, 0, 10, 20]
 * ]
 * 
 * google wants it like this
 * [
 * 	[time, distance],
 * 	[0, 0],
 * 	[1, 10],
 * 	[2, 20],
 * ]
 * 
 * @param tableData (optional) the student data table. this argument
 * will be passed in when called from the grading tool. the student vle
 * does not need to provide this argument.
 * @param graphOptions (optional) the graph options. this argument
 * will be passed in when called from the grading tool. the student vle
 * does not need to provide this argument.
 * @returns a two dimensional array that contains the table 
 * data where the first dimension is y and the second dimension
 * is x
 */
Table.prototype.getDataInGoogleFormat = function(tableData, graphOptions) {
	//get the columns to graph
	var columnIndexesToGraph = this.getColumnIndexesToGraph(graphOptions);
	
	//create the array that we will return
	var rows = [];
	
	/*
	 * create an array for each row.
	 * e.g. if the table has 4 rows the array will end up
	 * looking like
	 * [
	 * 	[],
	 * 	[],
	 * 	[],
	 * 	[]
	 * ]
	 */ 
	for(var y=0; y<this.content.numRows; y++) {
		rows[y] = [];
	}
	
	//loop through the column indexes to graph
	for(var c=0; c<columnIndexesToGraph.length; c++) {
		//get the column object
		var columnObject = columnIndexesToGraph[c];
		
		if(columnObject != null) {
			//get the column index and column axis
			var columnIndex = columnObject.columnIndex;
			var columnAxis = columnObject.columnAxis;
			
			var minValue = 0;
			var maxValue = 0;
			
			/*
			 * loop through all the rows. basically we will
			 * obtain all the elements in the current column.
			 */
			for(var r=0; r<this.content.numRows; r++) {
				//get the cell value of one of the cells in the column
				var cellValue = this.getCellValue(columnIndex, r, tableData);
				
				if(!isNaN(parseFloat(cellValue))) {
					//cell value is a number
					
					if(cellValue < minValue) {
						//remember the new min value
						minValue = cellValue;
					}
					
					if(cellValue > maxValue) {
						//remember the new max value
						maxValue = cellValue;
					}
				}
				
				if(cellValue === '') {
					//cell is an empty string so we will set the value to null
					cellValue = null;
				}
				
				//put the cell value into this row
				rows[r].push(cellValue);
			}
			
			if(columnAxis == 'x') {
				//remember the x min and max value
				this.xMin = minValue;
				this.xMax = maxValue;
			} else if(columnAxis == 'y') {
				//remember the y min and max value
				this.yMin = minValue;
				this.yMax = maxValue;
			}
		}
	}
	
	return rows;
};

/**
 * Get the cell value at the given coordinates
 * @param x the x coordinate
 * @param y the y coordinate
 * @param tableData (optional) the student data table. this argument
 * will be passed in when called from the grading tool. the student vle
 * does not need to provide this argument.
 * @return the value of the cell at the given coordinates
 */
Table.prototype.getCellValue = function(x, y, tableData) {
	var tableCellValue = '';
	
	if(tableData == null) {
		/*
		 * table data was not passed in so we will retrieve the
		 * cell value from the UI
		 */ 
		
		//get the cell value
		tableCellValue = $('#tableCell_' + x + '-' + y).val();
		
		if(!isNaN(parseFloat(tableCellValue))) {
			//value is a number so we will parse it as a float
			tableCellValue = parseFloat(tableCellValue);
		}
	} else {
		/*
		 * table data was passed in so we will use it to retrieve
		 * the cell value
		 */
		
		//get the cell from the 2D array
		tableCell = tableData[x][y];
		
		if(tableCell != null) {
			//get the text which is a string
			var text = tableCell.text;
			
			if(!isNaN(parseFloat(text))) {
				//value is a number so we will convert it to a number
				tableCellValue = parseFloat(text);
			} else {
				//value is text
				tableCellValue = text;
			}
		}
	}
	
	return tableCellValue;
};

/**
 * Get the graph options to save into the table state so that we
 * know how to repopulate the graph when the student returns to this
 * step.
 */
Table.prototype.getGraphOptions = function() {
	var graphOptions = {};
	
	if(this.content.graphOptions != null) {
		
		if(this.content.graphOptions.graphSelectAxesType == 'studentSelect') {
			var columnToAxisMappings = [];
			
			//get the value of the x and y drop downs which are integer values
			var xColumnIndex = parseInt($('#studentSelectXAxis').val());
			var yColumnIndex = parseInt($('#studentSelectYAxis').val());
			
			//create the object to remember the column for the x axis
			var xColumnObject = {
				columnIndex:xColumnIndex,
				columnAxis:'x'
			};
			
			//create the object to remember the column for the y axis
			var yColumnObject = {
				columnIndex:yColumnIndex,
				columnAxis:'y'
			};
			
			//put the objects into the array
			columnToAxisMappings.push(xColumnObject);
			columnToAxisMappings.push(yColumnObject);
			
			//put the array into the graph options object
			graphOptions.columnToAxisMappings = columnToAxisMappings;
		} else if(this.content.graphOptions.graphSelectAxesType == 'authorSelect') {
			//get the column graph axis values from the content
			graphOptions.columnToAxisMappings = this.content.graphOptions.columnToAxisMappings;
		}
	} 
	
	return graphOptions;
};

/**
 * Check if the graph was previously rendered
 */
Table.prototype.isGraphPreviouslyRendered = function() {
	var graphPreviouslyRendered = false;
	
	//get the latest state
	var latestState = this.getLatestState();
	
	if(latestState != null) {
		if(latestState.graphRendered != null) {
			graphPreviouslyRendered = latestState.graphRendered;			
		}
	}
	
	return graphPreviouslyRendered;
};

/**
 * Display a message about the graph
 * @param message the message to display
 */
Table.prototype.displayGraphMessage = function(message) {
	$('#graphMessageDiv').html(message);
};

/**
 * Clear the message about the graph
 */
Table.prototype.clearGraphMessage = function() {
	$('#graphMessageDiv').html('');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename template to your new folder name
	 * TODO: rename template.js
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/quiz.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/table/table.js');
}