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
	this.audioSupported = true;	
}

HtmlNode.prototype.setContent = function(content) {
	//update the content attribute that contains the html
	this.content = content;
	this.contentLoaded = true;
	
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
	if(this.contentLoaded){//content is available, proceed with render
		/*
		 * check if the user had clicked on an outside link in the previous
		 * step
		 */
		if(this.handlePreviousOutsideLink(this)) {
			/*
			 * the user was at an outside link so the function
			 * handlePreviousOutsideLink() has taken care of the
			 * rendering of this node
			 */
			return;
		} else if (this.elementText != null) {
			//set the content
			this.content = this.elementText;
		} else if (this.filename != null) {
			//retrieve the content
			if(window.ActiveXObject) {
				this.content = this.element.xml;
			} else {
				this.content = (new XMLSerializer()).serializeToString(this.element);
			};
		} else if(this.content == null) {
			/*
			 * the first time render is called this needs to be set because
			 * it doesn't work in the constructor for some reason. we should
			 * look into that in the future.
			 */
			this.content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
		};
		
		if(contentPanel == null) {
			/*
			 * this will be the default iframe to render in if no contentPanel
			 * is passed
			 */
			this.contentPanel = window.frames["ifrm"];
		} else {
			//retrieve the frame by name (instead of using the iframe element that was passed in)
			this.contentPanel = window.frames[contentPanel.name];
		};
		
		//write the content into the contentPanel, this will render the html in that panel
		this.contentPanel.document.open();
		this.contentPanel.document.write(this.injectBaseRef(this.content));
		this.contentPanel.document.close();
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

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

HtmlNode.prototype.doNothing = function() {
	alert("doNothing");
	window.frames["ifrm"].document.open();
	window.frames["ifrm"].document.write(this.injectBaseRef(this.elementText));
	window.frames["ifrm"].document.close();
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/HtmlNode.js");