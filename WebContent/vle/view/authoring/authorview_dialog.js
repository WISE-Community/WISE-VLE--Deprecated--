/**
 * Functions specific to the creation and initialization of dialogs
 * 
 * @author patrick lawler
 */

/**
 * Creates and renders the dialog to create and load a new 
 * project in the authoring tool and portal.
 */
View.prototype.initializeCreateProjectDialog = function(){
	var view = this;
	
	var submit = function(){
		var name = $('#projectInput').val();
		
		if(view.portalUrl){
			var path = view.portalCurriculumBaseDir;
			view.createMode = false;
		} else {
			var path = view.primaryPath;
		}
		
		/* failure callback function for creating a new project */
		var failure = function(t,o){
			o.notificationManager.notify('unable to create new project on server', 3);
		};
		
		/* success callback function for creating a new project */
		var success = function(t,x,o){
			var path = t;
			/* publish the project to the portal if we are in portal mode */
			if(o.portalUrl){
				o.createPortalProject(path, $('#projectInput').val());
			} else {
				/* just load the newly created project */
				o.loadProject(o.authoringBaseUrl + path, o.utils.getContentBaseFromFullUrl(o.authoringBaseUrl + path), false);
			}
			
			/*
			 * clear out the project title input so that the next time it will not
			 * display what we just typed
			 */
			document.getElementById('projectInput').value = "";
		
			/* close the dialog when done */
			$('#createProjectDialog').dialog('close');
		};
		
		/* make request if name input field is not empty */
		if(name != null && name != ""){
			view.connectionManager.request('POST',1, view.requestUrl, {forward:'filemanager', projectId:'none', command:'createProject', param1:name, param2:path}, success, view, failure);
		} else {
			view.notificationManager.notify('A project name must be supplied before you can create a project.',3);
		}
	};
	
	var cancel = function(){
		$('#projectInput').val('');
	};
	
	$('#createProjectDialog').dialog({autoOpen:false, modal:true, draggable:false, title:'Create a New Project', width:650, buttons: {'Submit':submit, 'Cancel': function(){$(this).dialog("close");}}});
};

/**
 * Creates and renders the dialog to create a new sequence.
 */
View.prototype.initializeCreateSequenceDialog = function(){
	var view = this;
	
	var submit = function(){
		var name = $('#createSequenceInput').val();
		var nodes = view.getProject().getSequenceNodes();
		
		/* validate user name input */
		if(name==null || name==""){
			view.notificationManager.notify('Please create a title for your new Activity', 3);
			return;
		}

		/* validate no duplicate titles */
		for(var s=0;s<nodes.length;s++){
			if(view.getProject().getNodeByTitle(name)){
				view.notificationManager.notify('An Activity with that title already exists. Try another title.', 3);
				return;
			}
		}

		/* processes the results from the request to create a new sequence and cleans up the dialog upon completion */
		var success = function(t,x,o){
			if(t){
				o.placeNode = true;
				o.placeNodeId = t;
				o.loadProject(o.project.getContentBase() + o.utils.getSeparator(o.project.getContentBase()) + o.project.getProjectFilename(), o.project.getContentBase(), true);
				$('#createSequenceDialog').dialog('close');
			} else {
				o.notificationManager.notify('Unable to create new Activity on the WISE server.', 3);
			}
		};
		
		/* handles the failure for the request to create new sequence */
		var failure = function(t,o){
			o.notificationManager.notify('unable to create new Activity on the WISE server', 3);
		};
		
		var path = view.utils.getContentPath(view.authoringBaseUrl, view.project.getUrl());
		var id = view.getProject().generateUniqueId('seq');
		view.connectionManager.request('POST',1,view.requestUrl,{forward:'filemanager',projectId:view.portalProjectId,command:'createSequence',param1:path,param2:name,param3:id},success,view,failure);

	};
	
	var cancel = function(){
		$('#createSequenceInput').val('');
	};
	
	$('#createSequenceDialog').dialog({autoOpen:false, draggable:true, resizable:false, title:'Add a New Activity', width:650, buttons: {'Submit':submit}, close: cancel});
};

/**
 * Creates and renders the dialog to create a new node
 */
