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
	this.audioSupported = true;	
}

BlueJNode.prototype.render = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){ //content is available,  proceed with render	
		var content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	
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
		}
		
		if(contentPanel == null) {
			this.contentPanel = window.frames['ifrm'];
		} else {
			this.contentPanel = window.frames[contentPanel.name];
		};
		
		
		//write the content into the contentPanel, this will render the html in that panel
		this.contentPanel.document.open();
		this.contentPanel.document.write(this.injectBaseRef(content));
		this.contentPanel.document.close();
		
		this.projectPath = this.element.getElementsByTagName("projectPath")[0].firstChild.nodeValue;
	} else {
		//content is not available, wait for content loading event
		//to complete, then call render again
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
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