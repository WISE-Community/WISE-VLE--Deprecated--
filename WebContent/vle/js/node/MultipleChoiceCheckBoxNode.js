/*
 * MultipleChoiceCheckBoxNode
 */

MultipleChoiceCheckBoxNode.prototype = new Node();
MultipleChoiceCheckBoxNode.prototype.constructor = MultipleChoiceCheckBoxNode;
MultipleChoiceCheckBoxNode.prototype.parent = Node.prototype;
function MultipleChoiceCheckBoxNode(nodeType) {
	this.type = nodeType;
}

MultipleChoiceCheckBoxNode.prototype.render = function(contentPanel) {
	if(contentPanel == null) {
		window.frames["ifrm"].location = "js/node/multiplechoicecheckbox/multiplechoicecheckbox.html";
	} else {
		contentPanel.location = "js/node/multiplechoicecheckbox/multiplechoicecheckbox.html";
	}
}



MultipleChoiceCheckBoxNode.prototype.load = function() {
	var xmlNode = this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	window.frames["ifrm"].renderMCFromString(xmlNode);
	
	//these steps are now loaded from the vle/otml, this does not work for some reason
	window.frames["ifrm"].loadFromVLE(this, vle);
	
	document.getElementById('topStepTitle').innerHTML = this.title;
}

MultipleChoiceCheckBoxNode.prototype.getDataXML = function(nodeStates) {
	return MultipleChoiceCheckBoxNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
MultipleChoiceCheckBoxNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an MCSTATE object and put it into the array that we will return
		 */
		var stateObject = MCCBSTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		}
	}
	
	return statesArrayObject;
}

MultipleChoiceCheckBoxNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<jaxbXML><![CDATA[";
	exportXML += this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	exportXML += "]]></jaxbXML>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}
