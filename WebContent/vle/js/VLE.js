function VLE() {
	this.state = new VLE_STATE();
	this.project = null;
	this.navigationLogic = null;
	this.visibilityLogic = null;
	this.navigationPanel = null;
	this.contentPanel = null;
	this.audioManager = null;
	this.connectionManager = null;
	this.journal = null;
	this.postNodes = [];
	this.myUserInfo = null;
	this.myClassInfo = null;
	this.getDataUrl = null;
}

/**
 * Sets the Project to render
 */
VLE.prototype.setProject = function(project) {
	this.project = project;
	this.navigationPanel = new NavigationPanel(project.rootNode);
	this.contentPanel = new ContentPanel(project, project.rootNode);
}

/**
 * Set the vle state for this vle. For use mainly in ticker.
 * @param vleState a VLE_STATE object
 */
VLE.prototype.setVLEState = function(vleState) {
	this.state = vleState;
}

/**
 * stops and rewinds audio
 */
VLE.prototype.rewindStepAudio = function() {
	this.audioManager.rewindStepAudio();
}

/**
 * toggles play/pause audio
 */
VLE.prototype.playPauseStepAudio = function() {
	this.audioManager.playPauseStepAudio();	
}

/**
 * Renders the VLE.
 *    If nodeId is not specified (is null):
 *          If the student has visited the project before (there is state.visitedNodes), 
 *       find render the last node visited.
 *          Otherwise, show the first non-hidden node.
 *    Otherwise, render node with specified nodeId.   
 * @param {Object} nodeId
 */
VLE.prototype.renderNode = function(nodeId){
    var nodeToVisit = null;
    if (nodeId == null) {
		if (this.state.visitedNodes.length > 0) {
			nodeToVisit = this.state.visitedNodes[this.state.visitedNodes.length - 1];
		} else {
			nodeToVisit = this.visibilityLogic.getNextVisibleNode(this.state, this.project.rootNode);
		}
    } else {
        nodeToVisit = this.getNodeById(nodeId);
    }
	
	if (nodeToVisit == null) {
		alert("VLE: nodeToVisit is null Exception. Exiting");
		return;
	}
    if (this.navigationLogic == null || this.navigationLogic.canVisitNode(this.state, nodeToVisit)) {
        var currentNode = nodeToVisit;
        vle.state.setCurrentNodeVisit(currentNode);
        this.navigationPanel.render('render');
        this.contentPanel.render(currentNode.id);
		currentNode.setCurrentNode();   // tells currentNode that it is the current node, so it can perform tasks like loading node audio
		if(this.connectionManager != null) {
			//set postNodes to contain all the leaf nodes
			this.postNodes = this.getLeafNodeIds();
			for(var q=0;q<this.postNodes.length;q++){
				if(currentNode.id==this.postNodes[q]){
					if(vle.myUserInfo != null) {
						this.connectionManager.post(vle.myUserInfo.workgroupId, vle.myUserInfo.userName);
					} else {
						this.connectionManager.post();
					}
				};
			};
		}
        //alert('a:' + currentNode.nodeSessionEndedEvent);
        //alert('b:' + this.onNodeSessionEndedEvent);
        currentNode.nodeSessionEndedEvent.subscribe(this.onNodeSessionEndedEvent, this); // add the listener for this node

		this.expandActivity(nodeId);   // always expand the navigation bar
    }
    var loadingMessageDiv = document.getElementById("loadingMessageDiv");
    if(loadingMessageDiv != null && loadingMessageDiv != undefined) {
    	loadingMessageDiv.innerHTML = "";
    }
    // fire currenct changed event
}

/**
 * When a node session has ended, re-render the navigation panel, as some nodes might have
 * become visible/invisible.
 */
VLE.prototype.onNodeSessionEndedEvent = function(type, args, me) {
   me.navigationPanel.render(type);
}

