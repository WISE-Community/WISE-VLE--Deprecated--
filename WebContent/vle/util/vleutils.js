/**
 * Exports the student's data to a string
 * @param format the format of the data
 * @return a string containing the content that will be in the file
 */
VLE.prototype.exportToFile = function(format) {
	
	if(format == "timelineCSV") {
		return this.exportToTimeline(format);
	}
	
	var rows = new Array();
	
	/*
	 * all the nodes/steps in the project
	 * (node and step are the same in this context)
	 */
	var nodeIds = this.getLeafNodeIds();
	
	//loop through all the nodes in the project
	for(var x=0; x<nodeIds.length; x++) {
		var nodeRow = "";
		
		//obtain a specific node from the vle
		var nodeId = nodeIds[x];
		var nodeTitle = this.getNodeById(nodeId).title;
		var node = this.getNodeById(nodeId);
		
		//add the node title and prompt to the first row
		if(format == "detailedCSV") {
			nodeRow += "\"" + nodeTitle + ":" + node.getPrompt() + "\",";
			nodeRow += "\"" + node.type + "\",";
		} else if(format == "HTML") {
			nodeRow += "<tr><td>" + nodeTitle + ":" + node.getPrompt() + "</td>";
			nodeRow += "<td>" + node.type + "</td>";
		}
		
		/*
		 * get all the node visits by this student that the vle represents
		 * for this node
		 */
		nodeVisitsForNodeId = this.state.getNodeVisitsByNodeId(nodeId);
		
		//loop through all the node visits for this node
		for(var y=0; y<nodeVisitsForNodeId.length; y++) {
			//the student has visited the node
			var nodeVisit = nodeVisitsForNodeId[y];
			
			var nodeStates = nodeVisit.nodeStates;
			
			//loop through all the states in the node visit
			for(var z=0; z<nodeStates.length; z++) {
				var nodeState = nodeStates[z];
				
				/*
				 * we need to translate identifiers to values for some
				 * nodes. latestState.getStudentWork() will return
				 * a string or an array depending on which node type.
				 * node.translateIdentifiersToValues() must then know
				 * what is being passed in. for future nodes make sure
				 * latestState.getStudentWork() and node.translateStudentWork()
				 * coordinate with each other. some node do not not require
				 * any translation so they will just return what was passed in.
				 */
				if(format == "detailedCSV") {
					nodeRow += "\"" + node.translateStudentWork(nodeState.getStudentWork()) + "\",";
				} else if(format == "HTML") {
					nodeRow += "<td>" + node.translateStudentWork(nodeState.getStudentWork()) + "</td>";
				}
			}
		}
		
		if(format == "detailedCSV") {
			rows.push(nodeRow);
		} else if(format == "HTML") {
			rows.push(nodeRow + "</tr>");
		}
		
	}
	
	var csvText = "";
	
	//start the table if we are outputting html
	if(format == "HTML") {
		csvText += "<table border='1'>";
	}
	
	/*
	 * append all the rows together as one string 
	 */
	for(var rowNum=0; rowNum<rows.length; rowNum++) {
		if(format == "detailedCSV") {
			//csv needs new line
			csvText += rows[rowNum] + "\n";
		} else if(format == "HTML") {
			csvText += rows[rowNum];
		}
	}
	
	//close the table if we are outputting html
	if(format == "HTML") {
		csvText += "</table>";
	}
	
	return csvText;
}

