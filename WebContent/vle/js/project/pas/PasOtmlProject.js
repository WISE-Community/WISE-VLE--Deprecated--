var htmlPageTypes = new Array("OTReadingPage", "OTIntroPage", "OTVideoPage", "OTExamplePage", "OTDisplayPage", "OTEvidence");
var customPageTypes = new Array("OTMatchSequence", "OTFillin", "OTStudentAssessment", "OTQuestionAnswer", "OTJournalStep", "OTNote", "OutsideUrl", "OTBlueJ");

/*
 * Override
 */
function NodeFactory() {
}

/*
 * Override
 */
NodeFactory.createNode = function (nodeType){
	if (nodeType == null) {
		return new Node();		
	} else if (htmlPageTypes.indexOf(nodeType) > -1) {
		return new HtmlNode(nodeType);
	} else if (customPageTypes.indexOf(nodeType) > -1) {
		switch (nodeType) {
			case "OTMatchSequence": return new MatchSequenceNode(); break;
			case "OTFillin": return new FillinNode(); break;
			case "OTJournalStep": return new JournalNode(); break;
			case "OTNote": return new NoteNode(); break;
			case "OutsideUrl": return new OutsideUrlNode(); break;
			case "OTBlueJ": return new BlueJNode(); break;
			default: break;
		}
		return new CustomNode(nodeType);
	} else {
		return new Node(nodeType);		
	}
}


//PasOtmlProject.prototype = new Project();
PasOtmlProject.prototype.constructor = PasOtmlProject;
PasOtmlProject.prototype.parent = Project.prototype;

/*
function PasOtmlProject(xmlDoc) {
	this.xmlDoc = xmlDoc;
	this.rootNode = null;
	
	this.generateNode();
}
*/

function PasOtmlProject(xmlDocObj) {
	//alert('PasOtmlProject:' + xmlDocObj);
	this.xmlDocObj = xmlDocObj;
	this.xmlDoc = null;
	this.rootNode = null;

	this.xmlDocObj.loadedEvent.subscribe(this.onLoadedEvent, this);
}

PasOtmlProject.prototype.onLoadedEvent = function(type, args, me) {
	me.generateNode();
	//alert(me.rootNode.id);
	var dfs = new DFS(me.rootNode);
	vle = new VLE();
	vle.setProject(me);
	vle.navigationLogic = new NavigationLogic(dfs);
	vle.setConnection(new ConnectionManager());
	vle.renderNode("0:0:0");
}

PasOtmlProject.prototype.generateNode = function() {
	this.rootNode = new Node();
	this.rootNode.type = "Project";
	this.rootNode.id = 0;


    // experimental begin for jounral
	/*
    var journalNode = new JournalNode();
    journalNode.parent = this.rootNode;
    journalNode.id = "journal";
    journalNode.setType("journal");
    journalNode.title = "journal"
	this.rootNode.addChildNode(journalNode);
	*/
    // experimental end for journal


	var activityId = 0;
	var stepId = 0;
	var activities = this.xmlDocObj.xmlDoc.getElementsByTagName("OTPasActivity");
	for (var i=0; i < activities.length; i++) {
		stepId = 0;
		var activity = activities[i];
		var activityNode = new Node();
		activityNode.parent = this.rootNode;
		activityNode.id = activityNode.parent.id + ":" + activityId;
		activityNode.setType("Activity");
		activityNode.title = activity.getAttribute('title');
		var childNodes = activity.getElementsByTagName("stepList")[0].childNodes;
		for (var j=0; j < childNodes.length; j++) {
			if (childNodes[j].nodeName != "#text") {
				var stepNode = NodeFactory.createNode(childNodes[j].nodeName);
				stepNode.parent = activityNode;
				stepNode.id = stepNode.parent.id + ":" + stepId;
				stepNode.title = childNodes[j].getAttribute('title');
				stepNode.element = childNodes[j];
				activityNode.addChildNode(stepNode);
				stepId++;
			} else {
			}
		}
		this.rootNode.addChildNode(activityNode);
		activityId++;
	}
}

PasOtmlProject.prototype.getShowAllWorkHtml = function() {
	var htmlSoFar = "";
	var activityNodes = this.rootNode.children;
	for (var i=0; i<activityNodes.length;i++) {
		htmlSoFar += "<h3>Activity: " + activityNodes[i].title +"</h3>";
		var stepNodesInActivity = activityNodes[i].children;
		for (var j = 0; j < stepNodesInActivity.length; j++) {
			htmlSoFar += stepNodesInActivity[j].getShowAllWorkHtml();
			htmlSoFar += "<br/><br/>";
		}
	}
	return htmlSoFar;
}

Node.prototype.isLocked = function() {
	//alert('here');
	var stepIndexInActivity = this.id.substr(this.id.lastIndexOf(":", this.id.length) + 1);
	//alert(stepIndexInActivity);
	if (stepIndexInActivity % 2 == 0) {
		return true;
	}
	return false;
}

/**
 * @Override
 * PasOtmlProject's own way of rendering Nodes
 * This will be overriden by FillinNode.render, HtmlNode.render, etc.
 * Renders itself to the specified content panel
 */
Node.prototype.render = function(contentpanel) {
	var content = "";
	content = this.type + "<br/>id: " + this.id;
	window.frames["ifrm"].document.write(content);   
	window.frames["ifrm"].document.close(); 	
}
