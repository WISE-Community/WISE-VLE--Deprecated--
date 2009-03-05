var htmlPageTypes = new Array("OTReadingPage", "OTIntroPage", "OTVideoPage", "OTExamplePage", "OTDisplayPage", "OTEvidence");
var customPageTypes = new Array("OTMatchSequence", "OTFillin", "OTStudentAssessment", "OTQuestionAnswer", "OTJournalStep", "OTNote", "OutsideUrl", "OTBlueJ", "OTQuiz");

// IE 7 doesn't have indexOf method.........
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}


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
			case "OutsideUrl": return new OutsideUrlNode("outsideurl"); break;
			case "OTQuiz": return new MultipleChoiceNode(); break;
			case "OTBlueJ": return new BlueJNode(); break;
			case "OTMatchSequence": return new MatchSequenceNode("OTMatchSequence"); break;
			case "OTFillin": return new FillinNode("OTFillin"); break;
			case "OTJournalStep": return new JournalNode("OTJournalStep"); break;
			case "OTNote": return new NoteNode("OTNote"); break;
			case "OutsideUrl": return new OutsideUrlNode("OutsideUrl"); break;
			case "OTQuiz": return new MultipleChoiceNode("OTQuiz"); break;
			case "OTBlueJ": return new BlueJNode("OTBlueJ"); break;
			default: break;
		}
		return new CustomNode(nodeType);
	} else {
		return new Node(nodeType);		
	}
}

//TODO: make PasOtmlProject 'really' inherit from Project and make getSummaryProjectHTML
// a function of parent Project
//
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
	vle = new VLE();

	this.xmlDocObj.loadedEvent.subscribe(this.onLoadedEvent, this);
}

PasOtmlProject.prototype.onLoadedEvent = function(type, args, me) {
	//alert("pasotmlproject.js, onloadedevent");
	//alert("args: " + args);
	//alert("args.length: " + args.length);
	//alert("args[0]: " + args[0]);
	me.xmlDoc = args[0];
	me.generateNode();
	//alert(me.rootNode.id);
	var dfs = new DFS(me.rootNode);
	vle.setProject(me);
	vle.navigationLogic = new NavigationLogic(dfs);
	vle.setConnection(new ConnectionManager());
	setTimeout("vle.renderNode('0:1:0')", 3000);
}

PasOtmlProject.prototype.generateNode = function(xmlDoc) {
	//alert(this.xmlDoc);
	//alert('pasOtmlproject.generateNode: ' + this.xmlDocObj + ", " + this.xmlDocObj.xmlDoc);
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
	//var activities = this.xmlDocObj.xmlDoc.getElementsByTagName("OTPasActivity"); works for ff but not ie...stupid ie
	var activities = null;
	if (xmlDoc) {
		//alert('xmlDoc:' + xmlDoc);
		//alert(xmlDoc);
		activities = xmlDoc.getElementsByTagName("OTPasActivity");
		//alert('activites.length0:' + activities.length);
		this.xmlDoc = xmlDoc;
	} else {
		//alert('no xmldoc. resorting to this.xmlDoc');
		activities = this.xmlDoc.getElementsByTagName("OTPasActivity");
	}
	//alert('activities.length:' + activities.length);
	for (var i=0; i < activities.length; i++) {
		stepId = 0;
		var activity = activities[i];
		var activityNode = new Node();
		activityNode.parent = this.rootNode;
		activityNode.id = activityNode.parent.id + ":" + activityId;
		activityNode.setType("Activity");
		activityNode.title = activity.getAttribute('title');
		var childNodes = activity.getElementsByTagName("stepList")[0].childNodes;
		//alert('activityId: ' + activityId + ', childnodes.length:' + childNodes.length);
		for (var j=0; j < childNodes.length; j++) {
			//alert('child: ' + j);
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

PasOtmlProject.prototype.getSummaryProjectHTML = function(){
	var projectHTML = "<h3>Project Summary</h3>";
	
	function getNodeInfo(node, depth){
		var html = "<br>";
		var tab = '&nbsp;';
		
		for(var y=0;y<(depth*2);y++){
			html = html + tab;
		};
		
		html = html + node.type + '   ' + node.getTitle();
		for(var z=0;z<node.children.length;z++){
			html = html + getNodeInfo(node.children[z], depth + 1);
		};
		return html;
	};
	
	projectHTML = projectHTML + getNodeInfo(this.rootNode, 0);
	return projectHTML;
};

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