VLE.prototype.expandActivity = function(nodeId) {
	if(nodeId.charAt(0)!='J'){
		var idStr = new String(nodeId);
		var newActivityId = idStr.substring(0, idStr.lastIndexOf(":"));
		if(newActivityId){			
			submenu = document.getElementById(newActivityId + "_menu");
			submenu.className = "";
			//myMenu.expandMenu(submenu);
		};
	};
}
VLE.prototype.renderPrevNode = function() {
	var currentNode = this.getCurrentNode();
	if (this.navigationLogic == null) {
		alert("prev is not defined.");
	}
	var prevNode = this.navigationLogic.getPrevNode(currentNode);
	while (prevNode.type == "Activity") {
		prevNode = this.navigationLogic.getPrevNode(prevNode);
	}
	
	if (prevNode == null) {
		alert("prevNode does not exist");
	} else {
		this.renderNode(prevNode.id);
	}
}

VLE.prototype.renderNextNode = function() {
	var currentNode = this.getCurrentNode();
	if (this.navigationLogic == null) {
		alert("next is not defined.");
	}
	var nextNode = this.navigationLogic.getNextNode(currentNode);
	while (nextNode.type == "Activity") {
		nextNode = this.navigationLogic.getNextNode(nextNode);
	}
	if (nextNode == null) {
		alert("nextNode does not exist");
	} else {
		this.renderNode(nextNode.id);
	}
}

VLE.prototype.getCurrentNode = function() {
	var nodeVisit = this.state.getCurrentNodeVisit();
	if (nodeVisit != null) {
		return nodeVisit.node;
	}
	return null;
}

VLE.prototype.toggleNavigationPanelVisibility = function() {
	this.navigationPanel.toggleVisibility();	
}

VLE.prototype.print = function() {
	window.print();
}


VLE.prototype.getNodeVisitedInfo = function() {
	var infoInHtml = "";
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var currNode = vle.state.visitedNodes[i];
		infoInHtml += "nodeId: " + currNode.node.id + "<br/>startTime: " + currNode.visitStartTime + "<br/>endTime: " + currNode.visitEndTime + "<br/><br/>";
	}
	document.getElementById("experimentaloutput").innerHTML = infoInHtml;
}

VLE.prototype.showAllWork = function(doGrading){
    var allWorkHtml = "";
	allWorkHtml = "<div style=\"width: 950px; text-align:left; height: 550px; overflow: auto\">" + this.project.getShowAllWorkHtml(this.project.rootNode, doGrading) + "</div>";
    YAHOO.namespace("example.container");
    var content = document.getElementById("showAllWorkDiv");
    
    content.innerHTML = "";
    
    if (!YAHOO.example.container.showallwork) {
    
        // Initialize the temporary Panel to display while showallworking for external content to load
        
        YAHOO.example.container.showallwork = new YAHOO.widget.Panel("showallwork", {
            width: "1000px",
			height: "600px",
			fixedcenter: true,
            close: true,
            draggable: false,
            zindex: 4,
            modal: true,
            visible: false
        });
        
        YAHOO.example.container.showallwork.setHeader("Your Work");
        YAHOO.example.container.showallwork.setBody(allWorkHtml);
        YAHOO.example.container.showallwork.render(document.body);
        
    }
    else {
        YAHOO.example.container.showallwork.setBody(allWorkHtml);
    }
    
    // Show the Panel
    YAHOO.example.container.showallwork.show();
}

/**
 * This returns html that displays the student's progress e.g.
 * 
 * <table><tr><td>aa11</td><td>7%</td><td>Q15 (0:0:15)</td><td>Q6 (0:0:6), Q7 (0:0:7), Q8 (0:0:8), Q9 (0:0:9), Q11 (0:0:11), Q12 (0:0:12), Q13 (0:0:13), Q14 (0:0:14)</td></tr></table>
 * 
 * @param vle the vle object that has it's vle_state populated with 
 * 		student data
 * @return an html string that displays the student user name,
 * 		percentage completion of project, current step they're on,
 * 		and steps they skipped
 */
