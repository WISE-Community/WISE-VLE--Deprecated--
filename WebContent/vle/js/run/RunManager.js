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
	
	setInterval("vle.runManager.poll();", this.pollInterval);	  // start the polling
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
    
	
	var newArray = [];
	var visibleNodeElements = xmlDoc.getElementsByTagName('visiblenode');
	for (var i=0; i < visibleNodeElements.length; i++) {
		newArray.push(visibleNodeElements[i].firstChild.nodeValue);
	}

	// see if the newly-retrieved array of visible nodes are same as the ones
	// that was retrieved right before it.  If so, there's no need to update the
	// navigation panel. If not, update the nav panel and the node that the student sees.
	if (!this.visibleNodes.compare(newArray)) {
		this.visibleNodes = [];
		for (var i=0; i < visibleNodeElements.length; i++) {
			this.visibleNodes.push(visibleNodeElements[i].firstChild.nodeValue);
		}
		  if (runManager.visibleNodes.length > 0) {
		  		window.frames["topifrm"].vle.visibilityLogic = new VisibilityLogic(new OnlyShowSelectedNodes(window.frames["topifrm"].vle.project.rootNode, runManager.visibleNodes)); 
		  		window.frames["topifrm"].vle.navigationPanel.render();
		  		if (window.frames["topifrm"].vle.getCurrentNode().id != runManager.visibleNodes[0]) {
		  			window.frames["topifrm"].vle.renderNode(runManager.visibleNodes[0]);
		  		}
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