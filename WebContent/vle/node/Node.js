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
	this.className = null;
	this.renderComplete = false;
	
	this.audioReady = false;
	this.audio = null;  // audio associated with this node. currently only supports mps, played via soundmanager: http://www.schillmania.com/projects/soundmanager2/demo/template/
	this.audios = [];
	
	if (nodeType != null) {
		this.type = nodeType;
	}
}

Node.prototype.setType = function(type) {
	this.type = type;
};

Node.prototype.getTitle = function() {
	if (this.title != null) {
		return this.title;
	}
	return this.id;
};

Node.prototype.addChildNode = function(childNode) {
	this.children.push(childNode);
	childNode.parent = this;
};

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
};

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
};

Node.prototype.getNodeAudios = function() {
	return this.audios;
};

// alerts vital information about this node
Node.prototype.alertNodeInfo = function(where) {
	notificationManager.notify('node.js, ' + where + '\nthis.id:' + this.id 
			+ '\nthis.title:' + this.title 
			+ '\nthis.filename:' + this.filename
			+ '\nthis.element:' + this.element, 3);
};

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
};

/**
 * Renders itself to the specified content panel
 */
Node.prototype.render = function(contentpanel) {
	//alert("Node.render called");
};


/*
 * Callback when the node finishes loading in the page. Here, do things like
 * playing the audio that is associated with the step.
 */
Node.prototype.load = function() {
	if (vle.audioManager != null) {
		vle.audioManager.setCurrentNode(this);
	}
};


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
};

/*
 * Returns a string representation of this node that can be saved back into
 * a .profile file
 */
Node.prototype.generateProjectFileString = function() {
	var fileStringSoFar = "<" + this.type + " identifier=\"" + this.id + "\"";
	fileStringSoFar += " title=\""+this.title+"\" class=\"" + this.className + "\">\n";
	fileStringSoFar += "    <ref filename=\""+this.filename+"\" />\n";
	fileStringSoFar += "</" + this.type + ">\n";
	return fileStringSoFar;
};

Node.prototype.getDataXML = function(nodeStates) {
	var dataXML = "";
	for (var i=0; i < nodeStates.length; i++) {
		var state = nodeStates[i];
		dataXML += "<state>" + state.getDataXML() + "</state>";
	}
	return dataXML;
};

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
};

/**
 * Returns the appropriate string node definition for this node
 */
Node.prototype.nodeDefinitionXML = function(){
	if(this.type=='sequence'){
		var xml;
		if (this.getView() == 'normal') {
		    xml = "<sequence identifier=\"" + makeSafe(this.id) + "\"  title=\"" + makeSafe(this.title) + "\">\n";
		} else {
		    xml = "<sequence identifier=\"" + makeSafe(this.id) + "\"  title=\"" + makeSafe(this.title) + "\" view=\""+ makeSafe(this.getView()) + "\">\n";			
		}
		for(var l=0;l<this.children.length;l++){
			xml += this.children[l].nodeReferenceXML();
		};
		xml += "</sequence>\n";
	} else {
		var xml = "<" + this.type + " identifier=\"" + makeSafe(this.id) + "\" title=\"" + makeSafe(this.title) + "\" class=\"" + this.className + "\">\n";
		xml += "\t<ref filename=\"" + this.filename + "\"/>\n";
		if(this.audios.length>0){
			xml += "\t<nodeaudios>\n";
			for(var i=0;i<this.audios.length;i++){
				xml += "\t\t<nodeaudio elementId=\"" +
					this.audios[i].elementId + "\" url=\"" + this.audios[i].url + "\"/>\n";
			};
			xml += "\t</nodeaudios>\n";
		};
		xml += "</" + this.type + ">\n";
	};
	return xml;
};

function makeSafe(text){
	if(text){
		return text.replace(/\&/g, '&amp;');
	} else {
		notificationManager.notify('Did not receive text when generating xml for: node-' + this.type + ' id-' + this.id + ' title-' + this.title, 1);
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
};

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
};

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
};

/**
 * This function is for displaying student work in the ticker.
 * All node types that don't implement this method will inherit
 * this function that just returns null. If null is returned from
 * this method, the ticker will just skip over the node when
 * displaying student data in the ticker.
 */
Node.prototype.getLatestWork = function(vle, dataId) {
	return null;
};

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
};

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
};

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
};

/**
 * Returns whether this node is a sequence node. There is the case
 * where a sequence node does not have any steps in it in which case
 * this function would return the wrong value but a sequence with
 * no steps in it doesn't really make sense anyway.
 * @return whether this node is a sequence node
 */
Node.prototype.isSequence = function() {
	return this.children.length > 0;
};

/**
 * Injects base ref in the head of the html if base-ref is not found, and returns the result
 * @param content
 * @return
 */
Node.prototype.injectBaseRef = function(content) {
	if (content.search(/<base/i) > -1) {
		// no injection needed because base is already in the html
		return content;
	} else {		
		var domain = 'http://' + window.location.toString().split("//")[1].split("/")[0];
		
		if(this.contentBase){
			var baseRefTag = "<base href='" + this.contentBase + "'/>";
		} else {
			return content;
		};
		
		var headPosition = content.indexOf("<head>");
		var newContent = content.substring(0, headPosition + 6);  // all the way up until ...<head>
		newContent += baseRefTag;
		newContent += content.substring(headPosition+6);

		return newContent;
	}
};

