/**
 * This file specifies the user interface for navigation components (nodes and sequences),
 * specifies the navigation menu toggle event, and also specifies any navigation
 * events to register with the vle event dispatcher.
 * 
 * REQUIRED items are noted as such.
 * 
 * Theme creators can also define customizations to add when both the navigation
 * menu has been created in the DOM (see 'menuCreated' function) and a when new step
 * has been opened by a student (see 'nodeRendered' function).
 */

/**
 * Called when the navigation menu has been inserted into the DOM (when the project
 * first starts up)
 * 
 * REQUIRED
 * 
 * Any DOM customizations, scripting, or event handlers for this 
 * navigation menu should be included here. (It is okay to leave this function empty.)
 */
NavigationPanel.prototype.menuCreated = function() {
	$('#navigation').show();
	
	// set the text and title for the toggle navigation menu button
	$('#toggleNavLink').attr('title',view.getI18NString("toggle_nav_button_title","theme")).html(view.getI18NString("toggle_nav_button_text","theme"));
	
	// on stepHeader hover show step title, vice versa
	$('#stepHeader').hover(
			function(){
				clearTimeout($(this).data('stepHeaderTimer'));
				$('#stepInfo').fadeIn();
			},
			function(){
				$('#stepInfo').stop(true,true);
				$('#stepInfo').fadeOut();
			}
	);

	// for some reason, the first time a node loads when the project is opened,
	// the stepInfo div is not fading after 4 seconds, so force here
	setTimeout(function(){
		$('#stepInfo').fadeOut();
	}, 4000);

	// show project content
	$('#vle_body').css('opacity',1);

	view.eventManager.subscribe('studentWorkUpdated', this.studentWorkUpdatedListener, this);
	view.eventManager.subscribe('constraintStatusUpdated', this.constraintStatusUpdatedListener, this);
};

/**
 * Called when a new node (step) is rendered
 * 
 * REQUIRED
 * 
 * By default, the new step's content is displayed. The 'currentNode'
 * class is added to the new step's menu element and removed from the previous
 * step's menu element. In addition, the 'inactive' class is added to all step 
 * and activity menu elements that are not part of the current activity.
 * Any DOM customizations, scripting, or event handlers beyond these should be
 * included in this function. (It is okay to leave this function empty.)
 * 
 * @param node Node that has been rendered
 */
NavigationPanel.prototype.nodeRendered = function(node) {
	//$('#stepContent').show();
	$('#navigation').hide();
	
	// clear the stepHeaderTimer timeout actions on the step header
	clearTimeout($('#stepHeader').data('stepHeaderTimer'));

	// show the step title overlay (unless current step is a note, in which case the title is displayed in the note dialog)
	if(node.getType() != "NoteNode"){
		$('#stepInfo').fadeIn();

		// hide step title overlay after 4 seconds
		var stepHeaderTimer = setTimeout(function(){
			$('#stepInfo').fadeOut();
		}, 4000);
		$('#stepHeader').data('stepHeaderTimer',stepHeaderTimer);
	}
};

/**
 * Toggles the visibility of the navigation panel
 * 
 * REQUIRED
 * 
 * Is executed when the 'toggleNav' link is clicked (see 'vle_body.html').
 * 
 * If you would like to remove the navigation toggle link for this specific navigation
 * mode (but include it for other navigation modes in this theme), keep the 'toggleNav'
 * element in the theme's 'vle_body.html' but hide or remove it in this
 * function using javascript/jQuery [e.g. $('#toggleNav').remove();].
 * 
 * If you do not want a navigation toggle link in your theme at all, remove the 'toggleNav'
 * element from your theme's 'vle_body.html' and leave this function empty.
 */
NavigationPanel.prototype.toggleVisibility = function() {
	//var view = this.view;

	/* if there is a disabled panel over the step content, we want to resize that to match the stepContent */
	/*var resizeDisabled = function(){
		if($('#disabledPanel').size()>0){
			// get the step content position, height and width
			var panelPosition = $('#stepContent').offset();
			var panelHeight = $('#stepContent').height() + 2;
			var panelWidth = $('#stepContent').width() + 2;

			// set the panel css with the position, height and width
			$('#disabledPanel').css({top:panelPosition.top, left:panelPosition.left, height:panelHeight, width:panelWidth});
		}
	};*/
	
	$('#navigation').show();
};

