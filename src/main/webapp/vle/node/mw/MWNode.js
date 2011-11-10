
MWNode.prototype = new Node();
MWNode.prototype.constructor = MWNode;
MWNode.prototype.parent = Node.prototype;
MWNode.authoringToolName = "Molecular Workbench";
MWNode.authoringToolDescription = "Students work on a Molecular Workbench applet";

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {MWNode}
 */
function MWNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
}

MWNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/mw/mw.html');
};

NodeFactory.addNode('MWNode', MWNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/mw/MWNode.js');
};