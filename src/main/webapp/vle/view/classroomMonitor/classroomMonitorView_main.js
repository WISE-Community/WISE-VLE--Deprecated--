View.prototype.classroomMonitorDispatcher = function(type, args, obj) {
	if(type == 'classroomMonitorConfigUrlReceived') {
		obj.getClassroomMonitorConfig(args[0]);
	} else if(type == 'loadingProjectCompleted') {
		obj.getStudentStatuses();
	}
};

/**
 * Get the classroom monitor config so we can start the classroom monitor
 * @param classroomMonitorConfigUrl the url to retrieve the classroom monitor config
 */
View.prototype.getClassroomMonitorConfig = function(classroomMonitorConfigUrl) {
	//create the classroom monitor model
	this.model = new ClassroomMonitorModel();
	
	//get the classroom monitor config
	var classroomMonitorConfigContent = createContent(classroomMonitorConfigUrl);
	this.config = this.createConfig(classroomMonitorConfigContent);
	
	//load the user and class info
	this.loadUserAndClassInfo(createContent(this.config.getConfigParam('getUserInfoUrl')));
	
	//start the classroom monitor
	this.startClassroomMonitor();
};

/**
 * Start the classroom monitor
 */
View.prototype.startClassroomMonitor = function() {
	//initialize the session
	this.initializeSession();
	
	/*
	 * load the project. when the project loading is completed we will
	 * get the student statuses, get the students online list, and then
	 * start the websocket connection 
	 */
	this.loadProject(this.config.getConfigParam('getContentUrl'), this.config.getConfigParam('getContentBaseUrl'), false);
};


/**
 * Create all the UI elements for the classroom monitor
 */
View.prototype.createClassroomMonitorDisplays = function() {
	this.createClassroomMonitorButtons();
	this.createPauseAllScreensDisplay();
	this.createStudentProgressDisplay();
	this.createStepProgressDisplay();
};


/**
 * Show the pause all screens display
 */
View.prototype.showPauseAllScreensDisplay = function() {
	//hide the other display divs and show the pause all screens div
	$('#studentProgressDisplay').hide();
	$('#stepProgressDisplay').hide();
	$('#pauseAllScreensDisplay').show();
	
	//fix the height so scrollbars display correctly
	this.fixClassroomMonitorDisplayHeight();
};


/**
 * Show the student progress display
 */
View.prototype.showStudentProgressDisplay = function() {
	//hide the other display divs and show the student progress div
	$('#pauseAllScreensDisplay').hide();
	$('#stepProgressDisplay').hide();
	$('#studentProgressDisplay').show();
	
	//fix the height so scrollbars display correctly
	this.fixClassroomMonitorDisplayHeight();
};


/**
 * Show the step progress display
 */
View.prototype.showStepProgressDisplay = function() {
	//hide the other display divs and show the step progress div
	$('#pauseAllScreensDisplay').hide();
	$('#studentProgressDisplay').hide();
	$('#stepProgressDisplay').show();
	
	//fix the height so scrollbars display correctly
	this.fixClassroomMonitorDisplayHeight();
};


/**
 * Create the classroom monitor buttons
 */
View.prototype.createClassroomMonitorButtons = function() {
	//create the pause all screens tool button
	var pauseAllScreensToolButton = $('<input/>').attr({id:'pauseAllScreensButton', type:'button', name:'pauseAllScreensButton', value:'Pause All Screens Tool'});
	
	//create the student progress button
	var studentProgressButton = $('<input/>').attr({id:'studentProgressButton', type:'button', name:'studentProgressButton', value:'Student Progress'});
	
	//create the step progress button
	var stepProgressButton = $('<input/>').attr({id:'stepProgressButton', type:'button', name:'stepProgressButton', value:'Step Progress'});
	
	//set the click event for the pause all screens tool button
	pauseAllScreensToolButton.click({thisView:this}, function(event) {
		var thisView = event.data.thisView;
		
		//show the pause all screens display
		thisView.showPauseAllScreensDisplay();
	});
	
	//set the click event for the student progress button
	studentProgressButton.click({thisView:this}, function(event) {
		var thisView = event.data.thisView;
		
		//show the student progress display
		thisView.showStudentProgressDisplay();
	});
	
	//set the click event for the step progress button
	stepProgressButton.click({thisView:this}, function(event) {
		var thisView = event.data.thisView;
		
		//show the step progress display
		thisView.showStepProgressDisplay();
	});
	
	//add all the buttons to the button div
	$('#classroomMonitorButtonDiv').append(pauseAllScreensToolButton);
	$('#classroomMonitorButtonDiv').append(studentProgressButton);
	$('#classroomMonitorButtonDiv').append(stepProgressButton);
	
	//fix the height so scrollbars display correctly
	this.fixClassroomMonitorDisplayHeight();
};

/**
 * Fix the height of the classroomMonitorIfrm so no scrollbars are displayed
 * for the iframe
 */
View.prototype.fixClassroomMonitorDisplayHeight = function() {
	//get the height of the classroomMonitorIfrm
	var height = $('#classroomMonitorIfrm',window.parent.parent.document).height();
	
	/*
	 * resize the height of the topifrm that contains the classroomMonitorIfrm
	 * so that there will be no scroll bars
	 */
	$('#topifrm', parent.document).height(height);
};

