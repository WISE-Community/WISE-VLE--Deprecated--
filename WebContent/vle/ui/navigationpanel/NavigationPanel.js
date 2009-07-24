function NavigationPanel(rootNode, autostep, stepLevelNum, stepTerm) {
	this.rootNode = rootNode;
	this.autoStep = autostep; //boolean value whether to automatically number the steps
	this.stepLevelNumbering = stepLevelNum; //boolean value whether to use tree level numbering e.g. 1, 1.1, 1.1.2
	this.stepTerm = stepTerm; //The term to precede a step (i.e. Step or Page) when autoStep=true
	this.currentStepNum;
}

/*
 * Obtain the html from my_menu and run trim on the html to remove all
 * white space. If it is empty string after the trim that means we
 * need to create the nav html. If the string is not empty that means
 * we have previously created the nav html and we only need to update
 * some of the elements.
 */
NavigationPanel.prototype.render = function(eventType) {
	//obtain the html in the nav div and run trim on it
	var currentNavHtml = document.getElementById("my_menu").innerHTML.replace(/^\s*/, "").replace(/\s*$/, "");

	//check if the nav html is empty string after the trim
	if(currentNavHtml != "") {
		//the nav html is not empty string so we will just update some of the elements
		
		//obtain the node id that was previously just highlighted in the nav
		var previousNodeId = global_yui.get(".currentNode").get('id');		
		
		//obtain the new current node id we are moving to
		var currentNodeId = vle.getCurrentNode().id;
		
		//obtain the nav elements for the node ids we just obtained
		var previousNavElement = document.getElementById(previousNodeId);
		var currentNavElement = document.getElementById(currentNodeId + "_menu");
		
		var previousNavElementClass = null;
		
		/*
		 * remove the currentNode class from the previousNavElement so
		 * it is no longer highlighted
		 */
		if(previousNavElement != null) {
			previousNavElementClass = previousNavElement.getAttribute("class");
			if(!previousNavElementClass){//could be ie, try className
				previousNavElementClass = previousNavElement.getAttribute('className');
				if(previousNavElementClass){
					previousNavElementClass = previousNavElementClass.replace('currentNode', '');
					previousNavElement.setAttribute('className', previousNavElementClass);
				};
			} else {
				previousNavElementClass = previousNavElementClass.replace("currentNode", "");
				previousNavElement.setAttribute("class", previousNavElementClass);
			};
			
			/*
			 * Check for glue sequences and if it was previous set icon
			 * back to glue icon and remove position within the glue from
			 * title
			 */ 
			var prevNode = vle.getNodeById(previousNodeId.substring(0, previousNodeId.indexOf('_menu')));
			var currentNode = vle.getNodeById(currentNodeId);
			if(prevNode && prevNode.parent.getView()=='glue' && (currentNode.parent != prevNode.parent)){ //then we are a glue sequence different from previous
				var currentTitle = previousNavElement.firstChild.nextSibling.nodeValue;
				var newTitle;
				var parentTitle = prevNode.parent.title;
				previousNavElement.firstChild.src = iconUrl + 'instantquiz16.png';
				
				if(currentTitle && currentTitle.indexOf(parentTitle)!=-1){
					newTitle = currentTitle.substring(0, currentTitle.indexOf(parentTitle) + parentTitle.length + 1);
					previousNavElement.firstChild.nextSibling.nodeValue = newTitle;
				};
			};
		}
		
		/*
		 * add the currentNode class to the currentNavElement so that
		 * it becomes highlighted
		 */
		if(currentNavElement != null) {
			var currentNavElementClass = currentNavElement.getAttribute("class");
			if(!currentNavElementClass){//maybe its ie, trying className
				currentNavElementClass = currentNavElement.getAttribute('className');
				if(currentNavElementClass){
					currentNavElementClass = currentNavElementClass + " currentNode";
					currentNavElement.setAttribute('className', currentNavElementClass);
				};
			} else {
				currentNavElementClass = currentNavElementClass + " currentNode";
				currentNavElement.setAttribute("class", currentNavElementClass);
			};
			
			var child = vle.state.getCurrentNodeVisit().node;
			if(child.parent.getView()=='glue'){//must be first step in glue
				this.processGlue(currentNavElement, child);
			};
		} else {
			/*
			 * if the currentNavElement is null it's because the current
			 * node we are on is within a glue node so it doesn't have
			 * a nav element. in this case we will just highlight
			 * the parent nav element (which is the parent glue node) 
			 */
			//obtain the parent
			var enclosingNavParentElement = this.getEnclosingNavParent(vle.state.getCurrentNodeVisit().node);
			if(enclosingNavParentElement != null) {
				
				/*
				 * if view is set for the glue, then change title to show which step
				 * they are currently on
				 */
				var child = vle.state.getCurrentNodeVisit().node;
				if(child.parent.getView()=='glue'){
					this.processGlue(enclosingNavParentElement, child);
				};
				/*
				 * add the currentNode class to the parent so that it becomes
				 * highlighted
				 */
				var enclosingNavParentElementClass = enclosingNavParentElement.getAttribute("class");
				if(!enclosingNavParentElementClass){//maybe its ie, trying className
					enclosingNavParentElementClass = enclosingNavParentElement.getAttribute('className');
				};
				enclosingNavParentElementClass = enclosingNavParentElementClass + " currentNode";
				enclosingNavParentElement.setAttribute("class", enclosingNavParentElementClass);
			}
		}
		
	} else {
		//the nav html is empty so we need to build the nav html
		
		this.currentStepNum = 1;
		var navHtml = "";  
		
		//loop through the nodes and child nodes and create the html
		for (var i = 0; i < this.rootNode.children.length; i++) {
			navHtml += this.getNavigationHtml(this.rootNode.children[i], eventType, 0, i + 1);
		}
		
		//set the nav html into the div
		document.getElementById("my_menu").innerHTML = navHtml;
	}
}

