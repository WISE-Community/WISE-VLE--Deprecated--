function NavigationPanel(view) {
	this.view = view;
	this.rootNode = this.view.getProject().getRootNode();
	this.autoStep = this.view.getProject().useAutoStep(); //boolean value whether to automatically number the steps
	this.stepLevelNumbering = this.view.getProject().useStepLevelNumbering(); //boolean value whether to use tree level numbering e.g. 1, 1.1, 1.1.2
	this.stepTerm = this.view.getProject().getStepTerm(); //The term to precede a step (i.e. Step or Page) when autoStep=true
	this.currentStepNum;
}

/*
 * Obtain the html from my_menu and run trim on the html to remove all
 * white space. If it is empty string after the trim that means we
 * need to create the nav html. If the string is not empty that means
 * we have previously created the nav html and we only need to update
 * some of the elements.
 */
NavigationPanel.prototype.render = function() {

	if (this.view.config.getConfigParam("navMode") != "none" && this.view.config.getConfigParam("navMode") != "dropDownTree") {
		//obtain the html in the nav div and run trim on it
		var currentNavHtml = document.getElementById("my_menu").innerHTML.replace(/^\s*/, "").replace(/\s*$/, "");

		//check if the nav html is empty string after the trim
		if(currentNavHtml != "") {
			//the nav html is not empty string so we will just update some of the elements

			//obtain the node pos that was previously just highlighted in the nav
			var previousPos = $('.currentNode').attr('id');		

			//obtain the new current pos we are moving to
			//var currentNodeId = vle.getCurrentNode().id;
			var currentPos = this.view.getCurrentPosition();

			//obtain the nav elements for the node positions we just obtained
			var previousNavElement = document.getElementById(previousPos);
			var currentNavElement = document.getElementById(currentPos);

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
						//remove the 'currentNode' class from the 'className' attribute
						previousNavElementClass = previousNavElementClass.replace('currentNode', '');
						previousNavElement.setAttribute('className', previousNavElementClass);
					};
				} else {
					//remove the 'currentNode' class from the 'class' attribute
					previousNavElementClass = previousNavElementClass.replace("currentNode", "");
					previousNavElement.setAttribute("class", previousNavElementClass);
				};

				/*
				 * Check for glue sequences and if it was previous set icon
				 * back to glue icon and remove position within the glue from
				 * title
				 */ 
				var prevNode = this.view.getProject().getNodeByPosition(previousPos);
				var currentNode = this.view.getProject().getNodeByPosition(currentPos);
				if(prevNode && prevNode.parent.getView()=='glue' && (currentNode.parent != prevNode.parent)){ //then we are a glue sequence different from previous
					var currentTitle = previousNavElement.firstChild.nextSibling.nodeValue;
					var newTitle;
					var parentTitle = prevNode.parent.title;
					previousNavElement.firstChild.src = this.view.iconUrl + 'instantquiz16.png';

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
				//the attribute to look up, try className first in case browser is IE
				var classAttributeName = "className";
				var currentNavElementClass = currentNavElement.getAttribute(classAttributeName);

				if(currentNavElementClass){
					//if IE, since IE uses className as the attribute
					currentNavElementClass = currentNavElementClass + " currentNode";
					currentNavElement.setAttribute(classAttributeName, currentNavElementClass);
				} else {
					/*
					 * "className" was not found so we will try just "class", which is used 
					 * by Firefox and other browsers
					 */
					classAttributeName = "class";
					currentNavElementClass = currentNavElement.getAttribute(classAttributeName);
					if(currentNavElementClass){
						currentNavElementClass = currentNavElementClass + " currentNode";
						currentNavElement.setAttribute(classAttributeName, currentNavElementClass);
					};
				};

				var child = this.view.getProject().getNodeById(this.view.state.getCurrentNodeVisit().getNodeId());
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
				var enclosingNavParentElement = this.getEnclosingNavParent(currentPos);
				if(enclosingNavParentElement != null) {

					/*
					 * if view is set for the glue, then change title to show which step
					 * they are currently on
					 */
					var child = this.view.getProject().getNodeById(this.view.state.getCurrentNodeVisit().getNodeId());
					if(child.parent.getView()=='glue'){
						this.processGlue(enclosingNavParentElement, child);
					};
					/*
					 * add the currentNode class to the parent so that it becomes
					 * highlighted
					 */

					//try to look up the 'class' attribute
					var classAttributeName = "class";
					var enclosingNavParentElementClass = enclosingNavParentElement.getAttribute(classAttributeName);
					if(!enclosingNavParentElementClass){//maybe its ie, trying className
						classAttributeName = "className";
						enclosingNavParentElementClass = enclosingNavParentElement.getAttribute(classAttributeName);
					};
					enclosingNavParentElementClass = enclosingNavParentElementClass + " currentNode";
					enclosingNavParentElement.setAttribute(classAttributeName, enclosingNavParentElementClass);
				}
			}

		} else {
			//the nav html is empty so we need to build the nav html

			this.currentStepNum = 1;
			var navHtml = "";  

			//loop through the nodes and child nodes and create the html
			for (var i = 0; i < this.rootNode.children.length; i++) {
				navHtml += this.getNavigationHtml(this.rootNode.children[i], 0, i);
			};

			/*
			 * add the base href to the nav html. this is required because
			 * if a note step was loaded as the first step, the base href
			 * in the note frame would override the base href for the nav
			 * images and cause them to be dead images. to prevent this, 
			 * we are adding a base href to the nav html so it won't 
			 * accidentally use the note frame base href.
			 */
			navHtml = this.addBaseHref(navHtml);
			
			//set the nav html into the div
			document.getElementById("my_menu").innerHTML = navHtml;
			
			eventManager.fire('resizeMenu');
		};

		//collapse all activities except for the current one
		eventManager.fire('menuCollapseAllNonImmediate');

		/* add appropriate classes for any constraints that may apply to 
		 * the current navigation */
		this.processConstraints();
	}
};

