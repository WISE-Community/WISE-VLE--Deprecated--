/*
 * FlashNode
 * interfaces VLE and Flash via javascript
 * Flash can invoke javascript and javascript can invoke Flash via specific interfaces
 * see here for interface API: link_goes_here
 */

FlashNode.prototype = new Node();
FlashNode.prototype.constructor = FlashNode;
FlashNode.prototype.parent = Node.prototype;
function FlashNode(nodeType) {
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
}

FlashNode.prototype.setContent = function(content) {
	//update the content attribute that contains the html
	this.content = content;
	
	//update the element node so it contains the new html the user just authored...why is this needed?
	//this.element.getElementsByTagName("content")[0].firstChild.nodeValue = content;
}


FlashNode.prototype.render = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	if(contentPanel == null) {
		window.frames["ifrm"].location = "vle/js/node/flash/flash_js.html";
	} else {
		contentPanel.location = "vle/js/node/flash/flash_js.html";
	};
};

FlashNode.prototype.load = function() {	
	var filenameWithoutExtention = this.filename.substring(0, this.filename.indexOf(".swf"));
	window.frames["ifrm"].render(filenameWithoutExtention);
	
	//these steps are now loaded from the vle/otml, this does not work for some reason
	//window.frames["ifrm"].loadFromVLE(this, vle);
		
	document.getElementById('topStepTitle').innerHTML = this.title;
};

FlashNode.prototype.getDataXML = function(nodeStates) {
	return "";
	// return HtmlNode.prototype.parent.getDataXML(nodeStates); todo: geoff add state to htmlnode
}

FlashNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesArrayObject = new Array();
	return statesArrayObject;
}


FlashNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<content><![CDATA[";
	exportXML += this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	exportXML += "]]></content>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}