VLE.prototype.getProgress = function() {
	var progressHtml = "";
	
	/*
	 * all the nodes/steps in the project
	 * (node and step are the same in this context)
	 */
	var nodeIds = this.getLeafNodeIds();
	
	//a counter to keep track of the number of nodes visited by the student
	var nodesVisited = 0;
	
	//the last step the student visited
	var lastNodeIdVisitedByStudent = "";
	
	//keeps track of nodes that might have been skipped
	var nodesPossiblySkipped = "";
	
	//keeps track of the nodes that were skipped
	var nodesSkipped = "";
	
	//loop through all the nodes in the project
	for(var x=0; x<nodeIds.length; x++) {
		//obtain a specific node from the vle
		var nodeId = nodeIds[x];
		var nodeTitle = this.getNodeById(nodeId).title;
		var nodeTitleAndId = nodeTitle + " (" + nodeId + ")";
		
		/*
		 * get all the node visits by this student that the vle represents
		 * for this node
		 */
		nodeVisitsForNodeId = this.state.getNodeVisitsByNodeId(nodeId);
		
		if(nodeVisitsForNodeId.length != 0) {
			//the student has visited this step
			
			/*
			 * increment the count of nodes visited so we can calculate
			 * the percentage of project completed
			 */
			nodesVisited++;
			
			/*
			 * remember this current node because it may be the last node
			 * the student visited
			 */
			lastNodeIdVisitedByStudent = nodeTitleAndId;
			
			
			if(nodesPossiblySkipped != "") {
				//if there were any previous nodes possibly skipped, add a comma
				if(nodesSkipped != "") {
					nodesSkipped += ", ";
				}
				
				/*
				 * add the nodes possibly skipped to the nodes skipped
				 * because now we know they really did skip these nodes
				 * because the current node, which comes after the 
				 * possibly skipped nodes has been visited
				 */
				nodesSkipped += nodesPossiblySkipped;
				
				//clear out the nodes possibly skipped
				nodesPossiblySkipped = "";
			}
		} else {
			/*
			 * the student has not visited this step so we will remember
			 * this step. if we find that the student has visited a step
			 * after this step, that means this step was skipped, otherwise
			 * it just means the student has only gotten this far in the
			 * project and did not actually skip any steps
			 */
			
			//add a comma if there were previous nodes possibly skipped
			if(nodesPossiblySkipped != "") {
				nodesPossiblySkipped += ", ";
			}
			
			//add the current node to the nodes possibly skipped
			nodesPossiblySkipped += nodeTitleAndId;
		}
	}
	
	//output the data in html form
	progressHtml += "<table width='100%'>";
	progressHtml += "<tr>";
	
	//username
	progressHtml += "<td width='15%'>" + this.getUserName() + "</td>";
	
	//percentage of project completed
	progressHtml += "<td width='15%'>" + Math.floor(nodesVisited * 100 / nodeIds.length) + "%" + "</td>";
	
	//furthest node the student visited
	progressHtml += "<td width='15%'>" + lastNodeIdVisitedByStudent + "</td>";
	
	//the nodes the student skipped
	progressHtml += "<td width='40%'>" + nodesSkipped + "</td>";
	
	/*
	 * the save button that allows the user to save the student's
	 * data as a csv file
	 */ 
	progressHtml += "<td width='15'><input type='button' value='Save as CSV File' onclick='save()' /></td>";
	
	progressHtml += "</tr>";
	progressHtml += "</table>";
	
	//alert(progressHtml);
	
	return progressHtml;
}

VLE.prototype.showGradingTool = function() {
}

VLE.prototype.setJournal = function(journal){
	this.journal = journal;
};

VLE.prototype.getJournal = function(){
	return this.journal;
};

VLE.prototype.getNodeById = function(nodeId){
	if(nodeId.charAt(0)=='J'){
		return this.journal.rootNode.getNodeById(nodeId);
	} else {
		return this.project.rootNode.getNodeById(nodeId);
	}
};

VLE.prototype.getLeafNodeIds = function() {
	var nodeIds = [];
	this.project.rootNode.getLeafNodeIds(nodeIds);
	return nodeIds;
}

/**
 * Takes in an xml object and sets the myUserInfo and myClassInfo
 * @param userAndClassInfoXMLObject an xml object containing user and
 * 		class info
 */
