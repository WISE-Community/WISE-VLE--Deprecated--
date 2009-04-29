/*
 * NoteNode is a child of openresponse
 */

NoteNode.prototype = new Node();
NoteNode.prototype.constructor = NoteNode;
NoteNode.prototype.parent = Node.prototype;
function NoteNode(nodeType) {
	this.type = nodeType;
	
	//The second argument passed to the
    //constructor is a configuration object:
	if (notePanel == null) {
		notePanel = new YAHOO.widget.Panel("notePanel", {
			width: "600px",
			height: "600px",
			fixedcenter: false,
			constraintoviewport: true,
			underlay: "shadow",
			close: true,
			visible: false,
			draggable: true
		});
		//If we haven't built our panel using existing markup,
		//we can set its content via script:
		notePanel.setHeader("My Notes");
		notePanel.setBody("<iframe name=\"noteiframe\" id=\"noteiframe\" width=\"100%\" height=\"100%\" src=\"vle/js/node/openresponse/note.html\"><iframe>");
		//Although we configured many properties in the
		//constructor, we can configure more properties or 
		//change existing ones after our Panel has been
		//instantiated:

		notePanel.cfg.setProperty("underlay", "matte");
		notePanel.render();
	}
}

function loadNote() {
	//alert('loadNote function called');
	//window.frames["noteiframe"].loadFromVLE(this, vle);
	//alert('done loadNote function');
}

NoteNode.prototype.render = function(contentpanel) {	
	//alert('notenode render begin');
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
	//window.frames["noteiframe"].loadContentXMLString("<assessmentItem xmlns='http://www.imsglobal.org/xsd/imsqti_v2p0' xmlns:ns3='http://www.w3.org/1998/Math/MathML' xmlns:ns2='http://www.w3.org/1999/xlink' timeDependent='false' adaptive='false'><responseDeclaration identifier='CHOICE_SELF_CHECK_ID'><correctResponse interpretation='choice 3' /></responseDeclaration><responseDeclaration identifier='TEXT_ASSMT_0' /><responseDeclaration identifier='TEXT_ASSMT_1' /><responseDeclaration identifier='CHOICE_ASSMT_0'><correctResponse><value isDefault='false' isCorrect='false'>SIMPLE_CHOICE_ID1</value></correctResponse></responseDeclaration><itemBody><extendedTextInteraction hasInlineFeedback='false' responseIdentifier='TEXT_ASSMT_0' expectedLines='10'><prompt>&lt;!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'&gt;&lt;html xmlns='http://www.w3.org/1999/xhtml'&gt;&lt;head&gt;&lt;meta name='generator' content='HTML Tidy for Java (vers. 26 Sep 2004), see www.w3.org' /&gt;&lt;title&gt;&lt;/title&gt;&lt;link href='../common/css/htmlAssessment.css' href='openresponse.css' href='http://tels-group.soe.berkeley.edu/uccp/Assets/css/UCCP.css' media='screen' rel='stylesheet' type='text/css' /&gt;&lt;/head&gt;&lt;body&gt;&lt;p class='selfCheckQuestion'&gt;If you are in high school, do you plan on taking the AP Computer science test? Why or why not?&lt;/p&gt;&lt;/body&gt;&lt;/html&gt;</prompt></extendedTextInteraction></itemBody></assessmentItem>");
	window.frames["noteiframe"].loadContentXMLString(this.element);
	window.frames["noteiframe"].loadStateAndRender(vle, states);
	notePanel.cfg.setProperty("visible", true);
	//alert('notenode render end');
} 

NoteNode.prototype.load = function() {
	//alert('notenode.load');
	//window.frames["noteiframe"].loadContentXMLString("<assessmentItem xmlns='http://www.imsglobal.org/xsd/imsqti_v2p0' xmlns:ns3='http://www.w3.org/1998/Math/MathML' xmlns:ns2='http://www.w3.org/1999/xlink' timeDependent='false' adaptive='false'><responseDeclaration identifier='CHOICE_SELF_CHECK_ID'><correctResponse interpretation='choice 3' /></responseDeclaration><responseDeclaration identifier='TEXT_ASSMT_0' /><responseDeclaration identifier='TEXT_ASSMT_1' /><responseDeclaration identifier='CHOICE_ASSMT_0'><correctResponse><value isDefault='false' isCorrect='false'>SIMPLE_CHOICE_ID1</value></correctResponse></responseDeclaration><itemBody><extendedTextInteraction hasInlineFeedback='false' responseIdentifier='TEXT_ASSMT_0' expectedLines='10'><prompt>&lt;!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'&gt;&lt;html xmlns='http://www.w3.org/1999/xhtml'&gt;&lt;head&gt;&lt;meta name='generator' content='HTML Tidy for Java (vers. 26 Sep 2004), see www.w3.org' /&gt;&lt;title&gt;&lt;/title&gt;&lt;link href='../common/css/htmlAssessment.css' href='openresponse.css' href='http://tels-group.soe.berkeley.edu/uccp/Assets/css/UCCP.css' media='screen' rel='stylesheet' type='text/css' /&gt;&lt;/head&gt;&lt;body&gt;&lt;p class='selfCheckQuestion'&gt;If you are in high school, do you plan on taking the AP Computer science test? Why or why not?&lt;/p&gt;&lt;/body&gt;&lt;/html&gt;</prompt></extendedTextInteraction></itemBody></assessmentItem>");
	
	//the content for these steps are now loaded from the vle/otml
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