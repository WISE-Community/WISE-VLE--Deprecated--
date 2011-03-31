/**
 * Sets the TemplateNode type as an object of this view
 * 
 * TODO: rename TemplateNode
 */
View.prototype.TableNode = {};

/*
 * Add the name of the common component that this step will use. The
 * common components will be handled by the authoring tool. You will
 * need to create div elements with the appropriate id for the
 * authoring tool to insert the component into. Any additional custom
 * authoring components specific to your step type will be written 
 * by you in the generatePage() function. You may leave the array
 * empty if you are not using any common components.
 * 
 * Here are the available common components
 * 'Prompt'
 * 'LinkTo'
 * 'StudentResponseBoxSize'
 * 'RichTextEditorToggle'
 * 'StarterSentenceAuthoring'
 * 
 * If you use a common components, you must create a div with the
 * appropriate id, here are the respective ids
 * 'promptContainer'
 * (LinkTo does not require a div)
 * 'studentResponseBoxSizeContainer'
 * 'richTextEditorToggleContainer'
 * 'starterSentenceAuthoringContainer'
 * 
 * 
 * TODO: rename TemplateNode
 */
View.prototype.TableNode.commonComponents = [];

/**
 * Generates the authoring page. This function will create the authoring
 * components such as textareas, radio buttons, check boxes, etc. that
 * authors will use to author the step. For example if the step has a
 * text prompt that the student will read, this function will create
 * a textarea that will allow the author to type the text that the
 * student will see. You will also need to populate the textarea with
 * the pre-existing prompt if the step has been authored before.
 * 
 * TODO: rename TemplateNode
 */
