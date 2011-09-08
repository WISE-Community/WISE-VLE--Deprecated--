function RunManager(runInfoUrl, runInfoRequestInterval, runId, view) {
	this.runInfoUrl = runInfoUrl;
	this.pollInterval = runInfoRequestInterval;
	this.view = view;
	this.isPaused = false;
	this.visibleNodes = [];   // only nodes that the student can see
	this.message = "";     // message from teacher
	this.isPollingEnabled = true; // should it keep polling
	this.runId = runId;
	this.showNodeId = null;
	this.isFlaggingEnabled = false;
	
	if (this.pollInterval && this.pollInterval != null && this.pollInterval != "" && parseInt(this.pollInterval) > 0) {
		this.view.notificationManager.notify('RunManager, polling at pollInterval=' + this.pollInterval, 1);
		setInterval("eventManager.fire(\"runManagerPoll\")", this.pollInterval);	  // start the polling
	};
};

/*
 * polls the runInfoUrl via the connectionManager
 */
RunManager.prototype.poll = function() {
	if (this.isPollingEnabled) {
		this.view.connectionManager.request('GET', 1, this.runInfoUrl, null, this.processRetrievedRunInfo, this.view);
	};
};

/**
 * Processes the XML retrieved RunInfo object and sets attributes
 * Then updates vle with any changes.
 * @param responseText
 * @param responseXML
 * @return
 */
RunManager.prototype.processRetrievedRunInfo = function(responseText, responseXML, obj) {
	if (responseXML && responseXML != null) {
		obj.runManager.parseRunInfo(responseXML);
	} else {
		obj.runManager.setDefaultRunInfo();
	};
	obj.runManager.updateVLE();
};

/**
 * Resets variables to default settings.
 * @return
 */
RunManager.prototype.setDefaultRunInfo = function() {
	this.isPaused = false;
	this.showNodeId = null;
};

RunManager.prototype.parseRunInfo = function(responseXML) {
	if (responseXML.getElementsByTagName('isPaused').length > 0) {
		var isPaused = responseXML.getElementsByTagName('isPaused')[0].firstChild.nodeValue;
		if (isPaused == "true") {
			this.isPaused = true;
		} else {
			this.isPaused = false;
		};
	} else {
		this.isPaused = false;
	};
	
	if (responseXML.getElementsByTagName('showNodeId').length > 0) {
		var showNodeId = responseXML.getElementsByTagName('showNodeId')[0].firstChild.nodeValue;
		this.showNodeId = showNodeId;
	} else {
		this.showNodeId = null;
	};

	if (responseXML.getElementsByTagName('visibleNodes').length > 0) {
		this.visibleNodes = responseXML.getElementsByTagName('visibleNodes')[0];
	} else {
		this.visibleNodes = [];
	}

	//check if flagging is enabled
	if (responseXML.getElementsByTagName('isFlaggingEnabled').length > 0) {
		this.isFlaggingEnabled = responseXML.getElementsByTagName('isFlaggingEnabled')[0];
	} else {
		this.isFlaggingEnabled = false;
	}
}

/**
 * updates VLE with latest settings. One of the things that it checks for is isPaused
 * attribute, which, when is set to true, will lock the VLE screen.
 * @return
 */
RunManager.prototype.updateVLE = function() {
	if (this.isPaused) {
		this.view.eventManager.fire('lockScreenEvent', this.message);
	} else {
		this.view.eventManager.fire('unlockScreenEvent', this.message);
	}
	
	if (this.showNodeId != null) {
		if (this.view.getCurrentNode().id != this.showNodeId) {
			this.view.eventManager.fire('closeDialogs');
			this.view.renderNode(this.view.getProject().getPositionById(this.showNodeId));
		}
	}
	
	if (this.visibleNodes != null && this.visibleNodes.length > 0) {
		this.updateVisibleNodes(this.visibleNodes);
	}

}

RunManager.prototype.updateVisibleNodes = function(visibleNodes) {
	var newArray = [];
	var visibleNodeElements = visibleNodes.getElementsByTagName('visiblenode');
	for (var i=0; i < visibleNodeElements.length; i++) {
		newArray.push(visibleNodeElements[i].firstChild.nodeValue);
	}

//	see if the newly-retrieved array of visible nodes are same as the ones
//	that was retrieved right before it. If so, there's no need to update the
//	navigation panel. If not, update the nav panel and the node that the student
//	sees.
	if (!this.visibleNodes.compare(newArray)) {
		this.visibleNodes = [];
		for (var i=0; i < visibleNodeElements.length; i++) {
			this.visibleNodes.push(visibleNodeElements[i].firstChild.nodeValue);
		}
		if (this.view.runManager.visibleNodes.length > 0) {
			this.view.visibilityLogic = new VisibilityLogic(new OnlyShowSelectedNodes(this.view.getProject().getRootNode(), this.view.runManager.visibleNodes)); 
			this.view.navigationPanel.render();
			if (this.view.getCurrentNode().id != this.visibleNodes[0]) {
				this.view.renderNode(this.view.getProject().getPositionById(this.visibleNodes[0]));
			}
		}
	}
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/ui/control/RunManager.js');
};