/**
 * Functions specific to the creation, retrieving and updating of metadata
 * 
 * @author patrick lawler
 */

/**
 * Retrieves and parses the page metadata file and project metadata file if they exist
 */
View.prototype.retrieveMetaData = function(){
	if(this.mode == "portal") {
		var metadataRequestParams = {
			"projectId":this.portalProjectId,
			"command":"getMetadata"
		};
		this.connectionManager.request('GET', 1, this.portalUrl, metadataRequestParams, this.projectMetaSuccess, this, this.projectMetaFailure);
	} else {
		//make async requests
		this.connectionManager.request('GET', 1, this.project.getContentBase() + this.utils.getSeparator(this.project.getContentBase()) + this.utils.getProjectMetaFilename(this.project.getProjectFilename()), null, this.projectMetaSuccess, this, this.projectMetaFailure);
	}
	
};

/**
 * Success callback for project metadata retrieval
 */
View.prototype.projectMetaSuccess = function(text,xml,o){
	try{
		o.projectMeta = $.parseJSON(text);
	} catch(e) {
		o.hasProjectMeta = false;
		o.notificationManager.notify('Error parsing project metadata, aborting.', 2);
		return;
	}
	
	//o.verifyCleaning(); //TODO: Jon re-enable when stable
	o.populateMaxScores();
	o.setPostLevel();
	o.populateMetaSettings();
	o.hasProjectMeta = true;
};

/**
 * Failure callback for project metadata retrieval
 */
View.prototype.projectMetaFailure = function(c,o){
	o.hasProjectMeta = false;
	o.projectMeta = {title: '', subject: '', theme:'', navMode:'', summary: '', author: '', gradeRange: '', totalTime: '', compTime: '', contact: '', techReqs: '', tools: '', lessonPlan: '', standards: '', keywords:'', language:''};
};

/**
 * Either updates or creates the current project meta on the server
 */
View.prototype.updateProjectMetaOnServer = function(publish, silent){
	var callback = function(text, xml, o){
		o.hasProjectMeta = true;
		o.populateMetaSettings();
		//$('#editProjectMetadataDialog').dialog('close');
		
		if(!silent){
			o.notificationManager.notify('Project settings saved.', 3);
		}
		
		if(publish){
			o.updateProjectMetadataOnPortal();
		}
	};
	
	var failed = function(text, xml, o){
		o.notificationManager.notify('Error saving project settings. Please check your network connection and try again.', 3);
		
		// revert project metadata to state before POST attempt
		this.projectMeta = this.previousProjectMeta;
		o.setPostLevel();
		o.populateMetaSettings();
	};
	
	if(this.mode == "portal") {
		// store previous project metadata (in case POST fails)
		this.previousProjectMeta = this.projectMeta;
		
		/*
		 * set the max scores into the metadata. we need to do this for max
		 * scores because we do not keep the this.projectMeta.maxScores up to date
		 * when the user modifies the max scores. we only keep the this.maxScores
		 * up to date so that we don't have to update both this.projectMeta.maxScores
		 * and this.maxScores
		 */
		this.projectMeta.maxScores = $.stringify(this.maxScores.maxScoresArray);
		
		//create a JSON string from the metadata and then escape the JSON string
		//var metadataString = escape($.stringify(this.projectMeta));
		var metadataString = $.stringify(this.projectMeta,null,3);
		
		var postMetadataParams = {
			"projectId":this.portalProjectId,
			"command":"postMetadata",
			"metadata":metadataString
		};
		
		this.connectionManager.request('POST', 1, this.requestUrl, postMetadataParams, callback, this, failed);
	} else {
		//if project meta file exists - update on server
		//NOTE: I don't think we use metadata files anymore, all metadata is stored in the portal database now
		if(this.projectMetadata || this.hasProjectMeta){//update file on server
			this.connectionManager.request('POST', 1, this.requestUrl, {forward:'filemanager', projectId:this.portalProjectId, command: 'updateFile', fileName: this.utils.getProjectMetaFilename(this.project.getProjectFilename()), data: $.stringify(this.projectMeta)}, callback, this, failed);
		} else {//create file on server
			this.connectionManager.request('POST', 1, this.requestUrl, {forward:'filemanager', projectId:this.portalProjectId, command: 'createFile', fileName: '/' + this.utils.getProjectMetaFilename(this.project.getProjectFilename()), data: $.stringify(this.projectMeta)}, callback, this, failed);
		}		
	}
};