/**
 * Add a base href to the html
 * @param navHtml that navigation menu html
 * @return the navigation menu html with a base href tag prepended to it
 */
NavigationPanel.prototype.addBaseHref = function(navHtml) {
	//add a base href so it knows where to retrieve the nav images
	
	/*
	 * get the href of the current document. it will look something
	 * like
	 * http://wise4.telscenter.org/vlewrapper/vle/vle.html
	 */
	var documentLocationHref = document.location.href;
	
	/*
	 * get everything up until the last '/' inclusive. the documentBase
	 * will look something like
	 * http://wise4.telscenter.org/vlewrapper/vle/
	 */
	var documentBase = documentLocationHref.substring(0, documentLocationHref.lastIndexOf('/') + 1);
	
	/*
	 * add the base href with the document base to the beginning of
	 * the nav html
	 */
	navHtml = "<base href='" + documentBase + "'>" + navHtml;
	
	return navHtml;
};

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
					
	el.firstChild.src = this.view.iconUrl + child.className + '16.png';
	
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
 * @return the parent nav element of the node at the given position
 */
NavigationPanel.prototype.getEnclosingNavParent = function(pos) {
	if(pos != null) {
		//obtain the previous node in the navigationLogic
		var prevNodePos = this.view.navigationLogic.getPrevNode(pos);
		
		if(prevNodePos != null) {
			//see if the previous node has an element in the nav
			var prevElement = document.getElementById(prevNodePos);
			
			if(prevElement != null) {
				//the previous element does have an element in the nav
				return prevElement;
			} else {
				/*
				 * the previous element does not have an element in the nav
				 * so we will keep searching backwards
				 */
				return this.getEnclosingNavParent(prevNodePos);
			};
		};
	};
	return null;
};

/**
 * Toggles the visibility of the navigation panel
 */
NavigationPanel.prototype.toggleVisibility = function() {
	var currentStyle = document.getElementById("projectLeftBox").style.display;
	if (currentStyle == null || currentStyle == 'none') {
		document.getElementById("projectLeftBox").style.display = "block";
		document.getElementById("projectRightUpperBox").style.marginLeft = "0";
		//document.getElementById("projectRightLowerBox").style.marginLeft = "226";
		document.getElementById("projectRightLowerBox").style.left = "228px";
	} else {
		document.getElementById("projectLeftBox").style.display = "none";		
		document.getElementById("projectRightUpperBox").style.marginLeft = "0";
		//document.getElementById("projectRightLowerBox").style.marginLeft = "0";
		document.getElementById("projectRightLowerBox").style.left = "4px";
	}
	
	/* if there is a disabled panel over the ifrm, we want to resize that too */
	if($('#disabledPanel').size()>0){
		/* get the ifrm position, height and width */
		var panelPosition = $('#projectRightLowerBox').offset();
		var panelHeight = $('#projectRightLowerBox').height() + 2;
		var panelWidth = $('#projectRightLowerBox').width() + 2;
		
		/* set the panel css with the position, height and width */
		$('#disabledPanel').css({top:panelPosition.top, left:panelPosition.left, height:panelHeight, width:panelWidth});
	}
};

/**
 * 
 * @param node
 * @param depth the current level of the navigation in tree terms
 * @param position the tree numbering e.g. 1, 1.1, 1.1.2
 * @return
 */
