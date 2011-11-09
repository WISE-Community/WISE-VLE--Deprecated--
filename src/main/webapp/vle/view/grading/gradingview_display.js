


/**
 * Only Show specified columns
 * @param a list of array of column names  arguments[]
 * if columnNames is null or empty, show all.
 */
View.prototype.showColumns = function() {
	if (arguments.length > 0) {
		// first hide all of the columns and then re-show the specified columns
		$('.gradeColumn').css('display','none');
		for (var i=0; i<arguments.length; i++) {
			$('.' + arguments[i]).css('display','');
		}
	} else {
		// show all
		$('.gradeColumn').css('display','');
	}
};


/**
 * Callback for the onlyShowFilteredItems check box
 */
View.prototype.onlyShowFilteredItemsOnClick = function() {
	/*
	 * check if the "onlyShowFilteredItemsCheckBox" exists, it will for 
	 * gradebystep but won't for gradebyteam
	 */
	if(document.getElementById("onlyShowFilteredItemsCheckBox") != null) {
		// check if the checkbox is checked
		var isChecked = document.getElementById("onlyShowFilteredItemsCheckBox").checked;
		if (isChecked) {
			// only show filtered items
			$('#studentWorkTable').filter('[isFlagged=false]').css('display','none');
			this.gradingShowFlagged = true;
		} else {
			// show all items
			$('#studentWorkTable tr').css('display','');
			this.gradingShowFlagged = false;
		}
	}
};

/**
 * Callback for the onlyShowFilteredItems check box
 */
View.prototype.onlyShowWorkOnClick = function() {
	var onlyShowWorkCheckBox = document.getElementById("onlyShowWorkCheckBox");
	
	if(onlyShowWorkCheckBox) {
		// check if the checkbox is checked
		var isChecked = document.getElementById("onlyShowWorkCheckBox").checked;
		if (isChecked) {
			// only show filtered items
			this.showColumns('workColumn');
			
			this.gradingHidePersonalInfo = true;
		} else {
			// show all items
			this.showColumns();
			
			this.gradingHidePersonalInfo = false;
		}		
	}
};


/**
 * Displays the steps in the project and then gets the student work
 */
View.prototype.initiateGradingDisplay = function() {
	removejscssfile("jquery-ui-1.8.7.custom.css", "css") //remove all occurences "jquery-ui-1.8.7.custom.css" on page
	
	//obtain the grading permission from the iframe window url
	var permissionSearch = window.location.search.match(/permission=(\w*)/);
	
	if(permissionSearch != null && permissionSearch.length > 1) {
		//we found the permission parameter, we will now obtain the value
		this.gradingPermission = window.location.search.match(/permission=(\w*)/)[1];	
	} else {
		//permission parameter was not found so we will default to read
		this.gradingPermission = "read";
	}
	
	this.gradingType = this.getConfig().getConfigParam('gradingType');
	
	this.excelExportRestriction = this.getConfig().getConfigParam('excelExportRestriction');
	
	//the array to store the original order of the row ids
	this.originalStudentWorkRowOrder = [];
	
	/*
	 * the array to store objects that we will use to sort by
	 * auto graded score. each object will contain two fields
	 * autoGradedScore and studentWorkRowId
	 */
	this.studentWorkRowOrderObjects = [];
	
	/*
	 * the object to store the mappings from studentWorkRowId to array of
	 * studentWorkRevisionRowIds so that we have the studentWorkRowId of
	 * the revisions grouped together and know which revision row belongs
	 * to which latest revision row
	 */
	this.studentWorkRowRevisions = {};
	
	if(this.gradingType == "step") {
		this.displayGradeByStepSelectPage();	
		eventManager.fire("initiateGradingDisplayStart");
	} else if(this.gradingType == "team") {
		this.displayGradeByTeamSelectPage();
		eventManager.fire("initiateGradingDisplayStart");
	} else if(this.gradingType == "monitor") {
		this.checkXMPPEnabled();
		
		if(this.isXMPPEnabled) {
			this.displayClassroomMonitorPage();
			eventManager.fire("initiateClassroomMonitorDisplayStart");			
		}
	} else if(this.gradingType == "export") {
		this.displayResearcherToolsPage();
	}

	if(this.gradingType != "monitor" && this.gradingType != "export") {
		this.getRevisions = false;
		
		if(this.getConfig().getConfigParam('getRevisions') == "true") {
			this.getRevisions = true;
		}
		
		this.getPeerReviewWork();
		this.getStudentWork();		
	}
};

View.prototype.convertTime24to12 = function(time) {
	var hours = Math.floor(time/100);
	var minutes = time % 100;
	var meridian = "am";
	
	if(hours > 12) {
		meridian = "pm";
		
		hours = hours - 12;
	}
	
	if(hours == 0) {
		hours = 12;
	}
	
	if(minutes < 10) {
		minutes = "0" + minutes;
	}
	
	var time = hours + ":" + minutes + meridian;
	
	return time;
};

/**
 * Get the current time in the PST timezone
 * @returns the current time date object for the PST timezone
 */
View.prototype.getPSTTime = function() {
	//get the local time
	var currentTime = new Date();
	
	//get the local time in milliseconds
	var currentTimeMilliseconds = currentTime.getTime();
	
	//get the local time zone offset from UTC, PST will be 8, EST will be 5, etc. in hours
	var timezoneOffset = currentTime.getTimezoneOffset()/60;
	
	//get the UTC time by adding the local time and the offset in milliseconds
	var utcMilliseconds = currentTimeMilliseconds + (60 * 60 * 1000 * timezoneOffset);
	
	//get the PST offset in hours
	var pstOffset = 8;
	
	//get the PST time by subtracting the PST offset from the UTC time in milliseoncds
	var pstMilliseconds = utcMilliseconds - (60 * 60 * 1000 * pstOffset);
	
	//make a new date object with the milliseconds from the PST time
	var pstTime = new Date(pstMilliseconds);
	
	return pstTime;
};

/**
 * Displays the excel export buttons
 */
View.prototype.displayResearcherToolsPage = function() {
	
	/*
	 * make the excel export buttons. this is where we make the export button,
	 * the explanation button, and the short description of the export.
	 */
	var getResearcherToolsHtml = "<div class='gradingContent'><div id='exportCenterButtons'>";
	getResearcherToolsHtml += "<table>";
	
	//check if we want to display the excel export restriction message
	if(this.excelExportRestriction) {
		//get the current time in the PST timezone
		var pstTime = this.getPSTTime();
		
		//get the hours (0-23)
		var pstHours = pstTime.getHours();
		
		//get the minutes (0-59)
		var pstMinutes = pstTime.getMinutes();
		
		//am or pm
		var meridian = "am";
		
		if(pstMinutes < 10) {
			//add a leading 0
			pstMinutes = "0" + pstMinutes;
		}
		
		//the start and end time for school hours
		var schoolStartTime = 800;
		var schoolEndTime = 1500;
		
		//get the current time in 24 hour format e.g. 1049
		var pst24HourTime = pstHours + "" + pstMinutes;

		//get the current time in 24 hour format as a number
		var pst24HourTimeNumber = Number(pst24HourTime);
		
		if(pst24HourTimeNumber > schoolStartTime && pst24HourTimeNumber < schoolEndTime) {
			//school is currently in session so we will display the caution message
			
			if(pstHours > 12) {
				//hours is greater than 12 so we will subtract 12 and change to pm
				pstHours = pstHours - 12;
				meridian = "pm";
			}
			
			//create the current PST clock time e.g. 10:49am
			var pstClockTime = pstHours + ":" + pstMinutes + meridian;
			
			//create the message
			getResearcherToolsHtml += "<tr><td colspan='2'>";
			getResearcherToolsHtml += "<p style='color:red'>";
			getResearcherToolsHtml += "Caution: Please try not to generate Excel export files between 8am-3pm PST to minimize server load during school hours. It is currently " + pstClockTime + " PST.<br>";
			getResearcherToolsHtml += "If you urgently need to generate excel export files, you may still do so. If you do not need them right away, we would appreciate it if you waited until after 3pm PST.";
			getResearcherToolsHtml += "</p>";
			getResearcherToolsHtml += "</td></tr>";
		}
	}
	
	getResearcherToolsHtml += "<tr><td><input class='blueButton' type='button' value='"+this.getI18NString("grading_button_export_latest_student_work")+"' onClick=\"eventManager.fire('getLatestStudentWorkXLSExport')\"></input></td><td>"+this.getI18NString("grading_button_export_latest_student_work_description")+" <input class='blueButton' type='button' value='"+this.getI18NString("grading_button_explanation")+"' onClick=\"eventManager.fire('displayExportExplanation', ['latestStudentWork'])\"></input></td></tr>";
	getResearcherToolsHtml += "<tr><td><input class='blueButton' type='button' value='"+this.getI18NString("grading_button_export_all_student_work")+"' onClick=\"eventManager.fire('getAllStudentWorkXLSExport')\"></input></td><td>"+this.getI18NString("grading_button_export_all_student_work_description")+" <input class='blueButton' type='button' value='"+this.getI18NString("grading_button_explanation")+"' onClick=\"eventManager.fire('displayExportExplanation', ['allStudentWork'])\"></input></td></tr>";
	getResearcherToolsHtml += "<tr><td><input class='blueButton' type='button' value='"+this.getI18NString("grading_button_export_idea_baskets")+"' onClick=\"eventManager.fire('getIdeaBasketsExcelExport')\"></input></td><td>"+this.getI18NString("grading_button_export_idea_baskets_description")+" <input class='blueButton' type='button' value='"+this.getI18NString("grading_button_explanation")+"' onClick=\"eventManager.fire('displayExportExplanation', ['ideaBaskets'])\"></input></td></tr>";
	getResearcherToolsHtml += "<tr><td><input class='blueButton' type='button' value='"+this.getI18NString("grading_button_export_explanation_builder_work")+"' onClick=\"eventManager.fire('getExplanationBuilderWorkExcelExport')\"></input></td><td>"+this.getI18NString("grading_button_export_explanation_builder_work_description")+" <input class='blueButton' type='button' value='"+this.getI18NString("grading_button_explanation")+"' onClick=\"eventManager.fire('displayExportExplanation', ['explanationBuilder'])\"></input></td></tr>";
	getResearcherToolsHtml += "<tr><td><input class='blueButton' type='button' value='"+this.getI18NString("grading_button_export_custom_work")+"' onClick=\"eventManager.fire('displayCustomExportPage')\"></input></td><td>"+this.getI18NString("grading_button_export_custom_work_description")+" <input class='blueButton' type='button' value='"+this.getI18NString("grading_button_explanation")+"' onClick=\"eventManager.fire('displayExportExplanation', ['custom'])\"></input></td></tr>";
	getResearcherToolsHtml += "<tr><td><input class='blueButton' type='button' value='"+this.getI18NString("grading_button_export_student_names")+"' onClick=\"eventManager.fire('getStudentNamesExport')\"></input></td><td>"+this.getI18NString("grading_button_export_student_names_description")+" <input class='blueButton' type='button' value='"+this.getI18NString("grading_button_explanation")+"' onClick=\"eventManager.fire('displayExportExplanation', ['studentNames'])\"></input></td></tr>";
	getResearcherToolsHtml += "</table>";
	getResearcherToolsHtml += "</div></div>";	
	
	$('#gradeWorkDiv').html(getResearcherToolsHtml);
	
	//fix the page height
	this.fixGradingDisplayHeight();
	
	//fire this event to remove the loading screen
	eventManager.fire("getStudentWorkComplete");
};

/**
 * Display the page where it explains the fields in the excel export for
 * a specific export type
 * @param exportType the type of the export
 */
View.prototype.displayExportExplanation = function(exportType) {
	
	var exportExplanationPageHtml = "<div class='gradingContent'>";
	
	//the button to go back to the previous page
	exportExplanationPageHtml += "<input class='blueButton' type='button' value='"+"Back To Researcher Tools"+"' onClick=\"eventManager.fire('displayResearcherToolsPage');\"></input>";
	
	if(exportType == 'latestStudentWork') {
		//show the explanation for the latest student work export
		exportExplanationPageHtml += "<h3>Export Latest Student Work</h3>";
		exportExplanationPageHtml += "<p>Export the latest work that each student has submitted. Each row represents the work for a workgroup. The columns represent which step the work is for.</p>";
		exportExplanationPageHtml += "<table class='exportExplanationTable'>";
		exportExplanationPageHtml += this.getWorkgroupExportExplanations();
		exportExplanationPageHtml += this.getRunExportExplanations();
		exportExplanationPageHtml += this.getLatestStudentWorkExportExplanations();
		exportExplanationPageHtml += "</table>";
	} else if(exportType == 'allStudentWork') {
		//show the explanation for the all student work export
		exportExplanationPageHtml += "<h3>Export All Student Work</h3>";
		exportExplanationPageHtml += "<p>Export all the work revisions the students have submitted. Each sheet represents a workgroup. The rows represent the student visiting a step along with the work they submitted for that step on that visit. The rows are ordered chronologically from oldest to newest so you can view how the student progressed through the project and if they ever went back to change their answer.</p>";
		exportExplanationPageHtml += "<table class='exportExplanationTable'>";
		exportExplanationPageHtml += this.getRunExportExplanations();
		exportExplanationPageHtml += this.getWorkgroupExportExplanations();
		exportExplanationPageHtml += this.getAllStudentWorkExportExplanations();
		exportExplanationPageHtml += "</table>";
	} else if(exportType == 'ideaBaskets') {
		//show the explanation for the idea baskets export
		exportExplanationPageHtml += "<h3>Export Idea Baskets</h3>";
		exportExplanationPageHtml += "<p>Export all the idea basket revisions. All of the revisions for all the workgroups are on a single sheet. The idea basket revisions are grouped together by 'Workgroup Id'. For each revision, there may be one or more ideas. Each idea receives its own row. As an example, if an idea basket revision contains 3 ideas, there will be 3 rows for that revision. You will also see that the 'Basket Revision' number is the same for those 3 rows. An idea basket revision is created anytime the idea basket is modified and then closed.</p>";
		exportExplanationPageHtml += "<table class='exportExplanationTable'>";
		exportExplanationPageHtml += this.getRunExportExplanations();
		exportExplanationPageHtml += this.getWorkgroupExportExplanations();
		exportExplanationPageHtml += this.getIdeaBasketsExportExplanations();
		exportExplanationPageHtml += "</table>";
	} else if(exportType == 'explanationBuilder') {
		//show the explanation for the explanation builder work export
		exportExplanationPageHtml += "<h3>Export Explanation Builder Work</h3>";
		exportExplanationPageHtml += "<p>Export all the work revisions for explanation builder steps. Each sheet represents a workgroup. Each time a student submits work for an explanation builder step, the ideas that are used are grouped together by 'Step Work Id'. As an example, if a student used 3 ideas in an explanation builder step, there will be 3 rows with the same 'Step Work Id'.</p>";
		exportExplanationPageHtml += "<table class='exportExplanationTable'>";
		exportExplanationPageHtml += this.getWorkgroupExportExplanations();
		exportExplanationPageHtml += this.getRunExportExplanations();
		exportExplanationPageHtml += this.getExplanationBuilderWorkExportExplanations();
		exportExplanationPageHtml += "</table>";
	} else if(exportType == 'custom') {
		//show the explanation for the custom work export
		exportExplanationPageHtml += "<h3>Export Custom Student Work</h3>";
		exportExplanationPageHtml += "<p></p>";
		
		exportExplanationPageHtml += "<h4><i>Export Custom Latest Student Work</i></h4>";
		exportExplanationPageHtml += "<p>Export the latest work that each student has submitted for a custom set of steps that you choose. Each row represents the work for a workgroup. The columns represent which step the work is for.</p>";
		exportExplanationPageHtml += "<table class='exportExplanationTable'>";
		exportExplanationPageHtml += this.getWorkgroupExportExplanations();
		exportExplanationPageHtml += this.getRunExportExplanations();
		exportExplanationPageHtml += this.getLatestStudentWorkExportExplanations();
		exportExplanationPageHtml += "</table>";
		
		exportExplanationPageHtml += "<br>";
		
		exportExplanationPageHtml += "<h4><i>Export Custom All Student Work</i></h4>";
		exportExplanationPageHtml += "<p>Export all the work revisions the students have submitted for a custom set of steps that you choose. Each sheet represents a workgroup. The rows represent the student visiting a step along with the work they submitted for that step on that visit. The rows are ordered chronologically from oldest to newest so you can view how the student progressed through the project and if they ever went back to change their answer.</p>";
		exportExplanationPageHtml += "<table class='exportExplanationTable'>";
		exportExplanationPageHtml += this.getWorkgroupExportExplanations();
		exportExplanationPageHtml += this.getRunExportExplanations();
		exportExplanationPageHtml += this.getAllStudentWorkExportExplanations();
		exportExplanationPageHtml += "</table>";
	} else if(exportType == 'studentNames') {
		//show the explanation for the student names export
		exportExplanationPageHtml += "<h3>Export Student Names</h3>";
		exportExplanationPageHtml += "<p>Export the student names along with their period, workgroup id, wise id, and login</p>";
		exportExplanationPageHtml += "<table class='exportExplanationTable'>";
		exportExplanationPageHtml += this.getRunExportExplanations();
		exportExplanationPageHtml += this.getStudentNamesExportExplanations();
		exportExplanationPageHtml += "</table>";
	}
	
	exportExplanationPageHtml += "<br>";
	
	//the button to go back to the previous page
	exportExplanationPageHtml += "<input class='blueButton' type='button' value='"+"Back To Researcher Tools"+"' onClick=\"eventManager.fire('displayResearcherToolsPage');\"></input>";
	
	exportExplanationPageHtml += "</div>";
	
	//put the html into the div
	$('#gradeWorkDiv').html(exportExplanationPageHtml);
	
	//fix the page height
	this.fixGradingDisplayHeight();
};

/**
 * Display the page for the teacher to choose which steps in the project they want to export
 */
View.prototype.displayCustomExportPage = function() {
	
	/*
	 * wrap everything in a div with the class 'gradingContent' so 
	 * a scroll bar will be created for it
	 */
	var customExportPageHtml = "<div class='gradingContent'>";
	
	customExportPageHtml += "<h3>Custom Export Page</h3>";
	
	//the button to go back to the previous page
	customExportPageHtml += "<input class='blueButton' type='button' value='"+"Back To Researcher Tools"+"' onClick=\"eventManager.fire('displayResearcherToolsPage');\"></input>";
	
	//the buttons to generate the excel export
	customExportPageHtml += "<input class='blueButton' type='button' value='"+"Export Custom Latest Student Work"+"' onClick=\"eventManager.fire('getCustomLatestStudentWorkExport')\"></input>";
	customExportPageHtml += "<input class='blueButton' type='button' value='"+"Export Custom All Student Work"+"' onClick=\"eventManager.fire('getCustomAllStudentWorkExport')\"></input>";
	customExportPageHtml += "<br>";
	
	//the checkbox to select all or unselect all
	customExportPageHtml += "<input id='selectAllStepsCheckBox' type='checkbox' onClick=\"eventManager.fire('customSelectAllStepsCheckBoxClicked')\" /><p style='display:inline'>Select All Steps</p>";
	
	customExportPageHtml += "<table>";

	//set the counter for the activities
	this.activityNumber = 0;
	
	//display all the activities and steps with checkboxes next to all of them
	customExportPageHtml += this.displayCustomExportPageHelper(this.getProject().getRootNode());
	
	customExportPageHtml += "</table>";

	customExportPageHtml += "<br>";
	
	//the button to go back to the previous page
	customExportPageHtml += "<input class='blueButton' type='button' value='"+"Back To Researcher Tools"+"' onClick=\"eventManager.fire('displayResearcherToolsPage');\"></input>";
	
	//the buttons to generate the excel export
	customExportPageHtml += "<input class='blueButton' type='button' value='"+"Export Custom Latest Student Work"+"' onClick=\"eventManager.fire('getCustomLatestStudentWorkExport')\"></input>";
	customExportPageHtml += "<input class='blueButton' type='button' value='"+"Export Custom All Student Work"+"' onClick=\"eventManager.fire('getCustomAllStudentWorkExport')\"></input>";
	
	customExportPageHtml += "</div>";
	
	//fix the page height
	$('#gradeWorkDiv').html(customExportPageHtml);
	
	this.fixGradingDisplayHeight();
};

/**
 * A recursive function that traverses the project and displays a checkbox for
 * each activity and step with the name of the activity or step next to it
 * @param node the current node we are on
 * @return html with all the checkboxes and labels for the project
 */
View.prototype.displayCustomExportPageHelper = function(node) {
	var displayCustomExportPageHelperHtml = "";
	
	//get the current node id
	var nodeId = node.id;
	
	if(node.isLeafNode()) {
		//this node is a leaf/step

		//get the position as seen by the student
		var position = this.getProject().getVLEPositionById(nodeId);
		
		//display a checkbox and label for the current step
		displayCustomExportPageHelperHtml +=  "<tr><td class='chooseStepToGradeStepTd'><input id='stepCheckBox_" + nodeId + "' class='activityStep_" + (this.activityNumber - 1) + " activityCheckBox' type='checkbox' name='customExportStepCheckbox' value='" + nodeId + "' style='margin-left:20px' /><p style='display:inline'>" + position + " " + node.getTitle() + " (" + node.type + ")</p></td></tr>";
	} else {
		/*
		 * we need to skip the first sequence because that is always the
		 * master sequence. we will encounter the master sequence when 
		 * this.activityNumber is 0, so all the subsequent activities will
		 * start at 1.
		 */
		if(this.activityNumber != 0) {
			//this node is a sequence so we will display a checkbox and label for the current activity
			displayCustomExportPageHelperHtml += "<tr><td class='chooseStepToGradeActivityTd'><input id='activityCheckBox_" + this.activityNumber + "' class='stepCheckBox' type='checkbox' name='customExportActivityCheckbox' value='" + nodeId + "' onClick='eventManager.fire(\"customActivityCheckBoxClicked\", [\"activityCheckBox_" + this.activityNumber + "\"])' /><h4 style='display:inline'>Activity " + this.activityNumber + ": " + node.getTitle() + "</h4></td></tr>";
		}

		//increment the activity number
		this.activityNumber++;
		
		//loop through all its children
		for(var x=0; x<node.children.length; x++) {
			//get the html for the children
			displayCustomExportPageHelperHtml += this.displayCustomExportPageHelper(node.children[x]);
		}
	}

	return displayCustomExportPageHelperHtml;
};

/**
 * Called when a checkbox for an activity is clicked. Depending on whether
 * the checkbox is checked or unchecked, it will select all or unselect all
 * steps for that activity
 * @param activityCheckBoxId the id of the checkbox that was clicked
 */
