/*
 * Node
 */

function Node(nodeType, connectionManager) {
	this.contentLoaded = false;
	this.connectionManager = connectionManager;
	this.id = null;
	this.parent = null;
	this.children = [];   // children Nodes. If children is empty, it means that this is a leaf node
	this.element = null;   // element in XML
	this.elementText = null;   // element in Text
	this.type = null;
	this.title = null;
	this.nodeSessionEndedEvent = new YAHOO.util.CustomEvent("nodeSessionEndedEvent");
	this.filename = null;
	this.class = null;
	
	this.audio = null;  // audio associated with this node. currently only supports mps, played via soundmanager: http://www.schillmania.com/projects/soundmanager2/demo/template/
	this.audios = [];
	
	if (nodeType != null) {
		this.type = nodeType;
	}
}

Node.prototype.setType = function(type) {
	this.type = type;
}

Node.prototype.getTitle = function() {
	if (this.title != null) {
		return this.title;
	}
	return this.id;
}

Node.prototype.addChildNode = function(childNode) {
	this.children.push(childNode);
	childNode.parent = this;
}

Node.prototype.getNodeById = function(nodeId) {
	if (this.id == nodeId) {
		return this;
	} else if (this.children.length == 0) {
		return null;
	} else {
		var soFar = false;
		for (var i=0; i < this.children.length; i++) {
			soFar = soFar || this.children[i].getNodeById(nodeId);
		}
		return soFar;
	}
}

/**
 * Retrieves all the leaf nodes below this node, such as its children
 * or grandchildren, or great grandchildren, etc.
 * @return all the leaf nodes below this node, or itself if this is
 * 		a leaf node
 */
Node.prototype.getLeafNodeIds = function(arr) {	
	if(this.children.length==0 && arr.indexOf(this.id)=='-1'){ //it is a leaf node and does not already exist in array
		arr.push(this.id);
	} else { //must be a sequence node
		for(var i=0;i<this.children.length;i++){
			this.children[i].getLeafNodeIds(arr);
		};
	};
};

/**
 * Sets this node as the currentNode. Perform functions like
 * loading audio for the node.
 */
Node.prototype.setCurrentNode = function() {
	if (vle.audioManager != null) {
		vle.audioManager.setCurrentNode(this);
	}
}

Node.prototype.getNodeAudios = function() {
	return this.audios;
}

// alerts vital information about this node
Node.prototype.alertNodeInfo = function(where) {
	notificationManager.notify('node.js, ' + where + '\nthis.id:' + this.id 
			+ '\nthis.title:' + this.title 
			+ '\nthis.filename:' + this.filename
			+ '\nthis.element:' + this.element, 3);
}

/**
 * Play the audio that is right after the specified elementId
 * @return
 */
Node.prototype.playAudioNextAudio = function(elementId) {
	for (var i=0; i < this.audios.length; i++) {
		var audio = this.audios[i];
		if (audio.elementId == elementId) {
			this.audios[i+1].play();
			return;
		}
	}
	notificationManager.notify('error: no audio left to play', 2);
}

/**
 * Renders itself to the specified content panel
 */
Node.prototype.render = function(contentpanel) {
	//alert("Node.render called");
}



Node.prototype.load = function() {
}


Node.prototype.getShowAllWorkHtml = function(vle){
	var showAllWorkHtmlSoFar = "";
    var nodeVisitArray = vle.state.getNodeVisitsByNodeId(this.id);
    if (nodeVisitArray.length > 0) {
        var states = [];
        var latestNodeVisit = nodeVisitArray[nodeVisitArray.length -1];
        for (var i = 0; i < nodeVisitArray.length; i++) {
            var nodeVisit = nodeVisitArray[i];
            for (var j = 0; j < nodeVisit.nodeStates.length; j++) {
                states.push(nodeVisit.nodeStates[j]);
            }
        }
        var latestState = states[states.length - 1];
        showAllWorkHtmlSoFar += "You have last visited this page";
        
        if(latestNodeVisit!=null){
        	showAllWorkHtmlSoFar += " beginning on " + latestNodeVisit.visitStartTime;
        	if(latestNodeVisit.visitEndTime==null){
        		showAllWorkHtmlSoFar += " with no end time recorded.";
        	} else {
        		showAllWorkHtmlSoFar += " ending on " + latestNodeVisit.visitEndTime;
        	};
        };
        
        if(latestState!=null){
        	showAllWorkHtmlSoFar += '<br><br>Your work during this visit: ' + this.translateStudentWork(latestState.getStudentWork());
        };
    }
    else {
        showAllWorkHtmlSoFar += "You have NOT visited this page yet.";
    }
    
    for (var i = 0; i < this.children.length; i++) {
        showAllWorkHtmlSoFar += this.children[i].getShowAllWorkHtml();
    }
    return showAllWorkHtmlSoFar;
}

