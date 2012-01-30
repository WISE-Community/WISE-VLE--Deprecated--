/**
 * Dispatches events that are specific to the menu.
 */
View.prototype.menuDispatcher = function(type,args,obj){
	//if(type=='loadingProjectComplete'){
	if(type=='menuCreated'){
		obj.createMenuOnProjectLoad();
	} else if(type=='renderNodeComplete'){
		obj.renderNavigationPanel();
		obj.expandActivity(args[0]);
	} /*else if(type=='toggleNavigationPanelVisibility'){
		obj.navigationPanel.toggleVisibility();
	}*/ else if(type=='menuExpandAll'){
		obj.myMenu.expandAll();
	} else if(type=='menuCollapseAll'){
		obj.myMenu.collapseAll();
	} else if(type=='menuCollapseAllNonImmediate'){
		obj.collapseAllNonImmediate();
	} else if(type=='toggleSequence'){
		// escape : and . characters to allow them to work with jQuery selectors
		var pos = args[0].replace(/(:|\.)/g,'\\$1');
		obj.myMenu.toggleSequence($('#node_' + pos));
	} else if(type=='updateNavigationConstraints'){
		obj.updateNavigationConstraints();
	} /*else if(type=='resizeMenu'){
		obj.resizeMenu();
	}*/ else if(type == 'displayMenuBubble') {
		obj.displayMenuBubble(args[0], args[1]);
	} else if(type == 'removeMenuBubble') {
		obj.removeMenuBubble(args[0]);
	} else if(type == 'removeAllMenuBubbles') {
		obj.removeAllMenuBubbles();
	} else if(type == 'highlightStepInMenu') {
		obj.highlightStepInMenu(args[0]);
	} else if(type == 'unhighlightStepInMenu') {
		obj.unhighlightStepInMenu(args[0]);
	} else if(type=='updateStepStatusIcon'){
		obj.updateStepStatusIcon(args[0], args[1], args[2]);
	}
};

/**
 * Creates and initializes the menu used by this view.
 */
View.prototype.createMenuOnProjectLoad = function(){
	var menuEl = document.getElementById('my_menu');
	
	if(menuEl){
		this.myMenu = new WMenu('my_menu');
	};
	
	if(typeof this.myMenu != 'undefined'){
		this.myMenu.init();
	};
	
	// TODO: remove this
	if (this.config != null && this.config.getConfigParam('mainNav') != null) {
		var mainNav = this.config.getConfigParam('mainNav');
		
		if (mainNav == 'none') {
			this.eventManager.fire('toggleNagivationPanelVisibility');
		};
	};
};

/**
 * Renders the navigationPanel. Creates one if one does not yet exist
 */
View.prototype.renderNavigationPanel = function(){
	if(!this.navigationPanel){
		this.navigationPanel = new NavigationPanel(this);	
	};
	this.navigationPanel.render();
};

/**
 * Updates the menu constraints.
 */
View.prototype.updateNavigationConstraints = function(){
	/* have the navigation logic update its active constraints */
	if(this.navigationLogic){
		this.navigationLogic.nodeRendered();
	}
	
	/* have the navigation panel update the menu constraints */
	if(this.navigationPanel){
		this.navigationPanel.processConstraints();
	}
};

/**
 * Expands the parent menu of the node with the given id
 */
View.prototype.expandActivity = function(position) {
	var node = this.getProject().getNodeByPosition(position);
	if (node.parent) {
		submenu = document.getElementById("node_" + this.getProject().getPositionById(node.parent.id));
		if(submenu){
			//remove the collapsed class from the menu so it becomes expanded
			//submenu.className = submenu.className.replace("collapsed", "");
			this.myMenu.expandMenu(submenu);
		};
	};
};


/**
 * finds and collapses all nodes except parents, grandparents, etc
 */
View.prototype.collapseAllNonImmediate = function() {
	//obtain all the parents, grandparents, etc of this node
	var enclosingNavParents = this.getEnclosingNavParents(this.getCurrentPosition());
	
	if(enclosingNavParents != null && enclosingNavParents.length != 0 && this.myMenu) {
		//collapse all nodes except parents, grandparents, etc
		this.myMenu.forceCollapseOthersNDeep(enclosingNavParents);	
	};
};