View.prototype.customActivityCheckBoxClicked = function(activityCheckBoxId) {
	//get the activity number
	var activityNumber = activityCheckBoxId.replace("activityCheckBox_", "");
	
	//get whether the activity check box is checked or unchecked
	var isActivityChecked = $('#' + activityCheckBoxId).attr('checked');
	
	if(isActivityChecked == null) {
		isActivityChecked = false;
	}
	
	//check or uncheck all the steps in this activity
	$(".activityStep_" + activityNumber).each(function(index, element) {$(element).attr('checked', isActivityChecked);});
};

/**
 * Called when the "Select All Steps" check box is clicked. Depending on
 * whether the checkbox is checked or unchecked, it will select all or
 * unselect all steps in the project
 */
View.prototype.customSelectAllStepsCheckBoxClicked = function() {
	//get whether the checkbox was checked or unchecked
	var isSelectAllStepsChecked = $('#selectAllStepsCheckBox').attr('checked');
	
	if(isSelectAllStepsChecked == null) {
		isSelectAllStepsChecked = false;
	}
	
	//check or uncheck all the steps
	$(".stepCheckBox").each(function(index, element) {$(element).attr('checked', isSelectAllStepsChecked);});
	
	//check or uncheck all the activities
	$(".activityCheckBox").each(function(index, element) {$(element).attr('checked', isSelectAllStepsChecked);});
};

/**
 * Generate the html that displays the table that contains the
 * buttons at the top of the grading pages
 * @return an html table containing buttons
 */
View.prototype.getGradingHeaderTableHtml = function() {
	var gradingHeaderHtml = "<div id='fixedGradingHeader' class='gradingHeader runButtons'>";
	//var getGradingHeaderTableHtml = "";
	//generate the buttons for other grading views and the export and refresh buttons
	gradingHeaderHtml += "<div>";
	var stepClass = '', teamClass = '';
	if(this.gradingType == "step"){
		stepClass = 'checked';
	} else if (this.gradingType == "team"){
		teamClass = 'checked';
	}
	gradingHeaderHtml += "<a class='gradingButton " + stepClass + "' onClick=\"eventManager.fire('displayGradeByStepSelectPage')\">"+this.getI18NString("grading_button_grade_by_step")+"</a>";
	gradingHeaderHtml += "<a class='gradingButton " + teamClass + "' onClick=\"eventManager.fire('displayGradeByTeamSelectPage')\">"+this.getI18NString("grading_button_grade_by_team")+"</a>";
	// TODO: classroom monitor link button could go here
	gradingHeaderHtml += "</div>";
	
	/*getGradingHeaderTableHtml += "<table id='gradingHeaderTable' class='gradingHeaderTable' name='gradingHeaderTable'>";
	getGradingHeaderTableHtml += "<tr class='runButtons'><td colspan='2'>";
	getGradingHeaderTableHtml += "<input type='button' value='"+this.getI18NString("grading_button_grade_by_step")+"' onClick=\"eventManager.fire('displayGradeByStepSelectPage')\"></input>";
	getGradingHeaderTableHtml += "<input type='button' value='"+this.getI18NString("grading_button_grade_by_team")+"' onClick=\"eventManager.fire('displayGradeByTeamSelectPage')\"></input>";*/
	
	gradingHeaderHtml += "<div style='float:right;'>";
	var runInfoStr = this.config.getConfigParam('runInfo');
	if (runInfoStr != null && runInfoStr != "") {
		var runInfo = JSON.parse(runInfoStr);
		if (runInfo.isStudentAssetUploaderEnabled != null &&
				runInfo.isStudentAssetUploaderEnabled) {
			gradingHeaderHtml += "<a onClick=\"eventManager.fire('displayStudentUploadedFiles')\">"+this.getI18NString("grading_button_view_student_uploaded_files")+"</a>";
			//getGradingHeaderTableHtml += "<input type='button' value='"+this.getI18NString("grading_button_view_student_uploaded_files")+"' onClick=\"eventManager.fire('displayStudentUploadedFiles')\"></input>";
		}
	}
	
	gradingHeaderHtml += "<a onClick=\"eventManager.fire('refreshGradingScreen')\">"+this.getI18NString('grading_button_check_for_new_student_work')+"</a>";
	gradingHeaderHtml += "<a class='saveButton' onClick=\"notificationManager.notify('Changes have been successfully saved.')\">"+this.getI18NString("grading_button_save_changes")+"</a>";
	gradingHeaderHtml += "</div></div>";
	/*getGradingHeaderTableHtml += "<input type='button' value='"+this.getI18NString("grading_button_check_for_new_student_work")+"' onClick=\"eventManager.fire('refreshGradingScreen')\"></input>";
	getGradingHeaderTableHtml += "<input type='button' value='"+this.getI18NString("grading_button_save_changes")+"' onClick=\"notificationManager.notify('Changes have been successfully saved.')\"></input>";
	getGradingHeaderTableHtml += "</td></tr></table>";*/

	return gradingHeaderHtml;
	//return getGradingHeaderTableHtml;
};

View.prototype.displayClassroomMonitorPage = function() {
	var classroomMonitorDiv = "<div id='classroomMonitorDiv>";
	var pauseScreenDiv = "<div id='pauseScreenDiv'>"
	pauseScreenDiv += "<h2 style='margin-bottom:0px'>Pause All Screens <span style='font-size:.8em'>(Currently all students' screens are: <span id='studentScreenStatus' style='font-weight:bold; color:green'>unpaused</span></span>)</h2>";
	pauseScreenDiv += "<div id='pauseScreenControls'>";
	pauseScreenDiv += "<table><tr>";
	pauseScreenDiv += "<td><div>This is what your students will see when you pause their screens:</div><textarea type='text' id='pause-message' rows='2' cols='90' value=''>Your teacher has paused your screen.</textarea></td>";
	pauseScreenDiv += "<td><input type='button' id='pause-button' value='pause' class='blueButton' style='background-color:red; margin: 20 0 20 20; font-size:1.5em'></input>";
	pauseScreenDiv += "<input type='button' id='unPause-button' value='un-pause' class='blueButton' style='background-color:green; margin: 20 0 20 20; font-size:1.5em'></input></td>";
	pauseScreenDiv += "</tr></table>";
	pauseScreenDiv += "</div></div>";

    classroomMonitorDiv += pauseScreenDiv;

    var studentProgressDiv = "<div id='studentProgressDiv'>";    
    studentProgressDiv += "<h2>Student Progress</h2>";
    
    //studentProgressDiv += "	";
    //display the percentage and an hr with a width of the percentage
	//teamPercentProjectCompleted = teamPercentProjectCompleted + "<hr size=3 color='black' width='" + teamPercentProjectCompleted + "' align='left' noshade>";
    studentProgressDiv += "</div>";
    
    classroomMonitorDiv += studentProgressDiv;
    
    classroomMonitorDiv += this.createClassroomMonitorTable();
    
    classroomMonitorDiv += "</div>";
    $('#gradeWorkDiv').html(classroomMonitorDiv);
    
    $('#teamStatusDialog').dialog({autoOpen:false, width:400, height:300});
    
    this.applyTableSorterToClassroomMonitorTable();
    
    this.startXMPP();
	eventManager.fire("classroomMonitorDisplayComplete");
	
	//perform scroll to top and page height resizing to remove scrollbars
	this.displayFinished();
};

View.prototype.createClassroomMonitorTable = function() {
	var displayGradeByTeamSelectPageHtml = "";
	
	//show the grading header buttons such as export and the other grading pages
	//displayGradeByTeamSelectPageHtml += this.getGradingHeaderTableHtml();
	
	//get the html that will be used to filter workgroups by period
	displayGradeByTeamSelectPageHtml += this.getPeriodRadioButtonTableHtml("displayGradeByTeamSelectPage");

	//start the table that will contain the teams to choose
	displayGradeByTeamSelectPageHtml += "<table id='chooseTeamToGradeTable' class='chooseTeamToGradeTable tablesorter'>";
	
	//the header row
	displayGradeByTeamSelectPageHtml += "<thead><tr><th class='gradeColumn col1'>"+this.getI18NString("period")+"</th>"+
			"<th class='gradeColumn col2'>"+this.getI18NString("team")+"</th>"+
			"<th class='gradeColumn col3'>Current Step</th>"+
			"<th>"+this.getI18NString("grading_grade_by_team_percentage_project_completed")+"</th>"+
			"<th>Status</th>"+
			"</tr></thead>";
	
	//retrieve an array of classmate objects in alphabetical order
	var classmatesInAlphabeticalOrder = this.getUserAndClassInfo().getClassmatesInAlphabeticalOrder();
	
	//get the node ids in the project
	var nodeIds = this.getProject().getNodeIds();
	
	//get the max score for the project
	var maxScoresSum = this.getMaxScoresSum(nodeIds);
	
	//get all the teacher workgroup ids including owner and shared
	var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	
	displayGradeByTeamSelectPageHtml += "<tbody>";
	
	//loop through all the student work objects
	for(var x=0; x<classmatesInAlphabeticalOrder.length; x++) {
		//get a vleState
		var student = classmatesInAlphabeticalOrder[x];
		
		//get the workgroup id
		var workgroupId = student.workgroupId;

		//get the user names for the workgroup
		var userNames = student.userName.replace(/:/g, "<br>");
		
		//get the period the workgroup is in
		var periodName = student.periodName;

		//add classes for styling
		var studentTRClass = "showScoreRow classroomMonitorStudentWorkRow studentWorkRow period" + periodName;
		
		//add the html row for this workgroup
		displayGradeByTeamSelectPageHtml += "<tr id='classroomMonitorWorkgroupRow_"+workgroupId+"' class='" + studentTRClass + "' onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + workgroupId + "'])\">";
		displayGradeByTeamSelectPageHtml += "<td class='showScorePeriodColumn'>" + periodName + "</td>";
		displayGradeByTeamSelectPageHtml += "<td class='showScoreWorkgroupIdColumn'>" + userNames + "</td>";
		displayGradeByTeamSelectPageHtml += "<td id='teamCurrentStep_" + workgroupId + "'>N/A</td>";
		displayGradeByTeamSelectPageHtml += "<td style='padding-left: 0pt;padding-right: 0pt' id='teamPercentProjectCompleted_" + workgroupId + "'>0%</td>";
		displayGradeByTeamSelectPageHtml += "<td id='teamStatus_" + workgroupId + "'></td></tr>";
		
		//showScoreSummaryHtml += "<tr class='" + studentTRClass + "'><td class='showScorePeriodColumn'>" + periodName + "</td><td class='showScoreWorkgroupIdColumn'>" + userNames + "</td><td class='showScoreScoreColumn'>" + totalScoreForWorkgroup + " / " + maxScoresSum + "</td></tr>";
	}
	
	displayGradeByTeamSelectPageHtml += "</tbody>";
	
	displayGradeByTeamSelectPageHtml += "</table>";
	
	displayGradeByTeamSelectPageHtml += "<div id='teamStatusDialog'></div>";
	
	//set the html into the div so it is displayed
	return displayGradeByTeamSelectPageHtml;
};

View.prototype.applyTableSorterToClassroomMonitorTable = function() {
     
    // add parser through the tablesorter addParser method 
    $.tablesorter.addParser({ 
        // set a unique id 
        id: 'completion', 
        is: function(s) { 
            // return false so this parser is not auto detected 
            return false; 
        }, 
        format: function(s) { 
            // format your data for normalization 
        	
        	/*
        	 * the values in the column are like "52%<hr>" so we need 
        	 * to sort by the value before '%'
        	 */
        	
        	//get the index of the '%'
        	var percentIndex = s.indexOf('%');
        	
        	// only get the number value before the '%'
        	var completion = s.substring(0, percentIndex);

        	//return the value before the '%'
            return completion; 
        }, 
        // set type, either numeric or text 
        type: 'numeric' 
    }); 
    
    /*
     * make the table sortable by any of its columns
     * 
     * the 3rd column requires
     * special sorting because the values in that column are like
     * "9 / 10" so we need to sort by the number value before the '/'
     * 
     * the 5th column requires special sorting to only look at the
     * percentage value and to ignore the <hr>
     */
    $("#chooseTeamToGradeTable").tablesorter({ 
        headers: { 
    		3: { 
        		sorter:'completion' 
    		}
        } 
    }); 	
};

/**
 * Generate and set the html to display the page for the teacher
 * to select a team to grade 
 */
View.prototype.displayGradeByTeamSelectPage = function() {
	// set gradingType to "team"
	this.gradingType = "team";
	
	//perform any display page startup tasks
	this.displayStart("displayGradeByTeamSelectPage");
	
	var displayGradeByTeamSelectPageHtml = "";
	
	displayGradeByTeamSelectPageHtml += "<div class='gradingTools'>";
	
	//show the grading header buttons such as export and the other grading pages
	displayGradeByTeamSelectPageHtml += this.getGradingHeaderTableHtml();
	
	//get the html that will be used to filter workgroups by period
	displayGradeByTeamSelectPageHtml += "<div id='periodSelect' class='gradingHeader'>" + this.getPeriodRadioButtonTableHtml("displayGradeByTeamSelectPage") + "</div>";
	
	//displayGradeByTeamSelectPageHtml += "<div id='gradeStepHeader'>"+this.getI18NString("grading_grade_by_team_header")+"</div>";
	//display Grade by Team header
	displayGradeByTeamSelectPageHtml += "<div id='gradeTeamHeader' class='gradingHeader'><span class='instructions'>"+this.getI18NString("grading_grade_by_team_header") + "</span>";
	displayGradeByTeamSelectPageHtml +=	"<div style='float:right;'>Search for student: <input type='text' id='chooseTeamToGrade_search' /></div><div style='clear:both;'></div></div>";
	
	//get the html that will be used to filter workgroups by period
	//displayGradeByTeamSelectPageHtml += this.getPeriodRadioButtonTableHtml("displayGradeByTeamSelectPage");

	displayGradeByTeamSelectPageHtml += "</div><div class='gradingContent'>";
	
	//start the table that will contain the teams to choose
	displayGradeByTeamSelectPageHtml += "<table id='chooseTeamToGradeTable' class='chooseTeamToGradeTable tablesorter'>";
	
	//the header row
	displayGradeByTeamSelectPageHtml += "<thead><tr><th class='gradeColumn col1'>"+this.getI18NString("period")+"</th>"+
			"<th class='gradeColumn col2'>"+this.getI18NString("team")+"</th>"+
			"<th class='gradeColumn col3'>"+this.getI18NString("grading_grade_by_team_teacher_graded_score")+"</th>"+
			"<th>"+this.getI18NString("grading_grade_by_step_items_to_review")+"</th><th>"+this.getI18NString("grading_grade_by_team_percentage_project_completed")+"</th></tr></thead>";
	
	//retrieve an array of classmate objects in alphabetical order
	var classmatesInAlphabeticalOrder = this.getUserAndClassInfo().getClassmatesInAlphabeticalOrder();
	
	//get the node ids in the project
	var nodeIds = this.getProject().getNodeIds();
	
	//get the max score for the project
	var maxScoresSum = this.getMaxScoresSum(nodeIds);
	
	//get all the teacher workgroup ids including owner and shared
	var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	
	displayGradeByTeamSelectPageHtml += "<tbody>";
	
	//loop through all the student work objects
	for(var x=0; x<classmatesInAlphabeticalOrder.length; x++) {
		//get a vleState
		var student = classmatesInAlphabeticalOrder[x];
		
		//get the workgroup id
		var workgroupId = student.workgroupId;

		//get the user names for the workgroup
		var userNames = student.userName.replace(/:/g, "<br>");
		
		//get the period the workgroup is in
		var periodName = student.periodName;

		//add classes for styling
		var studentTRClass = "showScoreRow studentWorkRow period" + periodName;
		
		//get the cumulative score for the workgroup
		var totalScoreForWorkgroup = this.annotations.getTotalScoreByToWorkgroupAndFromWorkgroups(workgroupId, teacherIds);
		
		//add the html row for this workgroup
		displayGradeByTeamSelectPageHtml += "<tr class='" + studentTRClass + "' onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + workgroupId + "'])\"><td class='showScorePeriodColumn'>" + periodName + "</td><td class='showScoreWorkgroupIdColumn'><a>" + userNames + "</a></td><td class='showScoreScoreColumn'>" + totalScoreForWorkgroup + " / " + maxScoresSum + "</td><td id='teamNumItemsNeedGrading_" + workgroupId + "'></td><td style='padding-left: 0pt;padding-right: 0pt' id='teamPercentProjectCompleted_" + workgroupId + "'></td></tr>";
		
		//showScoreSummaryHtml += "<tr class='" + studentTRClass + "'><td class='showScorePeriodColumn'>" + periodName + "</td><td class='showScoreWorkgroupIdColumn'>" + userNames + "</td><td class='showScoreScoreColumn'>" + totalScoreForWorkgroup + " / " + maxScoresSum + "</td></tr>";
	}
	
	displayGradeByTeamSelectPageHtml += "</tbody></table></div>";
	
	//set the html into the div so it is displayed
	document.getElementById('gradeWorkDiv').innerHTML = displayGradeByTeamSelectPageHtml;
	
	//calculate and display the grading statistics
	this.calculateGradingStatistics("team");
	
	//perform scroll to top and page height resizing to remove scrollbars
	this.displayFinished();
};

/**
 * Displays all students' uploaded files for this run in a popup
 * @return
 */
View.prototype.displayStudentUploadedFiles = function() {
	//check if the studentAssetsDiv exists
	if($('#studentAssetsDiv').size()==0){
		//it does not exist so we will create it
		$('#gradeWorkDiv').append('<div id="studentAssetsDiv" style="margin-bottom:.3em;"></div>');
				var assetEditorDialogHtml = "<div id='studentAssetEditorDialog' style='display: none;'><div class='hd'><div>Students' Files</div>" 
					+ "<div id='notificationDiv'></div>"
					+ "<div id='allStudentsAssets' class='bd'>"
					+ "</div></div><div class='bd'>"
					+ "</div></div>";
		$('#studentAssetsDiv').html(assetEditorDialogHtml);		
    }
	
	var done = function(){
		$('#studentAssetsDiv').dialog('close');			
	};

	$('#studentAssetsDiv').dialog({autoOpen:false,closeText:'',resizable:true,width:800,height:450,position:'center',modal:true,title:'Students\' Uploaded Files', buttons:{'Done':done}});

	var displayStudentAssets = function(workgroupAssetListsStr, view) {
		// clear out the panel
		$("#allStudentsAssets").html("");
		$('#studentAssetsDiv').dialog('open');
		$('#studentAssetEditorDialog').show();

		var getStudentUploadsBaseUrl = view.config.getConfigParam("getStudentUploadsBaseUrl");
		var workgroupAssetLists = JSON.parse(workgroupAssetListsStr);
		for (var i=0; i<workgroupAssetLists.length; i++) {
			var workgroupAssetList = workgroupAssetLists[i];
			var workgroupAssetsArr = JSON.parse(workgroupAssetList.assets);
			var currWorkgroupId = workgroupAssetList.workgroupId;
			var htmlForWorkgroup = "<div><h3>" + view.userAndClassInfo.getUserNameByUserId(currWorkgroupId) + "</h3>"
					+ "<ul>";
			for (var k=0; k < workgroupAssetsArr.length; k++) {
				var assetName = workgroupAssetsArr[k];
				var fileWWW = getStudentUploadsBaseUrl + "/" + currWorkgroupId + "/" + assetName;
				htmlForWorkgroup += "<li><a target=_blank href='"+fileWWW+"'>" + assetName + "</a></li>";
			}
			htmlForWorkgroup += "</ul></div>";
			$("#allStudentsAssets").append(htmlForWorkgroup);
		}
	};
	
	var workgroupsInClass = this.userAndClassInfo.getWorkgroupIdsInClass().join(":");
	this.connectionManager.request('POST', 1, this.getConfig().getConfigParam("viewStudentAssetsUrl"), {forward:'assetmanager', workgroups:workgroupsInClass, command: 'assetList'}, function(txt,xml,obj){displayStudentAssets(txt,obj);}, this);	
};

/**
 * Displays all the steps in the project as links. When a step is clicked on,
 * the user will be brought to a page that displays all the work for that
 * step from all students in the run.
 */
View.prototype.displayGradeByStepSelectPage = function() {
	// set gradingType to "step"
	this.gradingType = "step";
	
	//perform any display page startup tasks
	this.displayStart("displayGradeByStepSelectPage");
	
	//the html that will display all the steps in the project
	var displayGradeByStepSelectPageHtml = "";
	
	displayGradeByStepSelectPageHtml = "<div class='gradingTools'>";
	
	//show the grading header buttons such as export and the other grading pages
	displayGradeByStepSelectPageHtml += this.getGradingHeaderTableHtml();
	
	//get the html that will be used to filter grading statistics by period
	displayGradeByStepSelectPageHtml += "<div id='periodSelect' class='gradingHeader'>" + this.getPeriodRadioButtonTableHtml("displayGradeByStepSelectPage") + "</div>";
	
	//display Grade by Step header and statistics table
	displayGradeByStepSelectPageHtml += "<div id='gradeStepHeader' class='gradingHeader'><table id='statisticsTable'><tr><td class='col1'>" +
				"<span style='font-weight: bold; font-size: 1.1em;'>"+this.getI18NString("grading_grade_by_step_header")+"</span></td>" +
				"<td class='header col2'>"+this.getI18NString("grading_grade_by_step_point_value")+"</span></td>"+
				"<td class='header col3'>"+this.getI18NString("grading_grade_by_step_items_to_review")+"</td><td class='header col4'>"+this.getI18NString("grading_grade_by_step_average_class_score")+"</td>"+
				"<td class='header col5'>"+this.getI18NString("grading_grade_by_step_percent_completed_step")+"</td></tr></table></div>";
	
	displayGradeByStepSelectPageHtml += "</div><div class='gradingContent'>";
	
	//start the table that will contains links for the steps
	displayGradeByStepSelectPageHtml += "<table id='chooseStepToGradeTable' class='chooseStepToGradeTable'><tbody>";

	//reset the activity counter used to label activity numbers
	this.activityNumber = 0;
	
	/*
	 * get the html that displays all the steps for the project as links
	 * to pages where the teacher can grade the step
	 */
	displayGradeByStepSelectPageHtml += this.displayGradeByStepSelectPageHelper(this.getProject().getRootNode());

	//close the table
	displayGradeByStepSelectPageHtml += "</tbody></table>";
	
	displayGradeByStepSelectPageHtml += "</div>";
	
	//set the html into the div
	unlock();
	document.getElementById('gradeWorkDiv').innerHTML = displayGradeByStepSelectPageHtml;
	
	//calculate and display grading statistics
	this.calculateGradingStatistics("step");
	
	//perform scroll to top and page height resizing to remove scrollbars
	this.displayFinished();
};

/**
 * Recursive function that accumulates the html that displays all the activities
 * and steps in a project
 */
