/**
 * @constructor
 * Node
 */
function Node(nodeType, view){
	this.id;
	this.parent;
	this.children = [];
	this.type = nodeType;
	this.title;
	this.className;
	this.content;
	this.contentPanel;
	this.baseHtmlContent;
	this.hints = [];
	
	this.prevWorkNodeIds = [];
	this.populatePreviousWorkNodeId = "";
	this.tags = [];
	this.tagMaps = [];
	this.links = [];
	this.extraData;
	this.view = view;
	
	//booleans used when we need to determine if a constraint is satisfied
	this.isStepOpen = true;
	this.isStepCompleted = false;
	this.isStepPartOfReviewSequence = false;
	
	this.selfRendering = false;
};

Node.prototype.getNodeId = function() {
	return this.id;
};

Node.prototype.isHiddenFromNavigation = function() {
	if (this.isHidden) {
		return this.isHidden;
	}
	return false;
};

/**
 * Shows/Hides this node from appearing in the navigation panel
 * @param doDisplay true iff this node should show up in the navigation.
 * @returns
 */
Node.prototype.displayInNavigation = function(doDisplay) {
	this.isHidden = !doDisplay;
	var navItem = $("#node_"+this.view.escapeIdForJquery(this.view.getProject().getPositionById(this.id)));
	if (doDisplay) {
		navItem.removeClass("hidden");		
	} else {
		navItem.addClass("hidden");
	}
};

Node.prototype.getTitle = function() {
	if (this.title != null) {
		return this.title;
	};
	
	return this.id;
};

Node.prototype.setTitle = function(title){
	this.title = title;
};

/**
 * Retrieves the hints for this node, if exists.
 * @return array of hints if exists. if not exist, return null
 */
Node.prototype.getHints = function() {
	if (this.content &&
			this.content.getContentJSON() &&			
			this.content.getContentJSON().hints) {
		return this.content.getContentJSON().hints;
	};
	return null;
};

/**
 * Retrieves the question/prompt the student reads for this step.
 * @return a string containing the prompt. (the string may be an
 * html string)
 */
Node.prototype.getPrompt = function() {
	var prompt = "";
	
	if(this.content != null) {
		//get the content for the node
		var contentJSON = this.content.getContentJSON();

		if(contentJSON != null) {
			//see if the node content has an assessmentItem
			if(contentJSON.assessmentItem != null) {
				//obtain the prompt
				var assessmentItem = contentJSON.assessmentItem;
				var interaction = assessmentItem.interaction;
				prompt = interaction.prompt;	
			} else {
				if(contentJSON.prompt != null){
					prompt = contentJSON.prompt;
				}
			}
		}
	}
	
	//return the prompt
	return prompt;
};

/**
 * @return this node's content object
 */
Node.prototype.getContent = function(){
	return this.content;
};

/**
 * Sets this node's content object
 * @param content
 */
Node.prototype.setContent = function(content){
	this.content = content;
	
	debugger;
	//if this.content.
};

/**
 * returns this node's type. if humanReadable=true, return in human-readable format
 * e.g. HtmlNode=>{Display, Evidence}, NoteNode=>Note, etc.
 * If type is not defined, return an empty string.
 * @param humanReadable
 * @return the node type
 */
Node.prototype.getType = function(humanReadable) {
	if (this.type) {
		if (!humanReadable) {
			return this.type;
		} else {
			// first get rid of the "Node" in the end of the type
			if (this.type.lastIndexOf("Node") > -1) {
				return this.type.substring(0, this.type.lastIndexOf("Node"));
			} else {
				return this.type;
			};
		};
	} else {
		return "";
	};
};

Node.prototype.addChildNode = function(childNode) {
	this.children.push(childNode);
	childNode.parent = this;
};

Node.prototype.getNodeById = function(nodeId) {
	if (this.id == nodeId) {
		return this;
	} else if (this.children.length == 0) {
		return null;
	} else {
		var soFar = false;
		for (var i=0; i < this.children.length; i++) {
			soFar = soFar || this.children[i].getNodeById(nodeId);
		};
		return soFar;
	};
};

//alerts vital information about this node
Node.prototype.alertNodeInfo = function(where) {
	notificationManager.notify('node.js, ' + where + '\nthis.id:' + this.id 
			+ '\nthis.title:' + this.title, 3);
};


Node.prototype.preloadContent = function(){
	/* create and retrieve the baseHtmlContent if not already done */
	if(!this.baseHtmlContent){
		if(!this.selfRendering){
			this.baseHtmlContent = this.view.getHTMLContentTemplate(this);
			
			/* call one of the getContent methods so it retrieves the content */
			this.baseHtmlContent.getContentString();
		} else {
			/* create the content object */
			this.baseHtmlContent = createContent(this.view.getProject().makeUrl(this.content.getContentJSON().src, this));
				
			/* change filename url for the modules if this is a MySystemNode */
			if(this.type == 'MySystemNode'){
				this.baseHtmlContent.setContent(this.updateJSONContentPath(this.view.getConfig().getConfigParam('getContentBaseUrl'), this.baseHtmlContent.getContentString()));
			};
			
			/* call one of the getContent methods so it retrieves the content */
			this.baseHtmlContent.getContentString();
		};
	};

	/* call one of the nodes getContent methods so it retrieves the content */
	this.content.getContentJSON();
};

/**
 * Renders itself to the specified content panel
 */
