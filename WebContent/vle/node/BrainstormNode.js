/**
 * BrainstormNode
 *
 * @author: patrick lawler
 */

BrainstormNode.prototype = new Node();
BrainstormNode.prototype.constructor = BrainstormNode;
BrainstormNode.prototype.parent = Node.prototype;
function BrainstormNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
	this.audioSupported = true;
	this.serverless = true;
};

BrainstormNode.prototype.render = function(contentPanel){
	var renderAfterGet = function(text, xml, bsNode){
		if(bsNode.filename!=null && vle.project.lazyLoading){ //load element from file
			bsNode.retrieveFile();
		};
		
		bsNode.contentPanel.document.open();
		bsNode.contentPanel.document.write(bsNode.injectBaseRef(injectVleUrl(text)));
		bsNode.contentPanel.document.close();
		bsNode.contentPanel.document.contentPanel = bsNode.contentPanel;
		if(bsNode.contentPanel.name!='ifrm'){
			bsNode.contentPanel.renderComplete = function(){
				bsNode.load();
			};
		};
	};
	
	if(this.serverless){
		var url = 'node/brainstorm/brainlite.html';
	} else {
		var url = 'node/brainstorm/brainfull.html';
	};
	
	if(contentPanel){
		this.contentPanel = window.frames[contentPanel.name];
	} else {
		this.contentPanel = window.frames['ifrm'];
	};
	
	vle.connectionManager.request('GET', 1, url, null,  renderAfterGet, this);
};

BrainstormNode.prototype.load = function(){
	var states = [];
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var nodeVisit = vle.state.visitedNodes[i];
		if (nodeVisit.node.id == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			};
		};
	};
	
	this.contentPanel.loadContent([this.element, this.id, states, vle]);
};

BrainstormNode.prototype.getDataXML = function(nodeStates) {
	return BrainstormNode.prototype.parent.getDataXML(nodeStates);
};

BrainstormNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		var stateObject = BRAINSTORMSTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		};
	};
	
	return statesArrayObject;
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/BrainstormNode.js");