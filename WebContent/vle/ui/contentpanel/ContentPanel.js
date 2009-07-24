function ContentPanel(project, rootNode) {
	this.project = project;
	this.rootNode = rootNode;
}

/**
 * @Override vle.ContentPanel.prototype.render()
 */
ContentPanel.prototype.render = function(nodeId) {
	var node = vle.getNodeById(nodeId);
	//alert("contentpanel.js. Node:" + node + ", id:" + node.id);
	if (node == null) {
		alert('ContentPanel.js. node with nodeId: ' + nodeId + 'does not exist');
	}
	//node.render(this);  this should be used in the future.
	node.render();
}

/**
 * Highlights the element with the specified identifier within the contentpanel
 */
ContentPanel.prototype.highlightElement = function(elementIdentifier, highlightColor) {
	if(elementIdentifier != null) {
		var elementToHighlight = window.frames["ifrm"].document.getElementById(elementIdentifier);
		if (elementToHighlight) {
			elementToHighlight.style.outline = highlightColor;
		}
	}
}


/**
 * Highlights the element with the specified attribute within the contentpanel
 */
ContentPanel.prototype.highlightElement = function(elementToHighlight, highlightColor) {
	if (elementToHighlight && elementToHighlight != null) {
		elementToHighlight.setStyle("outline", highlightColor);
	}
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/ui/contentpanel/ContentPanel.js");