Node.prototype.render = function(contentPanel, studentWork, disable) {
	this.studentWork = studentWork;
	
	/* clean up any disabled panel that might exist from previous render */
	$('#disabledPanel').remove();
	
	/*check if the user had clicked on an outside link in the previous step
	 */
	if(this.handlePreviousOutsideLink(this, contentPanel)) {
		/*
		 * the user was at an outside link so the function
		 * handlePreviousOutsideLink() has taken care of the
		 * rendering of this node
		 */
		return;
	}
	
	/* if no content panel specified use default */
	if(contentPanel){
		/* make sure we use frame window and not frame element */
		this.contentPanel = window.frames[contentPanel.name];
	} else if(contentPanel == null) {
		/* use default ifrm */
		this.contentPanel = window.frames['ifrm'];
	}

	/* 
	 * if node is not self rendering which means it is a node that
	 * requires an html file and a content file
	 */
	if(!this.selfRendering){
		/*
		 * check to see if this contentpanel has already been rendered
		 * also check if loadContentAfterScriptsLoad is null, this happens
		 * if the step contained a link to the internet and the student
		 * clicked on the link to load the page from the internet
		 */
		if(this.contentPanel.nodeId!=this.id || this.contentPanel.loadContentAfterScriptsLoad == null){
			if(!this.baseHtmlContent){
				this.baseHtmlContent = this.view.getHTMLContentTemplate(this);
			}
			
			/* make nodeId available to the content panel, and hence, the html */
			this.contentPanel.nodeId = this.id;
			
			/* inject urls and write html to content panel */
			this.contentPanel.document.open();
			this.contentPanel.document.write(this.injectBaseRef(this.injectKeystrokeManagerScript(this.baseHtmlContent.getContentString())));
			this.contentPanel.document.close();
		} else {
			/* already rendered, just load content */
			this.contentPanel.loadContentAfterScriptsLoad(this);
		}
	} else {
		/* if baseHtmlContent has not already been created, create it now */
		if(!this.baseHtmlContent){
			this.baseHtmlContent = createContent(this.view.getProject().makeUrl(this.content.getContentJSON().src, this));
			
			/* change filename url for the modules if this is a MySystemNode */
			if(this.type == 'MySystemNode'){
				this.baseHtmlContent.setContent(this.updateJSONContentPath(this.view.getConfig().getConfigParam('getContentBaseUrl'), this.baseHtmlContent.getContentString()));
			}
		}
		
		//write the content into the contentPanel, this will render the html in that panel
		this.contentPanel.document.open();
		this.contentPanel.document.write(this.injectBaseRef(this.injectKeystrokeManagerScript(this.baseHtmlContent.getContentString())));
		this.contentPanel.document.close();
	}
	
	if(this.contentPanel != null) {
		//set the event manager into the content panel so the html has access to it
		this.contentPanel.eventManager = eventManager;
		this.contentPanel.nodeId = this.id;
		this.contentPanel.node = this;
		this.contentPanel.scriptloader = this.view.scriptloader;
		
		if(this.type == 'MySystemNode' || this.type == 'SVGDrawNode' || 
				this.type == 'OpenResponseNode' || this.type == 'HtmlNode' ||
				this.type == 'MWNode') {
			this.contentPanel.vle = this.view;
		}
	}
	
	/* if there is a disable constraint, we want to set a semi-transparent panel over the content div */
	if(disable==1){
		/* get the position, height and width of the content panel */
		var panelPosition = $('#contentDiv').offset();
		var panelHeight = $('#contentDiv').height() + 2;
		var panelWidth = $('#contentDiv').width() + 2;
		
		/* create the disabledPanel and append it to the given document */
		var dynamicPanel = $('<div id="disabledPanel"></div>').css({opacity: 0.361, height:panelHeight, width:panelWidth, background:'#000', position:'absolute', 'z-index':999, top:panelPosition.top, left:panelPosition.left}).fadeIn(300);
		$('body').append(dynamicPanel);
	}
	
	if(this.view.config.getConfigParam('theme') == 'UCCP') {
		/*
		 * if this is a UCCP project then we will post the current step
		 * for BlueJ interaction purposes. we need to post the current step
		 * even when it is not a BlueJ step because we need to know when
		 * they are not on a BlueJ step.
		 */
		this.extraData = "";
		var blueJProjectPath = this.content.getContentJSON().blueJProjectPath;
		
		if(blueJProjectPath != null) {
			this.extraData = blueJProjectPath;
		}
		this.view.postCurrentStep(this);
	}
};

/**
 * Listens for page rendered event: the html has been fully loaded
 * and the event is fired from the page's window.onload function.
 */
Node.prototype.pageRenderComplete = function(type, args, obj){
	/* args[0] is the id of node's page that has been rendered */
	if(obj.id==args[0] && obj.contentPanel && obj.contentPanel.loadContent){
		obj.contentPanel.loadContent(obj);
		obj.insertPreviousWorkIntoPage(obj.contentPanel.document);
	}
};

/**
 * Creates constraints for this node if necessary
 */
Node.prototype.renderConstraints = function() {
	//check if there is content
	if(this.content != null) {
		//check if there is a getContentJSON function
		if(this.content.getContentJSON) {
			
			//get the content JSON
			var contentJSON = this.content.getContentJSON();
			
			/*
			 * check if this step contains the constraint that it must
			 * be completed before moving on to future steps. they
			 * will still be able to visit previous steps if they
			 * haven't completed the step.
			 */ 
			if(contentJSON.workOnXBeforeAdvancing) {
				var buttonName = null;
				
				if(this.isPartOfReviewSequence()) {
					/*
					 * if this step is a review sequence start or annotate node
					 * we will tell the student they need to click the 'submit'
					 * button. for all other steps it will default to tell them
					 * to click the 'save' button.
					 */
					if(this.peerReview == 'start' || this.peerReview == 'annotate' ||
							this.teacherReview == 'start' || this.teacherReview == 'annotate') {
						buttonName = 'submit';
					}
				}
				
				//add the constraint
				this.view.eventManager.fire('addConstraint',{type:'WorkOnXBeforeAdvancingConstraint', x:{id:this.id, mode:'node'}, id:this.utils.generateKey(20), updateAfterAdd: true, buttonName: buttonName});				
			}
		}
	}
};

