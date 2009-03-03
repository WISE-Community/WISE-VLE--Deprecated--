/*
 * HtmlNode
 */

HtmlNode.prototype = new Node();
HtmlNode.prototype.constructor = HtmlNode;
HtmlNode.prototype.parent = Node.prototype;
function HtmlNode(nodeType) {
	this.type = nodeType;
}

HtmlNode.prototype.render = function(contentpanel) {
	var content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	window.frames["ifrm"].document.open();	
	window.frames["ifrm"].document.write(content);   
	window.frames["ifrm"].document.close(); 		

}


HtmlNode.prototype.getShowAllWorkHtml = function(){
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

HtmlNode.prototype.getDataXML = function(nodeStates) {
	return HtmlNode.prototype.parent.getDataXML(nodeStates);
}