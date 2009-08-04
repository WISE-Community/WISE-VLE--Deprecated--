/**
 * An OpenResponseNode is a representation of an OpenResponse assessment item
 *
 */

OpenResponseNode.prototype = new Node();
OpenResponseNode.prototype.constructor = OpenResponseNode;
OpenResponseNode.prototype.parent = Node.prototype;
function OpenResponseNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
};

OpenResponseNode.prototype.render = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, orNode){			
			orNode.contentPanel.document.open();
			orNode.contentPanel.document.write(orNode.injectBaseRef(injectVleUrl(text)));
			orNode.contentPanel.document.close();
			if(orNode.contentPanel.name!='ifrm'){
				orNode.contentPanel.renderComplete = function(){
					orNode.load();
				};
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/openresponse/openresponse.html', null,  renderAfterGet, this);	
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

OpenResponseNode.prototype.load = function() {
	var states = [];
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var nodeVisit = vle.state.visitedNodes[i];
		if (nodeVisit.node.id == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			}
		}
	}
	
	this.contentPanel.loadContent([this.element, vle, states]);
};

/**
 * Renders barebones open response
 */
OpenResponseNode.prototype.renderLite = function(frame){
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	window.frames["ifrm"].frames[frame].location = "../openresponse/openresponselite.html";
};

/**
 * Loades barebones open response
 */
OpenResponseNode.prototype.loadLite = function(frame){
	var str = this.getXMLString();
	setTimeout(function(){window.frames['ifrm'].frames[frame].renderORFromString(str);}, 2000);
};

OpenResponseNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		statesArrayObject.push(OPENRESPONSESTATE.prototype.parseDataXML(stateXML));
	}
	
	return statesArrayObject;
}

OpenResponseNode.prototype.getDataXML = function(nodeStates) {
	return OpenResponseNode.prototype.parent.getDataXML(nodeStates);
};

OpenResponseNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};


//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/OpenResponseNode.js");