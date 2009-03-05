function ContentPanel(project, rootNode) {
	this.project = project;
	this.rootNode = rootNode;
}

/**
 * @Override vle.ContentPanel.prototype.render()
 */
ContentPanel.prototype.render = function(nodeId) {
	var node = this.rootNode.getNodeById(nodeId);
	//alert("contentpanel.js. Node:" + node + ", id:" + node.id);
	if (node == null) {
		alert('ContentPanel.js. node with nodeId: ' + nodeId + 'does not exist');
	}
	node.render(this);
}

/**
 * Highlights the element with the specified identifier within the contentpanel
 */
ContentPanel.prototype.highlightElement = function(elementIdentifier, highlightColor) {
	//alert('contentpanel.highlightelement' + elementIdentifier + "," + highlightColor);
	//window.frames["ifrm"].highlight(elementIdentifier, highlightColor);
	var elementToHighlight = window.frames["ifrm"].document.getElementById(elementIdentifier);
	elementToHighlight.style.outline = highlightColor;
}
