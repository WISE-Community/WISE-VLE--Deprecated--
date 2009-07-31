/*
 * JournalEntryNode is an open_response
 * author: patrick lawler
 */

JournalEntryNode.prototype = new OpenResponseNode();
JournalEntryNode.prototype.constructor = JournalEntryNode;
JournalEntryNode.prototype.parent = OpenResponseNode.prototype;
function JournalEntryNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
}	


JournalEntryNode.prototype.render = function(contentPanel){
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	var states = [];
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var nodeVisit = vle.state.visitedNodes[i];
		if (nodeVisit.node.id == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			}
		}
	}
	
	if(contentPanel==null){
		contentPanel = window.parent.frames['journaliframe'];
	};
	
	contentPanel.frames["journalentryiframe"].loadContentXMLString(this.element, vle, states);
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/JournalEntryNode.js");