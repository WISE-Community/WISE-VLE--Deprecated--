/*
 * CustomNode
 */

CustomNode.prototype = new Node();
CustomNode.prototype.constructor = CustomNode;
CustomNode.prototype.parent = Node.prototype;
function CustomNode(nodeType) {
	this.type = nodeType;
}

CustomNode.prototype.render = function(contentpanel) {
	window.frames["ifrm"].location = "js/node/openresponse/openresponse.html";
} 

CustomNode.prototype.load = function() {
	//window.frames["ifrm"].loadContentXMLString("<assessmentItem xmlns='http://www.imsglobal.org/xsd/imsqti_v2p0' xmlns:ns3='http://www.w3.org/1998/Math/MathML' xmlns:ns2='http://www.w3.org/1999/xlink' timeDependent='false' adaptive='false'><responseDeclaration identifier='CHOICE_SELF_CHECK_ID'><correctResponse interpretation='choice 3' /></responseDeclaration><responseDeclaration identifier='TEXT_ASSMT_0' /><responseDeclaration identifier='TEXT_ASSMT_1' /><responseDeclaration identifier='CHOICE_ASSMT_0'><correctResponse><value isDefault='false' isCorrect='false'>SIMPLE_CHOICE_ID1</value></correctResponse></responseDeclaration><itemBody><extendedTextInteraction hasInlineFeedback='false' responseIdentifier='TEXT_ASSMT_0' expectedLines='10'><prompt>&lt;!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'&gt;&lt;html xmlns='http://www.w3.org/1999/xhtml'&gt;&lt;head&gt;&lt;meta name='generator' content='HTML Tidy for Java (vers. 26 Sep 2004), see www.w3.org' /&gt;&lt;title&gt;&lt;/title&gt;&lt;link href='../common/css/htmlAssessment.css' href='openresponse.css' href='http://tels-group.soe.berkeley.edu/uccp/Assets/css/UCCP.css' media='screen' rel='stylesheet' type='text/css' /&gt;&lt;/head&gt;&lt;body&gt;&lt;p class='selfCheckQuestion'&gt;If you are in high school, do you plan on taking the AP Computer science test? Why or why not?&lt;/p&gt;&lt;/body&gt;&lt;/html&gt;</prompt></extendedTextInteraction></itemBody></assessmentItem>");
	
	//these steps are now loaded from the vle/otml
	window.frames["ifrm"].loadFromVLE(this, vle);
	document.getElementById('topStepTitle').innerHTML = this.title;
}


CustomNode.prototype.getShowAllWorkHtml = function(){
    var showAllWorkHtmlSoFar = "<h4>" + this.title + "</h4>";
    var nodeVisitArray = vle.state.getNodeVisitsByNodeId(this.id);
    
    if (nodeVisitArray.length > 0) {
        var states = [];
        for (var i = 0; i < nodeVisitArray.length; i++) {
            var nodeVisit = nodeVisitArray[i];
            for (var j = 0; j < nodeVisit.nodeStates.length; j++) {
                states.push(nodeVisit.nodeStates[j]);
            }
        }
		if (states.length > 0) {
			var latestState = states[states.length - 1];
			showAllWorkHtmlSoFar += "(checkmark goes here!) You have visited this page. You wrote:<br/>" + latestState.response;
		} else {
			showAllWorkHtmlSoFar += "(checkmark goes here!) You have visited this page, but you haven't done any work";
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



/**
 * Override
 */
CustomNode.prototype.getDataXMLOld = function() {
	    var nodeVisitArray = vle.state.getNodeVisitsByNodeId(this.id);
	    
	    if (nodeVisitArray.length > 0) {
	        var states = [];
	        for (var i = 0; i < nodeVisitArray.length; i++) {
	            var nodeVisit = nodeVisitArray[i];
	            for (var j = 0; j < nodeVisit.nodeStates.length; j++) {
	                states.push(nodeVisit.nodeStates[j]);
	            }
	        }
			if (states.length > 0) {
				var showAllWorkHtmlSoFar = "";
				for (var k=0; k < states.length; k++) {
					var latestState = states[k];
					showAllWorkHtmlSoFar += latestState.response;
				}
				return "<nodedata>" + showAllWorkHtmlSoFar + "</nodedata>";
			} else {
				return "<notedata>You have visited this page, but you haven't done any work</nodedata>";

				showAllWorkHtmlSoFar += "(checkmark goes here!) You have visited this page, but you haven't done any work";
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


CustomNode.prototype.getDataXML = function(nodeStates) {
	return CustomNode.prototype.parent.getDataXML(nodeStates);
}