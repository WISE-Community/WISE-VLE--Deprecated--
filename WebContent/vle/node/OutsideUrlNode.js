/*
 * OutsideUrlNode
 */

OutsideUrlNode.prototype = new Node();
OutsideUrlNode.prototype.constructor = OutsideUrlNode;
OutsideUrlNode.prototype.parent = Node.prototype;
function OutsideUrlNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
}

OutsideUrlNode.prototype.render = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, ouNode){			
			ouNode.contentPanel.document.open();
			ouNode.contentPanel.document.write(injectVleUrl(text));
			ouNode.contentPanel.document.close();
			if(ouNode.contentPanel.name!='ifrm'){
				ouNode.contentPanel.renderComplete = function(){
					ouNode.load();
				};
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/outsideurl/outsideurl.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

OutsideUrlNode.prototype.load = function(contentPanel) {
	if(this.element.getElementsByTagName("url")[0].firstChild){
		var url = this.element.getElementsByTagName("url")[0].firstChild.nodeValue;
	} else {
		var url = "";
	};
	
	this.contentPanel.loadUrl(url);
};


OutsideUrlNode.prototype.getDataXML = function(nodeStates) {
	return OutsideUrlNode.prototype.parent.getDataXML(nodeStates);
}


OutsideUrlNode.prototype.parseDataXML = function(nodeStatesXML) {
	return new Array();
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

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/OutsideUrlNode.js");