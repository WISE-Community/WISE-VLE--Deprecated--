/*
 * HtmlNode
 */

HtmlNode.prototype = new Node();
HtmlNode.prototype.constructor = HtmlNode;
HtmlNode.prototype.parent = Node.prototype;
function HtmlNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
	this.contentBase;
}

HtmlNode.prototype.setContent = function(content) {
	//update the content attribute that contains the html
	this.content = content;
	
	//update the element node so it contains the new html the user just authored...why is this needed?
	//this.element.getElementsByTagName("content")[0].firstChild.nodeValue = content;
}

HtmlNode.prototype.load = function() {
	this.prepareAudio();
	if (vle.audioManager != null) {
		vle.audioManager.setCurrentNode(this);
	}
}


HtmlNode.prototype.render = function(contentPanel) {
	if (this.elementText != null) {
		window.frames["ifrm"].document.open();
		window.frames["ifrm"].document.write(this.injectBaseRef(this.elementText));
		window.frames["ifrm"].document.close();
		return;
	} else if (this.filename != null) {
	
		if(window.ActiveXObject) {
			this.content = this.element.xml;
		} else {
			this.content = (new XMLSerializer()).serializeToString(this.element);
		};
		
		window.frames["ifrm"].document.open();
		window.frames["ifrm"].document.write(this.injectBaseRef(this.content));
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
		contentPanel.document.write(this.injectBaseRef(this.content));
		contentPanel.document.close();
	} else {
		window.frames["ifrm"].document.open();
		window.frames["ifrm"].document.write(this.injectBaseRef(this.content));
		window.frames["ifrm"].document.close();
	}
}

/**
 * Lite rendering of html node for glue-type nodes
 */
HtmlNode.prototype.renderLite = function(frame){
	if(this.filename!=null && vle.project.lazyLoading){
		this.retrieveFile();
	};
};

/**
 * Lite loading of html node for glue-type nodes
 */
HtmlNode.prototype.loadLite = function(frame){
	if(!this.elementText){
		if(!this.content){
			this.elementText = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
			this.content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
		} else {
			this.elementText = this.content;
		};
	};
	
	window.frames['ifrm'].frames[frame].document.open();
	window.frames['ifrm'].frames[frame].document.write(this.injectBaseRef(this.elementText));
	window.frames['ifrm'].frames[frame].document.close();
	
	//inject necessary glue functions into html document
	window.frames['ifrm'].frames[frame].getAnswered = function(){return true;};
	window.frames['ifrm'].frames[frame].checkAnswerLite = function(){return 'visited html: ' + this.id};
};


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

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/HtmlNode.js");