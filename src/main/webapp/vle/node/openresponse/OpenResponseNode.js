/**
 * An OpenResponseNode is a representation of an OpenResponse assessment item
 *
 */

OpenResponseNode.prototype = new Node();
OpenResponseNode.prototype.constructor = OpenResponseNode;
OpenResponseNode.prototype.parent = Node.prototype;
OpenResponseNode.authoringToolName = "Open Response";
OpenResponseNode.authoringToolDescription = "Students write text to answer a question or explain their thoughts";

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {OpenResponseNode}
 */
function OpenResponseNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
	this.exportableToNodes = new Array(			
			"NoteNode", 
			"OpenResponseNode", 
			"SVGDrawNode");	
	this.importableFileExtensions = new Array(
			"jpg", "png");
};

/**
 * Takes in a state JSON object and returns an OPENRESPONSESTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return an OPENRESPONSESTATE object
 */
OpenResponseNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return OPENRESPONSESTATE.prototype.parseDataJSONObj(stateJSONObj);
};

OpenResponseNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * Get the prompt for the peer review view
 */
OpenResponseNode.prototype.getPeerReviewPrompt = function() {
	if(this.or == null) {
		//create an OPENRESPONSE to load the content
		this.or = new OPENRESPONSE(this);	
	}
	
	//retrieve the prompt from the OPENRESPONSE content
	var peerReviewPrompt = this.or.getPeerReviewPrompt();
	return peerReviewPrompt;
};

/**
 * Get the other student's work that will be peer reviewed.
 * We will get the other student's work by parsing the JSON 
 * NodeVisit obj that is passed in.
 * @param otherStudentWorkJSONObj a JSON object containing a NodeVisit of
 * the other student's work
 * @return the other student's work
 */
OpenResponseNode.prototype.getPeerReviewOtherStudentWork = function(otherStudentWorkJSONObj) {
	if(this.or == null) {
		this.or = new OPENRESPONSE(this);	
	}
	
	var peerReviewOtherStudentWork = this.or.getPeerReviewOtherStudentWork(otherStudentWorkJSONObj);
	return peerReviewOtherStudentWork;
};

/**
 * Returns true iff this node can export work to the specified node.
 * @param exportToNode node to export work into
 * @return true/false
 */
OpenResponseNode.prototype.canExportWork = function(exportToNode) {
	return this.exportableToNodes &&
		this.exportableToNodes.indexOf(exportToNode.type) > -1;
};

/**
 * Returns a string of the work so that it can be imported by the specified exportToNode
 * @param exportToNode node that will import the return value of this method
 * @return null if this node cannot export work to the exportToNode
 */
OpenResponseNode.prototype.exportWork = function(exportToNode) {	
	if (this.canExportWork(exportToNode)) {
	    var nodeVisitArray = this.view.state.getNodeVisitsByNodeId(this.id);
	    if (nodeVisitArray.length > 0) {
	        var states = [];
	        var latestNodeVisit = nodeVisitArray[nodeVisitArray.length -1];
	        for (var i = 0; i < nodeVisitArray.length; i++) {
	            var nodeVisit = nodeVisitArray[i];
	            for (var j = 0; j < nodeVisit.nodeStates.length; j++) {
	                states.push(nodeVisit.nodeStates[j]);
	            }
	        }
	        var latestState = states[states.length - 1];
	        var studentWork = latestState.getStudentWork();
	        
	        if (exportToNode.type == "SVGDrawNode") {
	        	var svgString = '<text x="250" y="150" font-family="Verdana" font-size="35" fill="black" >'
				+ studentWork
				+ '</text>';
				return svgString;
	        } else {
	        	return studentWork;
	        }
	    };			
	};
	return null;
};

/**
 * Imports and inserts the work from the specified importFromNode
 * @param importFromNode node that will export the data for this node to import
 * @return
 */
OpenResponseNode.prototype.importWork = function(importFromNode) {
	var studentWork = importFromNode.exportWork(this);
	if (studentWork != null) {
		if(this.contentPanel && this.contentPanel.or) {
			this.contentPanel.or.appendResponse(studentWork);
		}
	};
};

/**
 * Returns true iff the given file can be imported 
 * into this step's work.
 */
OpenResponseNode.prototype.canImportFile = function(filename) {
	// can't import if this is not in a rich text editor mode.
	if (this.contentPanel.or.content.isRichTextEditorAllowed) {
		if (filename.indexOf(".") != -1) {
			var fileExt = filename.substr(filename.lastIndexOf(".")+1);	
			if (this.importableFileExtensions.indexOf(fileExt.toLowerCase()) != -1) {
			return true;
			}
		}
	}
	return false;
};

/**
 * Imports and inserts the specified file into current response.
 * @param file to insert into response
 * @return true iff import is successful
 */
OpenResponseNode.prototype.importFile = function(filename) {
	if (this.canImportFile(filename)) {
		var importFileHTML = "<img src='"+filename+"'></img>";
		this.contentPanel.or.appendResponse(importFileHTML);
		return true;
	}
	return false;
};


/**
 * Sets up a WorkOnXConstraint before rendering so that students will
 * not be able to navigate to any other step before completing work on
 * this step if that was specified in the content.
 * 
 * @param contentPanel
 * @param studentWork
 */
OpenResponseNode.prototype.render = function(contentPanel,studentWork, disable) {
	/* add a new constraint for this node if the content specifies that
	 * student must complete work before exiting to another step */		
	if (this.content.getContentJSON().isMustCompleteAllPartsBeforeExit) {
		this.view.eventManager.fire('addConstraint',{type:'WorkOnXConstraint', x:{id:this.id, mode:'node'}, id:this.utils.generateKey(20)});
	}
	/* call super */
	Node.prototype.render.call(this, contentPanel, studentWork, disable);
};

/**
 * Called when the step is exited. This is used for auto-saving.
 */
OpenResponseNode.prototype.onExit = function() {
	//check if the content panel exists
	if(this.contentPanel && this.contentPanel.save) {
		//tell the content panel to save
		this.contentPanel.save();
	};
};

/**
 * Renders the student work into the div. The grading tool will pass in a
 * div id to this function and this function will insert the student data
 * into the div.
 * 
 * @param divId the id of the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 * 
 * TODO: rename TemplateNode
 * Note: you may need to add code to this function if the student
 * data for your step is complex or requires additional processing.
 * look at SensorNode.renderGradingView() as an example of a step that
 * requires additional processing
 */
OpenResponseNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
	/*
	 * Get the latest student state object for this step
	 * TODO: rename templateState to reflect your new step type
	 * 
	 * e.g. if you are creating a quiz step you would change it to quizState
	 */
	var openResponseState = nodeVisit.getLatestWork();
	
	/*
	 * get the step work id from the node visit in case we need to use it in
	 * a DOM id. we don't use it in this case but I have retrieved it in case
	 * someone does need it. look at SensorNode.js to view an example of
	 * how one might use it.
	 */
	var stepWorkId = nodeVisit.id;
	
	/*
	 * TODO: rename templateState to match the variable name you
	 * changed in the previous line above
	 */
	var studentWork = openResponseState.response;
	
	if(studentWork != null && studentWork.constructor.toString().indexOf("Array") != -1) {
		/*
		 * response is an array so we will use the toString() of the array
		 * which should give us just the text within it
		 */
		studentWork = studentWork.toString();
	}
	
	//put the student work into the div
	$('#' + divId).html(studentWork);
};

OpenResponseNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/openresponse/openresponse.html');
};

NodeFactory.addNode('OpenResponseNode', OpenResponseNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/openresponse/OpenResponseNode.js');
};