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
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	window.frames["ifrm"].location = "vle/js/node/openresponse/openresponse.html";
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
	
	window.frames['ifrm'].loadContentXMLString(this.element);
	window.frames["ifrm"].loadStateAndRender(vle, states);
};

/**
 * Renders barebones open response
 */
OpenResponseNode.prototype.renderLite = function(frame){
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	window.frames["ifrm"].frames[frame].location = "vle/js/node/openresponse/openresponselite.html";
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