/**
 * Obtain an array of the parent, grandparent, etc. basically the parent,
 * the parent's parent, the parent's parent's parent, etc. so that when
 * the nav menu is displaying a project that is n-levels deep, we know
 * which parents to keep open. We need to keep all of these ancestors
 * open and not just the immediate parent.
 * @param position - the absolute position of the node we are currently on
 * @param enclosingNavParents an array containing all the parents
 * @return the array of ancestors
 */
View.prototype.getEnclosingNavParents = function(position, enclosingNavParents) {
	//initialize the ancestors array
	if(enclosingNavParents == null) {
		enclosingNavParents = new Array();
	};
	
	var ndx = position.lastIndexOf('.');
	if(ndx != -1) {
		var parentPos = position.substring(0, position.lastIndexOf('.'));
		//see if the parent has an element in the nav
		var parentNavElement = document.getElementById("node_" + parentPos);
		if(parentNavElement != null) {
			/*
			 * the parent does have an element in the nav so we will add it
			 * to our array of ancestors
			 */
			enclosingNavParents.push(parentNavElement);
		};
		//look for the ancestors of the parent recursively
		return this.getEnclosingNavParents(parentPos, enclosingNavParents);
	} else {
		/*
		 * we have reached to top of the parent tree so we will now
		 * return the ancestor array
		 */
		return enclosingNavParents;
	};
};

/**
 * Toggles the visibility of the navigation panel
 */
/*View.prototype.toggleNavigationPanelVisibility = function() {
	this.navigationPanel.toggleVisibility();	
};*/

/**
 * Resizes navigation panel menu box to fit window height
 */
/*View.prototype.resizeMenu = function() {
	if($('#projectLeftBox').length>0){
		var navHeight = $('#projectLeftBox').height() - $('#hostBrandingBoxUpper').outerHeight() -
			$('#projectLogoBox').outerHeight() - $('#navMenuControls').outerHeight() - 4;
		$('#navigationMenuBox').height(navHeight);
	}
};*/

/**
 * Display a bubble next to the navigation menu that points to a specific step
 * and also displays a message to the student
 * @param nodeId the node id for the step we want to point to
 * @param message the message we want to show to the student
 */
View.prototype.displayMenuBubble = function(nodeId, message) {
	//get the width of the left box of the vle
	var projectLeftBox = document.getElementById('projectLeftBox');
	var projectLeftBoxClientWidth = projectLeftBox.clientWidth;
	
	//get the position of the step in the menu
	var nodePosition = this.getProject().getPositionById(nodeId);
	var node = document.getElementById(nodePosition);
	
	if(node != null) {
		//get the y position of the step in the menu
		var nodeOffsetTop = node.offsetTop;
		
		//get the left and top (basically the same as x and y) positions for the bubble
		var left = projectLeftBoxClientWidth;
		var top = nodeOffsetTop;
		
		//get the bubble div id
		var menuBubbleDivId = "menuBubbleDiv_" + nodeId;
		
		//create the div that will display the message
		//var menuBubbleDivHtml = "<div id='" + menuBubbleDivId + "' class='menuBubbleDiv' style='position:absolute;z-index:6;width:500px;top:" + top + "px;left:" + left + "px' onclick='eventManager.fire(\"removeMenuBubble\", \"" + nodeId + "\")'><table style='background-color: yellow'><tr><td><&nbsp</td><td>" + message + "</td><td style='cursor:pointer'>&nbsp[x]</td></tr></table></div>";
		var menuBubbleDivHtml = "<div id='" + menuBubbleDivId + "' class='menuBubbleDiv' style='position:absolute;z-index:6;width:500px;top:" + top + "px;left:" + left + "px' onclick='eventManager.fire(\"removeMenuBubble\", \"" + nodeId + "\")'><table style='background-color: yellow'><tr><td>&nbsp</td><td>" + message + "</td><td style='cursor:pointer'>&nbsp[x]</td></tr></table></div>";
		
		//add the bubble div to the left box
		$('#projectLeftBox').append(menuBubbleDivHtml);
		
		//remove the bubble after 5 seconds
		setTimeout("eventManager.fire('removeMenuBubble', '" + nodeId + "')", 5000);
	}
};

