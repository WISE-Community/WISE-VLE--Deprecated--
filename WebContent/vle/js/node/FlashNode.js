/*
 * FlashNode
 * interfaces VLE and Flash via javascript
 * Flash can invoke javascript and javascript can invoke Flash via specific interfaces
 * see here for interface API: link_goes_here
 */

FlashNode.prototype = new Node();
FlashNode.prototype.constructor = FlashNode;
FlashNode.prototype.parent = Node.prototype;
function FlashNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
}

FlashNode.prototype.setContent = function(content) {
	//update the content attribute that contains the html
	this.content = content;
}


FlashNode.prototype.render = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	if (this.elementText != null) {
		this.content = this.elementText;
		this.writeHTML(window.frames["ifrm"].document);
		return;
	} else if (this.filename != null) {
	
		if(window.ActiveXObject) {
			this.content = this.element.xml;
		} else {
			this.content = (new XMLSerializer()).serializeToString(this.element);
		};
		
		this.writeHTML(window.frames["ifrm"].document);
		return;
	} else if(this.content == null) {
		this.content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	}
	
	if(contentPanel == null) {
		contentPanel = window.frames["ifrm"];
	}
	
	if (contentPanel.document) {
		this.writeHTML(contentPanel.document);
	} else {
		this.writeHTML(window.frames["ifrm"].document);
	}
};

FlashNode.prototype.writeHTML = function(doc){
	this.replaceVars(doc);
	doc.open();
	doc.write(this.content);
	doc.close();
};

FlashNode.prototype.replaceVars = function(){
	var objSrchStrStart = '<param name="movie" value="';
	var objSrchStrEnd = '"/>';
	var base = vle.project.contentBaseUrl;
	if(base){
		base = base + '/';
	} else {
		base = "";
	};
	
	var obs = this.content.match(/<object.*>(.|\n|\r)*<\/object.*>/i);
	for(var z=0;z<obs.length;z++){
		if(obs[z] && obs[z]!="" && obs[z]!='\n' && obs[z]!='\r' && obs[z]!='\t'){
			var startIndex = obs[z].indexOf(objSrchStrStart) + objSrchStrStart.length;
			var endIndex = obs[z].indexOf('"', startIndex);
			var filename = obs[z].substring(startIndex, endIndex);
			var exp = new RegExp(filename, 'g');
			this.content = this.content.replace(exp, base + filename);
		};
	};
};

FlashNode.prototype.load = function() {
	this.createFlashJSInterface();
		
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

FlashNode.prototype.createFlashJSInterface = function(){
	window.frames["ifrm"].showJsAlert = function(){alert('calling js from flash');};
	window.frames["ifrm"].callToFlash = function(flashObjId){
		if(navigator.appName.indexOf("Microsoft")!=-1){
			window.frames["ifrm"].window[flashObjId].callToFlash();
		} else {
			window.frames["ifrm"].document[flashObjId].callToFlash();
		};
	};
};