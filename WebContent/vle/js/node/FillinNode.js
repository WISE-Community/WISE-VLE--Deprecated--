/*
 * FillinNode
 */

FillinNode.prototype = new Node();
FillinNode.prototype.constructor = FillinNode;
FillinNode.prototype.parent = Node.prototype;
function FillinNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
}

FillinNode.prototype.render = function(contentpanel) {
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	window.frames["ifrm"].location = "vle/js/node/fillin/fillin.html";
};


FillinNode.prototype.load = function() {
	window.frames["ifrm"].loadXMLString(this.getXMLString(), vle);
	
	document.getElementById('topStepTitle').innerHTML = this.title;
}

FillinNode.prototype.getDataXML = function(nodeStates) {
	return FillinNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
FillinNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an FILLINSTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(FILLINSTATE.prototype.parseDataXML(stateXML));
	}
	
	return statesArrayObject;
}

FillinNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<jaxbXML><![CDATA[";
	exportXML += this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	exportXML += "]]></jaxbXML>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

FillinNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
}