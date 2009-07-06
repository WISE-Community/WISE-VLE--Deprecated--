/*
 * BlueJNode is a child of outsideurl at the moment
 */

BlueJNode.prototype = new Node();
BlueJNode.prototype.constructor = BlueJNode;
BlueJNode.prototype.parent = Node.prototype;
function BlueJNode(nodeType, connectionManager) {
	this.connectionManager = connectionManager;
	this.type = "BlueJNode";
	this.projectPath = "";
   this.contentBase;
}

BlueJNode.prototype.render = function(contentPanel) {
	var content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;

	if(contentPanel == null) {
		window.frames["ifrm"].document.open();
		window.frames["ifrm"].document.write(this.injectBaseRef(content));
		window.frames["ifrm"].document.close();
	} else {
		contentPanel.document.open();
		contentPanel.document.write(this.injectBaseRef(content));
		contentPanel.document.close();
	}
	
	
	//window.frames["ifrm"].document.open();
	//window.frames["ifrm"].location = "js/node/outsideurl/outsideurl.html";
	//window.frames["ifrm"].document.close();
	
	this.projectPath = this.element.getElementsByTagName("projectPath")[0].firstChild.nodeValue;
}

/*
BlueJNode.prototype.load = function() {
	var url = this.element.getElementsByTagName("url")[0].firstChild.nodeValue;
	window.frames["ifrm"].loadUrl(url);
	document.getElementById('topStepTitle').innerHTML = this.title;
}
*/

BlueJNode.prototype.getDataXML = function() {
	return this.projectPath;
}

BlueJNode.prototype.getDataXML = function(nodeStates) {
	return this.projectPath;
}

/**
 * This function is called when the vle is parsing the student's
 * data to retrieve previous work the student has submitted.
 * The array we return will just have one element in it which
 * will be the name of the project.
 * @param nodeStatesXML the node states xml within the node visit
 * 		for the current node visit we are parsing
 * @return an array with the name of the project in it
 */
BlueJNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesArrayObject = new Array();
	if(nodeStatesXML.firstChild != null) {
		statesArrayObject.push(nodeStatesXML.firstChild.nodeValue);
		
		//set the project path which is inside the nodeStates tag
		this.projectPath = nodeStatesXML.firstChild.nodeValue;
	}
	return statesArrayObject;
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/BlueJNode.js");