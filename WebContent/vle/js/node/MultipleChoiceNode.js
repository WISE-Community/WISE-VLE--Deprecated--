/*
 * MultipleChoiceNode
 */

MultipleChoiceNode.prototype = new Node();
MultipleChoiceNode.prototype.constructor = MultipleChoiceNode;
MultipleChoiceNode.prototype.parent = Node.prototype;
function MultipleChoiceNode(nodeType) {
	this.type = nodeType;
	
	//mainly used for the ticker
	this.mc = null;
}

MultipleChoiceNode.prototype.render = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	if(contentPanel == null) {
		window.frames["ifrm"].location = "/vlewrapper/vle/js/node/multiplechoice/multiplechoice.html";
	} else {
		contentPanel.location = "/vlewrapper/vle/js/node/multiplechoice/multiplechoice.html";
	};
};



MultipleChoiceNode.prototype.load = function() {	
	window.frames["ifrm"].renderMCFromString(this.getXMLString());
	
	//these steps are now loaded from the vle/otml, this does not work for some reason
	window.frames["ifrm"].loadFromVLE(this, vle);
		
	document.getElementById('topStepTitle').innerHTML = this.title;
};

/**
 * @return an xml string that represents the current state of this
 * node which includes the student's submitted data
 */
MultipleChoiceNode.prototype.getDataXML = function(nodeStates) {
	return MultipleChoiceNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with real state object instances
 */
MultipleChoiceNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an MCSTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(MCSTATE.prototype.parseDataXML(stateXML));
	}
	return statesArrayObject;
}

/**
 * Creates XML string representation of this node
 * @return an XML MultipleChoiceNode string that includes the content
 * of the node. this is for authoring when we want to convert the
 * project back from the authored object into an xml representation 
 * for saving.
 */
MultipleChoiceNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<jaxbXML><![CDATA[";
	exportXML += this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	exportXML += "]]></jaxbXML>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

/**
 * Retrieves the latest student work for this node and returns it in
 * a query entry object
 * @param vle the vle that this node has been loaded into, this vle
 * 		is related to a specific student, so all the work in this vle
 * 		is for just one student
 * @return a MultipleChoiceQueryEntry that contains the latest student
 * 		work for this node. return null if this student has not accessed
 * 		this step yet.
 */
MultipleChoiceNode.prototype.getLatestWork = function(vle) {
	var latestState = null;
	
	//setup the mc object by loading in the content of the step
	this.mc = new MC(loadXMLString(this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue));
	
	//load the states from the vle into the mc object
	this.mc.loadForTicker(this, vle);
	
	//get the most recent student work for this step
	latestState = this.mc.getLatestState(this.id);
	
	if(latestState == null) {
		//the student has not accessed or completed this step yet
		return null;
	}
	
	//create and return a query entry object
	return new MultipleChoiceQueryEntry(vle.getWorkgroupId(), vle.getUserName(), this.id, this.mc.promptText, latestState.getIdentifier(), this.mc.getCHOICEByIdentifier(latestState.getIdentifier()).text);
}

/**
 * Create a query container that will contain all the query entries
 * @param vle the vle that this node has been loaded into, this vle
 * 		is related to a specific student, so all the work in this vle
 * 		is for just one student
 * @return a MultipleChoiceQueryContainer that will contain all the
 * 		query entries for a specific nodeId as well as accumulated 
 * 		metadata about all those entries such as count totals, etc.
 */
MultipleChoiceNode.prototype.makeQueryContainer = function(vle) {
	//setup the mc object by loading in the content of the step
	this.mc = new MC(loadXMLString(this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue));
	
	//load the states from the vle into the mc object
	this.mc.loadForTicker(this, vle);
	
	//create and return a query container object
	return new MultipleChoiceQueryContainer(this.id, this.mc.promptText, this.mc.choiceToValueArray);
}