VLE.prototype.exportToTimeline = function(format) {
	var rows = new Array();
	
	rows.push("timestamp, elapsedTime (since stepStart in seconds), timeType, nodeType, stepId, studentWork");
	
	for(var x=0; x<this.state.visitedNodes.length; x++) {
		var nodeVisit = this.state.visitedNodes[x];
		var node = nodeVisit.node;
		
		var nodeVisitStartRow = "";
		nodeVisitStartRow += nodeVisit.visitStartTime.replace(",", "") + ", ";
		nodeVisitStartRow += 0 + ", ";
		nodeVisitStartRow += "stepStart, ";
		nodeVisitStartRow += nodeVisit.node.type + ", ";
		nodeVisitStartRow += nodeVisit.node.id + ", ";
		nodeVisitStartRow += "N/A";
		rows.push(nodeVisitStartRow);
		
		for(var y=0; y<nodeVisit.nodeStates.length; y++) {
			var nodeState = nodeVisit.nodeStates[y];
			var nodeStateRow = "";
			nodeStateRow += nodeState.timestamp.replace(",", "") + ", ";
			nodeStateRow += ((new Date(nodeState.timestamp).getTime() - new Date(nodeVisit.visitStartTime).getTime()) / 1000) + ", ";
			nodeStateRow += "studentSubmission, ";
			nodeStateRow += nodeVisit.node.type + ", ";
			nodeStateRow += nodeVisit.node.id + ", ";
			nodeStateRow += node.translateStudentWork(nodeState.getStudentWork());
			rows.push(nodeStateRow);
		}
		
		var nodeVisitEndRow = "";
		if(nodeVisit.visitEndTime != null) {
			nodeVisitEndRow += nodeVisit.visitEndTime.replace(",", "") + ", ";
		} else {
			nodeVisitEndRow += "null, ";
		}
		nodeVisitEndRow += ((new Date(nodeVisit.visitEndTime).getTime() - new Date(nodeVisit.visitStartTime).getTime()) / 1000) + ", ";
		nodeVisitEndRow += "stepEnd, ";
		nodeVisitEndRow += nodeVisit.node.type + ", ";
		nodeVisitEndRow += nodeVisit.node.id + ", ";
		nodeVisitEndRow += "N/A";
		rows.push(nodeVisitEndRow);
	}
	
	var csvText = "";
	
	//start the table if we are outputting html
	if(format == "HTML") {
		csvText += "<table border='1'>";
	}
	
	/*
	 * append all the rows together as one string 
	 */
	for(var rowNum=0; rowNum<rows.length; rowNum++) {
		if(format == "timelineCSV") {
			//csv needs new line
			csvText += rows[rowNum] + "\n";
		} else if(format == "HTML") {
			csvText += rows[rowNum];
		}
	}
	
	//close the table if we are outputting html
	if(format == "HTML") {
		csvText += "</table>";
	}
	
	return csvText;
}

/**
 * This should be cleaned up/refactored and commented by Geoff in the future.
 */
VLE.prototype.exportToTimeline = function(format) {
	var rows = new Array();
	
	rows.push("timestamp, elapsedTime (since stepStart in seconds), timeType, nodeType, stepId, studentWork");
	
	for(var x=0; x<this.state.visitedNodes.length; x++) {
		var nodeVisit = this.state.visitedNodes[x];
		var node = nodeVisit.node;
		
		var nodeVisitStartRow = "";
		nodeVisitStartRow += nodeVisit.visitStartTime.replace(",", "") + ", ";
		nodeVisitStartRow += 0 + ", ";
		nodeVisitStartRow += "stepStart, ";
		nodeVisitStartRow += nodeVisit.node.type + ", ";
		nodeVisitStartRow += nodeVisit.node.id + ", ";
		nodeVisitStartRow += "N/A";
		rows.push(nodeVisitStartRow);
		
		for(var y=0; y<nodeVisit.nodeStates.length; y++) {
			var nodeState = nodeVisit.nodeStates[y];
			var nodeStateRow = "";
			nodeStateRow += nodeState.timestamp.replace(",", "") + ", ";
			nodeStateRow += ((new Date(nodeState.timestamp).getTime() - new Date(nodeVisit.visitStartTime).getTime()) / 1000) + ", ";
			nodeStateRow += "studentSubmission, ";
			nodeStateRow += nodeVisit.node.type + ", ";
			nodeStateRow += nodeVisit.node.id + ", ";
			nodeStateRow += node.translateStudentWork(nodeState.getStudentWork());
			rows.push(nodeStateRow);
		}
		
		var nodeVisitEndRow = "";
		if(nodeVisit.visitEndTime != null) {
			nodeVisitEndRow += nodeVisit.visitEndTime.replace(",", "") + ", ";
		} else {
			nodeVisitEndRow += "null, ";
		}
		nodeVisitEndRow += ((new Date(nodeVisit.visitEndTime).getTime() - new Date(nodeVisit.visitStartTime).getTime()) / 1000) + ", ";
		nodeVisitEndRow += "stepEnd, ";
		nodeVisitEndRow += nodeVisit.node.type + ", ";
		nodeVisitEndRow += nodeVisit.node.id + ", ";
		nodeVisitEndRow += "N/A";
		rows.push(nodeVisitEndRow);
	}
	
	var csvText = "";
	
	//start the table if we are outputting html
	if(format == "HTML") {
		csvText += "<table border='1'>";
	}
	
	/*
	 * append all the rows together as one string 
	 */
	for(var rowNum=0; rowNum<rows.length; rowNum++) {
		if(format == "timelineCSV") {
			//csv needs new line
			csvText += rows[rowNum] + "\n";
		} else if(format == "HTML") {
			csvText += rows[rowNum];
		}
	}
	
	//close the table if we are outputting html
	if(format == "HTML") {
		csvText += "</table>";
	}
	
	return csvText;
}