/**
 * Remove the bubble for the given node
 * @param nodeId the id of the node
 */
View.prototype.removeMenuBubble = function(nodeId) {
	if(nodeId != null) {
		/*
		 * replace all the '.' with '\\.' so that the jquery id selector works
		 * if we didn't do this, it would treat the '.' as a class selector and
		 * would not be able to find the element by its id because almost all
		 * of our ids contain a '.'
		 * e.g. node_1.ht
		 */
		nodeId = nodeId.replace(/\./g, '\\.');
		
		//get the div id for the bubble
		var menuBubbleDivId = 'menuBubbleDiv_' + nodeId;
		
		//remove the bubble
		$('#' + menuBubbleDivId).remove();		
	}
};

/**
 * Remove all the bubbles
 */
View.prototype.removeAllMenuBubbles = function() {
	//remove all elements with the class 'bubbleDiv'
	$('.menuBubbleDiv').remove();
};

/**
 * Highlight the step in the menu
 * @param nodeId the id of the step
 */
View.prototype.highlightStepInMenu = function(nodeId) {
	if(nodeId != null) {
		//get the node position
		var nodePosition = this.getProject().getPositionById(nodeId);
		
		if(nodePosition != null) {
			//get the DOM step element in the menu
			var node = document.getElementById("node_" + nodePosition);
			
			if(node != null) {
				//add the class 'menuStepHighlight' to make the background of the step yellow
				var nodeClass = node.getAttribute("class");
				
				if(nodeClass != null) {
					nodeClass = nodeClass + " menuStepHighlight";
					node.setAttribute("class", nodeClass);					
				}
			}			
		}
	}
};

/**
 * Remove the highlight of the step in the menu
 * @param nodeId the id of the step
 */
View.prototype.unhighlightStepInMenu = function(nodeId) {
	if(nodeId != null) {
		//get the node position
		var nodePosition = this.getProject().getPositionById(nodeId);
		
		if(nodePosition != null) {
			//get the DOM step element in the menu
			var node = document.getElementById("node_" + nodePosition);
			
			if(node != null) {
				//remove the 'menuStepHighlight' class so that the background of the step is no longer yellow
				var nodeClass = node.getAttribute("class");
				
				if(nodeClass != null) {
					nodeClass = nodeClass.replace('menuStepHighlight', '');
					node.setAttribute("class", nodeClass);					
				}
			}			
		}
	}
};

/**
 * Update the status icon for the step
 * @param nodeId the node id of the step
 * @param src the path to the icon image file
 * @param tooltip the text to display when user hovers over the icon
 */
View.prototype.updateStepStatusIcon = function(nodeId, src, tooltip) {
	if(src && typeof src == 'string' && src != ''){
		/*
		 * replace all the '.' with '\\.' so that the jquery id selector works
		 * if we didn't do this, it would treat the '.' as a class selector and
		 * would not be able to find the element by its id because almost all
		 * of our ids contain a '.'
		 * e.g. node_1.ht
		 */
		nodeId = nodeId.replace(/\./g, '\\.');
		
		//get the div id for the right icon
		var divId = nodeId + "_status_icon";
		
		//remove any existing classes
		//$('#' + divId).removeClass();
		
		// remove any existing icons
		$('#' + divId).html("");
		
		//if(className == null || className == '') {
			//empty is the default class name if we do not want to show anything
			//className = 'empty';
		//}
		
		//add the new class
		//$('#' + divId).addClass(className);
		
		var title = '';
		if(tooltip && typeof tooltip == 'string'){
			title = tooltip;
		}
		
		// insert the new icon
		$('#' + divId).html("<img alt='status icon' title='" + title + "' src='" + src + "' />");
	}
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_menu.js');
}