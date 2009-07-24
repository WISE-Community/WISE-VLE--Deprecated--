/*
 * TODO: COMMENT ME
 */
function NODE_VISIT(node, nodeStates, visitStartTime, visitEndTime) {
	this.node = node;
	if (arguments.length == 1) {
		//set default values if they aren't provided
		this.nodeStates = [];
		this.visitStartTime = new Date().toUTCString();
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
	if (!nodeObject || nodeObject == null) {
		return null;
	}
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
 * Get the latest work for this visit that isn't null or
 * empty string
 * @return the latest work that is not null or blank
 */
NODE_VISIT.prototype.getLatestWork = function() {
	//loop through all the states from latest to earliest
	for(var x=this.nodeStates.length - 1; x >= 0; x--) {
		//check if the state's work is not blank
		if(this.nodeStates[x] != null && 
				this.nodeStates[x].getStudentWork() != null &&
				this.nodeStates[x].getStudentWork() != "") {
			//return the student work
			return this.nodeStates[x].getStudentWork();
		}
	}
	
	return "";
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/data/nodevisit.js");