/**
 * Listener for the constraintStatusUpdated event
 * @param type the event name
 * @param args the arguments passed into the event when it is fired
 * @param obj the view
 */
NavigationPanel.prototype.constraintStatusUpdatedListener = function(type, args, obj) {
	//get the node id that has been updated
	var nodeId = args[0];

	//get the constraint status
	var constraintStatus = args[1];

	//get the position of the step
	var position = view.getProject().getPositionById(nodeId);
	var positionEscaped = view.escapeIdForJquery(position);

	//add or remove the constraintDisable class 
	if(constraintStatus == 'disabled') {
		//grey out the step
		$('#node_' + positionEscaped).addClass('constraintDisable');
	} else if(constraintStatus == 'enabled') {
		//make the step available
		$('#node_' + positionEscaped).removeClass('constraintDisable');
	}
};

/**
 * Listener for the studentWorkUpdated event
 * @param type the event name
 * @param args the arguments passed into the event when it is fired
 * @param obj the view
 */
NavigationPanel.prototype.studentWorkUpdatedListener = function(type, args, obj) {
	//update the step icon
	obj.setStepIcon();
};

NavigationPanel.prototype.navigationPanelPrevButtonClickedListener = function() {
	view.renderPrevNode();
};

NavigationPanel.prototype.navigationPanelNextButtonClickedListener = function() {
	view.renderNextNode();
};

NavigationPanel.prototype.navigationPanelToggleVisibilityButtonClickedListener = function() {
	this.toggleVisibility();
};

/**
 * Listens for the navigationNodeClicked event
 * @param nodePosition the node position that was clicked
 */
NavigationPanel.prototype.navigationNodeClickedListener = function(nodePosition) {
	//go to the node position that was clicked if it is available
	this.view.goToNodePosition(nodePosition);
};

NavigationPanel.prototype.visitNodeListener = function(nodeId){
	var nodePosition = view.getProject().getPositionById(nodeId);
	//go to the node position that was clicked if it is available
	view.goToNodePosition(nodePosition);
};

/*
 * Obtain the html from my_menu and run trim on the html to remove all
 * white space. If it is empty string after the trim that means we
 * need to create the nav html. If the string is not empty that means
 * we have previously created the nav html and we only need to update
 * some of the elements.
 * @param forceReRender true iff we want to rerender the navigation from scratch
 */
