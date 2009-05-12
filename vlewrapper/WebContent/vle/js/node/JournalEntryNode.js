/*
 * JournalEntryNode is an open_response
 * author: patrick lawler
 */

JournalEntryNode.prototype = new OpenResponseNode();
JournalEntryNode.prototype.constructor = JournalEntryNode;
JournalEntryNode.prototype.parent = OpenResponseNode.prototype;
function JournalEntryNode(nodeType) {
	this.type = nodeType;
}	


JournalEntryNode.prototype.render = function(contentpanel){
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
	window.parent.frames["journaliframe"].frames["journalentryiframe"].loadContentXMLString(this.element);
	window.parent.frames["journaliframe"].frames["journalentryiframe"].loadStateAndRender(vle, states);
}