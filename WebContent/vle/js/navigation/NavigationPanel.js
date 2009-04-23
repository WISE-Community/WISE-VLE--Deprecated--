function NavigationPanel(rootNode) {
	this.rootNode = rootNode;
}

/*
 * current makes the assumption that the node is 3-levels deep.
 * this is because the library we're using for the navigation animation
 * only works with 3-levels.
 */
NavigationPanel.prototype.render = function(eventType) {
	var navHtml = "";  
	for (var i = 0; i < this.rootNode.children.length; i++) {
			navHtml += this.getNavigationHtml(this.rootNode.children[i], eventType);
	}
	document.getElementById("my_menu").innerHTML = navHtml;
}

NavigationPanel.prototype.toggleVisibility = function() {
	var currentStyle = document.getElementById("projectLeftBox").style.display;
	if (currentStyle == null || currentStyle == 'none') {
		document.getElementById("projectLeftBox").style.display = "block";
		document.getElementById("projectRightUpperBox").style.marginLeft = "216";
		document.getElementById("projectRightLowerBox").style.marginLeft = "216";
	} else {
		document.getElementById("projectLeftBox").style.display = "none";		
		document.getElementById("projectRightUpperBox").style.marginLeft = "0";
		document.getElementById("projectRightLowerBox").style.marginLeft = "0";
	}
}

NavigationPanel.prototype.getNavigationHtml = function(node, eventType, depth) {
	var htmlSoFar = "";
	var classString = "node";
	var space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	var deep = depth;
	
	if(!deep){
		deep = 0;
	};
	
	if (node == null) {
		// this is for nodes that don't appear in navigation
		// like journal
		return;
	}
	if (node.id == vle.state.getCurrentNodeVisit().node.id) {
		classString += " currentNode";
	}
	
	if (vle.visibilityLogic != null && !vle.visibilityLogic.isNodeVisible(vle.state, node, eventType)) {
		//alert('hiddenNode');
		classString += " hiddenNode";
	}
    
    if (node.children.length > 0) {
		//htmlSoFar += "<div class=\""+ classString +"\" id=\"" + node.id + "_menu\"><span onclick=\"expandMenu('"+ node.id +"_menu')\">"+node.getTitle()+"</span>";
		for (var i = 0; i < node.children.length; i++) {
			htmlSoFar += this.getNavigationHtml(node.children[i], eventType, deep + 1);
		}
		//htmlSoFar += "</div>";
	} else {
		htmlSoFar ;
		for(var t=0;t<depth;t++){
			htmlSoFar += space;
		};
		htmlSoFar += "<a class=\"" + classString + "\" onclick=\"vle.renderNode('" + node.id + "');\" id=\"" + node.id + "_menu\">" + node.getTitle() + "</a>";
	}
    //alert(htmlSoFar);
	return htmlSoFar;
}