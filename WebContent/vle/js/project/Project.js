var	htmlPageTypes = new Array("introduction", "reading", "video", "example", "display");
var qtiAssessmentPageTypes = new Array("openresponse");

var acceptedTagNames = new Array("node", "HtmlNode", "MultipleChoiceNode", "sequence", "FillinNode", "MatchSequenceNode", "NoteNode", "JournalEntryNode", "OutsideUrlNode");

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

function Project(xmlDoc) {
	this.xmlDoc = xmlDoc;
	this.allLeafNodes = [];
	this.allSequenceNodes = [];
	//alert('project constructor' + this.xmlDoc.getElementsByTagName("sequence").length);
	//alert('1:' + this.xmlDoc.firstChild.nodeName);
	if (this.xmlDoc.getElementsByTagName("sequence").length > 0) {
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
	node.filename = filename;
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
	var node;
	node = this.rootNode.getNodeById(nodeId);
	if(node){
		return node;
	} else {
		for(var t=0;t<this.allLeafNodes.length;t++){
			if(this.allLeafNodes[t].id==nodeId){
				return this.allLeafNodes[t];
			};
		};
	};
};

Project.prototype.generateNode = function(element) {
	//alert('project generateNode method');
	//var nodeType = element.getAttribute('type');
	//var thisNode = NodeFactory.createNode(nodeType);
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
	this.allSequenceNodes = [];
	var nodeElements = xmlDoc.getElementsByTagName("nodes")[0].childNodes;
	for (var i=0; i < nodeElements.length; i++) {
		var element = nodeElements[i];
		if (element.nodeName != "#text")  {
			var thisNode = NodeFactory.createNode(element);
			thisNode.title = element.getAttribute('title');
			thisNode.id = element.getAttribute('identifier');
			thisNode.filename = element.getElementsByTagName('ref')[0].getAttribute("filename");
			thisNode.element = element;
			this.allLeafNodes.push(thisNode);
		}
	}
	
	return this.generateSequence(xmlDoc.getElementsByTagName("sequence")[0]);
}

/**
 * Given a sequence node, generates all referenced nodes
 * including children sequence nodes
 */
Project.prototype.generateSequence = function(sequence){
	var sequenceNode = NodeFactory.createNode(sequence);
	sequenceNode.element = sequence;
	var childElements = sequence.childNodes;   //either a node-ref or another sequence
	for (var j=0; j < childElements.length; j++) {
		if (childElements[j].nodeName != "#text")  {
			if(childElements[j].nodeName=='sequence'){
				sequenceNode.addChildNode(this.generateSequence(childElements[j]));
			} else {
				var referenceIdentifier = childElements[j].getAttribute("ref");   // ie a2s1, a3s4, ids that are defined in nodes in the repos section.
				var referencedNode = findNodeById(this.allLeafNodes, referenceIdentifier);
				sequenceNode.addChildNode(referencedNode);
			};
		}
	}
	this.allSequenceNodes.push(sequenceNode);
	return sequenceNode;	
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
		alert(node.children.length);
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

Project.prototype.getShowAllWorkHtml = function() {
	alert("Project.getShowAllWorkHtml not yet implemented");
	return this.rootNode.id;
}

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
