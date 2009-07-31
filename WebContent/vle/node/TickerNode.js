/*
 * TickerNode
 */

TickerNode.prototype = new Node();
TickerNode.prototype.constructor = TickerNode;
TickerNode.prototype.parent = Node.prototype;

function TickerNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
}

TickerNode.prototype.render = function(contentPanel) {
	if(contentPanel==null){
		contentPanel = windows.frames['ifrm'];
	};
	
	contentPanel.location = "node/ticker/ticker.html";
};



TickerNode.prototype.load = function() {
	window.frames["ifrm"].tickerLoaded(vle)
}

TickerNode.prototype.parseDataXML = function(nodeStatesXML) {
	return new Array();
}