/* 
 * TODO: COMMENT ME
 * 
 */
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

VLE_STATE.prototype.endCurrentNodeVisit = function() {
	var currentNodeVisit = this.getCurrentNodeVisit();
	if(currentNodeVisit){
		currentNodeVisit.visitEndTime = new Date().toUTCString();
	};
};

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
 * Get the latest node visit object for the nodeId
 * @param nodeId the nodeId we want the latest node visit for
 * @return the latest node visit for the nodeId
 */
VLE_STATE.prototype.getLatestNodeVisitByNodeId = function(nodeId) {
	var latestNodeVisitForThisNodeId = null;
	
	//loop through all the node visits
	for (var i=0; i<this.visitedNodes.length;i++) {
		
		//check if the current node visit has the nodeId we are looking for
		if (this.visitedNodes[i].node.id==nodeId) {
			/*
			 * remember this node visit as the latest for now, if we find
			 * a node visit in the future with the right nodeId, this will be 
			 * overriden
			 */
			latestNodeVisitForThisNodeId = this.visitedNodes[i];
		}		
	}
	return latestNodeVisitForThisNodeId;
}

/**
 * Get the latest non blank work for the given nodeId step
 * @param nodeId the step to retrieve work for
 * @return the latest non blank work or "" if none exists
 */
VLE_STATE.prototype.getLatestWorkByNodeId = function(nodeId) {
	//loop through the node visits from latest to earliest
	for(var x=this.visitedNodes.length - 1; x >= 0; x--) {
		//get a node visit
		var nodeVisit = this.visitedNodes[x];
		
		//check if the nodeId matches
		if(nodeVisit.node.id == nodeId) {
			//obtain the latest non blank work for the node visit
			var latestWorkForNodeVisit = nodeVisit.getLatestWork();
			
			//check if there was any non blank work
			if(latestWorkForNodeVisit != "") {
				//return the non blank work
				return latestWorkForNodeVisit;
			}
		}
	}
	
	return "";
}

/**
 * @return xml representation of the state of the vle which
 * 		includes student data as well as navigation info
 */
VLE_STATE.prototype.getDataXML = function() {
	var dataXML = "";
	dataXML += "<vle_state>";
	
	dataXML += this.getVisitedNodesDataXML();
	
	dataXML += "</vle_state>";
	return dataXML;
}

VLE_STATE.prototype.getVisitedNodesDataXML = function() {
	var dataXML = "";
	
	//loop through all the visited nodes and retrieve the xml for each node
	for (var i=0; i<this.visitedNodes.length;i++) {
		dataXML += this.visitedNodes[i].getDataXML();
	}
	
	return dataXML;
}

/**
 * Gets all the node visits that have non null visitEndTime fields.
 * This should be all the nodes except the most recent node the
 * student is on because they have not exited the step yet.
 */
VLE_STATE.prototype.getCompletelyVisitedNodesDataXML = function() {
	var dataXML = "";
	
	//loop through all the visited nodes and retrieve the xml for each node
	for (var i=0; i<this.visitedNodes.length;i++) {
		if(this.visitedNodes[i].visitEndTime != null) {
			dataXML += this.visitedNodes[i].getDataXML();
		}
	}
	
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
    	var nodeForNodeVisit = vle.getNodeById(nodeVisit.getElementsByTagName("id")[0].textContent);
    	
    	// first check that the node exists in the project
    	if (nodeForNodeVisit && nodeForNodeVisit != null) {
    		var nodeVisitObject = NODE_VISIT.prototype.parseDataXML(nodeVisit);
    	
    		//add the real NODE_VISIT object into this VLE_STATE
    		vleStateObject.visitedNodes.push(nodeVisitObject);
    	}
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
			notificationManager.notify(e.message, 3);
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
		var dataId = workgroupsXML[x].attributes.getNamedItem("userId").nodeValue;
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
		currentNodeVisit.visitEndTime = new Date().toUTCString();
	}
	var newNodeVisit = new NODE_VISIT(node);
	
	/*
	 * check if the node is a BlueJNode so we can create and insert 
	 * a completely visited node visit into the visited nodes array. 
	 * this causes the node visit to be sent back to the database even 
	 * though the user hasn't exited the BlueJNode yet.
	 */ 
	if(node.type == "BlueJNode") {
		//create a node visit
		var blueJVisit = new NODE_VISIT(node);
		
		//set the end time so that this visit will be sent back to the db
		blueJVisit.visitEndTime = new Date().toUTCString();
		
		//set the project path for the bluej node visit
		blueJVisit.nodeStates = node.projectPath;
		
		//add it to the array of node visits
		this.visitedNodes.push(blueJVisit);
	}
	
	this.visitedNodes.push(newNodeVisit);
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/data/vlestate.js");