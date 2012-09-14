/**
 * Displays all node visits in stream. called during initiation of classroom monitor
 */
View.prototype.displayNodeVisitsInStream = function() {
	// goes through all the students' nodevisits and displays them in the classroom monitor stream div by calling displayNodeVisitInStream
	var allNodeVisitsArray = [];
	for (var i=0; i < this.vleStates.length; i++) {
		var vleState = this.vleStates[i];
		var vleStateWorkgroupId = vleState.workgroupId;
		var vleStateNodeVisits = vleState.visitedNodes;
		for (var j=0; j<vleStateNodeVisits.length; j++) {
			var vleStateNodeVisit = vleStateNodeVisits[j];
			vleStateNodeVisit.workgroupId = vleStateWorkgroupId;  // inject workgroupId so we can retrieve it later after sorting
			allNodeVisitsArray.push(vleStateNodeVisit);
		}
	}
	
	// sort all nodevisits by submitted timestamp
	allNodeVisitsArray.sort(this.sortNodeVisitsByVisitPostTime);
	
	// now go through the sorted nodevisits and call displayNodeVisitInStream
	for (var k=0; k<allNodeVisitsArray.length; k++) {
		var nodeVisit = allNodeVisitsArray[k];
		this.displayNodeVisitInStream(nodeVisit.workgroupId, nodeVisit);
	}
};

/**
 * Array ordering function to order the node visits by post time.
 * @param a
 * @param b
 * @returns {Number}
 */
View.prototype.sortNodeVisitsByVisitPostTime = function(a, b) {
	if (a.visitPostTime < b.visitPostTime) {
		return -1;
	} else if (a.visitPostTime > b.visitPostTime) {
		return 1;
	} else {
		return 0;
	}
};

/**
 * Display graph (bar graph) for a particular step in step filter mode, like bar graph in MC node filter
 * 
 * @param nodeId ID of step that is filtered and should show the bar graph.
 * @param domId ID of the element where you want to display the graph
 */
View.prototype.displayStepGraph = function(nodeId,domId,workgroupIdToWork) {
	$("#"+domId).html('<img id="realTimeMonitorGraphImg" src="" width="300" height="225" alt="Student Responses"></img>');
	$("#"+domId).append('<img id="realTimeMonitorGraphImg2" src="" width="500" height="200" alt="Student Responses"></img>');

	var choiceToCount = {};
	if (workgroupIdToWork === null) {
		workgroupIdToWork = nodeIdToWork[nodeId];
	}
	var workgroupIdsInClass = this.userAndClassInfo.getWorkgroupIdsInClass();
	var mcChoices = [];
	var node = this.project.getNodeById(nodeId);
	var mcContent = node.content.getContentJSON();
	/* add each choice object from the content to the choices array */
	for(var a=0;a<mcContent.assessmentItem.interaction.choices.length;a++){
		mcChoices.push(mcContent.assessmentItem.interaction.choices[a].text);
	}

	//loop through all the students in the class
	for (var i=0; i<workgroupIdsInClass.length; i++) {
		var workgroupIdInClass = workgroupIdsInClass[i];

		//get the choice the student answered
		var workByWorkgroup = workgroupIdToWork[workgroupIdInClass];

		if (choiceToCount[workByWorkgroup] == null) {
			choiceToCount[workByWorkgroup] = 0;
		}

		//increment the choice
		choiceToCount[workByWorkgroup] += 1;
	}
	var choicesCountArray = [];
	var maxChoiceCountSoFar = 0;  // keep track of maximum count here
	// now loop thru mcChoices and tally up 
	for (var k=0; k<mcChoices.length; k++) {
		var mcChoiceText = mcChoices[k];

		//get the total count for this choice
		var finalCount = choiceToCount[mcChoiceText];
		if (typeof finalCount == "undefined") {
			finalCount = 0;
		}

		/*
		 * add the count for this choice so that the graphing utility
		 * knows how many students chose this choice
		 */
		choicesCountArray.push(finalCount);

		if (finalCount > maxChoiceCountSoFar) {
			/*
			 * update the highest count for any choice to determine the
			 * max y value
			 */
			maxChoiceCountSoFar = finalCount;
		}
	}

	var xLabelStr = "|"+mcChoices.join("|");
	var xLabelStr2 = mcChoices.join("|");
	var tallyStr = choicesCountArray.join(",");

	/*
	 * construct googlecharts url and set realTimeMonitorGraphImg src.
	 * e.g.
	 * http://chart.apis.google.com/chart?chxl=0:|Oscar|Monkey|Oski|Dodo&chxr=1,0,5&chxt=x,y&chbh=a&chs=300x225&cht=bvg&chco=A2C180&chd=t:1,5,0,0&chds=0,5&chp=0&chma=|2&chtt=Student+Responses
	 */
	var realTimeMonitorGraphImgSrc = "http://chart.apis.google.com/chart?chxl=0:"+xLabelStr+"&chxr=1,0,"+(maxChoiceCountSoFar+1)+"&chxt=x,y&chbh=a&chs=300x225&cht=bvg&chco=A2C180&chd=t:"+tallyStr+"&chds=0,"+(maxChoiceCountSoFar+1)+"&chp=0&chma=|2&chtt=Student+Responses";
	var realTimeMonitorGraphImgSrc2 = "http://chart.apis.google.com/chart?cht=p&chs=250x100&chd=t:"+tallyStr+"&chl="+xLabelStr2;
	//display the graph to the teacher
	$("#realTimeMonitorGraphImg").attr("src",realTimeMonitorGraphImgSrc);	
	$("#realTimeMonitorGraphImg2").attr("src",realTimeMonitorGraphImgSrc2);	
};

