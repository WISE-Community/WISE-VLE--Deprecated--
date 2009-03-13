/*
 * OutsideUrlNode
 */

OutsideUrlNode.prototype = new Node();
OutsideUrlNode.prototype.constructor = OutsideUrlNode;
OutsideUrlNode.prototype.parent = Node.prototype;
function OutsideUrlNode(nodeType) {
	this.type = nodeType;
}

OutsideUrlNode.prototype.render = function(contentpanel) {
	window.frames["ifrm"].document.open();
	window.frames["ifrm"].location = "js/node/outsideurl/outsideurl.html";
	window.frames["ifrm"].document.close();
}

OutsideUrlNode.prototype.load = function() {
	var url = this.element.getElementsByTagName("url")[0].firstChild.nodeValue;
		window.frames["ifrm"].loadUrl(url);
	document.getElementById('topStepTitle').innerHTML = this.title;
}

OutsideUrlNode.prototype.getDataXML = function(nodeStates) {
	return OutsideUrlNode.prototype.parent.getDataXML(nodeStates);
}