/**
 * Create the pause all screens display
 */
View.prototype.createPauseAllScreensDisplay = function() {
	//create the pause all screens div
	var pauseAllScreensDisplay = $('<div></div>').attr({id:'pauseAllScreensDisplay'});
	
	//add the pause all screens div to the main div
	$('#classroomMonitorMainDiv').append(pauseAllScreensDisplay);
	
	//hide the pause all screens div, we will show it later when necessary
	pauseAllScreensDisplay.hide();
	
	//create the span that will display the pause status
	var pauseScreenStatus = $('<span>').attr({id:'pauseScreenStatus'}).text('Status: Un-Paused');
	
	//add the pause status span
	$('#pauseAllScreensDisplay').append(pauseScreenStatus);
	
	//add a line break
	$('#pauseAllScreensDisplay').append($('<br>'));
	
	//create the pause button
	var pauseButton = $('<input/>').attr({id:'pauseButton', type:'button', name:'pauseButton', value:'Pause'});
	
	//set the click event for the pause button
	pauseButton.click({thisView:this}, function(event) {
		var thisView = event.data.thisView;
		
		//pause the student screens
		thisView.pauseAllScreens();
		
		//set the pause screen status on the classroom monitor to 'Paused'
		thisView.setPauseScreenStatus(true);
	});

	//create the un-pause button
	var unPauseButton = $('<input/>').attr({id:'unPauseButton', type:'button', name:'unPauseButton', value:'Un-Pause'});
	
	//set the click event for the un-pause button
	unPauseButton.click({thisView:this}, function(event) {
		var thisView = event.data.thisView;
		
		//un-pause the student screens
		thisView.unPauseAllScreens();
		
		//set the pause screen status on the classroom monitor to 'Un-Paused'
		thisView.setPauseScreenStatus(false);
	});
	
	//add the pause and un-pause buttons
	$('#pauseAllScreensDisplay').append(pauseButton);
	$('#pauseAllScreensDisplay').append(unPauseButton);
};

/**
 * Set the pause screen status on the classroom monitor
 * @param isPaused boolean value whether the student screens are
 * paused or not
 */
View.prototype.setPauseScreenStatus = function(isPaused) {
	if(isPaused) {
		//student screens are paused
		$('#pauseScreenStatus').text('Status: Paused');
	} else {
		//student screens are not paused
		$('#pauseScreenStatus').text('Status: Un-Paused');
	}
};

/**
 * Create the student progress display
 */
View.prototype.createStudentProgressDisplay = function() {
	//create the student progress div
	var studentProgressDisplay = $('<div></div>').attr({id:'studentProgressDisplay'});
	
	//add the student progress div to the main div
	$('#classroomMonitorMainDiv').append(studentProgressDisplay);
	
	//hide the student progress div, we will show it later when necessary
	studentProgressDisplay.hide();
	
	//create the table to display the students
	var studentProgressDisplayTable = $('<table>').attr({id:'studentProgressDisplayTable'});
	studentProgressDisplayTable.attr('border', '1px');

	//add the table to the student progress div
	$('#studentProgressDisplay').append(studentProgressDisplayTable);
	
	//create the header row
	var headerTR = $('<tr>');
	
	//create the column headers
	var onlineTH = $('<th>').text('Online');
	var studentNameTH = $('<th>').text('Student Name');
	var workgroupIdTH = $('<th>').text('Workgroup Id');
	var periodTH = $('<th>').text('Period');
	var currentStepTH = $('<th>').text('Current Step');
	var timeSpentTH = $('<th>').text('Time Spent On Current Step');
	var projectCompletionTH = $('<th>').text('Project Completion %');
	
	//add the column headers to the header row
	headerTR.append(onlineTH);
	headerTR.append(studentNameTH);
	headerTR.append(workgroupIdTH);
	headerTR.append(periodTH);
	headerTR.append(currentStepTH);
	headerTR.append(timeSpentTH);
	headerTR.append(projectCompletionTH);
	
	//add the header row to the table
	$('#studentProgressDisplayTable').append(headerTR);
	
	//get all the workgroup ids in the class
	var workgroupIds = this.getUserAndClassInfo().getClassmateWorkgroupIds();
	
	if(workgroupIds != null) {
		//loop through all the workgroup ids
		for(var x=0; x<workgroupIds.length; x++) {
			//get a workgroup id
			var workgroupId = workgroupIds[x];
			
			//check if the student is online
			var studentOnline = this.isStudentOnline(workgroupId);
			
			//get the project completion for the student
			var studentCompletion = this.calculateStudentCompletionForWorkgroupId(workgroupId);
			
			//get the usernames for this workgroup
			var userNames = this.userAndClassInfo.getUserNameByUserId(workgroupId);
			
			//get the period the workgroup is in
			var period = this.userAndClassInfo.getClassmatePeriodNameByWorkgroupId(workgroupId);
			
			//get the current step the workgroup is on
			var currentStep = this.getStudentCurrentStepByWorkgroupId(workgroupId);
			
			/*
			 * set the time spent to be blank because it will be updated later when
			 * updateStudentProgressTimeSpentInterval() is called
			 */
			var timeSpent = '&nbsp';
			
			//create the row for the student
			var studentTR = this.createStudentProgressDisplayRow(studentOnline, userNames, workgroupId, period, currentStep, timeSpent, studentCompletion);
			
			if(studentTR != null) {
				//add the the row for this student to the end of the table
				$('#studentProgressDisplayTable tr:last').after(studentTR);				
			}
		}		
	}
	
	//set the interval to update the time spent values every 10 seconds for students that are online 
	setInterval(this.updateStudentProgressTimeSpentInterval, 10000);
};