View.prototype.displayGradeByStepSelectPageHelper = function(node) {
	var displayGradeByStepSelectPageHtml = "";
	var nodeId = node.id;
	
	if(node.isLeafNode()) {
		//this node is a leaf/step

		//get the position as seen by the student
		var position = this.getProject().getVLEPositionById(nodeId);
		
		/* add the right html to the displayGradeByStepSelectPageHtml based on the given node's type */
		if(node.type == "HtmlNode" || node.type == "OutsideUrlNode" || (node.type == "FlashNode" && node.getContent().getContentJSON().enableGrading == false)) {
			displayGradeByStepSelectPageHtml += this.getGradeByStepSelectPageLinklessHtmlForNode(node, position, node.type);
		} else if(node.type=='DuplicateNode'){
			displayGradeByStepSelectPageHtml += this.getGradeByStepSelectPageHtmlForDuplicateNode(node, position);
		} else {
			displayGradeByStepSelectPageHtml += this.getGradeByStepSelectPageLinkedHtmlForNode(node, position, node.type);
		}
	} else {
		/*
		 * we need to skip the first sequence because that is always the
		 * master sequence. we will encounter the master sequence when 
		 * this.activityNumber is 0, so all the subsequent activities will
		 * start at 1.
		 */
		if(this.activityNumber != 0) {
			//this node is a sequence so we will display the activity number and title
			displayGradeByStepSelectPageHtml += "<tr><td class='chooseStepToGradeActivityTd'><h4>Activity " + this.activityNumber + ": " + node.getTitle() + "</h4></td><td class='header col2'></td><td class=' header col3'></td><td class='header col4'></td><td class='header col5'></td></tr>";
		}

		//increment the activity number
		this.activityNumber++;
		
		//loop through all its children
		for(var x=0; x<node.children.length; x++) {
			//get the html for the children
			displayGradeByStepSelectPageHtml += this.displayGradeByStepSelectPageHelper(node.children[x]);
		}
	}

	return displayGradeByStepSelectPageHtml;
};

/**
 * Creates and returns the linkless html for nodes given the node and the type. The
 * type is generally the node type but if this is being generated for a duplicate
 * node then the type is changed to reference the node that it is duplicating.
 * 
 * @param node
 * @param position
 * @param type
 */
View.prototype.getGradeByStepSelectPageLinklessHtmlForNode = function(node, position, type){
	return "<tr><td class='chooseStepToGradeStepTd' colspan='5'><p>Step: " + position + " " + node.getTitle() + " (" + type + ")</p></td></tr>";
};

/**
 * Creates and returns the html for duplicate nodes given the node and the position.
 * 
 * @param node
 * @param position
 */
View.prototype.getGradeByStepSelectPageHtmlForDuplicateNode = function(node, position){
	var realNode = node.getNode();
	var realPosition = this.getProject().getVLEPositionById(realNode.id);
	var type = 'Duplicate for ' + realNode.type + ' at ' + realPosition;
	
	return this.getGradeByStepSelectPageLinklessHtmlForNode(realNode, position, type);
};

/**
 * Creates and returns the linked html for nodes given the node, the position and the
 * type. The type is generally the node type but if this is being generated for a duplicate
 * node then the type is changed to reference the node that it is duplicating.
 * 
 * @param node
 * @param position
 * @param type
 */
View.prototype.getGradeByStepSelectPageLinkedHtmlForNode = function(node, position, type){
	//get the max score for this step, or "" if there is no max score
	var maxScore = this.getMaxScoreValueByNodeId(node.id);
	
	//create the tds for the period all statistics
	statisticsForNode = "<td class='statistic studentWorkRow col3 periodAll' id='stepNumItemsNeedGrading_" + node.id + "'></td><td class='statistic col4 studentWorkRow periodAll' id='stepAverageScore_" + node.id + "'></td><td style='padding-left: 0pt;padding-right: 0pt' class='statistic col5 studentWorkRow periodAll' id='stepPercentStudentsCompleted_" + node.id + "'></td>";
	
	//get the periods set up for this run by the teacher, this is a : delimited string
	var periodNamesString = this.getUserAndClassInfo().getPeriodName();
	
	//split the period names into an array
	var periodNamesArray = periodNamesString.split(":");
	
	//loop through all the period names
	for(var x=0; x<periodNamesArray.length; x++) {
		//get a period name
		var periodName = periodNamesArray[x];
		
		//create the td statistics for the current period name
		statisticsForNode += "<td class='statistic col3 studentWorkRow period" + periodName + "' id='stepNumItemsNeedGrading_" + node.id + "_period" + periodName + "' style='display:none'></td><td class='statistic col4 studentWorkRow period" + periodName + "' id='stepAverageScore_" + node.id + "_period" + periodName + "' style='display:none'></td><td class='statistic col5 studentWorkRow period" + periodName + "' id='stepPercentStudentsCompleted_" + node.id + "_period" + periodName + "' style='display:none'></td>";
	}
	
	//get the grading permission
	var maxScorePermission = this.isWriteAllowed();
	
	//the regular link to grade by step, this will show revisions for all steps except MySystemNode and SVGDrawNode
	var nodeLink = "<a onClick='eventManager.fire(\"displayGradeByStepGradingPage\",[\"" + position + "\", \"" + node.id + "\"])'>Step " + position + ":&nbsp;&nbsp;" + node.getTitle() + "&nbsp;&nbsp;&nbsp;<span class='nodeTypeClass'>(" + type + ")</span></a>";
	
	//this is a node that students perform work for so we will display a link
	return "<tr><td class='chooseStepToGradeStepTd col1'>" + nodeLink + "</td><td class='chooseStepToGradeMaxScoreTd col2 statistic'><input id='maxScore_" + node.id + "' type='text' value='" + maxScore + "' onblur='eventManager.fire(\"saveMaxScore\", [" + this.getConfig().getConfigParam('runId') + ", \"" + node.id + "\"])'" + maxScorePermission + "/></td>" + statisticsForNode + "</tr>";
};

/**
 * Obtains the number of rows the a textarea should have such that it will
 * not display vertical scrollbars
 * @param cols the number of columns in the textarea
 * @param value the text that is in the textarea
 * @return the number of rows to set for the textarea
 */
View.prototype.getTextAreaNumRows = function(cols, value) {
	//the number or rows the textarea should have to prevent a vertical scrollbar
	var newRowSize = 0;

	//the number of chars on the current line we're looking at
	var tempLineLength = 0;

	//the index of the last ' ' char
	var lastSpaceIndex = null;

	//the index of the last char that was used as a line break
	var lastLineBreak = 0;

	/*
	 * flag specifies whether any of the lines has overflowed past the right
	 * which causes a horizontal scrollbar to show up at the bottom of the
	 * textarea
	 */
	var overflow = false;

	//loop through each char in the value
	for(var x=0; x<value.length; x++) {
		//get the current char
		var c = value.charAt(x);

		if(c == '\n') {
			/*
			 * the char was a new line so we will increase the number of lines
			 * that we want in the textarea by 1
			 */
			newRowSize += 1;
			
			/* 
			 * set the last line break char index to the current x, this is
			 * used later to handle the overflow case
			 */
			lastLineBreak = x;

			/*
			 * set the temp line length to 0 since we will be starting on a new
			 * line since we've encountered a newline char
			 */
			tempLineLength = 0;

			/*
			 * set the last space index to null because we are starting on a new
			 * new line so there won't be a last space index yet
			 */
			lastSpaceIndex = null;
		} else if(c == ' ') {
			//set the last space index, this is used later to handle overflow
			lastSpaceIndex = x;

			//increase the count of the chars on the current line
			tempLineLength += 1;

			/*
			 * check if the current line is equal to or larger than the
			 * number of columns in the textarea
			 */
			if(tempLineLength >= cols) {
				//the line length was equal or larger so we need to move to a new line
				
				//increment the number of rows
				newRowSize += 1;

				//set the last line break char index to the current x 
				lastLineBreak = x;
				
				//reset the line length to 0 to get ready to count the next line's chars
				tempLineLength = 0;
			}
		} else if(c != ' ') {
			//increment the count of the chars on the current line
			tempLineLength += 1;

			/*
			 * check if the current line is equal to or larger than the
			 * number of columns in the textarea
			 */
			if(tempLineLength >= cols) {
				//get the next char in the line
				var nextCIndex = x + 1;
				var nextC = value.charAt(nextCIndex);

				if(nextC == ' ') {
					//the next char was a space or new line so we will end the line
					
					//increment the number of rows
					newRowSize += 1;

					//set the last line break char index to the next char
					lastLineBreak = nextCIndex;

					//reset the line length to 0 to get ready to count the next line's chars			
					tempLineLength = 0;
				} else if(nextC == '\n') {
					/*
					 * the next char is a new line but we don't need to do anything
					 * because when the x counter from the for loop moves to the 
					 * nextCIndex it will handle the new line
					 */
				} else {
					//next char is not a space or new line
					
					/*
					 * check if the last space index has already been used to
					 * count as a line break
					 */ 
					if(lastSpaceIndex == null || lastLineBreak == lastSpaceIndex) {
						/*
						 * we can't break up the line anymore which means this line
						 * will overflow past the right of the textarea and a 
						 * horizontal scrollbar will display at the bottom of the
						 * textarea
						 */
						overflow = true;
					} else {
						/*
						 * find the last space and end the line there since it hasn't 
						 * been used for a line break
						 */
						x = lastSpaceIndex;

						//increment the number of rows
						newRowSize += 1;

						//reset the line length to 0 to get ready to count the next line's chars
						tempLineLength = 0;

						/*
						 * set the last line break char index to the x that we have
						 * just updated
						 */ 
						lastLineBreak = x;
					}
				}
			}
		}
	}

	/*
	 * check if any lines overflowed past the right side, causing a horizontal
	 * scrollbar to show up
	 */
	if(overflow) {
		//provide an extra row to make up for the horizontal scrollbar
		newRowSize += 1;
	}

	/*
	 * provide an extra row so that there is an empty row at the bottom of the
	 * teacher comment to make it easier for teachers to place the cursor
	 * in the box to continue adding to the comment
	 */
	newRowSize += 1;

	/*
	 * return the number of rows the textarea should have so that there won't
	 * be a vertcal scroll bar
	 */
	return newRowSize;
};

/**
 * Sets the number of rows in the text area such that there are enough
 * rows to prevent a vertical scroll bar from displaying 
 * @param textArea a TextArea dom object
 */
View.prototype.resizeTextArea = function(textArea) {
	//get the number of cols in the textarea
	var cols = textArea.cols;

	//get the text in the text area
	var value = textArea.value;

	//check if the value is null
	if(value == null) {
		//set it to empty string
		value = "";
	}

	//set the number of rows
	textArea.rows = this.getTextAreaNumRows(cols, value);
};

/**
 * Displays the grading view for a step which includes all the student ids,
 * student work, and grading text box
 * @param stepNumber the position in the vle e.g. 1.3
 * @param nodeId the step to display the grading view for
 * @param showRevisions boolean whether to show revisions or not
 */
View.prototype.displayGradeByStepGradingPage = function(stepNumber, nodeId) {
	if(nodeId == null || nodeId == 'undefined') {
		return;
	}
	
	//perform any display page startup tasks
	this.displayStart("displayGradeByStepGradingPage", [stepNumber, nodeId]);
	
	var gradeByStepGradingPageHtml = "";
	
	gradeByStepGradingPageHtml = "<div class='gradingTools'>";
	
	//show the header with all the grading buttons
	gradeByStepGradingPageHtml += this.getGradingHeaderTableHtml();

	//get the html that will be used to filter grading display by period
	gradeByStepGradingPageHtml += "<div id='periodSelect' class='gradingHeader'>" + this.getPeriodRadioButtonTableHtml("displayGradeByStepGradingPage") + "</div>";

	//show the step title and prompt
	//gradeByStepGradingPageHtml += "<table class='objectToGradeHeaderTable'><tr><td class='objectToGradeTd'>" + stepNumber + " " + this.getProject().getNodeById(nodeId).getTitle() + "</td>";
	gradeByStepGradingPageHtml += "<div class='gradingHeader'><span class='instructions'>Current Step: " + stepNumber + " " + this.getProject().getNodeById(nodeId).getTitle() + " <span class='nodeTypeClass'>(" + this.getProject().getNodeById(nodeId).getType() + ")</span></span>";
	gradeByStepGradingPageHtml += "<div style='float:right;'>";
	
	var previousAndNextNodeIds = this.getProject().getPreviousAndNextNodeIds(nodeId);
	
	//show the button to go to the previous step in the project
	var previousButtonEvent, previousButtonClass = '';
	if(previousAndNextNodeIds.previousNodeId) {
		previousButtonEvent = "eventManager.fire(\"displayGradeByStepGradingPage\",[\"" + previousAndNextNodeIds.previousNodePosition + "\", \"" + previousAndNextNodeIds.previousNodeId + "\"])";
	} else {
		//if there is no previous step (because this is the first step), disable button
		previousButtonEvent = "return false;";
		previousButtonClass = "disabled";
	}
	
	//gradeByStepGradingPageHtml += "<td class='button'><a href='#' id='selectAnotherStep' onClick='" + previousButtonEvent + "'>"+this.getI18NString("grading_previous_step")+"</a></td>";
	gradeByStepGradingPageHtml += "<a class='selectStep previousButtonClass' onClick='" + previousButtonEvent + "'>"+this.getI18NString("grading_previous_step")+"</a>";
	
	//show the button to go back to select another step
	//gradeByStepGradingPageHtml += "<td class='button'><a href='#' id='selectAnotherStep' onClick='eventManager.fire(\"displayGradeByStepSelectPage\")'>"+this.getI18NString("grading_change_step")+"</a></td>";
	gradeByStepGradingPageHtml += "<a class='selectStep' onClick='eventManager.fire(\"displayGradeByStepSelectPage\")'>"+this.getI18NString("grading_change_step")+"</a>";
	
	//show the button to go to the next step in the project
	var nextButtonEvent, nextButtonClass = '';
	if(previousAndNextNodeIds.nextNodeId) {
		nextButtonEvent = "eventManager.fire(\"displayGradeByStepGradingPage\",[\"" + previousAndNextNodeIds.nextNodePosition + "\", \"" + previousAndNextNodeIds.nextNodeId + "\"])";
	} else {
		//if there is no next step (because this is the last step), disable button
		nextButtonEvent = "return false;";
		nextButtonClass = "disabled";
	}
	
	//gradeByStepGradingPageHtml += "<td class='button'><a href='#' id='selectAnotherStep' onClick='" + nextButtonEvent + "'>"+this.getI18NString("grading_next_step")+"</a></td>";
	gradeByStepGradingPageHtml += "<a class='selectStep nextButtonClass' onClick='" + nextButtonEvent + "'>"+this.getI18NString("grading_next_step")+"</a>";
	
	gradeByStepGradingPageHtml += "</div>";
	//gradeByStepGradingPageHtml += "</tr></table>";
	
	gradeByStepGradingPageHtml += "<div id='filterOptions'>";
	
	//check if hide personal info check box was previously checked
	var hidePersonalInfoChecked = '';
	if(this.gradingHidePersonalInfo) {
		hidePersonalInfoChecked = 'checked';
	}
	
	//check box to hide personal info
	gradeByStepGradingPageHtml += "<input type='checkbox' id='onlyShowWorkCheckBox' onClick=\"eventManager.fire('onlyShowWorkOnClick')\" " + hidePersonalInfoChecked + "/>"+
		"<p>"+this.getI18NString("grading_hide_personal_info")+"</p>";
	
	//check if show flagged items check box was previously checked
	var showFlaggedChecked = '';
	if(this.gradingShowFlagged) {
		showFlaggedChecked = 'checked';
	}
	
	//check if show smart-filtered items check box was previously checked
	var showSmartFilteredChecked = '';
	if(this.gradingShowSmartFiltered) {
		showSmartFilteredChecked = 'checked';
	}
	
	//check box to filter only flagged items
	gradeByStepGradingPageHtml += "<input type='checkbox' id='onlyShowFilteredItemsCheckBox' value='show filtered items' onClick=\"eventManager.fire('filterStudentRows')\" " + showFlaggedChecked + "/>"+
		"<p>"+this.getI18NString("grading_show_flagged_items_only")+"</p>";

	//check box to filter only items that passed the smartfilter
	gradeByStepGradingPageHtml += "<input type='checkbox' id='onlyShowSmartFilteredItemsCheckBox' value='show filtered items' onClick=\"eventManager.fire('filterStudentRows')\" " + showSmartFilteredChecked + "/>"+
		"<p id='onlyShowSmartFilteredItemsText'>"+this.getI18NString("grading_show_smart_filtered_items_only")+"</p>";

	//check if enlarge student work check box was previously checked
	var enlargeStudentWorkTextChecked = '';
	if(this.gradingEnlargeStudentWorkText) {
		enlargeStudentWorkTextChecked = 'checked';
	}
	
	//check box for enlarging the student work text
	gradeByStepGradingPageHtml += "<input type='checkbox' id='enlargeStudentWorkTextCheckBox' value='show filtered items' onClick=\"eventManager.fire('enlargeStudentWorkText')\" " + enlargeStudentWorkTextChecked + "/>"
		+"<p>"+this.getI18NString("grading_enlarge_student_work_text")+"</p>";
	
	//check if show revisions check box was previously checked
	var showRevisionsChecked = '';
	if(this.gradingShowRevisions) {
		showRevisionsChecked = 'checked';
	}
	
	if(this.getRevisions) {
		//check box for showing all revisions
		gradeByStepGradingPageHtml += "<input type='checkbox' id='showAllRevisions' value='show all revisions' onClick=\"eventManager.fire('filterStudentRows')\" " + showRevisionsChecked + "/>"+
			"<p style='display:inline'>"+this.getI18NString("grading_show_all_revisions")+"</p>";
	}
	
	//get the node content
	var nodeContent = this.project.getNodeById(nodeId).getContent().getContentJSON();
	
	//check if the content has grading criteria
	if(nodeContent.gradingCriteria != null) {
		//check if sort by auto graded score check box was previously checked
		var sortByAutoGradedScoreChecked = '';
		
		if(this.gradingSortByAutoGradedScore) {
			//checkbox was checked
			sortByAutoGradedScoreChecked = 'checked';
		}
		
		gradeByStepGradingPageHtml += "<input type='checkbox' id='sortByAutoGradedScoreCheckbox' value='sort by auto graded score checkbox' onClick=\"eventManager.fire('filterStudentRows')\" " + sortByAutoGradedScoreChecked + "/>"+
		"<p style='display:inline'>"+this.getI18NString("grading_sort_by_auto_graded_score_checkbox")+"</p>";
	}
	
	gradeByStepGradingPageHtml += "</div></div></div>"
	
	gradeByStepGradingPageHtml += "<div class='gradingContent'>";
	
	//show the button that toggles the question for the step
	gradeByStepGradingPageHtml += "<div class='questionContentContainer'><div class='questionContentHeader'><b>"+this.getI18NString("grading_question")+":</b>"+
		"<a onClick=\"eventManager.fire('togglePrompt', ['questionContentText_" + nodeId + "'])\">"+this.getI18NString("grading_hide_show_question")+"</a>";
	
	gradeByStepGradingPageHtml += "</div>";
	
	//get the prompt/question for the step
	var nodePrompt = this.getProject().getNodePromptByNodeId(nodeId);
	
	//the area where the question for the step will be displayed
	gradeByStepGradingPageHtml += "<div id='questionContentText_" + nodeId + "' class='questionContentText commentHidden'> " + nodePrompt + "</div></div>";

	//get the html that will display the radio buttons to filter periods
	//gradeByStepGradingPageHtml += this.getPeriodRadioButtonTableHtml("displayGradeByStepGradingPage");
	
	gradeByStepGradingPageHtml += "<div id='flaggedItems'></div>";

	//create the table that displays all the student data, student work, and grading text box
	gradeByStepGradingPageHtml += "<table id='studentWorkTable' class='studentWorkTable'>";

	//add the header for the table
	gradeByStepGradingPageHtml += "<thead id='studentWorkTableHeaderRow'><th class='gradeColumn workgroupIdColumn'>"+this.getI18NString("team_caps")+"</th>"+
		"<th class='gradeColumn workColumn'>"+this.getI18NString("student_work")+"</th>"+
		"<th class='gradeColumn gradingColumn'>"+this.getI18NString("teacher_comment_and_score")+"</th>"+
		"<th class='gradeColumn annotationColumn'>"+this.getI18NString("tools")+"</th></thead>";
	
	var vleStates = this.getVleStatesSortedByUserName();
	
	var runId = this.getConfig().getConfigParam('runId');
	
	var teacherId = this.getUserAndClassInfo().getWorkgroupId();
	
	var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	
	//get the node
	var node = this.getProject().getNodeById(nodeId);
	
	var nodeId = node.id;

	//loop through all the vleStates, each vleState is for a workgroup
	for(var x=0; x<vleStates.length; x++) {
		//get a vleState
		var vleState = vleStates[x];
		
		var workgroupId = vleState.dataId;

		//get the user names in the workgroup
		var userNamesHtml = this.getUserNamesByWorkgroupId(workgroupId, 0);
		
		var stepWorkId = null;
		var studentWork = null;
		var latestNodeVisitPostTime = null;
		
		//get the revisions
		var nodeVisitRevisions = vleState.getNodeVisitsWithWorkByNodeId(nodeId);
		
		var latestNodeVisit = null;
		
		if(nodeVisitRevisions.length > 0) {
			//get the latest work for the current workgroup
			latestNodeVisit = nodeVisitRevisions[nodeVisitRevisions.length - 1];
		}
		
		if (latestNodeVisit != null) {
			stepWorkId = latestNodeVisit.id;
			studentWork = latestNodeVisit.getLatestWork();
			latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
		}
		
		/*
		 * retrieve any peer or teacher review data, if the current node is
		 * not a peer or teacher review type step, the function will just
		 * return the unmodified studentWork back
		 */
		studentWork = this.getPeerOrTeacherReviewData(studentWork, node, workgroupId, vleState);
		
		//get the annotations data for this student/step combination
		var annotationData = this.getAnnotationData(runId, nodeId, workgroupId, teacherIds);
		var annotationCommentValue = annotationData.annotationCommentValue;
		var annotationScoreValue = annotationData.annotationScoreValue;
		var latestAnnotationPostTime = annotationData.latestAnnotationPostTime;
		
		//get the period name for this student
		var periodName = this.getUserAndClassInfo().getClassmatePeriodNameByWorkgroupId(workgroupId);

		//get the latest flag value
		var latestFlag = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherIds, 'flag');

		//default will be unchecked/unflagged
		var flagChecked = "";
		var isFlagged = 'false';
		
		//we found a flag annotation
		if(latestFlag) {
			//check if it is 'flagged' or 'unflagged'
			if(latestFlag.value == 'flagged') {
				//the value of the flag is 'flagged' so the checkbox will be checked
				flagChecked = " checked";
				isFlagged = 'true';
			}
		}
		
		//make the css class for the row
		var studentTRClass = "studentWorkRow period" + periodName;
		
		// if student has no work, add a noWork class to the row
		if (latestNodeVisit == null) {
			studentTRClass += " noWork";
		}
		
		//see if there is any new work so we can add the css class to highlight the row
		if(latestAnnotationPostTime < latestNodeVisitPostTime) {
			studentTRClass += " newWork";
		}
		
		//make the student work row DOM id
		var studentWorkRowId = "studentWorkRow_" + workgroupId + "_" + nodeId + "_" + stepWorkId;
		
		//add the row id to our array so we can remember the original order of these rows
		this.originalStudentWorkRowOrder.push(studentWorkRowId);
		
		//make the row for this student
		gradeByStepGradingPageHtml += "<tr class='" + studentTRClass + "' id='" + studentWorkRowId + "' isFlagged='" + isFlagged + "'>";
		
		var toggleRevisionsLink = "";
		if(nodeVisitRevisions.length > 1) {
			//there is more than one revision so we will display a link that will display the other revisions
			toggleRevisionsLink = "<a onClick=\"eventManager.fire('toggleGradingDisplayRevisions', ['" + workgroupId + "', '" + nodeId + "'])\">"+(nodeVisitRevisions.length-1)+ " " + this.getI18NString("grading_hide_show_revisions")+"</a>";
		} else if(nodeVisitRevisions.length == 1) {
			if(this.getRevisions) {
				//we retrieved all revisions so that means there are no other revisions
				toggleRevisionsLink = this.getI18NString("grading_no_revisions");
			} else {
				//we only retrieved the latest revision so there may be other revisions
				toggleRevisionsLink = this.getI18NString("grading_only_latest_revision_displayed");
			}
		} else if(nodeVisitRevisions.length == 0) {
			//there are no revisions
			toggleRevisionsLink = this.getI18NString("grading_no_revisions");
		}
		
		//display the student workgroup id
		gradeByStepGradingPageHtml += "<td class='gradeColumn workgroupIdColumn'><div><a onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + workgroupId + "'])\">" + userNamesHtml + "</a></div>"+
			"<div>"+this.getI18NString("period")+" " + periodName + "</div><div>" + toggleRevisionsLink + "</div></td>";
		
		//make the css class for the td that will contain the student's work
		var studentWorkTdClass = "gradeColumn workColumn";
		
		//check if we want to enable/disable grading for this student/row
		var isGradingDisabled = "";
		if(studentWork == null) {
			//the student has not done any work for this step so we will disable grading
			isGradingDisabled = "disabled";
		} else {
			//get the permission the currently logged in user has for this run
			isGradingDisabled = this.isWriteAllowed();
		}
		
		//get the html for the student work td
		gradeByStepGradingPageHtml += this.getStudentWorkTdHtml(studentWork, node, stepWorkId, studentWorkTdClass, latestNodeVisitPostTime);
		
		//make the css class for the td that will contain the score and comment boxes
		var scoringAndCommentingTdClass = "gradeColumn gradingColumn";
		
		//get the html for the score and comment td
		gradeByStepGradingPageHtml += this.getScoringAndCommentingTdHtml(workgroupId, nodeId, teacherId, runId, stepWorkId, annotationScoreValue, annotationCommentValue, latestAnnotationPostTime, isGradingDisabled, scoringAndCommentingTdClass, studentWork, studentWorkRowId);

		//make the css class for the td that will contain the flag checkbox
		var flaggingTdClass = "gradeColumn toolsColumn";
		
		//get the html for the flag td
		gradeByStepGradingPageHtml += this.getFlaggingTdHtml(workgroupId, nodeId, teacherId, runId, stepWorkId, isGradingDisabled, flagChecked, flaggingTdClass);
		
		//close the row for the student
		gradeByStepGradingPageHtml += "</tr>";
		
		//check if there was more than one revision		
		if(nodeVisitRevisions.length > 1) {
			//loop through the revisions from most recent to oldest
			for(var revisionCount=nodeVisitRevisions.length - 2; revisionCount>=0; revisionCount--) {
				//get a node visit
				var nodeVisitRevision = nodeVisitRevisions[revisionCount];
				var revisionPostTime = nodeVisitRevision.visitPostTime;
				
				//get the work from the node visit
				var revisionWork = nodeVisitRevision.getLatestWork();
				
				//get the stepWorkId of the revision
				var revisionStepWorkId = nodeVisitRevision.id;
				
				//get the annotation data for the revision if any
				var annotationDataForRevision = this.getAnnotationDataForRevision(revisionStepWorkId);
				var annotationCommentValue = annotationDataForRevision.annotationCommentValue;
				var annotationScoreValue = annotationDataForRevision.annotationScoreValue;
				var latestAnnotationPostTime = annotationDataForRevision.latestAnnotationPostTime;
				
				var isGradingDisabled = "disabled";
				
				//default will be unchecked/unflagged
				var flagChecked = "";
				var isFlagged = 'false';
				
				//make the student work revision DOM id
				var studentWorkRowRevisionId = "studentWorkRow_"+workgroupId+"_"+nodeId+"_" + revisionStepWorkId;
				
				//add the row id to our array so we can remember the original order of these rows
				this.originalStudentWorkRowOrder.push(studentWorkRowRevisionId);
				
				//display the data for the revision
				gradeByStepGradingPageHtml += "<tr id='" + studentWorkRowRevisionId + "' class='studentWorkRow period" + periodName + " studentWorkRevisionRow studentWorkRevisionRow_" + workgroupId + "_" + nodeId + "' style='display:none' isFlagged='" + isFlagged + "'>";
				gradeByStepGradingPageHtml += "<td class='gradeColumn workgroupIdColumn'><div>" + userNamesHtml + "</div><div>Revision " + (revisionCount + 1) + "</div></td>";
				gradeByStepGradingPageHtml += this.getStudentWorkTdHtml(revisionWork, node, revisionStepWorkId, studentWorkTdClass, revisionPostTime);
				gradeByStepGradingPageHtml += this.getScoringAndCommentingTdHtml(workgroupId, nodeId, teacherId, runId, revisionStepWorkId, annotationScoreValue, annotationCommentValue, latestAnnotationPostTime, isGradingDisabled, scoringAndCommentingTdClass, revisionWork);
				gradeByStepGradingPageHtml += this.getFlaggingTdHtml(workgroupId, nodeId, teacherId, runId, revisionStepWorkId, isGradingDisabled, flagChecked, flaggingTdClass);
				gradeByStepGradingPageHtml += "</tr>";
				
				//get the array of revision objects for this latest studentWorkRowId
				var studentWorkRowRevisionObject = this.studentWorkRowRevisions[studentWorkRowId];
				
				if(studentWorkRowRevisionObject == null) {
					//the entry does not exist so we will make it
					this.studentWorkRowRevisions[studentWorkRowId] = [];
				}
				
				//add this student work row revision id to the array for the student work row id
				this.studentWorkRowRevisions[studentWorkRowId].push(studentWorkRowRevisionId);
			}
		}
	}
	
	//close the table that contains all the student rows
	//gradeByStepGradingPageHtml += "</table><div id='lowerSaveButton'><input type='button' value='"+this.getI18NString("grading_button_save_changes")+"' onClick=\"notificationManager.notify('Changes have been successfully saved.')\"></input></div>";
	gradeByStepGradingPageHtml += "</table></div></div>";
	
	//set the html in the div so the user can see it
	document.getElementById('gradeWorkDiv').innerHTML = gradeByStepGradingPageHtml;
	
	//render all the student work for the step
	this.renderAllStudentWorkForNode(node);
	
	// if this step is a mysystem step, call showDiagrams for each div that has student data
	if (node.type == "MySystemNode") {
		$(".mysystemCell").each(showDiagramNode);
	}
	
	// if this step is an svgdraw step, call showDrawNode for each div that has student data
	if (node.type == "SVGDrawNode") {
		$(".svgdrawCell").each(showDrawNode);
		$(".snapCell").each(showSnaps);
	}
	
	// make table sortable by any of its columns, TODO: re-enable
	/*var oTable2 = $("#studentWorkTable").dataTable({
    	"bSort": false,
    	"iDisplayLength": -1,
    	"sDom": '<rt>'
    });
    
    // detach any existing FixedHeader clones
    $('.fixedHeader').detach();
    
    //new FixedHeader( oTable, {"right": true} );  // for some reason, this causes an ActiveX error in mysystem_complete.js!
    new FixedHeader( oTable2 ); */
	
	//perform scroll to top and page height resizing to remove scrollbars
	this.displayFinished();
};