/*
 * Returns a string representation of this node that can be saved back into
 * a .profile file
 */
Node.prototype.generateProjectFileString = function() {
	var fileStringSoFar = "<" + this.type + " identifier=\"" + this.id + "\"";
	fileStringSoFar += " title=\""+this.title+"\" class=\"" + this.class + "\">\n";
	fileStringSoFar += "    <ref filename=\""+this.filename+"\" />\n";
	fileStringSoFar += "</" + this.type + ">\n";
	return fileStringSoFar;
}

Node.prototype.getDataXML = function(nodeStates) {
	var dataXML = "";
	for (var i=0; i < nodeStates.length; i++) {
		var state = nodeStates[i];
		dataXML += "<state>" + state.getDataXML() + "</state>";
	}
	return dataXML;
}

/**
 * Converts an xml object of a node and makes a real Node object
 * @param nodeXML an xml object of a node
 * @return a real Node object depending on the type specified in
 * 		the xml object
 */
Node.prototype.parseDataXML = function(nodeXML) {
	var nodeType = nodeXML.getElementsByTagName("type")[0].textContent;
	var id = nodeXML.getElementsByTagName("id")[0].textContent;
	//alert('nodetype, id:' + nodeType + "," + id);

	//create the correct type of node
	var nodeObject = NodeFactory.createNode(nodeType);
	//alert('nodeObject: ' + nodeObject + ", type:" + nodeObject.type);
	nodeObject.id = id;
	//alert('nodeObject.id:' + nodeObject.id);
	return nodeObject;
}

/**
 * Returns the appropriate string node definition for this node
 */
Node.prototype.nodeDefinitionXML = function(){
	if(this.type=='sequence'){
		var xml = "<sequence identifier=\"" + makeSafe(this.id) + "\"  title=\"" + makeSafe(this.title) + "\">\n";
		for(var l=0;l<this.children.length;l++){
			xml += this.children[l].nodeReferenceXML();
		};
		xml += "</sequence>\n";
	} else {
		var xml = "<" + this.type + " identifier=\"" + makeSafe(this.id) + "\" title=\"" + makeSafe(this.title) + "\" class=\"" + this.class + "\">\n";
		xml += "\t<ref filename=\"" + this.filename + "\"/>\n";
		xml += "</" + this.type + ">\n";
	};
	return xml;
};

function makeSafe(text){
	if(text){
		return text.replace(/\&/g, '&amp;');
	} else {
		return '';
	};
};

/**
 * Returns the appropriate string node reference for this node
 */
Node.prototype.nodeReferenceXML = function(){
	if(this.type=='sequence'){
		return "<sequence-ref ref=\"" + makeSafe(this.id) + "\"/>\n";
	} else {
		return "<node-ref ref=\"" + makeSafe(this.id) + "\"/>\n";
	};
};

/**
 * Creates an xml string representation of this node so that it
 * can be saved in the authoring tool.
 * @param node a real Node object
 * @return xml string representation of the node
 */
