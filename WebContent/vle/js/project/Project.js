var	htmlPageTypes = new Array("introduction", "reading", "video", "example", "display");
var qtiAssessmentPageTypes = new Array("openresponse");

var acceptedTagNames = new Array("node", "HtmlNode", "MultipleChoiceNode", "sequence", "FillinNode", "MatchSequenceNode", "NoteNode", "JournalEntryNode", "OutsideUrlNode", "BrainstormNode");

function NodeFactory() {
	this.htmlPageTypes = new Array("introduction", "reading", "video", "example", "display");
	this.qtiAssessmentPageTypes = new Array("openresponse");
}

NodeFactory.createNode = function (element) {
	var nodeName;
	if(element.nodeName){
		nodeName = element.nodeName;	//create from element
	} else {
		nodeName = element;				//create from string
		alert('Project.js, nodeName:' + nodeName);
	};
	if (acceptedTagNames.indexOf(nodeName) > -1) {
		if (nodeName == "HtmlNode") {
			//alert('htmlnode');
			return new HtmlNode("HtmlNode");
		} else if (nodeName == "MultipleChoiceNode"){
			//alert('mcnode');
			return new MultipleChoiceNode("MultipleChoiceNode");
		} else if(nodeName == 'FillinNode'){
			return new FillinNode('FillinNode');
		} else if (nodeName == 'NoteNode'){
			return new NoteNode('NoteNode');
		} else if (nodeName == 'JournalEntryNode'){
			return new JournalEntryNode('JournalEntryNode');
		} else if (nodeName == 'MatchSequenceNode'){
			return new MatchSequenceNode('MatchSequenceNode');
		} else if (nodeName == 'OutsideUrlNode'){
			return new OutsideUrlNode('OutsideUrlNode');
		} else if (nodeName == 'BrainstormNode'){
			return new BrainstormNode('BrainstormNode');
		} else if (nodeName == "sequence") {
			//alert('sequence node');
			var sequenceNode = new Node("sequence");
			sequenceNode.id = element.getAttribute("identifier");
			return sequenceNode;
		} else {
			return new Node();
		}
	}
}

function Project(xmlDoc, contentBaseUrl) {
	this.xmlDoc = xmlDoc;
	this.contentBaseUrl = contentBaseUrl;
	this.allLeafNodes = [];
	this.allSequenceNodes = [];
	this.lazyLoading = false;
	
	//alert('project constructor' + this.xmlDoc.getElementsByTagName("sequence").length);
	//alert('1:' + this.xmlDoc.firstChild.nodeName);
	if (this.xmlDoc.getElementsByTagName("sequences").length > 0) {
		// this is a Learning Design-inspired project <repos>...</repos><sequence>...</sequence>
		//alert('LD');
		this.rootNode = this.generateNodeFromProjectFile(this.xmlDoc);
	} else {
		// this is a node project <node><node></node></node>
		//alert('non-LD');
		this.rootNode = this.generateNode(this.xmlDoc.firstChild);
	} 
}

Project.prototype.createNewNode = function(nodeType, filename){
	var node = NodeFactory.createNode(nodeType);
	node.filename = this.makeFileName(filename);
	node.id = this.generateUniqueId();
	node.title = 'default title';
	node.element = null;
	this.allLeafNodes.push(node);
	return node;
};

Project.prototype.generateUniqueId = function(){
	var id = 0;
	while(true){
		var node = this.getNodeById(id);
		if(node){
			id++;
		} else {
			return id;
		};
	};
};

Project.prototype.getNodeById = function(nodeId){
	for(var t=0;t<this.allLeafNodes.length;t++){
		if(this.allLeafNodes[t].id==nodeId){
			return this.allLeafNodes[t];
		};
	};
	for(var p=0;p<this.allSequenceNodes.length;p++){
		if(this.allSequenceNodes[p].id==nodeId){
			return this.allSequenceNodes[p];
		};
	};
	return null;
};

Project.prototype.generateNode = function(element) {
	var thisNode = NodeFactory.createNode(element);
	if (thisNode) {
		thisNode.element = element;
		thisNode.id = element.getAttribute('id');
		var children = element.childNodes;
		for (var i = 0; i < children.length; i++) {
			if (acceptedTagNames.indexOf(children[i].nodeName) > -1) {
				thisNode.addChildNode(this.generateNode(children[i]));
			}
		}
		return thisNode;
	}
}