NavigationPanel.prototype.render = function(forceReRender) {
	//obtain the html in the nav div and run trim on it
	var currentNavHtml = document.getElementById("my_menu").innerHTML.replace(/^\s*/, "").replace(/\s*$/, "");
	
	//check if the nav html is empty string after the trim
	if(!forceReRender && currentNavHtml != "") {
		//the nav html is not empty string so we will just update some of the elements
		
		//obtain the node pos that was previously just highlighted in the nav
		var previousPos = $('.currentNode').attr('id');
		if(previousPos){
			previousPos = previousPos.replace(/(:|\.)/g,'\\$1'); // escape : and . characters to allow them to work with jQuery selectors
		}

		//obtain the new current pos we are moving to
		var currentPos = 'node_' + view.getCurrentPosition();
		currentPos = currentPos.replace(/(:|\.)/g,'\\$1'); // escape : and . characters to allow them to work with jQuery selectors

		//obtain the nav elements for the current  and previous nodes
		var previousNavElement = $('#' + previousPos);
		var currentNavElement = $('#' + currentPos);

		/*
		 * remove the currentNode class from the previousNavElement so
		 * it is no longer highlighted
		 */
		if(previousNavElement != null) {
			previousNavElement.removeClass('currentNode');

			/*
			 * Check for glue sequences and if it was previous set icon
			 * back to glue icon and remove position within the glue from
			 * title
			 */ 
			var prevNode = view.getProject().getNodeByPosition(previousPos);
			var currentNode = view.getProject().getNodeByPosition(currentPos);
			if(prevNode && prevNode.parent.getView()=='glue' && (currentNode.parent != prevNode.parent)){ //then we are a glue sequence different from previous
				var currentTitle = previousNavElement.firstChild.nextSibling.nodeValue;
				var newTitle;
				var parentTitle = prevNode.parent.title;
				previousNavElement.firstChild.src = view.iconUrl + 'instantquiz16.png';

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
			currentNavElement.addClass('currentNode');

			var child = view.getProject().getNodeById(view.getState().getCurrentNodeVisit().getNodeId());
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
				var child = view.getProject().getNodeById(view.getState().getCurrentNodeVisit().getNodeId());
				if(child.parent.getView()=='glue'){
					this.processGlue(enclosingNavParentElement, child);
				};

				/*
				 * add the currentNode class to the parent so that it becomes
				 * highlighted
				 */
				enclosingNavParentElement.addClass('currentNode');
			}
		}

	} else {
		//the nav ui is empty so we need to build it
		
		this.map = starmap() // create map instance
			.height(528)
			.width(940)
			.backgroundImg('themes/starmap/navigation/map/images/background.png')
			.view(view);
	
		this.currentStepNum = 1;
		var navHtml = "";
		
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

		//loop through the nodes and child nodes and create the html
		//for (var i = 0; i < this.rootNode.children.length; i++) {
			//navHtml += this.getNavigationHtml(this.rootNode.children[i], 0, i);
		//};
		
		var project = view.getProject(),
			navPanel = this,
			map = this.map,
			projectJSON = project.projectJSON; // TODO: eventually might use project object and not project JSON to generate map
		map.complete(navPanel.menuLoaded);
		d3.select('#my_menu')
			.datum(projectJSON)
			.call(map);
		
		$('#reset').on('click', function(){
			map.reset();
		});
	};

	/* add appropriate classes for any constraints that may apply to 
	 * the current navigation */
	//this.processConstraints();
};

NavigationPanel.prototype.menuLoaded = function() {
	var project = view.getProject(),
		navPanel = this;
	// insert step icons
	/*$('.node').each(function(){
		var nodeId = $(this).attr('id');
		var node = project.getNodeById(nodeId);
		if(node.getNodeClass() && node.getNodeClass()!='null' && node.getNodeClass()!=''){
  			//icon = '<img src=\'' + this.view.iconUrl + node.getNodeClass() + '16.png\'/> ';
  			var nodeClass = node.getNodeClass();
  			var isValid = false;
  			for(var a=0;a<view.nodeClasses[node.type].length;a++){
  				if(view.nodeClasses[node.type][a].nodeClass == nodeClass){
  					isValid = true;
  					break;
  				}
  			}
  			if(!isValid){
  				nodeClass = view.nodeClasses[node.type][0].nodeClass;
  			}
  			var nodeIconPath = view.nodeIconPaths[node.type];
  			$(this).find('image').attr("xlink:href",nodeIconPath + nodeClass + '16.png');
  		};
	});*/
	
	//collapse all activities except for the current one
	//eventManager.fire('menuCollapseAllNonImmediate');

	//eventManager.fire('resizeMenu');
	eventManager.fire('navigationMenuCreated');
	//eventManager.fire('menuCreated');
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
		var node = view.getProject().getNodeByPosition($(this).attr('id').replace('node_',''));
		if(node){
			menuItems[node.id] = this;
		}
	});

	return menuItems;
};

/**
 * Set the constraint status to disabled for all the steps that come after the given node id.
 * If the node id is for a sequence, we will disable all steps after the sequence.
 * @param nodeId the node id to disable all steps after
 */
NavigationPanel.prototype.disableAllStepsAfter = function(nodeId) {
	//get all the node ids that come after this one
	var nodeIdsAfter = view.getProject().getNodeIdsAfter(nodeId);

	//loop through all the node ids that come after the one passed in
	for(var x=0; x<nodeIdsAfter.length; x++) {
		//get a node id
		var nodeIdAfter = nodeIdsAfter[x];

		//get the node
		var node = view.getProject().getNodeById(nodeIdAfter);

		//set the constraint status to disabled
		node.setConstraintStatus('disabled');
	}
};

