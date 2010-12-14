
SVGDrawNode.prototype = new Node();
SVGDrawNode.prototype.constructor = SVGDrawNode;
SVGDrawNode.prototype.parent = Node.prototype;
SVGDrawNode.authoringToolName = "SVG Draw";
SVGDrawNode.authoringToolDescription = "Students draw using basic drawing tools";
function SVGDrawNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
	this.exportableToNodes = new Array(			
			"SVGDrawNode");	
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
 * Returns true iff this node can export work to the specified node.
 * @param exportToNode node to export work into
 * @return true/false
 */
SVGDrawNode.prototype.canExportWork = function(exportToNode) {
	return this.exportableToNodes &&
		this.exportableToNodes.indexOf(exportToNode.type) > -1;
};

/**
 * Returns a string of the work so that it can be imported by the specified exportToNode
 * @param exportToNode node that will import the return value of this method
 * @return null if this node cannot export work to the exportToNode
 */
SVGDrawNode.prototype.exportWork = function(exportToNode) {	
	if (exportToNode.type == "SVGDrawNode") {
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
	        debugger;
	        var latestState = states[states.length - 1];
	        var studentWork = latestState.getStudentWork();
	        
	        studentWork = Utils.decode64(this.translateStudentWork(studentWork));
	        
	        // only get the studentlayer. remove newlines and regex for what's inside <title>student</title>...</g>
	        studentWork = studentWork.replace(/[\n\r\t]/g,"").match("<title>student</title>(.*)</g>")[1];
	        
			return studentWork;
	    };			
	};
	return null;
};

/**
 * Imports and inserts the work from the specified importFromNode
 * @param importFromNode node that will export the data for this node to import
 * @return
 */
SVGDrawNode.prototype.importWork = function(importFromNode) {
	var studentWorkSVG = importFromNode.exportWork(this);
	if (studentWorkSVG != null) {
		var svgStringBefore = this.contentPanel.svgCanvas.getSvgString();
		var svgStringAfter = svgStringBefore.replace("<title>student</title>", "<title>student</title>" + studentWorkSVG);
		this.contentPanel.svgCanvas.setSvgString(svgStringAfter);
	}
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

SVGDrawNode.prototype.getHTMLContentTemplate = function() {
	return createContent('node/draw/svg-edit/svg-editor.html');
};

NodeFactory.addNode('SVGDrawNode', SVGDrawNode);
	
//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/draw/SVGDrawNode.js');
};