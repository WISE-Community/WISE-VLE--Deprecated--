/**
 * ChallengeQuestionNode is a javascript object representation
 * of a Challenge Question
 *
 * @author: patrick lawler
 */

ChallengeQuestionNode.prototype = new Node();
ChallengeQuestionNode.prototype.constructor = ChallengeQuestionNode;
ChallengeQuestionNode.prototype.parent = Node.prototype;
function ChallengeQuestionNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
}

/**
 * Retrieves content file if necessary and sets the content
 * panel with challengequestion.html
 */
ChallengeQuestionNode.prototype.render = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	if(contentPanel == null) {
		window.frames["ifrm"].location = "node/challengequestion/challengequestion.html";
	} else {
		contentPanel.location = "node/challengequestion/challengequestion.html";
	};
};


/**
 * Passes a string representation of this nodes content
 * to the location of the .html page
 */
ChallengeQuestionNode.prototype.load = function() {	
	window.frames["ifrm"].loadChallengeQuestion(this.getXMLString());
		
	document.getElementById('topStepTitle').innerHTML = this.title;
};

/**
 * @return an xml string that represents the current state of this
 * node which includes the student's submitted data
 */
ChallengeQuestionNode.prototype.getDataXML = function(nodeStates) {
	return ChallengeQuestionNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with real state object instances
 */
ChallengeQuestionNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of a CHALLENGEQUESTIONSTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(CHALLENGEQUESTIONSTATE.prototype.parseDataXML(stateXML));
	}
	return statesArrayObject;
}

/**
 * Creates XML string representation of this node
 * @return an XML ChallengeQuestionNode string that includes the content
 * of the node. this is for authoring when we want to convert the
 * project back from the authored object into an xml representation 
 * for saving.
 */
ChallengeQuestionNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<jaxbXML><![CDATA[";
	exportXML += this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	exportXML += "]]></jaxbXML>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}