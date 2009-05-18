/*
 * CustomJournalEntryNode is an open_response
 * author: patrick lawler
 */

CustomJournalEntryNode.prototype = new JournalEntryNode();
CustomJournalEntryNode.prototype.constructor = CustomJournalEntryNode;
CustomJournalEntryNode.prototype.parent = JournalEntryNode.prototype;
function CustomJournalEntryNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
	this.vle;
}

CustomJournalEntryNode.prototype.render = function(contentpanel){
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	var states = [];
	for (var i=0; i < this.vle.state.visitedNodes.length; i++) {
		var nodeVisit = this.vle.state.visitedNodes[i];
		if (nodeVisit.node.id == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			}
		}
	}
	window.parent.parent.frames["journaliframe"].frames["journalentryiframe"].loadContentXMLString(this.element);
	window.parent.parent.frames["journaliframe"].frames["journalentryiframe"].loadStateAndRender(this.vle, states);
}