/**
 * Create the student progress TR for a workgroup
 * @param studentOnline whether the workgroup is online
 * @param userNames the usernames for the workgroup
 * @param workgroupId the workgroup id
 * @param period the period name
 * @param currentStep the current step the workgroup is on
 * @param timeSpent the time spent on the current step
 * @param completionPercentage the project completion percentage for the workgroup
 * @return a TR element containing the student progress values
 */
View.prototype.createStudentProgressDisplayRow = function(studentOnline, userNames, workgroupId, period, currentStep, timeSpent, completionPercentage) {
	var studentTR = null;
	
	if(workgroupId != null) {
		//create the student row
		var studentTR = $('<tr>').attr({id:'studentProgressTableRow_' + workgroupId});
		
		//create the cell to display whether the workgroup is online
		var onlineTD = $('<td>').attr({id:'studentProgressTableDataOnline_' + workgroupId});
		onlineTD.text(studentOnline);
		
		//create the cell to display the usernames for the workgroup
		var userNameTD = $('<td>').attr({id:'studentProgressTableDataUserNames_' + workgroupId});
		userNameTD.text(userNames);
		
		//create the cell to display the workgroup id
		var workgroupIdTD = $('<td>').attr({id:'studentProgressTableDataWorkgroupId_' + workgroupId});
		workgroupIdTD.text(workgroupId);
		
		//create the cell to display the period name
		var periodTD = $('<td>').attr({id:'studentProgressTableDataPeriod_' + workgroupId});
		periodTD.text(period);
		
		//create the cell to display the current step the workgroup is on
		var currentStepTD = $('<td>').attr({id:'studentProgressTableDataCurrentStep_' + workgroupId});
		currentStepTD.text(currentStep);
		
		//create the cell to display the time spent on the current step
		var timeSpentTD = $('<td>').attr({id:'studentProgressTableDataTimeSpent_' + workgroupId});
		timeSpentTD.html(timeSpent);
		
		//create the cell to display the project completion percentage for the workgroup
		var completionPercentageTD = $('<td>').attr({id:'studentProgressTableDataCompletionPercentage_' + workgroupId});
		completionPercentageTD.text(completionPercentage + '%');
		
		//add all the cells to the student row
		studentTR.append(onlineTD);
		studentTR.append(userNameTD);
		studentTR.append(workgroupIdTD);
		studentTR.append(periodTD);
		studentTR.append(currentStepTD);
		studentTR.append(timeSpentTD);
		studentTR.append(completionPercentageTD);
	}
	
	//return the student row
	return studentTR;
};

/**
 * Create the step progress display
 */
View.prototype.createStepProgressDisplay = function() {
	//create the step progress div
	var stepProgressDisplay = $('<div></div>').attr({id:'stepProgressDisplay'});
	
	//add the step progress display to the main div
	$('#classroomMonitorMainDiv').append(stepProgressDisplay);
	
	//hide the step progress div, we will show it later when necessary
	stepProgressDisplay.hide();
	
	//create the table that will display all the steps
	var stepProgressDisplayTable = $('<table>').attr({id:'stepProgressDisplayTable'});
	stepProgressDisplayTable.attr('border', '1px');
	
	//add the table to the step progress div
	$('#stepProgressDisplay').append(stepProgressDisplayTable);
	
	//create the header row
	var headerTR = $('<tr>');
	
	//create the header cells
	var stepTitleTH = $('<th>').text('Step Title');
	var numberOfStudentsOnStepTH = $('<th>').text('Number of Students on Step');
	var stepCompletionTH = $('<th>').text('Step Completion %');
	
	//add the header cells to the header row
	headerTR.append(stepTitleTH);
	headerTR.append(numberOfStudentsOnStepTH);
	headerTR.append(stepCompletionTH);
	
	//add the header row to the table
	$('#stepProgressDisplayTable').append(headerTR);
	
	//get all the node ids. this includes activity and step node ids.
	var nodeIds = this.getProject().getAllNodeIds();
	
	//loop through all the node ids
	for(var x=0; x<nodeIds.length; x++) {
		//get a node id
		var nodeId = nodeIds[x];
		
		//skip the master node
		if(nodeId != 'master') {
			//get the step number and title
			var stepNumberAndTitle = this.getProject().getStepNumberAndTitle(nodeId);
			
			//get the node
			var node = this.getProject().getNodeById(nodeId);
			
			if(node != null) {
				var nodePrefix = '';
				
				//get the prefix
				if(node.type == 'sequence') {
					nodePrefix = 'Activity';
				} else {
					nodePrefix = 'Step';
				}
				
				//get the number of students on this step
				var numberOfStudentsOnStep = this.getNumberOfStudentsOnStep(nodeId);
				
				//get the percentage completion for this step
				var completionPercentage = this.calculateStepCompletionForNodeId(nodeId);
				
				//get the node type
				var nodeType = node.type;
				
				var tr = null;
				
				//we will not display number of students on step or completion percentage for sequences 
				if(nodeType == 'sequence') {
					numberOfStudentsOnStep= null;
					completionPercentage = null;
					nodeType = '';
				}
				
				//create the step title
				var stepTitle = nodePrefix + ' ' + stepNumberAndTitle + ' (' + nodeType + ')';
				
				//create the row element for this step
				tr = this.createStepProgressDisplayRow(nodeId, stepTitle, numberOfStudentsOnStep, completionPercentage);
				
				if(tr != null) {
					//add the row to the end of the table
					$('#stepProgressDisplayTable tr:last').after(tr);
				}
			}			
		}
	}
};