/**
 * If the authoring tool is in portal mode, attempts to publish the current metadata to the portal.
 * TODO: remove (deprecated)
 */
View.prototype.updateProjectMetadataOnPortal = function(){
	var success = function(t,x,o){
		o.notificationManager.notify(t, 3);
	};
	
	var failure = function(t,o){
		o.notificationManager.notify('Unable to connect to portal to publish metadata.', 3);
	};
	
	//if(this.portalUrl && this.versioning.currentVersion){
	//	this.connectionManager.request('POST', 1, this.portalUrl, {command:'publishMetadata', projectId: this.portalProjectId, versionId: this.versioning.currentVersion}, success, this, failure);
	//};
};

/**
 * Given a node id, updates or creates the max score for that node in this
 * projects meta information and saves to the file.
 */
View.prototype.maxScoreUpdated = function(id){
	if(document.getElementById('maxScore_' + id)){
		var val = document.getElementById('maxScore_' + id).value;
		
		if(!val || (!isNaN(val) && val>=0)){
			//get the project id
			var projectId = this.getProjectId();
			
			//save the max score to the server and to our local variable
			this.saveMaxScore(projectId, id);
		} else {
			this.notificationManager.notify('The max score value is either not a number, is less than 0, or could not be determined.  Please try again.', 3);
			this.populateMaxScores();
			return;
		};
	} else {
		this.notificationManager.notify('Could not find max score element for step. Please try again.', 3);
	};
};

/**
 * Updates the value of the max score to the given value for the given
 * node id. If a value does not previously exist, creates one. If the
 * given id is for a duplicate node, updates the max score of the original
 * that that duplicate represents.
 */
View.prototype.updateMaxScoreValue = function(id, val){
	var found = false;
	var scores = this.projectMeta.maxScores;
	if(!scores){
		this.projectMeta.maxScores = [];
		scores = this.projectMeta.maxScores;
	};
	
	/* get the original node and either update or add the user specified
	 * value for the maxScore */
	var node = this.getProject().getNodeById(id).getNode(); //getNode returns the node if it is an original but returns the original if it is a duplicate
	for(var j=0;j<scores.length;j++){
		if(scores[j].nodeId==node.id){
			found = true;
			scores[j].maxScoreValue = val;
		};
	};
};

/**
 * Populates the values of the max scores for any nodes that are specified
 * in the project meta.
 */
View.prototype.populateMaxScores = function(){
	//check if we have max scores
	if(this.maxScores){
		//get the max scores array
		var scores = this.maxScores.maxScoresArray;
		
		if(scores != null) {
			//loop through all the max scores
			for(var i=0;i<scores.length;i++){
				/* get all duplicate nodes of this node and update their scores as well */
				var nodes = this.getProject().getDuplicatesOf(scores[i].nodeId, true);
				for(var w=0;w<nodes.length;w++){
					//get the field we will populate
					var input = document.getElementById('maxScore_' + nodes[w].id);
					if(input){
						//populate the field with the score
						input.value = scores[i].maxScoreValue;
					}
				}
			}
		}
	}
};

/**
 * Sets the logging level if it is specified in the project meta.
 */
View.prototype.setPostLevel = function(){
	if(this.projectMeta.postLevel){
		if(this.projectMeta.postLevel == 1){
			$('#loggingToggle').attr('checked',false);
		} else if(this.projectMeta.postLevel == 5){
			$('#loggingToggle').attr('checked',true);
		}
	};
};

/**
 * Populates the project metadata settings in the project editing panel
 */