NavigationPanel.prototype.getNavigationHtml = function(node, depth, position) {
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
	
	/* this might be rendered from duplicate node, so check the nodeVisit for this
	 * node to see if it has a duplicateId, if so do not set this one as the current
	 * node */
	if (node.id == this.view.state.getCurrentNodeVisit().getNodeId() && !this.view.state.getCurrentNodeVisit().duplicateId) {
		classString += " currentNode";
	}
	
	/* if this node is a duplicate node, it might have rendered the current node, so check
	 * its real node to see if it is the one being rendered but then set this duplicate node
	 * as the current node in the html */
	if(node.type=='DuplicateNode' && 
			node.getNode().id == this.view.state.getCurrentNodeVisit().getNodeId() && 
			this.view.state.getCurrentNodeVisit().duplicateId == node.id){
		classString += " currentNode";
	}
    
    if (node.children.length > 0 || node.type == "sequence") {
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
        		htmlSoFar += this.getNavigationHtml(node.children[x], deep, position + '.' + x);
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
    		var sequenceIcon = '<img src=\'images/stepIcons/instantquiz16.png\'/>';
    		htmlSoFar ;
    		for(var t=0;t<depth;t++){
    			htmlSoFar += space;
    		};
    		
    		if(node.getNodeClass() && node.getNodeClass()!='null' && node.getNodeClass()!=''){
    			var nodeIconPath = this.view.nodeIconPaths[node.type];
    			//sequenceIcon = '<img src=\'' + this.view.iconUrl + node.getNodeClass() + '16.png\'/> ';
    			sequenceIcon = '<img src=\'' + nodeIconPath + node.getNodeClass() + '16.png\'/> ';
    		};
    		
    		//display a step with the title of the sequence for this glue sequence
    		if(this.autoStep) {
    			htmlSoFar += this.createStepHtml(pxIndent, classString, deep, node.children[0].id, sequenceIcon, position + '.0', node.getTitle(), this.getStudentViewPosition(position + '.0'));
    			this.currentStepNum ++;
    		} else {
    			htmlSoFar += this.createStepHtml(pxIndent, classString, deep, node.children[0].id, sequenceIcon, position + '.0', node.getTitle());
    		}
    	} else {
    		//the sequence is normal
    		var submenu = document.getElementById(position);
    		
    		//display this sequence in the nav
        	if (submenu && submenu.className) {
        		htmlSoFar += this.createSequenceHtml(pxIndent, submenu.classname, deep, node.id, node.getTitle(), position);
        	} else {
        		htmlSoFar += this.createSequenceHtml(pxIndent, classString, deep, node.id, node.getTitle(), position);
        	}
        	
        	//display the children in the nav
        	for (var i = 0; i < node.children.length; i++) {
        		htmlSoFar += this.getNavigationHtml(node.children[i], deep + 1, position + '.' + i);
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
		
		if(node.getNodeClass() && node.getNodeClass()!='null' && node.getNodeClass()!=''){
			//icon = '<img src=\'' + this.view.iconUrl + node.getNodeClass() + '16.png\'/> ';
			var nodeIconPath = this.view.nodeIconPaths[node.type];
			icon = '<img src=\'' + nodeIconPath + node.getNodeClass() + '16.png\'/> ';
		};
		
		//display the step
		if(this.autoStep){
			htmlSoFar += this.createStepHtml(pxIndent, classString, deep, node.id, icon, position, node.getTitle(), this.getStudentViewPosition(position));
			this.currentStepNum ++;
		} else {
			htmlSoFar += this.createStepHtml(pxIndent, classString, deep, node.id, icon, position, node.getTitle());
		};
	};
	return htmlSoFar;
};

/**
 * Get the position for the step that the student should see.
 * @param position a string representing a step position
 * e.g.
 * "0.0" is the position for the first step in the first activity
 * in the programmer world but in the student world it will be
 * displayed as "1.1"
 * 
 * @return the position as should be seen by the student
 */
NavigationPanel.prototype.getStudentViewPosition = function(position) {
	var studentViewPosition = "";
	
	if(position != null) {
		
		//make sure the position is a string
		if(position.constructor.toString().indexOf('String') != -1) {
			//position is a string
			
			//split the string at the periods
			var positionParts = position.split('.');
			
			//loop through all the parts delimited by the periods
			for(var x=0; x<positionParts.length; x++) {
				//get a part
				var positionPart = positionParts[x];
				
				//increment the part by 1 to convert it to the student view
				var studentViewPositionPart = parseInt(positionPart) + 1;
				
				if(studentViewPosition != "") {
					//separate each part with a period
					studentViewPosition += ".";
				} 
				
				//append the part
				studentViewPosition += studentViewPositionPart;
			}
		}
	}
	
	return studentViewPosition;
};

/**
 * Shows Navigation Tree
 * @return
 */
NavigationPanel.prototype.showNavigationTree = function() {
	this.currentStepNum = 1;
	var navHtml = "";  

	//loop through the nodes and child nodes and create the html
	for (var i = 0; i < this.rootNode.children.length; i++) {
		navHtml += this.getNavigationHtml(this.rootNode.children[i], 0, i);
	};

	//check if the showflaggedwork div exists
    if($('#dropDownTreeNavigationDiv').size()==0){
    	//the show flaggedworkdiv does not exist so we will create it
    	$('<div id="dropDownTreeNavigationDiv" style="text-align:left"></div>').dialog({autoOpen:false,closeText:'',width:400,height:(document.height - 20),modal:false,title:'Project Navigator',zindex:9999, left:0, position:["left","top"]});
    }
    
    //set the html into the div
    $('#dropDownTreeNavigationDiv').html(navHtml);
    
    //make the div visible
    $('#dropDownTreeNavigationDiv').dialog('open');
};

/**
 * Create the html to display a sequence in the navigation
 * @param pxIndent
 * @param classString
 * @param deep the depth of the node starting from 0
 * @param nodeId
 * @param title
 * @return the html for the sequence for the navigation
 */
NavigationPanel.prototype.createSequenceHtml = function(pxIndent, classString, deep, nodeId, title, position) {
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
	return "<div name=\"menuItem\" class=\""+ classString + " depth" + (deep + 2) + " " + position + "_menu menuActivity\" id=\"" + position + "\"><span class=\"menuspan\" onclick=\"eventManager.fire('toggleMenu', '" + position + "')\">" + title + "</span>";
};

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
	var html = "<a name=\"menuItem\" class=\"" + classString + " depth" + (deep + 2) + " " + position + "_menu menuStep\" onclick=\"eventManager.fire('renderNode','" + position + "');\" id=\"" + position + "\">"; 
	
	//create a table inside the anchor for each step
	html += "<table>";
	html += "<tr>";
	html += "<td width='25px'>";
	
	//the step icon
	html += icon;
	
	html += "</td>";
	html += "<td width='150px'>";
	
	//the span to display the step title
	html += "<span class=\"menusteptitle\">";
	
	if(currentStepNum != null) {
		html += this.stepTerm + " " + currentStepNum + ": "; 
	} else {
		if(this.stepTerm && this.stepTerm != ''){
			html += this.stepTerm + ': ';
		};
	};
	
	if(!this.stepLevelNumbering){
		position = '';
	};
	
	html += getTitlePositionFromLocation(position) + " " + title + "</span>";
	
	html += "</td>";
	html += "<td height='16px'>";
	
	//the div to display any special icons such as colored stars
	html += "<div id='" + nodeId + "_right_icon' class='empty'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>";
	
	html += "</td>";
	html += "</table>";
	html += "</a>";
	
	return html;
};