/**
 * Create the step progress TR for a step
 * @param nodeId the node id for the step
 * @param stepTitle the step title
 * @param numberOfStudentsOnStep the number of students on the step
 * @param completionPercentage the percentage of students who have completed 
 * the step. this should be a number since we will append the % sign to it.
 * @return a TR element containing the step progress values
 */
View.prototype.createStepProgressDisplayRow = function(nodeId, stepTitle, numberOfStudentsOnStep, completionPercentage) {
	var stepTR = null;
	
	if(nodeId != null) {
		//create the row
		var stepTR = $('<tr>').attr({id:'stepProgressTableRow_' + nodeId});
		
		//create the step title cell
		var stepTitleTD = $('<td>').attr({id:'stepProgressTableDataStepTitle_' + nodeId});
		stepTitleTD.text(stepTitle);
		
		//create the number of students on step cell
		var numberStudentsOnStepTD = $('<td>').attr({id:'stepProgressTableDataNumberOfStudentsOnStep_' + nodeId});

		if(numberOfStudentsOnStep == null) {
			numberOfStudentsOnStep = '';
		}
		
		numberStudentsOnStepTD.text(numberOfStudentsOnStep);
		
		//create the completion percentage cell
		var completionPercentageTD = $('<td>').attr({id:'stepProgressTableDataCompletionPercentage_' + nodeId});
		
		if(completionPercentage == null) {
			completionPercentage = '';
		} else {
			//append the % sign
			completionPercentage += '%';
		}
		
		completionPercentageTD.text(completionPercentage);

		//add the cells to the row
		stepTR.append(stepTitleTD);
		stepTR.append(numberStudentsOnStepTD);
		stepTR.append(completionPercentageTD);
	}
	
	return stepTR;
};

/**
 * Make a request to the server for all the student statuses for the run
 */
View.prototype.getStudentStatuses = function() {
	//get the student status url we will use to make the request
	var studentStatusUrl = this.getConfig().getConfigParam('studentStatusUrl');
	
	//get the run id
	var runId = this.getConfig().getConfigParam('runId');
	
	//create the params for the request
	var studentStatusParams = {
		runId:runId
	}
	
	if(studentStatusUrl != null) {
		//make the request to the server for the student statuses
		this.connectionManager.request('GET', 3, studentStatusUrl, studentStatusParams, this.getStudentStatusesCallback, this, this.getStudentStatusesFail, false, null);
	}
};

/**
 * The callback for getting the student statuses
 * @param responseText the student response JSONArray string
 * @param responseXML
 * @param view the view
 */
View.prototype.getStudentStatusesCallback = function(responseText, responseXML, view) {
	if(responseText != null) {
		//create the JSONArray from the response text
		var studentStatuses = JSON.parse(responseText);
		
		//loop through all the student statuses
		for(var x=0; x<studentStatuses.length; x++) {
			//get a student status
			var studentStatus = studentStatuses[x];
			
			/*
			 * insert the current timestamp so we can calculate how long
			 * the student has been on the current step they are on
			 */
			view.insertTimestamp(studentStatus);
		}
		
		//set the student statuses into the view so we can access it later
		view.studentStatuses = studentStatuses;

		//create the array to keep track of the students that are online
		view.studentsOnline = [];
		
		//start the web socket connection
		view.startWebSocketConnection();
	}
};

/**
 * The failure callback for getting the student statuses
 */
View.prototype.getStudentStatusesFail = function(responseText, responseXML, view) {
	
};

/**
 * Get the student status object for a workgroup id
 * @param workgroup id the workgroup id
 * @return the student status with the given workgroup id
 */