View.prototype.populateMetaSettings = function(){
	// project setting toggles
	//$('#projectInfo input[type="checkbox"]').toggleSwitch('destroy');
	
	if (this.projectMeta.tools != null) {
		var tools = this.projectMeta.tools;
		// determine if idea manager is enabled
		if (tools.isIdeaManagerEnabled != null && tools.isIdeaManagerEnabled) {
			$("#enableIM").prop('checked', true);
		} else {
			$("#enableIM").prop('checked',false);
		}
	
		// determine if enable student asset uploader is enabled
		if (tools.isStudentAssetUploaderEnabled != null && tools.isStudentAssetUploaderEnabled) {
			$("#enableUpload").prop('checked', true);
		} else {
			$("#enableUpload").prop('checked', false);
		}
	}
	
	$('#projectInfo input[type="checkbox"]').toggleSwitch('refresh');
	
	//$('#projectInfo input[type="checkbox"]').toggleSwitch();
	
	this.utils.setSelectedValueById('projectMetadataSubject', this.utils.resolveNullToEmptyString(this.projectMeta.subject));
	this.utils.setSelectedValueById('projectMetadataGradeRange', this.utils.resolveNullToEmptyString(this.projectMeta.gradeRange));
	this.utils.setSelectedValueById('projectMetadataTotalTime', this.utils.resolveNullToEmptyString(this.projectMeta.totalTime));
	this.utils.setSelectedValueById('projectMetadataLanguage', this.utils.resolveNullToEmptyString(this.projectMeta.language));
	
	if(this.projectMeta.theme != null){
		this.utils.setSelectedValueById('projectMetadataTheme', this.projectMeta.theme);
	}
	var navMode = '';
	if(this.projectMeta.navMode != null){
		navMode = this.projectMeta.navMode;
	}
	var themeName = $('#projectMetadataTheme').val();
	this.populateNavModes(themeName,navMode);
	
	$('#currentTheme').text($('#projectMetadataTheme option:selected').text());
	
	// initialize jQuery UI selectmenus on projectInfo select elements
	$('#projectInfo select').selectmenu({customClass:'dark'});
	
	eventManager.fire('browserResize');
};

/**
 * Updates project metadata settings based on project editing panel changes
 * @param item String representing the project metadata field to update
 * @param val String/boolean/object with the value to set
 * 
 */
View.prototype.updateMetaSettings = function(item,val){
	this.projectMeta[item] = val;
	this.updateProjectMetaOnServer();
};

/**
 * Updates project metadata tools object on project editing panel changes
 * @param item String representing the tools metadata field to update
 * @param val String/boolean/object with the value to set
 * 
 */
View.prototype.updateMetaTools = function(item,val){
	this.projectMeta.tools[item] = val;
	this.updateProjectMetaOnServer();
};

/**
 * Retrieves the user selected value for logging level and updates the metadata file.
 */
View.prototype.postLevelChanged = function(){
	/*var val = document.getElementById('postLevelSelect').options[document.getElementById('postLevelSelect').selectedIndex].value;
	this.projectMeta.postLevel = parseInt(val);
	this.getProject().setPostLevel(parseInt(val));*/
	var val = ($('#loggingToggle').prop('checked') ? 5 : 1);
	this.projectMeta.postLevel = val;
	this.getProject().setPostLevel(val);
	this.updateProjectMetaOnServer(false);
};

/**
 * Sets the current time as a timestamp in the lastEdited field of the project meta
 * and saves it.
 */
View.prototype.setLastEdited = function(){
	var success = function(t,x,o){
		if(!isNaN(t)){
			o.projectMeta.lastEdited = parseFloat(t);
			o.updateProjectMetaOnServer(false, true);
		} else {
			o.notificationManager.notify("Did not understand the timestamp response from servlet, cannot update last edited field of project meta.");
		};
	};
	
	var failure = function(t,o){
		o.notificationManager.notify("Unable to retrieve timestamp from servlet, cannot update last edited field of project meta.", 3);
	};
	
	this.connectionManager.request('GET', 1, this.minifierUrl, {forward:'minifier', command:'getTimestamp'}, success, this, failure);
};

/**
 * If the project has not been cleaned within the last week and has been
 * edited since, forces cleaning.
 */
View.prototype.verifyCleaning = function(){
	var forceCleaning = false;
	/* if either the lastedited field or lastcleaned field do not exist, force cleaning */
	if(this.projectMeta.lastEdited && this.projectMeta.lastCleaned){
		/* if it was last cleaned more recently, we don't need to force cleaning */
		if(this.projectMeta.lastEdited > this.projectMeta.lastCleaned.timestamp){
			/* get current timestamp to compare to the lastcleaned timestamp, if it has been a week, force cleaning */
			var timestampURL = this.requestUrl + '?forward=minifier&command=getTimestamp';
			
			var timestampContent = createContent(timestampURL);
			var ts = timestampContent.getContentString();
			
			if((ts - this.projectMeta.lastCleaned.timestamp) > 604800000){
				forceCleaning = true;
			};
		};
	} else {
		forceCleaning = true;
	};
	
	if(forceCleaning){
		this.eventManager.fire('cleanProject');
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_meta.js');
};