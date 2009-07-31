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
			width: "650px",
			height: "650px",
			fixedcenter: false,
			constraintoviewport: true,
			underlay: "shadow",
			close: true,
			visible: false,
			draggable: true
		});
		
		notePanel.setHeader("Reflection Note");
		notePanel.setBody("<iframe name=\"noteiframe\" id=\"noteiframe\" frameborder=\"0\" width=\"100%\" height=\"100%\" src=\"node/openresponse/note.html\"><iframe>");
		

		notePanel.cfg.setProperty("underlay", "matte");
		notePanel.render();
	}
}

NoteNode.prototype.render = function(contentPanel) {
	if(this.contentLoaded){//content is available, proceed with render
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
		
		if(contentPanel==null){ //no contentPanel provided, use 'noteiframe' as default
			this.contentPanel = window.frames['noteiframe'];
			window.frames["noteiframe"].loadContent([this.element, vle, states]);
			notePanel.cfg.setProperty("visible", true);
		} else {
			var currFrm = window.frames[contentPanel.name]; //need the frame to set variables
			
			this.contentPanel = currFrm;
			currFrm.location = 'node/openresponse/note.html';
			currFrm.loadArgs = [this.element, vle, states];
			currFrm.allReady = function(win){
				win.loadContent(win.loadArgs);
			};
		};
	} else {
		//content is not available, wait for content loading event
		//to complete, then call render again
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

NoteNode.prototype.load = function() {
	if(this.contentPanel && this.contentPanel.name=='noteiframe'){
		this.contentPanel.loadFromVLE(this, vle);
	} else {
		var nodeVisits = vle.state.getNodeVisitsByNodeId(this.id);
		var states = [];
		for (var i=0; i < vle.state.visitedNodes.length; i++) {
			var nodeVisit = vle.state.visitedNodes[i];
			if (nodeVisit.node.id == this.id) {
				for (var j=0; j<nodeVisit.nodeStates.length; j++) {
					states.push(nodeVisit.nodeStates[j]);
				};
			};
		};
		
		this.contentPanel.loadContent([this.element, vle, states]);
	};
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/NoteNode.js");