View.prototype.getStudentStatusByWorkgroupId = function(workgroupId) {
	var studentStatus = null;
	
	//get the student statuses
	var studentStatuses = this.studentStatuses;
	
	if(studentStatuses != null) {
		//loop through all the student statuses
		for(var x=0; x<studentStatuses.length; x++) {
			//get a student status
			var tempStudentStatus = studentStatuses[x];
			
			if(tempStudentStatus != null) {
				//get the workgroup id for the student status
				var tempWorkgroupId = tempStudentStatus.workgroupId;
				
				//check if the workgroup id is the one we want
				if(workgroupId == tempWorkgroupId) {
					//the workgroup id matches so we have found the student status we want
					studentStatus = tempStudentStatus;
					break;
				}
			}
		}
	}
	
	return studentStatus;
};

/**
 * Get the current step the given workgroup id is on
 * @param workgroupId the workgroup id
 * @return the current step the workgroup is on in the 
 * step number and title format e.g. '1.1: Introduction'
 */
View.prototype.getStudentCurrentStepByWorkgroupId = function(workgroupId) {
	var currentStep = '';
	
	//get the student statuses
	var studentStatuses = this.studentStatuses;

	if(studentStatuses != null) {
		//loop through all the student statuses
		for(var x=0; x<studentStatuses.length; x++) {
			//get a student status
			var tempStudentStatus = studentStatuses[x];
			
			if(tempStudentStatus != null) {
				//get the workgroup id
				var tempWorkgroupId = tempStudentStatus.workgroupId;
				
				//check if the workgroup matches the one we want
				if(workgroupId == tempWorkgroupId) {
					//the workgroup id matches the one we want
					var currentNodeId = tempStudentStatus.currentNodeId;
					
					if(currentNodeId != null) {
						//get the step number and title
						var stepNumberAndTitle = this.getProject().getStepNumberAndTitle(currentNodeId);
						
						//remember the step number and title and break out of the loop
						currentStep = stepNumberAndTitle;
						break;						
					}
				}
			}
		}
	}
	
	return currentStep;
};

/**
 * This function is called when the teacher receives a websocket message
 * with messageType 'studentsOnlineList'.
 * Parses the list of students online and updates the UI accordingly
 * @param data the list of students that are online. this will be
 * an array of workgroup ids
 */
View.prototype.studentsOnlineListReceived = function(data) {
	//get the list of workgroup ids that are online
	var studentsOnlineList = data.studentsOnlineList;
	
	/*
	 * create all of the UI for the classroom monitor now that we have
	 * all the information we need
	 */
	this.createClassroomMonitorDisplays();
	
	/*
	 * show the pause all screens display as the default screen to show
	 * when the classroom monitor initially loads
	 */
	this.showPauseAllScreensDisplay();
	
	if(studentsOnlineList != null) {
		//loop through all the students online
		for(var x=0; x<studentsOnlineList.length; x++) {
			//get a workgroup id that is online
			var workgroupId = studentsOnlineList[x];
			
			//add the workgroup id to our list of online students
			this.addStudentOnline(workgroupId);
			
			//update the UI to show that the student is online
			this.updateStudentOnline(workgroupId, true);
			
			/*
			 * update the timestamp for the student so we can start
			 * calculating how long they have been on the current step
			 */
			this.updateStudentProgressTimeSpent(workgroupId);
		}
	}
};

/**
 * This function is called when the teacher receives a websocket message
 * with messageType 'studentStatus'.
 * Parses the student status and updates the UI accordingly
 * @param data the student status object
 */
View.prototype.studentStatusReceived = function(data) {
	var runId = data.runId;
	var periodId = data.periodId;
	var workgroupId = data.workgroupId;
	var currentNodeId = data.currentNodeId;
	var previousNodeVisit = data.previousNodeVisit;
	var nodeStatuses = data.nodeStatuses;
	
	//we will reset the time spent value to 0 since the student has just moved to a new step
	var timeSpent = '0:00';

	//update our local copy of the student status object for the workgroup id
	var studentStatusObject = this.updateStudentStatusObject(data);
	
	//update the student progress row for the workgroup id
	this.updateStudentProgress(runId, periodId, workgroupId, currentNodeId, previousNodeVisit, nodeStatuses, timeSpent);
	
	//update the step progress for all steps
	this.updateAllStepProgress();
};

/**
 * Update our local copy of the student status object for the given workgroup id
 * @param studentStatusObject the student status object to replace our
 * old copy
 */
View.prototype.updateStudentStatusObject = function(studentStatusObject) {
	//get the student statuses
	var studentStatuses = this.studentStatuses;
	
	if(studentStatusObject != null) {
		//get the workgroup id
		var workgroupId = studentStatusObject.workgroupId;
		
		if(studentStatuses != null) {
			//loop through all the student status objects
			for(var x=0; x<studentStatuses.length; x++) {
				//get a student status object
				var tempStudentStatus = studentStatuses[x];
				
				//get the workgroup id
				var tempWorkgroupId = tempStudentStatus.workgroupId;
				
				//check if the workgroup id matches the one we want
				if(workgroupId == tempWorkgroupId) {
					//the workgroup id matches the one we want
					
					//insert the current timestamp into the object
					this.insertTimestamp(studentStatusObject);
					
					//replace the old student status object with this new one
					studentStatuses.splice(x, 1, studentStatusObject);
				}
			}
		}		
	}
	
	return studentStatusObject;
};