Project.prototype.generateNodeFromProjectFile = function(xmlDoc) {
	// go through the nodes in <repos>...</repos> tag and create Nodes for each.
	// put them in allNodes array as we go.
	this.allLeafNodes = [];
	var nodeElements = xmlDoc.getElementsByTagName("nodes")[0].childNodes;
	for (var i=0; i < nodeElements.length; i++) {
		var element = nodeElements[i];
		if (element.nodeName != "#text")  {
			var thisNode = NodeFactory.createNode(element);
			thisNode.title = element.getAttribute('title');
			thisNode.id = element.getAttribute('identifier');
			thisNode.filename = this.makeFileName(element.getElementsByTagName('ref')[0].getAttribute("filename"));
			thisNode.element = element;
			this.allLeafNodes.push(thisNode);
			if(this.lazyLoading){ //load as needed
				if(thisNode.type=='NoteNode'){//this one always needs it now
					thisNode.retrieveFile();
				};
			} else { //load it now
				thisNode.retrieveFile();
			};
		}
	}
	
	//return this.generateSequence(xmlDoc.getElementsByTagName("sequence")[0]);
	return this.generateSequences(xmlDoc);
}

Project.prototype.makeFileName = function(filename) {
	if (this.contentBaseUrl != null) {
		return this.contentBaseUrl + "/" + filename;
	}
	return filename;
}
/**
 * Given the xml, generates all sequence nodes and returns the
 * sequence node specified as the start point
 */
Project.prototype.generateSequences = function(xmlDoc){
	this.allSequenceNodes = [];
	var startingSequence = null;
	
	//generate the sequence nodes
	var sequences = xmlDoc.getElementsByTagName('sequence');
	for(var e=0;e<sequences.length;e++){
		var sequenceNode = NodeFactory.createNode(sequences[e]);
		sequenceNode.element = sequences[e];
		this.allSequenceNodes.push(sequenceNode);
	};
	
	//get startingSequence
	if(xmlDoc.getElementsByTagName('startpoint')[0].childNodes.length>0){
		var startingSequence = this.getNodeById(xmlDoc.getElementsByTagName('startpoint')[0].getElementsByTagName('sequence-ref')[0].getAttribute('ref'));
	};
		
	//validate that there are no loops
	if(startingSequence){
		for(var s=0;s<this.allSequenceNodes.length;s++){
			var stack = [];
			if(this.validateNoLoops(this.allSequenceNodes[s].id, stack, 'file')){
				//All OK, add children to sequence
				this.populateSequences(this.allSequenceNodes[s].id);
			} else {
				alert('Please check your sequence references. Infinite loop discovered.');
				return null;
			};
		};
		return startingSequence;
	} else {
		alert('No start sequence specified in project, this can be changed in the authoring tool');
		return;
	};
};

/**
 * Given the sequence id and stack, returns true if there are
 * no infinite loops within the given start sequence, otherwise returns false
 */
Project.prototype.validateNoLoops = function(id, stack, from){
	if(stack.indexOf(id)==-1){ //id not found in stack - continue checking
		var childrenIds = this.getChildrenSequenceIds(id, from);
		if(childrenIds.length>0){ //sequence has 1 or more sequences as children - continue checking
			stack.push(id);
			for(var b=0;b<childrenIds.length;b++){ // check children
				if(!this.validateNoLoops(childrenIds[b], stack)){
					return false; //found loop or duplicate id
				};
			};
			stack.pop(id); //children OK
			return true;
		} else { // no children ids to check - this is last sequence node so no loops or duplicates
			return true;
		};
	} else { //id found in stack, infinite loop or duplicate id
		return false;
	};
};

/**
 * Given the a sequence Id, populates All Children nodes
 */
Project.prototype.populateSequences = function(id){
	var sequence = this.getNodeById(id);
	var children = sequence.element.childNodes;
	for(var j=0;j<children.length;j++){
		if(children[j].nodeName!='#text'){
			var childNode = this.getNodeById(children[j].getAttribute('ref'));
			sequence.children.push(childNode);
		};
	};
};

/**
 * Given a sequence ID and location from (file or project), returns an 
 * array of ids for any children sequences
 */
Project.prototype.getChildrenSequenceIds = function(id, from){
	var sequence = this.getNodeById(id);
	var childrenIds = [];
	
	if(from=='file'){
		var refs = sequence.element.getElementsByTagName('sequence-ref');
		
		for(var e=0;e<refs.length;e++){
			childrenIds.push(refs[e].getAttribute('ref'));
		};
	} else {
		var children = sequence.children;
		
		for(var e=0;e<children.length;e++){
			if(children[e].type=='sequence'){
				childrenIds.push(children[e].id);
			};
		};
	};
	
	return childrenIds;
};

