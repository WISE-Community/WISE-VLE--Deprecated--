/*
 * JournalEntryNode is an open_response
 * author: patrick lawler
 */

JournalEntryNode.prototype = new Node();
JournalEntryNode.prototype.constructor = JournalEntryNode;
JournalEntryNode.prototype.parent = Node.prototype;
function JournalEntryNode(nodeType) {
	this.type = nodeType;
}	


JournalEntryNode.prototype.render = function(contentpanel){
	var nodeVisits = vle.state.getNodeVisitsByNodeId(this.id);
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


JournalEntryNode.prototype.load = function() {
	alert("loading JournalEntryNode");
}