Node.prototype.exportNode = function(node) {
	var exportXML = "";

	exportXML += this.exportNodeHeader(node);
	
	if(this.children.length != 0) {
		for(var x=0; x<this.children.length; x++) {
			exportXML += this.children[x].exportNode();
		}
	} else {
		//this node is a leaf node
	}
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

/**
 * Returns the opening node tag
 * @param node the node we are creating xml string for
 * @return xml string e.g.
 * 
 * <HtmlNode id='0:0:0' title='Introduction'>
 */
Node.prototype.exportNodeHeader = function(node) {
	var exportXML = "";

	exportXML += "<" + this.type;
	exportXML += " id=\"" + this.id + "\"";
	exportXML += " title=\"" + this.title + "\"";
	exportXML += ">";
	
	return exportXML;
}

/**
 * Returns the closing node tag
 * @param node the node we are creating xml string for
 * @return xml string e.g.
 * 
 * </HtmlNode>
 */
Node.prototype.exportNodeFooter = function(node) {
	var exportXML = "";
	
	exportXML += "</" + this.type + ">";
	
	return exportXML;
}

/**
 * This function is for displaying student work in the ticker.
 * All node types that don't implement this method will inherit
 * this function that just returns null. If null is returned from
 * this method, the ticker will just skip over the node when
 * displaying student data in the ticker.
 */
Node.prototype.getLatestWork = function(vle, dataId) {
	return null;
}

/**
 * for nodes that are loaded from project files, retrieves the file
 * and sets this.element = xml
 */
Node.prototype.retrieveFile = function(){
	if(this.filename!=null){
		if(this.connectionManager==null && vle){
			//set event to fire and set this node's variable when content is loaded
			var setLoaded = function(type, args, obj){
				if(obj && obj.id==this.id){
					obj.contentLoaded = true;
				};
			};
			vle.eventManager.addEvent(this, 'nodeLoadingContentComplete_' + this.id);
			vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, setLoaded, this);
			
			//retrieve content
			this.connectionManager = vle.connectionManager;
			if (this.filename.search(/http:/) > -1 || this.filename.substring(0,1)=='/') {
				this.connectionManager.request('GET', 1, this.filename, null, this.processRetrieveFileResponse, this);
		    } else {
		    	this.connectionManager.request('POST', 1, 'filemanager.html', {command: 'retrieveFile', param1: currentProjectPath + pathSeparator + this.filename}, this.processRetrieveFileResponse, this);
		    };
		};
	} else {
		notificationManager.notify('No filename is specified for node with id: ' + this.id + ' in the node, unable to retrieve content for this node.', 3);
	};
};

/**
 * Handles the response from the call to connectionManager
 */
Node.prototype.processRetrieveFileResponse = function(responseText, responseXML, node){
	if(!responseXML){
		responseXML = loadXMLString(responseText);
	};
	node.xmlDoc = responseXML;
	node.element = responseXML;
	node.elementText = responseText;
	vle.eventManager.fire('nodeLoadingContentComplete_' + node.id);
};

/**
 * Returns a string of this.element
 */
Node.prototype.getXMLString = function(){
	var xmlString;
	if(window.ActiveXObject) {
		xmlString = this.element.xml;
	} else {
		xmlString = (new XMLSerializer()).serializeToString(this.element);
	};
	return xmlString;
};

/**
 * This is the default implementation of getPrompt which just returns
 * an empty string. Nodes that actually utilize a prompt will implement
 * this themselves
 * @return an empty string since this is the parent implementation
 */
Node.prototype.getPrompt = function() {
	return "";
}

/**
 * Translates students work into human readable form. Some nodes,
 * such as mc and mccb require translation from identifiers to 
 * values, while other nodes do not. Each node will implement
 * their own translateStudentWork() function and perform translation
 * if necessary. This is just a dummy parent implementation.
 * @param studentWork the student's work, could be a string or array
 * @return a string of the student's work in human readable form.
 */
Node.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
}

/**
 * Get the view style if the node is a sequence. If this node
 * is a sequence and no view style is defined, the default will
 * be the 'normal' view style.
 * @return the view style of the sequence or null if this
 * 		node is not a sequence
 */
Node.prototype.getView = function() {
	/*
	 * check that this node is a sequence.
	 */
	if(this.isSequence()) {
		if(this.element.getAttribute('view') == null) {
			//return the default view style if none was specified
			return 'normal';
		} else {
			//return the view style for the sequence
			return this.element.getAttribute('view');
		}
	} else {
		//this node is not a sequence so we will return null
		return null;
	}
}

/**
 * Returns whether this node is a sequence node. There is the case
 * where a sequence node does not have any steps in it in which case
 * this function would return the wrong value but a sequence with
 * no steps in it doesn't really make sense anyway.
 * @return whether this node is a sequence node
 */
Node.prototype.isSequence = function() {
	return this.children.length > 0;
}

function NodeAudio(id, url, elementId) {
	this.id = id;
	this.url = url;
	this.elementId = elementId;
	this.audio = null;
}

NodeAudio.prototype.play = function() {
	this.audio.play();
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/Node.js");