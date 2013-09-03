/**
 * @author patrick lawler
 * @author jonathan breitbart
 */

/**
 * Sets variables so that the authoring tool is running in portal mode
 * and starts authoring tool in appropriate state.
 */
View.prototype.startPortalMode = function(url, command, relativeProjectUrl, projectId, projectTitle, editPremadeComments){
	this.portalProjectPaths = [];
	this.portalProjectIds = [];
	this.portalProjectTitles = [];
	this.portalFavorites = 0;
	this.portalUrl = url;
	/*
	 * this editingPollInterval is used to check who is also currently editing the
	 * project. this was never actually used because stopEditingInterval() used
	 * to be called at the beginning of loading the authoring tool because of
	 * a bug. if this editingPollInterval is actually used, it throws server
	 * side errors so I have commented it out. the authoring tool still checks
	 * and displays who is also currently authoring the project when the project 
	 * is initially loaded just like before.
	 */
	//this.editingPollInterval = setInterval('eventManager.fire("whoIsEditing")', this.EDITING_POLL_TIME);
	this.authoringBaseUrl = this.portalUrl + '?forward=filemanager&command=retrieveFile&fileName=';
	this.requestUrl = this.portalUrl;
	this.assetRequestUrl = this.portalUrl;
	this.minifierUrl = this.portalUrl;
	this.mode = "portal";
	this.authoringMode = true;
	
	this.model = new AuthoringModel();

	//create the config url
	var configUrl = this.portalUrl + "?command=getConfig";
	
	//create the config
	this.config = this.createConfig(createContent(configUrl));
	this.eventManager.fire('loadConfigCompleted');
	
	/* retrieve i18n files, defined in view_i18n.js */
	this.retrieveLocales("main");

	if(this.config != null) {
		//set some variables from values in the config
		this.portalUsername = this.config.getConfigParam("username");
		this.portalUserFullname = this.config.getConfigParam("userfullname");
		this.vlewrapperBaseUrl = this.config.getConfigParam("vlewrapperBaseUrl");
		
		//set user's name in page
		$('#userName').text(this.portalUserFullname);
	}
	
	if(command && command!=''){
		if(command=='cleanProject'){
			this.cleanMode = true;
		}
		
		if(command=='createProject'){
			this.createMode = true;
		} else if(command=='editProject' || command=='cleanProject'){
			$('#projectContent').show();
			$('#projectOverlay').show();
			$('#projectLoading').show();
			$('#projectWelcome').hide();
			
			this.portalProjectId = parseInt(projectId);
			this.authoringBaseUrl = this.portalUrl + '?forward=filemanager&projectId=' + this.portalProjectId + '&command=retrieveFile&fileName=';
			
			//get the project file name
			var projectFileName = relativeProjectUrl.substring(relativeProjectUrl.lastIndexOf("/"));
			
			//get the url for the project file
			var projectFileUrl = this.authoringBaseUrl + projectFileName;
			
			//get the url for the project folder
			var projectFolderUrl = this.authoringBaseUrl;
			
			this.loadProject(projectFileUrl, projectFolderUrl, true);
			this.onAuthoringToolReady();
		}
	} else {
		this.loadWelcomeScreen();
		this.onAuthoringToolReady();
	}
	
	if(editPremadeComments == "true") {
		//we are only loading the authoring tool so that we can open the premade comments
		view.openPremadeComments();
		
		if(window.parent != null && window.parent.parent != null && window.parent.parent.closeLoadingPremadeCommentsDialog != null) {
			//close the loading premade comments message
			window.parent.parent.closeLoadingPremadeCommentsDialog();			
		}
		
		//we will exit this function since we don't need to really load the rest of the authoring tool
		return;
	}
	
	//load the template files for all the step types
	this.loadNodeTemplateFiles();
	
	/* launch create project dialog if create mode has been set */
	if(this.createMode){
		this.createNewProject();
	}
	
	/* enable the edit project tags  (only available in portal mode) */
	//$('#editProjectTagsMenu').show();
};

/**
 * Load the template files for all the step types
 */
View.prototype.loadNodeTemplateFiles = function() {
	//get all the node types
	var nodeTypes = NodeFactory.getNodeTypes();
	
	//loop through all the node types
	for(var x=0; x<nodeTypes.length; x++) {
		//get a node type
		var nodeType = nodeTypes[x];
		
		//get the node template params
		var nodeTemplateParams = this.nodeTemplateParams[nodeType];
		
		if(nodeTemplateParams != null) {
			
			for(var y=0; y<nodeTemplateParams.length; y++) {
				var nodeTemplateParam = nodeTemplateParams[y];
				
				//get the path to the template file for this node type
				var nodeTemplateFilePath = nodeTemplateParam.nodeTemplateFilePath;
				
				//get the file extension for this node type
				var nodeExtension = nodeTemplateParam.nodeExtension;
				
				if(nodeTemplateFilePath != null) {
					//create a content object for the template file
					var templateContent = createContent(nodeTemplateFilePath);
					
					//set the content into the nodeTemplateParam object
					nodeTemplateParam.nodeTemplateContent = templateContent.getContentString();
				}		
			}
		}
	}
};

