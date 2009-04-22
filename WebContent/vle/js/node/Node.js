/*
 * Node
 */

function Node(nodeType) {
	this.id = null;
	this.parent = null;
	this.children = [];   // children Nodes. If children is empty, it means that this is a leaf node
	this.element = null;
	this.type = null;
	this.title = null;
	this.nodeSessionEndedEvent = new YAHOO.util.CustomEvent("nodeSessionEndedEvent");
	this.filename = null;
	
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
//	var nodeIdArray = new Array();
//	if(this.children.length == 0) {
//		//if this is a leaf node, add itself to the array of leaf nodes
//		nodeIdArray.push(this.id);
//	} else {
//		for (var i=0; i < this.children.length; i++) {
//			//loop through this node's children to search for leaf nodes
//			nodeIdArray = nodeIdArray.concat(this.children[i].getLeafNodeIds());
//		}
//	}
//	
//	return nodeIdArray;
//}

/**
 * Sets this node as the currentNode. Perform functions like
 * loading audio for the node.
 */
Node.prototype.setCurrentNode = function() {
	if (vle.audioManager != null) {
		vle.audioManager.setCurrentNode(this);
	}
}

Node.prototype.getNodeAudioElements = function() {
	var nodeAudioElements = this.element.getElementsByTagName('nodeaudio');
	return nodeAudioElements;
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
	alert('error: no audio left to play');
}

/**
 * Renders itself to the specified content panel
 */
Node.prototype.render = function(contentpanel) {
	//alert("Node.render called");
}



Node.prototype.load = function() {
	//alert("Node.load called");
	//document.getElementById('topStepTitle').innerHTML = this.title;
	this.setTopStepTitle();
}

Node.prototype.setTopStepTitle = function() {
	if(document.getElementById('topStepTitle') != null) {
		document.getElementById('topStepTitle').innerHTML = this.title;
	}
}


Node.prototype.getShowAllWorkHtml = function(){
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
        	showAllWorkHtmlSoFar += '<br><br>Your work during this visit: ' + latestState.response;
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
	fileStringSoFar += " title=\""+this.title+"\">\n";
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
	alert('nodetype, id:' + nodeType + "," + id);

	//create the correct type of node
	var nodeObject = NodeFactory.createNode(nodeType);
	alert('nodeObject: ' + nodeObject + ", type:" + nodeObject.type);
	nodeObject.id = id;
	alert('nodeObject.id:' + nodeObject.id);
	return nodeObject;
}

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
		var callback = {
			success:function(o){
				if(o.responseXML){
					this.element = o.responseXML;
				} else {
					if(loadXMLDocFromString){
						var anotherTry = loadXMLDocFromString(o.responseText);
						if(anotherTry){
							this.element = anotherTry;
						} else {
							alert('possibly mal-formed xml, unable to load from file');
						};
					};
				};
			},
			failure:function(o){ alert('unable to retrieve file:' + this.filename); alert(window.location);},
			scope:this
		};
		
		YAHOO.util.Connect.asyncRequest('POST', '../../filemanager.html', callback, 'command=retrieveFile&param1=' + currentProjectName + '&param2=' + this.filename);
	} else {
		alert('no file is specified, unable to retrieve data');
	};
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