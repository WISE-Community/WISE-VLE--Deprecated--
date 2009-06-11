/*
 * JournalNode is a container for JournalEntryNode
 */

JournalNode.prototype = new Node();
JournalNode.prototype.constructor = JournalNode;
JournalNode.prototype.parent = Node.prototype;
function JournalNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
	this.activeChild = null;	
	
	
	journalPanel = new YAHOO.widget.Panel("journalPanel", {
        width: "800px",
        height: "600px",
        fixedcenter: false,
        constraintoviewport: true,
        underlay: "shadow",
        close: true,
        visible: false,
        draggable: true
    });
    
	journalPanel.setHeader("My Journal");
	journalPanel.cfg.setProperty("underlay", "matte");
	journalPanel.setBody("<iframe name=\"journaliframe\" id=\"journaliframe\" width=\"100%\" height=\"100%\" src=\"node/openresponse/journalpage.html\"><iframe>");
	journalPanel.render();
}

JournalNode.prototype.render = function(contentpanel, childNodeId){
	var childIds = [];
	var activeId;
	var childTitles = [];
	
	if(childNodeId){
		this.activeChild = childNodeId;
	};
	
	for(var x=0;x<this.children.length;x++){
		childIds.push(this.children[x].id);
		childTitles.push(this.children[x].title);
	};
	
	if(!this.activeChild){
		if(this.children.length>0){
			activeId = this.children[0].id;
		};
	} else {
		activeId = this.activeChild;
	};
	
	jIFrame = window.frames['journaliframe'];
	jIFrame.setIds(childIds);
	jIFrame.setTitles(childTitles);
	jIFrame.setActiveChild(activeId);
	jIFrame.renderActive();
	jIFrame.createMenu();
    journalPanel.cfg.setProperty("visible", true);
}

JournalNode.prototype.getDataXML = function(nodeStates) {
	return JournalNode.prototype.parent.getDataXML(nodeStates);
}

JournalNode.prototype.setParameters = function(params){
	this.activeChild = params;
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/JournalNode.js");