function NodeAudio(id, url, elementId, textContent, md5url) {
	notificationManager.notify('id: ' + id + ",url: " + url + ",elementId: " + elementId, 4);
	this.id = id;
	this.url = url;
	this.elementId = elementId;    // VALUE in <p audio=VALUE .../> or <div audio=VALUE ../>
	this.elementTextContent = textContent;
	this.md5url = md5url;
	this.audio = null;
	this.backupAudio = null;  // backup audio, ie NoAvailableAudio.mp3 or MD5
}

NodeAudio.prototype.play = function() {
	this.audio.play();
};

Node.prototype.prepareAudio = function() {
	if (this.audioReady) {
		notificationManager.notify('no need to create audios', 4);
		return;
	}
	
	// create node audios for this node
	//var nodeAudioElements = currElement.getElementsByTagName('nodeaudio');	

	// first parse the document and get the elements that have audio attribute
	var nodeAudioElements = getElementsByAttribute("audio", null);
	notificationManager.notify('nodeAudioElements.length:' + nodeAudioElements.size(), 4);

	// go through each audio element and create NodeAudio objects
	for (var k=0; k < nodeAudioElements.size(); k++) {
		var audioElement = nodeAudioElements.item(k);
		var audioElementValue = audioElement.getAttribute('audio');
		var audioElementAudioId = this.id + "." + audioElementValue;
		notificationManager.notify('attribute:' + audioElementAudioId, 4);

		var audioBaseUrl = "";
	       if (this.contentBase != null) {
			audioBaseUrl += this.contentBase + "/";
		}
		notificationManager.notify('contentBaseUrl:' + this.contentBaseUrl,4);
		notificationManager.notify('audioBaseUrl0:' + audioBaseUrl,4);

	    // ignore contentBaseUrl if audioBaseUrl is absolute, ie, starts with http://...
	    //if (nodeAudioElements[k].getAttribute("url").search('http:') > -1) {
			//audioBaseUrl = "";
		//}  commented out...do we want to let users specify absolute audio urls in the future?
		
		// ignore contentBaseUrl if in author mode.
		if (currentProjectPath) {
			audioBaseUrl = "";
		}
		notificationManager.notify('audioBaseUrl1:' + audioBaseUrl,4);
		var nodeAudioUrl = audioBaseUrl + vle.project.audioLocation + "/" + audioElementAudioId + ".mp3";
		notificationManager.notify('nodeAudioUrl2:' + nodeAudioUrl,4);

		var elementAudioValue = audioElementValue;
		var nodeAudioId = audioElementAudioId;
		var textContent = audioElement.get('textContent');
		var elementTextContentMD5 = hex_md5(textContent);  // MD5(this.elementTextContent);
		var md5url = audioBaseUrl + vle.project.audioLocation + "/audio_" + elementTextContentMD5 + ".mp3";
		var nodeAudio = new NodeAudio(nodeAudioId, nodeAudioUrl, elementAudioValue, textContent, md5url);

		// add the NodeAudio object to this node
		this.audios.push(nodeAudio);
		
		// create audio files only if in authoring mode
		if (currentProjectPath) {
			this.createAudioFiles();
		}
	}
	this.audioReady = true;
	notificationManager.notify('prepareAudio function end', 4);
};

/**
 * Creates audio files for this node. Only called in Author-mode
 * Assumed that this.audios has already been populated by Node.prepareAudio function.
 */
Node.prototype.createAudioFiles = function() {
	notificationManager.notify('currentProjectPath:' + currentProjectPath, 4);
	var createdCount = 0;
	notificationManager.notify('nodeaudio.length:' + this.audios.length, 4);
	for (var a=0; a<this.audios.length;a++) {
		notificationManager.notify('audio url:' + this.audios[a].url, 4);
		var elementId = this.audios[a].elementId;

		// only invoke updateAudioFiles if elementId exists and is ID'ed to 
		// actual element in the content.
		if (elementId && elementId != null) {
			var textContent = this.audios[a].elementTextContent;
			notificationManager.notify('creating audio file at url: ' + this.audios[a].url
					+ '\nelementId: ' + elementId + '\ncontent: ' + textContent, 4);

			var callback = {
					success: function(o){
				if (o.responseText == 'success') {
					createdCount++;
				} else if (o.responseText == 'audioAlreadyExists') {
				} else {
					notificationManager.notify('could not create audio. Is your filesystem write-able? Does it have the right directories, ie audio, where the audio will go?', 3);
				};
			},
			failure: function(o){
				notificationManager.notify('could not create audio', 3);
			},
			scope: this
			};
			YAHOO.util.Connect.asyncRequest('POST', 'filemanager.html', callback, 'command=updateAudioFiles&param1=' + currentProjectPath + '&param2=' + this.audios[a].md5url + '&param3=' + textContent);				
		}

	}
	notificationManager.notify('number of audio files created: ' + createdCount, 4);	
}


//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/Node.js");