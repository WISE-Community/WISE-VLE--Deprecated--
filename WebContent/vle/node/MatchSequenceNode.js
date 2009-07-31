/*
 * MatchSequenceNode
 */

MatchSequenceNode.prototype = new Node();
MatchSequenceNode.prototype.constructor = MatchSequenceNode;
MatchSequenceNode.prototype.parent = Node.prototype;
function MatchSequenceNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
}

MatchSequenceNode.prototype.render = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	if(contentPanel){
		this.contentPanel = window.frames[contentPanel.name];
		this.contentPanel.location = "node/matchsequence/matchsequence.html";
		this.contentPanel.loadArgs = [this];
		this.contentPanel.allReady = function(win){win.loadArgs[0].load();};
	} else {
		this.contentPanel = window.frames["ifrm"];
		this.contentPanel.location = "node/matchsequence/matchsequence.html";
	};
};


MatchSequenceNode.prototype.load = function() {
	var xmlCustomCheck = this.element.getElementsByTagName("customCheck");
	if(xmlCustomCheck[0]!=null){
		xmlCustomCheck = xmlCustomCheck[0].firstChild.nodeValue;
	} else {
		xmlCustomCheck = null;
	};
	
	this.contentPanel.loadFromXMLString(this.getXMLString(), xmlCustomCheck);
};

MatchSequenceNode.prototype.getDataXML = function(nodeStates) {
	return MatchSequenceNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
MatchSequenceNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an MSSTATE object and put it into the array that we will return
		 */
		var stateObject = MSSTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		}
	}
	
	return statesArrayObject;
}


//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/MatchSequenceNode.js");