VLE.prototype.loadUserAndClassInfo = function(userAndClassInfoXMLObject) {
	//retrieve the xml node object for myUserInfo
	var myUserInfoXML = userAndClassInfoXMLObject.getElementsByTagName("myUserInfo")[0];
	
	if(myUserInfoXML != null ) {
		//create and set my user info in this vle instance
		//alert(myUserInfoXML.getElementsByTagName("workgroupId")[0].firstChild.nodeValue);
		//alert(myUserInfoXML.getElementsByTagName("userName")[0].firstChild.nodeValue);
		this.myUserInfo = USER_INFO.prototype.parseUserInfo(myUserInfoXML);
		//alert(this.myUserInfo.userName);
	}
	
	//retrieve the xml node object for myClassInfo
	var myClassInfoXML = userAndClassInfoXMLObject.getElementsByTagName("myClassInfo")[0];
	
	if(myClassInfoXML != null) {
		var myClassInfo = new CLASS_INFO();

		//create and set the teacher
		var teacherInfoXML = myClassInfoXML.getElementsByTagName("teacherUserInfo")[0];
		myClassInfo.teacher = USER_INFO.prototype.parseUserInfo(teacherInfoXML);
		
		//create and set all the classmates
		var classmateUserInfoXMLList = myClassInfoXML.getElementsByTagName("classmateUserInfo");
		for(var x=0; x<classmateUserInfoXMLList.length; x++) {
			var classmateUserInfoXML = classmateUserInfoXMLList[x];
			var classmateUserInfo = USER_INFO.prototype.parseUserInfo(classmateUserInfoXML);
			myClassInfo.addClassmate(classmateUserInfo);
		}
		
		//set the class info in this vle instance
		this.myClassInfo = myClassInfo;
	}
	
	//load the student data...This should be called outside of this function
	//this.loadVLEState(this.myUserInfo.workgroupId, this);
}

 
VLE.prototype.getWorkgroupId = function() {
	if(this.myUserInfo != null) {
		return this.myUserInfo.workgroupId;
	} else {
		return "";
	}
}

VLE.prototype.setUserName = function(userName) {
	if(this.myUserInfo != null) {
		this.myUserInfo.userName;
	}
}

VLE.prototype.setWorkgroupId = function(workgroupId) {
	if(this.myUserInfo != null) {
		this.myUserInfo.workgroupId = workgroupId;
	}
}

VLE.prototype.getUserName = function() {
	if(this.myUserInfo != null) {
		return this.myUserInfo.userName;
	} else {
		return "";
	}
}

/*
 * Returns all of the students in the student's class including the student.
 */
VLE.prototype.getClassUsers = function() {
	var allStudentsArray = new Array();
	for (var i=0; i<this.myClassInfo.classmates.length; i++) {
		allStudentsArray.push(this.myClassInfo.classmates[i]);
	}
	allStudentsArray.push(this.myUserInfo);
	return allStudentsArray;
}

/**
 * Loads the student's latest work from the last time they worked on it
 * @param dataId the workgroupId
 */
VLE.prototype.loadVLEState = function(vle) {
	var getURL = this.getDataUrl;

	//var getURL = "../getdata.html?dataId=" + dataId;
	//alert("vle.js, getURL:" + getURL);
		
	var callback = {
		success: function(o) {
			var xmlObj = o.responseXML;
			//alert('vle.js, loadvlestate, responsetext: ' + o.responseText);
			var vleStateXMLObj = xmlObj.getElementsByTagName("vle_state")[0];
			if (vleStateXMLObj) {
				var vleStateObj = VLE_STATE.prototype.parseDataXML(vleStateXMLObj);
				vle.setVLEState(vleStateObj);
			} else {
				alert('no previous vle state');
			}
		},
		failure: function(o) {
		}
	};
	YAHOO.util.Connect.asyncRequest('GET', getURL, callback);
}

function USER_INFO(workgroupId, userName) {
	this.workgroupId = workgroupId;
	this.userName = userName;
}

