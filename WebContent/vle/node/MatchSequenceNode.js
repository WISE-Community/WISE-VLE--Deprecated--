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
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, msNode){			
			msNode.contentPanel.document.open();
			msNode.contentPanel.document.write(msNode.injectBaseRef(injectVleUrl(text)));
			msNode.contentPanel.document.close();
			if(msNode.contentPanel.name!='ifrm'){
				msNode.contentPanel.renderComplete = function(){
					msNode.load();
				};
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/matchsequence/matchsequence.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};


MatchSequenceNode.prototype.load = function() {
	var xmlCustomCheck = this.element.getElementsByTagName("customCheck");
	if(xmlCustomCheck[0]!=null){
		xmlCustomCheck = xmlCustomCheck[0].firstChild.nodeValue;
	} else {
		xmlCustomCheck = null;
	};
	
	this.contentPanel.loadContent(this.getXMLString(), xmlCustomCheck);
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