/**
 * Set the constraint status to disabled for all the steps except for the given node id.
 * If the node id is for a sequence, we will disable all steps outside of the sequence.
 * @param nodeId the node id to not disable
 */
NavigationPanel.prototype.disableAllOtherSteps = function(nodeId) {
	//get all the menu elements
	var menuItems = this.getMenuItems();

	//get the node
	var node = this.view.getProject().getNodeById(nodeId);
	var nodeIds = [];

	if(node.type == 'sequence') {
		//the node is a sequence so we will get all the node ids in it
		nodeIds = this.view.getProject().getNodeIdsInSequence(nodeId);
	}

	//get all the step node ids in the project
	var allNodeIds = this.view.getProject().getNodeIds();

	//loop through all the step node ids
	for(var x=0; x<allNodeIds.length; x++) {
		//get a node id
		var tempNodeId = allNodeIds[x];

		//get the node
		var tempNode = view.getProject().getNodeById(tempNodeId);

		if(node.type == 'sequence') {
			//the node we want to keep enabled is a sequence
			if(nodeIds.indexOf(tempNodeId) == -1) {
				//the temp node id is not in our sequence so we will disable it

				//set the constraint status to disabled
				tempNode.setConstraintStatus('disabled');
			}
		} else {
			//the node that we want to keep enabled is a step
			if(nodeId != tempNodeId) {
				//set the constraint status to disabled
				tempNode.setConstraintStatus('disabled');
			}
		}
	}
};

/**
 * Set the constraint status to disabled for the given node id
 * @param nodeId the node id to disable
 */
NavigationPanel.prototype.disableStepOrActivity = function(nodeId) {
	//get the node
	var node = this.view.getProject().getNodeById(nodeId);

	if(node.type == 'sequence') {
		//the node is a sequence

		//get all the node ids in the sequence
		var nodeIds = this.view.getProject().getNodeIdsInSequence(nodeId);

		//loop through all the node ids
		for(var x=0; x<nodeIds.length; x++) {
			//get a node id
			var tempNodeId = nodeIds[x];

			//get the node
			var tempNode = this.view.getProject().getNodeById(tempNodeId);

			//set the constraint status to disabled
			tempNode.setConstraintStatus('disabled');
		}
	} else {
		//the node is a step

		//get the node
		var node = this.view.getProject().getNodeById(nodeId);

		//set the constraint status to disabled
		node.setConstraintStatus('disabled');
	}
};

/**
 * Enable all the steps
 */
NavigationPanel.prototype.enableAllSteps = function() {
	//get all the step node ids in the project
	var nodeIds = this.view.getProject().getNodeIds();

	//loop through all the node ids
	for(var x=0; x<nodeIds.length; x++) {
		//get a node id
		var nodeId = nodeIds[x];

		//get the node
		var node = this.view.getProject().getNodeById(nodeId);

		//set the constraint status to disabled
		node.setConstraintStatus('enabled');
	}
};


/**
 * Set the step icon in the navigation
 * @param nodeId the node id
 * @param stepIconPath the path to the new icon
 */
