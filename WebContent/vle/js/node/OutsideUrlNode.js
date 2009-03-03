/*
 * OutsideUrlNode
 */

OutsideUrlNode.prototype = new Node();
OutsideUrlNode.prototype.constructor = OutsideUrlNode;
OutsideUrlNode.prototype.parent = Node.prototype;
function OutsideUrlNode(nodeType) {
	this.type = nodeType;
}

OutsideUrlNode.prototype.render = function(contentpanel) {
	window.frames["ifrm"].document.open();
	window.frames["ifrm"].location = "js/node/outsideurl/outsideurl.html";
	window.frames["ifrm"].document.close();
}

OutsideUrlNode.prototype.load = function() {
	var url = this.element.getElementsByTagName("url")[0].firstChild.nodeValue;
		window.frames["ifrm"].loadUrl(url);
	document.getElementById('topStepTitle').innerHTML = this.title;
}


OutsideUrlNode.prototype.getShowAllWorkHtml = function(){
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
        showAllWorkHtmlSoFar += "(checkmark goes here!)You have visited this page.";
    }
    else {
        showAllWorkHtmlSoFar += "You have NOT visited this page yet.";
    }
    
    for (var i = 0; i < this.children.length; i++) {
        showAllWorkHtmlSoFar += this.children[i].getShowAllWorkHtml();
    }
    return showAllWorkHtmlSoFar;
}

OutsideUrlNode.prototype.getDataXML = function(nodeStates) {
	return OutsideUrlNode.prototype.parent.getDataXML(nodeStates);
}