Node.prototype.loadContentAfterScriptsLoad = function(type, args, obj){
	if(obj.id==args[0]) {
		obj.contentPanel.loadContentAfterScriptsLoad(obj);		
	}
};

/**
 * Listens for page content rendered complete event: the html has
 * been fully loaded as has the content and the event is fired from
 * the html's load content function.
 */
Node.prototype.contentRenderComplete = function(type, args, obj){
	/* args[0] is the id of node's page that has been rendered */
};

/**
 * This is called when a node is exited
 */
Node.prototype.onExit = function() {
	//this function should be overriden by child classes
};

/**
 * Get the view style if the node is a sequence. If this node
 * is a sequence and no view style is defined, the default will
 * be the 'normal' view style.
 * @return the view style of the sequence or null if this
 * 		node is not a sequence
 */
Node.prototype.getView = function() {
	/*
	 * check that this node is a sequence.
	 */
	if(this.isSequence()) {
		if(this.json.view == null) {
			//return the default view style if none was specified
			return 'normal';
		} else {
			//return the view style for the sequence
			return this.json.view;
		}
	} else {
		//this node is not a sequence so we will return null
		return null;
	}
};

/**
 * Returns whether this node is a sequence node.
 */
Node.prototype.isSequence = function() {
	return this.type == 'sequence';
};

/**
 * Returns the appropriate object representation of this node
 */
Node.prototype.nodeJSON = function(contentBase){
	if(this.type=='sequence'){
		/* create and return sequence object */
		var sequence = {
			type:'sequence',
			identifier:makeHtmlSafe(this.id),
			title:makeHtmlSafe(this.title),
			view:this.getView(),
			refs:[]
		};
		
		/* add children ids to refs */
		for(var l=0;l<this.children.length;l++){
			sequence.refs.push(this.children[l].id);
		};
		
		return sequence;
	} else {
		/* create and return node object */
		var node = {
			type:this.type,
			identifier:makeHtmlSafe(this.id),
			title:makeHtmlSafe(this.title),
			hints:makeHtmlSafe(this.hints),
			ref:this.content.getFilename(contentBase),
			previousWorkNodeIds:this.prevWorkNodeIds,
			populatePreviousWorkNodeId:this.populatePreviousWorkNodeId,
			tags:this.tags,
			tagMaps:this.tagMaps,
			links:this.links
		};

		//set the peerReview attribute if needed
		if(this.peerReview != null) {
			node.peerReview = this.peerReview;
		}
		
		//set the teacherReview attribute if needed
		if(this.teacherReview != null) {
			node.teacherReview = this.teacherReview;
		}
		
		//set the reviewGroup attribute if needed
		if(this.reviewGroup != null) {
			node.reviewGroup = this.reviewGroup;
		}
		
		//set the associatedStartNode attribute if needed
		if(this.associatedStartNode != null) {
			node.associatedStartNode = this.associatedStartNode;
		}
		
		//set the associatedAnnotateNode attribute if needed
		if(this.associatedAnnotateNode != null) {
			node.associatedAnnotateNode = this.associatedAnnotateNode;
		}
		
		/* set class */
		node['class'] = this.className;
		
		return node;
	}
};

/**
 * This function is for displaying student work in the ticker.
 * All node types that don't implement this method will inherit
 * this function that just returns null. If null is returned from
 * this method, the ticker will just skip over the node when
 * displaying student data in the ticker.
 */
Node.prototype.getLatestWork = function(vle, dataId) {
	return null;
};

/**
 * Translates students work into human readable form. Some nodes,
 * such as mc and mccb require translation from identifiers to 
 * values, while other nodes do not. Each node will implement
 * their own translateStudentWork() function and perform translation
 * if necessary. This is just a dummy parent implementation.
 * @param studentWork the student's work, could be a string or array
 * @return a string of the student's work in human readable form.
 */
Node.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * Injects base ref in the head of the html if base-ref is not found, and returns the result
 * @param content
 * @return the content with the injected base ref
 */
Node.prototype.injectBaseRef = function(content) {
	if (content.search(/<base/i) > -1) {
		// no injection needed because base is already in the html
		return content;
	} else {
		// NATE did this...  to check for node specific base urls
		// var contentBaseUrl = "";
		var cbu = "";   
		
		if (this.ContentBaseUrl) {
			// NATE screwed with this also
			cbu = this.ContentBaseUrl;
		} else if(this.type == "HtmlNode") {
			//get the content base url e.g. "http://localhost:8080/curriculum/667/"
			if(this.view.authoringMode) {
				//we are in the step authoring mode 
				cbu = this.getAuthoringModeContentBaseUrl();
			} else {
				//we are in the student vle
				cbu = this.view.getConfig().getConfigParam('getContentBaseUrl');					
			}
		} else {
			//set the content base url to the step type folder path 
			
			//get the content url e.g. "node/openresponse/openresponse.html"
			var contentUrl = this.baseHtmlContent.getContentUrl();
			
			//get the content url path e.g. "node/openresponse"
			contentUrlPath = contentUrl.substring(0, contentUrl.lastIndexOf('/'));
			
			//get the window location e.g. "http://localhost:8080/vlewrapper/vle/vle.html"
			var loc = window.location.toString();
			
			//get the vle location e.g. "http://localhost:8080/vlewrapper/vle/"
			var vleLoc = loc.substring(0, loc.indexOf('/vle/')) + '/vle/';
			
			//create the base href path e.g. "http://localhost:8080/vlewrapper/vle/node/openresponse/"
			cbu = vleLoc + contentUrlPath + '/';
		}

		//add any missing html, head or body tags
		content = this.addMissingTags(content);
		
		//create the base tag
		var baseRefTag = "<base href='" + cbu + "'/>";

		//get the content in all lowercase
		var contentToLowerCase = content.toLowerCase();
		
		//get the index of the open head tag
		var indexOfHeadOpenTag = contentToLowerCase.indexOf("<head>");
		
		var newContent = "";
		
		//check if there is an open head tag
		if(indexOfHeadOpenTag != -1) {
			//insert the base tag after the head open tag
			newContent = this.insertString(content, indexOfHeadOpenTag + "<head>".length, baseRefTag);
		} else {
			newContent = content;
		}
		
		//return the updated content
		return newContent;
	}
};

