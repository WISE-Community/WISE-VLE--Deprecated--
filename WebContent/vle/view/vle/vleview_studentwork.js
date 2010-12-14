

/**
 * Given the type and optional arguments, creates a new 
 * state of the type, passing in the arguments.
 */
View.prototype.pushStudentWork = function(nodeState){
	this.state.getCurrentNodeVisit().nodeStates.push(nodeState);
	this.eventManager.fire('updateNavigationConstraints');
};

/**
 * Posts the data for the current node that the user is on back to the
 * server.
 * Does not send the actual data for the step.
 * @param currentNode the current node that the student is on
 */
View.prototype.postCurrentStep = function(currentNode) {
	//check if there is a postCurrentStepUrl
	if(this.getConfig().getConfigParam('postCurrentStepUrl')) {
		//post the data back to the server
		this.connectionManager.request('POST', 3, this.getConfig().getConfigParam('postCurrentStepUrl'), {nodeId: currentNode.id, nodeType: currentNode.type, extraData: currentNode.extraData}, null, this);		
	}
};

/**
 * Posts the current node visit. This is usually used when we need to post
 * intermediate step data before the user has exited the step. An example
 * of this would be brainstorm in which we post the response immediately
 * after the student clicks save and we don't wait until they exit the step.
 * @return
 */
View.prototype.postCurrentNodeVisit = function() {
	if (this.getConfig().getConfigParam('mode') == "portalpreview") {
		// no need to post data if we're in preview mode
		return;
	}
	
	//obtain the current node visit
	var currentNodeVisit = this.state.getCurrentNodeVisit();
	
	//obtain the step work id for the visit
	var stepWorkId = currentNodeVisit.id;
	
	var url;
	if(this.getConfig().getConfigParam('postStudentDataUrl')){
		url = this.getConfig().getConfigParam('postStudentDataUrl');
	} else {
		url = "postdata.html";
	};
	
	//obtain the json string representation of the node visit
	var nodeVisitData = encodeURIComponent($.stringify(currentNodeVisit));
	
	if(this.getUserAndClassInfo() != null) {
		this.connectionManager.request('POST', 3, url, 
				{id: stepWorkId, 
				runId: this.getConfig().getConfigParam('runId'), 
				userId: this.getUserAndClassInfo().getWorkgroupId(), 
				data: nodeVisitData
				}, 
				this.processPostResponse, 
				{vle: this, nodeVisit:currentNodeVisit});
	} else {
		this.connectionManager.request('POST', 3, url, 
				{id: stepWorkId, 
				runId: this.getConfig().getConfigParam('runId'), 
				userId: '-2', 
				data: prepareDataForPost(diff)
				}, 
				this.processPostResponse);
	};
};

/**
 * Posts an unposted nodeVisit to the server, then sets
 * its visitPostTime upon receiving it in the response
 * from the server.
 * @param nodeVisit its visitPostTime must be null.
 * @param boolean - sync - true if the request should by synchronous
 * @return
 */
View.prototype.postUnsavedNodeVisit = function(nodeVisit, sync) {
	if (!this.getConfig() 
			|| !this.getConfig().getConfigParam('mode') 
			|| this.getConfig().getConfigParam('mode') == "portalpreview"
			|| this.getConfig().getConfigParam('mode') == "developerpreview"
			|| this.getConfig().getConfigParam('mode') == "standaloneauthorpreview") {
		// no need to post data if we're in preview mode
		return;
	}

	var url = this.getConfig().getConfigParam('postStudentDataUrl');
	
	/* check the post level to determine, what if anything needs to be posted */
	if(this.getProject().getPostLevel()==1){
		/* if postLevel == 1, we are only interested in steps with student work */
		if(nodeVisit.nodeStates && nodeVisit.nodeStates.length>0){
			var postData = encodeURIComponent($.stringify(nodeVisit));
		} else {
			/* return - nothing to do for this post level if there is no student data */
			return;
		};
	} else {
		/* assuming that if logging level is not 1 then it is 5 (which is everything) */
		var postData = encodeURIComponent($.stringify(nodeVisit));
	};
	
	var postStudentDataUrlParams = {id: nodeVisit.id,
									runId: this.getConfig().getConfigParam('runId'),
									periodId: this.getUserAndClassInfo().getPeriodId(),
									userId: this.getUserAndClassInfo().getWorkgroupId(),
									data: postData};
	
	this.connectionManager.request('POST', 3, url, postStudentDataUrlParams, this.processPostResponse, {vle: this, nodeVisit:nodeVisit}, null, sync);
};


/**
 * Posts all non-posted node_visits to the server
 * @param boolean - sync - whether the visits should be posted synchrounously
 */
View.prototype.postAllUnsavedNodeVisits = function(sync) {
	// get all node_visits that does not have a visitPostTime set.
	// then post them one at a time, and set its visitPostTime based on what the
	// server returns.
	for (var i=0; i<this.state.visitedNodes.length; i++) {
		var nodeVisit = this.state.visitedNodes[i];
		if (nodeVisit != null && nodeVisit.visitPostTime == null && nodeVisit.visitEndTime != null) {
			this.postUnsavedNodeVisit(nodeVisit,sync);
		}
	}
};