/*
 * updates the sequence and updates the node.
 * param sequenceArray is an array of references to leaf nodes
 */
Project.prototype.updateSequence = function(sequenceArray) {
	var sequenceNode = new Node("sequence");
	sequenceNode.id = this.rootNode.id;
	for (var i=0; i < sequenceArray.length; i++) {
		var referencedNode = findNodeById(this.allLeafNodes, sequenceArray[i]);
		sequenceNode.addChildNode(referencedNode);
	}
	this.rootNode = sequenceNode;
	this.allSequenceNodes[0] = sequenceNode;
}

/*
 * Returns a string that can be saved back into a .project file
 */
Project.prototype.generateProjectFileString = function() {
	var fileStringSoFar = "<project>\n";
	// print out all of the nodes
	fileStringSoFar += "<nodes>\n";
	for (var i=0; i < this.allLeafNodes.length; i++) {
		var currentNode = this.allLeafNodes[i];
		fileStringSoFar += currentNode.generateProjectFileString();
	}
	fileStringSoFar += "</nodes>\n";
	
	// print out the sequence
	if(this.allSequenceNodes.length>0){
		fileStringSoFar += this.generateSequenceFileString(this.rootNode, 0);
	};
	
	fileStringSoFar += "</project>";
	return fileStringSoFar;
}

Project.prototype.generateSequenceFileString = function(node, depth) {
	var space = "";
	for(var o=0;o<depth;o++){
		space += "     ";
	};
	if(node.type=='sequence'){
		if(node.children.length>0){
			retStr = space + "<sequence identifier=\"" + node.id + "\">\n";
				for(var z=0;z<node.children.length;z++){
					retStr += this.generateSequenceFileString(node.children[z], depth + 1);
				};
			retStr += space + "</sequence>\n";
			return retStr;
		} else {
			return;
		};
	} else {
		return space + "<node-ref ref=\"" + node.id + "\"/>\n";
	};
};

/*
 * finds the node with the specified id in the specified array
 */
function findNodeById(nodesArray, id) {
	for (var k=0; k<nodesArray.length; k++) {
		if (nodesArray[k].id == id) {
			return nodesArray[k];
		}
	}
	return null;
}

Project.prototype.getSummaryProjectHTML = function(){
	var projectHTML = "<h3>Project Summary</h3>";
	
	function getNodeInfo(node, depth){
		var html = "<br>";
		var tab = '&nbsp;';
		
		for(var y=0;y<(depth*2);y++){
			html = html + tab;
		};
		
		html = html + node.type + '   ' + node.getTitle();
		for(var z=0;z<node.children.length;z++){
			html = html + getNodeInfo(node.children[z], depth + 1);
		};
		return html;
	};
	
	projectHTML = projectHTML + getNodeInfo(this.rootNode, 0);
	return projectHTML;
};

Project.prototype.getShowAllWorkHtml = function(node, doGrading) {
	var htmlSoFar = "";
	if (node.children.length > 0) {
		// this is a sequence node
		for (var i = 0; i < node.children.length; i++) {
			htmlSoFar += this.getShowAllWorkHtml(node.children[i], doGrading);
		}
	} else {
		// this is a leaf node
	    htmlSoFar += "<h4>" + node.title + "</h4>";
	    if (doGrading) {
		    htmlSoFar += "<table border='1'>";
		    htmlSoFar += "<tr><th>Work</th><th>Grading</th></tr>";
			htmlSoFar += "<tr><td>" + node.getShowAllWorkHtml() + "</td>";
			htmlSoFar += "<td><textarea rows='10' cols='10'></textarea></td></tr>";
			htmlSoFar += "</table>";
	    } else {
			htmlSoFar += node.getShowAllWorkHtml();
	    }
		htmlSoFar += "<br/><br/>";
	}
	return htmlSoFar;
}

/**
 * Returns the first renderable node Id given the structure of 
 * the project (starting with the rootNode
 */
Project.prototype.getStartNodeId = function(){
	return id = this.getFirstNonSequenceNodeId(this.rootNode);
};

/**
 * Helper function for getStartNodeId()
 */
Project.prototype.getFirstNonSequenceNodeId = function(node){
	if(node.type=='sequence'){
		for(var y=0;y<node.children.length;y++){
			var id = this.getFirstNonSequenceNodeId(node.children[y]);
			if(id!=null){
				return id;
			};
		};
	} else {
		return node.id;
	};
};

