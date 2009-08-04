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
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){//content is available, proceed with render
		var renderAfterGet = function(text, xml, orNode){			
			orNode.contentPanel.document.open();
			text = text.replace(/(\.\.\/\.\.\/)/gi, ''); //remove '../../' in any references because this should not be the note panel
			orNode.contentPanel.document.write(orNode.injectBaseRef(text));
			orNode.contentPanel.document.close();
			if(orNode.contentPanel.name!='noteiframe'){
				orNode.contentPanel.renderComplete = function(){
					orNode.load();
				};
			};
		};
		
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
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {//using YUI panel, load content into panel and return
			this.contentPanel = window.frames['noteiframe'];
			this.contentPanel.loadContent([this.element, vle, states]);
			notePanel.cfg.setProperty('visible', true);
			return;
		};
		
		vle.connectionManager.request('GET', 1, 'node/openresponse/note.html', null,  renderAfterGet, this);
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