/**
 * Handles the response from any time we post student data to the server.
 * @param responseText a json string containing the response data
 * @param responseXML
 * @param args any args required by this callback function which
 * 		were passed in when the request was created
 */
View.prototype.processPostResponse = function(responseText, responseXML, args){
	notificationManager.notify("processPostResponse, responseText:" + responseText, 4);
	notificationManager.notify("processPostResponse, nodeVisit: " + args.nodeVisit, 4);
	
	//obtain the id and post time from the json response
	var responseJSONObj = $.parseJSON(responseText);
	var id = responseJSONObj.id;
	var visitPostTime = responseJSONObj.visitPostTime;
	
	/*
	 * this is for resolving node visits that used to end up with null
	 * endTime values in the db. this problem occurs when the student
	 * clicks on the same step in the nav rapidly, which causes a race condition.
	 * check if the id has been set already, if it has, it means a row in the
	 * db has already been created and we need to end the visit.
	 */
	if(args.nodeVisit.id != null) {
		//args.vle.postUnsavedNodeVisit(args.nodeVisit);
	}
	
	/*
	 * set the id for the node visit, this is the same as the id value
	 * for the visit in the stepWork table in the db
	 */
	args.nodeVisit.id = id;
	
	//set the post time
	args.nodeVisit.visitPostTime = visitPostTime;
	
	//fire the event that says we are done processing the post response
	eventManager.fire('processPostResponseComplete');
};

/**
 * Retrieve all the node states for a specific node in an array
 * @param nodeId the node to obtain node states for
 * @return an array of node states
 */
View.prototype.getStudentWorkForNodeId = function(nodeId) {
	/* if this is a duplicate node, we really just want the student work 
	 * for the node it represents, so we'll catch that here */
	var node = this.getProject().getNodeById(nodeId);
	if(node.type=='DuplicateNode'){
		nodeId = node.getNode().id;
	}
	
	var nodeStates = [];
	for (var i=0; i < this.state.visitedNodes.length; i++) {
		var nodeVisit = this.state.visitedNodes[i];
		if (nodeVisit.getNodeId() == nodeId) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				nodeStates.push(nodeVisit.nodeStates[j]);
			}
		}
	}
	return nodeStates;
};


/**
 * Saves work for the current html step.
 * By Default, the state will be saved for the current-step.
 * if the current step is not an HTML step, do nothing.
 * if node is passed in, save the state for that node
 */
View.prototype.saveState = function(state, node) {
	var currentNode = this.getCurrentNode();
	if (node != null) {
		currentNode = node;
	}
	var newState = null;
	if (currentNode.type == "HtmlNode" || currentNode.type == "DrawNode") {
		newState = new HTMLSTATE(state);
	} else if (currentNode.type == "MySystemNode") {
		newState = new MYSYSTEMSTATE(state);
	} else if (currentNode.type == "SVGDrawNode") {
		newState = new SVGDRAWSTATE(state);
	} else if (currentNode.type == "AssessmentListNode") {
		newState = new ASSESSMENTLISTSTATE(state);
	} else if (currentNode.type == "MWNode") {
		newState = new MWSTATE(state);
	} else {
		// we currently do not support this step type
		return;
	}
	// now add the state to the VLE_STATE
	var nodeVisitsForCurrentNode = this.state.getNodeVisitsByNodeId(currentNode.getNodeId());
	var nodeVisitForCurrentNode = nodeVisitsForCurrentNode[nodeVisitsForCurrentNode.length - 1];
	nodeVisitForCurrentNode.nodeStates.push(newState);
};

/**
 * Handles the saving of any unsaved work when user exits/refreshes/etc
 * @param whether to logout the user
 */
View.prototype.onWindowUnload = function(logout){
	/* display splash screen letting user know that saving is occuring */
	$('#onUnloadSaveDiv').dialog('open');
	
	/* tell current step to clean up */ 
	if(this.getCurrentNode()) {
		this.getCurrentNode().onExit();		
	}
	
	/* set the endVisitTime to the current time for the current state */
	this.state.endCurrentNodeVisit();
	
	/* synchronously save any unsaved node visits */
	this.postAllUnsavedNodeVisits(true);
	
	/* try to blip final message before going */
	$('#onUnloadSaveDiv').html('SAVED!!');

	/*
	 * check if we need to log out the user, we need to use the === comparison
	 * because if the user refreshes the screen or navigates to another page
	 * the argument to onWindowUnload will be an event object.
	 */
	if(logout === true) {
		//logout the user
		this.connectionManager.request('GET',1,"/webapp/j_spring_security_logout", null, function(){},null,null,true);
		window.parent.location = "/webapp/index.html";		
	}
	
	$('#onUnloadSaveDiv').dialog('close');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_studentwork.js');
};