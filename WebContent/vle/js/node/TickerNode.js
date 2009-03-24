/*
 * TickerNode
 */

TickerNode.prototype = new Node();
TickerNode.prototype.constructor = TickerNode;
TickerNode.prototype.parent = Node.prototype;

function TickerNode(nodeType) {
	this.type = nodeType;
}

TickerNode.prototype.render = function(contentpanel) {
	window.frames["ifrm"].document.open();
	window.frames["ifrm"].location = "js/node/ticker/ticker.html";
	window.frames["ifrm"].document.close();
}