/**
 * Insert the current timestamp into the student status object so we
 * can calculate how long the student has been on the current step
 * @param studentStatusObject the student status object
 */
View.prototype.insertTimestamp = function(studentStatusObject) {
	if(studentStatusObject != null) {
		//get the current timestamp
		var date = new Date();
		var timestamp = date.getTime();
		
		//set the timestamp into the object
		studentStatusObject.timestamp = timestamp;
	}
};

/**
 * Update the student progress values in the UI for a workgroup
 * @param runId the run id
 * @param periodId the period id
 * @param workgroupId the workgroup id
 * @param currentNodeId the current node id
 * @param previousNodeVisit the previous node visit
 * @param nodeStatuses the node statuses
 * @param timeSpent the amount of time the student has spent on the current step
 */
View.prototype.updateStudentProgress = function(runId, periodId, workgroupId, currentNodeId, previousNodeVisit, nodeStatuses, timeSpent) {
	//set the student to be online
	$('#studentProgressTableDataOnline_' + workgroupId).text(true);
	
	//set the current step
	var stepNumberAndTitle = this.getProject().getStepNumberAndTitle(currentNodeId);
	$('#studentProgressTableDataCurrentStep_' + workgroupId).text(stepNumberAndTitle);
	
	//set the time spent on the current step
	$('#studentProgressTableDataTimeSpent_' + workgroupId).html(timeSpent);

	//set the student completion percentage
	var completionPercentage = this.calculateStudentCompletionForWorkgroupId(workgroupId);
	$('#studentProgressTableDataCompletionPercentage_' + workgroupId).text(completionPercentage + '%');
};

/**
 * The function that will get called every once in a while 
 * to update the time spent values for students
 */
View.prototype.updateStudentProgressTimeSpentInterval = function() {
	//update all the student progress time spent values
	view.updateAllStudentProgressTimeSpent();
};

/**
 * Update all the student progress time spent values for all
 * students that are online
 */
View.prototype.updateAllStudentProgressTimeSpent = function() {
	//get the student statuses
	var studentStatuses = this.studentStatuses;
	
	if(studentStatuses != null) {
		//loop through all the student statuses
		for(var x=0; x<studentStatuses.length; x++) {
			//get a student status
			var tempStudentStatus = studentStatuses[x];
			
			//get the workgroup id
			var tempWorkgroupId = tempStudentStatus.workgroupId;
			
			//update the student progress time spent value if the student is online
			this.updateStudentProgressTimeSpent(tempWorkgroupId);
		}
	}	
};

/**
 * Update the student progress time spent value if the student is online
 * @param workgroupId the workgroup id to update the time spent
 */
View.prototype.updateStudentProgressTimeSpent = function(workgroupId) {
	
	if(workgroupId != null) {
		//check if the student is online
		if(this.isStudentOnline(workgroupId)) {
			//the student is online
			
			//get the student status object
			var studentStatus = this.getStudentStatusByWorkgroupId(workgroupId);
			
			//get the current timestamp
			var date = new Date();
			var timestamp = date.getTime();
			
			//get the timestamp for when the student began working on the step
			var studentTimestamp = studentStatus.timestamp;
			
			if(studentTimestamp != null) {
				//get the time difference
				var timeSpentMilliseconds = timestamp - studentTimestamp;
				
				//convert the time to seconds
				var timeSpentSeconds = parseInt(timeSpentMilliseconds / 1000);
				
				//get the number of minutes
				var minutes = Math.floor(timeSpentSeconds / 60);
				
				//get the number of seconds
				var seconds = timeSpentSeconds % 60;

				//prepent a '0' to the seconds if necessary
				if(seconds < 10) {
					seconds = '0' + seconds;
				}
			
				//create the time e.g. '1:32'
				var timeSpentDisplay = minutes + ':' + seconds;
				
				//update the time spent in the UI for the workgroup
				$('#studentProgressTableDataTimeSpent_' + workgroupId).text(timeSpentDisplay);
			}
		} else {
			//the student is not online so we will clear the cell 
			$('#studentProgressTableDataTimeSpent_' + workgroupId).html('&nbsp');
		}
	}
};

/**
 * Update all the step progress rows
 */
View.prototype.updateAllStepProgress = function() {
	//get all the step node ids
	var nodeIds = this.getProject().getAllNodeIds();
	
	//loop through all the node ids
	for(var x=0; x<nodeIds.length; x++) {
		//get a node id
		var nodeId = nodeIds[x];
		
		//skip the  master node
		if(nodeId != 'master') {
			//get the step number and title
			var stepNumberAndTitle = this.getProject().getStepNumberAndTitle(nodeId);
			
			//get the node
			var node = this.getProject().getNodeById(nodeId);
			
			if(node != null) {
				var nodePrefix = '';

				//get the prefix for the node type
				if(node.type == 'sequence') {
					nodePrefix = 'Activity';
				} else {
					nodePrefix = 'Step';
				}
				
				//get the number of students currently on this step
				var numberOfStudentsOnStep = this.getNumberOfStudentsOnStep(nodeId);
				
				//get the percentage of students who have completed this step
				var completionPercentage = this.calculateStepCompletionForNodeId(nodeId);
				
				//get the node type
				var nodeType = node.type;
				
				var tr = null;

				if(nodeType == 'sequence') {
					/*
					 * we will not display number of students or 
					 * percentage completion for sequence nodes
					 */
					completionPercentage = null;
					numberOfStudentsOnStep= null;
				}
				
				//create the step title
				var stepTitle = nodePrefix + ' ' + stepNumberAndTitle;
				
				//update the step progress row for the step
				this.updateStepProgress(nodeId, numberOfStudentsOnStep, completionPercentage);
			}			
		}
	}
};