View.prototype.TableNode.generatePage = function(view){
	this.view = view;
	
	//get the content of the step
	this.content = this.view.activeContent.getContentJSON();
	
	//get the html element that all the authoring components will be located
	var parent = document.getElementById('dynamicParent');
	
	/*
	 * wipe out the div that contains the authoring components because it
	 * may still be populated with the authoring components from a previous
	 * step the author has been authoring since we re-use the div id
	 */
	parent.removeChild(document.getElementById('dynamicPage'));

	//create a new div that will contain the authroing components
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	
	//create the label for the textarea that the author will write the prompt in
	var promptText = document.createTextNode("Prompt for Student:");
	
	/*
	 * create the textarea that the author will write the prompt in
	 * 
	 * onkeyup will fire the 'templateUpdatePrompt' event which will
	 * be handled in the <new step type name>Events.js file
	 * 
	 * For example if you are creating a quiz step you would look in
	 * your quizEvents.js file.
	 * 
	 * when you add new authoring components you will need to create
	 * new events in the <new step type name>Events.js file and then
	 * create new functions to handle the event
	 */
	var promptTextArea = createElement(document, 'textarea', {id: 'promptTextArea', rows:'5', cols:'85', onkeyup:"eventManager.fire('tableUpdatePrompt')"});
	
	//add the authoring components to the page
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(promptTextArea);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	//get the number of columns and rows
	var numColumns = this.content.numColumns;
	var numRows = this.content.numRows;
	
	//create the input boxes for columns and rows
	var numColumnsText = document.createTextNode('Columns: ');
	var numColumnsInput = createElement(document, 'input', {type: 'input', id: 'numColumnsInput', name: 'numColumnsInput', value: numColumns, size: 10, onchange: 'eventManager.fire("tableUpdateNumColumns")'});
	var numRowsText = document.createTextNode(' Rows: ');
	var numRowsInput = createElement(document, 'input', {type: 'input', id: 'numRowsInput', name: 'numRowsInput', value: numRows, size: 10, onchange: 'eventManager.fire("tableUpdateNumRows")'});
	
	//add the input boxes for columns and rows
	pageDiv.appendChild(numColumnsText);
	pageDiv.appendChild(numColumnsInput);
	pageDiv.appendChild(numRowsText);
	pageDiv.appendChild(numRowsInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	//instructions on what the letters mean in the table UI
	var iText = document.createTextNode('I = Insert Column/Row');
	var dText = document.createTextNode('D = Delete Column/Row');
	var uText = document.createTextNode('U = Uneditable for student');
	
	//add the instructions
	pageDiv.appendChild(iText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(dText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(uText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	
	//get the table data
	var tableData = this.content.tableData;
	
	//create the div that will hold the table
	var tableDiv = createElement(document, 'div', {id: 'authoringTableDiv'});
	
	//add the table
	pageDiv.appendChild(tableDiv);
	pageDiv.appendChild(createBreak());
	
	//generate the authorable table
	var authoringTable = this.generateAuthoringTable();
	
	//add the table
	tableDiv.appendChild(authoringTable);

	//add the page to the parent
	parent.appendChild(pageDiv);
	
	//populate the prompt if this step has been authored before
	this.populatePrompt();
};

/**
 * Generate the authorable table
 */
View.prototype.TableNode.generateAuthoringTable = function() {
	//create the table
	var authoringTable = createElement(document, 'table', {id: 'authoringTable', border:'1'});
	
	//create a header row to display the I (insert) and D (delete) buttons
	var headerTR = createElement(document, 'tr');
	authoringTable.appendChild(headerTR);
	
	//add the upper left cell (0,0) that will be empty
	var headerTD = createElement(document, 'td');
	headerTR.appendChild(headerTD);
	
	//add a td for each column
	for(var x=0; x<this.content.numColumns; x++) {
		headerTD = createElement(document, 'td');
		
		//create the insert and delete buttons
		var insertColumnButton = createElement(document, 'input', {type: 'button', id: 'insertColumnButton_' + x, name: 'insertColumnButton_' + x, value: 'I', onclick: 'eventManager.fire("tableInsertColumn", {x:' + x + '})'});
		var deleteColumnButton = createElement(document, 'input', {type: 'button', id: 'deleteColumnButton_' + x, name: 'deleteColumnButton_' + x, value: 'D', onclick: 'eventManager.fire("tableDeleteColumn", {x:' + x + '})'});
		
		headerTD.appendChild(insertColumnButton);
		headerTD.appendChild(deleteColumnButton);
		
		headerTR.appendChild(headerTD);
	}
	
	//loop through all the rows
	for(var y=0; y<this.content.numRows; y++) {
		
		var tr = createElement(document, 'tr');
		headerTD = createElement(document, 'td');
		
		//create the insert and delete buttons
		var insertRowButton = createElement(document, 'input', {type: 'button', id: 'insertRowButton_' + y, name: 'insertRowButton_' + y, value: 'I', onclick: 'eventManager.fire("tableInsertRow", {y:' + y + '})'});
		var deleteRowButton = createElement(document, 'input', {type: 'button', id: 'deleteRowButton_' + y, name: 'deleteRowButton_' + y, value: 'D', onclick: 'eventManager.fire("tableDeleteRow", {y:' + y + '})'});
		
		headerTD.appendChild(insertRowButton);
		headerTD.appendChild(deleteRowButton);
		
		tr.appendChild(headerTD);
		
		//loop through all the columns
		for(var x=0; x<this.content.numColumns; x++) {
			
			var td = createElement(document, 'td');
			
			var cellText = "";
			var cellUneditable = false;
			
			//get the data for the cell
			var cellData = this.getCellData(this.content.tableData, x, y);
			
			if(cellData != null) {
				if(cellData.text != null) {
					cellText = cellData.text;					
				}
				
				if(cellData.uneditable != null) {
					cellUneditable = cellData.uneditable;					
				}
			}
			
			//create the input box for the cell
			var cellTextInput = createElement(document, 'input', {type: 'input', id: 'cellTextInput_' + x + '-' + y, name: 'cellTextInput_' + x + '-' + y, value: cellText, size: 10, onchange: 'eventManager.fire("tableUpdateCellText", {x:' + x + ', y:' + y + '})'});
			
			//create the checkbox for the cell that determines whether the student can edit the cell or not
			var cellCheckBox = createElement(document, 'input', {type: 'checkbox', id: 'cellUneditableCheckBox_' + x + '-' + y, name: 'cellUneditableCheckBox_' + x + '-' + y, onchange: 'eventManager.fire("tableUpdateCellUneditable", {x:' + x + ', y:' + y + '})'});
			
			if(cellUneditable) {
				cellCheckBox.checked = true;
			}
			
			//label for the 'uneditable' checkbox
			var cellCheckBoxText = document.createTextNode('U');
			
			//add the elements to the td
			td.appendChild(cellTextInput);
			td.appendChild(cellCheckBox);
			td.appendChild(cellCheckBoxText);
			
			tr.appendChild(td);
		}
		
		authoringTable.appendChild(tr);
	}
	
	return authoringTable;
};

/**
 * Refreshes the authoring table by generating it again using
 * the values in the content
 */
View.prototype.TableNode.updateAuthoringTable = function() {
	//generate the authoring table
	var authoringTable = this.generateAuthoringTable();
	
	//clear out the existing table
	$('#authoringTableDiv').html('');
	
	//add the newly generated table
	$('#authoringTableDiv').append(authoringTable);
};

/**
 * Get the cell data for the given x, y cell
 * @param tableData the table data
 * @param x the x coordinate of the cell
 * @param y the y coordinate of the cell
 * @return the cell data or null if not found
 */
View.prototype.TableNode.getCellData = function(tableData, x, y) {
	var cellData = null;
	
	//get the column the cell is in
	var tableColumn = tableData[x];
	
	if(tableColumn != null) {
		
		//get the cell
		var tableCell = tableColumn[y];
		
		if(tableCell != null) {
			cellData = tableCell;
		}
	}
	
	return cellData;
};

/**
 * Update the value of a field for a given cell
 * @param tableData the table data
 * @param x the x coordinate of the cell
 * @param y the y coordinate of the cell
 * @param fieldName the field name
 * @param fieldValue the value to set into the field
 */
View.prototype.TableNode.updateCellDataValue = function(tableData, x, y, fieldName, fieldValue) {
	//get the column
	var tableColumn = tableData[x];
	
	if(tableColumn == null) {
		//column does not exist so we will make it
		tableData[x] = [];
		
		//create a new cell
		tableData[x][y] = this.getCellWithDefaultValues();
		
		//set the value
		tableData[x][y][fieldName] = fieldValue;
	} else {
		var tableCell = tableColumn[y];
		
		if(tableCell == null) {
			//cell does not exist so we will make it
			tableColumn[y] = this.getCellWithDefaultValues();
			
			//set the value
			tableColumn[y][fieldName] = fieldValue;
		} else {
			//set the value
			tableCell[fieldName] = fieldValue;
		}
	}
};

/**
 * Called when the author changes the number of rows
 * @param the new number of rows
 */
View.prototype.TableNode.truncateRows = function(numRows) {
	//get the previous number of rows
	var tableDataNumRows = this.content.numRows;
	
	//get the dif in the number of rows
	var dif = tableDataNumRows - numRows;
	
	if(dif > 0) {
		//we need to remove some rows
		
		//loop through all the columns
		for(var x=0; x<this.content.tableData.length; x++) {
			//get a column
			var tableColumn = this.content.tableData[x];
			
			if(tableColumn != null) {
				//truncate the column down to the new number of rows
				tableColumn.splice(numRows, dif);
			}
		}		
	}
};

/**
 * Called when the author changes the number of columns
 * @param numColumns the new number of columns
 */
View.prototype.TableNode.truncateColumns = function(numColumns) {
	//get the previous number of columns
	var tableDataNumColumns = this.content.numColumns;
	
	//get the dif in the number of columns
	var dif = tableDataNumColumns - numColumns;
	
	if(dif > 0) {
		//we need to remove  some columns
		this.content.tableData.splice(numColumns, dif);		
	}
};

/**
 * Get the array of common components which is an array with
 * string elements being the name of the common component
 * 
 * TODO: rename TemplateNode
 */
View.prototype.TableNode.getCommonComponents = function() {
	return this.commonComponents;
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 * 
 * TODO: rename TemplateNode
 */
View.prototype.TableNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

/**
 * Populate the authoring textarea where the user types the prompt that
 * the student will read
 * 
 * TODO: rename TemplateNode
 */
View.prototype.TableNode.populatePrompt = function() {
	//get the prompt from the content and set it into the authoring textarea
	$('#promptTextArea').val(this.content.prompt);
};

/**
 * Updates the content's prompt to match that of what the user input
 * 
 * TODO: rename TemplateNode
 */
View.prototype.TableNode.updatePrompt = function(){
	/* update content */
	this.content.prompt = document.getElementById('promptTextArea').value;
	
	/*
	 * fire source updated event, this will update the preview
	 */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the number of columns since the author has changed the value
 */
View.prototype.TableNode.updateNumColumns = function(){
	//get the new number of columns
	var numColumns = $('#numColumnsInput').val();
	
	if(numColumns < this.content.numColumns) {
		/*
		 * the number of columns is less than the previous number
		 * of columns so we need to remove some columns
		 */
		this.truncateColumns(numColumns);
	}
	
	//update the number of columns in the content
	this.content.numColumns = numColumns;
	
	//fill in any new cells in the new columns
	this.populateNullCells();
	
	//re-generate the authoring table to reflect the new number of columns
	this.updateAuthoringTable();
	
	//fire source updated event, this will update the preview
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the number of rows since the author has changed the value
 */
View.prototype.TableNode.updateNumRows = function(){
	//get the new number of rows
	var numRows = $('#numRowsInput').val();
	
	if(numRows < this.content.numRows) {
		/*
		 * the number of rows is less than the previous number
		 * of rows so we need to remove some rows
		 */
		this.truncateRows(numRows);
	}
	
	//update the number of rows in the content
	this.content.numRows = numRows;
	
	//fill in any new cells in the new rows
	this.populateNullCells();
	
	//re-generate the authoring table to reflect the new number of rows
	this.updateAuthoringTable();
	
	//fire source updated event, this will update the preview
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the text in the cell
 * @param args an object containing the x and y values of the cell
 * to update
 */
View.prototype.TableNode.updateCellText = function(args){
	//get the x and y values of the cell to update
	var x = args.x;
	var y = args.y;
	
	//get the text in the cell from the authoring table
	var cellTextValue = $('#cellTextInput_' + x + '-' + y).val();
	
	//get the table data
	var tableData = this.content.tableData;
	
	//update the text value in the cell in the content
	this.updateCellDataValue(tableData, x, y, 'text', cellTextValue);
	
	//fire source updated event, this will update the preview
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Update the uneditable value of the cell
 * @param args an object containing the x and y values of the cell
 * to update
 */
View.prototype.TableNode.updateCellUneditable = function(args){
	//get the x and y values of the cell to update
	var x = args.x;
	var y = args.y;
	
	//get the value of the checkbox from the authoring table
	var cellUneditableValue = $('#cellUneditableCheckBox_' + x + '-' + y).attr('checked');
	
	//get the table data
	var tableData = this.content.tableData;
	
	//update the uneditable value in the cell in the content
	this.updateCellDataValue(tableData, x, y, 'uneditable', cellUneditableValue);
	
	//fire source updated event, this will update the preview
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Insert a column into the table
 * @param args an object containing the x position to insert
 * the column into
 */
View.prototype.TableNode.tableInsertColumn = function(args) {
	//get the x position to insert the column into
	var x = args.x;
	
	/*
	 * insert null into the table data as a place holder for the
	 * column we have just inserted
	 */
	this.content.tableData.splice(x, 0, null);
	
	//update the number of columns
	this.content.numColumns++;
	
	//update the number of columns in the authoring columns text input
	$('#numColumnsInput').val(this.content.numColumns);
	
	//fill in the cells of the new column we just inserted
	this.populateNullCells();
	
	//re-generate the authoring table
	this.updateAuthoringTable();
	
	//fire source updated event, this will update the preview
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Delete a column from the table
 * @param args an object containing the x position to delete
 */
View.prototype.TableNode.tableDeleteColumn = function(args) {
	//get the x position to delete the column from
	var x = args.x;
	
	//remove the column
	this.content.tableData.splice(x, 1);
	
	//update the number of columns
	this.content.numColumns--;
	
	//update the number of columns in the authoring columns text input
	$('#numColumnsInput').val(this.content.numColumns);
	
	//re-generate the authoring table
	this.updateAuthoringTable();
	
	//fire source updated event, this will update the preview
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Insert a row into the table
 * @param args an object containing the y position to insert
 */
View.prototype.TableNode.tableInsertRow = function(args) {
	//get the y position to insert the row into
	var y = args.y;
	
	//get the table data
	var tableData = this.content.tableData;
	
	//loop through all the columns
	for(var x=0; x<this.content.numColumns; x++) {
		//add a cell at x, y
		tableData[x].splice(y, 0, this.getCellWithDefaultValues());
	}
	
	//update the number of rows
	this.content.numRows++;
	
	//update the number of rows in the authoring rows text input
	$('#numRowsInput').val(this.content.numRows);
	
	//fill in the cells of the new row we just inserted
	this.populateNullCells();
	
	//re-generate the authoring table
	this.updateAuthoringTable();
	
	//fire source updated event, this will update the preview
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Delete a row into the table
 * @param args an object containing the y position to delete
 */
View.prototype.TableNode.tableDeleteRow = function(args) {
	//get the y position to delete the row from
	var y = args.y;
	
	//get the table data
	var tableData = this.content.tableData;
	
	//loop through all the columns
	for(var x=0; x<this.content.numColumns; x++) {
		//remove the cell at x, y
		tableData[x].splice(y, 1);
	}
	
	//update the number of rows
	this.content.numRows--;
	
	//update the number of rows in the authoring rows text input
	$('#numRowsInput').val(this.content.numRows);
	
	//re-generate the authoring table
	this.updateAuthoringTable();
	
	//fire source updated event, this will update the preview
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Populate any cells with the default cell values if the
 * cell is null
 */
View.prototype.TableNode.populateNullCells = function() {
	//get the table data
	var tableData = this.content.tableData;
	
	//loop through the columns
	for(var x=0; x<this.content.numColumns; x++) {
		
		//try to get the column
		if(tableData[x] == null) {
			//column does not exist so we will make it
			tableData[x] = [];
		}
		
		//loop through all the rows for this column
		for(var y=0; y<this.content.numRows; y++) {
			//try to get the cell
			if(tableData[x][y] == null) {
				//the cell does not exist so we will populate it
				tableData[x][y] = this.getCellWithDefaultValues();				
			}
		}
	}
};

/**
 * Get the default cell object that we will put into the table data
 */
View.prototype.TableNode.getCellWithDefaultValues = function() {
	//create a new cell object
	var newCell = {
			text:"",
			uneditable:false
	};
	
	return newCell;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename template to your new folder name
	 * TODO: rename authorview_template
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/authorview_quiz.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/table/authorview_table.js');
};