/**
 * Calculates the grading statistics for the gradingType
 * @param gradingType
 * @return
 */
View.prototype.calculateGradingStatistics = function(gradingType) {
	/*
	 * check to make sure the student work has been retrieved otherwise
	 * we can't calculate the statistics
	 */
	if(this.vleStates != null) {
		//check if gradingType was passed into this fuction
		if(gradingType == null) {
			//gradingType was not passed in so we will retrieve it from the config
			gradingType = this.getConfig().getConfigParam('gradingType');	
		}
		
		if(gradingType == "step") {
			//get statistics for gradebystep
			this.calculateGradeByStepGradingStatistics(this.getProject().getRootNode());	
		} else if(gradingType == "team") {
			//get statistics for gradebyteam
			this.calculateGradeByTeamGradingStatistics();
		}
		
	}
};

/**
 * Calculate and set the gradebyteam statistics
 * @return
 */
View.prototype.calculateGradeByTeamGradingStatistics = function() {
	/*
	 * get all the leaf nodes in the project except for HtmlNodes
	 * this is a : delimited string of nodeIds
	 */
	var nodeIds = this.getProject().getNodeIds();
	
	//get the run id
	var runId = this.getConfig().getConfigParam('runId');
	
	//get the teacher id
	var teacherId = this.getUserAndClassInfo().getWorkgroupId();
	
	//get all the teacher ids
	var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	
	//loop through all the vleStates, each vleState is for a workgroup
	for(var x=0; x<this.vleStates.length; x++) {
		//get a vleState
		var vleState = this.vleStates[x];
		
		//get the workgroup id
		var workgroupId = vleState.dataId;
		
		//the number of items that need grading for the current workgroupId
		var numItemsNeedGrading = 0;
		
		//the number of steps the current workgroupId has completed
		var numStepsCompleted = 0;
		
		//loop through all the nodeIds
		for(var y=0; y<nodeIds.length; y++) {
			var nodeId = nodeIds[y];
			
			//get the latest work for the current workgroup 
			var latestNodeVisit = vleState.getLatestNodeVisitByNodeId(nodeId);
			var latestNodeVisitPostTime = null;
			
			//check if there was any work
			if (latestNodeVisit != null) {
				//student has completed this step so we will increment the counter
				numStepsCompleted++;

				//get the timestamp for this latest work
				latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
			}
			
			//get the annotations data for this student/step combination
			var annotationData = this.getAnnotationData(runId, nodeId, workgroupId, teacherIds);

			//get the timestamp for the latest annotation
			var latestAnnotationPostTime = annotationData.latestAnnotationPostTime;
			
			//see if the teacher has graded the latest work
			if(latestNodeVisitPostTime > latestAnnotationPostTime) {
				//the teacher has not graded the latest work
				numItemsNeedGrading++;
			}
		}
		
		//for the current team, calculate the percentage of the project they have completed
		var teamPercentProjectCompleted = Math.floor((numStepsCompleted / nodeIds.length) * 100) + "%";
		
		//display the percentage and jqueryui progressbar elements
		var completedVal = parseInt(teamPercentProjectCompleted.replace('%',''));
		//percentStudentsCompletedStep = percentStudentsCompletedStep + "<hr width='" + percentStudentsCompletedStep + "' size=" + percentBarSize + " color='black' align='left' noshade>";
		teamPercentProjectCompleted = "<div class='pLabel'>" + teamPercentProjectCompleted + "</div><div id='progress_" + workgroupId + "' class='progress'></div>";
			
		//display the percentage and an hr with a width of the percentage
		//teamPercentProjectCompleted = teamPercentProjectCompleted + "<hr size=3 color='black' width='" + teamPercentProjectCompleted + "' align='left' noshade>";
		
		//total score is calculated within displayGradeByTeamSelectPage()
		
		//set the number of items that need scoring for this team
		document.getElementById("teamNumItemsNeedGrading_" + workgroupId).innerHTML = numItemsNeedGrading;
		
		//set the percentage of the project the team has completed and jqueryui progressbar
		document.getElementById("teamPercentProjectCompleted_" + workgroupId).innerHTML = teamPercentProjectCompleted;
		var item = document.getElementById("progress_" + workgroupId);
		$(item).progressbar({value: completedVal});
	}
	
	// make table sortable by any of its columns
	var oTable = $("#chooseTeamToGradeTable").dataTable({
    	"aaSorting": [[1,'asc']],
    	"iDisplayLength": -1,
    	"sDom": '<rt>'
    });
    
    // detach any existing FixedHeader clones
    $('.fixedHeader').detach();
    
    //new FixedHeader( oTable, {"right": true} );  // for some reason, this causes an ActiveX error in mysystem_complete.js!
    new FixedHeader( oTable ); 
    
    // set up search input
    $('input#chooseTeamToGrade_search').keypress(function(e) {
		if(e.keyCode === 13) {
			var val = $(this).val();
    		oTable.fnFilter(val);
    	}
    });
        
    // add parser through the tablesorter addParser method 
    /*$.tablesorter.addParser({ 
        // set a unique id 
        id: 'grades', 
        is: function(s) { 
            // return false so this parser is not auto detected 
            return false; 
        }, 
        format: function(s) { 
            // format your data for normalization */
        	
        	/*
        	 * the values in the column are like "9 / 10" so we need 
        	 * to sort by the number value before the '/'
        	 */
        	
        	//get the index of the '/'
        	//var slashIndex = s.indexOf('/');
        	
        	/*
        	 * get only the number value before the '/', we need to
        	 * subtract 1 because the value is like "9 / 10" and we
        	 * want to get rid of the space before the '/'
        	 */
        	/*var score = s.substring(0, slashIndex - 1);

        	//return the value before the '/'
            return score; 
        }, 
        // set type, either numeric or text 
        type: 'numeric' 
    }); */
     
    // add parser through the tablesorter addParser method 
   /* $.tablesorter.addParser({ 
        // set a unique id 
        id: 'completion', 
        is: function(s) { 
            // return false so this parser is not auto detected 
            return false; 
        }, 
        format: function(s) { 
            // format your data for normalization */
        	
        	/*
        	 * the values in the column are like "52%<hr>" so we need 
        	 * to sort by the value before '%'
        	 */
        	
        	//get the index of the '%'
        	/*var percentIndex = s.indexOf('%');
        	
        	// only get the number value before the '%'
        	var completion = s.substring(0, percentIndex);

        	//return the value before the '%'
            return completion; 
        }, 
        // set type, either numeric or text 
        type: 'numeric' 
    }); */
    
    /*
     * make the table sortable by any of its columns
     * 
     * the 3rd column requires
     * special sorting because the values in that column are like
     * "9 / 10" so we need to sort by the number value before the '/'
     * 
     * the 5th column requires special sorting to only look at the
     * percentage value and to ignore the <hr>
     */
    
    /*$("#chooseTeamToGradeTable").tablesorter({ 
        headers: { 
            2: { 
                sorter:'grades' 
            },
    		4: { 
        		sorter:'completion' 
    		}
        } 
    });*/ 
	
	this.displayFinished();
};

/**
 * Calculate and set the gradebystep statistics
 * @param node
 * @return
 */
View.prototype.calculateGradeByStepGradingStatistics = function(node) {
	var nodeId = node.id;
	
	if(node.isLeafNode()) {
		//this node is a leaf/step

		if(node.type == "HtmlNode" || node.type == "OutsideUrlNode" || node.type == 'DuplicateNode' ||
				(node.type == "FlashNode" && node.getContent().getContentJSON().enableGrading == false)) {

		} else {
			//calculate the grading statistics for this step
			var gradeByStepGradingStatistics = this.getGradeByStepGradingStatistics(nodeId);
			
			//set the average score for this step
			document.getElementById("stepAverageScore_" + nodeId).innerHTML = gradeByStepGradingStatistics.averageScore;
			
			//set the number of items that need scoring for this step
			document.getElementById("stepNumItemsNeedGrading_" + nodeId).innerHTML = gradeByStepGradingStatistics.numItemsNeedScoring;
			
			var percentStudentsCompletedStep = gradeByStepGradingStatistics.percentStudentsCompletedStep;
			
			//the default bar size, we will use this for the thickness of the hr
			var percentBarSize = 0;
			
			//check if the percent complete is 0%
			if(percentStudentsCompletedStep != '0%') {
				//set the thickness to 3
				percentBarSize = 3;
			}
			
			//display the percentage and jqueryui progressbar
			var completedVal = parseInt(percentStudentsCompletedStep.replace('%',''));
			//percentStudentsCompletedStep = percentStudentsCompletedStep + "<hr width='" + percentStudentsCompletedStep + "' size=" + percentBarSize + " color='black' align='left' noshade>";
			percentStudentsCompletedStep = "<div class='pLabel'>" + percentStudentsCompletedStep + "</div><div id='progress_" + nodeId + "' class='progress'></div>";
			
			//set the percentage of the class that has completed this step
			document.getElementById("stepPercentStudentsCompleted_" + nodeId).innerHTML = percentStudentsCompletedStep;
			
			var item = document.getElementById("progress_" + nodeId);
			$(item).progressbar({value: completedVal});
			
			//loop through the periods
			for(var x=0; x<gradeByStepGradingStatistics.periods.length; x++) {
				//get the statistics for a period
				var periodGradingStatisticsObject = gradeByStepGradingStatistics.periods[x];
				
				//get the period name
				var periodName = periodGradingStatisticsObject.periodName;
				
				//get the statistics values
				var numItemsNeedScoring = periodGradingStatisticsObject.numItemsNeedGrading;
				var percentStudentsCompletedStep = periodGradingStatisticsObject.percentStudentsCompletedStep;
				var completedValue = parseInt(percentStudentsCompletedStep.replace('%',''));
				percentStudentsCompletedStep = "<div class='pLabel'>" + percentStudentsCompletedStep + "</div><div id='progress_" + nodeId + "_period" + periodName + "' class='progress'></div>";
				var averageScore = periodGradingStatisticsObject.averageScore;
				
				//set the statistics values into the display elements
				document.getElementById("stepAverageScore_" + nodeId + "_period" + periodName).innerHTML = averageScore;
				document.getElementById("stepNumItemsNeedGrading_" + nodeId + "_period" + periodName).innerHTML = numItemsNeedScoring;
				document.getElementById("stepPercentStudentsCompleted_" + nodeId + "_period" + periodName).innerHTML = percentStudentsCompletedStep;
				// display percentage and jqueryui progressbar
				var currentItem = document.getElementById("progress_" + nodeId + "_period" + periodName);
				$(currentItem).progressbar({value: completedValue});
			}
		}
	} else {
		//loop through all its children
		for(var x=0; x<node.children.length; x++) {
			this.calculateGradeByStepGradingStatistics(node.children[x]);
		}
	}
};

/**
 * Calculate the gradebystep statistics for a specific step
 * @param nodeId the node id of the step
 * @return an object containing the statistics values
 */
View.prototype.getGradeByStepGradingStatistics = function(nodeId) {
	//the object to contain the statistics values and return
	var gradingStatistics = {};
	
	//counter for the number of student work that needs grading
	var numItemsNeedGrading = 0;
	
	//get the run id
	var runId = this.getConfig().getConfigParam('runId');
	
	//get the teacher workgroup id
	var teacherId = this.getUserAndClassInfo().getWorkgroupId();
	
	//get all the teacher workgroup ids
	var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	
	//counter for the number of students who have completed work for this step
	var numStudentsCompletedStep = 0;
	
	//sum of all the scores that the teacher has given for this step, does not include non-scored
	var sumOfScoredValues = 0;
	
	//number of scores the teacher has given out, does not include non-scored
	var numOfScoredValues = 0;
	
	//the max score for this step
	var maxScore = this.getMaxScoreValueByNodeId(nodeId);
	
	//loop through all the vleStates, each vleState is for a workgroup
	for(var x=0; x<this.vleStates.length; x++) {
		//get a vleState
		var vleState = this.vleStates[x];
		
		//get the workgroup id
		var workgroupId = vleState.dataId;
		
		//get the period name the current workgroupId is in
		var periodName = this.getUserAndClassInfo().getClassmatePeriodNameByWorkgroupId(workgroupId);
		
		//get the statistics object for the period
		var periodGradingStatistics = this.getPeriodGradingStatisticsObject(gradingStatistics, periodName);

		//get the latest work for the current workgroup 
		var latestNodeVisit = vleState.getLatestNodeVisitByNodeId(nodeId);
		var latestNodeVisitPostTime = null;
		
		//check if the student did any work for the step
		if (latestNodeVisit != null) {
			//increment the counter since this student did work for this step
			numStudentsCompletedStep++;
			periodGradingStatistics.numStudentsCompletedStep++;
			
			//get the timestamp for the work
			latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
		}
		
		//get the annotations data for this student/step combination
		var annotationData = this.getAnnotationData(runId, nodeId, workgroupId, teacherIds);

		//get the graded score
		var annotationScoreValue = annotationData.annotationScoreValue;
		
		//get the timestamp of the grade if any
		var latestAnnotationPostTime = annotationData.latestAnnotationPostTime;
		
		//check if the teacher has given a score
		if(annotationScoreValue != null && annotationScoreValue != "") {
			//add the score to our sum
			sumOfScoredValues += parseFloat(annotationScoreValue);
			
			//add the score to the period statistics
			periodGradingStatistics.sumOfScoredValues += parseFloat(annotationScoreValue);
			
			//increment the number of scores the teacher has given out
			numOfScoredValues++;
			
			//increment the value in the period statistics
			periodGradingStatistics.numOfScoredValues++;
		}
		
		//check if the work is newer than the last time the teacher graded
		if(latestNodeVisitPostTime > latestAnnotationPostTime) {
			//this item needs grading so we will increment the counter
			numItemsNeedGrading++;
			
			//increment the value in the period statistics
			periodGradingStatistics.numItemsNeedGrading++;
		}
		
		periodGradingStatistics.numStudentsInPeriod++;
	}

	//calculate the percentage of students who have completed this step
	var percentStudentsCompletedStep = Math.floor((numStudentsCompletedStep / this.vleStates.length) * 100) + "%";
	
	//calculate the average score for the scores that were given for this step
	var averageScore = sumOfScoredValues / numOfScoredValues;
	
	if(isNaN(averageScore)) {
		averageScore = "N/A";
	} else {
		var averageScoreString = averageScore.toString();
		
		var indexOfDecimal = averageScoreString.indexOf(".");
		
		if(indexOfDecimal != -1) {
			//there is a decimal
			
			//get the digits after the decimal
			var substringOf = averageScoreString.substring(indexOfDecimal + 1);
			
			if(substringOf.length > 1) {
				/*
				 * there are more than two digits after the decimal so we will
				 * truncate down to two decimals
				 */
				averageScore = averageScore.toFixed(1);
			}
		}
	}
	
	//set the statistics into the object that we will return
	gradingStatistics.numItemsNeedScoring = numItemsNeedGrading;
	gradingStatistics.percentStudentsCompletedStep = percentStudentsCompletedStep;
	gradingStatistics.averageScore = averageScore;
	
	//calculate the statistics for all the periods
	this.calculatePeriodGradingStatistics(gradingStatistics);
	
	return gradingStatistics;
};

