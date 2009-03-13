/*
 * HtmlNode
 */

HtmlNode.prototype = new Node();
HtmlNode.prototype.constructor = HtmlNode;
HtmlNode.prototype.parent = Node.prototype;
function HtmlNode(nodeType) {
	this.type = nodeType;
}

HtmlNode.prototype.render = function(contentpanel) {
	var content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	window.frames["ifrm"].document.open();	
	window.frames["ifrm"].document.write(content);   
	window.frames["ifrm"].document.close(); 		

}

HtmlNode.prototype.getDataXML = function(nodeStates) {
	return "";
	// return HtmlNode.prototype.parent.getDataXML(nodeStates); todo: geoff add state to htmlnode
}

HtmlNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesArrayObject = new Array();
	return statesArrayObject;
}