/**
 * Takes an xml object and returns a real USER_INFO object.
 * @param userInfoXML an xml object containing workgroupId and userName
 * @return a new USER_INFO object with populated workgropuId and userName
 */
USER_INFO.prototype.parseUserInfo = function(userInfoXML) {
	var userInfo = new USER_INFO();
	userInfo.workgroupId = userInfoXML.getElementsByTagName("workgroupId")[0].firstChild.nodeValue;
	userInfo.userName = userInfoXML.getElementsByTagName("userName")[0].firstChild.nodeValue;
	return userInfo;
}

function CLASS_INFO() {
	this.teacher = null;
	
	//an array of USER_INFO objects
	this.classmates = new Array();
}

/**
 * 
 * @param classmate a USER_INFO object
 * @return
 */
CLASS_INFO.prototype.addClassmate = function(classmate) {
	this.classmates.push(classmate);
}

function VLE_STATE() {
	this.visitedNodes = [];  // array of NODE_VISIT objects
	this.userName = null; //lets put this here for now, sssssh
	this.dataId = null;
}

VLE_STATE.prototype.setUserName = function(userName) {
	this.userName = userName;
}

VLE_STATE.prototype.setDataId = function(dataId) {
	this.dataId = dataId;
}

VLE_STATE.prototype.getCurrentNodeVisit = function() {
	if (this.visitedNodes.length == 0) {
		return null;
	} else {
		return this.visitedNodes[this.visitedNodes.length - 1];
	}
}

/**
 * Returns an array of NODE_VISITS for the specified nodeId
 * @param {Object} nodeId
 */
VLE_STATE.prototype.getNodeVisitsByNodeId = function(nodeId) {
	var nodeVisitsForThisNodeId = [];
	for (var i=0; i<this.visitedNodes.length;i++) {
		if (this.visitedNodes[i].node.id==nodeId) {
			nodeVisitsForThisNodeId.push(this.visitedNodes[i]);
		}		
	}
	//alert("nodeId: " + nodeId + "<br>nodeVisitsForThisNodeId: " + nodeVisitsForThisNodeId.length);
	return nodeVisitsForThisNodeId;
}

/**
 * @return xml representation of the state of the vle which
 * 		includes student data as well as navigation info
 */
VLE_STATE.prototype.getDataXML = function() {
	var dataXML = "";
	dataXML += "<vle_state>";
	
	//loop through all the visited nodes and retrieve the xml for each node
	for (var i=0; i<this.visitedNodes.length;i++) {
		dataXML += this.visitedNodes[i].getDataXML();
	}
	
	dataXML += "</vle_state>";
	return dataXML;
}

/**
 * Takes in an vle state XML object and creates a real VLE_STATE object.
 * @param vleStateXML an XML object
 */
VLE_STATE.prototype.parseDataXML = function(vleStateXML) {
	var vleStateObject = new VLE_STATE();
	
	var nodeVisitNodesXML = vleStateXML.getElementsByTagName("node_visit");
	
	//loop through all the node_visit nodes
    for (var i=0; i< nodeVisitNodesXML.length; i++) {
    	var nodeVisit = nodeVisitNodesXML[i];
    	
    	//ask the NODE_VISIT static function to create a real NODE_VISIT object
    	var nodeVisitObject = NODE_VISIT.prototype.parseDataXML(nodeVisit);
    	
    	//add the real NODE_VISIT object into this VLE_STATE
    	vleStateObject.visitedNodes.push(nodeVisitObject);
    }
	
    //alert("vleStateObject.getDataXML(): " + vleStateObject.getDataXML());
    return vleStateObject;
}

/**
 * Receives an xml string and creates an xml object out of it. Then
 * using the xml object, it creates an array of real VLE_STATE object.
 * @param xmlString xml string that contains multiple workgroup/vle_state
 * 		nodes. e.g.
 * 
 * <vle_states>
 * 		<workgroup dataId='1'><vle_state>...</vle_state></workgroup>
 * 		<workgroup dataId='2'><vle_state>...</vle_state></workgroup>
 * 		<workgroup dataId='3'><vle_state>...</vle_state></workgroup>
 * </vle_states>
 * 
 * @return an array of VLE_STATE objects. dataId will be used for 
 * 		the index/key
 */