View.prototype.initializeCreateNodeDialog = function (){
	var view = this;
	
	var submit = function(){
		/* validates that a node title was entered */
		var title = $('#createNodeTitle').val();
		if(title==null || title==""){
			view.notificationManager.notify('Please enter a title for the Step.', 3);
			return;
		}

		/* validates that a node type was selected */
		var type = $('#createNodeType').val();
		if(type==null || type==""){
			view.notificationManager.notify('Please select a Step type.', 3);
			return;
		}
		
		/* validates the node class */
		var nodeclass = $('#selectNodeIcon').val();
		if(nodeclass==null || nodeclass==''){
			view.notificationManager.notify('Node icon not selected.', 3);
			return;
		}
		
		/* handles the success for the request to create a new node */
		var success = function(t,x,o){
			if(t=='nodeNotProject'){
				o.notificationManager.notify('Unable to attach Step to project, please contact administrator.', 3);
			} else {
				o.placeNode = true;
				o.placeNodeId = t;
				o.loadProject(o.project.getContentBase() + o.utils.getSeparator(o.project.getContentBase()) + o.project.getProjectFilename(), o.project.getContentBase(), true);
				$('#createNodeDialog').dialog('close');
			}
		};
		
		/* handles the failure for a request to create a new node */
		var failure = function(t,o){
			o.notificationManager.notify('unable to create Step on the WISE server', 3);
		};

		var path = view.utils.getContentPath(view.authoringBaseUrl,view.project.getUrl());
		view.connectionManager.request('POST',1,view.requestUrl,{forward:'filemanager',projectId:view.portalProjectId,command:'createNode',param1:path,param2:nodeclass,param3:title,param4:type},success,view,failure);
	};

	var cancel = function(){
		$('#createNodeType').val('');
		$('#createNodeTitle').val('');
		
		if($('#selectNodeIconDiv')){
			$('#selectNodeIconDiv').remove();
		}
	};
	
	//populate the drop down box with the step types
	this.populateCreateNodeChoices();
	
	$('#createNodeDialog').dialog({autoOpen:false, draggable:false, resizeable:false, resizable:false, width:650, title:'Add a New Step', buttons: {'Submit':submit}, close: cancel});
};

/**
 * Populate the choices for the add a new step dialog box
 */
View.prototype.populateCreateNodeChoices = function() {
	//get all the node names
	var acceptedTagNames = NodeFactory.acceptedTagNames;
	
	//get all the node constructors
	var nodeConstructors = NodeFactory.nodeConstructors;
	
	//loop through all the noe names
	for(var x=0; x<acceptedTagNames.length; x++) {
		//get a node name
		var nodeName = acceptedTagNames[x];
		
		//get a constructor
		var constructor = nodeConstructors[nodeName];
		
		/*
		 * check if there is a constructor, some node names do not have constructors
		 * such as 'sequence'. if the node name does not have a constructor it
		 * means it is not a node that can be created.
		 */
		if(constructor != null) {
			//get the name of the node that will be seen in the "select step type:" options
			var authoringToolName = constructor.authoringToolName;
			
			if(authoringToolName == null) {
				//use this as a default if authoringToolName is not provided
				authoringToolName = "(Insert Step Type Name Here)";
			}
			
			//create the option html
			var optionHtml = "<option value='" + nodeName + "'>" + authoringToolName + "</option>";
			
			//add the option to the select drop down box
			$('#createNodeType').append(optionHtml);
		}
	}
};

/**
 * Creates and renders the dialog to edit the project file
 */
View.prototype.initializeEditProjectFileDialog = function(){
	var view = this;
	
	var submit = function(){
		var text = $('#projectText').val();
		if(text && text != ''){
			/* processes the response to the request to update project file after editing */
			var success = function(t,x,o){
				if(t!='success'){
					o.notificationManager.notify('Unable to save project to WISE server', 3);
				} else {
					o.loadProject(o.getProject().getUrl(), o.getProject().getContentBase(), true);
					$('#editProjectFileDialog').dialog('close');
				}
			};
			
			/* handles the failure case when the request to update the edited project file fails */
			var failure = function(t,o){
				o.notificationManager.notify('Unable to save project to the WISE server', 3);
			};
		} else {
			view.notificationManager.notify('No project text found to save, aborting...', 3);
		}
		
		var path = view.utils.getContentPath(view.authoringBaseUrl,view.getProject().getContentBase());
		var filename = view.getProject().getProjectFilename();
		
		view.connectionManager.request('POST',1,view.requestUrl,{forward:'filemanager',projectId:view.portalProjectId,command:'updateFile',param1:path,param2:filename,param3:text},success,view,failure);
	};

	var cancel = function(){
		$('projectText').val('');
	};
	
	$('#editProjectFileDialog').dialog({autoOpen:false, draggable:false, width:900, buttons: {'Submit':submit}, close: cancel});
};

