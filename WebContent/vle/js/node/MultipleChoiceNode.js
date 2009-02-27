MultipleChoiceNode.prototype = new Node();
MultipleChoiceNode.prototype.constructor = MultipleChoiceNode;
MultipleChoiceNode.prototype.parent = Node.prototype;
function MultipleChoiceNode(nodeType) {
	this.type = nodeType;
}

MultipleChoiceNode.prototype.render = function(contentpanel) {
	window.frames["ifrm"].location = "js/node/multiplechoice/multiplechoice.html";
} 


MultipleChoiceNode.prototype.load = function() {
	var xmlNode = this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	window.frames["ifrm"].renderMCFromString(xmlNode);
	document.getElementById('topStepTitle').innerHTML = this.title;
}
