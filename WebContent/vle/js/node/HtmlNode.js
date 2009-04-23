/*
 * HtmlNode
 */

HtmlNode.prototype = new Node();
HtmlNode.prototype.constructor = HtmlNode;
HtmlNode.prototype.parent = Node.prototype;
function HtmlNode(nodeType) {
	this.type = nodeType;
	this.content = null;
	this.filename = null;
}

HtmlNode.prototype.setContent = function(content) {
	//update the content attribute that contains the html
	this.content = content;
	
	//update the element node so it contains the new html the user just authored...why is this needed?
	//this.element.getElementsByTagName("content")[0].firstChild.nodeValue = content;
}

HtmlNode.prototype.render = function(contentPanel) {
	if (this.filename != null) {
	
		if(window.ActiveXObject) {
			this.content = this.element.xml;
		} else {
			this.content = (new XMLSerializer()).serializeToString(this.element);
		};
		
		window.frames["ifrm"].document.open();
		window.frames["ifrm"].document.write(this.content);
		window.frames["ifrm"].document.close();
		return;
	} else if(this.content == null) {
		/*
		 * the first time render is called this needs to be set because
		 * it doesn't work in the constructor for some reason. we should
		 * look into that in the future.
		 */
		this.content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	}
	
	if(contentPanel == null) {
		/*
		 * this will be the default iframe to render in if no contentPanel
		 * is passed
		 */
		contentPanel = window.frames["ifrm"];
	}
	
	if (contentPanel.document) {
		//write the content into the contentPanel, this will render the html in that panel
		contentPanel.document.open();
		contentPanel.document.write(this.content);
		contentPanel.document.close();
	} else {
		window.frames["ifrm"].document.open();
		window.frames["ifrm"].document.write(this.content);
		window.frames["ifrm"].document.close();
	}
}

HtmlNode.prototype.getDataXML = function(nodeStates) {
	return "";
	// return HtmlNode.prototype.parent.getDataXML(nodeStates); todo: geoff add state to htmlnode
}

HtmlNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesArrayObject = new Array();
	return statesArrayObject;
}


HtmlNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<content><![CDATA[";
	exportXML += this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	exportXML += "]]></content>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}