/**
 * Handles special processing of glue sequences: setting icon
 * to icon of current step and updating title to reflect the
 * step number, within the glue, that they are currently on
 */
NavigationPanel.prototype.processGlue = function(el, child){
	var currentTitle = el.firstChild.nextSibling.nodeValue;
	var newTitle;
	var parentTitle = child.parent.title;
	var positionText = ' (part ' + (child.parent.children.indexOf(child) + 1) + ' of ' + child.parent.children.length + ')';
					
	el.firstChild.src = iconUrl + child.className + '16.png';
	
	if(currentTitle && currentTitle.indexOf(parentTitle)!=-1){
		newTitle = currentTitle.substring(0, currentTitle.indexOf(parentTitle) + parentTitle.length + 1) + positionText;
		el.firstChild.nextSibling.nodeValue = newTitle;
	};
};

/**
 * We will search backwards through the navigationLogic
 * to find the previous node that actually has an element
 * in the nav. Some nodes do not have an element in the nav
 * such as glue nodes.
 * @param node the node to find the parent for
 * @return the parent nav element of the argument node
 */
NavigationPanel.prototype.getEnclosingNavParent = function(node) {
	if(node != null) {
		//obtain the previous node in the navigationLogic
		var prevNode = vle.navigationLogic.getPrevNode(node);
		
		if(prevNode != null) {
			//obtain the id of the previous node
			var prevNodeId = prevNode.id;
			
			//see if the previous node has an element in the nav
			var prevElement = document.getElementById(prevNodeId + "_menu");
			
			if(prevElement != null) {
				//the previous element does have an element in the nav
				return prevElement;
			} else {
				/*
				 * the previous element does not have an element in the nav
				 * so we will keep searching backwards
				 */
				return this.getEnclosingNavParent(prevNode);
			}
		}
	}
	return null;
}

NavigationPanel.prototype.toggleVisibility = function() {
	var currentStyle = document.getElementById("projectLeftBox").style.display;
	if (currentStyle == null || currentStyle == 'none') {
		document.getElementById("projectLeftBox").style.display = "block";
		document.getElementById("projectRightUpperBox").style.marginLeft = "0";
		document.getElementById("projectRightLowerBox").style.marginLeft = "231";
	} else {
		document.getElementById("projectLeftBox").style.display = "none";		
		document.getElementById("projectRightUpperBox").style.marginLeft = "0";
		document.getElementById("projectRightLowerBox").style.marginLeft = "0";
	}
}

/**
 * 
 * @param node
 * @param eventType
 * @param depth the current level of the navigation in tree terms
 * @param position the tree numbering e.g. 1, 1.1, 1.1.2
 * @return
 */
