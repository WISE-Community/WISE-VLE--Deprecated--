/**
 * A GlueNode is a node that renders 1 or more children in a single page
 *
 * @author: patrick lawler
 */

GlueNode.prototype = new Node();
GlueNode.prototype.constructor = GlueNode;
GlueNode.prototype.parent = Node.prototype;
function GlueNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
};

GlueNode.prototype.render = function(contentPanel){
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	if(contentPanel==null){
		contentPanel = window.frames['ifrm'];
	};
	
	contentPanel.location = "node/glue/glue.html";
};

GlueNode.prototype.load = function(){
	var states = [];
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var nodeVisit = vle.state.visitedNodes[i];
		if (nodeVisit.node.id == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			};
		};
	};
	
	window.frames["ifrm"].loadXMLAndStateAndVLE(this.element, states, vle);
};

GlueNode.prototype.renderPrev = function(){
	window.frames["ifrm"].renderPrev();
};

GlueNode.prototype.renderNext = function(){
	window.frames["ifrm"].renderNext();
};

GlueNode.prototype.getDataXML = function(nodeStates) {
	return GlueNode.prototype.parent.getDataXML(nodeStates);
};

GlueNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		var stateObject = GLUESTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		};
	};
	
	return statesArrayObject;
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/GlueNode.js");