VLE_STATE.prototype.parseVLEStatesDataXMLString = function(xmlString) {
	var xmlDoc = null;
	
	//create an xml object out of the xml string
	try {
		//Internet Explorer
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.loadXML(xmlString);
	} catch(e) {
		try {
		//Firefox, Mozilla, Opera, etc.
			var parser=new DOMParser();
			xmlDoc=parser.parseFromString(xmlString,"text/xml");
		} catch(e) {
			alert(e.message);
		}
	}
	
	var vleStatesArray = new Array();
	
	//retrieve all the workgroups
	var workgroupsXML = xmlDoc.getElementsByTagName("workgroup");
	
	/*
	 * loop through the workgroups and populate the array. The dataId
	 * will serve as the index/key.
	 */
	for(var x=0; x<workgroupsXML.length; x++) {
		var dataId = workgroupsXML[x].attributes.getNamedItem("dataId").firstChild.nodeValue;
		var vleState = workgroupsXML[x].getElementsByTagName("vle_state")[0];
		
		//create a real VLE_STATE object from the xml object and put it in the array
		vleStatesArray[dataId] = VLE_STATE.prototype.parseDataXML(vleState);
	}
	
	return vleStatesArray;
}

VLE_STATE.prototype.parseVLEStatesDataXMLObject = function(xmlObject) {
	var vleStatesArray = new Array();
	//retrieve all the workgroups
	var workgroupsXML = xmlObject.getElementsByTagName("workgroup");
	/*
	 * loop through the workgroups and populate the array. The dataId
	 * will serve as the index/key.
	 */
	for(var x=0; x<workgroupsXML.length; x++) {
		var dataId = workgroupsXML[x].attributes.getNamedItem("dataId").nodeValue;
		var userName = workgroupsXML[x].attributes.getNamedItem("userName").nodeValue;
		var vleStateXMLObj = workgroupsXML[x].getElementsByTagName("vle_state")[0];
		
		//create a real VLE_STATE object from the xml object and put it in the array
		var vleStateObj = VLE_STATE.prototype.parseDataXML(vleStateXMLObj);
		vleStateObj.userName = userName;
		vleStateObj.dataId = dataId;
		vleStatesArray.push(vleStateObj);
	}
	return vleStatesArray;
}

function NODE_VISIT(node, nodeStates, visitStartTime, visitEndTime) {
	this.node = node;
	if (arguments.length == 1) {
		//set default values if they aren't provided
		this.nodeStates = [];
		this.visitStartTime = new Date();
		this.visitEndTime = null;
	} else {
		this.nodeStates = nodeStates;
		this.visitStartTime = visitStartTime;
		this.visitEndTime = visitEndTime;
	}
}

/**
 * @return xml representation of the node_visit object which
 * 		includes node type, visitStart, visitEnd time, etc.
 * 		e.g.
 * 
 * <node_visit>
 * 		<node>
 * 			<type></type>
 * 			<id></id>
 * 		</node>
 * 		<nodeStates></nodeStates>
 * 		<visitStartTime></visitStartTime>
 * 		<visitEndTime></visitEndTime>
 * </node_visit>
 */
NODE_VISIT.prototype.getDataXML = function() {
	var dataXML = "";
	
	dataXML += "<node_visit>";
	
	dataXML += "<node><type>";
	dataXML += this.node.type;
	dataXML += "</type><id>";
	dataXML += this.node.id;
	dataXML += "</id></node>";
	
	dataXML += "<nodeStates>";
	dataXML += this.node.getDataXML(this.nodeStates);
	dataXML += "</nodeStates>";
	
	dataXML += "<visitStartTime>";
	dataXML += this.visitStartTime;	
	dataXML += "</visitStartTime>";
	
	dataXML += "<visitEndTime>";
	dataXML += this.visitEndTime;	
	dataXML += "</visitEndTime>";
	
	dataXML += "</node_visit>";
	
	return dataXML;
}

