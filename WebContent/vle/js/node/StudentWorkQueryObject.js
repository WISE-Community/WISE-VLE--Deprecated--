/**
 * StudentWorkQueryObject
 * 
 * An object that takes in vle states and a project, and then creates
 * an object that allows us to query for student data easily. We can
 * ask for student data based on dataId (student id) or nodeId (node).
 */

/**
 * Constructor populates the data so we can query it quickly later
 * @param vleStatesArray an array filled with VLE_STATE objects
 * 		the keys of the array are dataId
 * @param project a project object
 */
function StudentWorkQueryObject(vleStatesArray, project) {
	this.vleStates = vleStatesArray;
	this.project = project;
	this.vleArray = new Array();
	
	/*
	 * loop through the states and create a VLE for each state
	 * the key will be the dataId
	 */
	for(var x in this.vleStates) {
		var vle = new VLE();
		vle.setProject(this.project);
		vle.setVLEState(this.vleStates[x]);
		this.vleArray[x] = vle;
	}
	
	//key = nodeId, value = array of query entries, basically a 2d array
	this.nodeIdArray = new Array();
	
	//key = dataId, value = array of query entries, basically a 2d array
	this.dataIdArray = new Array();
	
	//compile and populate the student data into our arrays
	this.compileQueryEntries();
}

/**
 * Adds a query entry to the nodeId container
 * @param nodeId the id of the node. e.g. '0:0:1'
 * @param queryEntry the query entry object that contains the student data
 * @param node the node the student work is for
 * @param vle the vle related to the node
 */
StudentWorkQueryObject.prototype.addNodeIdEntry = function(nodeId, queryEntry, node, vle) {
	//nodeIdContainer contains all the entries for a specific nodeId
	var nodeIdContainer = this.nodeIdArray[nodeId];

	/*
	 * create a new query container if it wasn't created before, this 
	 * may occur when this is the first time an entry is added
	 * with this specific nodeId. perhaps all of these can be
	 * created in the constructor when reading in the vle?
	 */
	if(nodeIdContainer == null) {
		nodeIdContainer = node.makeQueryContainer(vle);
	}

	nodeIdContainer.addQueryEntry(queryEntry);
	
	//is this line below needed or will it update the reference automatically?
	this.nodeIdArray[nodeId] = nodeIdContainer;
}

/**
 * Get all the nodeIds in our nodeIdArray that contains all our
 * query containers so we know which nodes we have data for.
 * @return an array filled with nodeId strings
 */
StudentWorkQueryObject.prototype.getNodeIds = function() {
	var nodeIds = new Array();
	
	//loop through the array that contains all the nodeId query containers
	for(var choiceId in this.nodeIdArray) {
		nodeIds.push(choiceId);
	}
	return nodeIds;
}

/**
 * Adds a query entry to the dataId container
 * @param dataId the id of the data/student. e.g. '5'
 * @param queryEntry the query entry object that contains the student data
 * @param node the node the student work is for
 * @param vle the vle related to the node
 */
StudentWorkQueryObject.prototype.addDataIdEntry = function(dataId, queryEntry, node, vle) {
	//dataIdContainer contains all the entries for a specific dataId
	var dataIdContainer = this.dataIdArray[dataId];
	
	/*
	 * create a new query container if it wasn't created before, this 
	 * may occur when this is the first time an entry is added
	 * with this specific dataId. perhaps all of these can be
	 * created in the constructor when reading in the vle?
	 */
	if(dataIdContainer == null) {
		dataIdContainer = new StudentQueryContainer(dataId);
	}

	dataIdContainer.addQueryEntry(queryEntry);
	
	//is this line below needed or will it update the reference automatically?
	this.dataIdArray[dataId] = dataIdContainer;
}



/**
 * Returns all the work for a specific student
 * @param dataId the dataId for the a specific student
 * @return all the work for a specific student
 */
StudentWorkQueryObject.prototype.getWorkByStudentId = function(dataId) {
	var dataIdContainer = this.dataIdArray[dataId];
	 
	return dataIdContainer;
}

StudentWorkQueryObject.prototype.getWorkByStudentIdAndActivity = function(dataId, activityNodeId) {

}

/**
 * Returns the query container for a specific node
 * @param nodeId the id of the node we want work for
 * @return the nodeIdContainer that contains all the query entries
 * 		for a specific node
 */
StudentWorkQueryObject.prototype.getWorkByNodeId = function(nodeId) {
	var nodeIdContainer = this.nodeIdArray[nodeId];
	
	return nodeIdContainer;
}

/**
 * Returns the prompt for a specific node
 * @param nodeId the id of the node we want the prompt of
 * @return the prompt for the node
 */
StudentWorkQueryObject.prototype.getPromptByNodeId = function(nodeId) {
	/*
	 * retrieve the nodeIdContainer which contains aggregate info for a
	 * specific node
	 */
	var nodeIdContainer = this.nodeIdArray[nodeId];
	
	//return the prompt
	return nodeIdContainer.prompt;
}


/**
 * Compiles all the data into query entries and query containers so we
 * can ask it for specific data later.
 */
StudentWorkQueryObject.prototype.compileQueryEntries = function() {
	
	//loop through the vle for each dataId/student
	for(var dataId in this.vleArray) {
		//obtain a vle for a specific dataId/student
		var vle = this.vleArray[dataId];
		var nodeIds = vle.getLeafNodeIds();
		
		//loop through all the nodes in the project
		for(var x=0; x<nodeIds.length; x++) {
			//obtain a specific node from the vle
			var nodeId = nodeIds[x];
			var node = vle.getNodeById(nodeId);
			
			//get the latest work the student has done for this node
			var queryEntry = node.getLatestWork(vle, dataId);
			
			/*
			 * queryEntry may be null if the node does not require students
			 * to do work, e.g. HtmlNode
			 */
			if(queryEntry != null) {
				//add an entry into the dataIdArray
				this.addDataIdEntry(dataId, queryEntry, node, vle);
				
				//add an entry into the nodeIdArray
				this.addNodeIdEntry(nodeId, queryEntry, node, vle);
			}
		}
	}
}