/**
 * Create a string containing the student's data in CSV form. The first
 * row contains the node titles and the second row contains the students
 * answers. The answers are the latest answers the student has submitted.
 * @return a string containing the student's answers in CSV form
 */
VLE.prototype.getSimpleCSV = function() {
	//the string for the first row of the CSV file
	var nodesCSV = "";
	
	//the string for the second row of the CSV file
	var studentDataCSV = "";
	
	/*
	 * all the nodes/steps in the project
	 * (node and step are the same in this context)
	 */
	var nodeIds = this.getLeafNodeIds();
	
	//loop through all the nodes in the project
	for(var x=0; x<nodeIds.length; x++) {
		//obtain a specific node from the vle
		var nodeId = nodeIds[x];
		var nodeTitle = this.getNodeById(nodeId).title;
		var node = this.getNodeById(nodeId);
		
		//add the node title and prompt to the first row
		nodesCSV += "\"" + nodeTitle + ":" + node.getPrompt() + "\"";
		
		/*
		 * get all the node visits by this student that the vle represents
		 * for this node
		 */
		nodeVisitsForNodeId = this.state.getNodeVisitsByNodeId(nodeId);
		
		if(nodeVisitsForNodeId.length != 0) {
			//the student has visited the node
			
			//obtain the latest state/latest answers from the student
			var latestNodeVisitForNode = nodeVisitsForNodeId[nodeVisitsForNodeId.length - 1];
			var latestState = latestNodeVisitForNode.getLatestState();
			
			if(latestState != null) {
				if(node instanceof MultipleChoiceNode || node instanceof MultipleChoiceCheckBoxNode) {
					/*
					 * we need to translate identifiers to values for these
					 * nodes. latestState.getStudentWork() will return
					 * a string or an array depending on which node type.
					 * node.translateIdentifiersToValues() must then know
					 * what is being passed in. for future nodes make sure
					 * latestState.getStudentWork() and 
					 * node.translateIdentifiersToValues()
					 * coordinate with each other
					 */
					studentDataCSV += "\"" + node.translateStudentWork(latestState.getStudentWork()) + "\"";	
				} else {
					studentDataCSV += "\"" + latestState.getStudentWork() + "\"";
				}
				
			}
		}
		
		//add commas to delimit nodes and answers
		if(x != nodeIds.length - 1) {
			nodesCSV += ",";
			studentDataCSV += ",";
		}
	}
	
	//combine the two rows separated by a new line
	return nodesCSV + "\n" + studentDataCSV;
}

/**
 * Saves students work locally using EchoServlet
 * @return
 */
VLE.prototype.saveLocally = function(){
	if(confirm("Saving locally requires a file download. If you do not wish to do this, cancel now! Otherwise, click OK.")){
		document.getElementById('localData').value = this.getDataXML();
		document.getElementById('saveLocal').submit();
	};
}

/**
 * brings up the progress of the currently-logged in user
 * @param doPopup true iff the progress should appear in a popup. 
 * Otherwise, display the progress in the page
 * @param reportsToShow array of report names to show. Possible values
 * are: {onlyLatestAsCSV,allAnswerRevisionsCSV,allAnswerRevisionsHtml, timeline}
 * @return
 */
VLE.prototype.displayProgress = function(doPopup, reportsToShow) {
	if (doPopup) {
	   YAHOO.namespace("example.container");

	   if (!YAHOO.example.container.displayprogress) {
		    
	        // Initialize the temporary Panel to display while showallworking for external content to load
	        
	        YAHOO.example.container.displayprogress = new YAHOO.widget.Panel("displayProgress", {
	            width: "800px",
				height: "300px",
				fixedcenter: true,
	            close: true,
	            draggable: false,
	            zindex: 4,
	            modal: true,
	            visible: false
	        });
	        
	        YAHOO.example.container.displayprogress.setHeader("Your Progress");
	        YAHOO.example.container.displayprogress.setBody(vle.getProgress(reportsToShow));
	        YAHOO.example.container.displayprogress.render(document.body);
	        
	    }
	    else {
	        YAHOO.example.container.displayprogress.setBody(vle.getProgress(reportsToShow));
	    }
	    
	    // Show the Panel
	    YAHOO.example.container.displayprogress.show();
	} else {
		document.getElementById('centeredDiv').style.display = "none";
		document.getElementById('progressDiv').innerHTML = vle.getProgress(reportsToShow);
	}
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/util/vleutils.js");