/**
 * Turns a node visit xml object into a real NODE_VISIT object
 * @param nodeVisitXML and xml object
 * @return a real NODE_VISIT object
 */
NODE_VISIT.prototype.parseDataXML = function(nodeVisitXML) {
	//ask the NODE static function to create the node
	//var nodeObject = Node.prototype.parseDataXML(nodeVisitXML);
	var nodeObject = vle.getNodeById(nodeVisitXML.getElementsByTagName("id")[0].textContent);
	//alert('vle.js, nodeObject:' + nodeObject);
	//get the start and end times
	var visitStartTime = nodeVisitXML.getElementsByTagName("visitStartTime")[0].textContent;
	var visitEndTime = nodeVisitXML.getElementsByTagName("visitEndTime")[0].textContent;

	//retrieve an array of node state objects
	var nodeStatesArrayObject = nodeObject.parseDataXML(nodeVisitXML.getElementsByTagName("nodeStates")[0]);

	//create a node_visit object with the new node object
	var nodeVisitObject = new NODE_VISIT(nodeObject, nodeStatesArrayObject, visitStartTime, visitEndTime);
	
	return nodeVisitObject;
}

/*
 * Get the last node state that was placed in the nodeStates array
 */
NODE_VISIT.prototype.getLatestState = function() {
	//retrieve the last nodeState in the array of nodeStates
	return this.nodeStates[this.nodeStates.length - 1];
}

/**
 * Sets a new NODE_VISIT, containing info on where the student 
 * is current on.
 */
VLE_STATE.prototype.setCurrentNodeVisit = function(node) {
	var currentNodeVisit = this.getCurrentNodeVisit();   // currentNode becomes lastnode

	// don't set new currentnode if it's the same node as previous node
	if (currentNodeVisit != null &&
	        currentNodeVisit.node == node) {
		return;
	}
	
	// set endtime on previous 
	if (currentNodeVisit != null) {
		currentNodeVisit.visitEndTime = new Date();
	}
	var newNodeVisit = new NODE_VISIT(node);
	this.visitedNodes.push(newNodeVisit);
}

contentPanelOnLoad = function(){
	//alert('here' + vle);
	if (vle && vle != null) {
	var currentNode = vle.getCurrentNode();
	currentNode.load();
	}
	//alert('loadd:' + currentNode.id);
	//alert("dataXML: " + vle.getDataXML());
}

VLE.prototype.setConnection = function(connectionManager) {
	this.connectionManager = connectionManager;
	this.connectionManager.setVLE(this);
}

/**
 * @return returns the state of the vle in xml
 */
VLE.prototype.getDataXML = function() {
	//retrieve the xml for the current state of the vle
	var dataXML = this.state.getDataXML();
	return dataXML;
}

VLE.prototype.saveStudentData = function(){
	this.connectionManager.post(vle.myUserInfo.workgroupId, vle.myUserInfo.userName, true);
};

VLE.prototype.getLastStateTimestamp = function(){
	var nodeVisits = this.state.visitedNodes;
	var lastDate = new Date().setTime(0);
	for(var y=0;y<nodeVisits.length;y++){
		if(nodeVisits[y].visitEndTime){
			var currentDate = nodeVisits[y].visitEndTime;
			if(currentDate>lastDate){
				lastDate = currentDate;
			};
		};
	};
	return lastDate;
};

VLE.prototype.saveLocally = function(){
	if(confirm("Saving locally requires a file download. If you do not wish to do this, cancel now! Otherwise, click OK.")){
		document.getElementById('localData').value = this.getDataXML();
		document.getElementById('saveLocal').submit();
	};
}

/**
 * Create a string containing the student's data in CSV form. The first
 * row contains the node titles and the second row contains the students
 * answers. The answers are the latest answers the student has submitted.
 * @return a string containing the student's answers in CSV form
 */
VLE.prototype.getCSV = function() {
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
					studentDataCSV += "\"" + node.translateIdentifiersToValues(latestState.getStudentWork()) + "\"";	
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