View.prototype.displayNodeVisitInStream = function(workgroupId, nodeVisit) {
	/*
	 * the teacher has received work from the student so we will
	 * display it in the student work stream
	 */
	var workgroupName = this.userAndClassInfo.getUserNameByUserId(workgroupId);
	var nodeId = nodeVisit.nodeId;
	var stepNumberAndTitle = this.project.getStepNumberAndTitle(nodeId);
	var node = this.project.getNodeById(nodeId);
	var divId = "realTimeStudentWork_" + nodeVisit.id + "_" + workgroupId;
	
	if (!node.hasGradingView()) {
		// return immediately if node does not have a GradingView, like HtmlNode.
		return;
	} 


	/*
	 * add this nodevisit object to local tally so we can access it
	 * later when the teacher wants to share it with the class
	 */
	if (typeof realTimeNodeVisitIdToNodeVisit == "undefined") {
		realTimeNodeVisitIdToNodeVisit = {};
	}
	realTimeNodeVisitIdToNodeVisit[nodeVisit.id] = {
			"workgroupId":workgroupId,
			"workgroupName":workgroupName,
			"stepNumberAndTitle":stepNumberAndTitle,
			"nodeId":nodeId,
			"nodeVisit":nodeVisit
	};

	var selectedWorkgroupIdValue = $('#realTimeMonitorSelectWorkgroupIdDropDown :selected').val();
	var selectedNodeIdValue = $('#realTimeMonitorSelectStepDropDown :selected').val();

	var styleDisplay = 'style="display:none"';

	/*
	 * determine if we need to display or hide this student work based
	 * on the current drop down filters
	 */
	if (selectedWorkgroupIdValue == "all" && selectedNodeIdValue == "all") {
		styleDisplay = '';
	} else if (selectedNodeIdValue != "all" && selectedWorkgroupIdValue != "all") {
		if(workgroupId == selectedWorkgroupIdValue && nodeId == selectedNodeIdValue) {
			styleDisplay = '';
		}
	} else if (selectedWorkgroupIdValue != "all") {
		if(workgroupId == selectedWorkgroupIdValue) {
			styleDisplay = '';
		}
	} else if (selectedNodeIdValue != "all") {
		if(nodeId == selectedNodeIdValue) {
			styleDisplay = '';
		}
	} else {
		//shouldn't reach here
		console.log("shouldn't reach here");
	}
	
	$("#realTimeMonitorStudentWorkDisplayDiv").append('<div id="' + divId + '" class="realTimeStudentWork workgroupId_' + workgroupId + ' nodeId_' + nodeId + '" ' + styleDisplay + '></div>');

	try {
		//render the student grading view for the student work
		node.renderGradingView(divId,nodeVisit,null,workgroupId);      
		var nodeVisitPostTime = new Date(nodeVisit.visitPostTime);

		var studentWorkInfoDiv = "<div id='studentWorkInfoDiv_"+workgroupId+"' class='studentWorkInfoDiv nodeVisitId_"+nodeVisit.id+"'>"+workgroupName+" "+
		stepNumberAndTitle+ "(" + nodeVisitPostTime + ")<a class='shareWithClass' onclick='eventManager.fire(\"realTimeMonitorShareWithClassClicked\", [\"NodeVisit\","+nodeVisit.id+"])'>Share with class</a></div>";
		$("#"+divId).prepend(studentWorkInfoDiv);

		if (node.type == "MultipleChoiceNode") {
			// if the step for this work can be plotted in a histogram, add/update nodeIdToWork
			if (typeof nodeIdToWork == "undefined") {
				/*
				 * an object that maps node id to objects that contain the work
				 * for a specific step
				 */
				nodeIdToWork = {};
			}
			if (nodeIdToWork[nodeId] == null) {
				nodeIdToWork[nodeId] = {};
			}
			if (nodeVisit.getLatestWork() && nodeVisit.getLatestWork().response.length > 0) {
				//add this student work to the mapping
				nodeIdToWork[nodeId][workgroupId] = nodeVisit.getLatestWork().response;        						
			}
			this.displayStepGraph(nodeId,"realTimeMonitorGraphImg");
		} else if (node.type == "OpenResponseNode" || node.type == "NoteNode") {
			// allow teacher to sort incoming student work using drag and drop
			var realTimeStudentWork =  nodeVisit.getLatestWork().response.toString();
			var draggableStudentWorkSpan = $("<span>").html(realTimeStudentWork).css("border","1px solid").css("padding","3px");
			$("#realTimeMonitorDraggableCanvasDiv").append(draggableStudentWorkSpan);
			draggableStudentWorkSpan.draggable({ containment: "#realTimeMonitorDraggableCanvasDiv"});
		}
	} catch(e) {
		console.log('exception thrown in realtime monitor' + e);
	}

	$("#realTimeMonitorStudentWorkDisplayDiv").scrollTop(1000000);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_classroommonitor.js');
};