NavigationPanel.prototype.setStepIcon = function(nodeId, stepIconPath) {

	if(nodeId != null && nodeId != '' && stepIconPath != null && stepIconPath != '') {
		//the node id and step icon path were provided so we will use them

		/*
		 * replace all the '.' with '\\.' so that the jquery id selector works
		 * if we didn't do this, it would treat the '.' as a class selector and
		 * would not be able to find the element by its id because almost all
		 * of our ids contain a '.'
		 * e.g. node_1.ht
		 */
		nodeId = nodeId.replace(/\./g, '\\.');

		//set the img src to the step icon path
		$('#stepIcon_' + nodeId).attr('src', stepIconPath);
	} else {
		//get the current node
		var currentNode = this.view.getCurrentNode();

		if(currentNode != null) {
			//get the node id
			nodeId = currentNode.id;

			//get the latest work for the step
			var latestWork = this.view.getState().getLatestWorkByNodeId(nodeId);

			//get the status for the latest work
			var status = currentNode.getStatus(latestWork);

			if(status != null) {
				//get the step icon for the status
				var stepIconPath = currentNode.getStepIconForStatus(status);

				if(stepIconPath != null && stepIconPath != '') {
					/*
					 * replace all the '.' with '\\.' so that the jquery id selector works
					 * if we didn't do this, it would treat the '.' as a class selector and
					 * would not be able to find the element by its id because almost all
					 * of our ids contain a '.'
					 * e.g. node_1.ht
					 */
					nodeId = nodeId.replace(/\./g, '\\.');

					//set the img src to the step icon path
					$('#stepIcon_' + nodeId).attr('src', stepIconPath);					
				}
			}
		}
	}
};

/**
* The navMode dispatcher catches events specific to this project
* navigation mode and delegates them to the appropriate functions for
* this view.
* 
* REQUIRED
*/
View.prototype.navModeDispatcher = function(type,args,obj){
	if(type=='renderNodeCompleted') { // REQUIRED (DO NOT EDIT)
		obj.renderNavigationPanel();
	} if(type=='navigationMenuCreated'){ // REQUIRED (DO NOT EDIT)
		obj.navigationPanel.menuCreated();
	} else if(type=='navNodeRendered'){ // REQUIRED  (DO NOT EDIT)
		if(obj.navigationPanel){
			obj.navigationPanel.nodeRendered(args[0]);
		}
	} else if(type=='toggleNavigationVisibility'){ 
		obj.navigationPanel.toggleVisibility();
	} else if(type=='navSequenceOpened'){ 
		obj.navigationPanel.sequenceOpened(args[0]);
	} else if(type=='navSequenceClosed'){ 
		obj.navigationPanel.sequenceClosed(args[0]);
	} else if(type=="navigationPanelPrevButtonClicked") {
		obj.navigationPanel.navigationPanelPrevButtonClickedListener();
	} else if(type=="navigationPanelNextButtonClicked") {
		obj.navigationPanel.navigationPanelNextButtonClickedListener();
	} else if(type=="navigationPanelToggleVisibilityButtonClicked") { // REQUIRED (DO NOT EDIT)
		obj.navigationPanel.navigationPanelToggleVisibilityButtonClickedListener();
	} else if(type=="navigationNodeClicked") {
		obj.navigationPanel.navigationNodeClickedListener(args[0]);
	} else if(type=="visitNode") {
		obj.navigationPanel.visitNodeListener(args[0]);
	};
};

/**
* this list of events (should include each of the types specified in the navModeDispatcher above)
* REQUIRED
*/
var events = [
             'renderNodeCompleted', // REQUIRED (DO NOT EDIT)
             'toggleNavigationVisibility', 
             'navigationMenuCreated', // REQUIRED (DO NOT EDIT)
             'navNodeRendered', // REQUIRED (DO NOT EDIT)
             'navSequenceOpened', 
             'navSequenceClosed', 
             'navigationPanelPrevButtonClicked',
             'navigationPanelNextButtonClicked',
             'navigationPanelToggleVisibilityButtonClicked', // REQUIRED (DO NOT EDIT)
             'navigationNodeClicked',
             'visitNode'
             ];

/**
 * add all the events to the vle so the vle will listen for these events
 * and call the dispatcher function when the event is fired
 * REQUIRED (DO NOT EDIT)
 */
for(var x=0; x<events.length; x++) {
	componentloader.addEvent(events[x], 'navModeDispatcher');
};


/**
 * used to notify scriptloader that this script has finished loading
 * REQUIRED
 */
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename file path to include your theme and navigation mode folder names
	 * 
	 * e.g. if you were creating a navigation mode called 'classic' in the theme called
	 * 'wise', it would look like:
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/themes/wise/navigation/classic/nav.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/themes/starmap/navigation/map/nav.js');
}