/**
 * Add any missing html, head or body tags
 * @param content the html content
 * @return the html content with html, head, and body tags inserted
 * if necessary
 */
Node.prototype.addMissingTags = function(content) {
	/*
	 * add tags in this order for simplicity
	 * <body>
	 * </body>
	 * <head>
	 * </head>
	 * <html>
	 * </html>
	 */
	
	//check if the content contains the body open tag
	if(!this.containsBodyOpenTag(content)) {
		/*
		 * get the content all in lower case so we can search for the positions of tags
		 * by comparing them to lower case tags
		 */
		var contentToLowerCase = content.toLowerCase();
		
		//get the index of the html open tag
		var indexOfHtmlOpenTag = contentToLowerCase.indexOf("<html>");
		
		//get the index of the head close tag
		var indexOfHeadCloseTag = contentToLowerCase.indexOf("</head>");
		
		if(indexOfHeadCloseTag != -1) {
			//head close tag was found so we will insert '<body>' right after it
			content = this.insertString(content, indexOfHeadCloseTag + "</head>".length, "<body>");
		} else if(indexOfHtmlOpenTag != -1) {
			/*
			 * head close tag was not found and html open tag was found so we will 
			 * insert '<body>' right after the html open tag
			 */
			content = this.insertString(content, indexOfHtmlOpenTag + "<html>".length, "<body>");
		} else {
			/*
			 * html open and head close tags were not found so we will just add '<body>'
			 * to the beginning of the content
			 */
			content = "<body>" + content;
		}
	}
	
	//check if the content contains the body close tag
	if(!this.containsBodyCloseTag(content)) {
		/*
		 * get the content all in lower case so we can search for the positions of tags
		 * by comparing them to lower case tags
		 */
		var contentToLowerCase = content.toLowerCase();
		
		//get the index of the html close tag
		var indexOfHtmlCloseTag = contentToLowerCase.indexOf("</html>");
		
		if(indexOfHtmlCloseTag != -1) {
			//html close tag was found so we will insert '</body>' right before it
			content = this.insertString(content, indexOfHtmlCloseTag, "</body>");
		} else {
			//html close tag was not found so we will just add '</body>' to the end of the content
			content = content + "</body>";
		}
	}

	//check if the content contains the head open tag
	if(!this.containsHeadOpenTag(content)) {
		/*
		 * get the content all in lower case so we can search for the positions of tags
		 * by comparing them to lower case tags
		 */
		var contentToLowerCase = content.toLowerCase();
		
		//get the index of the html open tag
		var indexOfHtmlOpenTag = contentToLowerCase.indexOf("<html>");
		
		if(indexOfHtmlOpenTag != -1) {
			//html open tag was found so we will insert '<head>' right after it
			content = this.insertString(content, indexOfHtmlOpenTag + "<html>".length, "<head>");
		} else {
			/*
			 * html open tag was not found so we will just add '<head>' to the
			 * beginning of the content
			 */
			content = "<head>" + content;			
		}
	}
	
	//check if the content contains the head close tag
	if(!this.containsHeadCloseTag(content)) {
		/*
		 * get the content all in lower case so we can search for the positions of tags
		 * by comparing them to lower case tags
		 */
		var contentToLowerCase = content.toLowerCase();
		
		//get the index of the body close tag (body open tag should always exist)
		var indexOfBodyOpenTag = contentToLowerCase.indexOf("<body>");
		
		if(indexOfBodyOpenTag != -1) {
			//we need to insert '</head>' right before the open body tag
			content = this.insertString(content, indexOfBodyOpenTag, "</head>");
		}
	}

	//check if the content contains the html open tag
	if(!this.containsHtmlOpenTag(content)) {
		//add the html open tag to the beginning of the content
		content = "<html>" + content;
	}
	
	//check if the content contains the html close tag
	if(!this.containsHtmlCloseTag(content)) {
		//add the html close tag to the end of the content
		content = content + "</html>";
	}
	
	return content;
};

/**
 * Insert a string into the content at the given position
 * @param content the html content
 * @param position the position to insert the string intot he content
 * @param stringToInsert the string to insert into the content
 * @return the content with the string inserted into it
 */
Node.prototype.insertString = function(content, position, stringToInsert) {
	//get everything before the position
	var beginning = content.substring(0, position);
	
	//get everything after the position
	var end = content.substring(position);
	
	//combine everything with the stringToInsert inbetween
	var newContent = beginning + stringToInsert + end;
	
	return newContent;
};

/**
 * Check if the tags in the array are all found in the content.
 * If one of the tags are not found, we will return false.
 * @param content the html content
 * @param tags an array of html tags to search for
 * @return true if we found all the tags, false if we are missing
 * any tag
 */
Node.prototype.containsTags = function(content, tags) {
	if(content != null) {
		//make the content lowercase so we can compare the lowercase tags
		var contentToLowerCase = content.toLowerCase();
		
		//loop through all the tags
		for(var x=0; x<tags.length; x++) {
			//get a tag
			var tag = tags[x];
			
			if(tag != null) {
				//make the tag lower case
				tag = tag.toLowerCase();
				
				//check if we found the tag 
				if(contentToLowerCase.indexOf(tag) == -1) {
					//we did not find the tag
					return false;
				}
			}
		}
	}
	
	//we found all the tags
	return true;
};

