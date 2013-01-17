
SVGDrawNode.prototype = new Node();
SVGDrawNode.prototype.constructor = SVGDrawNode;
SVGDrawNode.prototype.parent = Node.prototype;
SVGDrawNode.authoringToolName = "Draw";
SVGDrawNode.authoringToolDescription = "Students draw using basic drawing tools, take snapshots and create flipbook animations";

SVGDrawNode.tagMapFunctions = [
	{functionName:'importWork', functionArgs:[]},
	{functionName:'showPreviousWork', functionArgs:[]}
];

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
			"jpg", "jpeg", "png", "gif", "svg");
	
	this.tagMapFunctions = this.tagMapFunctions.concat(SVGDrawNode.tagMapFunctions);
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
SVGDrawNode.prototype.translateStudentWork = function(svgState) {
	//get the svg string
	studentWork = svgState.data;
	
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
		// use regex to put newly-imported file at the very top layer
		var svgStringAfter = svgStringBefore.replace(/<title>student<\/title>((.*\n\s)*)<\/g>/g, "<title>student</title>$1"+importFileSVG+"</g>");
	    
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
 * @param displayStudentWorkDiv the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 * 
 */
SVGDrawNode.prototype.renderGradingView = function(displayStudentWorkDiv, nodeVisit, childDivIdPrefix, workgroupId) {

	//get the node states
	var nodeStates = nodeVisit.nodeStates;
	
	//loop through all the node states from newest to oldest
	for(var x=nodeStates.length - 1; x>=0; x--) {
		//get a node state
		var nodeState = nodeStates[x];
		
		var studentWork = nodeState.data;
		var stepWorkId = nodeVisit.id;
		var timestamp = nodeState.timestamp;
		var autoScore = nodeState.autoScore;
		var autoFeedback = nodeState.autoFeedback;
		var autoFeedbackKey = nodeState.autoFeedbackKey;
		var checkWork = nodeState.checkWork;
		
		// if the work is for a SVGDrawNode, embed the svg
		var innerDivId = "svgDraw_"+stepWorkId+"_"+timestamp;
		var contentBaseUrl = this.view.config.getConfigParam('getContentBaseUrl');
		// if studentData has been compressed, decompress it and parse (for legacy compatibility)
		if (typeof studentWork == "string") {
			if (studentWork.match(/^--lz77--/)) {
				var lz77 = new LZ77();
				studentWork = studentWork.replace(/^--lz77--/, "");
				studentWork = lz77.decompress(studentWork);
				studentWork = $.parseJSON(studentWork);
			}
		} 
		var svgString = studentWork.svgString;
		var description = studentWork.description;
		var snaps = studentWork.snapshots;
		var contentUrl = this.getContent().getContentUrl();
		studentWork = "<div id='"+innerDivId+"_contentUrl' style='display:none;'>"+contentUrl+"</div>"+
			"<a class='drawEnlarge' onclick='enlargeDraw(\""+innerDivId+"\");'>enlarge</a>";
		// if the svg has been compressed, decompress it
		if (svgString != null){
			if (svgString.match(/^--lz77--/)) {
				var lz77 = new LZ77();
				svgString = svgString.replace(/^--lz77--/, "");
				svgString = lz77.decompress(svgString);
			}
			
			//svgString = svgString.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
			// only replace local hrefs. leave absolute hrefs alone!
			svgString = svgString.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, function(m,key,value) {
				  if (value.indexOf("http://") == -1) {
				    return m.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
				  }
				  return m;
				});
			svgString = svgString.replace(/(marker.*=)"(url\()(.*)(#se_arrow_bk)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
			svgString = svgString.replace(/(marker.*=)"(url\()(.*)(#se_arrow_fw)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
			//svgString = svgString.replace('<svg width="600" height="450"', '<svg width="360" height="270"');
			svgString = svgString.replace(/<g>/gmi,'<g transform="scale(0.6)">');
			svgString = Utils.encode64(svgString);
		}
		if(snaps != null && snaps.length>0){
			var snapTxt = "<div id='"+innerDivId+"_snaps' class='snaps'>";
			for(var i=0;i<snaps.length;i++){
				var snapId = innerDivId+"_snap_"+i;
				var currSnap = snaps[i].svg;
				if (currSnap.match(/^--lz77--/)) {
					var lz77 = new LZ77();
					currSnap = currSnap.replace(/^--lz77--/, "");
					currSnap = lz77.decompress(currSnap);
				}
				//currSnap = currSnap.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
				// only replace local hrefs. leave absolute hrefs alone!
				currSnap = currSnap.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, function(m,key,value) {
					  if (value.indexOf("http://") == -1) {
					    return m.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
					  }
					  return m;
					});
				
				currSnap = currSnap.replace(/(marker.*=)"(url\()(.*)(#se_arrow_bk)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
				currSnap = currSnap.replace(/(marker.*=)"(url\()(.*)(#se_arrow_fw)(\)")/gmi, '$1'+'"'+'$2'+'$4'+'$5');
				//currSnap = currSnap.replace('<svg width="600" height="450"', '<svg width="120" height="90"');
				currSnap = currSnap.replace(/<g>/gmi,'<g transform="scale(0.6)">');
				currSnap = Utils.encode64(currSnap);
				snapTxt += "<div id="+snapId+" class='snapCell' onclick='enlargeDraw(\""+innerDivId+"\");'>"+currSnap+"</div>";
				var currDescription = snaps[i].description;
				snapTxt += "<div id='"+snapId+"_description' class='snapDescription' style='display:none;'>"+currDescription+"</div>";
			}
			snapTxt += "</div>";
			studentWork += snapTxt;
		} else {
			studentWork += "<div id='"+innerDivId+"' class='svgdrawCell'>"+svgString+"</div>";
			if(description != null){
				studentWork += "<span>Description: </span><div id='"+innerDivId+"_description' class='drawDescription'>"+description+"</div>";
			}
		}
		
		if(displayStudentWorkDiv.html() != '') {
			//separate node states with an hr
			displayStudentWorkDiv.append('<hr style="border:1px solid">');
		}
		
		//insert the html into the div
		displayStudentWorkDiv.append(studentWork);
		
		//perform post processing of the svg data so that the drawing is displayed
		displayStudentWorkDiv.find(".svgdrawCell").each(this.showDrawNode);
		displayStudentWorkDiv.find(".snapCell").each(this.showSnaps);
		
		var autoScoreText = '';
		
		if(autoFeedbackKey != null) {
			//get the auto feedback key if available
			autoScoreText += 'Auto-Feedback Key: ' + autoFeedbackKey;
		}
		
		if(autoScore != null) {
			//get the auto score if available
			
			if(autoScoreText != '') {
				autoScoreText += '<br>';
			}
			
			autoScoreText += 'Auto-Score: ' + autoScore;
		}
		
		if(autoFeedback != null) {
			//get the auto feedback if available
			
			if(autoScoreText != '') {
				autoScoreText += '<br>';
			}
			
			autoFeedback = autoFeedback.replace(/\n/g, '<br>');
			autoScoreText += 'Auto-Feedback: ' + autoFeedback;
		}
		
		if(autoScoreText != '') {
			//insert the auto score text
			displayStudentWorkDiv.append(autoScoreText);		
		}
	}
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

/**
 * Shows the draw node that is in the element
 * @param currNode the svgdrawCell element
 */
SVGDrawNode.prototype.showDrawNode = function(currNode) {
	var svgString = String($(this).html());
	svgString = Utils.decode64(svgString);
	var svgXml = Utils.text2xml(svgString);
	$(this).html('');
	$(this).append(document.importNode(svgXml.documentElement, true)); // add svg to cell
};

/**
 * Shows the snap elements
 * @param currNode the snapCell element
 */
SVGDrawNode.prototype.showSnaps = function(currNode) {
	//get the string in the snaps div
	var svgString = String($(this).html());
	
	/*
	 * check if the string starts with "<svg", if it does
	 * then it has already been decoded and we do not need
	 * to do anything. if it does not start with "<svg", then
	 * we will decode it.
	 */
	if(svgString.toLowerCase().indexOf("<svg") == -1) {
		//string does not contain "<svg"
		
		svgString = Utils.decode64(svgString);
		var svgXml = Utils.text2xml(svgString);
		$(this).html('');
		$(this).append(document.importNode(svgXml.documentElement, true)); // add svg to cell
	}
};

/**
 * Returns whether this step type can be special exported
 * @return a boolean value
 */
SVGDrawNode.prototype.canSpecialExport = function() {
	return true;
};

/**
 * Get the feedback that will be displayed when the student clicks
 * on the Feedback button at the upper right of the vle. This feedback
 * will take precedence over feedback from the teacher.
 */
SVGDrawNode.prototype.getFeedback = function() {
	var feedback = null;
	
	//check if this is an auto graded draw step
	if(this.content.getContentJSON() != null &&
			this.content.getContentJSON().autoScoring != null &&
			this.content.getContentJSON().autoScoring.autoScoringCriteria != null &&
			this.content.getContentJSON().autoScoring.autoScoringCriteria != "") {
		//this step is an auto graded draw step
		
		//get all the node states
		var nodeStates = this.view.getStudentWorkForNodeId(this.id);
		
		if(nodeStates != null) {
			/*
			 * loop through all the node states and get the autoFeedback
			 * from the last node state that was auto graded
			 */
			for(var x=nodeStates.length - 1; x>=0; x--) {
				//get a node state
				var nodeState = nodeStates[x];
				
				if(nodeState.checkWork) {
					/*
					 * this node state was work that was auto graded so we will
					 * get the autoFeedback and display it
					 */
					var autoFeedback = nodeState.autoFeedback;
					
					if(feedback == null || feedback == '') {
						//this is the newest feedback the student has received
						feedback = '<b>NEW FEEDBACK<br>' + autoFeedback + '</b><hr>';
					} else {
						//this is a previous feedback the student has received
						feedback += 'PREVIOUS FEEDBACK<br>' + autoFeedback + '<hr>';
					}
				}
			}		
		}
	}
	
	return feedback;
};

NodeFactory.addNode('SVGDrawNode', SVGDrawNode);
	
//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/draw/SVGDrawNode.js');
};