/**
 * Initializes and renders the asset uploader dialog.
 */
View.prototype.initializeAssetUploaderDialog = function(){
	var view = this;
	
	var submit = function(){
		var filename = $('#uploadAssetFile').val();
		
		if(filename && filename != ''){
			if(!view.utils.fileFilter(view.allowedAssetExtensions,filename)){
				view.notificationManager.notify('Sorry, the specified file type is not allowed.', 3);
				return;
			} else {
				var frameId = 'assetUploadTarget_' + Math.floor(Math.random() * 1000001);
				var frame = createElement(document, 'iframe', {id:frameId, name:frameId, src:'about:blank', style:'display:none;'});
				var form = createElement(document, 'form', {id:'assetUploaderFrm', method:'POST', enctype:'multipart/form-data', action:view.assetRequestUrl, target:frameId, style:'display:none;'});
				var assetPath = view.utils.getContentPath(view.authoringBaseUrl,view.project.getContentBase());
				
				/* create and append elements */
				document.body.appendChild(frame);
				document.body.appendChild(form);
				form.appendChild(createElement(document,'input',{type:'hidden', name:'path', value:assetPath}));
				form.appendChild(createElement(document,'input',{type:'hidden', name:'forward', value:'assetmanager'}));
				form.appendChild(createElement(document,'input',{type:'hidden', name:'projectId', value:view.portalProjectId}));

				/* set up the event and callback when the response comes back to the frame */
				frame.addEventListener('load',view.assetUploaded,false);
				
				/* change the name attribute to reflect that of the file selected by user */
				document.getElementById('uploadAssetFile').setAttribute("name", filename);
				
				/* remove file input from the dialog and append it to the frame before submitting, we'll put it back later */
				var fileInput = document.getElementById('uploadAssetFile');
				form.appendChild(fileInput);
				
				/* submit hidden form */
				form.submit();
				
				/* put the file input back and remove form now that the form has been submitted */
				document.getElementById('assetUploaderBodyDiv').insertBefore(fileInput, document.getElementById('assetUploaderBodyDiv').firstChild);
				document.body.removeChild(form);
				
				/* close the dialog */
				$('#assetUploaderDialog').dialog('close');
			}
		} else {
			view.notificationManager.notify('Please specify a file to upload.',3);
		}
	};

	var cancel = function(){
		$('#uploadAssetFile').val('');
	};
	
	$('#assetUploaderDialog').dialog({autoOpen:false, draggable:false, modal:true, width:600, buttons: {'Submit':submit}, close: cancel});
};

/**
 * Initializes and renders asset editor dialog with clean up function.
 */
View.prototype.initializeAssetEditorDialog = function(){
	var view = this;
	
	var remove = function(){
		var parent = document.getElementById('assetSelect');
		var ndx = parent.selectedIndex;
		if(ndx!=-1){
			var opt = parent.options[parent.selectedIndex];
			var name = opt.value;

			var success = function(text, xml, o){
				if(text.status==401){
					xml.notificationManager.notify('You are not authorized to remove assets from this project. If you believe this is an error, please contact an administrator.',3);
				} else {
					parent.removeChild(opt);
					o.notificationManager.notify(text, 3);
					
					/* call upload asset with 'true' to get new total file size for assets */
					o.uploadAsset(true);
				}
			};
			
			view.connectionManager.request('POST', 1, view.assetRequestUrl, {forward:'assetmanager', projectId:view.portalProjectId, command: 'remove', path: view.utils.getContentPath(view.authoringBaseUrl,view.project.getContentBase()), asset: name}, success, view, success);
		}
	};

	var done = function(){
		$('#assetEditorDialog').dialog('close');
		$('#uploadAssetFile').val('');
		
		replaceNotificationsDiv();
	};
	
	var cancel = function(){
		$('#assetSelect').children().remove();
		$('#uploadAssetFile').val('');
		$('#sizeDiv').html('');
		
		replaceNotificationsDiv();
	};
	
	var show = function(){
		$('#assetUploaderBodyDiv').after($('#notificationDiv')); // temporarily move notifications div to assets dialog
		clearNotifcations(); // clear out any existing notifications
		eventManager.fire('browserResize');
	};
	
	var clearNotifcations = function(){
		$('.authoringMessages > span').each(function(){
			var messageId = $(this).attr('id');
			notificationEventManager.fire('removeMsg',messageId);
		});
	};
	
	var replaceNotificationsDiv = function(){
		$('#authorOptions').after($('#notificationDiv')); // move notifications div back to default authoring location
		clearNotifcations(); // clear out any existing notifications
		eventManager.fire('browserResize');
	};
	
	$('#assetEditorDialog').dialog({autoOpen:false, draggable:true, modal:true, width:600, title: 'Project Files', buttons: {'Done': done, 'Remove Selected File': remove}, close: cancel, open:show});
};

