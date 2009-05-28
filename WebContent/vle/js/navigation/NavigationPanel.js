function NavigationPanel(rootNode, autostep) {
	this.rootNode = rootNode;
	this.autoStep = autostep;
	this.currentStepNum;
}

/*
 * current makes the assumption that the node is 3-levels deep.
 * this is because the library we're using for the navigation animation
 * only works with 3-levels.
 */
NavigationPanel.prototype.render = function(eventType) {
	this.currentStepNum = 1;
	var navHtml = "";  
	for (var i = 0; i < this.rootNode.children.length; i++) {
			navHtml += this.getNavigationHtml(this.rootNode.children[i], eventType, 0, i + 1);
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

NavigationPanel.prototype.getNavigationHtml = function(node, eventType, depth, position) {
	var htmlSoFar = "";
	var classString = "node";
	var space = "";
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
    	var submenu = document.getElementById(node.id + "_menu");
    	if (submenu && submenu.className) {
    		htmlSoFar += "<div class=\""+ submenu.className +"\" id=\"" + node.id + "_menu\"><span onclick=\"myMenu.toggleMenu(document.getElementById('"+ node.id +"_menu'))\">"+node.getTitle()+"</span>";
    	} else {
    		htmlSoFar += "<div class=\""+ classString +"\" id=\"" + node.id + "_menu\"><span onclick=\"myMenu.toggleMenu(document.getElementById('"+ node.id +"_menu'))\">"+node.getTitle()+"</span>";
    	}
    	for (var i = 0; i < node.children.length; i++) {
    		htmlSoFar += this.getNavigationHtml(node.children[i], eventType, deep + 1, position + '.' + (i + 1));
    	};
		htmlSoFar += "</div>";
	} else {
		htmlSoFar ;
		for(var t=0;t<depth;t++){
			htmlSoFar += space;
		};
		
		if(this.autoStep){
			htmlSoFar += "<a class=\"" + classString + "\" onclick=\"vle.renderNode('" + node.id + "');\" id=\"" + node.id + "_menu\">Step " + this.currentStepNum + ": " + position + " " + node.getTitle() + "</a>";
			this.currentStepNum ++;
		} else {
			htmlSoFar += "<a class=\"" + classString + "\" onclick=\"vle.renderNode('" + node.id + "');\" id=\"" + node.id + "_menu\">" + position + " " + node.getTitle() + "</a>";
		};
	}
    //alert(htmlSoFar);
	return htmlSoFar;
}