/**
 * Check if the content contains the open html tag
 * @param content the html content
 * @return whether the content contains the open html tag
 */
Node.prototype.containsHtmlOpenTag = function(content) {
	var htmlTags = ['<html>'];
	return this.containsTags(content, htmlTags);
};

/**
 * Check if the content contains the close html tag
 * @param content the html content
 * @return whether the content contains the close html tag
 */
Node.prototype.containsHtmlCloseTag = function(content) {
	var htmlTags = ['</html>'];
	return this.containsTags(content, htmlTags);
};

/**
 * Check if the content contains the open head tag
 * @param content the html content
 * @return whether the content contains the open head tag
 */
Node.prototype.containsHeadOpenTag = function(content) {
	var htmlTags = ['<head>'];
	return this.containsTags(content, htmlTags);
};

/**
 * Check if the content contains the close head tag
 * @param content the html content
 * @return whether the content contains the close head tag
 */
Node.prototype.containsHeadCloseTag = function(content) {
	var htmlTags = ['</head>'];
	return this.containsTags(content, htmlTags);
};

/**
 * Check if the content contains the open body tag
 * @param content the html content
 * @return whether the content contains the open body tag
 */
Node.prototype.containsBodyOpenTag = function(content) {
	var htmlTags = ['<body>'];
	return this.containsTags(content, htmlTags);
};

/**
 * Check if the content contains the close body tag
 * @param content the html content
 * @return whether the content contains the close body tag
 */
Node.prototype.containsBodyCloseTag = function(content) {
	var htmlTags = ['</body>'];
	return this.containsTags(content, htmlTags);
};

/**
 * Gets the contentBaseUrl for when the user is previewing a step using the authoring tool.
 * This is not used when the user is previewing the project in the authoring tool.
 * @return the contentBaseUrl from the vlewrapper
 */
Node.prototype.getAuthoringModeContentBaseUrl = function() {
	/*
	 * get the contentBaseUrl from the config param. it will look like this below
	 * e.g.
	 * http://localhost:8080/webapp/author/authorproject.html?forward=filemanager&projectId=96&command=retrieveFile&fileName=
	 */
	var contentBaseUrlString = this.view.getConfig().getConfigParam('getContentBaseUrl');
	
	var lastSlashIndex = -1;
	
	if(contentBaseUrlString) {
		if(contentBaseUrlString.charAt(contentBaseUrlString.length - 1) == '/') {
			/*
			 * the url ends with '/' so we want the index of the '/' before that
			 * e.g.
			 * .../curriculum/88/
			 *               ^
			 */
			lastSlashIndex = contentBaseUrlString.lastIndexOf('/', contentBaseUrlString.length - 2);
		} else {
			/*
			 * the url does not end with '/' so we want the index of the last '/' 
			 * e.g.
			 * .../curriculum/88
			 *               ^
			 */
			lastSlashIndex = contentBaseUrlString.lastIndexOf('/');
		}
	}
	
	var projectFolder = "";
	
	/*
	 * get the vlewrapper base url
	 * e.g.
	 * http://localhost:8080/curriculum
	 */
	var vlewrapperBaseUrl = "";
	
	if(this.view.vlewrapperBaseUrl) {
		vlewrapperBaseUrl = this.view.vlewrapperBaseUrl;
	}
	
	//try to get the project folder from the relativeProjectUrl
	if(this.view.relativeProjectUrl) {
		/*
		 * relativeProjectUrl should be the relative path of the project file
		 * from the curriculum folder
		 * e.g.
		 * /135/wise4.project.json
		 */
		
		var indexFirstSlash = this.view.relativeProjectUrl.indexOf('/');
		var indexSecondSlash = this.view.relativeProjectUrl.indexOf('/', indexFirstSlash + 1);
		
		/*
		 * get the project folder
		 * e.g.
		 * /135
		 */
		projectFolder = this.view.relativeProjectUrl.substring(0, indexSecondSlash);
	}
	
	//add a '/' at the end of the project folder if it doesn't end with '/'
	if(projectFolder.charAt(projectFolder.length - 1) != '/') {
		projectFolder += '/';
	}
	
	/*
	 * combine the vlewrapper base url and the project folder
	 * e.g.
	 * vlewrapperBaseUrl=http://localhost:8080/curriculum
	 * projectFolder=/135
	 * contentBaseUrl=http://localhost:8080/curriculum/135/
	 */
	var contentBaseUrl = vlewrapperBaseUrl + projectFolder;
	
	return contentBaseUrl;
};

/**
 * Returns whether this node is a leaf node
 */
Node.prototype.isLeafNode = function() {
	return this.type != 'sequence';
};


/**
 * This handles the case when the previous step has an outside link and 
 * the student clicks on it to load a page from a different host within
 * the vle. Then the student clicks on the next step in the vle. This
 * caused a problem before because the iframe would contain a page
 * from a different host and we would no longer be able to call functions
 * from it.
 * @param thisObj the node object we are navigating to
 * @param thisContentPanel the content panel to load the content into
 * 		this may be null
 * @return true if the student was at an outside link, false otherwise
 */
