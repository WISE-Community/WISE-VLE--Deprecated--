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
	var renderAfterGet = function(text, xml, fiNode){
		if(fiNode.filename!=null && vle.project.lazyLoading){ //load element from file
			fiNode.retrieveFile();
		};
		
		fiNode.contentPanel.document.open();
		fiNode.contentPanel.document.write(fiNode.injectBaseRef(injectVleUrl(text)));
		fiNode.contentPanel.document.close();
		
		if(fiNode.contentPanel.name!='ifrm'){
			fiNode.contentPanel.renderComplete = function(){
				fiNode.load();
			};
		};
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
	
	if(contentPanel){
		this.contentPanel = window.frames[contentPanel.name];
	} else {
		this.contentPanel = window.frames['ifrm'];
	};
	
	vle.connectionManager.request('GET', 1, 'node/fillin/fillin.html', null,  renderAfterGet, this);
};

FillinNode.prototype.load = function() {
	var load = function(event, args, fiNode){
		if(!fiNode){//Firefox only passes the obj
			fiNode = event;
		};
		
		fiNode.contentPanel.loadContent([fiNode.element, vle]);
	};
	
	if(this.contentLoaded){
		load(this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, load, this);
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