/**
 * Creates a project of the given name with the given path in the portal. The
 * folder and files have already been created, we are just registering the project
 * with the portal here.
 * @path path to the newly created project, this path should contain the project folder
 * e.g.
 * /523/wise4.project.json
 */
View.prototype.createPortalProject = function(path, name, parentProjectId){
	/*
	 * get the project file name
	 * e.g.
	 * /wise4.project.json 
	 */
	var projectFileName = path.substring(path.lastIndexOf("/"));
	
	var handler = function(responseText, responseXML, o){
		if(responseText){
			o.portalProjectId = responseText;
			o.authoringBaseUrl = o.portalUrl + '?forward=filemanager&projectId=' + o.portalProjectId + '&command=retrieveFile&fileName=';
				
			/* load the newly created project */
			o.loadProject(o.authoringBaseUrl + projectFileName, o.authoringBaseUrl, false);
		} else {
			o.notificationManager.notify('failed to create project in portal', 3);
		};
	};
	
	this.connectionManager.request('POST', 3, this.portalUrl, {command: 'createProject', projectName: name, projectPath:path, parentProjectId: parentProjectId}, handler, this);
};

/**
 * Retrieves and parses settings.xml file for project paths, primaryPath locations.
 * NOTE: I don't think this function is used anymore
 */
View.prototype.getProjectPaths = function(){
	var callback = function(text, xml, o){
		var settingsJSON = $.parseJSON(text);
		if(settingsJSON){
			/* get the mode that the authoring tool is to run in (portal/standalone) */
			if(settingsJSON.mode && settingsJSON.mode.portal && settingsJSON.mode.portalUrl) {
				var rawLoc = window.location.toString();
				var loginUrl = rawLoc.substring(0,rawLoc.indexOf('/vlewrapper/vle/author.html')) + settingsJSON.mode.portalUrl + '?redirect=/author/authorproject.html';
				window.location = loginUrl;
			}
			
			if(settingsJSON.projectPaths) {
				for(var u=0;u<settingsJSON.projectPaths.length;u++){
					if(settingsJSON.projectPaths[u]){
						o.projectPaths += settingsJSON.projectPaths[u];
						if(u!=settingsJSON.projectPaths.length-1){
							o.projectPaths += '~';
						}
					}
				}
			}
			
			if(settingsJSON.primaryPath) {
				o.primaryPath = settingsJSON.primaryPath;
				o.projectPaths += '~' + settingsJSON.primaryPath;
			} else {
				o.notificationManager.notify("Error: Primary Path not specified in settings.json");
			}
			
		} else {
			o.notificationManager.notify("Error retrieving settings", 3);
		}
		
		o.onAuthoringToolReady();
	};

	this.connectionManager.request('GET', 1, 'settings.json', null, callback, this);
};

/**
 * Attempts to retrieve the current user's username from the portal
 */
View.prototype.getPortalUsername = function(){
	if(this.portalUrl){
		this.connectionManager.request('POST', 1, this.portalUrl, {command: 'getUsername'}, this.getUsernameSuccess, this);
	};
};

/**
 * Sets this view's username if successfully retrieved from the portal
 */
View.prototype.getUsernameSuccess = function(t,x,o){
	if(t && t!=''){
		o.portalUsername = t;
	};
};

/**
 * Request the curriculum base url
 */
View.prototype.getCurriculumBaseUrl = function(){
	if(this.portalUrl){
		this.connectionManager.request('POST', 1, this.portalUrl, {command: 'getCurriculumBaseUrl'}, this.getCurriculumBaseUrlSuccess, this);
	};
};

/**
 * Called when we receive the response from the curriculum base url request
 * @param t
 * @param x
 * @param o
 * @return
 */
View.prototype.getCurriculumBaseUrlSuccess = function(t,x,o){
	if(t && t!=''){
		//set the vlewrapper base url into the view
		o.vlewrapperBaseUrl = t;
		
		//set the authoring mode to true in the view
		o.authoringMode = true;
	};
};

/**
 * Retrieves user's authorable projects and populates the authoring welcome screen
 */
