
NetlogoNode.prototype = new Node();
NetlogoNode.prototype.constructor = NetlogoNode;
NetlogoNode.prototype.parent = Node.prototype;
NetlogoNode.authoringToolName = "Netlogo";
NetlogoNode.authoringToolDescription = "Students work on a NetLogo activity";

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {NetLogoNode}
 */
function NetlogoNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
}

NetlogoNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/netlogo/netlogo.html');
};

NodeFactory.addNode('NetlogoNode', NetlogoNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/netlogo/NetlogoNode.js');
};