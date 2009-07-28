function RunManager(runInfoUrl, runInfoRequestInterval, connectionManager, eventManager, runId) {
	this.runInfoUrl = runInfoUrl;
	this.pollInterval = runInfoRequestInterval;
	this.connectionManager = connectionManager;
	this.eventManager = eventManager;
	this.isPaused = false;
	this.visibleNodes = [];   // only nodes that the student can see
	this.message = "";     // message from teacher
	this.isPollingEnabled = true; // should it keep polling
	this.runId = runId;
	this.showNodeId = null;
	this.isFlaggingEnabled = false;
	
	if (this.pollInterval && this.pollInterval != null && this.pollInterval != "" && parseInt(this.pollInterval) > 0) {
		notificationManager.notify('RunManager, polling at pollInterval=' + this.pollInterval, 1);
		setInterval("vle.runManager.poll();", this.pollInterval);	  // start the polling
	}
}

/*
 * polls the runInfoUrl via the connectionManager
 */
RunManager.prototype.poll = function() {
	if (this.isPollingEnabled) {
		this.connectionManager.request('GET', 1, this.runInfoUrl, null, this.processRetrievedRunInfo);
	}
}

/**
 * Processes the XML retrieved RunInfo object and sets attributes
 * Then updates vle with any changes.
 * @param responseText
 * @param responseXML
 * @return
 */
RunManager.prototype.processRetrievedRunInfo = function(responseText, responseXML) {
	if (responseXML && responseXML != null) {
		vle.runManager.parseRunInfo(responseXML);
	} else {
		vle.runManager.setDefaultRunInfo();
	}
	vle.runManager.updateVLE();
}

/**
 * Resets variables to default settings.
 * @return
 */
RunManager.prototype.setDefaultRunInfo = function() {
	this.isPaused = false;
	this.showNodeId = null;
}

RunManager.prototype.parseRunInfo = function(responseXML) {
	if (responseXML.getElementsByTagName('isPaused').length > 0) {
		var isPaused = responseXML.getElementsByTagName('isPaused')[0].firstChild.nodeValue;
		if (isPaused == "true") {
			this.isPaused = true;
		} else {
			this.isPaused = false;
		}
	} else {
		this.isPaused = false;
	}
	
	if (responseXML.getElementsByTagName('showNodeId').length > 0) {
		var showNodeId = responseXML.getElementsByTagName('showNodeId')[0].firstChild.nodeValue;
		this.showNodeId = showNodeId;
	} else {
		this.showNodeId = null;
	}

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
		this.eventManager.fire('lockScreenEvent');
		if (this.message != "") {
			YAHOO.example.container.wait
					.setBody("<table><tr align='center'>Teacher has locked your screen. Please talk to your teacher.</tr><tr align='center'></tr></table>");
		}
	} else {
		this.eventManager.fire('unlockScreenEvent');
	}
	
	if (this.showNodeId != null) {
		if (vle.getCurrentNode().id != this.showNodeId) {
			vle.renderNode(this.showNodeId);
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
		if (runManager.visibleNodes.length > 0) {
			vle.visibilityLogic = new VisibilityLogic(new OnlyShowSelectedNodes(window.frames["topifrm"].vle.project.rootNode, runManager.visibleNodes)); 
			vle.navigationPanel.render();
			if (vle.getCurrentNode().id != this.visibleNodes[0]) {
				vle.renderNode(this.visibleNodes[0]);
			}
		}
	}
}

/*
var callback =
{
  success: function(o) { 
	  //alert(o.responseText);
	  runManager.setRunManager(o.responseText); 
  },
  failure: function(o) {},
  argument: ["a", "b", "c"]
}

RunManager.prototype.setRunManager = function(xmlRunManagerTxt) {
	var xmlDoc = loadXMLDocFromString(xmlRunManagerTxt);
	var isPaused = xmlDoc.getElementsByTagName('isPaused')[0].firstChild.nodeValue;
	if (isPaused == "true") {
		this.isPaused = true;
	} else {
		this.isPaused = false;
	}

    // get message from teacher
    var messageElement = xmlDoc.getElementsByTagName('message')[0];
    //alert(messageElement.textContent);
    var messagePart;
    this.message = "";
    for (var i=0; i < messageElement.childNodes.length; i++) {
        if (messageElement.childNodes[i].nodeType == 1) {
            alert("1: " + messageElement.childNodes[i] + " , " + messageElement.childNodes[i].nodeName  + " , " + messageElement.childNodes[i].xml);
        	this.message += messageElement.childNodes[i].innerHTML;
        } else {
        //alert(messageElement.childNodes[i] + "," + messageElement.childNodes[i].nodeValue + messageElement.childNodes[i].nodeName);
    	this.message += messageElement.childNodes[i].nodeValue;
        }
    }
    
	
	

	if (runManager.isPaused) { 
		  lockscreen(); 
		  if (this.message != "") {
	          YAHOO.example.container.wait.setBody("<table><tr align='center'>Teacher has locked your screen. Please talk to your teacher.</tr><tr align='center'></tr><table><b>Your teacher says:</b><br/>" + this.message);		  
		  }
	} else {
		  unlockscreen();
	} 
	
}
*/


//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/run/RunManager.js");