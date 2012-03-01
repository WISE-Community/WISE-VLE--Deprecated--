
SVGDrawNode.prototype = new Node();
SVGDrawNode.prototype.constructor = SVGDrawNode;
SVGDrawNode.prototype.parent = Node.prototype;
SVGDrawNode.authoringToolName = "Draw";
SVGDrawNode.authoringToolDescription = "Students draw using basic drawing tools, take snapshots and create flipbook animations";

/**
 * @constructor
 * @extends Node
 * @param nodeType
 * @param view
 * @returns {SVGDrawNode}
 */
function SVGDrawNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
	this.importableFromNodes = new Array("SVGDrawNode","OpenResponseNode","NoteNode");	
	this.importableFileExtensions = new Array(
			"jpg", "png", "gif", "svg");
};

SVGDrawNode.prototype.updateJSONContentPath = function(base){
	var rExp = new RegExp(this.filename);
	this.content.replace(rExp, base + '/' + this.filename);
};

SVGDrawNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return SVGDRAWSTATE.prototype.parseDataJSONObj(stateJSONObj);
};

/**
 * Returns the base64 encoded svgstring of the latest work
 * @param studentWork json
 * @return base64 encoded svgstring
 */
SVGDrawNode.prototype.translateStudentWork = function(studentWork) {
	// if the student data has been compressed, decompress it
	if(typeof studentWork == "string"){
		if (studentWork.match(/^--lz77--/)) {
			var lz77 = new LZ77();
			studentWork = studentWork.replace(/^--lz77--/, "");
			studentWork = $.parseJSON(lz77.decompress(studentWork));
		}
	}
	
	var svgString = studentWork.svgString;
	// if the svg has been compressed, decompress it
	if (svgString.match(/^--lz77--/)) {
		var lz77 = new LZ77();
		svgString = svgString.replace(/^--lz77--/, "");
		svgString = lz77.decompress(svgString);
	}
	svgString = Utils.encode64(svgString);
	return svgString;
	
};

/**
 * Imports and inserts the work from the specified importFromNode
 * @param importFromNode node that has the data for this node to import
 */
SVGDrawNode.prototype.importWork = function(importFromNode) {
	if (this.canImportWork(importFromNode)) {
		if (importFromNode.type == "SVGDrawNode") {
			var studentWork = this.view.state.getLatestWorkByNodeId(importFromNode.id);
			if (studentWork != null) {
		        var studentWorkSVG = Utils.decode64(this.translateStudentWork(studentWork));
		        
		        // only get the studentlayer. remove newlines and regex for what's inside <title>student</title>...</g>
		        studentWorkSVG = studentWorkSVG.replace(/[\n\r\t]/g,"").match("<title>student</title>(.*)</g>")[1];

				var svgStringBefore = this.contentPanel.svgCanvas.getSvgString();
				var svgStringAfter = svgStringBefore.replace("<title>student</title>", "<title>student</title>" + studentWorkSVG);
				this.contentPanel.svgCanvas.setSvgString(svgStringAfter);
			}		
		}
	}
};

/**
 * Returns true iff the given file can be imported 
 * into this step's work.
 */
SVGDrawNode.prototype.canImportFile = function(filename) {
	if (filename.indexOf(".") != -1) {
		var fileExt = filename.substr(filename.lastIndexOf(".")+1);	
		if (this.importableFileExtensions.indexOf(fileExt.toLowerCase()) != -1) {
			return true;
		}
	}
	return false;
};

/**
 * Imports and inserts the specified file into current drawing.
 * @param file to insert into current canvas
 * @return true if import is successful
 */
SVGDrawNode.prototype.importFile = function(filename) {
	if (this.canImportFile(filename)) {
		var importFileSVG = '<image x="250" y="150" height="150" width="150" xlink:href="'+filename+'" />';
		var svgStringBefore = this.contentPanel.svgCanvas.getSvgString();
		var svgStringAfter = svgStringBefore.replace("<title>student</title>", "<title>student</title>" + importFileSVG);
			
		// xmlns:xlink="http://www.w3.org/1999/xlink" <- make sure this is in xml namespace.
		if (svgStringAfter.indexOf('xmlns:xlink="http://www.w3.org/1999/xlink"') == -1) {
			svgStringAfter = svgStringAfter.replace("<svg ", "<svg " + 'xmlns:xlink="http://www.w3.org/1999/xlink" ');
		}

		this.contentPanel.svgCanvas.setSvgString(svgStringAfter);
		return true;
	}
	return false;
};

/**
 * This is called when the node is exited
 * @return
 */
SVGDrawNode.prototype.onExit = function() {
	//check if the content panel has been set
	if(this.contentPanel) {
		try {
			/*
			 * check if the onExit function has been implemented or if we
			 * can access attributes of this.contentPanel. if the user
			 * is currently at an outside link, this.contentPanel.onExit
			 * will throw an exception because we aren't permitted
			 * to access attributes of pages outside the context of our
			 * server.
			 */
			if(this.contentPanel.onExit) {
				try {
					//run the on exit cleanup
					this.contentPanel.onExit();					
				} catch(err) {
					//error when onExit() was called, e.g. mysystem editor undefined
				}
			}	
		} catch(err) {
			/*
			 * an exception was thrown because this.contentPanel is an
			 * outside link. we will need to go back in the history
			 * and then trying to render the original node.
			 */
			history.back();
			//setTimeout(function() {thisObj.render(this.ContentPanel)}, 500);
		}
	}
};

/**
 * SVGDraw does not actually use this function to render the grading view.
 * The grading view for SVGDraw steps is handled a special way in the vle code.
 * 
 * @param divId the id of the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 * 
 */
SVGDrawNode.prototype.renderGradingView = function(divId, nodeVisit, childDivIdPrefix, workgroupId) {
	//do nothing
	//TODO: render grading view here and not in gradingview_display
};

SVGDrawNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/draw/svg-edit/svg-editor.html');
};

/**
 * Whether this step type has a grading view. Steps types that do not
 * save any student work will not have a grading view such as HTMLNode
 * and OutsideUrlNode.
 * @returns whether this step type has a grading view
 */
SVGDrawNode.prototype.hasGradingView = function() {
	return true;
};

NodeFactory.addNode('SVGDrawNode', SVGDrawNode);
	
//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/draw/SVGDrawNode.js');
};