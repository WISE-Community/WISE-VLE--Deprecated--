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
function Table(node) {
	this.node = node;
	this.view = node.view;
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
		
		if(this.view.getState() != null) {
			//get the state from the previous step that this step is linked to
			var previousWorkState = this.view.getState().getLatestWorkByNodeId(populatePreviousWorkNodeId);
			
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
	var workToImport = null;
	
	//process the tag maps if we are not in authoring mode
	if(this.view.authoringMode == null || !this.view.authoringMode) {
		var tagMapResults = this.processTagMaps();
		
		//get the result values
		enableStep = tagMapResults.enableStep;
		message = tagMapResults.message;
		workToImport = tagMapResults.workToImport;
	}
	
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
	
	if(this.isDropDownTitleEnabled()) {
		//drop down title is enabled
		
		/*
		 * clear the drop down title div so we can re-populate it. this is
		 * required for the authoring step preview.
		 */
		$('#dropDownTitleDiv').html('');
		
		var thisTable = this;
		
		//create the select element that will hold all the drop down title options
		var dropDownTitleSelect = $('<select/>', {id:'dropDownTitleSelect'}).change(function() {
			//call this function when the student changes the option that is selected
			thisTable.dropDownTitleHasChanged();
		});
		
		//get all the drop down titles
		var dropDownTitles = this.getDropDownTitles();
		
		if(dropDownTitles != null) {
			//loop through all the drop down titles
			for(var x=0; x<dropDownTitles.length; x++) {
				//get a drop down title
				var dropDownTitle = dropDownTitles[x];
				
				//create a drop down title option and add it to the select element
				$('<option/>', {id:'dropDownOption_' + x, value:dropDownTitle, text:dropDownTitle}).appendTo(dropDownTitleSelect);
			}
		}
		
		//add the select element to the div
		$('#dropDownTitleDiv').append(dropDownTitleSelect);
	}
	
	//make a table
	var tableDisplay = document.createElement('table');
	
	//get the table data
	var tableData = this.content.tableData;
	
	//get the latest state
	var latestState = this.getLatestState();
	
	if((latestState == null || (typeof this.content.graphOptions !== "undefined" && typeof this.content.graphOptions.overridePreviousWorkHere !== undefined && this.content.graphOptions.overridePreviousWorkHere)) && workToImport != null && workToImport.length > 0) {
		/*
		 * the student has not done any work on this step yet and there
		 * is specified work to import so we will use the import work
		 * OR, an override flag is set to true in graph options (in advanced mode - JV)
		 */
		latestState = workToImport[workToImport.length - 1];
	}
	
	//get the number of rows and columns from the content
	this.numRows = this.content.numRows;
	this.numColumns = this.content.numColumns;

	if(latestState != null) {
		if(latestState.tableOptions != null) {
			
			if(latestState.tableOptions.numRows != null) {
				//get the number of rows from the student data
				this.numRows = latestState.tableOptions.numRows;
			}
			
			if(latestState.tableOptions.numColumns != null) {
				//get the number of columns from the student data
				this.numColumns = latestState.tableOptions.numColumns;
			}
		}
	}
	
	//loop through all the rows
	for(var y=0; y<this.numRows; y++) {
		
		//make a row
		var tr = document.createElement('tr');
		
		//loop through all the columns in the row
		for(var x=0; x<this.numColumns; x++) {	
			
			//make a cell
			var td = document.createElement('td');
			
			var cellText = '';
			var cellUneditable = null;
			var cellSize = null;
			
			if(tableData[x] != null && tableData[x][y] != null) {
				/*
				 * the cell exists in the step content. it's possible for
				 * the cell to not exist in the step content if the student
				 * has added rows or columns.
				 */
				var cellData = tableData[x][y];
				
				if(cellData != null) {
					//get the cell data values
					cellText = cellData.text;
					cellUneditable = cellData.uneditable;
					cellSize = cellData.cellSize;
				}
			}

			if(cellSize == null || cellSize == '') {
				//cell size is not defined so we will just use the global cell size
				cellSize = this.globalCellSize;
			}
			
			if(cellUneditable == null) {
				//set the default value of being editable
				cellUneditable = false;
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
			if (y == 0 && typeof this.content.graphOptions !== "undefined" && typeof this.content.graphOptions.autoResizeColumnTitles !== undefined && this.content.graphOptions.autoResizeColumnTitles){
				cellTextInput.size = Math.max(cellText.length, cellSize);
			} else {
				cellTextInput.size = cellSize;
			}
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
		
		if(this.isGraphPreviouslyRendered(latestState)) {
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
			//the message to tell the student to click the make graph button
			var click_make_graph = this.view.getI18NString('click_make_graph', 'TableNode');
			
			/*
			 * the graph was not previously rendered so we will suggest
			 * the student to click "Make Graph"
			 */
			this.displayGraphMessage(' <font color="red">' + click_make_graph + '</font>');
		}
	} else {
		//graphing is not enabled
		$('#graphParentDiv').hide();
	}
	
	if(this.isDropDownTitleEnabled()) {
		//drop down title is enabled
		
		if(latestState != null) {
			
			if(latestState.tableOptions != null) {
				
				if(latestState.tableOptions.title) {
					//get the drop down title that was previously chosen
					var dropDownTitle = latestState.tableOptions.title;
					
					if(dropDownTitle != null) {
						//find the drop down option with the given title and make it selected in the drop down
						$('#dropDownTitleSelect option').each(function() {
							if($(this).text() == dropDownTitle) {
								$(this).attr('selected', 'selected');
							}
						});
					}
				}
			}
		}
	}
	
	if(this.allowStudentToAddColumns()) {
		//we are allowing the student to add columns
		$('#addColumnButton').show();
		$('#deleteColumnButton').show();
	} else {
		//we are not allowing the student to add columns
		$('#addColumnButton').hide();
		$('#deleteColumnButton').hide();
	}
	
	if(this.allowStudentToAddRows()) {
		//we are allowing the student to add rows
		$('#addRowButton').show();
		$('#deleteRowButton').show();
	} else {
		//we are not allowing the student to add rows
		$('#addRowButton').hide();
		$('#deleteRowButton').hide();
	}
	
	this.node.view.eventManager.fire('contentRenderCompleted', this.node.id, this.node);
};

/**
 * Get the html string representation of the student work for this step
 * @param work the student work node state
 * @returns an html string that will display the student work for this step
 */
Table.prototype.getStudentWorkHtmlView = function(work) {
	//make a table
	var html = "";

	//get the table data
	var tableData = this.content.tableData;
	
	//get the latest state
	var latestState = work;
	
	var title = '';
	var numRows = this.content.numRows;
	var numColumns = this.content.numColumns;
	
	if(latestState != null) {
		if(latestState.tableOptions != null) {
			
			if(latestState.tableOptions.title != null) {
				//get the title from the student work
				title = latestState.tableOptions.title;
			}
			
			if(latestState.tableOptions.numRows != null) {
				/*
				 * get the number of rows from the previous work in case
				 * the student has added rows
				 */
				numRows = latestState.tableOptions.numRows;
			}
			
			if(latestState.tableOptions.numColumns != null) {
				/*
				 * get the number of columns from the previous work in case
				 * the student has added columns
				 */
				numColumns = latestState.tableOptions.numColumns;
			}
		}
	}
	
	if(title != null && title != '') {
		html += title + '<br>';
	}
	
	html += "<table>";
	
	//loop through all the rows
	for(var y=0; y<numRows; y++) {
		
		//make a row
		html += "<tr>";
		
		//loop through all the columns in the row
		for(var x=0; x<numColumns; x++) {
			
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
	if(this.responseChanged || this.tableChanged || this.graphRendered || this.graphOptionsChanged || this.dropDownTitleChanged) {
		//get the answer the student wrote
		var response = $('#studentResponseTextArea').val();
		
		var studentTableData = this.getStudentTableData();
		
		//get whether the student has rendered the graph for the recent table data
		var graphRendered = this.graphRendered;
		
		if((this.responseChanged || this.dropDownTitleChanged) && !this.tableChanged && !this.graphRendered && !this.graphOptionsChanged) {
			/*
			 * the response or drop down title was changed, but nothing else was, so we will
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
		
		//get the table options
		var tableOptions = this.getTableOptions();
		
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
		var tableState = new TableState(response, studentTableData, graphRendered, graphOptions, tableOptions);
		
		/*
		 * fire the event to push this state to the global view.states object.
		 * the student work is saved to the server once they move on to the
		 * next step.
		 */
		this.view.pushStudentWork(this.node.id, tableState);

		//push the state object into this or object's own copy of states
		this.states.push(tableState);		
	}
	
	//set these boolean values back to false since we have just saved
	this.tableChanged = false;
	this.responseChanged = false;
	this.dropDownTitleChanged = false;
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
	for(var x=0; x<this.numColumns; x++) {
	
		if(studentTableData[x] == null) {
			/*
			 * this column does not exist because the student
			 * has added a new column. we will now create the array
			 * for the new column the student added.
			 */
			studentTableData[x] = [];
		}
		
		//loop through all the rows
		for(var y=0; y<this.numRows; y++) {
			
			if(studentTableData[x][y] == null) {
				/*
				 * this cell does not exist because the student
				 * has added a new row. we will now create the cell
				 * for the new cell the student added.
				 */
				studentTableData[x][y] = {
					text:"",
					uneditable:false
				}
			}
			
			if($('#tableCell_' + x + '-' + y).length > 0) {
				//get the text in the given x, y cell
				var tableCellText = $('#tableCell_' + x + '-' + y).val();
				
				//update the cell in the table data
				studentTableData[x][y].text = tableCellText;
			}
		}
	}
	
	return studentTableData;
};

/**
 * Reset the table back to the original value in the content
 */
Table.prototype.reset = function() {
	//the message that asks the student if they are sure they want to reset the table
	var are_you_sure_you_want_reset = this.view.getI18NString('are_you_sure_you_want_reset', 'TableNode');
	
	//ask the student if they are sure they want to reset
	var answer = confirm(are_you_sure_you_want_reset);
	
	if(answer) {
		//the student is sure they want to reset
		
		//get the original table values from the content
		var tableData = this.content.tableData;
		
		//check if there is a populatePreviousWorkNodeId
		var populatePreviousWorkNodeId = this.node.populatePreviousWorkNodeId;
		
		if(populatePreviousWorkNodeId != null && populatePreviousWorkNodeId != "") {
			//there is a populatePreviousWorkNodeId
			
			//get the latest work from the populatePreviousWorkNodeId
			var previousWorkState = this.view.getState().getLatestWorkByNodeId(populatePreviousWorkNodeId);
			
			if(previousWorkState != null && previousWorkState != "") {
				//use the data from this populatePreviousWorkNodeId to reset the table
				tableData = previousWorkState.tableData;		
			}
		}
		
		this.numColumns = this.content.numColumns;
		this.numRows = this.content.numRows;
		
		//loop through all the columns
		for(var x=0; x<this.numColumns; x++) {
			
			//loop through all the rows
			for(var y=0; y<this.numRows; y++) {
				/*
				 * set the value in the cell back to the original value whether from the 
				 * content or a previous step
				 */
				$('#tableCell_' + x + '-' + y).val(tableData[x][y].text);
			}
		}
		
		//notify this Table object that the student has changed the table
		this.studentTableChanged();
		
		//save the student table data with the reset table
		this.save();
		
		//render the table again to reflect the reset table
		this.render();
	}
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
		//tell the student that the table has changed so they should click the make graph button
		var table_has_changed_click_make_graph = this.view.getI18NString('table_has_changed_click_make_graph', 'TableNode');
		
		/*
		 * display the message to tell the student to click the
		 * 'Make Graph' button to make the graph with the new
		 * table data
		 */
		this.displayGraphMessage(' <font color="red">' + table_has_changed_click_make_graph + '</font>');
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
	
	if(this.isGraphingEnabled()) {
		//tell the student the table has changed so they should click the make graph button
		var table_has_changed_click_make_graph = this.view.getI18NString('table_has_changed_click_make_graph', 'TableNode');
		
		/*
		 * display the message to tell the student to click the
		 * 'Make Graph' button to make the graph with the new
		 * table data
		 */
		this.displayGraphMessage(' <font color="red">' + table_has_changed_click_make_graph + '</font>');
	}
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
			event.data.thisTable.studentGraphOptionsChanged();
		});
		
		selectYAxis.change({thisTable:this}, function(event) {
			event.data.thisTable.studentGraphOptionsChanged();
		});

		if (this.content.graphOptions.graphType == "scatterPlotbySeries"){
			var selectCAxis = $('<select id="studentSelectCAxis">');
			selectCAxis.change({thisTable:this}, function(event) {
				event.data.thisTable.studentGraphOptionsChanged();
			});
		}
		
		
		//loop through all the columns
		for(var z=0; z<this.numColumns; z++) {
			//get a column header
			var columnHeader = this.getColumnHeaderByIndex(z);
			
			//add this column header to the x and y drop down
			selectXAxis.append($('<option>').attr('value', z).text(columnHeader));
			selectYAxis.append($('<option>').attr('value', z).text(columnHeader));
			if (this.content.graphOptions.graphType == "scatterPlotbySeries"){
				selectCAxis.append($('<option>').attr('value', z).text(columnHeader));
			}
		}
		
		var x_axis = this.view.getI18NString('x_axis', 'TableNode');
		var y_axis = this.view.getI18NString('y_axis', 'TableNode');
		
		//add the labels and drop downs for the x and y axis
		$('#graphOptionsDiv').append(x_axis + ': ');
		$('#graphOptionsDiv').append(selectXAxis);
		$('#graphOptionsDiv').append('<br>');
		$('#graphOptionsDiv').append(y_axis + ': ');
		$('#graphOptionsDiv').append(selectYAxis);

		if (this.content.graphOptions.graphType == "scatterPlotbySeries"){
			//var c_axis = this.view.getI18NString('c_axis', 'TableNode');
			$('#graphOptionsDiv').append('<br>');
			$('#graphOptionsDiv').append('Color by: ');
			$('#graphOptionsDiv').append(selectCAxis);
		}
		
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
							} else if (columnAxis == "c" && this.content.graphOptions.graphType == "scatterPlotbySeries"){
								selectCAxis.val(columnIndex);
							}
						}
					}
				}
			}
		}
	}
	
	//get who will set the axes limits
	var graphWhoSetAxesLimitsType = this.content.graphOptions.graphWhoSetAxesLimitsType;
	
	if(graphWhoSetAxesLimitsType != null) {
		if(graphWhoSetAxesLimitsType == 'auto') {
			/*
			 * axes limits will be set automatically by google so
			 * we do not need to display the input elements to
			 * select the axes limits
			 */
		} else if(graphWhoSetAxesLimitsType == 'authorSelect') {
			/*
			 * the author has specified the axes limits so
			 * we do not need to display the input elements to
			 * select the axes limits
			 */
		} else if(graphWhoSetAxesLimitsType == 'studentSelect') {
			//get the axes limits inputs
			var xMinInput = $('<input id="studentGraphXMinInput" size="2">');
			var xMaxInput = $('<input id="studentGraphXMaxInput" size="2">');
			var yMinInput = $('<input id="studentGraphYMinInput" size="2">');
			var yMaxInput = $('<input id="studentGraphYMaxInput" size="2">');
			
			//set the change event to update the graphOptionsChanged flag
			xMinInput.change({thisTable:this}, function(event) {
				event.data.thisTable.studentGraphOptionsChanged();
			});
			
			//set the change event to update the graphOptionsChanged flag
			xMaxInput.change({thisTable:this}, function(event) {
				event.data.thisTable.studentGraphOptionsChanged();
			});
			
			//set the change event to update the graphOptionsChanged flag
			yMinInput.change({thisTable:this}, function(event) {
				event.data.thisTable.studentGraphOptionsChanged();
			});
			
			//set the change event to update the graphOptionsChanged flag
			yMaxInput.change({thisTable:this}, function(event) {
				event.data.thisTable.studentGraphOptionsChanged();
			});
			
			if($('#graphOptionsDiv').html() != '') {
				//there is already some content in the graphOptionsDiv so we will add a new line
				$('#graphOptionsDiv').append('<br>');
			}

			var x_min = this.view.getI18NString('x_min', 'TableNode');
			var x_max = this.view.getI18NString('x_max', 'TableNode');
			var y_min = this.view.getI18NString('y_min', 'TableNode');
			var y_max = this.view.getI18NString('y_max', 'TableNode');
			
			//insert the input elements into the div
			$('#graphOptionsDiv').append(x_min + ': ');
			$('#graphOptionsDiv').append(xMinInput);
			$('#graphOptionsDiv').append('<br>');
			$('#graphOptionsDiv').append(x_max + ': ');
			$('#graphOptionsDiv').append(xMaxInput);
			$('#graphOptionsDiv').append('<br>');
			$('#graphOptionsDiv').append(y_min + ': ');
			$('#graphOptionsDiv').append(yMinInput);
			$('#graphOptionsDiv').append('<br>');
			$('#graphOptionsDiv').append(y_max + ': ');
			$('#graphOptionsDiv').append(yMaxInput);
			$('#graphOptionsDiv').append('<br>');
			
			//populate the axes limits input values
			if(latestState != null) {
				//get the graph options from the latest student work
				var graphOptions = latestState.graphOptions;
				
				if(graphOptions != null && graphOptions.axesLimits != null) {
					var axesLimits = graphOptions.axesLimits;
					
					//set the values into the inputs
					$('#studentGraphXMinInput').val(axesLimits.xMin);
					$('#studentGraphXMaxInput').val(axesLimits.xMax);
					$('#studentGraphYMinInput').val(axesLimits.yMin);
					$('#studentGraphYMaxInput').val(axesLimits.yMax);
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

			if (this.content.graphOptions.graphType == "scatterPlotbySeries"){
				var cColumnIndex = $('#studentSelectCAxis').val();
				//create the object for the y axis
				var cColumnObject = {
					columnIndex:cColumnIndex,
					columnAxis:'c'
				};
				//put the objects in an array
				result = [xColumnObject, yColumnObject, cColumnObject];
			} else {
				//put the objects in an array
				result = [xColumnObject, yColumnObject];	
			}
			
			
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
Table.prototype.makeGraph = function(graphDiv, tableData, graphOptions, isRenderGradingView) {
	if(graphDiv == null) {
		//the default div id to make the graph in
		graphDiv = $('#graphDiv');
		
		//show the graph div that will display the graph
		graphDiv.show();
	}
	
	//get the graph div id
	var divId = graphDiv.attr('id');
	
	//get the mode e.g. run, grading, authoring
	var mode = this.view.config.getConfigParam('mode');
	
	//clear the graph div id to remove any existing graph
	graphDiv.html('');
	
	var data = null;
	
	try {
		if (this.content.graphOptions.graphType == "scatterPlotbySeries"){
			data = this.getGoogleDataTableForSeries(tableData, graphOptions);
		} else {
			/*
			 * get the table data in the format google wants it in.
			 * we store it in Array[x][y] and google wants it in
			 * Array[y][x].
			 */
			var dataInGoogleFormat = this.getDataInGoogleFormat(tableData, graphOptions);
			
			//create the data
			data = google.visualization.arrayToDataTable(dataInGoogleFormat);
		}
	} catch(e) {
		/*
		 * the message that says there was an error making the graph because
		 * the data in the table is invalid
		 */
		var error_data_in_table_invalid = this.view.getI18NString('error_data_in_table_invalid', 'TableNode');
		
		//inform the student that the data in the table is invalid
		this.displayGraphMessage(' <font color="red">' + error_data_in_table_invalid + '</font>');
	}
	
	if((mode == null || mode == 'run') && !isRenderGradingView && this.content.graphOptions != null && this.content.graphOptions.graphWhoSetAxesLimitsType == 'studentSelect') {
		/*
		 * the student is supposed to set the axes limits values so
		 * we will check whether the student has entered valid values
		 * into the axes limits
		 */
		var studentEnteredValidAxesLimits = this.checkStudentEnteredAxesLimits();
		
		if(!studentEnteredValidAxesLimits) {
			//the message that says there was an error so we were unable to draw the chart
			var error_unable_to_draw_chart = this.view.getI18NString('error_unable_to_draw_chart', 'TableNode');
			
			//inform the student that we were unable to draw the chart
			this.displayGraphMessage(' <font color="red">' + error_unable_to_draw_chart + '</font>');
			
			return;
		}
	}
	
	if(data != null) {
		var chart = null;
		
		//get the options that will be used to draw the chart
		var options = this.getOptions(tableData, graphOptions);
		
		var graphType = null;
		
		if(graphOptions != null) {
			//get the graph type from the passed in graph options
			graphType = graphOptions.graphType;
		} else if(this.content.graphOptions != null) {
			//get the graph type from the content
			graphType = this.content.graphOptions.graphType; //change this to look at graphOptions?
		}
		
		if(graphType != null) {
			if(graphType == 'scatterPlot') {
				chart = new google.visualization.ScatterChart(graphDiv[0]);
			} else if(graphType == 'scatterPlotbySeries') {
				chart = new google.visualization.ScatterChart(graphDiv[0]);
			} else if(graphType == 'lineGraph') {
				chart = new google.visualization.LineChart(graphDiv[0]);
			} else if(graphType == 'barGraph') {
				chart = new google.visualization.ColumnChart(graphDiv[0]);
			} else if(graphType == 'pieGraph') {
				chart = new google.visualization.PieChart(graphDiv[0]);
			}
		}

		try {
			//tell google to draw the graph
			chart.draw(data, options);
			this.graphRendered = true;
			this.clearGraphMessage();
		} catch(e) {
			//the message that says there was an error so we were unable to draw the chart
			var error_unable_to_draw_chart = this.view.getI18NString('error_unable_to_draw_chart', 'TableNode');
			
			//inform the student that we were unable to draw the chart
			this.displayGraphMessage(' <font color="red">' + error_unable_to_draw_chart + '</font>');
		}
	}
};

/**
 * Create the options object that will be used to draw the chart
 * @param tableData the table data
 * @param graphOptions (optional) the graph options that contain fields such 
 * as the graphWhoSetAxesLimitsType. this argument will be 
 * passed in when called from the grading tool. the student vle
 * does not need to provide this argument.
 * @returns the options used to draw the chart
 */
Table.prototype.getOptions = function(tableData, graphOptions) {
	var options = {};
	
	//get the column indexes we will graph
	var columnIndexesToGraph = this.getColumnIndexesToGraph(graphOptions);
	
	var hTitle = '';
	var vTitle = '';
	
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
	
	//get the graph options from the content if it was not passed in
	if(graphOptions == null) {
		graphOptions = this.content.graphOptions;
	}
	
	//get who is setting the axes limits auto, authorSelect, or studentSelect
	var graphWhoSetAxesLimitsType = graphOptions.graphWhoSetAxesLimitsType;
	
	if(graphWhoSetAxesLimitsType != null) {
		if(graphWhoSetAxesLimitsType == 'auto') {
			/*
			 * create the options to tell google how to display the graph.
			 * the min/max values will be automatically calculated by google.
			 */
			options = {
				title: hTitle + ' vs. ' + vTitle,
				hAxis: {title: hTitle},
				vAxis: {title: vTitle},
				forceIFrame: false
			};
		} else if(graphWhoSetAxesLimitsType == 'authorSelect') {
			var xMin = null;
			var xMax = null;
			var yMin = null;
			var yMax = null;
			
			if(graphOptions.axesLimits != null) {
				//get the min/max values that the author has specified
				xMin = parseFloat(graphOptions.axesLimits.xMin);
				xMax = parseFloat(graphOptions.axesLimits.xMax);
				yMin = parseFloat(graphOptions.axesLimits.yMin);
				yMax = parseFloat(graphOptions.axesLimits.yMax);
			}
			
			var hAxis = {
				title: hTitle,
				viewWindowMode:'explicit',
				viewWindow:{}
			};

			//set the x min if it is a valid number
			if(xMin != null && !isNaN(xMin)) {
				hAxis.viewWindow.min = xMin;
			}
			
			//set the x max if it is a valid number
			if(xMax != null && !isNaN(xMax)) {
				hAxis.viewWindow.max = xMax;
			}
			
			var vAxis = {
				title: vTitle,
				viewWindowMode:'explicit',
				viewWindow:{}
			};
			
			//set the y min if it is a valid number
			if(yMin != null && !isNaN(yMin)) {
				vAxis.viewWindow.min = yMin;
			}
			
			//set the y max if it is a valid number
			if(yMax != null && !isNaN(yMax)) {
				vAxis.viewWindow.max = yMax;
			}
			
			//create the options to tell google how to display the graph
			options = {
				title: hTitle + ' vs. ' + vTitle,
				hAxis: hAxis,
				vAxis: vAxis,
				forceIFrame: false
			};
		} else if(graphWhoSetAxesLimitsType == 'studentSelect') {
			//get axes limits from 
			
			var xMin = null;
			
			//get the x min value the student entered if it is available
			var xMinInputVal = $('#studentGraphXMinInput').val();

			if(xMinInputVal != null && !isNaN(parseFloat(xMinInputVal))) {
				//use the student entered value
				xMin = parseFloat(xMinInputVal);
			} else if(graphOptions.axesLimits != null && graphOptions.axesLimits.xMin != null && !isNaN(parseFloat(graphOptions.axesLimits.xMin))) {
				//get the x min from the graph options
				xMin = parseFloat(graphOptions.axesLimits.xMin);
			}
			
			var xMax = null;
			
			//get the x max value the student entered if it is available
			var xMaxInputVal = $('#studentGraphXMaxInput').val();
			
			if(xMaxInputVal != null && !isNaN(parseFloat(xMaxInputVal))) {
				//use the student entered value
				xMax = parseFloat(xMaxInputVal);
			} else if(graphOptions.axesLimits != null && graphOptions.axesLimits.xMax != null && !isNaN(parseFloat(graphOptions.axesLimits.xMax))) {
				//get the x max from the graph options
				xMax = parseFloat(graphOptions.axesLimits.xMax);
			}
			
			var yMin = null;
			
			//get the y min value the student entered if it is available
			var yMinInputVal = $('#studentGraphYMinInput').val();
			
			if(yMinInputVal != null && !isNaN(parseFloat(yMinInputVal))) {
				//use the student entered value
				yMin = parseFloat(yMinInputVal);
			} else if(graphOptions.axesLimits != null && graphOptions.axesLimits.yMin != null && !isNaN(parseFloat(graphOptions.axesLimits.yMin))) {
				//get the y min from the graph options
				yMin = parseFloat(graphOptions.axesLimits.yMin);
			}
			
			var yMax = null;
			
			//get the y max value the student entered if it is available
			var yMaxInputVal = $('#studentGraphYMaxInput').val();
			
			if(yMaxInputVal != null && !isNaN(parseFloat(yMaxInputVal))) {
				//use the student entered value
				yMax = parseFloat(yMaxInputVal);
			} else if(graphOptions.axesLimits != null && graphOptions.axesLimits.yMax != null && !isNaN(parseFloat(graphOptions.axesLimits.yMax))) {
				//get the y max from the graph options
				yMax = parseFloat(graphOptions.axesLimits.yMax);
			}
			
			//create the horizontal axis attributes
			var hAxis = {
				title: hTitle,
				viewWindowMode:'explicit',
				viewWindow:{}
			};
			
			if(xMin != null && !isNaN(xMin)) {
				//set the x min
				hAxis.viewWindow.min = xMin;
			}
			
			if(xMax != null && !isNaN(xMax)) {
				//set the x max
				hAxis.viewWindow.max = xMax;
			}
			
			//create the vertical axis attributes
			var vAxis = {
				title: vTitle,
				viewWindowMode:'explicit',
				viewWindow:{}
			};
			
			if(yMin != null && !isNaN(yMin)) {
				//set the y min
				vAxis.viewWindow.min = yMin;
			}
			
			if(yMax != null && !isNaN(yMax)) {
				//set the y max
				vAxis.viewWindow.max = yMax;
			}
			
			//create the options to tell google how to display the graph
			options = {
				title: hTitle + ' vs. ' + vTitle,
				hAxis: hAxis,
				vAxis: vAxis,
				forceIFrame: false
			};
		}
	}
	
	if(graphOptions.title != null) {
		//get the title from the graph options
		options.title = graphOptions.title;
	} else if(this.isDropDownTitleEnabled()) {
		/*
		 * drop down title is enabled so we will use the the selected
		 * title as the title for the graph
		 */
		options.title = this.getDropDownTitleSelected();
	}
	
	return options;
};

/**
 * Check if the values the student entered into the axes limits
 * are valid
 * @return whether all the axes limits values are valid
 */
Table.prototype.checkStudentEnteredAxesLimits = function() {
	var result = true;
	
	//a message to display to the student if there are any errors
	var message = '';
	
	//get the x min value the student entered
	var xMinInputVal = $('#studentGraphXMinInput').val();
	
	if(xMinInputVal == null || isNaN(parseFloat(xMinInputVal))) {
		var invalid_x_min = this.view.getI18NString('invalid_x_min', 'TableNode');
		
		result = false;
		message += '\n' + invalid_x_min;
	}
	
	//get the x max value the student entered
	var xMaxInputVal = $('#studentGraphXMaxInput').val();
	
	if(xMaxInputVal == null || isNaN(parseFloat(xMaxInputVal))) {
		var invalid_x_max = this.view.getI18NString('invalid_x_max', 'TableNode');
		
		result = false;
		message += '\n' + invalid_x_max;
	}
	
	//get the y min value the student entered
	var yMinInputVal = $('#studentGraphYMinInput').val();
	
	if(yMinInputVal == null || isNaN(parseFloat(yMinInputVal))) {
		var invalid_y_min = this.view.getI18NString('invalid_y_min', 'TableNode');
		
		result = false;
		message += '\n' + invalid_y_min;
	}
	
	//get the y max value the student entered
	var yMaxInputVal = $('#studentGraphYMaxInput').val();
	
	if(yMaxInputVal == null || isNaN(parseFloat(yMaxInputVal))) {
		var invalid_y_max = this.view.getI18NString('invalid_y_max', 'TableNode');
		
		result = false;
		message += '\n' + invalid_y_max;
	}
	
	if(message != '') {
		//the message that says there were errors that need to be fixed
		var error_you_must_fix = this.view.getI18NString('error_you_must_fix', 'TableNode');
		
		message = error_you_must_fix + '\n' + message;
		alert(message);
	}
	
	return result;
};

/**
 *	When the graph type is a scatter plot by series will reorganize the table
 *  so that the y-axis variable is split into multiple series, depending on the
 *	value of the "color" columns, for example
 *   | time |  distance  |  type
 *   |     1|           3|     a
 *   |     2|           5|     a
 *   |     1|           2|     b
 *   |     4|          10|     b
 *
 *   will become:
 *   | time |  distance-a|  distance-b
 *   |     1|           3|     2
 *   |     2|           5|     null
 *   |     4|        null|     b
 *   
 */
Table.prototype.getGoogleDataTableForSeries = function(tableData, graphOptions) {
	var dataInGoogleFormat = this.getDataInGoogleFormat(tableData, graphOptions);
	var data = new google.visualization.DataTable();
	data.addColumn('number', dataInGoogleFormat[0][0])
	// get unique values of "color" column
	var clevels = [];
	for (var i = 1; i < dataInGoogleFormat.length; i++){
		if (clevels.indexOf(dataInGoogleFormat[i][2]) == -1){
			clevels.push(dataInGoogleFormat[i][2])
		}
	}
	// create a column for each level
	for (var c = 0; c < clevels.length; c++){
		data.addColumn('number', dataInGoogleFormat[0][2]+" = "+clevels[c]);
	}
	// iterate through rows update appropriate cell
	for (i = 1; i < dataInGoogleFormat.length; i++){
		// what is series value of this data point?
		var cval = dataInGoogleFormat[i][2];
		var cindex = clevels.indexOf(cval);
		// construct row adding y value at cindex
		if (!isNaN(dataInGoogleFormat[i][0])){
			var row = [dataInGoogleFormat[i][0]];
			var found_value = false;
			for (c = 0; c < clevels.length; c++){
				if (c == cindex){
					if (!isNaN(dataInGoogleFormat[i][1])){
						row.push(dataInGoogleFormat[i][1]);
						found_value = true;
					}
				} else {
					row.push(null);
				}
			}
			if (found_value) data.addRow(row);
		}
	}
	return data;
}

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
 * google wants it like this -- yeah because this makes more sense, can search arr[0] for header (JV)
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
	
	var numRows = 0;
	var numColumns = 0;
	
	if(tableData != null) {
		/*
		 * tableData was passed into this function so we will retrieve
		 * the number of columns from the tableData
		 */
		numColumns = tableData.length;
	} else {
		numColumns = this.numColumns;
	}
	
	if(tableData != null) {
		/*
		 * tableData was passed into this function so we will retrieve
		 * the number of rows from the tableData
		 */
		if(tableData.length > 0) {
			numRows = tableData[0].length;
		}
	} else {
		numRows = this.numRows;
	}
	
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
	for(var y=0; y<numRows; y++) {
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
			for(var r=0; r<numRows; r++) {
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
	console.log(this.content);
	if(this.content.graphOptions != null) {
		//set the enable graphing value into the graphOptions object
		graphOptions.enableGraphing = this.content.graphOptions.enableGraphing;
		
		//set the graph type into the graphOptions object
		graphOptions.graphType = this.content.graphOptions.graphType;
		
		//set the graphSelectAxesType into the graphOptions object
		graphOptions.graphSelectAxesType = this.content.graphOptions.graphSelectAxesType;
		
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
			
			if (this.content.graphOptions.graphType == "scatterPlotbySeries"){
				var cColumnIndex = parseInt($('#studentSelectCAxis').val());
				//create the object to remember the column for the y axis
				var cColumnObject = {
					columnIndex:cColumnIndex,
					columnAxis:'c'
				};
				columnToAxisMappings.push(cColumnObject);
			}

			//put the array into the graph options object
			graphOptions.columnToAxisMappings = columnToAxisMappings;
		} else if(this.content.graphOptions.graphSelectAxesType == 'authorSelect') {
			//get the column graph axis values from the content
			graphOptions.columnToAxisMappings = this.content.graphOptions.columnToAxisMappings;
		}
		
		if(this.content.graphOptions.graphWhoSetAxesLimitsType != null) {
			//set graphWhoSetAxesLimitsType
			graphOptions.graphWhoSetAxesLimitsType = this.content.graphOptions.graphWhoSetAxesLimitsType;
		}
		
		if(this.content.graphOptions.graphWhoSetAxesLimitsType == 'authorSelect') {
			//copy the axes limits from the content
			graphOptions.axesLimits = this.content.graphOptions.axesLimits;
		} else if(this.content.graphOptions.graphWhoSetAxesLimitsType == 'studentSelect') {
			//get the axes limits from the values the student entered into the inputs
			graphOptions.axesLimits = {};
			graphOptions.axesLimits.xMin = $('#studentGraphXMinInput').val();
			graphOptions.axesLimits.xMax = $('#studentGraphXMaxInput').val();
			graphOptions.axesLimits.yMin = $('#studentGraphYMinInput').val();
			graphOptions.axesLimits.yMax = $('#studentGraphYMaxInput').val();
		}
	} 
	
	return graphOptions;
};

/**
 * Check if the graph was previously rendered
 * @latestState the latest node state for this step
 * @return whether the student previously made the graph with
 * the latest table data
 */
Table.prototype.isGraphPreviouslyRendered = function(latestState) {
	var graphPreviouslyRendered = false;
	
	if(latestState == null) {
		//get the latest state
		latestState = this.getLatestState();		
	}
	
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

/**
 * Process the tag maps and obtain the results
 * @return an object containing the results from processing the
 * tag maps. the object contains three fields
 * enableStep
 * message
 * workToImport
 */
Table.prototype.processTagMaps = function() {
	var enableStep = true;
	var message = '';
	var workToImport = [];
	
	//the tag maps
	var tagMaps = this.node.tagMaps;
	
	//check if there are any tag maps
	if(tagMaps != null) {
		
		//loop through all the tag maps
		for(var x=0; x<tagMaps.length; x++) {
			
			//get a tag map
			var tagMapObject = tagMaps[x];
			
			if(tagMapObject != null) {
				//get the variables for the tag map
				var tagName = tagMapObject.tagName;
				var functionName = tagMapObject.functionName;
				var functionArgs = tagMapObject.functionArgs;
				
				if(functionName == "importWork") {
					//get the work to import
					workToImport = this.node.getWorkToImport(tagName, functionArgs);
				} else if(functionName == "showPreviousWork") {
					//show the previous work in the previousWorkDiv
					this.node.showPreviousWork($('#previousWorkDiv'), tagName, functionArgs);
				} else if (functionName == "importWorkFromBox2d"){
					//get the work to import
					var bstate = this.node.getWorkToImport(tagName, functionArgs)[0];
					if ( bstate instanceof Box2dModelState && typeof bstate.response !== "undefined" && typeof bstate.response.tableData !== "undefined"){
						var ptableData = bstate.response.tableData;
						// must copy all values in table so that we don't change them when we go back to box2d
						var tableData = [];
						for (var i = 0; i < ptableData.length; i++){
							tableData[i] = [];
							for (var j = 0; j < ptableData[i].length; j++){
								tableData[i][j] = {};
								for (var key in ptableData[i][j]){
									tableData[i][j][key] = ptableData[i][j][key];  //copy values
								}
							}
						}
						
						var showTestedMassValuesOnly = functionArgs[0] == "true" ||  functionArgs[0] == "1" ? true: false;
						var showTestedLiquidValuesOnly = functionArgs[1] == "true" ||  functionArgs[1] == "1" ? true: false;
						var arrColumnNamesToUse = functionArgs.length > 2 ? functionArgs[2].split(/ *, */) : [];
						// if showTestedValuesOnly make any values associated with mass or volume correspond to test on scale or beaker
						if (showTestedLiquidValuesOnly){
							var tested_in_any_beaker = [];
							for (var j = 1; j < tableData[0].length; j++) tested_in_any_beaker[j-1] = false;

							for (var i = tableData.length-1; i >= 0; i--){
								if (tableData[i][0].text.substr(0,10) == "Tested_in_"){
									var liquid_name = tableData[i][0].text.substr(10);
									for (var j = 1; j < tableData[i].length; j++){
										// if this object was not tested remove values in other columns associated with this liquid
										if (tableData[i][j].text == 0){
											for (var k = 0; k < tableData.length; k++){
												if (tableData[k][0].text.substr(tableData[k][0].text.length - liquid_name.length) == liquid_name && k != i){
													tableData[k][j].text = NaN;
												}
											}
										} else {
											tested_in_any_beaker[j-1] = true;
										}
									}
								}
							}
							// now we know for each row whether object has been tested in any beaker
							// go through each tested_in_any_beaker and update volume
							for (var t = 0; t < tested_in_any_beaker.length; t++){
								j = t + 1;
								if (tested_in_any_beaker[t] == 0){
									for (var k = 0; k < tableData.length; k++){
										if (tableData[k][0].text.substr(tableData[k][0].text.length - 6) == "Volume" || tableData[k][0].text.substr(tableData[k][0].text.length - 7) == "Density"){
											tableData[k][j].text = NaN;
										}
									}
								}
							}
						}
						if (showTestedMassValuesOnly){
							for (var i = tableData.length-1; i >= 0; i--){
								if (tableData[i][0].text.substr(0,15) == "Tested_on_Scale"){
									for (var j = 1; j < tableData[i].length; j++){
										// if this object was not tested remove values in other columns associated with this liquid
										if (tableData[i][j].text == 0){
											for (var k = 0; k < tableData.length; k++){
												if (tableData[k][0].text.substr(tableData[k][0].text.length - 4) == "Mass" || tableData[k][0].text.substr(tableData[k][0].text.length - 7) == "Density"){
													tableData[k][j].text = NaN;
												}
											}
										}
									}
								}
							}
						}
						// remove "tested in variables"
						for (var i = tableData.length-1; i >= 0; i--){
							if (tableData[i][0].text.substr(0,6) == "Tested"){
								tableData.splice(i,1);
							}
						}
						// remove "id if we are not showing previous work"
						if ($("#previousWorkDiv").children().length == 0){
							for (var i = tableData.length-1; i >= 0; i--){
								if (tableData[i][0].text=="id"){
									tableData.splice(i,1);
								}
							}
						}
						// use spaces instead of underscores
						for (var i = tableData.length-1; i >= 0; i--){
							tableData[i][0].text = tableData[i][0].text.replace(/_/g, " ");
						}
						// use only specified column names
						if (arrColumnNamesToUse.length > 0){
							var ntableData = [];
							for (var c = arrColumnNamesToUse.length-1; c >= 0; c--){
								var colName = arrColumnNamesToUse[c];
								for (var i = tableData.length-1; i >= 0; i--){
									if (tableData[i][0].text.match(colName) != null){
										//console.log(colName,"in?", tableData[i][0].text, "because",tableData[i][0].text.match(colName));
										ntableData.splice(0, 0, tableData.splice(i,1)[0]);
									}
								}
							}
							tableData = ntableData;
						}

						// round numbers
						for (var i = tableData.length-1; i >= 0; i--){
							for (var j = 1; j < tableData[i].length; j++){
								if (!isNaN(tableData[i][j].text)){
									tableData[i][j].text = Math.round(tableData[i][j].text*100)/100;
								}
							}
						}
						var tableState = {
							"graphOptions":{},
							"graphRendered":false,
							"response":"",
							"tableData":tableData,
							"tableOptions":{
								"numColumns":tableData.length,
								"numRows":tableData[0].length,
								"title":null
							}
						}
						workToImport.push(tableState);
					}
					delete bstate;
				}
			}
		}
	}
	
	if(message != '') {
		//message is not an empty string so we will add a new line for formatting
		message += '<br>';
	}
	
	//put the variables in an object so we can return multiple variables
	var returnObject = {
		enableStep:enableStep,
		message:message,
		workToImport:workToImport
	};
	
	return returnObject;
};

/**
 * Get whether the drop down title is enabled for this step
 */
Table.prototype.isDropDownTitleEnabled = function() {
	var enabled = false;
	
	if(this.content.dropDownTitleOptions != null) {
		if(this.content.dropDownTitleOptions.enableDropDownTitle) {
			enabled = true;
		}
	}
	
	return enabled;
};

/**
 * Get all the drop down titles
 */
Table.prototype.getDropDownTitles = function() {
	var dropDownTitles = null;
	
	if(this.content.dropDownTitleOptions != null) {
		if(this.content.dropDownTitleOptions.dropDownTitles != null) {
			dropDownTitles = this.content.dropDownTitleOptions.dropDownTitles;
		}
	}
	
	return dropDownTitles;
};

/**
 * Get the drop down title the student has selected
 */
Table.prototype.getDropDownTitleSelected = function() {
	var dropDownTitleSelected = null;
	
	if($('#dropDownTitleSelect option:selected') != null) {
		dropDownTitleSelected = $('#dropDownTitleSelect option:selected').text();		
	}
	
	return dropDownTitleSelected;
};

/**
 * The student has changed which drop down title is selected
 */
Table.prototype.dropDownTitleHasChanged = function() {
	this.dropDownTitleChanged = true;
};

/**
 * Check whether this step allows the student to add rows
 */
Table.prototype.allowStudentToAddRows = function() {
	var result = false;
	
	if(this.content.studentOptions != null) {
		if(this.content.studentOptions.allowStudentToAddRows) {
			//the student is allowed to add rows
			result = true;
		}
	}
	
	return result;
};

/**
 * Check whether this step allows the student to add columns
 */
Table.prototype.allowStudentToAddColumns = function() {
	var result = false;
	
	if(this.content.studentOptions != null) {
		if(this.content.studentOptions.allowStudentToAddColumns) {
			//the student is allowed to add columns
			result = true;
		}
	}
	
	return result;
};

/**
 * Get the number of columns in the table
 */
Table.prototype.getNumColumns = function() {
	return this.numColumns;
};

/**
 * The student wants to add a new column to the table
 */
Table.prototype.studentAddColumn = function() {
	/*
	 * don't allow students to make more than 50 columns
	 * as a safety measure
	 */ 
	if(this.numColumns < 50) {
		//increment the number of columns
		this.numColumns++;
		
		//set the flag that says the student has changed the table
		this.studentTableChanged();
		
		//save the student table data with the new number of columns
		this.save();
		
		//render the table again to refelect the new number of columns
		this.render();
	}
};

/**
 * The student wants to remove a column from the table
 */
Table.prototype.studentDeleteColumn = function() {
	/*
	 * make sure the student never deletes any of the columns
	 * that were originally authored in the step
	 */
	if(this.numColumns > this.content.numColumns) {
		//the message that asks if they are sure they want to delete the column
		var are_you_sure_delete_column = this.view.getI18NString('are_you_sure_delete_column', 'TableNode');
		
		//ask the student if they are sure they want to delete the column on the right
		var answer = confirm(are_you_sure_delete_column);
		
		if(answer) {
			//decrement the number of columns
			this.numColumns--;
			
			//set the flag that says the student has changed the table
			this.studentTableChanged();
			
			//save the student table data with the new number of columns
			this.save();
			
			//render the table again to reflect the new number of columns
			this.render();			
		}
	} else {
		//the message that says they may not delete an original column that was authored
		var error_may_not_delete_original_columns = this.view.getI18NString('error_may_not_delete_original_columns', 'TableNode');
		
		//they are trying to delete a column that was originally authored
		alert(error_may_not_delete_original_columns);
	}
};

/**
 * Get the number of rows in the table
 */
Table.prototype.getNumRows = function() {
	return this.numRows;
};

/**
 * The student wants to add a new row to the table
 */
Table.prototype.studentAddRow = function() {
	/*
	 * don't allow students to make more than 50 rows
	 * as a safety measure
	 */ 
	if(this.numRows < 50) {
		//increment the number of rows
		this.numRows++;
		
		//set the flag that says the student has changed the table
		this.studentTableChanged();
		
		//save the student table data with the new number of rows
		this.save();
		
		//render the table again to reflect the new number of rows
		this.render();
	}
};

/**
 * The student wants to delete a row from the table
 */
Table.prototype.studentDeleteRow = function() {
	/*
	 * make sure the student never deletes any of the rows
	 * that were originally authored in the step
	 */
	if(this.numRows > this.content.numRows) {
		//the message that asks if they are sure they want to delete the row
		var are_you_sure_delete_row = this.view.getI18NString('are_you_sure_delete_row', 'TableNode');
		
		//ask the student if they are sure they want to delete the bottom row
		var answer = confirm(are_you_sure_delete_row);
		
		if(answer) {
			//decrement the number of rows
			this.numRows--;
			
			//set the flag that says the student has changed the table
			this.studentTableChanged();
			
			//save the student table data with the new number of rows
			this.save();
			
			//render the table again to reflect the new number of rows
			this.render();			
		}
	} else {
		//the message that says they are not allowed to delete an original row that was authored
		var error_may_not_delete_original_rows = this.view.getI18NString('error_may_not_delete_original_rows', 'TableNode');
		
		//they are trying to delete a row that was originally authored
		alert(error_may_not_delete_original_rows);
	}
};

/**
 * Get the table options
 */
Table.prototype.getTableOptions = function() {
	var tableOptions = {};
	
	var title = null;
	
	if(this.isDropDownTitleEnabled()) {
		//get the title from the drop down
		title = this.getDropDownTitleSelected();
	}
	
	tableOptions.title = title;
	
	//set the number of rows and columns
	tableOptions.numRows = this.numRows;
	tableOptions.numColumns = this.numColumns;
	
	return tableOptions;
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