/**
 * Removes the node from the project
 */
Project.prototype.removeNodeById = function(id){
	for(var o=0;o<this.allSequenceNodes.length;o++){
		if(this.allSequenceNodes[o].id==id){
			this.allSequenceNodes.splice(o,1);
			this.removeAllNodeReferences(id);
			return;
		};
	};
	for(var q=0;q<this.allLeafNodes.length;q++){
		if(this.allLeafNodes[q].id==id){
			this.allLeafNodes.splice(q,1);
			this.removeAllNodeReferences(id);
			return;
		};
	};
};

/**
 * Removes all references of the node with the given id
 * from sequences in this project
 */
Project.prototype.removeAllNodeReferences = function(id){
	for(var w=0;w<this.allSequenceNodes.length;w++){
		for(var e=0;e<this.allSequenceNodes[w].children.length;e++){
			if(this.allSequenceNodes[w].children[e].id==id){
				this.allSequenceNodes[w].children.splice(e, 1);
			};
		};
	};
};

/**
 * Removes the node associated with the given refId from the sequence
 * associated with the given seqId at the given location
 */
Project.prototype.removeReferenceFromSequence = function(seqId, refId, location){
	var sequence = this.getNodeById(seqId);
	//for(var t=0;t<sequence.children.length;t++){
	//	if(sequence.children[t].id==refId){
	//		sequence.children.splice(t, 1);
	//		return;
	//	};
	//};
	sequence.children.splice(location, 1);
};

/**
 * Adds the sequence given the associates addSeqId to the sequence
 * with the associated toSeqId at the given location
 */
Project.prototype.addSequenceToSequence = function(addSeqId, toSeqId, location){
	var addSeq = this.getNodeById(addSeqId);
	var toSeq = this.getNodeById(toSeqId);
	
	toSeq.children.splice(location, 0, addSeq); //inserts
};

/**
 * Adds the node associated with the given nodeId to the sequence
 * associated with the given seqId at the given location
 */
Project.prototype.addNodeToSequence = function(nodeId, seqId, location){
	var addNode = this.getNodeById(nodeId);
	var sequence = this.getNodeById(seqId);
	
	sequence.children.splice(location, 0, addNode); //inserts
};

Project.prototype.projectXML = function(){
	var xml = "<project>\n<nodes>\n";
	
	for(var k=0;k<this.allLeafNodes.length;k++){
		xml += this.allLeafNodes[k].nodeDefinitionXML();
	};
	
	xml += "</nodes>\n<sequences>\n";
	
	for(var j=0;j<this.allSequenceNodes.length;j++){
		xml += this.allSequenceNodes[j].nodeDefinitionXML();
	};
	
	xml += "</sequences>\n<method>\n<startpoint>" + this.rootNode.nodeReferenceXML() + "</startpoint>\n</method>\n</project>";
	
	return xml;
};

/**
 * Returns an xml string that represents this project. This is used
 * by the authoring tool to return the project in xml so it can be
 * saved.
 * @return an xml string that represents the project
 */
Project.prototype.exportProject = function() {
	var exportXML = this.rootNode.exportNode();
	return exportXML;
}

/**
 * Returns true iff this node is a Html page
 */
Node.prototype.isHtmlPage = function() {
	if (this.element != null) {
		var typeToCheck = this.element.getAttribute("type");
		for (var i = 0; i < htmlPageTypes.length; i++) {
			if (htmlPageTypes[i] == typeToCheck) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Returns true iff this node is a Html page
 */
Node.prototype.isQtiAssessmentPage = function() {
	if (this.element != null) {
		var typeToCheck = this.element.getAttribute("type");
		for (var i = 0; i < qtiAssessmentPageTypes.length; i++) {
			if (qtiAssessmentPageTypes[i] == typeToCheck) {
				return true;
			}
		}
	}
	return false;
}

Node.prototype.isLocked = function() {
	var stepIndexInActivity = this.id.substr(this.id.lastIndexOf(":", this.id.length) + 1);
	if (stepIndexInActivity % 2 == 0) {
		return true;
	}
	return false;
}

/**
 * Renders itself to the specified content panel
 */
Node.prototype.render = function(contentpanel) {
	var content = "";
	if (this.isHtmlPage()) {
		node.render();
		return;
		//content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	} else if (this.isQtiAssessmentPage()) {
		node.render();
		return;
		//content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	} else {
		content = this.type + "<br/>id: " + this.id;
		window.frames["ifrm"].document.write(content);   
		window.frames["ifrm"].document.close(); 	
	}
}
