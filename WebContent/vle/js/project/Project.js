var	htmlPageTypes = new Array("introduction", "reading", "video", "example", "display");
var qtiAssessmentPageTypes = new Array("openresponse");

function NodeFactory() {
	this.htmlPageTypes = new Array("introduction", "reading", "video", "example", "display");
	this.qtiAssessmentPageTypes = new Array("openresponse");
}

NodeFactory.createNode = function (nodeType){
	if (nodeType == null) {
		return new Node();		
	} else if (htmlPageTypes.indexOf(nodeType) > -1) {
		return new HtmlNode(nodeType);
	} else if (qtiAssessmentPageTypes.indexOf(nodeType) > -1) {
		return new CustomNode(nodeType);
	} else {
		return new Node();		
	}
}
function Project(xmlDoc) {
	this.xmlDoc = xmlDoc;
	this.rootNode = this.generateNode(this.xmlDoc.firstChild);
}

Project.prototype.generateNode = function(element) {
	var nodeType = element.getAttribute('type');
	var thisNode = NodeFactory.createNode(nodeType);
	thisNode.element = element;
	thisNode.id = element.getAttribute('id');
	var children = element.childNodes;
	for (var i = 0; i < children.length; i++) {
		if (children[i].nodeName == "node") {
			thisNode.addChildNode(this.generateNode(children[i]));
		}
	}
	return thisNode;
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
