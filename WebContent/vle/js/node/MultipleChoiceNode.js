/*
 * MultipleChoiceNode
 */

MultipleChoiceNode.prototype = new Node();
MultipleChoiceNode.prototype.constructor = MultipleChoiceNode;
MultipleChoiceNode.prototype.parent = Node.prototype;
function MultipleChoiceNode(nodeType) {
	this.type = nodeType;
}

MultipleChoiceNode.prototype.render = function(contentPanel) {
	if(contentPanel == null) {
		window.frames["ifrm"].location = "js/node/multiplechoice/multiplechoice.html";
	} else {
		contentPanel.location = "js/node/multiplechoice/multiplechoice.html";
	}
}



MultipleChoiceNode.prototype.load = function() {
	var xmlNode = this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	window.frames["ifrm"].renderMCFromString(xmlNode);
	
	//these steps are now loaded from the vle/otml, this does not work for some reason
	window.frames["ifrm"].loadFromVLE(this, vle);
	
	document.getElementById('topStepTitle').innerHTML = this.title;
}

MultipleChoiceNode.prototype.getDataXML = function(nodeStates) {
	return MultipleChoiceNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
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

MultipleChoiceNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<jaxbXML><![CDATA[";
	exportXML += this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	exportXML += "]]></jaxbXML>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

MultipleChoiceNode.prototype.getHumanReadableForm = function(states) {
	var humanReadableText = "";
	for(var x=0; x<states.length; x++) {
		humanReadableText += states[x].choiceIdentifier;
	}
	return humanReadableText;
}

MultipleChoiceNode.prototype.createAggregateNode(mcXML) {
	var mc = new MC(mcXML);
	return new MultipleChoiceAggregateNode(mc);
}