Node.prototype.handlePreviousOutsideLink = function(thisObj, thisContentPanel) {
	//check for ifrm to see if this is running from vle.html or someplace
	//other (such as authoring tool which does not have ifrm).
	if(!window.frames['ifrm']){
		return false;
	} else {
		try {
			/*
			 * try to access the host attribute of the ifrm, if the content
			 * loaded in the ifrm is in our domain it will not complain,
			 * but if the content is from another domain it will throw an
			 * error 
			 */
			window.frames["ifrm"].host;
		} catch(err) {
			//content was from another domain
			
			/*
			 * call back() to navigate back to the htmlnode page that contained
			 * the link the student clicked on to access an outside page
			 */
			history.back();
			
			//call render to render the node we want to navigate to
			setTimeout(function() {thisObj.render(thisContentPanel, thisObj.studentWork);}, 500);
			
			/*
			 * tell the caller the student was at an outside link so
			 * they don't need to call render()
			 */
			return true;
		}
		
		//tell the caller the student was not at an outside link
		return false;
	};
};

/**
 * If this node has previous work nodes, grabs the latest student
 * data from that node and inserts it into this nodes page
 * for each referenced node id. Assumes that the html is already loaded
 * and has a div element with id of 'previousWorkDiv'.
 * 
 * @param doc
 */
Node.prototype.insertPreviousWorkIntoPage = function(doc){
	//only do anything if there is anything to do
	if(this.prevWorkNodeIds != null && this.prevWorkNodeIds.length>0){
		var html = '';
		
		//loop through and add any previous work to html
		for(var n=0;n<this.prevWorkNodeIds.length;n++){
			if(this.view.state != null) {
				var work = this.view.state.getLatestWorkByNodeId(this.prevWorkNodeIds[n]);
				if(work){
					//get the node object
					var node = this.view.getProject().getNodeById(this.prevWorkNodeIds[n]);
					
					//get the step number and title e.g. "Step 1.3: Explain why the sun is hot"
					var stepNumberAndTitle = this.view.getProject().getStepNumberAndTitle(node.id);
					
					if(typeof work == "string") {
						//replace all \n with <br>
						work = work.replace(/\n/g, '<br>');
						
						//append the html
						html += 'Remember, your response to step ' + stepNumberAndTitle + ' was<br>' + work + '</br></br>';
					} else {
						html += node.getHtmlView(work);
					}
				};
			}
		};
		
		//add reminders to this node's html if div exists
		var prevWorkDiv = doc.getElementById('previousWorkDiv');
		if(prevWorkDiv){
			if(html != null && html != "") {
				prevWorkDiv.innerHTML = html;
				
				//make the div visible
				prevWorkDiv.style.display = "block";
			}
		};
	};
};

/**
 * Given the full @param path to the project (including project filename), duplicates 
 * this node and updates project file on server. Upon successful completion, runs the 
 * given function @param done and notifies the user if the given @param silent is not true.
 * 
 * NOTE: It is up to the caller of this function to refresh the project after copying.
 * 
 * @param done - a callback function
 * @param silent - boolean, does not notify when complete if true
 * @param path - full project path including project filename
 */
Node.prototype.copy = function(eventName, project){
	/* success callback */
	var successCreateCallback = function(text,xml,o){
		/* fire event with arguments: event name, [initial node id, copied node id] */
		o[0].view.eventManager.fire(o[1],[o[0].id,text]);
	};
	
	/* failure callback */
	var failureCreateCallback = function(obj, o){
		/* fire event with initial node id as argument so that listener knows that copy failed */
		o[0].view.eventManager.fire(o[1],o[0].id);
	};
	
	if(this.type!='sequence'){
		/* copy node section */
		var project = this.view.getProject();
		var data = this.content.getContentString();
		if(this.type=='HtmlNode' || this.type=='DrawNode' || this.type=='MySystemNode'){
			var contentFile = this.content.getContentJSON().src;
		} else {
			var contentFile = '';
		};
		
		if(this.type=='MySystemNode'){
			this.view.notificationManager.notify('My System Nodes cannot be copied, ignoring', 3);
			this.view.eventManager.fire(eventName,[this.id, null]);
			return;
		};
		var contentString = escape(this.content.getContentString());
		
		/*
		 * get the project file name
		 * e.g.
		 * /wise4.project.json
		 */
		var projectFileName = this.view.utils.getContentPath(this.view.authoringBaseUrl,project.getUrl());
		
		this.view.connectionManager.request('POST', 1, this.view.requestUrl, {forward:'filemanager', projectId:this.view.portalProjectId, command:'copyNode', projectFileName: projectFileName, data: contentString, type: this.type, title: project.generateUniqueTitle(this.title), nodeClass: this.className, contentFile: contentFile}, successCreateCallback, [this,eventName], failureCreateCallback);
	} else {
		/* copy sequence section */
		
		/* listener that listens for the event when all of its children have finished copying 
		 * then copies itself and finally fires the event to let other listeners know that it
		 * has finished copying */
		var listener = function(type,args,obj){
			if(args[0]){
				var idList = args[0];
			} else {
				var idList = [];
			};
			
			if(args[1]){
				var  msg = args[1];
			} else {
				var msg = '';
			};
			
			var node = obj[0];
			var eventName = obj[1];
			var project = node.view.getProject();
			
			var seqJSON = {
				type:'sequence',
				identifier: project.generateUniqueId(node.id),
				title: project.generateUniqueTitle(node.title),
				view: node.getView(),
				refs:idList
			};
			
			/*
			 * get the project file name
			 * e.g.
			 * /wise4.project.json
			 */
			var projectFileName = node.view.utils.getContentPath(node.view.authoringBaseUrl,node.view.getProject().getUrl());
			
			node.view.connectionManager.request('POST', 1, node.view.requestUrl, {forward:'filemanager',projectId:node.view.portalProjectId, command: 'createSequenceFromJSON', projectFileName: projectFileName, data: $.stringify(seqJSON)}, successCreateCallback, [node,eventName], failureCreateCallback);
		};
		
		/* set up event to listen for when this sequences children finish copying */
		var seqEventName = this.view.project.generateUniqueCopyEventName();
		this.view.eventManager.addEvent(seqEventName);
		this.view.eventManager.subscribe(seqEventName, listener, [this, eventName]);
		
		/* collect children ids in an array */
		var childIds = [];
		for(var w=0;w<this.children.length;w++){
			childIds.push(this.children[w].id);
		};
		
		/* process by passing childIds and created event name to copy in project */
		this.view.getProject().copyNodes(childIds, seqEventName);
	};
};

