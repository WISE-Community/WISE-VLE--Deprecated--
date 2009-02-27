BlueJNode.prototype = new Node();
BlueJNode.prototype.constructor = BlueJNode;
BlueJNode.prototype.parent = Node.prototype;
function BlueJNode(nodeType) {
	this.type = "OTBlueJ";
	this.projectPath = "";
}

BlueJNode.prototype.render = function(contentpanel) {
//	var content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
//	window.frames["ifrm"].document.open();
//	window.frames["ifrm"].document.write(content);
//	window.frames["ifrm"].document.close();
	
	window.frames["ifrm"].document.open();
	window.frames["ifrm"].location = "js/node/outsideurl/outsideurl.html";
	window.frames["ifrm"].document.close();
	
	this.projectPath = this.element.getElementsByTagName("projectPath")[0].firstChild.nodeValue;
}

BlueJNode.prototype.load = function() {
	var url = this.element.getElementsByTagName("url")[0].firstChild.nodeValue;
	window.frames["ifrm"].loadUrl(url);
	document.getElementById('topStepTitle').innerHTML = this.title;
}

BlueJNode.prototype.getDataXML = function() {
	return this.projectPath;
}

BlueJNode.prototype.getShowAllWorkHtml = function(){
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