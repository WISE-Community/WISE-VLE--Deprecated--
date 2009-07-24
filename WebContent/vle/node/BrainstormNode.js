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
};

BrainstormNode.prototype.render = function(contentPanel){
	var renderAfterGet = function(text, xml, args){
		var bsNode = args[0];
		var contentPanel = args[1];
		
		if(bsNode.filename!=null && vle.project.lazyLoading){ //load element from file
			bsNode.retrieveFile();
		};
		
		if(contentPanel){
			var frm = contentPanel;
		} else {
			var frm = window.frames["ifrm"];
		};
		
		frm.document.open();
		frm.document.write(bsNode.injectBaseRef(injectVleUrl(text)));
		frm.document.close();
	};
	
	vle.connectionManager.request('GET', 1, 'node/brainstorm/brainstorm.html', null,  renderAfterGet, [this, contentPanel]);
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
	
	window.frames["ifrm"].loadContent([this.element, this.id, states, vle]);
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