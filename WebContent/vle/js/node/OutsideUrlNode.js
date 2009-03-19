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

OutsideUrlNode.prototype.load = function(contentPanel) {
	var url = this.element.getElementsByTagName("url")[0].firstChild.nodeValue;
	
	if(contentPanel == null) {
		window.frames["ifrm"].loadUrl(url);
	} else {
		contentPanel.loadUrl(url);
	}
	
	//document.getElementById('topStepTitle').innerHTML = this.title;
	this.parent.setTopStepTitle();
}


OutsideUrlNode.prototype.getDataXML = function(nodeStates) {
	return OutsideUrlNode.prototype.parent.getDataXML(nodeStates);
}

OutsideUrlNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<url>";
	exportXML += this.element.getElementsByTagName("url")[0].firstChild.nodeValue;
	exportXML += "</url>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}