/**
 * Get the statistics object for a specific period. Creates an object
 * and sets it into the gradingStatistics periods array if it does not
 * exist
 * @param gradingStatistics the object that holds all the statistics
 * including the array of period statistics
 * @param periodName the name of the period
 * @return the statistics object for the period with the given name
 */
View.prototype.getPeriodGradingStatisticsObject = function(gradingStatistics, periodName) {
	//create an array to hold the period statistics if it does not exist
	if(gradingStatistics.periods == null) {
		gradingStatistics.periods = [];
	}
	
	var periodGradingStatisticsObject = null;
	
	/*
	 * loop through the array of period statistics objects to try to find
	 * the one we want
	 */
	for(var x=0; x<gradingStatistics.periods.length; x++) {
		//get a period
		var period = gradingStatistics.periods[x];
		
		//check if the period is the one we want
		if(period.periodName == periodName) {
			//we found the one we want
			periodGradingStatisticsObject = period;
			break;
		}
	}
	
	//check if we found the period we wanted
	if(periodGradingStatisticsObject == null) {
		/*
		 * we didn't find the one we wanted because it doesn't exist,
		 * we will now make it
		 */
		periodGradingStatisticsObject = {};
		periodGradingStatisticsObject.periodName = periodName;
		periodGradingStatisticsObject.numItemsNeedGrading = 0;
		periodGradingStatisticsObject.numStudentsCompletedStep = 0;
		periodGradingStatisticsObject.sumOfScoredValues = 0;
		periodGradingStatisticsObject.numOfScoredValues = 0;
		periodGradingStatisticsObject.numStudentsInPeriod = 0;
		
		//add the new period statistics object to the array
		gradingStatistics.periods.push(periodGradingStatisticsObject);
	}
	
	//return the period statistics object
	return periodGradingStatisticsObject;
};

/**
 * Calculate the statistics for all the periods in the gradingStatistics object
 * @param gradingStatistics the object that contains the array of period statistics values
 */
View.prototype.calculatePeriodGradingStatistics = function(gradingStatistics) {
	//create the array of periods if it does not exist
	if(gradingStatistics.periods == null) {
		gradingStatistics.periods = [];
	}
	
	//loop through all the periods
	for(var x=0; x<gradingStatistics.periods.length; x++) {
		//get a period
		var period = gradingStatistics.periods[x];
		
		//get the values needed to calculate the statistics
		var numStudentsCompletedStep = period.numStudentsCompletedStep;
		var numItemsNeedGrading = period.numItemsNeedGrading;
		var sumOfScoredValues = period.sumOfScoredValues;
		var numOfScoredValues = period.numOfScoredValues;
		var numStudentsInPeriod = period.numStudentsInPeriod;
		
		//calculate the percentage of students who have completed this step
		var percentStudentsCompletedStep = Math.floor((numStudentsCompletedStep / numStudentsInPeriod) * 100) + "%";
		
		//calculate the average score for the scores that were given for this step
		var averageScore = sumOfScoredValues / numOfScoredValues;
		
		if(isNaN(averageScore)) {
			averageScore = "N/A";
		} else {
			var averageScoreString = averageScore.toString();
			
			var indexOfDecimal = averageScoreString.indexOf(".");
			
			if(indexOfDecimal != -1) {
				//there is a decimal
				
				//get the digits after the decimal
				var substringOf = averageScoreString.substring(indexOfDecimal + 1);
				
				if(substringOf.length > 1) {
					/*
					 * there are more than two digits after the decimal so we will
					 * truncate down to two decimals
					 */
					averageScore = averageScore.toFixed(1);
				}
			}
		}
		
		//set the statistics into the object that we will return
		period.numItemsNeedScoring = numItemsNeedGrading;
		period.percentStudentsCompletedStep = percentStudentsCompletedStep;
		period.averageScore = averageScore;
	}
};

/**
 * Get the annotation data that we need for displaying to the teacher
 * @param runId the id of the run
 * @param nodeId the id of the node
 * @param workgroupId the id of the workgroup/student
 * @param teacherId the id of the teacher
 * @return an object containing annotationScoreValue, annotationCommentValue, and latestAnnotationPostTime
 */
View.prototype.getAnnotationData = function(runId, nodeId, workgroupId, teacherIds) {
	return this.getAnnotationDataHelper(runId, nodeId, workgroupId, teacherIds, null);
};

/**
 * Get the annotation data given a stepWorkId
 * @param stepWorkId the id of the step work
 * @return an object containing annotationScoreValue, annotationCommentValue, and latestAnnotationPostTime
 */
View.prototype.getAnnotationDataForRevision = function(stepWorkId) {
	return this.getAnnotationDataHelper(null, null, null, null, stepWorkId);
};

/**
 * Get the annotation data given the arguments. You may either pass in
 * runId, nodeId, workgroupId, teacherIds
 * or just
 * stepWorkId
 * 
 * @param runId
 * @param nodeId
 * @param workgroupId
 * @param teacherIds an array of teacher ids
 * @param stepWorkId
 * @return an object containing annotationScoreValue, annotationCommentValue, and latestAnnotationPostTime
 */
View.prototype.getAnnotationDataHelper = function(runId, nodeId, workgroupId, teacherIds, stepWorkId) {
	var annotationData = new Object();
	var annotationComment = null;
	var annotationScore = null;
	
	if(stepWorkId == null) {
		//obtain the annotation for this workgroup and step if any
		var annotationComment = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherIds, "comment");
		var annotationScore = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherIds, "score");
	} else {
		//obtain the annotation for this workgroup and step if any
		var annotationComment = this.annotations.getAnnotationByStepWorkIdType(stepWorkId, "comment");
		var annotationScore = this.annotations.getAnnotationByStepWorkIdType(stepWorkId, "score");	
	}
	
	//the value to display in the comment text box
	annotationData.annotationCommentValue = "";
	annotationData.annotationCommentPostTime = "";
	
	if(annotationComment != null) {
		//the annotation exists so we will populate the values from the annotation
		annotationData.annotationCommentValue = annotationComment.value;
		annotationData.annotationCommentPostTime = annotationComment.postTime;
	}

	//the value to display in the score text box
	annotationData.annotationScoreValue = "";
	annotationData.annotationScorePostTime = "";
	
	if (annotationScore != null) {
		//get the value of the annotationScore
		annotationData.annotationScoreValue = annotationScore.value;
		annotationData.annotationScorePostTime = annotationScore.postTime;
	}
	
	//get the latest annotation post time for comparing with student work post time
	annotationData.latestAnnotationPostTime = Math.max(annotationData.annotationCommentPostTime, annotationData.annotationScorePostTime);
	
	//return the object containing the values we need
	return annotationData;
};

/**
 * Get the html that displays the student work
 * @param studentWork a string containing the student work
 * @param node the node
 * @param stepWorkId the id of the step work
 * @param studentWorkTdClass the css class for the td
 * @param latestNodeVisitPostTime the post time in milliseconds
 * @return html for the td that will display the student work
 */
