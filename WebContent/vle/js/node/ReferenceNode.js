/**
* ReferenceNode
*/

ReferenceNode.prototype = new Node();
ReferenceNode.prototype.constructor = ReferenceNode;
ReferenceNode.prototype.parent = Node.prototype;

function ReferenceNode(nodeType) {
	this.type = nodeType;
	this.referenceNodeId = null;
	this.parameters = null;
};

ReferenceNode.prototype.render = function(){
	
	//referenceNodeId = this.element.getElementsByTagName('referenceNodeId')[0].firstChild.nodeValue;
	//parameters = this.element.getElementsByTagName('parameters')[0]
	
	if(this.parameters){
		referencedNode = vle.getNodeById(this.referenceNodeId);
		if(referencedNode.setParameters){
			referencedNode.setParameters(this.parameters);
		};
	};
	
	vle.renderNode(this.referenceNodeId);
};

ReferenceNode.prototype.initializeElement = function(){
	this.referenceNodeId = this.element.getElementsByTagName('referenceNodeId')[0].firstChild.nodeValue;
	this.parameters = this.element.getElementsByTagName('parameters')[0];
	if(this.parameters){
		this.parameters = this.parameters.firstChild.nodeValue;
	};
};