/**
 * Update the step progress row for a specific step
 * @param nodeId the node id
 * @param numberOfStudentsOnStep the new number of students on the step
 * @param completionPercentage the new completion percentage value. this
 * will be an integer.
 */
View.prototype.updateStepProgress = function(nodeId, numberOfStudentsOnStep, completionPercentage) {

	//get the id of the number of students on step element
	var numberOfStudentsOnStepId = this.escapeIdForJquery('stepProgressTableDataNumberOfStudentsOnStep_' + nodeId);

	if(numberOfStudentsOnStep == null) {
		//set this to '' if it is not provided, sequences will not provide this parameter
		numberOfStudentsOnStep = '';
	}
	
	//set the new number of students on step value
	$('#' + numberOfStudentsOnStepId).text(numberOfStudentsOnStep);
	
	//get the id of the completion percentage element
	var completionPercentageId = this.escapeIdForJquery('stepProgressTableDataCompletionPercentage_' + nodeId);
	
	if(completionPercentage == null) {
		//set this to '' if it is not provided, sequences will not provide this parameter
		completionPercentage = '';
	} else {
		//append a % sign
		completionPercentage += '%';
	}
	
	//set the new completion percentage value
	$('#' + completionPercentageId).text(completionPercentage);
};

/**
 * Calculate the project completion percentage for a student
 * @param workgroup id the workgroup id
 * @return the project completion percentage as an integer
 */
View.prototype.calculateStudentCompletionForWorkgroupId = function(workgroupId) {
	var result = 0;
	
	//get the student status for the workgroup id
	var studentStatus = this.getStudentStatusByWorkgroupId(workgroupId);
	
	if(studentStatus != null) {
		//get the project completion percentage
		result = this.calculateStudentCompletionForStudentStatus(studentStatus);
	}
	
	return result;
};

/**
 * Calculate the project completion percentage for the student status
 * @param studentStatus the student status to calculate the project 
 * completion percentage
 * @return the project completion percentage as an integer
 */
View.prototype.calculateStudentCompletionForStudentStatus = function(studentStatus) {
	var completedNumberSteps = 0;
	var totalNumberSteps = 0;
	
	if(studentStatus != null) {
		//get the node statuses
		var nodeStatuses = studentStatus.nodeStatuses;
		
		//get all the step node ids in the project
		var nodeIds = this.getProject().getNodeIds();
		
		if(nodeIds != null) {
			//loop through all the node ids
			for(var x=0; x<nodeIds.length; x++) {
				//get a node id
				var nodeId = nodeIds[x];
				
				//check if the student has completed the step
				if(this.isNodeCompleted(nodeId, nodeStatuses)) {
					//the student has completed the step so we will update the counter
					completedNumberSteps++;
				}
				
				//update the number of steps counter
				totalNumberSteps++;
			}
		}
	}
	
	//calculate the percentage as an integer
	var completionPercentage = completedNumberSteps / totalNumberSteps;
	completionPercentage = parseInt(100 * completionPercentage);
	
	return completionPercentage;
};

/**
 * Check if the student has completed the step
 * @param nodeId the node id of the step we want to check for completion
 * @param nodeStatuses the node statuses from a student
 * @return whether the student has completed the step or not
 */
View.prototype.isNodeCompleted = function(nodeId, nodeStatuses) {
	var result = false;
	
	if(nodeId != null && nodeStatuses != null) {
		//loop through all the node statuses
		for(var x=0; x<nodeStatuses.length; x++) {
			//get a node status object
			var tempNodeStatus = nodeStatuses[x];
			
			if(tempNodeStatus != null) {
				//get the node id
				var tempNodeId = tempNodeStatus.nodeId;
				
				//get all the statuses for the node
				var tempStatuses = tempNodeStatus.statuses;
				
				//check if the node id matches the one we want
				if(nodeId == tempNodeId) {
					//the node id matches so we will get the 'isCompleted' status value
					result = Node.prototype.getStatus('isCompleted', tempStatuses);
					break;
				}
			}
		}
	}
	
	return result;
};

/**
 * Calculate the percentage of the class that has completed the step
 * @param nodeId the node id for the step
 * @return the percentage of the class that has completed the step
 * as an integer
 */