/**
 * Initializes and renders copy project dialog
 */
View.prototype.initializeCopyProjectDialog = function (){
	var view = this;
	
	var submit = function(){
		var select = document.getElementById('copyProjectSelect');
		var option = select.options[select.selectedIndex];
		var selectedProjectPath = option.value;
		var portalProjectId = option.id;
		var title = option.title;
		var filename = option.filename;
		
		/* processes the response to the request to copy a project */
		var success = function(t,x,o){
			o.notificationManager.notify('Project copied to: ' + t, 3);
			/* create new project in the portal if in portal mode */
			if(o.portalUrl){
				o.createPortalProject(t + '/' + option.filename, option.title, portalProjectId);
			}
			
			$('#copyProjectDialog').dialog('close');
		};
		
		/* handles a failure response to the request to copy a project */
		var failure = function(t,o){
			o.notificationManager.notify('Failed copying project on server.', 3);
		};
		
		view.connectionManager.request('POST',1,view.requestUrl,{forward:'filemanager',projectId:portalProjectId,command:'copyProject',param2:view.primaryPath,param1:selectedProjectPath},success,view,failure);
	};
	
	var cancel = function(){
		$('#copyProjectDialog').dialog('close');
	};
	
	$('#copyProjectDialog').dialog({autoOpen:false, modal: true, draggable:false, title:'Copy a Project', width:500, buttons: {'Cancel': cancel, 'Copy': submit}});
};

/**
 * Initialize and renders the edit project metadata dialog
 */
View.prototype.initializeEditProjectMetadataDialog = function(){
	var view = this;
	
	var updateProjectMetadata = function(){
		view.projectMeta.title = $('#projectMetadataTitle').val();
		view.projectMeta.author = $('#projectMetadataAuthor').val();
		view.projectMeta.subject = $('#projectMetadataSubject').val();
		view.projectMeta.summary = $('#projectMetadataSummary').val();
		view.projectMeta.gradeRange = view.utils.getSelectedValueById('projectMetadataGradeRange');
		view.projectMeta.totalTime = view.utils.getSelectedValueById('projectMetadataTotalTime');
		view.projectMeta.compTime = view.utils.getSelectedValueById('projectMetadataCompTime');
		view.projectMeta.contact = $('#projectMetadataContact').val();
		view.projectMeta.techReqs = {};		
		view.projectMeta.techReqs.java = $("#java").attr("checked");
		view.projectMeta.techReqs.flash = $("#flash").attr("checked");
		view.projectMeta.techReqs.quickTime = $("#quickTime").attr("checked");
		view.projectMeta.techReqs.techDetails = $('#projectMetadataTechDetails').val();
		view.projectMeta.lessonPlan = $('#projectMetadataLessonPlan').val();
		view.projectMeta.keywords = $('#projectMetadataKeywords').val();
		view.projectMeta.language = $('#projectMetadataLanguage').val();
		
		view.updateProjectMetaOnServer(true);
	};
	

	var undoProjectMetadata = function(){
		view.editProjectMetadata();
	};
	
	var cancel = function(){
		$('#editProjectMetadataDialog').dialog('close');
	};
	
	$('#editProjectMetadataDialog').dialog({autoOpen:false, draggable:false, modal:true, title:'Edit Project Information', width:850, buttons: {'Close': cancel, 'Revert To Last Save': undoProjectMetadata, 'Save Changes': updateProjectMetadata}});
};

/**
 * Initializes and renders the previous work dialog.
 */
