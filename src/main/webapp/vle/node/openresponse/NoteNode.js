/*
 * NoteNode is a child of openresponse
 */

NoteNode.prototype = new OpenResponseNode();
NoteNode.prototype.constructor = NoteNode;
NoteNode.prototype.parent = OpenResponseNode.prototype;
NoteNode.authoringToolName = "Reflection Note";
NoteNode.authoringToolDescription = "Students write text to answer a question or explain their thoughts";

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {NoteNode}
 */
function NoteNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
	this.studentWork;
	this.exportableToNodes = new Array(			
			"NoteNode", 
			"OpenResponseNode", 
			"SVGDrawNode");		
};

/**
 * Note nodes ignore the content panel and just renders in the global note panel.
 * Unlike other nodes, the note does not need to wait for scripts to load. The baseHtmlContent
 * for a note is just a div that gets written within another div, so the content should
 * be loaded during the render.
 * 
 * @param contentPanel
 * @param studentWork
 */
NoteNode.prototype.render = function(contentPanel, studentWork){
	this.studentWork = studentWork;
	
	/* set the baseHtmlContent if it has not yet been set up */
	if(!this.baseHtmlContent){
		this.baseHtmlContent = this.view.getHTMLContentTemplate(this);
	}
	
	/* Set self as the active note node. Only one note can be active at a time */
	$('#notePanel').html(this.injectBaseRef(this.injectKeystrokeManagerScript(this.view.injectVleUrl(this.baseHtmlContent.getContentString()))));
	this.view.activeNote = new OPENRESPONSE(this, this.view);
	
	/* disable rich text editing for notes for now */
	this.view.activeNote.content.isRichTextEditorAllowed = false;
	
	/* render the content for this node */
	this.view.activeNote.render();
	
	/* show the note panel */
	$('#notePanel').dialog('open');
	
	//apply iframe draggable fix
	$(".ui-draggable").draggable( "option", "iframeFix", true );
	$( ".ui-draggable" ).resizable( "option", "ghost", true );
};

/**
 * Called when the step is exited. This is used for auto-saving.
 */
NoteNode.prototype.onExit = function() {
	/* check if there is an active note and tell it to save */
	if(this.view.activeNote) {
		this.view.activeNote.save();
	}
};

/**
 * Returns true iff this node can export work to the specified node.
 * @param exportToNode node to export work into
 * @return true/false
 */
NoteNode.prototype.canExportWork = function(exportToNode) {
	return this.exportableToNodes &&
		this.exportableToNodes.indexOf(exportToNode.type) > -1;
};

/**
 * Returns a string of the work so that it can be imported by the specified exportToNode
 * @param exportToNode node that will import the return value of this method
 * @return null if this node cannot export work to the exportToNode
 */
NoteNode.prototype.exportWork = function(exportToNode) {	
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
NoteNode.prototype.importWork = function(importFromNode) {
	var studentWork = importFromNode.exportWork(this);
	if (studentWork != null) {
		if(this.view && this.view.activeNote) {
			this.view.activeNote.appendResponse(studentWork);
		};
	};
};

NoteNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/openresponse/note.html');
};

NodeFactory.addNode('NoteNode', NoteNode);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/openresponse/NoteNode.js');
}