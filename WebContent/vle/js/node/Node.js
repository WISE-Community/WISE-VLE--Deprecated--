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
	document.getElementById('topStepTitle').innerHTML = this.title;
}


Node.prototype.getShowAllWorkHtml = function(){
    var showAllWorkHtmlSoFar = "<h4>" + this.title + "</h4>";
    var nodeVisitArray = vle.state.getNodeVisitsByNodeId(this.id);
    
    if (nodeVisitArray.length > 0) {
        var states = [];
        for (var i = 0; i < nodeVisitArray.length; i++) {
            var nodeVisit = nodeVisitArray[i];
            for (var j = 0; j < nodeVisit.nodeStates.length; j++) {
                states.push(nodeVisit.nodeStates[j]);
            }
        }
        var latestState = states[states.length - 1];
        showAllWorkHtmlSoFar += "(checkmark goes here!) You have visited this page.";
    }
    else {
        showAllWorkHtmlSoFar += "You have NOT visited this page yet.";
    }
    
    for (var i = 0; i < this.children.length; i++) {
        showAllWorkHtmlSoFar += this.children[i].getShowAllWorkHtml();
    }
    return showAllWorkHtmlSoFar;
}

Node.prototype.getDataXML = function(nodeStates) {
	//alert(2 + ": " + nodeStates);
	var dataXML = "";
	for (var i=0; i < nodeStates.length; i++) {
		var state = nodeStates[i];
		dataXML += "<state>" + state.getDataXML() + "</state>";
	}
	return dataXML;
}

Node.prototype.parseDataXML = function(nodeXML) {
	var nodeType = nodeXML.getElementsByTagName("type");
	var nodeObject = new Node(nodeType);
	
	return nodeObject;
}