View.prototype.getStudentWorkTdHtml = function(studentWork, node, stepWorkId, studentWorkTdClass, latestNodeVisitPostTime) {
	var studentWorkTdHtml = "";
	
	//if student work is null set to empty string
	if(studentWork == null) {
		//since there was no student work we will display a default message in its place
		studentWork = "<div style='text-align:center'>"+this.getI18NString("grading_no_work_warning")+"</div>";
	} else if (studentWork != "" && node.type == "MySystemNode") {
		//var divId = "mysystemDiagram_"+workgroupId;
		var divId = "mysystemDiagram_"+stepWorkId+"_"+latestNodeVisitPostTime;
		var contentBaseUrl = this.config.getConfigParam('getContentBaseUrl');
		// if the work is for a mysystem node we need to call the print function to print the image in the cell
        var content = node.getContent().getContentString();
        // prepent contentbaseurl to urls
    	content = content.replace(/\.\/images\//gmi, 'images\/');
    	content = content.replace(/images\//gmi, contentBaseUrl+'\/images\/');
        content = content.replace(/\.\/assets\//gmi, 'assets\/');
        content = content.replace(/assets\//gmi, contentBaseUrl+'\/assets\/');

        var studentWorkFixedLink = studentWork.replace(/\.\/images\//gmi, 'images\/');
        studentWorkFixedLink = studentWorkFixedLink.replace(/images\//gmi, contentBaseUrl+'\/images\/');
        studentWorkFixedLink = studentWorkFixedLink.replace(/\.\/assets\//gmi, 'assets\/');
        studentWorkFixedLink = studentWorkFixedLink.replace(/assets\//gmi, contentBaseUrl+'\/assets\/');
                        	
        var contentUrl = node.getContent().getContentUrl();
        
		//commented the line below because my system grading is broken at the moment
		// onclick=\"showDiagram('"+divId+"','"+contentBaseUrl+"')\"
		studentWork = "<a class='msEnlarge' style='text-decoration:underline; color:blue;' onclick='enlargeMS(\""+divId+"\");'>enlarge</a>" +
				      "<span id='content_"+divId+"' style='display:none'>"+content+"</span>" +
				      "<span id='contenturl_"+divId+"' style='display:none'>"+contentUrl+"</span>" +
				      "<span id='studentwork_"+divId+"' style='display:none'>"+studentWorkFixedLink+"</span>" +
					  "<div id='"+divId+"' contentBaseUrl='"+contentBaseUrl+"' class='mysystemCell'  style=\"height:350px;\">"+studentWork+"</div>";
		//studentWork = "(Grading for MySystem not available)";
		
		//add the post time stamp to the bottom of the student work
		studentWork += "<br><br><br><p class='lastAnnotationPostTime'>"+this.getI18NString("timestamp")+": " + new Date(latestNodeVisitPostTime) + "</p>";
	} else if (studentWork != "" && node.type == "SVGDrawNode") {
		// if the work is for a SVGDrawNode, embed the svg
		var divId = "svgDraw_"+stepWorkId+"_"+latestNodeVisitPostTime;
		var contentBaseUrl = this.config.getConfigParam('getContentBaseUrl');
		// if studentData has been compressed, decompress it and parse (for legacy compatibility)
		if (typeof studentWork == "string") {
			if (studentWork.match(/^--lz77--/)) {
				var lz77 = new LZ77();
				studentWork = studentWork.replace(/^--lz77--/, "");
				studentWork = lz77.decompress(studentWork);
				studentWork = $.parseJSON(studentWork);
			}
		} 
		var svgString = studentWork.svgString;
		var description = studentWork.description;
		var snaps = studentWork.snapshots;
		var contentUrl = node.getContent().getContentUrl();
		studentWork = "<div id='"+divId+"_contentUrl' style='display:none;'>"+contentUrl+"</div>"+
			"<a class='drawEnlarge' onclick='enlargeDraw(\""+divId+"\");'>enlarge</a>";
		// if the svg has been compressed, decompress it
		if (svgString != null){
			if (svgString.match(/^--lz77--/)) {
				var lz77 = new LZ77();
				svgString = svgString.replace(/^--lz77--/, "");
				svgString = lz77.decompress(svgString);
			}
			
			//svgString = svgString.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
			// only replace local hrefs. leave absolute hrefs alone!
			svgString = svgString.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, function(m,key,value) {
				  if (value.indexOf("http://") == -1) {
				    return m.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
				  }
				  return m;
				});
			svgString = svgString.replace(/(marker.*=)"(url\()(.*)(#se_arrow_bk)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
			svgString = svgString.replace(/(marker.*=)"(url\()(.*)(#se_arrow_fw)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
			//svgString = svgString.replace('<svg width="600" height="450"', '<svg width="360" height="270"');
			svgString = svgString.replace(/<g>/gmi,'<g transform="scale(0.6)">');
			svgString = Utils.encode64(svgString);
		}
		if(snaps != null && snaps.length>0){
			var snapTxt = "<div id='"+divId+"_snaps' class='snaps'>";
			for(var i=0;i<snaps.length;i++){
				var snapId = divId+"_snap_"+i;
				var currSnap = snaps[i].svg;
				if (currSnap.match(/^--lz77--/)) {
					var lz77 = new LZ77();
					currSnap = currSnap.replace(/^--lz77--/, "");
					currSnap = lz77.decompress(currSnap);
				}
				//currSnap = currSnap.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
				// only replace local hrefs. leave absolute hrefs alone!
				currSnap = currSnap.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, function(m,key,value) {
					  if (value.indexOf("http://") == -1) {
					    return m.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
					  }
					  return m;
					});
				
				currSnap = currSnap.replace(/(marker.*=)"(url\()(.*)(#se_arrow_bk)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
				currSnap = currSnap.replace(/(marker.*=)"(url\()(.*)(#se_arrow_fw)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
				//currSnap = currSnap.replace('<svg width="600" height="450"', '<svg width="120" height="90"');
				currSnap = currSnap.replace(/<g>/gmi,'<g transform="scale(0.2)">');
				currSnap = Utils.encode64(currSnap);
				snapTxt += "<div id="+snapId+" class='snapCell' onclick='enlargeDraw(\""+divId+"\");'>"+currSnap+"</div>";
				var currDescription = snaps[i].description;
				snapTxt += "<div id='"+snapId+"_description' class='snapDescription' style='display:none;'>"+currDescription+"</div>";
			}
			snapTxt += "</div>";
			studentWork += snapTxt;
		} else {
			studentWork += "<div id='"+divId+"' class='svgdrawCell'>"+svgString+"</div>";
			if(description != null){
				studentWork += "<span>Description: </span><div id='"+divId+"_description' class='drawDescription'>"+description+"</div>";
			}
		}
		
		//add the post time stamp to the bottom of the student work
		studentWork += "<div class='lastAnnotationPostTime'>"+this.getI18NString("timestamp")+": " + new Date(latestNodeVisitPostTime) + "</div>";
	} else if(studentWork != "" && this.isSelfRenderingGradingViewNodeType(node.type)) {
		//create the student work div that we will insert the student work into later
		studentWork = '<div id="studentWorkDiv_' + stepWorkId + '" style="overflow:auto;width:500px"></div>';
	} else {
		//add the post time stamp to the bottom of the student work
		studentWork += "<div class='lastAnnotationPostTime'>"+this.getI18NString("timestamp")+": " + new Date(latestNodeVisitPostTime) + "</div>";
		
		//replace \n with <br> so that the line breaks are displayed for the teacher
		studentWork = this.replaceSlashNWithBR(studentWork);
		
		//insert the student work into a div so we can display scrollbars if the student work overflows
		studentWork = '<div id="studentWorkDiv_' + stepWorkId + '" class="studentWorkDiv" style="overflow:auto; width:500px">' + studentWork + '</div>';
	}
	
	//display the student work for this step/node
	studentWorkTdHtml += "<td id='studentWorkColumn_" + stepWorkId + "' class='" + studentWorkTdClass + "'>" + studentWork + "</td>";
	
	return studentWorkTdHtml;
};

/**
 * Retrieve the other data associated with the step if the step is a
 * peer review or teacher review type of step. The other data consists
 * of the original work, review written, or revised work depending
 * on which step it is. If the step is not a peer review or teacher
 * review type, it will just return the studentWork unmodified.
 * @param studentWork the work the student wrote for this step
 * @param node the node for which the studentWork is for
 * @param workgroupId id of the student workgroup
 * @param vleState all the work of the student
 * @return the studentWork with additional data or if the node
 * is not a peer review or teache review type it just returns
 * the studentWork unmodified
 */
View.prototype.getPeerOrTeacherReviewData = function(studentWork, node, workgroupId, vleState) {
	if(studentWork == null) {
		//if the student work is null we don't have to do anything
		return studentWork;
	}
	
	//get the content for the node
	var nodeContent = node.content.getContentJSON();
	
	if(node != null && node.peerReview != null) {
		//this is a peer review node
		
		if(node.peerReview == 'annotate') {
			//this is a peer review annotate node
			
			//get the nodeId of the associated/original node id
			var associatedNodeId = node.associatedStartNode;
			
			//get the peer review work data
			var peerReviewWork = this.getPeerReviewWorkByReviewerNodeId(workgroupId, associatedNodeId);
			
			if(peerReviewWork != null) {
				//get the work that the other student wrote
				var stepWork = peerReviewWork.stepWork;
				
				var otherStudentNames = "N/A";

				//get the workgroup id of the classmate who submitted the work
				var workerWorkgroupId = peerReviewWork.workgroupId;
				
				if(workerWorkgroupId != null) {
					if(workerWorkgroupId == -2) {
						/*
						 * the workgroup id is the one that the specifies the canned 
						 * work/response was shown to the student
						 */
						otherStudentNames = "Canned Response";
					} else {
						//get the names of the users who submitted the work
						var workerUserNames = this.getUserNamesByWorkgroupId(workerWorkgroupId, 1);
						
						//create a link with the names of the classmates that will open to the gradebyteam page
						otherStudentNames = "<a onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + workerWorkgroupId + "'])\">" + workerUserNames + "</a>";						
					}
				}
				
				var otherStudentWork = "";
				
				if(stepWork == null && workerWorkgroupId == -2) {
					//this student received the canned work so we will obtain it from the node content
					otherStudentWork = nodeContent.authoredWork;
				} else if(stepWork != null) {
					//create a node visit from the step work that the other student wrote
					var nodeVisit = NODE_VISIT.prototype.parseDataJSONObj(stepWork, this);
					
					if(nodeVisit != null) {
						//get the latest work from the other student's node visit
						otherStudentWork = nodeVisit.getLatestWork();
					}
				}
				
				//display the work from the other student and what this student wrote as a review
				studentWork = "<u>Other student:</u><br>" + otherStudentNames + "<br><br><u>Work written by other student:</u><br>" + otherStudentWork + "<br><br><u>Review written by this student:</u><br>" + studentWork;
			}
		} else if(node.peerReview == 'revise') {
			//this is a peer review revise node
			
			//get the nodeId of the associated/original node id
			var associatedNodeId = node.associatedStartNode;
			
			//get the peer review work data
			var peerReviewWork = this.getPeerReviewWorkByWorkerNodeId(workgroupId, associatedNodeId);
			
			if(peerReviewWork != null) {
				//get the work that the student originally wrote
				var stepWork = peerReviewWork.stepWork;
				
				if(stepWork != null) {
					//create a node visit from the step work the student originally wrote
					var nodeVisit = NODE_VISIT.prototype.parseDataJSONObj(stepWork, this);
					
					if(nodeVisit != null) {
						//get the latest work from the node visit
						var originalWork = nodeVisit.getLatestWork();
						
						//get the annotation the other student wrote to this student
						var annotation = peerReviewWork.annotation;
						
						//get the workgroup id of the student that wrote the review
						var reviewerWorkgroupId = peerReviewWork.reviewerWorkgroupId;
						
						var otherStudentNames = "N/A";

						if(reviewerWorkgroupId != null) {
							if(reviewerWorkgroupId == -2) {
								/*
								 * the workgroup id is the one that the specifies the canned 
								 * work/response was shown to the student
								 */
								otherStudentNames = "Canned Response";
							} else {
								//get the names of the users who submitted the work
								var workerUserNames = this.getUserNamesByWorkgroupId(reviewerWorkgroupId, 1);
								
								//create a link with the names of the classmates that will open to the gradebyteam page
								otherStudentNames = "<a onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + reviewerWorkgroupId + "'])\">" + workerUserNames + "</a>";						
							}
						}
						
						var review = "";
						
						if(annotation != null) {
							//get the annotation value written by the other student
							review = annotation.value;
						} else if(annotation == null && reviewerWorkgroupId == -2) {
							//this student received the canned review so we will obtain it from the node content
							review = nodeContent.authoredReview;
						}
						
						//display the original work, the review from the other student, and the revised work
						studentWork = "<u>Original work written by this student:</u><br>" + originalWork +
						"<br><br><u>Other student:</u><br>" + otherStudentNames +
						"<br><br><u>Review written by other student:</u><br>" + review + 
						"<br><br><u>Revised work written by this student:</u><br>" + studentWork;
					}
				}
			}
		}
	} else if(node != null && node.teacherReview != null) {
		//this is a teacher review node
		
		if(node.teacherReview == 'annotate') {
			//this is a teacher review annotate node
			
			//get the authored teacher work
			var authoredWork = nodeContent.authoredWork;
			
			//display the authored teacher work and what the student wrote as a review
			studentWork = "<u>Work written by teacher:</u><br>" + authoredWork + "<br><br><u>Review written by this student:</u><br>" + studentWork;
		} else if(node.teacherReview == 'revise') {
			//this is a teacher review revise node
			
			//get the original/associated node id
			var associatedOriginalNodeId = node.associatedStartNode;
			
			//get the latest node visit from the original node
			var originalNodelatestNodeVisit = vleState.getLatestNodeVisitByNodeId(associatedOriginalNodeId);
			
			//get the latest work from the original node
			var originalWork = originalNodelatestNodeVisit.getLatestWork();
			
			var teacherAnnotation = "";
			
			if(this.annotations != null) {
				//get the latest comment annotation for the original step written by the teacher
				var latestCommentAnnotationForStep = this.annotations.getLatestAnnotation(
						this.getConfig().getConfigParam('runId'),
						associatedOriginalNodeId,
						workgroupId,
						this.getUserAndClassInfo().getAllTeacherWorkgroupIds(),
						'comment'
						);
				
				if(latestCommentAnnotationForStep != null) {
					//get the value of the annotation
					teacherAnnotation = latestCommentAnnotationForStep.value;					
				}
			}
			
			//display the original work, the teacher review, and the revised work
			studentWork = "<u>Original work written by this student:</u><br>" + originalWork + 
			"<br><br><u>Review written by teacher:</u><br>" + teacherAnnotation + 
			"<br><br><u>Revised work written by this student:</u><br>" + studentWork;
		}
	}
	
	//return the modified student work
	return studentWork;
};


/**
 * Get the html that displays the score and comment box
 * @param workgroupId
 * @param nodeId
 * @param teacherId
 * @param runId
 * @param stepWorkId
 * @param annotationScoreValue
 * @param annotationCommentValue
 * @param latestAnnotationPostTime
 * @param isGradingDisabled
 * @param scoringAndCommentingTdClass
 * @param studentWork the student work (optional: only required when a step has an auto grading criteria)
 * @param studentWorkRowId the id of the tr for this student in grade by step 
 * this is only required for the latest student work revision row and NOT any
 * of the previous revision rows (optional: only required when a step has an auto grading criteria)
 * @return html for the td that will display the score and comment box
 */
View.prototype.getScoringAndCommentingTdHtml = function(workgroupId, nodeId, teacherId, runId, stepWorkId, annotationScoreValue, annotationCommentValue, latestAnnotationPostTime, isGradingDisabled, scoringAndCommentingTdClass, studentWork, studentWorkRowId) {
	var scoringAndCommentingTdHtml = "";
	
	//get the max score for this step, or "" if there is no max score
	var maxScore = this.getMaxScoreValueByNodeId(nodeId);
	
	var textAreaCols = 40;
	
	/*
	 * dynamically determine how many rows will be in the comment box
	 * by parsing the comment annotation
	 */
	var commentTextAreaRows = this.getTextAreaNumRows(textAreaCols, annotationCommentValue);
	
	//create a date object with the latest annotation post time
	var lastAnnotationPostTime = new Date(latestAnnotationPostTime);
	
	var lastAnnotationMessage = "";
	
	//display the last annotation post time
	if(lastAnnotationPostTime != null && lastAnnotationPostTime.getTime() != new Date(0).getTime()) {
		lastAnnotationMessage = ""+this.getI18NString("last_annotation")+": " + lastAnnotationPostTime;
	} else {
		lastAnnotationMessage = ""+this.getI18NString("last_annotation")+": "+this.getI18NString("not_available")+"";
	}
	
	//display the td for the score and comment box
	scoringAndCommentingTdHtml += "<td class='" + scoringAndCommentingTdClass + "'>";
	
	//get the content for the step
	var nodeContent = this.project.getNodeById(nodeId).getContent().getContentJSON();
	
	//check if the step has auto grading criteria
	if(nodeContent.gradingCriteria != null) {
		//get the auto grading criteria
		var gradingCriteria = nodeContent.gradingCriteria;
		
		//the counter for the auto graded score
		var autoGradedScore = 0;
		
		//the counter for total possible auto graded score
		var totalPossibleAutoGradedScore = 0;
		
		//the table that displays all the auto graded data
		scoringAndCommentingTdHtml += "<table id='teacherGradingCriteriaTable' class='gradingCriteriaTable'>";
		
		//the header row for the auto graded data table
		scoringAndCommentingTdHtml += "<tr>";
		scoringAndCommentingTdHtml += "<td class='gradingCriteriaTd'>Criteria</td>";
		scoringAndCommentingTdHtml += "<td class='gradingCriteriaTd'>Auto Score</td>";
		scoringAndCommentingTdHtml += "<td class='gradingCriteriaTd'>Possible Score</td>";
		scoringAndCommentingTdHtml += "</tr>";
		
		//loop through all the grading criteria
		for(var x=0; x<gradingCriteria.length; x++) {
			//get a single grading criteria
			var singleGradingCriteria = gradingCriteria[x];
			
			//get the name of the single grading criteria
			var gradingCriteriaName = singleGradingCriteria.name;
			
			//get the point value for the single grading criteria
			var gradingCriteriaPointValue = singleGradingCriteria.pointValue;
			
			//check if the student work passed the grading criteria
			var pass = this.runGradingCriteria(studentWork, singleGradingCriteria);
			
			var scoreForCriteria = 0;
			
			if(pass) {
				//set the score if the student work passed
				scoreForCriteria = gradingCriteriaPointValue;
			}
			
			//accumulate the total possible score
			totalPossibleAutoGradedScore += gradingCriteriaPointValue;
			
			//accumulate the student score
			autoGradedScore += scoreForCriteria;
			
			//display the row for this grading criteria
			scoringAndCommentingTdHtml += "<tr>";
			scoringAndCommentingTdHtml += "<td class='gradingCriteriaTd'>" + gradingCriteriaName + "</td>";
			scoringAndCommentingTdHtml += "<td class='gradingCriteriaTd'>" + scoreForCriteria + "</td>";
			scoringAndCommentingTdHtml += "<td class='gradingCriteriaTd'>" + gradingCriteriaPointValue + "</td>";
			scoringAndCommentingTdHtml += "</tr>";
		}
		
		//display the total score for the student and the total possible score
		scoringAndCommentingTdHtml += "<tr>";
		scoringAndCommentingTdHtml += "<td class='gradingCriteriaTd'>Total</td>";
		scoringAndCommentingTdHtml += "<td class='gradingCriteriaTd'>" + autoGradedScore + "</td>";
		scoringAndCommentingTdHtml += "<td class='gradingCriteriaTd'>" + totalPossibleAutoGradedScore + "</td>";
		scoringAndCommentingTdHtml += "</tr>";
		
		if(studentWorkRowId != null) {
			/*
			 * this is a latest student work revision row so we will add an entry
			 * into our studentWorkRowOrderObjects array
			 */
			
			//create the object with the row id and auto graded score
			var studentWorkRowOrderObject = {
				studentWorkRowId:studentWorkRowId,
				autoGradedScore:autoGradedScore
			};
			
			//add it to the array that we will use later for sorting based on auto graded score
			this.studentWorkRowOrderObjects.push(studentWorkRowOrderObject);
		}
		
		scoringAndCommentingTdHtml += "</table>";
	}
	
	//the td will contain a table
	scoringAndCommentingTdHtml += "<table class='teacherAnnotationTable'>";
	
	//display the score box
	scoringAndCommentingTdHtml += "<tr><td>"+this.getI18NString("score")+": <input type='text' id='annotationScoreTextArea_" + workgroupId + "_" + nodeId + "' value='" + annotationScoreValue + "' onblur=\"eventManager.fire('saveScore', ['"+nodeId+"','"+workgroupId+"', '"+teacherId+"', '"+runId+"', '"+stepWorkId+"'])\" " + isGradingDisabled + "/> / " + maxScore + "</td></tr>";
	
	var openPremadeCommentsLink = "";
	
	if(isGradingDisabled != "disabled") {
		//if grading is enabled, display the link to open the premade comments
		openPremadeCommentsLink = "<a onclick='eventManager.fire(\"openPremadeComments\", [\"annotationCommentTextArea_" + workgroupId + "_" + nodeId + "\", \"studentWorkColumn_" + stepWorkId + "\"])'>"+this.getI18NString("grading_open_premade_comments")+"</a>";
	}
	
	//display the comment box
	scoringAndCommentingTdHtml += "<tr><td>"+this.getI18NString("comment")+": " + openPremadeCommentsLink + "<br><textarea wrap='soft' cols='" + textAreaCols + "' rows='" + commentTextAreaRows + "' id='annotationCommentTextArea_" + workgroupId + "_" + nodeId + "' onblur=\"eventManager.fire('saveComment', ['"+nodeId+"','"+workgroupId+"', '"+teacherId+"', '"+runId+"', '"+stepWorkId+"', this])\"" + isGradingDisabled + ">" + annotationCommentValue + "</textarea></td></tr>";
	
	//display the last annotation post time
	scoringAndCommentingTdHtml += "<tr><td><p id='lastAnnotationPostTime_" + workgroupId + "_" + nodeId + "' class='lastAnnotationPostTime'>" + lastAnnotationMessage + "</p></td></tr>";
	
	//close the inner table containing the score and comment and post time
	scoringAndCommentingTdHtml += "</table>";
	
	//close the td
	scoringAndCommentingTdHtml += "</td>";
	
	return scoringAndCommentingTdHtml;
};

/**
 * Determine if the student work has passed the grading criteria
 * @param studentWork the student work
 * @param gradingCriteria the grading criteria object
 * @return whether the student work passed the grading criteria
 */
View.prototype.runGradingCriteria = function(studentWork, gradingCriteria) {
	var pass = false;
	
	if(studentWork == null) {
		//set to "" if student work is null
		studentWork = "";
	}
	
	//get the grading criteria values
	var values = gradingCriteria.values;
	
	//get the grading criteria operator "and" or "or"
	var operator = gradingCriteria.operator;
	
	//set the default values
	if(operator == "and") {
		pass = true;
	} else if(operator == "or") {
		pass = false;
	}
	
	if(values.length == 0) {
		//if there are no values in the grading criteria, we will just say the student work passed
		pass = true;
	}
	
	/*
	 * loop through the values. a value can either be a string
	 * or another grading criteria object. e.g.
	 * string
	 * "energy"
	 * 
	 * object
	 * {
	 *    "name":"light source",
	 *    "operator":"or",
	 *    "values":["sun",
	 *       "photons"
	 *    ],
	 *    "pointValue":1
	 * }
	 */
	for(var x=0; x<values.length; x++) {
		//get a value
		var value = values[x];
		
		if(typeof value == 'string') {
			//the value is a string
			
			if(studentWork.indexOf(value) == -1) {
				//value was not found
				pass = this.evaluateConditional(operator, pass, false);
			} else {
				//value was found
				pass = this.evaluateConditional(operator, pass, true);
			}
		} else if(typeof value == 'object') {
			//the value is an object
			
			//run the grading criteria
			var result = this.runGradingCriteria(studentWork, value);
			
			//evaluate the conditional with the result
			pass = this.evaluateConditional(operator, pass, result);
		}
	}
	
	return pass;
};

/**
 * Evaluate the conditional for two boolean values
 * @param operator a string that is either "and" or "or"
 * @param value1 the first boolean value
 * @param value2 the second boolean value
 * @return the result of applying the conditional on the two values
 */
View.prototype.evaluateConditional = function(operator, value1, value2) {
	var result = false;
	
	if(operator == "or") {
		result = value1 || value2;					
	} else if(operator == "and") {
		result = value1 && value2;
	}
	
	return result;
};

View.prototype.getFlaggingTdHtml = function(workgroupId, nodeId, teacherId, runId, stepWorkId, isGradingDisabled, flagChecked, flaggingTdClass) {
	
	return "<td class='" + flaggingTdClass + "'><div></div><div class='gradeColumn flagColumn'><input type='checkbox' value='Flag' name='flagButton" + workgroupId + "' id='flagButton_" + stepWorkId + "' onClick='eventManager.fire(\"saveFlag\", [\"" + nodeId + "\", " + workgroupId + ", " + teacherId + ", " + runId + ", null, \""+ stepWorkId +"\"])' " + isGradingDisabled + " " + flagChecked + ">"+this.getI18NString("flag")+"</div></td>";
};

/**
 * Displays the grading page for a specific workgroup. Generates
 * the html and then sets it into the div.
 * @param workgroupId the id of the workgroup
 */
View.prototype.displayGradeByTeamGradingPage = function(workgroupId) {
	// detach FixedHeader clones
	$('.fixedHeader').detach();
		
	//perform any display page startup tasks
	this.displayStart("displayGradeByTeamGradingPage", [workgroupId]);
	
	var gradeByTeamGradingPageHtml = "";
	
	gradeByTeamGradingPageHtml = "<div class='gradingTools'>";
	
	//show the header with all the grading buttons
	gradeByTeamGradingPageHtml += this.getGradingHeaderTableHtml();
	
	var userNames = this.getUserNamesByWorkgroupId(workgroupId, 0);
	
	gradeByTeamGradingPageHtml += "<div class='gradingHeader'><span class='instructions'>Current Team: " + userNames+ "</span>";
	gradeByTeamGradingPageHtml += "<div style='float:right;'>";
	
	//show the step title and prompt
	//gradeByTeamGradingPageHtml += "<table class='objectToGradeHeaderTable'><tr><td class='objectToGradeTd'>" + userNames + "</td>";

	gradeByTeamGradingPageHtml += "<a class='selectStep' onClick='eventManager.fire(\"displayGradeByTeamSelectPage\")'>"+this.getI18NString("grading_change_team")+"</a>";
	
	//show the button to go back to select another workgroup
	//gradeByTeamGradingPageHtml += "<td class='button'><a id='selectAnotherStep' onClick='eventManager.fire(\"displayGradeByTeamSelectPage\")'>"+this.getI18NString("grading_change_team")+"</a></td></tr></table>";
	
	gradeByTeamGradingPageHtml += "</div>";
	
	gradeByTeamGradingPageHtml += "<div id='filterOptions'>";
	
	//check if show revisions check box was previously checked
	var showRevisionsChecked = '';
	if(this.gradingShowRevisions) {
		showRevisionsChecked = 'checked';
	}
	
	if (this.getRevisions) {
		//check box for showing all revisions
		gradeByTeamGradingPageHtml += "<div><input type='checkbox' id='showAllRevisions' value='show all revisions' onClick=\"eventManager.fire('filterStudentRows')\" " + showRevisionsChecked + "/><p style='display:inline'>"+this.getI18NString("grading_show_all_revisions")+"</p></div>";
	}
	
	gradeByTeamGradingPageHtml += "</div></div></div>";
	
	gradeByTeamGradingPageHtml += "<div class='gradingContent'>";
	
	//get the work for the workgroup id
	var vleState = this.getVleStateByWorkgroupId(workgroupId);

	//reset the activity counter used to label activity numbers
	this.activityNumber = 0;
	
	//loop through all the nodes and generate the html that allows the teacher to grade
	gradeByTeamGradingPageHtml += this.displayGradeByTeamGradingPageHelper(this.getProject().getRootNode(), vleState);
	
	gradeByTeamGradingPageHtml += "</div>";
	
	//set the html in the div so the user can see it
	document.getElementById('gradeWorkDiv').innerHTML = gradeByTeamGradingPageHtml;

	//render all the student work for this workgroup
	this.renderAllStudentWorkForWorkgroupId(workgroupId);
	
	// call showDiagrams for each div that has mysystem/drawing student data
	$(".mysystemCell").each(showDiagramNode);
	$(".svgdrawCell").each(showDrawNode);
	$(".snapCell").each(showSnaps);
	
	if($('#filterOptions').html()==''){
		$('#filterOptions').hide();
	}
	
	//perform scroll to top and page height resizing to remove scrollbars
	this.displayFinished();
};

/**
 * The helper function to generate the grading page for a
 * specific workgroup
 * @param node the node to generate the grading elements for
 * @param vleState the object that holds all the work for a workgroup
 * @return html that displays the grading elements
 */
View.prototype.displayGradeByTeamGradingPageHelper = function(node, vleState) {
	var nodeId = node.id;

	var displayGradeByTeamGradingPageHtml = "";
	
	if(node.isLeafNode()) {
		//this node is a leaf/step

		//get the position as seen by the student
		var position = this.getProject().getVLEPositionById(nodeId);
		if(node.type == "HtmlNode" || node.type == "OutsideUrlNode" ||
				(node.type == "FlashNode" && node.getContent().getContentJSON.enableGrading == false)) {
			//the node is an html node so we do not need to display a link for it, we will just display the text
			displayGradeByTeamGradingPageHtml += "<table class='gradeByTeamGradingPageNonWorkStepTable'><tr><td class='chooseStepToGradeStepTd'><p>" + position + " " + node.getTitle() + " (" + node.type + ")</p></td></tr></table>";
			displayGradeByTeamGradingPageHtml += "<br>";
		} else if(node.type == 'DuplicateNode'){
			/* the node is a duplicate node, only the original should be graded so only display text */
			var realNode = node.getNode();
			var realPosition = this.getProject().getVLEPositionById(realNode.id);
			var type = 'Duplicate for ' + realNode.type + ' at ' + realPosition;
			
			displayGradeByTeamGradingPageHtml += "<table class='gradeByTeamGradingPageNonWorkStepTable'><tr><td class='chooseStepToGradeStepTd'><p>" + position + " " + node.getTitle() + " (" + type + ")</p></td></tr></table>";
		} else {
			var runId = this.getConfig().getConfigParam('runId');
			
			var teacherId = this.getUserAndClassInfo().getWorkgroupId();
			
			var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
			
			var workgroupId = vleState.dataId;

			//get the annotations data for this student/step combination
			var annotationData = this.getAnnotationData(runId, nodeId, workgroupId, teacherIds);
			var annotationCommentValue = annotationData.annotationCommentValue;
			var annotationScoreValue = annotationData.annotationScoreValue;
			var latestAnnotationPostTime = annotationData.latestAnnotationPostTime;
			
			//get the period name for this student
			var periodName = this.getUserAndClassInfo().getClassmatePeriodNameByWorkgroupId(workgroupId);
			
			//get the revisions
			var nodeVisitRevisions = vleState.getNodeVisitsWithWorkByNodeId(nodeId);
			
			var latestNodeVisit = null;
			
			if(nodeVisitRevisions.length > 0) {
				//get the latest work for the current workgroup
				latestNodeVisit = nodeVisitRevisions[nodeVisitRevisions.length - 1];
			}
			
			var stepWorkId = null;
			var studentWork = null;
			var latestNodeVisitPostTime = null;
			
			if (latestNodeVisit != null) {
				stepWorkId = latestNodeVisit.id;
				studentWork = latestNodeVisit.getLatestWork();
				latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
			}

			//get the latest flag value
			var latestFlag = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherIds, 'flag');
			
			//default will be unchecked/unflagged
			var flagChecked = "";
			var isFlagged = 'false';
			
			//we found a flag annotation
			if(latestFlag) {
				//check if it is 'flagged' or 'unflagged'
				if(latestFlag.value == 'flagged') {
					//the value of the flag is 'flagged' so the checkbox will be checked
					flagChecked = " checked";
					isFlagged = 'true';
				}
			}
			
			/*
			 * retrieve any peer or teacher review data, if the current node is
			 * not a peer or teacher review type step, the function will just
			 * return the unmodified studentWork back
			 */
			studentWork = this.getPeerOrTeacherReviewData(studentWork, node, workgroupId, vleState);

			//make the class for the table for a student
			var gradeByTeamGradingPageWorkStepTableClass = "gradeByTeamGradingPageWorkStepTable";
			
			//check if there was any new work
			if(latestAnnotationPostTime < latestNodeVisitPostTime) {
				//set the css class so the table will be highlighted
				gradeByTeamGradingPageWorkStepTableClass += " newWork";
			}

			var toggleRevisionsLink = "";

			if(nodeVisitRevisions.length > 1) {
				//there is more than one revision so we will display a link that will display the other revisions
				toggleRevisionsLink = "  <a onClick=\"eventManager.fire('toggleGradingDisplayRevisions', ['" + workgroupId + "', '" + nodeId + "'])\">"+(nodeVisitRevisions.length-1)+" "+this.getI18NString("grading_hide_show_revisions")+"</a>";
			} else if(nodeVisitRevisions.length == 1) {
				//there is only one revisions
				
				if(this.getRevisions) {
					//we retrieved all revisions so that means there are no other revisions
					toggleRevisionsLink = this.getI18NString("grading_no_revisions");
				} else {
					//we only retrieved the latest revision so there may be other revisions
					toggleRevisionsLink = this.getI18NString("grading_only_latest_revision_displayed");
				}
			} else if(nodeVisitRevisions.length == 0) {
				//there are no revisions
				toggleRevisionsLink = this.getI18NString("grading_no_revisions");
			}
			
			//display the step title and link and also the button to display the question/prompt
			displayGradeByTeamGradingPageHtml += "<table id='studentWorkRow_"+workgroupId+"_"+nodeId+"_"+stepWorkId+"' class='" + gradeByTeamGradingPageWorkStepTableClass + "'>";
			displayGradeByTeamGradingPageHtml += "<thead class='gradeTeamTableHeader'><tr><td>"+this.getI18NString("student_work")+"</td>"+
				"<td>"+this.getI18NString("teacher_comment_and_score")+"</td>"+
				"<td>"+this.getI18NString("tools")+"</td></tr></thead>";
			displayGradeByTeamGradingPageHtml += "<tr><td class='chooseStepToGradeStepTd'><a onClick='eventManager.fire(\"displayGradeByStepGradingPage\",[\"" + position + "\", \"" + nodeId + "\"])'>" + position + " " + node.getTitle() + "</a>&nbsp;&nbsp;<span class='byTeamStepType'>(" + node.type + ")</span></td>";
			displayGradeByTeamGradingPageHtml += "<td class='chooseStepToGradeStepTd2 colspan='2'><a onClick=\"eventManager.fire('togglePrompt', ['questionContentText_" + nodeId + "'])\">"+this.getI18NString("grading_hide_show_question")+"</a>" + toggleRevisionsLink + "</td>";
			displayGradeByTeamGradingPageHtml += "</tr>";

			//get the prompt/question for the step
			var nodePrompt = this.getProject().getNodePromptByNodeId(nodeId);
			
			//add the prompt/question which will initially be hidden
			displayGradeByTeamGradingPageHtml += "<tr>";
			displayGradeByTeamGradingPageHtml += "<td></td><td colspan='2'><div id='questionContentText_" + nodeId + "' class='questionContentText commentHidden'> " + nodePrompt + "</div></td>";
			displayGradeByTeamGradingPageHtml += "</tr>";

			//make the class for the row that will contain the student work, score and comment box, and flag checkbox
			var studentTRClass = "studentWorkRow period" + periodName;
			displayGradeByTeamGradingPageHtml += "<tr class='" + studentTRClass + "' isFlagged='" + isFlagged + "'>";
			
			//make the class for the student work td
			var studentWorkTdClass = "gradeByTeamWorkColumn";
			
			//get the html for the student work td
			displayGradeByTeamGradingPageHtml += this.getStudentWorkTdHtml(studentWork, node, stepWorkId, studentWorkTdClass, latestNodeVisitPostTime);
			
			//check if we want to enable/disable grading for this student/row
			var isGradingDisabled = "";
			if(studentWork == null) {
				//the student has not done any work for this step so we will disable grading
				isGradingDisabled = "disabled";
			} else {
				//get the permission the currently logged in user has for this run
				isGradingDisabled = this.isWriteAllowed();
			}
			
			//make the css class for the td that will contain the score and comment boxes
			var scoringAndCommentingTdClass = "gradeByTeamGradeColumn gradeColumn gradingColumn";
			
			//get the html for the score and comment td
			displayGradeByTeamGradingPageHtml += this.getScoringAndCommentingTdHtml(workgroupId, nodeId, teacherId, runId, stepWorkId, annotationScoreValue, annotationCommentValue, latestAnnotationPostTime, isGradingDisabled, scoringAndCommentingTdClass, studentWork);
			
			//make the css class for the td that will contain the flag checkbox
			var flaggingTdClass = "gradeByTeamToolsColumn gradeColumn toolsColumn";
			
			//get the html for the flag td
			displayGradeByTeamGradingPageHtml += this.getFlaggingTdHtml(workgroupId, nodeId, teacherId, runId, stepWorkId, isGradingDisabled, flagChecked, flaggingTdClass);
			
			displayGradeByTeamGradingPageHtml += "</tr>";
			
			//check if there was more than one revision
			if(nodeVisitRevisions.length > 1) {
				//loop through the revisions from most recent to oldest
				for(var revisionCount=nodeVisitRevisions.length - 2; revisionCount>=0; revisionCount--) {
					//get a node visit
					var nodeVisitRevision = nodeVisitRevisions[revisionCount];
					var revisionPostTime = nodeVisitRevision.visitPostTime;
					
					//get the work from the node visit
					var revisionWork = nodeVisitRevision.getLatestWork();
					
					//get the stepWorkId of the revision
					var revisionStepWorkId = nodeVisitRevision.id;
					
					//get the annotation data for the revision if any
					var annotationDataForRevision = this.getAnnotationDataForRevision(revisionStepWorkId);
					var annotationCommentValue = annotationDataForRevision.annotationCommentValue;
					var annotationScoreValue = annotationDataForRevision.annotationScoreValue;
					var latestAnnotationPostTime = annotationDataForRevision.latestAnnotationPostTime;
					
					var isGradingDisabled = "disabled";
					
					//default will be unchecked/unflagged
					var flagChecked = "";
					var isFlagged = 'false';
					
					//display the data for the revision
					displayGradeByTeamGradingPageHtml += "<tr id='studentWorkRow_"+workgroupId+"_"+nodeId+"_" + revisionStepWorkId + "' class='studentWorkRow period" + periodName + " studentWorkRevisionRow studentWorkRevisionRow_" + workgroupId + "_" + nodeId + "' style='display:none'>";
					displayGradeByTeamGradingPageHtml += this.getStudentWorkTdHtml(revisionWork, node, revisionStepWorkId, studentWorkTdClass, revisionPostTime);
					displayGradeByTeamGradingPageHtml += this.getScoringAndCommentingTdHtml(workgroupId, nodeId, teacherId, runId, nodeVisitRevision.id, annotationScoreValue, annotationCommentValue, latestAnnotationPostTime, isGradingDisabled, scoringAndCommentingTdClass, revisionWork);
					displayGradeByTeamGradingPageHtml += this.getFlaggingTdHtml(workgroupId, nodeId, teacherId, runId, revisionStepWorkId, isGradingDisabled, flagChecked, flaggingTdClass);
					displayGradeByTeamGradingPageHtml += "</tr>";
				}
			}
			
			//close the table for the student
			displayGradeByTeamGradingPageHtml += "</table>";
			
			//use a new line between each student
			displayGradeByTeamGradingPageHtml += "<br>";
		}
	} else {
		/*
		 * we need to skip the first sequence because that is always the
		 * master sequence. we will encounter the master sequence when 
		 * this.activityNumber is 0, so all the subsequent activities will
		 * start at 1.
		 */
		if(this.activityNumber != 0) {
			//this node is a sequence so we will display the activity number and title
			displayGradeByTeamGradingPageHtml += "<table class='gradeByTeamGradingPageActivityTable'><tr><td colspan='2' class='chooseStepToGradeActivityTd'><h4>Activity " + this.activityNumber + ": " + node.getTitle() + "</h4></td><td></td></tr></table>";
			displayGradeByTeamGradingPageHtml += "";
		}

		//increment the activity number
		this.activityNumber++;
		
		//loop through all its children
		for(var x=0; x<node.children.length; x++) {
			//get the html for the children
			displayGradeByTeamGradingPageHtml += this.displayGradeByTeamGradingPageHelper(node.children[x], vleState);
		}
	
	}
		
	return displayGradeByTeamGradingPageHtml;
	
	
};

/**
 * Sorts the vleStates alphabetically by user name
 * @return
 */
View.prototype.getVleStatesSortedByUserName = function() {
	var vleStates = this.vleStates;
	
	/*
	 * set this view to a local variable so it can be referenced
	 * inside the sortByUserName() function below
	 */
	var thisView = this;
	
	/**
	 * A function that compares two vleStates. This is only used
	 * with the array sort function.
	 * @param a some vleState
	 * @param b some vleState
	 * @return
	 * true if the userName for a comes after b
	 * false if the userName for b comes after a
	 */
	var sortByUserName = function(a, b) {
		//get the user names from the vleStates
		var userNameA = thisView.getUserAndClassInfo().getClassmateByWorkgroupId(a.dataId).userName.toLowerCase();
		var userNameB = thisView.getUserAndClassInfo().getClassmateByWorkgroupId(b.dataId).userName.toLowerCase();
		
		//compare them
		return userNameA > userNameB;
	};
	
	vleStates = vleStates.sort(sortByUserName);
	
	return vleStates;
};

/**
 * Get the user names in a workgroup id
 * @param workgroupId the id of the workgroup
 * @param numberOfLineBreaks the number of new line <br>'s to put between user names
 * @return a string containing user names that are in the workgroup separated by
 * new line <br>'s
 */
View.prototype.getUserNamesByWorkgroupId = function(workgroupId, numberOfLineBreaks) {
	//if number of line breaks is unspecified, just use 1
	if(numberOfLineBreaks == null) {
		numberOfLineBreaks = 1;
	}
	
	//the html that we will use to display in the left user column of the gradebystep page
	var userNamesHtml = "";
	
	if(workgroupId != null) {
		//get the user in the class
		var classmate = this.getUserAndClassInfo().getClassmateByWorkgroupId(workgroupId);
		
		if(classmate != null) {
			//retrieve the : delimited names of the users in the workgroup
			var userNames = classmate.userName;

			//split the string by :
			var userNamesArray = userNames.split(":");

			//loop through each name in the workgroup
			for(var y=0; y<userNamesArray.length; y++) {
				//add an empty line between each name
				if(userNamesHtml != "") {
					if(numberOfLineBreaks == 0){
						userNamesHtml += ", ";
					}
					for(var x=0; x<numberOfLineBreaks; x++) {
						userNamesHtml += "<br />";
					}
				}

				//add the user name which consists of "[first name] [last name] ([login])"
				userNamesHtml += userNamesArray[y];
			}
		}
	}
	
	return userNamesHtml;
};

/**
 * Gets the html that will display radio buttons that will filter
 * workgroups by period
 * TODO: change name of this function and variables to reflect switch to select links
 * @return html that will display the radio buttons for filtering periods
 */
View.prototype.getPeriodRadioButtonTableHtml = function(displayType) {
	var periodRadioButtonTableHtml = "";
	
	//the div to display the period radio buttons that filter the periods
	//periodRadioButtonTableHtml += "<div id='choosePeriodTable' class='choosePeriodTable'>";
	periodRadioButtonTableHtml += "<div id='choosePeriod'>";

	//split the period numbers into an array
	var periods = this.getUserAndClassInfo().getPeriodName().split(":");

	//the args for the onclick radio button for all classes
	var allArgs = "['all', '" + displayType + "']";
	
	
	var allPeriodsChecked = '';
	
	//check if the all periods check box should be checked, 'all' is default if no period is specified
	if(!this.gradingPeriod || this.gradingPeriod == 'all') {
		allPeriodsChecked = 'checked';
		this.gradingPeriod = 'all';
	}
	
	//create a radio button to display all periods
	//periodRadioButtonTableHtml += "<div class='periodRadioChoice'><input type='radio' name='choosePeriod' value='all' onClick=\"eventManager.fire('filterStudentRows')\" " + allPeriodsChecked + "> "+this.getI18NString("grading_grade_by_step_all_periods")+"</div>";
	periodRadioButtonTableHtml += "<span style='margin-right:.5em';>View:</span><a id='all' class='periodChoice " + allPeriodsChecked + "' onClick=\"eventManager.fire('setSelectedPeriod',this)\">"+this.getI18NString("grading_grade_by_step_all_periods")+"</a>";
	
	//loop through the periods
	for(var p=0; p<periods.length; p++) {
		//the args for the onclick radio button for a specific period
		var periodArgs = "['" + periods[p] + "', '" + displayType + "']";
		
		var periodChecked = '';
		
		//check if this period is checked
		if(this.gradingPeriod && this.gradingPeriod.replace('period', '') == periods[p]) {
			periodChecked = 'checked';
		}
		
		//create a radio button for each period
		//periodRadioButtonTableHtml += "<div class='periodRadioChoice' ><input type='radio' name='choosePeriod' value='period" + periods[p] + "' onClick=\"eventManager.fire('filterStudentRows')\" " + periodChecked + "> Period " + periods[p] + "</div>";
		periodRadioButtonTableHtml += "<a id='period" + periods[p] + "' class='periodChoice " + periodChecked + "' onClick=\"eventManager.fire('setSelectedPeriod',this)\">Period " + periods[p] + "</a>";
	}

	periodRadioButtonTableHtml += "</div>";
	
	return periodRadioButtonTableHtml;
};

/**
 * Set the element to be visible if it is not a previous revision row
 * @param element an html element
 */
View.prototype.setDisplayVisibleIfNotRevision = function(element) {
	var className = element.className;
	
	//check if this element is a previous revision
	if(className.indexOf("studentWorkRevisionRow") == -1) {
		//the element is not a previous revision so we will show it
		element.style.display = "";	
	} else {
		//the element is a previous revision so we will not show it
		element.style.display = "none";
	}
};

/**
 * Toggle the class attribute to show/hide prompts.
 * @param elementId the id of the element to toggle
 */
View.prototype.togglePrompt = function(elementId) {
	//get the element
	var elementToToggle = document.getElementById(elementId);
	
	if(elementToToggle != null) {
		//get the class of the element
		var elementToToggleClass = elementToToggle.className;

		if(elementToToggleClass == null) {
			//do nothing
		} else if(elementToToggleClass.indexOf("commentShown") != -1) {
			//element contains commentShown class
			elementToToggle.className = elementToToggle.className.replace("commentShown", "commentHidden");
		} else if(elementToToggleClass.indexOf("commentHidden") != -1) {
			//element contains commentHidden class
			elementToToggle.className = elementToToggle.className.replace("commentHidden", "commentShown");
		}		
	}
};

/**
 * Retrieve the annotations, student data, and flags again and reload
 * the page the teacher was previously on.
 */
View.prototype.refreshGradingScreen = function() {
	//remember the grading page the teacher is currently on
	this.reloadGradingDisplay = this.currentGradingDisplay;
	
	//remember any params needed to reload the grading page
	this.reloadGradingDisplayParam = this.currentGradingDisplayParam;
	
	/*
	 * get the annotations, this will trigger a chain of events that will
	 * also get the student work and flags and also reloads the page
	 * that the teacher was last on
	 */
	this.getAnnotations();
};

/**
 * This is called after the refresh has completed retrieval of
 * annotations, student work, and flags. This function just
 * reloads the page the teacher was last on. This function
 * actually gets called every time "getStudentWorkComplete"
 * is fired but only actually does something if it was
 * triggered by the refresh button being clicked.
 * @return
 */
View.prototype.reloadRefreshScreen = function() {
	//this will be set if the refresh button was clicked
	if(this.reloadGradingDisplay != null) {
		//reload the page the teacher was last on
		eventManager.fire(this.reloadGradingDisplay, this.reloadGradingDisplayParam);
	}
	
	//clear out these values
	this.reloadGradingDisplay = null;
	this.reloadGradingDisplayParam = null;
};

/**
 * Remember the current page the teacher is viewing for grading
 * @param displayName the name of the display
 * @param displayParam any parameters used for loading the display
 */
View.prototype.displayStart = function(displayName, displayParam) {
	this.currentGradingDisplay = displayName;
	this.currentGradingDisplayParam = displayParam;
	var that = this;
	$(window).resize(function(){
		// fix the height of the gradeWorkDiv so no scrollbars are displayed for the iframe
		that.fixGradingDisplayHeight();
	})
};

/**
 * Perform any page scrolling and resizing after all the grading display
 * has been generated.
 */
View.prototype.displayFinished = function() {
	if(this.gradingType != "team"){
		$('.fixedHeader').detach(); // detach all FixedHeader clones
	}
	
	//scroll to the top of the page
	parent.scrollTo(0,0);
	
	//apply the filters so that filters for period, hide personal info, show flagged, enlarge student, show all revisions are applied
	this.filterStudentRows();
	
	// fix the height of the gradeWorkDiv so no scrollbars are displayed for the iframe
	this.fixGradingDisplayHeight();
	
	var that = this;
	$(window).resize(function(){
		// fix the height of the gradeWorkDiv so no scrollbars are displayed for the iframe
		that.fixGradingDisplayHeight();
	})
};

/**
 * Fix the height of the gradeWorkDiv so no scrollbars are displayed
 * for the iframe
 * TODO: change name to reflect updated functionality (table resizing, etc.)
 */
View.prototype.fixGradingDisplayHeight = function() {
	//get the height of the gradeWorkDiv
	//var height = document.getElementById('gradeWorkDiv').scrollHeight;
	var height = $('#gradingIfrm',window.parent.parent.document).height();
	
	/*
	 * resize the height of the topifrm that contains the gradeWorkDiv
	 * so that there will be no scroll bars
	 */
	//parent.document.getElementById('topifrm').height = height + 300;
	$('#topifrm',parent.document).height(height);
	
	// set gradeWorkDiv height to fit bottom of screen
	var gradeWorkHeight = height - $('.gradingTools').outerHeight();
	$('.gradingContent').height(gradeWorkHeight-14);
	
	if(this.gradingType == "step") {
		//fix the width of the statistics table to match the grading select table
		$('#statisticsTable').width($('#chooseStepToGradeTable').width()+10);
	} else if (this.gradingType == "team"){
		//fix the width of the fixedHeader clone to match the team select table
		// TODO: remove when fixedHeader init option "right": true no long throws error
		$('.fixedHeader').width($('#chooseTeamToGradeTable_wrapper').width());
	}
};

/**
 * Toggle the revisions rows for the teacher to see a student's
 * previous revisions for a specific step
 * @param workgroupId the workgroup id of the student
 * @param nodeId the id of the node/step
 */
View.prototype.toggleGradingDisplayRevisions = function(workgroupId, nodeId) {
	//get all the elements with the given class
	var revisionRows = this.getElementsByClassName(null, "studentWorkRevisionRow_" + workgroupId + "_" + nodeId, null);
	
	//loop through all the elements
	for(var x=0; x<revisionRows.length; x++) {
		//get one of the elements
		var revisionRow = revisionRows[x];
		
		//toggle the visibility
		if(revisionRow.style.display == "none") {
			//show revisions
			revisionRow.style.display = "";
			
			//check if the row we are showing is a student work row
			if(revisionRow.id.indexOf("studentWorkRow") != -1) {
				//it is a student work row
				
				//get the step work id and workgroup id
				var stepWorkId = this.getStudentWorkIdFromStudentWorkRowId(revisionRow.id);
				var workgroupId = this.getWorkgroupIdFromStudentWorkRowId(revisionRow.id);
				
				//render the student work if it has not already been rendered
				this.renderStudentWork(stepWorkId, workgroupId);
			}
		} else {
			//hide revisions
			revisionRow.style.display = "none";
		}
	}
	
	//fix the height so scrollbars don't show up
	this.fixGradingDisplayHeight();
};


/**
 * Get the period that is currently chosen in the radio buttons
 * @return the period that is selected
 */
View.prototype.getPeriodFilterSelected = function() {
	var selectedPeriod = null;
	
	//get the divs that contain the radio buttons
	//var periodRadioButtonDivs = this.getElementsByClassName(null, 'periodRadioChoice', null);
	
	//get the divs that contain the period selector divs
	var periodSelects = $('.periodChoice');
	
	//get all the input elements in divs with class periodRadioChoice
	//var periodRadioButtonInputs = $('.periodRadioChoice input');
	
	/*
	 * loop through all the inputs to see if it's checked in order
	 * to find the period that is selected
	 */
	/*periodRadioButtonInputs.each(function() {
		if($(this).attr('checked')) {
			selectedPeriod = $(this).attr('value');
		}
	});*/
	periodSelects.each(function(){
		if($(this).hasClass('checked')){
			selectedPeriod = $(this).attr('id');
		}
	});
	
	if(selectedPeriod) {
		//remove the 'period' portion of the string
		selectedPeriod = selectedPeriod.replace('period', '');
	}
	
	//return the period
	return selectedPeriod;
};

/**
 * Checks if the show flagged items checkbox is checked
 * @return whether to only show the flagged items
 */
View.prototype.isFlaggedItemsChecked = function() {
	//the default value
	var showFlagged = null;
	
	//try to obtain the check box
	var showFlaggedItemsCheckBox = document.getElementById("onlyShowFilteredItemsCheckBox");
	
	//check if the check box exists, some pages do not have it
	if(showFlaggedItemsCheckBox) {
		//see if the checkbox was checked
		showFlagged = showFlaggedItemsCheckBox.checked;
	}
	
	return showFlagged;
};

/**
 * Checks if the show smart-filtered items checkbox is checked
 * @return whether to only show the smart-filtered items
 */
View.prototype.isSmartFilterChecked = function() {
	//the default value
	var showSmartFiltered = null;
	
	//try to obtain the check box
	var showSmartFilteredItemsCheckBox = document.getElementById("onlyShowSmartFilteredItemsCheckBox");
	
	//check if the check box exists, some pages do not have it
	if(showSmartFilteredItemsCheckBox) {
		//see if the checkbox was checked
		showSmartFiltered = showSmartFilteredItemsCheckBox.checked;
	}
	
	return showSmartFiltered;
};

/**
 * Determine if we are showing revisions or not by looking
 * at the radio button
 * @return whether we are showing revisions or not
 */
View.prototype.isShowRevisions = function() {
	//the default value
	var showRevisions = null;
	
	//get the check box for show all revisions
	var showRevisionsInput = document.getElementById("showAllRevisions");
	
	//check that the check box exists
	if(showRevisionsInput) {
		//check if the check box was checked
		showRevisions = showRevisionsInput.checked;
	}
	
	return showRevisions;
};

/**
 * Determine whether we are hiding personal info
 * @return whether we are hiding personal info or not
 */
View.prototype.isHidePersonalInfo = function() {
	//the default value
	var onlyShowWork = null;
	
	var onlyShowWorkCheckBox = document.getElementById('onlyShowWorkCheckBox');
	
	if(onlyShowWorkCheckBox) {
		onlyShowWork = onlyShowWorkCheckBox.checked;
	}
	
	//check box was not checked
	return onlyShowWork;
};

/**
 * Determine whether we are enlarging text
 * @return whether we are enlarging text or not
 */
View.prototype.isEnlargeStudentWorkText = function() {
	var enlargeStudentWorkText = null;
	
	var enlargeStudentWorkTextCheckBox = document.getElementById('enlargeStudentWorkTextCheckBox');
	
	if(enlargeStudentWorkTextCheckBox) {
		enlargeStudentWorkText = enlargeStudentWorkTextCheckBox.checked;
	}
	
	//check box was not checked
	return enlargeStudentWorkText;
};

/**
 * Determine if the "Sort By Auto Graded Score" checkbox is checked
 * @return whether the "Sort By Auto Graded Score" checkbox is checked
 */
View.prototype.isSortByAutoGradedScoreChecked = function() {
	var sortByAutoGradedScoreChecked = false;
	
	if($('#sortByAutoGradedScoreCheckbox').length != 0) {
		if($('#sortByAutoGradedScoreCheckbox').attr('checked') == 'checked') {
			sortByAutoGradedScoreChecked = true;
		}
	}
	
	//check box was not checked
	return sortByAutoGradedScoreChecked;
};

/**
 * Set the current visible period to the selected period choice div
 */
View.prototype.setSelectedPeriod = function(item) {
	$('.periodChoice').removeClass('checked');
	$(item).addClass('checked');
	this.filterStudentRows();
}

/**
 * Filter the student rows that are displayed in the grading view
 * by looking at what period is selected, whether filter flagging
 * is selected, and whether show revisions is selected
 */
View.prototype.filterStudentRows = function() {
	//get the period that is selected
	var period = this.getPeriodFilterSelected();
	
	if(period != null) {
		this.gradingPeriod = period;	
	}
	
	//get whether we are to only show flagged items
	var showFlagged = this.isFlaggedItemsChecked();
	
	if(showFlagged != null) {
		this.gradingShowFlagged = showFlagged;		
	}
	
	//get whether we are to only show items that passed smart filter
	var showSmartFiltered = this.isSmartFilterChecked();
	
	if(showSmartFiltered != null) {
		this.gradingShowSmartFiltered = showSmartFiltered;		
	}
	
	//get whether we are to show revisions
	var showRevisions = this.isShowRevisions();
	
	if(showRevisions != null) {
		this.gradingShowRevisions = showRevisions;	
	}
	
	//get whether we are hiding personal info
	var hidePersonalInfo = this.isHidePersonalInfo();
	
	if(hidePersonalInfo != null) {
		this.gradingHidePersonalInfo = hidePersonalInfo;
	}
	
	//get whether we are enlarging student work text	
	var enlargeStudentWorkText = this.isEnlargeStudentWorkText();

	if(enlargeStudentWorkText != null) {
		this.gradingEnlargeStudentWorkText = enlargeStudentWorkText;
	}
	
	// tell node to show/hide smart filter
	if (this.currentGradingDisplayParam && this.currentGradingDisplay == 'displayGradeByStepGradingPage') {
		//get the node object
		var nodeId = this.currentGradingDisplayParam[1];
		var node = this.getProject().getNodeById(nodeId);
		node.showSmartFilter(showSmartFiltered);
	}
	
	//get all the student work rows
	var studentWorkRows = this.getElementsByClassName(null, 'studentWorkRow', null);
	
	//loop through all the student work rows
	for(var x=0; x<studentWorkRows.length; x++) {
		//get a student work row
		var studentWorkRow = studentWorkRows[x];
		
		//get the class for the student work row
		var studentRowClass = studentWorkRow.className;
		
		//the default value
		var displayStudentRow = true;
		
		/*
		 * filter by period (check if the current row is in the period
		 * that is currently selected
		 */
		if(period == 'all') {
			//all periods should be shown
			
			/*
			 * this is a special case only checked if the grading view is
			 * 'displayGradeByStepSelectPage'. for 'displayGradeByStepSelectPage'
			 * when 'All Periods' is selected we need to show the special
			 * aggregate row and not all the rows.
			 */
			if(this.currentGradingDisplay == 'displayGradeByStepSelectPage') {
				if(studentRowClass.indexOf("periodAll") == -1) {
					//it does not have the "periodAll" class so we will hide it
					displayStudentRow = false;
				}
			}
		} else if(studentRowClass.indexOf("period" + period) != -1) {
			//the row is in the period we want to show
		} else if(this.currentGradingDisplay == 'displayGradeByTeamGradingPage') {
			/*
			 * we are in the grade by team grading page so period filtering is not applicable
			 * because we are grading a specific team
			 */
		} else {
			//the row is not in the period we want to show so we will not show it
			displayStudentRow = false;
		}
		
		/*
		 * filter by flagged (check if only show flagged items is checked
		 * and if so, check if the row is flagged)
		 */
		if(showFlagged) {
			//only show flagged items is selected
			if(studentWorkRow.getAttribute('isFlagged') != 'true') {
				//the row is not flagged so we will not show it
				displayStudentRow = false;
			}
		}
		
		//filter by revisions (check if show revisions is checked
		if(!showRevisions) {
			/*
			 * show revisions is not checked so we need to hide revisions unless
			 * flagging is on and the revision is flagged
			 */
			
			if(showFlagged && studentWorkRow.getAttribute('isFlagged') == 'true') {
				/*
				 * allow the row to be displayed because show flagged is on and
				 * this revision is flagged
				 */
			} else if(studentRowClass.indexOf('studentWorkRevisionRow') != -1) {
				//the row is a revision so we will not show it
				displayStudentRow = false;
			}
		}
		
		if(showSmartFiltered) {
			//filter smart filtered items
			if(studentRowClass.indexOf('smartFilterHide') != -1 || studentRowClass.indexOf('noWork') != -1) {
				//the smart filter has set this row to be hidden
				displayStudentRow = false;
			}
		}
		
		//set the style to show or display the row
		if(displayStudentRow) {
			studentWorkRow.style.display = "";

			//check if the row we are showing is a student work row
			if(studentWorkRow.id.indexOf("studentWorkRow") != -1) {
				//it is a student work row
				
				//get the step work id and workgroup id
				var stepWorkId = this.getStudentWorkIdFromStudentWorkRowId(studentWorkRow.id);
				var workgroupId = this.getWorkgroupIdFromStudentWorkRowId(studentWorkRow.id);
				
				//render the student work if it has not already been rendered
				this.renderStudentWork(stepWorkId, workgroupId);
			}
		} else {
			studentWorkRow.style.display = "none";
		}
	}
	
	/*
	 * apply the hide personal info filter if necessary, do not perform the filter
	 * if we are on the grade by step select page because it will hide the statistics
	 */
	if(this.gradingHidePersonalInfo && this.currentGradingDisplay != 'displayGradeByStepSelectPage') {
		this.onlyShowWorkOnClick();
	}
	
	//apply the enlarge student work text if necessary
	if(this.gradingEnlargeStudentWorkText) {
		this.enlargeStudentWorkText();
	}
	
	//here we will check if we need to sort by auto graded score
	if(this.currentGradingDisplayParam != null) {
		var nodeId = this.currentGradingDisplayParam[1];
		
		/*
		 * in grade by step the node id should be not null but in
		 * grade by team the node id should be null
		 */
		if(nodeId != null) {
			//get the content for the step
			var nodeContent = this.project.getNodeById(nodeId).getContent().getContentJSON();
			
			if(nodeContent.gradingCriteria != null) {
				/*
				 * the step has a grading criteria so we will check if we need to sort by
				 * auto graded score
				 */
				this.gradingSortByAutoGradedScore = this.isSortByAutoGradedScoreChecked();
				
				if(this.gradingSortByAutoGradedScore) {
					//sort by auto graded score
					this.sortByAutoGradedScore();
				} else {
					//revert the rows back to the original sort order (which should be alphabetical)
					this.sortByOriginalOrder();
				}
			}			
		}
	}
	
	//fix the height so scrollbars don't show up
	this.fixGradingDisplayHeight();
};

/**
 * Get the studentWorkId from the DOM studentWorkRowId.
 * @param studentWorkRowId the DOM id of the student work row.
 * the student work id will be after the last '_'
 * e.g. studentWorkRow_16784_node_13.se_627685
 * @return the student work id
 * e.g. 627685
 */
View.prototype.getStudentWorkIdFromStudentWorkRowId = function(studentWorkRowId) {
	//get the index of the last '_'
	var lastIndex = studentWorkRowId.lastIndexOf('_');
	
	//get all the string after the last '_'
	var studentWorkId = studentWorkRowId.substring(lastIndex + 1);
	
	return studentWorkId;
};

/**
 * Get the workgroupId from the DOM studentWorkRowId.
 * @param studentWorkRowId the DOM id of the student work row.
 * the workgroup id will be betweeen the first and second '_'
 * e.g. studentWorkRow_16784_node_13.se_627685
 * @return the workgroup id
 * e.g. 16784
 */
View.prototype.getWorkgroupIdFromStudentWorkRowId = function(studentWorkRowId) {
	//get the index of the first '_'
	var firstUnderscoreIndex = studentWorkRowId.indexOf('_');
	
	//get the index of the second '_'
	var secondUnderscoreIndex = studentWorkRowId.indexOf('_', firstUnderscoreIndex + 1);
	
	//get the string between the two '_'
	var workgroupId = studentWorkRowId.substring(firstUnderscoreIndex + 1, secondUnderscoreIndex);
	
	return workgroupId;
};

/**
 * Enlarges the student work text or set the student work text
 * back to normal size.
 */
View.prototype.enlargeStudentWorkText = function() {
	//get the check box for enlarge student work text
	var enlargeStudentWorkTextCheckBox = document.getElementById('enlargeStudentWorkTextCheckBox');
	
	if(enlargeStudentWorkTextCheckBox) {
		if(enlargeStudentWorkTextCheckBox.checked) {
			//check box was checked
			this.gradingEnlargeStudentWorkText = true;
			
			//get all the work columns
			var workColumns = this.getElementsByClassName(null, 'workColumn', null);
			
			//loop through all the work columns
			for(var x=0; x<workColumns.length; x++) {
				//set the style font-size to be large
				workColumns[x].style.cssText = "font-size:3.0em";	
			}
		} else {
			//check box was not checked
			this.gradingEnlargeStudentWorkText = false;
			
			//get all the work columns
			var workColumns = this.getElementsByClassName(null, 'workColumn', null);
			
			//loop through all the work columns
			for(var x=0; x<workColumns.length; x++) {
				/*
				 * set the style font-size to nothing so that the html
				 * will revert back to using the styling from the css file
				 */
				workColumns[x].style.cssText = "";	
			}
		}
	}
	
	//fix the height so scrollbars don't show up
	this.fixGradingDisplayHeight();
};

/**
 * Sort the student rows by auto graded score. This is only called in
 * grade by step and the step has a grading criteria.
 */
View.prototype.sortByAutoGradedScore = function() {
	//get the node content
	var nodeId = this.currentGradingDisplayParam[1];
	var nodeContent = this.project.getNodeById(nodeId).getContent().getContentJSON();
	
	if(nodeContent.gradingCriteria != null) {
		//the step has a grading criteria
		
		/*
		 * sort the rows based on the auto graded score from
		 * highest score to lowest
		 */ 
		this.studentWorkRowOrderObjects.sort(this.sortStudentWorkRowsByAutoGradedScore);
		
		//loop through all the student work row objects
		for(var x=0; x<this.studentWorkRowOrderObjects.length; x++) {
			//get an object
			var studentWorkRowOrderObject = this.studentWorkRowOrderObjects[x];
			
			//get the DOM id of the tr row
			var studentWorkRowId = studentWorkRowOrderObject.studentWorkRowId;
			
			/*
			 * append the row to the end of the table. this will remove it from the existing
			 * position it is already in within the table. we will eventually call append for 
			 * all the rows so the whole table will end up being sorted the way we want it.
			 */
			$('#studentWorkTable').append(document.getElementById(studentWorkRowId));
			
			//check if this row has child revisions
			if(this.studentWorkRowRevisions[studentWorkRowId] != null) {
				//this row does have child revisions so we will get the ids of those child revision rows
				var studentWorkRowRevisionsArray = this.studentWorkRowRevisions[studentWorkRowId];
				
				//loop through all the child revision rows
				for(var y=0; y<studentWorkRowRevisionsArray.length; y++) {
					//get a child revision row id
					var studentWorkRowRevisionId = studentWorkRowRevisionsArray[y];
					
					//append the child revision row to the table
					$('#studentWorkTable').append(document.getElementById(studentWorkRowRevisionId));
				}
			}
		}
	}
};

/**
 * Sort the grade by step student work rows by their original order
 * (this should be alphabetical based on the student usernames)
 */
View.prototype.sortByOriginalOrder = function() {
	//loop through all the row ids
	for(var x=0; x<this.originalStudentWorkRowOrder.length; x++) {
		//get a row id
		var studentWorkRowId = this.originalStudentWorkRowOrder[x];
		
		//append the row to the table
		$('#studentWorkTable').append(document.getElementById(studentWorkRowId));
	}
};

/**
 * Function used by array.sort(function) to sort the objects in the 
 * studentWorkRowOrderObjects array
 * @param obj1 a studentWorkRowOrderObject
 * @param obj2 a studentWorkRowOrderObject
 * @return 
 * less than 0 if obj1 should be before obj2
 * 0 if obj1 and obj2 should be equal in position
 * more than 0 if obj1 should be after obj2
 */
View.prototype.sortStudentWorkRowsByAutoGradedScore = function(obj1, obj2){
	var result = 0;
	
	if(obj1 != null && obj2 != null) {
		//get the auto graded score for each object
		var obj1Score = obj1.autoGradedScore;
		var obj2Score = obj2.autoGradedScore;
		
		if(obj1Score != null && obj2Score != null) {
			/*
			 * find the difference between the scores which will
			 * determine how the objects should be ordered
			 */
			result = obj2Score - obj1Score;
		} else if(obj1Score == null) {
			//if obj1 does not have a score, obj2 should come before obj1
			result = 1;
		} else if(obj2Score == null) {
			//if obj2 does not have a score, obj1 should come before obj2
			result = -1;
		}
	}
	
	return result;
};

/**
 * Get whether input elements should be disabled or not
 * @return whether input elements should be disabled or not
 * depending on whether the user has write permission
 * 'disabled' if disabled
 * '' if enabled
 */
View.prototype.isWriteAllowed = function() {
	//the default value
	var writePermission = 'disabled';
	
	if(this.gradingPermission == 'write') {
		//user has write permission so element should be enabled
		writePermission = '';
	} else if(this.gradingPermission == 'read') {
		//user has read permission so element should be disabled
		writePermission = 'disabled';
	}
	
	return writePermission;
};

/**
 * Render all the student work for a given node. This is used
 * by gradeByStep.
 * @param node the node for the step we are displaying in the
 * grade by step
 */
View.prototype.renderAllStudentWorkForNode = function(node) {
	//get all the vleStates
	var vleStates = this.getVleStatesSortedByUserName();
	
	//get the node id
	var nodeId = node.id;
	
	//loop through all the vleStates, each vleState is for a workgroup
	for(var x=0; x<vleStates.length; x++) {
		//get a vleState
		var vleState = vleStates[x];
		
		//get the workgroup id
		var workgroupId = vleState.dataId;

		//get the revisions
		var nodeVisitRevisions = vleState.getNodeVisitsWithWorkByNodeId(nodeId);
		
		var latestNodeVisit = null;
		
		if(nodeVisitRevisions.length > 0) {
			//get the latest work for the current workgroup
			latestNodeVisit = nodeVisitRevisions[nodeVisitRevisions.length - 1];
		}
		
		/*
		 * this new way of displaying student work in grading is only implemented
		 * for new node types at the moment. we will convert all the other steps to
		 * this way later.
		 */
		if(this.isSelfRenderingGradingViewNodeType(node.type)) {
			//check if the student submitted any work
			if(latestNodeVisit != null) {
				//render the student work for the node visit
				this.renderStudentWorkFromNodeVisit(latestNodeVisit, workgroupId);
			}
		}
	}
};

/**
 * Render all the work for a student workgroup. This is used by
 * gradeByTeam.
 * @param workgroupId the id of the workgroup we want to display work for
 */
View.prototype.renderAllStudentWorkForWorkgroupId = function(workgroupId) {
	//get all the node ids in the project
	var nodeIds = this.getProject().getNodeIds();
	
	//get the work for the workgroup id
	var vleState = this.getVleStateByWorkgroupId(workgroupId);
	
	//loop through all the node ids
	for(var x=0; x<nodeIds.length; x++) {
		//get a node id
		var nodeId = nodeIds[x];
		
		//get the node object
		var node = this.getProject().getNodeById(nodeId);

		/*
		 * this new way of displaying student work in grading is only implemented
		 * for new node types at the moment. we will convert all the other steps to
		 * this way later.
		 */
		if(this.isSelfRenderingGradingViewNodeType(node.type)) {
			//get the latest node visit for this workgroup for this node
			var latestNodeVisit = vleState.getLatestNodeVisitByNodeId(nodeId);
			
			//check if the student submitted any work
			if(latestNodeVisit != null) {
				//render the student work for the node visit
				this.renderStudentWorkFromNodeVisit(latestNodeVisit, workgroupId);
			}
		}
	}
};

/**
 * Render the student work for the node visit
 * @param nodeVisit the node visit we want to display
 */
View.prototype.renderStudentWorkFromNodeVisit = function(nodeVisit, workgroupId) {
	if(nodeVisit != null) {
		//get the step work id
		var stepWorkId = nodeVisit.id;
		
		//get the student work
		var studentWork = nodeVisit.getLatestWork();
		
		//get the timestamp for when the work was posted
		var nodeVisitPostTime = nodeVisit.visitPostTime;
		
		//get the node object that the work is for
		var node = this.getProject().getNodeById(nodeVisit.nodeId);
		
		/*
		 * check if the work for this student for this step has already 
		 * been rendered. we can tell by checking that the studentWorkDiv
		 * is empty.
		 */
		if($("#studentWorkDiv_" + stepWorkId).html() == "") {
			//the div is empty so we need to render the student work
			
			//tell the node to insert/render the student work into the div
			if(node.type == "FlashNode"){
				if(node.getContent().getContentJSON().gradingType == "flashDisplay"){
					//if node type if FlashNode and grading type is set to flashDisplaty render Flash applet with stored student data
					var nodeContent = node.getContent().getContentJSON();
					node.renderGradingViewFlash("studentWorkDiv_" + stepWorkId, nodeVisit, "", workgroupId, nodeContent);
				} else if (node.getContent().getContentJSON().gradingType == "custom"){
					//if node type if FlashNode and grading type is set to custom render custom grading output
					var nodeContent = node.getContent().getContentJSON();
					node.renderGradingViewCustom("studentWorkDiv_" + stepWorkId, nodeVisit, "", workgroupId, nodeContent);
				} else {
					node.renderGradingView("studentWorkDiv_" + stepWorkId, nodeVisit, "", workgroupId);
				}
			} else {
				node.renderGradingView("studentWorkDiv_" + stepWorkId, nodeVisit, "", workgroupId);
			}
			
			//add the post time stamp to the bottom of the student work
			$("#studentWorkDiv_" + stepWorkId).append("<p class='lastAnnotationPostTime'>"+this.getI18NString("timestamp")+": " + new Date(nodeVisitPostTime) + "</p>");	
		}
	}
};

/**
 * Render the the student work for the given step work id. This is used
 * by filterStudentRows() and toggleGradingDisplayRevisions().
 * @param stepWorkId the id of the node visit/step work
 * @param workgroupId the id of the workgroup (this argument is
 * optional, it is used to make the call to getStudentWorkByStudentWorkId()
 * more efficient when searching for the node visit)
 */
View.prototype.renderStudentWork = function(stepWorkId, workgroupId) {
	/*
	 * get the node visit for the given id and workgroup id. the workgroup id
	 * is optional and helps make the search more efficient.
	 */
	var nodeVisit = this.getStudentWorkByStudentWorkId(stepWorkId, workgroupId);

	if(nodeVisit != null) {
		//render the student work for the node visit
		this.renderStudentWorkFromNodeVisit(nodeVisit, workgroupId);
	}
};

/**
 * Get the student work given the student work id/nodevisit id
 * @param studentWorkId the student work id/nodevisit id
 * @param workgroupId the id of the workgroup that we know
 * is associated with the student work id (this argument is
 * optional and is used to make the search more efficient) 
 * @return the node visit that has the given student work id
 * or null if not found
 */
View.prototype.getStudentWorkByStudentWorkId = function(studentWorkId, workgroupId) {
	//get all the vle states, each vle state represents the work for a workgroup
	var vleStates = this.getVleStatesSortedByUserName();
	
	//loop through all the vle states
	for(var x=0; x<vleStates.length; x++) {
		//get a vle state
		var vleState = vleStates[x];
		
		/*
		 * search this vle state if workgroup id was not provided
		 * or if the workgroup id was provided and it matches the
		 * vle state data id. basically if the workgroup id was provided
		 * and it doesn't match the vle state data id, we will skip
		 * this vle state and move on to the next one because
		 * it is assumed the student work id is associated with
		 * the workgroup id.
		 */
		if(workgroupId == null || vleState.dataId == workgroupId) {
			//get the node visit given the student work id/nodevisit id
			var nodeVisit = vleState.getNodeVisitById(studentWorkId);
			
			//return the node visit
			return nodeVisit;
		}
	}
	
	//we did not find any matching student work id/nodevisit id
	return null;
};

/**
 * displays the mysystem diagram in the specified div
 */
function showDiagram(divId, contentBaseUrl) {
    //var json_data = [{"containers": [{"terminals": [{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal1", "direction": [0, -1], "offsetPosition": {"left": 20, "top": -25}, "ddConfig": {"type": "input", "allowedTypes": ["input", "output"]}}, {"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal2", "direction": [0, 1], "offsetPosition": {"left": 20, "bottom": -25}, "ddConfig": {"type": "output", "allowedTypes": ["input", "output"]}}], "draggable": true, "position": ["191px", "67px"], "className": "WireIt-Container WireIt-ImageContainer", "ddHandle": false, "ddHandleClassName": "WireIt-Container-ddhandle", "resizable": false, "resizeHandleClassName": "WireIt-Container-resizehandle", "close": true, "closeButtonClassName": "WireIt-Container-closebutton", "title": "table", "icon": "http://209.20.92.79:8080/vlewrapper/curriculum/15/images/battery.jpg", "preventSelfWiring": true, "image": "http://209.20.92.79:8080/vlewrapper/curriculum/15/images/battery.jpg", "xtype": "MySystemContainer", "fields": {"energy": 100, "form": "light", "efficiency": 1}, "name": "table", "has_sub": false}, {"terminals": [{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal1", "direction": [0, -1], "offsetPosition": {"left": 20, "top": -25}, "ddConfig": {"type": "input", "allowedTypes": ["input", "output"]}}, {"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal2", "direction": [0, 1], "offsetPosition": {"left": 20, "bottom": -25}, "ddConfig": {"type": "output", "allowedTypes": ["input", "output"]}}], "draggable": true, "position": ["72px", "83px"], "className": "WireIt-Container WireIt-ImageContainer", "ddHandle": false, "ddHandleClassName": "WireIt-Container-ddhandle", "resizable": false, "resizeHandleClassName": "WireIt-Container-resizehandle", "close": true, "closeButtonClassName": "WireIt-Container-closebutton", "icon": "http://209.20.92.79:8080/vlewrapper/curriculum/15/images/battery.jpg", "preventSelfWiring": true, "image": "./images/thermodynamics/hotbowl.png", "xtype": "MySystemContainer", "fields": {"name": "hot bowl", "energy": 100, "form": "light", "efficiency": 1}, "name": "hot bowl", "has_sub": false}], "wires": [{"src": {"moduleId": 1, "terminal": "Terminal2"}, "tgt": {"moduleId": 0, "terminal": "Terminal2"}, "options": {"className": "WireIt-Wire", "coeffMulDirection": 100, "drawingMethod": "bezierArrows", "cap": "round", "bordercap": "round", "width": 5, "borderwidth": 1, "color": "#BD1550", "bordercolor": "#000000", "fields": {"name": "flow", "width": 5, "color": "color2"}, "selected": false}}]}];
    //var json_data = eval(document.getElementById(divId).innerHTML);
    var json_data = document.getElementById(divId).innerHTML;
    document.getElementById(divId).innerHTML = "";
    var width="800";
    var height="600";
    var scale=0.55;
    try {
      new MySystemPrint(json_data,divId,contentBaseUrl);
    } catch (err) {
    	// do nothing
    }
} 

function showDiagramNode(currNode, nodeIndex, nodeList) {
	showDiagram($(this).attr("id"),$(this).attr("contentBaseUrl"));
}

function showDrawNode(currNode) {
	var svgString = String($(this).html());
	svgString = Utils.decode64(svgString);
	var svgXml = Utils.text2xml(svgString);
	$(this).html('');
	$(this).append(document.importNode(svgXml.documentElement, true)); // add svg to cell
}

function showSnaps(currNode){
	var svgString = String($(this).html());
	svgString = Utils.decode64(svgString);
	var svgXml = Utils.text2xml(svgString);
	$(this).html('');
	$(this).append(document.importNode(svgXml.documentElement, true)); // add svg to cell
}

// TODO: figure out a fix for arrows (markers) not displaying in enlarged view
function enlargeDraw(divId){
	/*var svg = "<?xml version='1.0'?>\n" + $('#'+divId).html();
	svg = svg.replace(/xlink/,"xmlns:xlink");
	svg = svg.replace(/(<svg.*)width="360"/, '$1width="600"');
	svg = svg.replace(/(<svg.*)height="270"/, '$1height="450"');
	
	svg = svg.replace(/(<svg.*)width="120"/, '$1width="600"');
	svg = svg.replace(/(<svg.*)height="90"/, '$1height="450"');
	
	svg = svg.replace(/<g transform=".*">/gmi,'<g>');
	svg = svg.replace(/(<image.*)href(.*)(>)/gmi,'$1xlink:href$2\/$3');
	window.open("data:image/svg+xml;base64," + Utils.encode64(svg));*/

	var newwindow = window.open("/vlewrapper/vle/node/draw/svg-edit/svg-editor-grading.html");
	newwindow.divId = divId;
}

function enlargeMS(divId){

	/*
	var data = $('#'+divId).html();
	var contentString = $('#content_'+divId).html();
		
    mysystem.config.dataService = new GradingToolDS(data);
    mysystem.config.jsonURL = contentString;
    mySystem = mysystem.loadMySystem();
	*/
	var newwindow = window.open("/vlewrapper/vle/node/mysystem/grading/mysystem.html");
	newwindow.divId = divId;
}

/**
 * Obtain the latest student work by calling render again to retrieve the
 * latest data.
 */
function refresh() {
	lock();	
	render(this.contentURL, this.userURL, this.getDataUrl, this.contentBaseUrl, this.getAnnotationsUrl, this.postAnnotationsUrl, this.runId, this.getFlagsUrl, this.postFlagsUrl);
}

function removejscssfile(filename, filetype){
 var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
 var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
 var allsuspects=document.getElementsByTagName(targetelement)
 for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
  if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
   allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
 }
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_display.js');
};