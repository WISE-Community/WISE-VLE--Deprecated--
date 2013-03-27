View.prototype.gradingDispatcher = function(type, args, obj) {
	if(type=='displayGradeByStepGradingPage') {
		obj.displayGradeByStepGradingPage(args[0], args[1]);
	} else if(type=='displayGradeByTeamGradingPage') {
		obj.displayGradeByTeamGradingPage(args[0]);
	} else if(type=='displayResearcherToolsPage') {
		obj.displayResearcherToolsPage();
	} else if(type=='displayCustomExportPage') {
		obj.displayCustomExportPage();
	} else if(type=='displaySpecialExportPage') {
		obj.displaySpecialExportPage();
	} else if(type=='saveScore') {
		obj.checkAndSaveScore(args[0], args[1], args[2], args[3], args[4]);
	} else if(type=='saveComment') {
		obj.saveComment(args[0], args[1], args[2], args[3], args[4], args[5]);
	} else if(type=='saveFlag') {
		obj.saveFlag(args[0], args[1], args[2], args[3], args[4], args[5]);
	} else if(type=='saveInappropriateFlag') {
		obj.saveInappropriateFlag(args[0], args[1], args[2], args[3], args[4], args[5]);
	} else if(type=='processUserAndClassInfoCompleted') {
		obj.retrieveProjectMetaData();
	} else if(type=='gradingConfigUrlReceived') {
		obj.getGradingConfig(args[0]);
	} else if(type=='getGradingConfigComplete') {
		obj.retrieveLocales("main");		
		obj.loadProject(args[0], args[1], args[2]);
		obj.initializeSession();
	} else if(type=='loadingProjectCompleted') {
		obj.getStudentUserInfo();
		obj.checkAndMinify();
	} else if(type=='getAllStudentWorkXLSExport') {
		obj.getAllStudentWorkXLSExport();
	} else if(type=='getLatestStudentWorkXLSExport') {
		obj.getLatestStudentWorkXLSExport();
	} else if(type=='getIdeaBasketsExcelExport') {
		obj.getIdeaBasketsExcelExport();
	} else if(type=='getFlashExcelExport') {
		obj.getFlashExcelExport();
	} else if(type=='getExplanationBuilderWorkExcelExport') {
		obj.getExplanationBuilderWorkExcelExport();
	} else if(type=='getCustomLatestStudentWorkExport') {
		obj.getCustomLatestStudentWorkExport();
	} else if(type=='getCustomAllStudentWorkExport') {
		obj.getCustomAllStudentWorkExport();
	} else if(type=='customActivityCheckBoxClicked') {
		obj.customActivityCheckBoxClicked(args[0]);
	} else if(type=='customSelectAllStepsCheckBoxClicked') {
		obj.customSelectAllStepsCheckBoxClicked();
	} else if(type=='getStudentNamesExport') {
		obj.getStudentNamesExport();
	} else if(type=='getProjectMetaDataCompleted') {
		obj.retrieveAnnotations();
	} else if(type=='saveMaxScore') {
		obj.saveMaxScore(args[0], args[1]);
	} else if(type=='showScoreSummary') {
		obj.showScoreSummary();
	} else if(type=='filterPeriod') {
		obj.filterPeriod(args[0], args[1]);
	} else if(type=='displayGradeByStepSelectPage') {
		obj.displayGradeByStepSelectPage();
	} else if(type=='displayGradeByTeamSelectPage') {
		obj.displayGradeByTeamSelectPage();
	} else if(type=='displayStudentUploadedFiles') {
		obj.displayStudentUploadedFiles();
	} else if(type=='togglePrompt') {
		obj.togglePrompt(args[0]);
	} else if(type=='refreshGradingScreen') {
		obj.refreshGradingScreen();
	} else if(type=='smartFilter') {
		obj.smartFilter();
	} else if(type=='getAnnotationsCompleted') {
		obj.getIdeaBaskets();
	} else if(type=='getIdeaBasketsComplete') {
		eventManager.fire("projectDataReceived");
		obj.initiateGradingDisplay();
	} else if(type=='getStudentWorkComplete') {
		obj.calculateGradingStatistics();
		obj.reloadRefreshScreen();
		if (obj.gradingType == "monitor") {
			// if we're doing a classroom monitor, we need to display the student work in the div
			obj.displayNodeVisitsInStream();
		}
		obj.displayGroupAssignments();
	} else if(type=='toggleGradingDisplayRevisions') {
		obj.toggleGradingDisplayRevisions(args[0], args[1]);
	} else if(type=='toggleAllGradingDisplayRevisions') {
		obj.toggleAllGradingDisplayRevisions(args[0]);
	} else if(type=='onlyShowFilteredItemsOnClick') {
		obj.onlyShowFilteredItemsOnClick();
	} else if(type=='onlyShowWorkOnClick') {
		obj.onlyShowWorkOnClick();
	} else if(type=='filterStudentRows') {
		obj.filterStudentRows();
	} else if(type=='enlargeStudentWorkText') {
		obj.enlargeStudentWorkText();
	} else if(type=='openPremadeComments') {
		obj.openPremadeComments(args[0], args[1]);
	} else if(type=='selectPremadeComment') {
		obj.selectPremadeComment(args[0]);
	} else if(type=='submitPremadeComment') {
		obj.submitPremadeComment();
	} else if(type=='premadeCommentWindowLoaded') {
		obj.premadeCommentWindowLoaded();
	} else if(type=='addPremadeComment') {
		obj.addPremadeComment(args[0]);
	} else if(type=='deletePremadeComment') {
		obj.deletePremadeComment(args[0], args[1]);
	} else if(type=='deletePremadeCommentList') {
		obj.deletePremadeCommentList(args[0]);
	} else if(type=='premadeCommentLabelClicked') {
		obj.premadeCommentLabelClicked(args[0]);
	} else if(type=='premadeCommentListUncheckLabels') {
		obj.premadeCommentListUncheckLabels(args[0]);
	} else if(type=='displayExportExplanation') {
		obj.displayExportExplanation(args[0]);
	} else if(type=='setSelectedPeriod') {
		obj.setSelectedPeriod(args[0]);
	} else if(type=='editGroups') {
		obj.editGroups(args[0]);
	} else if(type=='groupClicked') {
		obj.groupClicked(args[0]);
	} else if(type=='getSpecialExport') {
		obj.getSpecialExport(args[0]);
	} else if(type=='displayChatRoom') {
		obj.displayChatRoom();
	} else if(type=='chatRoomTextEntrySubmitted') {
		obj.sendChat(args[0]);
	} else if(type=='realTimeMonitorSelectWorkgroupIdDropDownClicked') {
		obj.realTimeMonitorSelectWorkgroupIdDropDownClicked();
	} else if(type=='realTimeMonitorSelectStepDropDownClicked') {
		obj.realTimeMonitorSelectStepDropDownClicked();
	} else if(type=='realTimeMonitorShareWithClassClicked') {
		obj.realTimeMonitorShareWithClassClicked(args[0],args[1]);
	} else if(type=='lockScreenAndShareWithClass') {
		obj.lockScreenAndShareWithClass(args[0]);
	} else if(type=='maximizeRightTdButtonClicked') {
		obj.maximizeRightTdButtonClicked();
	}
};


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_dispatcher.js');
};