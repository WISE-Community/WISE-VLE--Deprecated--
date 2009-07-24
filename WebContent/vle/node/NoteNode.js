/*
 * NoteNode is a child of openresponse
 */
var notePanel;
NoteNode.prototype = new OpenResponseNode();
NoteNode.prototype.constructor = NoteNode;
NoteNode.prototype.parent = OpenResponseNode.prototype;
function NoteNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
	
	/*
	 * check if the notePanel has already been created, if not we will
	 * create it. we also need to check if the element 'noteiframe' is
	 * null because safari 4.0 has some bug which causes the notePanel
	 * to be not null but the 'noteiframe' to be null.
	 */
	if (notePanel == null || document.getElementById('noteiframe') == null) {
		//The second argument passed to the
	    //constructor is a configuration object:
		notePanel = new YAHOO.widget.Panel("notePanel", {
			width: "600px",
			height: "600px",
			fixedcenter: false,
			constraintoviewport: true,
			underlay: "shadow",
			close: true,
			visible: false,
			draggable: true
		});
		
		notePanel.setHeader("My Notes");
		notePanel.setBody("<iframe name=\"noteiframe\" id=\"noteiframe\" width=\"100%\" height=\"100%\" src=\"node/openresponse/note.html\"><iframe>");

		notePanel.cfg.setProperty("underlay", "matte");
		notePanel.render();
	}
}

NoteNode.prototype.render = function(contentpanel) {
	var nodeVisits = vle.state.getNodeVisitsByNodeId(this.id);
	var states = [];
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var nodeVisit = vle.state.visitedNodes[i];
		if (nodeVisit.node.id == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			}
		}
	};
	window.frames["noteiframe"].loadContentXMLString(this.element, vle, states);
	notePanel.cfg.setProperty("visible", true);
} 

NoteNode.prototype.load = function() {
	window.frames["noteiframe"].loadFromVLE(this, vle);
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/NoteNode.js");