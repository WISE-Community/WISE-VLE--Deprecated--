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

FillinNode.prototype.render = function(contentPanel) {
	var renderAfterGet = function(text, xml, args){
		var fillinNode = args[0];
		var contentPanel = args[1];
		
		if(fillinNode.filename!=null && vle.project.lazyLoading){ //load element from file
			fillinNode.retrieveFile();
		};
		
		if(contentPanel){
			var frm = contentPanel;
		} else {
			var frm = window.frames["ifrm"];
		};
		
		frm.document.open();
		frm.document.write(fillinNode.injectBaseRef(injectVleUrl(text)));
		frm.document.close();
	};
	
	/*
	 * check if the user had clicked on an outside link in the previous
	 * step
	 */
	if(this.handlePreviousOutsideLink(this)) {
		/*
		 * the user was at an outside link so the function
		 * handlePreviousOutsideLink() has taken care of the
		 * rendering of this node
		 */
		return;
	};
	
	vle.connectionManager.request('GET', 1, 'node/fillin/fillin.html', null,  renderAfterGet, [this, contentPanel]);
};

FillinNode.prototype.load = function() {
	var load = function(event, args, fiNode){
		if(!fiNode){//Firefox only passes the obj
			fiNode = event;
		};
		
		fiNode.renderComplete = true;
		window.frames["ifrm"].loadContent([fiNode.element, vle]);
		document.getElementById('topStepTitle').innerHTML = fiNode.title;
	};
	
	if(this.renderComplete){
		load(this);
	} else {
		vle.eventManager.subscribe('nodeRenderComplete_' + this.id, load, this);
	};
};

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


//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/FillinNode.js");