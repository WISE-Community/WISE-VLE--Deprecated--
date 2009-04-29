/*
 * NoteNode is a child of openresponse
 */

NoteNode.prototype = new Node();
NoteNode.prototype.constructor = NoteNode;
NoteNode.prototype.parent = Node.prototype;
function NoteNode(nodeType) {
	this.type = nodeType;
	this.notePanel;
	
	//The second argument passed to the
    //constructor is a configuration object:
	if (this.notePanel == null) {
		this.notePanel = new YAHOO.widget.Panel("notePanel", {
			width: "600px",
			height: "600px",
			fixedcenter: false,
			constraintoviewport: true,
			underlay: "shadow",
			close: true,
			visible: false,
			draggable: true
		});
		
		this.notePanel.setHeader("My Notes");
		this.notePanel.setBody("<iframe name=\"noteiframe\" id=\"noteiframe\" width=\"100%\" height=\"100%\" src=\"vle/js/node/openresponse/note.html\"><iframe>");

		this.notePanel.cfg.setProperty("underlay", "matte");
		this.notePanel.render();
	}
}

function loadNote() {
}

NoteNode.prototype.render = function(contentpanel) {
	var nodeVisits = vle.state.getNodeVisitsByNodeId(this.id);
	var states = [];
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var nodeVisit = vle.state.visitedNodes[i];
		if (nodeVisit.node.id == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			}
		}
	};
	window.frames["noteiframe"].loadContentXMLString(this.element);
	window.frames["noteiframe"].loadStateAndRender(vle, states);
	this.notePanel.cfg.setProperty("visible", true);
} 

NoteNode.prototype.load = function() {
	window.frames["noteiframe"].loadFromVLE(this, vle);
}


NoteNode.prototype.getShowAllWorkHtml = function(){
    var showAllWorkHtmlSoFar = "";
    var nodeVisitArray = vle.state.getNodeVisitsByNodeId(this.id);
    
    if (nodeVisitArray.length > 0) {
        var states = [];
        var latestNodeVisit = nodeVisitArray[nodeVisitArray.length -1];
        for (var i = 0; i < nodeVisitArray.length; i++) {
            var nodeVisit = nodeVisitArray[i];
            for (var j = 0; j < nodeVisit.nodeStates.length; j++) {
                states.push(nodeVisit.nodeStates[j]);
            }
        }
        
        if(latestNodeVisit!=null){
        	showAllWorkHtmlSoFar += " beginning on " + latestNodeVisit.visitStartTime;
        	if(latestNodeVisit.visitEndTime==null){
        		showAllWorkHtmlSoFar += " with no end time recorded.";
        	} else {
        		showAllWorkHtmlSoFar += " ending on " + latestNodeVisit.visitEndTime;
        	};
        };
        
		if (states.length > 0) {
			var latestState = states[states.length - 1];
			showAllWorkHtmlSoFar += "<br><br>You wrote:<br/>" + latestState.response;
		} else {
			showAllWorkHtmlSoFar += "<br><br>No work has been recorded!";
		}
    }
    else {
        showAllWorkHtmlSoFar += "You have NOT visited this page yet.";
    }
    
    for (var i = 0; i < this.children.length; i++) {
        showAllWorkHtmlSoFar += this.children[i].getShowAllWorkHtml();
    }
    return showAllWorkHtmlSoFar;
}

NoteNode.prototype.getDataXML = function(nodeStates) {
	return NoteNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
NoteNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an OPENRESPONSESTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(OPENRESPONSESTATE.prototype.parseDataXML(stateXML));
	}
	
	return statesArrayObject;
}

/**
 * Notes do not require translation of student's work so we will just
 * return what was passed in. Translation is only required by nodes
 * such as mc or mccb to translate their identifiers to values.
 * @param studentWork the student's work
 * @return the student's work
 */
NoteNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
}