NavigationPanel.prototype.getNavigationHtml = function(node, eventType, depth, position) {
	var htmlSoFar = "";
	var classString = "node";
	var space = "";
	var deep = depth;
	
	var pxIndent = 10 * depth;
	
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
		classString += " hiddenNode";
	}
    
    if (node.children.length > 0) {
    	//the node is a sequence
    	
    	if(node.getView() == "hidden") {
    		/*
    		 * the sequence is a hidden sequence so the user will not see
    		 * the sequence title in the nav bar but they will see all its
    		 * children. the children will show up on the level that the
    		 * sequence is in and not one level deeper. if one of the children
    		 * is a sequence, that will show up like a regular sequence.
    		 */
    		for (var x = 0; x < node.children.length; x++) {
        		htmlSoFar += this.getNavigationHtml(node.children[x], eventType, deep, position + '.' + (x + 1));
        	};
    	} else if(node.getView() == "glue") {
    		/*
    		 * the sequence is a glue sequence so the user will only see
    		 * the sequence title in the nav bar. they will not see
    		 * any children in the nav bar but the next button will step
    		 * through them. if a child is a sequence, they will 
    		 * still only see the sequence
    		 * and when they click the next button to go to the next
    		 * step, they will step through the sequence and the 
    		 * sequence's children.
    		 */
    		var sequenceIcon = '<img src=\'images/stepIcons/UCCP/instantquiz16.png\'/>';
    		htmlSoFar ;
    		for(var t=0;t<depth;t++){
    			htmlSoFar += space;
    		};
    		
    		if(node.className && node.className!='null' && node.className!=''){
    			sequenceIcon = '<img src=\'' + iconUrl + node.className + '16.png\'/> ';
    		};
    		
    		if(!this.stepLevelNumbering){
    			position = '';
    		};
    		
    		//display a step with the title of the sequence for this glue sequence
    		if(this.autoStep) {
    			htmlSoFar += this.createStepHtml(pxIndent, classString, deep, node.children[0].id, sequenceIcon, position, node.getTitle(), this.currentStepNum);
    			this.currentStepNum ++;
    		} else {
    			htmlSoFar += this.createStepHtml(pxIndent, classString, deep, node.children[0].id, sequenceIcon, position, node.getTitle());
    		}
    	} else {
    		//the sequence is normal
    		var submenu = document.getElementById(node.id + "_menu");
    		
    		//display this sequence in the nav
        	if (submenu && submenu.className) {
        		htmlSoFar += this.createSequenceHtml(pxIndent, submenu.classname, deep, node.id, node.getTitle());
        	} else {
        		htmlSoFar += this.createSequenceHtml(pxIndent, classString, deep, node.id, node.getTitle());
        	}
        	
        	//display the children in the nav
        	for (var i = 0; i < node.children.length; i++) {
        		htmlSoFar += this.getNavigationHtml(node.children[i], eventType, deep + 1, position + '.' + (i + 1));
        	};
    		htmlSoFar += "</div>";
    	}
	} else {
		//the node is a step
		var icon = '';
		htmlSoFar ;
		for(var t=0;t<depth;t++){
			htmlSoFar += space;
		};
		
		if(node.className && node.className!='null' && node.className!=''){
			icon = '<img src=\'' + iconUrl + node.className + '16.png\'/> ';
		};
		
		if(!this.stepLevelNumbering){
			position = '';
		};
		
		//display the step
		if(this.autoStep){
			htmlSoFar += this.createStepHtml(pxIndent, classString, deep, node.id, icon, position, node.getTitle(), this.currentStepNum);
			this.currentStepNum ++;
		} else {
			htmlSoFar += this.createStepHtml(pxIndent, classString, deep, node.id, icon, position, node.getTitle());
		};
	}
	return htmlSoFar;
}

/**
 * Create the html to display a sequence in the navigation
 * @param pxIndent
 * @param classString
 * @param deep the depth of the node starting from 0
 * @param nodeId
 * @param title
 * @return the html for the sequence for the navigation
 */
NavigationPanel.prototype.createSequenceHtml = function(pxIndent, classString, deep, nodeId, title) {
	//return "<div class=\""+ classString +"\" id=\"" + nodeId + "_menu\"><span style=\"border-left:" + pxIndent + "px solid #6699FF\" onclick=\"myMenu.toggleMenu(document.getElementById('"+ nodeId +"_menu'))\">" + title + "</span>";
	/*
	 * add the depth# class to the div so it can be styled, we need to add
	 * 2 to the deep value so that the depth ranges from 1 and up e.g.
	 * 1 - project level
	 * 2 - activity level
	 * 3 - step (or activity) level
	 * 4 - step (or activity) level
	 * 5 - step (or activity) level
	 * etc.
	 */
	return "<div class=\""+ classString + " depth" + (deep + 2) + "\" id=\"" + nodeId + "_menu\"><span onclick=\"myMenu.toggleMenu(document.getElementById('"+ nodeId +"_menu'))\">" + title + "</span>";
}

/**
 * Create the html to display a step in the navigation
 * @param pxIndent
 * @param classString
 * @param deep the depth of the node starting from 0
 * @param nodeId
 * @param icon
 * @param position the tree numbering e.g. 1, 1.1, 1.1.2
 * @param title
 * @param currentStepNum the global step number e.g. 1, 2, 3, or null if not used
 * @return the html for the step for the navigation
 */
NavigationPanel.prototype.createStepHtml = function(pxIndent, classString, deep, nodeId, icon, position, title, currentStepNum) {
	//var html = "<a style=\"border-left:" + pxIndent + "px solid #6699FF\" class=\"" + classString + "\" onclick=\"vle.renderNode('" + nodeId + "');\" id=\"" + nodeId + "_menu\">" + icon;
	
	/*
	 * add the depth# class to the a so it can be styled, we need to add
	 * 2 to the deep value so that the depth ranges from 1 and up e.g.
	 * 1 - project level
	 * 2 - activity level
	 * 3 - step (or activity) level
	 * 4 - step (or activity) level
	 * 5 - step (or activity) level
	 * etc.
	 */
	var html = "<a class=\"" + classString + " depth" + (deep + 2) + "\" onclick=\"vle.renderNode('" + nodeId + "');\" id=\"" + nodeId + "_menu\">" + icon;
	
	if(currentStepNum != null) {
		html += this.stepTerm + " " + currentStepNum + ": "; 
	} else {
		if(this.stepTerm && this.stepTerm != ''){
			html += this.stepTerm + ': ';
		};
	};
	
	html += position + " " + title + "</a>";
	return html;
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/ui/navigationpanel/NavigationPanel.js");