View.prototype.initializePreviousWorkDialog = function(){
	var view = this;
	
	var savePreviousWork = function(){
		//clear activeNode's current prevWorkNodeIds list
		view.activeNode.prevWorkNodeIds = [];
		
		//add all node id's that are in the TO list
		var opts = document.getElementById('selectTo').options;
		for(var i=0;i<opts.length;i++){
			view.activeNode.prevWorkNodeIds.push(opts[i].value);
		};
		
		//save project
		view.saveProject();
		
		$('#previousWorkDialog').dialog('close');
	};

	var cancelChanges = function(){
		$('#previousWorkDialog').dialog('close');
	};
	
	var onClose = function(){
		view.clearCols();
	};
	
	$('#previousWorkDialog').dialog({autoOpen:false, draggable:false, width:800, height:500, buttons: {'Cancel Changes': cancelChanges, 'Save Changes': savePreviousWork}, close: onClose});
};

/**
 * Initializes and renders the node selector dialog
 */
View.prototype.initializeNodeSelectorDialog = function(){
	$('#nodeSelectorDialog').dialog({autoOpen:false, draggable:false, width:600, height:'auto'});
};

/**
 * Initializes and renders the clean project dialog
 */
View.prototype.initializeCleanProjectDialog = function(){
	$('#cleanProjectDialog').dialog({autoOpen:false, draggable:false, resizable:false, width:1000, height:300, dialogClass:'no-title', modal:true});
};

/**
 * Initializes and renders the version project dialog
 */
View.prototype.initializeVersionProjectDialog = function(){
	$('#versionProjectDialog').dialog({autoOpen:false,width:650,dialogClass:'no-title'});
};

/**
 * Initializes and render the set active version dialog for the project.
 */
View.prototype.initializeSetActiveVersionDialog = function(){
	$('#setActiveVersionDialog').dialog({autoOpen:false,width:650,dialogClass:'no-title'});
};

/**
 * Initializes and renders the open version dialog for the project.
 */
View.prototype.initializeOpenVersionDialog = function(){
	$('#openVersionDialog').dialog({autoOpen:false,width:650,dialogClass:'no-title'});
};

/**
 * Initializes and renders the create snapshot dialog.
 */
View.prototype.initializeCreateSnapshotDialog = function(){
	$('#createSnapshotDialog').dialog({autoOpen:false,width:650,dialogClass:'no-title'});
};

/**
 * Initializes and renders the snapshot information dialog
 */
View.prototype.initializeSnapshotInformationDialog = function(){
	$('#snapshotInformationDialog').dialog({autoOpen:false,width:650,dialogClass:'no-title'});
};

/**
 * Initializes the constraint authoring dialog
 */
View.prototype.initializeConstraintAuthoringDialog = function(){
	$('#constraintAuthoringDialog').dialog({autoOpen:false,width:1000,resizable:false,draggable:false,position:'top',title:'Author Student Navigation Constraints', dialogClass:'constraintAuthoring',close:function(){eventManager.fire('closingConstraintDialog');},stack:false,modal:true});
};

/**
 * Initializes the open project dialog.
 */
View.prototype.initializeOpenProjectDialog = function(){
	$('#openProjectDialog').dialog({autoOpen:false, draggable:false, width:650, modal:true, title:'Open a Project', buttons: {'Open': function(){eventManager.fire('projectSelected');}, 'Cancel': function(){$(this).dialog("close");}}});
};

/**
 * Initializes the author project dialog.
 */
View.prototype.initializeAuthorStepDialog = function(){
	$('#authorStepDialog').dialog({autoOpen:false, width:800, height:600, resizable:true, draggable:true, modal:true, title:'Edit Step', open: function(){}, buttons: {'Save':function(){eventManager.fire("saveStep");},'Save and Close':function(){eventManager.fire("saveAndCloseStep");},'Close':function(){eventManager.fire("closeStep");}}});
};

/**
 * Initialized the edit project tags dialog.
 */
View.prototype.initializeEditProjectTagsDialog = function(){
	$('#editProjectTagsDialog').dialog({autoOpen:false, draggable:false, width:750, hide:'slow', title:'Add/Edit Project Tags'});
};

View.prototype.initializeReviewUpdateProjectDialog = function(){
	var submit = function() {
		eventManager.fire('updateProject');
		$('#reviewUpdateProjectDiv').dialog('close');
	};
	
	var cancel = function() {
		$('#reviewUpdateProjectDiv').dialog('close');
	};
	
	$('#reviewUpdateProjectDiv').dialog({autoOpen:false, draggable:false, resizeable:false, mode:true, width:800, height:600, title:'Review Update Project', buttons: {'Cancel':cancel, 'Update':submit}});
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_dialog.js');
}