View.prototype.loadWelcomeScreen = function(){
	this.retrieveWelcomeProjectList();
	
	
};

/**
 * Removes the splash screen and shows the authoring tool when all
 * necessary parts have loaded. Inserts i18n translations and binds
 * general events.
 */
View.prototype.onAuthoringToolReady = function(){
	var view = this;
	notificationManager.setMode('authoring');
	
	// set validator item required message
	$.extend(jQuery.validator.messages, {
	  required: ' ' + view.getI18NString('validator_itemRequired')
	});
	
	// bind general (non-changing) click events
	this.bindGeneralEvents();
	
	// insert i18n text and tooltips/help items into DOM
	this.insertTranslations("main", function(){ 
		view.insertTooltips();
		
		// hide loading objects and show authoring body
		$('#author_body').show();
		$('#coverDiv').hide();
		$('#overlay').hide();
	});
	//clearInterval(window.loadingInterval);
};

/**
 * Binds events that remain constant (don't change depending on context or 
 * active project).
 */
View.prototype.bindGeneralEvents = function(){
	var view = this;
	
	/* top toolbar events */
	$("#openProjectLink").on("click", function(){
		eventManager.fire("openProject");
	});
	$("#newProjectLink").on("click", function(){
		eventManager.fire("createNewProject");
	});
	
	/* welcome panel elements */
	$('#projectWelcome').on('click','#families li',function(){
		var panel = $(this).attr('id'), tab = 0, doOpen = true;
		switch (panel){
			case 'myFavorites':
				tab = 0;
				break;
			case 'myOwned':
				tab = 1;
				break;
			case 'myShared':
				tab = 2;
				break;
			case 'myCreate':
				doOpen = false;
				break;
		}
		if(doOpen){
			eventManager.fire('openProject',tab);
		} else {
			eventManager.fire('createNewProject');
		}
	});
	
	/* project editing panel elements */
	
	// toggle favorite link
	$('#projectInfo').on('click','a.bookmark',function(){
		var toggle = $(this);
		toggle.tipTip('hide');
		var id = toggle.attr('data-projectid');
		var isBookmark = toggle.hasClass('true');
		view.toggleBookmark(id, isBookmark, function(id,isBookmark){
			if(isBookmark){
				//remove star
				toggle.removeClass('true');
				
				//update favorites count
				view.portalFavorites-=1;
			} else {
				//add star
				toggle.addClass('true');
				
				//update favorites count
				view.portalFavorites+=1;
			}
		});
	});
	
	// project thumb editing	
	$('#editThumb').on('click',function(){
		view.editProjectThumbnail();
	});
	
	// project title editing
	$('#projectTitle').on('click',function(){
		view.editTitle();
	});
	$('#titleInput').keypress(function (e) {
		if(e.keyCode == 13){
			$(this).blur();
		}
    });
	
	// step term input
	$('#stepTerm').on('change',function(){
		eventManager.fire("stepTermChanged");
	}).on('keyup',function(e){
		if (e.keyCode === 13) {
			$(this).blur();
		}
	});
	
	// activity term input
	$('#activityTerm').on('change',function(){
		eventManager.fire("activityTermChanged");
	}).on('keyup',function(e){
		if (e.keyCode === 13) {
			$(this).blur();
		}
	});
	
	// project tools
	$('#editInfo, #moreDetails').on('click',function(){
		eventManager.fire('editProjectMetadata');
	});
	$('#manageFiles').on('click',function(){
		eventManager.fire('viewAssets');
	});
	$('#previewProject').on('click',function(){
		eventManager.fire('previewProject');
	});
	$('#editOrder').on('click',function(){
		eventManager.fire('editProjectStructure');
	});
	
	// project metadata feature toggles
	$('#projectInfo input[type="checkbox"].metaInfo').on('click',function(){
		view.updateMetaTools($(this).attr('data-field'),$(this).prop('checked'));
	});
	$('#loggingToggle').on('click',function(){
		eventManager.fire('postLevelChanged');
	});
	
	// IM settings link
	$('#imSettingsEdit').on('click',function(){
		eventManager.fire('editIMSettings');
	});
	
	// set logging level data-on and data-off attributes
	$('#loggingToggle').attr('data-on',this.getI18NString('authoring_project_panel_logging_high')).attr('data-off',this.getI18NString('authoring_project_panel_logging_low'));
	
	/* project structure authoring elements */
	
	// scrolling for active and inactive links
	$("#dynamicProject .scroll").on('click', function(event){		
		event.preventDefault();
		$('#projectStructure > .contentWrapper').animate({scrollTop:$(this.hash).position().top-6}, 500, 'easeOutQuint');
	});
};


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_startup.js');
};