/**
 * Handles Smart Filtering in the grading tool for this Node.
 * Child nodes should override this function.
 * @return true iff this node handles smart filtering
 */
Node.prototype.showSmartFilter = function(doShow) {
	return false;
};

/**
 * Create the div that will display the student work for this step
 * @param vle
 * @param divIdPrefix a string to be prepended to the div that contains
 * the student work. this is used to avoid div id conflicts. this
 * argument is optional and will default to ""
 * @return the html for this node to be displayed in the show all work
 * some nodes just return a div that is later populated
 */
Node.prototype.getShowAllWorkHtml = function(vle, divIdPrefix){
	var showAllWorkHtmlSoFar = "";
	
	if(divIdPrefix == null) {
		divIdPrefix = "";
	}
	
    var nodeVisitArray = vle.state.getNodeVisitsByNodeId(this.id);
    if (nodeVisitArray.length > 0) {
        var states = [];
        //get the latest node visit that has student work
        var latestNodeVisit = vle.state.getLatestNodeVisitByNodeId(this.id);
        for (var i = 0; i < nodeVisitArray.length; i++) {
            var nodeVisit = nodeVisitArray[i];
            for (var j = 0; j < nodeVisit.nodeStates.length; j++) {
                states.push(nodeVisit.nodeStates[j]);
            }
        }
        var latestState = states[states.length - 1];
        
        if(latestState!=null){
        	// TODO: i18n
            showAllWorkHtmlSoFar += "<p class='info lastVisit'>Last visited on ";
        } else {
        	// TODO: i18n
            showAllWorkHtmlSoFar += "<p class='info'>Last visited on ";
        }
        
        if(latestNodeVisit!=null){
        	showAllWorkHtmlSoFar += "" + new Date(parseInt(latestNodeVisit.visitStartTime)).toLocaleString() + "</p>";
        	
        };
        
        if(latestState!=null){
        	var divClass = "showallLatestWork";
        	var divStyle = "";
        	if (this.type == "MySystemNode") {
        		divClass = "mysystem";
        		divStyle = "height:350px";
        	}
        	if (this.type == "SVGDrawNode") {
        		divClass = "svgdraw";
        		divStyle = "height:270px; width:360px; border:1px solid #aaa";
        	} 
        	//create the div id for where we will display the student work
        	var divId = divIdPrefix + "latestWork_"+latestNodeVisit.id;
        	var contentBaseUrl = this.view.getConfig().getConfigParam('getContentBaseUrl');
        	
        	if(this.type == "MySystemNode" || this.type == "SVGDrawNode") {
        		showAllWorkHtmlSoFar += '<div class=\"showallLatest\">Latest Work:' + '</div>' + 
    			'<div id=\"'+divId+'\" contentBaseUrl=\"'+contentBaseUrl+'\" class=\"'+divClass+'\" style=\"'+divStyle+'\">' + this.translateStudentWork(latestState.getStudentWork()) + '</div>';
        	} else if(this.hasGradingView()) {
        		showAllWorkHtmlSoFar += '<div class=\"showallLatest\">Latest Work:' + '</div>' + 
        		'<div id=\"'+divId+'\" contentBaseUrl=\"'+contentBaseUrl+'\" class=\"'+divClass+'\" style=\"'+divStyle+'\"></div>';
        	} else {
        		showAllWorkHtmlSoFar += '<div class=\"showallLatest\">Latest Work:' + '</div>' + 
        			'<div id=\"'+divId+'\" contentBaseUrl=\"'+contentBaseUrl+'\" class=\"'+divClass+'\" style=\"'+divStyle+'\">' + this.translateStudentWork(latestState.getStudentWork()) + '</div>';
        	}
        	
        	if (this.view.getCurrentNode().importWork && 
        			this.canExportWork &&
        			this.canExportWork(this.view.getCurrentNode())) {
        		// if the currently-opened node can import work from this node, show link to import.
        		showAllWorkHtmlSoFar += "<div id=\"insertwork_"+divId+"\">" +        		
        		"<a href=\"#\" onclick=\"eventManager.fire('importWork', ['" + this.id + "','"+this.view.getCurrentNode().id+"']); $('#showallwork').dialog('close');\">Insert this work into current step</a>" +
        		"</div>";
        	};
        };
    }
    else {
        showAllWorkHtmlSoFar += "<p class='info'>You haven't visited this step.</p>";
    }
    
    for (var i = 0; i < this.children.length; i++) {
        showAllWorkHtmlSoFar += this.children[i].getShowAllWorkHtml();
    }
    return showAllWorkHtmlSoFar;
};

/**
 * Inserts the keystroke manager script location into the given html content and returns it.
 */
Node.prototype.injectKeystrokeManagerScript = function(contentStr){
	var loc = window.location.toString();
	var keystrokeLoc = '<script type="text/javascript" src="' + loc.substring(0, loc.indexOf('/vle/')) + '/vle/util/keystrokemanager.js"></script></head>';
	
	return contentStr.replace('</head>', keystrokeLoc);
};

/**
 * Creates the keystroke manager for the individual node's content panel
 */