View.prototype.calculateStepCompletionForNodeId = function(nodeId) {
	var numberStudentsCompleted = 0;
	var totalNumberStudents = 0;
	
	//get the student statuses
	var studentStatuses = this.studentStatuses;
	
	if(studentStatuses != null) {
		//loop through all the student statuses
		for(var x=0; x<studentStatuses.length; x++) {
			//get a student status
			var studentStatus = studentStatuses[x];
			
			//get the node statuses for the student
			var nodeStatuses = studentStatus.nodeStatuses;
			
			//check if the student has completed the step
			if(this.isNodeCompleted(nodeId, nodeStatuses)) {
				//the student has completed the step so we will update the counter
				numberStudentsCompleted++;
			}
			
			//increment the total number of students count
			totalNumberStudents++;
		}
	}
	
	//calculate the percentage as an integer
	var completionPercentage = numberStudentsCompleted / totalNumberStudents;
	completionPercentage = parseInt(100 * completionPercentage);
	
	return completionPercentage;
};

/**
 * Get the number of students on the step
 * @param nodeId the node id of the step
 * @return the number of students on the step
 */
View.prototype.getNumberOfStudentsOnStep = function(nodeId) {
	var numberOfStudentsOnStep = 0;
	
	//get the student statuses
	var studentStatuses = this.studentStatuses;
	
	if(studentStatuses != null) {
		//loop through all the student statuses
		for(var x=0; x<studentStatuses.length; x++) {
			//get a student status
			var studentStatus = studentStatuses[x];
			
			//get the current node id the student is on
			var currentNodeId = studentStatus.currentNodeId;
			
			//check if the node id matches the one we want
			if(nodeId == currentNodeId) {
				//the node id matches so the student is on the step
				numberOfStudentsOnStep++;
			}
		}
	}
	
	return numberOfStudentsOnStep;
};

/**
 * This function is called when the teacher receives a websocket message
 * with messageType 'studentConnected'.
 * A student has connected to the web socket server so we will update
 * our list of online students and also update the UI accordingly.
 * @param data the web socket message that contains the user name
 * and workgroup id
 */
View.prototype.studentConnected = function(data) {
	if(data != null) {
		var userName = data.userName;
		var workgroupId = data.workgroupId;
		
		//update the UI to show the student is online
		this.updateStudentOnline(workgroupId, true);
		
		//add the student to our list of online students
		this.addStudentOnline(workgroupId);
	}
};

/**
 * This function is called when the teacher receives a websocket message
 * with messageType 'studentDisconnected'.
 * A student has disconnected from the web socket server so we will update
 * our list of online students and also update the UI accordingly.
 * @param data the web socket message that contains the user name
 * and workgroup id
 */
View.prototype.studentDisconnected = function(data) {
	if(data != null) {
		var userName = data.userName;
		var workgroupId = data.workgroupId;
		
		//update the UI to show the student is offline
		this.updateStudentOnline(workgroupId, false);
		
		//remove the student from our list of online students
		this.removeStudentOnline(workgroupId);
		
		//clear the time spent cell for the student
		this.updateStudentProgressTimeSpent(workgroupId);
	}
};

/**
 * Add the student to our list of online students
 * @param workgroupId the workgroup id of the student that has come online
 */
View.prototype.addStudentOnline = function(workgroupId) {
	//initialize the students online array if necessary
	if(this.studentsOnline == null) {
		this.studentsOnline = [];
	}
	
	//check if the workgroup id already exists in the array
	if(this.studentsOnline.indexOf(workgroupId) == -1) {
		//the workgroup id does not already exist so we will add it
		this.studentsOnline.push(workgroupId);
	}
};

/**
 * Remove the student from our list of online students
 * @param workgroupId the workgroup id of the student that has gone offline
 */
View.prototype.removeStudentOnline = function(workgroupId) {
	//initialize the students online array if necessary
	if(this.studentsOnline == null) {
		this.studentsOnline = [];
	}
	
	//loop through all the students online
	for(var x=0; x<this.studentsOnline.length; x++) {
		//get a workgroup id
		var studentOnline = this.studentsOnline[x];
		
		//check if the workgroup id matches
		if(workgroupId == studentOnline) {
			//the workgroup id matches so we will remove it from the array
			this.studentsOnline.splice(x, 1);
			
			/*
			 * set the counter back so we can continue looping through
			 * the array in case the workgroup id occurs more than once
			 */
			x--;
		}
	}
};

/**
 * Update the student online status in the UI
 * @param workgroupId the workgroup id
 * @param isOnline whether the student is online
 */
View.prototype.updateStudentOnline = function(workgroupId, isOnline) {
	if(workgroupId != null) {
		//update the online status in the UI for the student
		$('#studentProgressTableDataOnline_' + workgroupId).text(isOnline);
	}
};

/**
 * Check if the student is online
 * @param workgroupId the workgroup id of the student
 */
View.prototype.isStudentOnline = function(workgroupId) {
	var result = false;
	
	//initialize the students online array if necessary
	if(this.studentsOnline == null) {
		this.studentsOnline = [];
	}
	
	//check if the workgroup id is in the array
	if(this.studentsOnline.indexOf(workgroupId) != -1) {
		result = true;
	}
	
	return result;
};

/**
 * Called when the classroom monitor window closes
 */
View.prototype.onWindowUnload = function() {
	
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/classroomMonitor/classroomMonitorView_main.js');
}