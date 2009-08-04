/*
 * MultipleChoiceNode
 */

MultipleChoiceNode.prototype = new Node();
MultipleChoiceNode.prototype.constructor = MultipleChoiceNode;
MultipleChoiceNode.prototype.parent = Node.prototype;
function MultipleChoiceNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
	
	//mainly used for the ticker
	this.mc = null;
	this.contentBase;
	this.audioSupported = true;	
}

MultipleChoiceNode.prototype.render = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, mcNode){			
			mcNode.contentPanel.document.open();
			mcNode.contentPanel.document.write(mcNode.injectBaseRef(injectVleUrl(text)));
			mcNode.contentPanel.document.close();
			if(mcNode.contentPanel.name!='ifrm'){
				mcNode.contentPanel.renderComplete = function(){
					mcNode.load();
				};
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/multiplechoice/multiplechoice.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

MultipleChoiceNode.prototype.load = function() {
	this.contentPanel.loadContent([this.elementText, this, vle]);
};

/**
 * Renders barebones mc by entity other than VLE
 */
MultipleChoiceNode.prototype.renderLite = function(frame){
	if(this.filename!=null && vle.project.lazyLoading){
		this.retrieveFile();
	};
	
	window.frames['ifrm'].frames[frame].location = "../multiplechoice/multiplechoicelite.html";
};

/**
 * Loads barebones mc by entity other than VLE
 */
MultipleChoiceNode.prototype.loadLite = function(frame){
	var str = this.getXMLString();
	setTimeout(function(){window.frames['ifrm'].frames[frame].renderMCFromString(str);}, 2000);
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
 * Returns the prompt for this node by loading the MC content and then
 * obtaining it from the MC
 * @return the prompt for this node
 */
MultipleChoiceNode.prototype.getPrompt = function() {
	//create the MC object so we can retrieve the prompt from it
	//alert('mcnode.js, nodeId:' + this.id);
	//alert(this.getXMLString());
	var xmlDoc=loadXMLString(this.getXMLString());
	//alert(xmlDoc);
	this.mc = new MC(xmlDoc);
	
	//return the prompt as a string
	return this.mc.promptText;
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

/**
 * Translate an identifier to the corresponding value such as
 * choice1 to "The fish was swimming"
 * We need to create an MC object in order to look up the identifiers
 * @param identifier the id of the choice
 * @return the string value of the choice
 */
MultipleChoiceNode.prototype.translateStudentWork = function(identifier) {
	//create an MC object so we can look up the value corresponding to an identifier
	this.mc = new MC(loadXMLString(this.getXMLString()));
	
	//return the value as a string
	return this.mc.getCHOICEByIdentifier(identifier).text;
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/MultipleChoiceNode.js");