Node.prototype.createKeystrokeManager = function(){
	if(this.contentPanel && !this.contentPanel.keystrokeManager && this.contentPanel.createKeystrokeManager){
		this.contentPanel.keystrokeManager = this.contentPanel.createKeystrokeManager(this.contentPanel.eventManager,[['renderNextNode', 39, ['shift']],['renderPrevNode', 37, ['shift']]]);
	};
};

/**
 * Handles the link request to link to another node. Checks to ensure that the
 * linked node still exists in the project and then calls vle render if it does.
 * 
 * @param linkId
 */
Node.prototype.linkTo = function(key){
	var link = this.getLink(key);
	if(link == null){
		this.view.notificationManager.notify('Could not find link to step, aborting operation.',3);
		return;
	};
	
	var nodePosition = link.nodePosition;
	var nodeIdentifier = link.nodeIdentifier;
	if(nodePosition == null && nodeIdentifier == null){
		this.view.notificationManager.notify('Could not find step specified in link, aborting operation.',3);
	} else {
		if (nodePosition != null) {
			var node = this.view.getProject().getNodeByPosition(nodePosition);
		} else {
			var node = this.view.getProject().getNodeById(nodeIdentifier);
			nodePosition = this.view.getProject().getPositionById(node.id);
		}
		if(!node){
			this.view.notificationManager.notify('Could not retrieve the step specified in the link.',3);
		} else if(this.view.name!='vle'){
			this.view.notificationManager.notify('The link works. The step ' + node.title + ' will be displayed when the project is run.',3);
		} else {
			this.view.renderNode(nodePosition);
		}
	}
};

/**
 * Returns the link object associated with the given key if an
 * object with that key exists, returns null otherwise.
 * 
 * @param key
 * @return object || null
 */
Node.prototype.getLink = function(key){
	/* cycle through the links to find the associated key */
	for(var b=0;b<this.links.length;b++){
		if(this.links[b].key==key){
			return this.links[b];
		}
	}
	
	return null;
};

/**
 * Adds the given link the this node's link array.
 * 
 * @param link
 */
Node.prototype.addLink = function(link){
	this.links.push(link);
};

/**
 * Returns the class for this node.
 */
Node.prototype.getNodeClass = function(){
	return this.className;
};

/**
 * Sets the className for this node.
 * 
 * @param className
 */
Node.prototype.setNodeClass = function(className){
	this.className = className;
};

/**
 * Returns this node.
 */
Node.prototype.getNode = function(){
	return this;
};

/**
 * Does this node support audio playback?
 */
Node.prototype.isAudioSupported = function(){
	return true;
};

/**
 * Set the step boolean value open to true
 */
Node.prototype.setStepOpen = function() {
	this.isStepOpen = true;
};

/**
 * Set the step boolean value open to false
 */
Node.prototype.setStepClosed = function() {
	this.isStepOpen = false;
};

/**
 * Get whether the step is open or not
 * @return a boolean value whether the step is open or not
 */
Node.prototype.isOpen = function() {
	return this.isStepOpen;
};

/**
 * Set the step boolean value completed to true
 */
Node.prototype.setCompleted = function() {
	this.isStepCompleted = true;
};

/**
 * Set the step boolean value completed to false
 */
Node.prototype.setNotCompleted = function() {
	this.isStepCompleted = false;
};

/**
 * Get whether the step is completed or not
 * @return a boolean value whether the step is completed or not
 */
Node.prototype.isCompleted = function() {
	return this.isStepCompleted;
};

/**
 * Set the step boolean value part of review sequence to true
 */
Node.prototype.setIsPartOfReviewSequence = function() {
	this.isStepPartOfReviewSequence = true;
};

/**
 * Set the step boolean value part of review sequence to false
 */
Node.prototype.setIsNotPartOfReviewSequence = function() {
	this.isStepPartOfReviewSequence = false;
};

/**
 * Get whether the step is part of a review sequence or not
 * @return a boolean value whether the step is part of a 
 * review sequence or not
 */
Node.prototype.isPartOfReviewSequence = function() {
	return this.isStepPartOfReviewSequence;
};

/**
 * Get the html view for the given student work. This function
 * should be implemented by child classes.
 * @returns a string with the html that will display
 * the student work for this step
 */
Node.prototype.getHtmlView = function(work) {
	return "";
};

/**
 * Process the student work to determine if we need to display
 * anything special or perform any additional processing.
 * For example this can be used to process the student work and
 * determine whether to display a bronze, silver, or gold
 * star next to the step in the navigation menu. Each step
 * type will need to implement this function on their own.
 * @param studentWork the student work to look at to determine
 * if anything special needs to occur. usually this will be
 * the latest student step state for the given step.
 */
Node.prototype.processStudentWork = function(studentWork) {
	
};

/**
 * Get the tag map function objects that are available for the
 * step. Each child class should overwrite this function if they
 * make use of tags. A tag map function object should contain
 * 3 fields.
 * 
 * tagName (string)
 * functionName (string)
 * functionArgs (array of strings)
 * 
 * @return an array containing the tag map functions
 */
Node.prototype.getTagMapFunctions = function() {
	return [];
};

/**
 * Handle any processing before creating the node navigation html.
 */
Node.prototype.onBeforeCreateNavigationHtml = function() {
	// to be overriden by child nodes
};

/**
 * Get a tag map function given the function name. Each child class
 * should overwrite this function if they make use of tags.
 * @param functionName the name of the function
 * @returns a tag map object
 */
Node.prototype.getTagMapFunctionByName = function(functionName) {
	return null;
};

/**
 * Whether this step type has a grading view. Steps that do not save
 * any student work will not have a grading view such as HTMLNode
 * and OutsideUrlNode. Steps types that do not have a grading view 
 * should override this function and return false.
 * @returns whether this step type has a grading view
 */
Node.prototype.hasGradingView = function() {
	return true;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/Node.js');
}