/**
 * Checks if there are any constraints in effect for the node being rendered
 * and applies the appropriate classes to the menu.
 */
NavigationPanel.prototype.processConstraints = function(){
	var status = (this.view.navigationLogic) ? this.view.navigationLogic.getVisitableStatus(this.view.getCurrentPosition()) : null;
	
	/* we only need to continue if the nav logic exists and has returned a status object */
	if(status && status.menuStatus){
		var menuItems = this.getMenuItems();
		
		/* for each item in the menu, we want to look up the status in the menuStatus
		 * and add/remove appropriate classess */
		for(var id in menuItems){
			/* remove existing constraint classes */
			$(menuItems[id]).removeClass('constraintHidden constraintDisable');
			
			/* look it up in the menuStatus to see if we need to add any constraint classes */
			var ms = status.menuStatus[id];
			if(ms == 1){
				$(menuItems[id]).addClass('constraintDisable');
			} else if(ms == 2){
				$(menuItems[id]).addClass('constraintHidden');
			}
		}
	}
};

/**
 * Retrieves and returns a map of html menu items keyed to their associated nodeIds.
 * 
 * @return object
 */
NavigationPanel.prototype.getMenuItems = function(){
	var view = this.view;
	var menuItems = {};
	
	$('[name="menuItem"]').each(function(ndx,el){
		var node = view.getProject().getNodeByPosition($(this).attr('id'));
		if(node){
			menuItems[node.id] = this;
		}
	});
	
	return menuItems;
};

/**
 * Given a location, adds 1 to each position in location and returns result
 * @param loc
 */
function getTitlePositionFromLocation(loc){
	if(loc && loc!=''){
		var splitz = loc.split('.');
		var retStr = '';
		for(var c=0;c<splitz.length;c++){
			retStr += (parseInt(splitz[c]) + 1);
			if(c!=splitz.length-1){
				retStr += '.';
			};
		};
		
		return retStr;
	} else {
		return '';
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/ui/menu/NavigationPanel.js');
};