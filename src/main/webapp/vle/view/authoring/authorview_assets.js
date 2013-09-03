/**
 * Functions related to the asset manager in the authoring view
 * 
 * @author patrick lawler
 * @author jonathan lim-breitbart
 */

/**
 * Initializes and renders asset editor dialog with clean up function.
 */
View.prototype.initializeAssetEditorDialog = function(){
	var view = this;
	view.assetStorageUsed = 0;
	var maxAssetSize = view.utils.appropriateSizeText(view.MAX_ASSET_SIZE);
	
	// prevent window's default behavior of loading a dragged and dropped file
	window.addEventListener("dragover",function(e){
	  e = e || event;
	  e.preventDefault();
	},false);
	window.addEventListener("drop",function(e){
	  e = e || event;
	  e.preventDefault();
	},false);
	
	// insert info (help) icon tooltip content
	$('#assetsHelp').addClass('tooltip').data({'tooltip-class':'info', 'tooltip-anchor':'left', 'tooltip-event':'click', 'tooltip-content':view.getI18NStringWithParams('help_authoring_assets_info', [maxAssetSize,view.allowedAssetExtensionsByType['image'].join(', '),view.allowedAssetExtensionsByType['video'].join(', '),view.allowedAssetExtensionsByType['audio'].join(', '),view.allowedAssetExtensionsByType['flash'].concat(view.allowedAssetExtensionsByType['flashvideo']).join(', '),view.allowedAssetExtensionsByType['java'].join(', '),view.allowedAssetExtensionsByType['misc'].join(', ')])});
	// insert tooltip
	view.insertTooltips($('#assetsHelp'));
	
	// bind asset select all checkbox click action
	$('#assetSelectAll').off('click').on('click',function(e){
		e.stopPropagation();
		$(this).prop('checked') == true ? view.selectAssetsAll() : view.selectAssetsNone();
	});
	
	// close dialog function
	var done = function(){
		// clear out asset editor params, notifications, and upload progress
		view.assetEditorParams = null;
		$('#assetNotifications').empty();
		$('#uploadsWrapper').removeClass('show').hide().html('');
		$('#uploadDrop').addClass('show').height('').show();
		if(view.uploadTimeout){
			view.uploadTimeout.clearTimeout();
		}
	};
	
	var show = function(element){
		// unfocus all dialog buttons (jQuery focuses 1st button by default)
		$('.ui-dialog-buttonset .ui-button', $(element)).blur();
		
		// unfocus input elements (jQuery UI automatically focuses first input element on dialog open - will be fixed in jQuery 1.10: http://bugs.jqueryui.com/ticket/4731)
		$('input, button',$(element)).blur();
		
		// refresh pluploader instance and fix z-index problem
		view.assetUploader.refresh();
		$('#uploadFile').css('zIndex',1); // default was 0
		$('#assetUpload > div.plupload').css('zIndex',0); // default was -1, which was making browse click not work in Chrome/Webkit
	};
	
	// set default buttons for asset editor dialog
	//this.assetEditorButtons = [{text: this.getI18NString("close"), click: function(){ $('#assetEditorDialog').dialog('close'); }, class: 'secondary'}, 
								//{text: this.getI18NString("authoring_dialog_assets_remove"), click: remove}];
	
	// setup asset editor dialog
	$('#assetEditorDialog').dialog({autoOpen:false, draggable:true, modal:true, width:820, title: this.getI18NString("authoring_dialog_assets_title"),
		//buttons: this.assetEditorButtons,
		dialogClass: 'settings',
		open: function(){
			show.call(this);
		},
		close: done,
		beforeclose: function(){
			// prevent dialog from closing when uploads are in progress
			if(view.assetUploader.state === 2){
				return false;
			}
		}
	});
	
	// setup pluploader instance for file uploads
	view.assetUploader = new plupload.Uploader({
		runtimes : 'html5,html4',
		browse_button : 'uploadFile',
		container : 'assetUpload',
		drop_element : 'uploadDrop',
		max_file_size : maxAssetSize.toLowerCase().replace(' ',''),
		url : view.assetRequestUrl
		//filters : [
			//{title : "File types", extensions : view.allowedAssetExtensions.toString()}
		//]
	});

	view.assetUploader.init();

	view.assetUploader.bind('FilesAdded', function(up, files) {
		$('#assetNotifications').html('');
		if(view.assetStorageExceeded){
			// storage limit has already been exceeded, so notify user
			view.notificationManager.notify(o.getI18NString("authoring_dialog_assets_max_storage_exceeded"), 3, 'error', 'assetNotifications');
			// remove all files from upload queue
			$.each(files, function(i, file) {
				up.removeFile(this);
			});
		} else {
			//if(view.uploadTimeout){
				//view.uploadTimeout.clearTimeout();
			//}
			
			// if user selected more than 5 files alert user that only the first 5 will be uploaded
			var count = files.length, max = 5;
			if(count>max){
				alert(view.getI18NStringWithParams('authoring_dialog_assets_max_upload_limit',[max.toString(),(count-max).toString()]));
			}
			
			// hide drop and notifications areas, show progress area
			//$('#uploadComplete').width(0);
			$('#uploadDrop').removeClass('show').hide();
			$('#uploadsWrapper').addClass('show').show();
			
			// show progress headers
			var progressHeader = '<div id="uploads" class="settingsHeader">' +
					'<span>' + view.getI18NString('authoring_dialog_assets_upload_header') + '</span>' +
					'<div id="uploadProgressWrapper">' + 
					'<div id="uploadProgress">' +
					'<span id="uploadTotal"><span id="upsCompleted">0</span>/<span id="upsQueued">0</span></span>' +
					'<div id="uploadPercent"><div id="uploadComplete"></div></div>' +
					'</div>' +
					'</div></div>' + 
					'<ul id="uploadAssets"></ul>';
			$('#uploadsWrapper').html(progressHeader);
			
			// for each file, add progress element to DOM; remove file if we've already added 5
			var fileCount = 0, toUpload = 0;
			$.each(files, function(i, file) {
				var doPost = true;
				if(i>(max-1)){
					up.removeFile(this);
				} else {
					//check for duplicate filename
					var isDupe = false;
					for(var i=0;i<view.assets.length;i++){
						if(file.name == view.assets[i].assetFileName){
							isDupe = true;
							break;
						}
					}
					
					if(isDupe){
						// file is a duplicate of existing asset, so confirm overwrite before uploading
						doPost = confirm(view.getI18NStringWithParams('authoring_dialog_assets_confirm_overwrite',[file.name]));
						//if (!doPost) { addFile = false; };
					}
					
					fileCount++;
					
					$('#uploadAssets').append(
						'<li id="progress_' + file.id + '" class="progress">' +
						file.name + ' (' + plupload.formatSize(file.size) + ') - <span class="info">0%</span>' +
					'</li>');
					
					if (!doPost){
						// user chose not to overwrite, so show message in file's progress element
						$('#progress_' + file.id + ' .info').html(view.getI18NString('authoring_dialog_assets_duplicate_skipped'));
						up.removeFile(this);
					} else if (file.name.indexOf('.') == -1 && file.size % 4096 == 0){
			            // user tried to drag a folder, so remove the file from the queue
						up.removeFile(this);
						// show error message in file's progress element
						$('#progress_' + file.id).addClass('error');
						$('#progress_' + file.id + ' .info').html(view.getI18NString('authoring_dialog_assets_folder_error'));
			        } else if(!view.utils.fileFilter(view.allowedAssetExtensions,file.name)){
						// asset extension isn't allowed, so remove from queue
						up.removeFile(this);
						// show error message in file's progress element
						$('#progress_' + file.id).addClass('error');
						$('#progress_' + file.id + ' .info').html(view.getI18NString('authoring_dialog_assets_filetype_error'));
					} else {
						// file is allowed, add to upload total
						toUpload++;
					}
				}
				if(--count == 0){ // all files have been processed
					// add file count to progress display
					$('#upsQueued').html(fileCount);
					// recenter dialog window
					$("#assetEditorDialog").dialog("option", "position", "center");
					
					if(toUpload > 0){
						// start uploads
						view.pluploadAssets();
					} else {
						// no uploads to POST, so re-enable upload button
						$('#uploadFile').prop('disabled',false).removeClass('disabled');
						
						$('#uploadDrop').height($('#uploadsWrapper').outerHeight()-2);
						
						// hide upload progress and show drop target after 30 seconds
						/*view.uploadTimeout = setTimeout(function(){
							$('#uploadsWrapper').removeClass('show').fadeOut('slow').html('');
							$('#uploadDrop').addClass('show').height('').fadeIn('slow');
						},60000);*/
					}
				}
			});
		}
	});
	
	view.assetUploader.bind('BeforeUpload', function(up, file) {
		up.settings.file_data_name = file.name;
	});

	view.assetUploader.bind('UploadProgress', function(up, file) {
		$('#progress_' + file.id + ' .info').html(file.percent + '%');
		$('#uploadComplete').width(up.total.percent.toString() + '%');
	});

	view.assetUploader.bind('Error', function(up, err) {
		alert(err.message + (err.file ? ", File: " + err.file.name : ""));
	});

	view.assetUploader.bind('FileUploaded', function(up, file, response) {
		var completed = parseInt($('#upsCompleted').text());
		// hide processing image
		//alert(response.response);
		
		var message = "100%", msgClass = 'success';
		
		if(response.response.indexOf("server has encountered an error") != -1) {
			//the server returned a generic error page
			message = view.getI18NStringWithParams('authoring_dialog_assets_upload_size_error',[view.utils.appropriateSizeText(o.MAX_ASSET_SIZE)]);
			msgClass = 'error';
		} else if(response.response.indexOf("exceed the maximum storage capacity") != -1) {
			//the server returned a file space error
			message = view.getI18NString('authoring_dialog_assets_upload_exceed_capacity_error');
			msgClass = 'error';
		} else if(response.response.indexOf("Access to path is denied") != -1){
			// the server returned a permissions error
			message = view.getI18NString('authoring_dialog_assets_upload_perm_error');
			msgClass = 'error';
		} else if (response.response.indexOf("successfully uploaded") != -1){
			// file was uploaded successfully
			completed++;
			message = view.getI18NString('authoring_dialog_assets_upload_success');
			if(file.name.indexOf(' ') != -1) {
				/*
				 * the file name contains a space so we will alert a message to
				 * notify them that they may need to replace the spaces with
				 * %20 when they reference the file in steps.
				 */ 
				
				/*
				 * replace all the spaces with %20 so we can show the author how
				 * they should reference the file
				 */
				var fixedFileName = file.name.replace(/ /g, '%20');
				
				//add to message
				//message += '<span style="font-weight:normal;">' + view.getI18NStringWithParams('authoring_dialog_assets_upload_space_warning',[fixedFileName]) + '</span>';
				message += ' <span class="extra">' + view.getI18NStringWithParams('authoring_dialog_assets_upload_space_warning',[fixedFileName]) + '</span>';
			}
		} else {
			// there was some other error, so show generic error message
			message = view.getI18NString('authoring_dialog_assets_upload_generic_error');
			msgClass = 'error';
		}
		
		// update files completed
		$('#upsCompleted').text(completed);
		
		// insert response into file's upload progress entry
		$('#progress_' + file.id).addClass(msgClass);
		$('#progress_' + file.id + ' .info').html(message);
	});
	
	view.assetUploader.bind('UploadComplete', function(up, files) {
		$('#uploadFile').prop('disabled',false).removeClass('disabled');
		
		// hide upload progress and show drop target after 30 seconds
		/*view.uploadTimeout = setTimeout(function(){
			$('#uploadsWrapper').removeClass('show').fadeOut('slow').html('');
			$('#uploadDrop').addClass('show').height('').fadeIn('slow');
		},60000);*/
		
		$('#uploadDrop').height($('#uploadsWrapper').outerHeight()-2);
		
		eventManager.fire('viewAssets',view.assetEditorParams);
	});
	
	//if(Modernizr.input['multiple']){
	//}
	
	if (Modernizr.draganddrop && window.FileReader){
		
		// change appearance of the asset drop area when dragging files over it
		$('#uploadDrop, #uploadsWrapper').on({
		    dragenter: function(e){
		    	if(view.assetUploader.state === 1){
		    		$('#uploadsWrapper').hide();
			    	$('#uploadDrop').show().addClass('drag');
			        e.preventDefault();
		    	}
		    }
		});
		
		$('#uploadDrop').on({
			drop: function(e){
				$('#uploadDrop').removeClass('drag');
				e.preventDefault();
			},
			dragleave: function(e){
		    	if(!$('#uploadDrop').hasClass('show')){
		    		$('#uploadDrop').hide();
		    	}
		    	$('#uploadDrop').removeClass('drag');
		    	if($('#uploadsWrapper').hasClass('show')){
		    		$('#uploadsWrapper').show();
		    	}
		    	e.preventDefault();
		    }
		});
				
	} else {
		// HTML5 drag and drop not supported, so remove asset drop area
		$('#uploadDrop').remove();
	}
};

/**
 * Retrieves a list of any assets associated with the current project from the server, populates a list of the 
 * assets in the assetEditorDialog and displays the dialog.
 * Optionally displays the dialog in select file mode (which allows user to select a file and submit it to a
 * callback function) - activated by sending a "params" object as the function's argument
 * 
 * @param params Object (optional) specifying asset editor options:
 * - "type" String identifying type of files to show (optional; choices are "image", "video", "audio", "flash", 
 * "media" [excludes images], "all"; default is "all")
 * - "extensions" Array of strings identifying specific file extension types to show (optional; overrides "type" option)
 * - "button_text" String to display on the new button that will be inserted into the dialog (optional; default is 
 * i18n string for "Submit"; note: a "Cancel" button will also be added)
 * - "callback" Function to run when file is selected and submit button is pressed (required)
 * - any other variables your callback function may depend upon (callback function will be passed back the url [filename]
 * of the asset that was selected as well as the "params" object as its two arguments)
 * 
 * If no params object is sent, the assets dialog will simply open (with no dialog buttons and no file extension filters)
 */
View.prototype.viewAssets = function(params){
	if(this.getProject()){
		this.assetEditorParams = params ? params : null;
		var view = this;
		
		// clear assets table
		var assetTable = document.getElementById('assetSelect');
		if ($.fn.dataTable.fnIsDataTable( assetTable ) ) {
			$(assetTable).dataTable().fnClearTable();
			//$(assetTable).dataTable().fnSort( [ [1,'asc'] ] );
		} else {
			// initialize assets dataTable
			$('#assetSelect').dataTable( {
				"sScrollY": "200px",
				//"bScrollCollapse": true,
		        "bPaginate": false,
		        "sDom": 't<"bottom"if><"clear">',
		        "aoColumns": [
                     { "sSortDataType": "dom-checkbox" },
                     null,
                     { "sType": "file-size" },
                     null,
                     null
                 ],
                 "aaSorting": [ [1,'asc'] ],
                 "oLanguage": {
                	 "sInfo": "_TOTAL_ " + view.getI18NString("authoring_dialog_assets_table_footer_files"),
                	 "sEmptyTable": view.getI18NString("authoring_dialog_assets_table_empty"),
                	 "sInfoFiltered": "/ _MAX_ " + view.getI18NString("datatables_total"), // (from _MAX_ total)
                	 "sSearch": view.getI18NString("datatables_search")
                  }
			} );
		}
		
		// get default buttons for asset editor dialog
		//var buttons = view.assetEditorButtons;
		
		// check whether parameters were sent
		if(view.assetEditorParams){
			var params = view.assetEditorParams;
			// set variables based on params
			var type, extensions, buttonText, callback;
			type = params.type ? params.type : 'all';
			extensions = params.extensions ? params.extensions : null;
			button_text = params.button_text ? params.button_text : view.getI18NString("submit");
			callback = params.callback ? params.callback : function(params,url){};
			
			// add a cancel button
			var buttons = [];
			var cancelButton = {text: view.getI18NString("cancel"), click: function(){ $('#assetEditorDialog').dialog('close'); }, class: 'secondary'};
			buttons.push(cancelButton);
			
			// set z-index to show dialog above tinymce popups
			$( "#assetEditorDialog" ).dialog( "option", "zIndex", 400000 );
			
			// add new submit button
			var button = {
					text: button_text,
					click: function(){
						var selected = oTable.$('tr.selected');
						if(selected.length == 1){
							url = selected[0].data('filename');
							if(url != ''){
								// fire the callback function with the select asset url and the asset editor parameters object
								callback(url,params);
								// close the dialog
								$(this).dialog('close');
							}
						} else if(selected.length > 1){
							// multiple files are selected
							alert(view.getI18NString('authoring_dialog_assets_multi_selected_error'));
						} else {
							// no files are selected
							alert(view.getI18NString('authoring_dialog_assets_none_selected_error'));
						}
					}
				};
			buttons.unshift(button);
			
			// set dialog title depending on type param
			var title = view.getI18NString('authoring_dialog_assets_select_title');
			if(type == "image"){
				title = view.getI18NString('authoring_dialog_assets_select_title_image');
			} else if (type == "video"){
				title = view.getI18NString('authoring_dialog_assets_select_title_video');
			} /*else if (type == "media"){
				title = 'Select a Media File';
			} */else if (type == "audio"){
				title = view.getI18NString('authoring_dialog_assets_select_title_audio');
			} else if (type == "flash"){
				title = view.getI18NString('authoring_dialog_assets_select_title_flash');
			}
		} else {
			//reset z-index
			$( "#assetEditorDialog" ).dialog( "option", "zIndex", {} );
		}
		
		// set buttons
		$( "#assetEditorDialog" ).dialog( "option", "buttons", buttons );
		
		// show loading image
		$('#assetsOverlay').show();
		
		// de-select any selected assets
		view.selectAssetsNone();
		
		//show dialog
		$('#assetEditorDialog').dialog('open');
		
		// set notification div width to adjust for upload button width
		$('#assetNotify').css('margin-left',$('#assetUpload').outerWidth() + 10 + 'px');
		
		// clear out upload asset input value
		$('#uploadAssetFile').val('');
		
		var populateOptions = function(projectListText, args){
			var view = args[0];
			
			if(projectListText && projectListText!=''){
				//get the project list as JSON
				var projectList = JSON.parse(projectListText);
				
				//get the first project (there will only be one anyway)
				var projectAssetsInfo = projectList[0];
				
				view.assets = [];
				
				if(projectAssetsInfo != null) {
					//get the assets array
					view.assets = projectAssetsInfo.assets;
				}
				
				//loop through all the assets
				for(var d=0;d<view.assets.length;d++){
					//get an asset
					var asset = view.assets[d];
					
					//get the file name of the asset
					var fileName = asset.assetFileName;
					
					//check for type parameter and only show files with matching extensions
					if(view.assetEditorParams && view.assetEditorParams.type == "image"){
						if (!view.utils.fileFilter(view.allowedAssetExtensionsByType['image'],fileName)){
							continue;
						}
					} else if(view.assetEditorParams && view.assetEditorParams.type == "flash"){
						if (!view.utils.fileFilter(view.allowedAssetExtensionsByType['flash'],fileName)){
							continue;
						}
					} else if(view.assetEditorParams && view.assetEditorParams.type == "video"){
						var extensions = view.allowedAssetExtensionsByType['video'];
						if (!view.utils.fileFilter(extensions,fileName)){
							continue;
						}
					} else if(view.assetEditorParams && view.assetEditorParams.type == "audio"){
						var extensions = view.allowedAssetExtensionsByType['audio'];
						if (!view.utils.fileFilter(extensions,fileName)){
							continue;
						}
					} else if(view.assetEditorParams && view.assetEditorParams.type == "media"){
						var extensions = view.allowedAssetExtensionsByType['flash'].concat(view.allowedAssetExtensionsByType['flashvideo'],view.allowedAssetExtensionsByType['video'],view.allowedAssetExtensionsByType['audio']);
						if (!view.utils.fileFilter(extensions,fileName)){
							continue;
						}
					} else if(view.assetEditorParams && view.assetEditorParams.type == "all"){
						var extensions = view.allowedAssetExtensions;
						if (!view.utils.fileFilter(extensions,fileName)){
							continue;
						}
					} else if(view.assetEditorParams && view.assetEditorParams.extensions 
						&& view.assetEditorParams.extensions.length > 0){
						var extensions = view.assetEditorParams.extensions;
						if (!view.utils.fileFilter(extensions,fileName)){
							continue;
						}
					}
					
					// insert the asset
					view.insertAsset(asset);
				}
			}

			// get total file size for assets
			view.getAssetStorage();
		};
		
		//get the list of all assets and which steps those assets are used in
		var analyzeType = 'findUnusedAssets';
		
		//get the project id
		var projectId = this.portalProjectId;
		// set header text with project id
		$('#assetsHeader').html(this.getI18NStringWithParams('authoring_dialog_assets_header',[this.portalProjectId]));
		
		//get the url for making the request to retrieve the asset information
		var analyzeProjectUrl = this.getConfig().getConfigParam('analyzeProjectUrl');
		
		//the params for the request
		var requestParams = {
			analyzeType:analyzeType,
			projectId:projectId,
			html:false
		};
		
		//make the request to retrieve the asset information
		this.connectionManager.request('POST', 1, analyzeProjectUrl, requestParams, function(txt,xml,obj){populateOptions(txt,obj);}, [this, analyzeType]);
	} else {
		//this.notificationManager.notify("Please open or create a project that you wish to view assets for.", 3);
	}
};

/**
 * Given an asset filename and text to display in the filename column, gets the file's
 * size, date last modified, and mimetype and inserts a new row in the assets table.
 * 
 * @param details Object containing file details (file name, content type, size, last modified time, active and inactive steps in which file is used)
 */
View.prototype.insertAsset = function(details){
	var filename = details.assetFileName,
		mimetype = details.contentType,
		filesize = details.fileSize,
		lastModified = details.lastModified,
		activeSteps = details.activeStepsUsedIn,
		inactiveSteps = details.inactiveStepsUsedIn;
	
	var status = '', usageTxt = '';
	
	if(activeSteps.length > 0) {
		//the asset is used in an active step
		status = 'active';
		usageTxt = activeSteps.length;
		if(inactiveSteps.length > 0) {
			usageTxt += ' (' + inactiveSteps.length + ')';
		}
	} else if(inactiveSteps.length > 0) {
		//the asset is only used in inactive steps
		status = 'inactive';
		usageTxt = ' (' + inactiveSteps.length + ')';
	} else {
		//the asset is not used in any step
		status = 'notUsed';
		usageTxt = '--';
	}
	
	var view = this;
	var now = new Date().getTime();
	
	// get the file size and last edited time of each asset
	var size = view.utils.appropriateSizeText(filesize);
	var date = new Date(lastModified);
	var modified = moment(date).format('MMM D, YYYY h:mm A');
	
	function insertRow(mimeType){
		// insert new row with asset info
		var oTable = $('#assetSelect').dataTable();
		var a = oTable.fnAddData( [
		    '<input type="checkbox" class="cbx" />',
			filename,
			size,
			modified,
			'<a>' + usageTxt + '</a>'
		]);
		
		// add row attributes and bind row click action
		var nTr = oTable.fnSettings().aoData[ a[0] ].nTr;
		$(nTr).addClass(status).data({'filename':filename, 'mimetype':mimeType}).attr('data-mimetype',mimeType).off('click').on('click',function(e){
			if(e.shiftKey || e.metaKey || $(e.target).hasClass('cbx')){
				// if shift or meta key is pressed, add to current selection
				view.selectAsset(nTr,filename,mimeType);
			} else {
				// deselect all files, then select clicked file
				view.selectAssetsNone( function(){
					view.selectAsset(nTr,filename,mimeType);
				});
			}
		});
		
		// set up usage tooltip for current file
		var usageTipHead = '<p><b>' + view.getI18NString('authoring_dialog_assets_isused') + '</b></p>',
			usageTipContent = '';
		
		if(status == 'notUsed'){
			usageTipHead = '<p><b>' + view.getI18NString('authoring_dialog_assets_notused') + '</b></p>';
		} else {
			usageTipContent = '<div class="featureSettings" style="max-height:150px; overflow-y:auto;">';
			// loop through all active steps where file is used
			if(activeSteps.length>0){
				usageTipContent += '<ul>';
				for(var i=0;i<activeSteps.length;i++){
					var stepStr = activeSteps[i], nodeName = '';
					
					// replace nodeType with readable name (authoringToolName)
					var nodeType = stepStr.match(/\((.*)\)$/)[1];
					nodeName = view.utils.getAuthoringNodeName(nodeType);
					var liContent = stepStr.replace(/\(.*\)$/,'(' + nodeName + ')');
					liContent = liContent.replace(/^(.*:)/,'<b>$1</b>');
					
					// TODO: adjust step numbering depending on whether project is numbered by step or project
					
					// create list item for step
					var li = '<li>' + liContent + '</li>';
					usageTipContent += li;
				}
				usageTipContent += '</ul>';
			}
			
			if(inactiveSteps.length>0){
				usageTipContent += '<ul>';
				// loop through all inactive steps where file is used
				for(var a=0;a<inactiveSteps.length;a++){
					var stepStr = inactiveSteps[a], nodeName = '';
					
					// replace nodeType with readable name (authoringToolName)
					var nodeType = stepStr.match(/\((.*)\)$/)[1];
					nodeName = view.utils.getAuthoringNodeName(nodeType);
					var liContent = stepStr.replace(/\(.*\)$/,'(' + nodeName + ')');
					
					if(status == 'active'){
						liContent = '<b>' + view.getI18NString('authoring_dialog_assets_inactive') + '</b> ' + liContent;
					}
					
					// create list item for step
					var li = '<li>' + liContent + '</li>';
					usageTipContent += li;
				}
				usageTipContent += '</ul>';
			}
			usageTipContent += '</div>';
		}
		
		if(status == 'inactive'){
			usageTipHead = '<p><b>' + view.getI18NString('authoring_dialog_assets_inactiveused') + '</b></p>';
		}
		
		var usageTip = usageTipHead + usageTipContent;
		
		$(nTr).find('td:eq(4)').addClass('usage');
		var usageA = $(nTr).find('td:eq(4) > a');
		usageA.addClass('tooltip').data({'tooltip-content':usageTip, 'tooltip-class':'info', 'tooltip-anchor':'right', 'tooltip-keep':'true'});
		
		var numAssets = view.assets.length;
		if(numAssets == oTable.fnSettings().fnRecordsTotal()){ // this is the last file
			// adjust dataTable column sizes
			oTable.fnAdjustColumnSizing();
			// initialize usage tooltips
			view.insertTooltips($('#assetSelect'));
			// hide tooltips on assets scroll
			$('#assetSelect').parent().on('scroll.assets',function(){
				$('#tiptip_holder').fadeOut('fast');
			});
			// hide loading image
			$('#assetsOverlay').hide();
		}
	}
	
	// if generic content type was returned for asset, make head request to try to get a more accurate content type
	// TODO: fix this on server side
	if(mimetype == 'application/octet-stream'){
		var xhr = $.ajax({
			type: "HEAD",
			url: view.getProjectFolderPath() + 'assets/' + filename + '?v=' + now,
			success: function(msg){
				var mimeType = xhr.getResponseHeader('Content-Type');
				insertRow(mimeType);
			}
		});
	} else {
		insertRow(mimetype);
	}
};

/**
 * Shows a preview of the selected asset file as well as action links
 * @param filename
 * @param mimetype
 */
View.prototype.previewAsset = function(filename,mimetype){
	var view = this, showFullLink = true;
	if(!mimetype){
		mimetype = '';
	}
	var path = view.getProjectFolderPath() + 'assets/' + filename;
	var height = 150, width = 200;
	var audioTypes = ['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/webm', 'audio/wav'];
	var videoTypes = ['video/mp4', 'video/ogg', 'video/webm', 'video/x-flv', 'video/x-f4v'];
	
	var wrapper = $('<div class="mediaWrapper"></div>');
	
	function insertDimensions(dimensions){
		$('#previewDimensions').html(view.getI18NStringWithParams('authoring_dialog_assets_file_dimensions',[dimensions.width,dimensions.height]));
	}
	
	if(mimetype.match(/^image/)){
		// asset is an image file
		var img = $(document.createElement('img')).load(function(){
			// once image has loaded, get file dimensions and insert in the DOM
			view.utils.getImageDimensions(path,function(dimensions){
				insertDimensions(dimensions);
			});
		}).attr('src',path);
		// show image in preview container
		$('#previewContent').append(img);
	} else if(audioTypes.indexOf(mimetype) > -1){
		// asset is an (html5) audio file, so insert audio element
		var audio = $('<audio src="' + path + '" width="' + width + '" height="' + height + '"></audio>');
		wrapper.addClass('audio').append(audio);
		$('#previewContent').append(wrapper);
		// initialize mediaelement (falls back to flash for browsers that don't support html5 video)
		$(audio).mediaelementplayer();
		// remove full size link
		showFullLink = false;
	} else if(videoTypes.indexOf(mimetype) > -1){
		// asset is an html5 or flash video file, so insert video element
		var video = $('<video src="' + path + '" width="' + width + '" height="' + height + '"></video>');
		wrapper.addClass('video').append(video);
		$('#previewContent').append(wrapper);
		// initialize mediaelement (falls back to flash for browsers that don't support html5 video)
		$(video).mediaelementplayer({
			success: function(media) {
		       media.addEventListener('loadedmetadata', function() {
		    	   // once metadata has loaded, get file dimensions and insert into DOM
		    	   var dimensions = {};
		    	   dimensions.height = media.videoHeight, dimensions.width = media.videoWidth;
		    	   insertDimensions(dimensions);
		       }, true);
		       
		       if(media.pluginType == 'flash'){
		    	   media.addEventListener('playing', function() {
		    		   media.pause();
			    	   media.setCurrentTime(0);
			    	   media.removeEventListener('playing');
		    	   });
		    	   media.play();
		       }
		    }
		});
	} else if(mimetype == 'video/quicktime' || mimetype.match('video/x-ms')){
		// asset is a non-html5 video file that might be embeddeable, so embed using <object> with <embed> fallback
		var video = $('<object width="' + width + '" height="' + height + '" data="' + path + '">' + 
			'<param name="scale" value="aspect" />' +
			'<param name="autoplay" value="false" />' +
			'<param name="type" value="' + mimetype + '" />' +
			'<embed src="' + path + '" height="' + height +'" width="' + width + '" type="' + mimetype + '" scale="aspect" />' +
			'</object>');
		wrapper.addClass('video').append(video);
		$('#previewContent').append(wrapper);
	} else if(mimetype == 'application/x-shockwave-flash') {
		// asset if a Flash swf, so embed using swfobject.js
		wrapper.addClass('flash').append('<div id="swfHolder"></div>');
		$('#previewContent').append(wrapper);
		var flashvars = {};
		var params = {};
		params.scale = "showall";
		params.wmode = "transparent";
		var attributes = {};
		swfobject.embedSWF(path, "swfHolder", width, height, "9.0.0", "expressInstall.swf", flashvars, params, attributes,
			function(e){
				if(e.success && e.ref){
					// get swf dimensions
					//view.utils.getSwfDimensions(path, function(dimensions){
						//insertDimensions(dimensions);  // TODO: re-enable in the future
					//});
				}
		});
	} else {
		// asset is a file type that cannot be previewed
		if(mimetype == 'application/pdf'){
			// file is a pdf, so show pdf preview image and keep full size link (for browsers that can preview pdfs)
			wrapper.addClass('pdf');
		} else {
			// show generic placeholder preview image
			wrapper.addClass('generic');
			// hide full size link
			showFullLink = false;
		}
		$('#previewContent').append(wrapper);
	}
	
	// initialize click actions on file action links
	if(showFullLink){
		$('#assetView').off('click').on('click',function(){ window.open(path, '_blank'); }).show();
	} else {
		$('#assetView').off('click').hide();
	}
	var files = [];
	files.push(filename);
	$('#assetDownload').removeClass('solo').off('click').on('click',function(){ view.downloadAsset(files); });
	$('#assetDelete').show().off('click').on('click',function(){ view.removeAsset(files); });
	// show action links and dimensions display
	$('#previewActions, #previewDimensions').show();
};

/**
 * Checks to ensure that a project path exists, caulculates storage usage
 */
View.prototype.getAssetStorage = function(){
	if(this.getProject()){
		var callback = function(text, xml, o){
			var assetsSizeUsed = parseInt(text.split("/")[0]);  // how much space is taken up by existing assets
			var assetsSizeTotalMax = parseInt(text.split("/")[1]);  // how much total space is available for this project
			if(assetsSizeUsed >= assetsSizeTotalMax){
				o.assetStorageExceeded = true;
				//o.notificationManager.notify('Maximum storage allocation exceeded! Maximum allowed is ' + o.utils.appropriateSizeText(assetsSizeTotalMax) + ', total on server is ' + o.utils.appropriateSizeText(assetsSizeUsed) + '.', 3);
			} else {
				o.assetStorageExceeded = false;
			}
			
			var percentUsed = assetsSizeUsed/assetsSizeTotalMax*100;
			(percentUsed > 80) ? $('#assetUsage').addClass('full') : $('#assetUsage').removeClass('full');
			$('#sizeDiv').html(o.getI18NStringWithParams("authoring_dialog_assets_storage_label", [o.utils.appropriateSizeText(assetsSizeUsed), o.utils.appropriateSizeText(assetsSizeTotalMax)]));
			$('#sizeBar').progressbar({ value: percentUsed });
		};
		this.connectionManager.request('POST', 1, this.assetRequestUrl, {forward:'filemanager', projectId:this.portalProjectId, command: 'getProjectUsageAndMax', path: this.utils.getContentPath(this.authoringBaseUrl,this.getProject().getContentBase())}, callback, this);
	}
};

/**
 * Valiates filename and extension, checks for duplicates
 */
View.prototype.submitUpload = function() {
	var filename = $('#uploadAssetFile').val();
	var view = this;
	if(filename && filename != ''){
		filename = filename.replace("C:\\fakepath\\", "");  // chrome/IE8 fakepath issue: http://acidmartin.wordpress.com/2009/06/09/the-mystery-of-cfakepath-unveiled/	
		if(!view.utils.fileFilter(view.allowedAssetExtensions,filename)){
			view.notificationManager.notify(view.getI18NString('authoring_dialog_assets_filetype_error'), 3, 'error', 'assetNotifications');
			return;
		} else {
			//check for duplicate filename
			var isDupe = false;
			for(var i=0;i<view.assets.length;i++){
				if(filename == view.assets[i].assetFileName){
					isDupe = true;
					break;
				}
			}
			
			var files = [];
			files.push(filename);
			if(isDupe){
				// file is a duplicate of existing asset, so confirm overwrite before uploading
				var doPost = confirm(view.getI18NStringWithParams('authoring_dialog_assets_confirm_overwrite',[filename]));
				if (doPost) { view.assetUploadDownload('upload',files); };
			} else {
				// file is new, so proceed with upload
				view.assetUploadDownload('upload',files);
			}
		}
	}
};

/**
 * Callback function for when the dynamically created frame for downloading assets has recieved
 * a response from the request. Notifies the response and removes the frame.
 * 
 * @param target
 * @param view
 * @param files
 */
View.prototype.assetDownloaded = function(target,view,files){
	var htmlFrame = target;
	var frame = window.frames[target.id];
	
	if(frame.document && frame.document.body && frame.document.body.innerHTML != ''){
		var message = "", msgClass = 'success';
		
		if(frame.document.body.innerHTML != null && frame.document.body.innerHTML.indexOf("server has encountered an error") != -1) {
			//the server returned a generic error page
			message = "Error downloading file(s).  Please check your connection and try again."; // TODO: add permissions warning if permissions check is re-enable on server side 
			//message = view.getI18NString('authoring_dialog_assets_download_perm_error'), 3, 'error', 'assetNotifications');
			msgClass = 'error';
			
			//display the message in the upload manager
			notificationManager.notify(message, 3, msgClass, 'assetNotifications');
		} else {
			//there was no error
		}
		
		/* change cursor back to default */
		document.body.style.cursor = 'default';
	} else {
	}
	
	/* set source to blank in case of page reload */
	htmlFrame.src = 'about:blank';
	frame.removeEventListener('load',function(){view.assetUploaded(this,view,filename);},false);
	document.body.removeChild(htmlFrame);
};

View.prototype.pluploadAssets = function(){
	var view = this;
	var assetPath = view.utils.getContentPath(view.authoringBaseUrl,view.getProject().getContentBase());
	
	// set POST parameters
	view.assetUploader.settings.multipart_params = {
		path: assetPath,
		forward: 'assetmanager',
		projectId: view.portalProjectId
	};
	
	// disable upload button
	$('#uploadFile').prop('disabled',true).addClass('disabled');
	
	// start uploads
	view.assetUploader.start();
};

/**
 * 
 * @param files
 */
View.prototype.downloadAsset = function(files){
	var view = this;
	
	// create hidden frame and upload form
	var frameId = 'assetFrame_' + Math.floor(Math.random() * 1000001);
	var frame = createElement(document, 'iframe', {id:frameId, name:frameId, src:'about:blank', style:'display:none;'});
	var form = createElement(document, 'form', {id:'assetFrm', method:'POST', enctype:'multipart/form-data', action:view.assetRequestUrl, target:frameId, style:'display:none;'});
	var assetPath = view.utils.getContentPath(view.authoringBaseUrl,view.getProject().getContentBase());
	
	/* create and append elements */
	document.body.appendChild(frame);
	document.body.appendChild(form);
	form.appendChild(createElement(document,'input',{type:'hidden', name:'path', value:assetPath}));
	form.appendChild(createElement(document,'input',{type:'hidden', name:'forward', value:'assetmanager'}));
	form.appendChild(createElement(document,'input',{type:'hidden', name:'projectId', value:view.portalProjectId}));
	form.appendChild(createElement(document,'input',{type:'hidden', name:'command', value:'download'}));
	
	/* set up the event and callback when the response comes back to the frame */
	frame.addEventListener('load',function(){view.assetDownloaded(this,view,files);},false);
	
	form.appendChild(createElement(document,'input',{type:'hidden', name:'asset', value:JSON.stringify(files)}));
	
	/* submit hidden form */
	form.submit();
	
	// remove form now that the form has been submitted
	document.body.removeChild(form);
};

/**
 * 
 * @param filename
 */
View.prototype.removeAsset = function(filename){
	var view = this;
	
	var success = function(text, xml, o){
		if(text.status==401){
			o.notificationManager.notify(o.getI18NString('authoring_dialog_assets_delete_perm_error'), 3, 'error', 'assetNotifications');
		} else {
			// show success message
			o.notificationManager.notify(o.getI18NStringWithParams('authoring_dialog_assets_delete_success',[$('#assetSelect tr.selected').data('filename')]), 3, 'success', 'assetNotifications');
			
			// remove row for deleted file
			$('#assetSelect').dataTable().fnDeleteRow($('#assetSelect tr.selected')[0],null,true);
			
			// remove asset from view's assets object
			for(var i=0; i<o.assets.length; i++){
				if(filename == o.assets[i].assetFileName){
					o.assets.splice(i,1);
					break;
				}
			}
			
			// clear asset table selection(s)
			view.selectAssetsNone();
			
			// get total file size for assets
			o.getAssetStorage();
			
			// hide upload progress area and show drop area
			$('#uploadsWrapper').removeClass('show').hide().html('');
			$('#uploadDrop').addClass('show').height('').show();
		}
	};
	
	var remove = confirm(view.getI18NStringWithParams('authoring_dialog_assets_delete_confirm',[filename]));
	if(remove){
		view.connectionManager.request('POST', 1, view.assetRequestUrl, {forward:'assetmanager', projectId:view.portalProjectId, command: 'remove', path: view.utils.getContentPath(view.authoringBaseUrl,view.getProject().getContentBase()), asset: filename}, success, view, success);
	}
};

/**
 * 
 * @param nTr
 * @param filename
 * @param mimetype
 */
View.prototype.selectAsset = function(nTr,filename,mimetype){
	var view = this,
		row = $(nTr);
		oTable = $('#assetSelect').dataTable();
	
	// check if row was previously selected or not
	if(row.hasClass('selected')){
		// row was selected, so deselect
		row.removeClass('selected');
		$('input.cbx',row).prop('checked',false);
	} else {
		// row was not selected, so select
		row.addClass('selected');
		$('input.cbx',row).prop('checked',true);
	}
	
	view.clearAssetPreview();
	var selected = oTable.$('tr.selected');
	if(selected.length == 1){
		// only one item is selected, so preview it
		view.previewAsset($(selected[0]).data('filename'),$(selected[0]).data('mimetype'));
	}
	
	// if all assets are selected, set select all checkbox to checked; vice versa
	selected.length == view.assets.length ?	$('#assetSelectAll').prop('checked',true) : $('#assetSelectAll').prop('checked',false);
};

/**
 * 
 * @param onComplete
 */
View.prototype.selectAssetsNone = function(onComplete){
	//$('#assetSelect').data('selected',[]);
	//$('#assetSelect tr').removeClass('selected');
	var oTable = $('#assetSelect').dataTable();
	oTable.$('input.cbx').prop('checked',false);
	oTable.$('tr.selected').removeClass('selected');
	this.clearAssetPreview();
	if(onComplete){
		onComplete();
	}
};


/**
 * 
 */
View.prototype.selectAssetsAll = function(){
	var oTable = $('#assetSelect').dataTable();
	oTable.$('input.cbx').prop('checked',true);
	oTable.$('tr').addClass('selected');
	this.clearAssetPreview();
};


/**
 * 
 */
View.prototype.clearAssetPreview = function(){
	var view = this;
	
	$('#previewContent').empty();
	$('#previewDimensions').html('&nbsp');
	$('#previewActions, #previewDimensions').hide();
	$('#assetView, #assetDownload, #assetDelete').off('click');
	
	// check for multiple selections
	var oTable = $('#assetSelect').dataTable();
	var selected = oTable.$('tr.selected');
	if(selected.length > 1){
		var wrapper = $('<div class="mediaWrapper files"></div>');
		$('#previewContent').append(wrapper);
		$('#previewDimensions').html(view.getI18NStringWithParams('authoring_dialog_assets_multi_select',[selected.length]));
		$('#assetView').hide();
		
		var files = [];
		for(var i=0;i<selected.length;i++){
			files.push($(selected[i]).data('filename'));
		}
		
		$('#assetDelete').hide(); // TODO: perhaps enable multiple file deleting in the future
		
		// bind download link click action
		$('#assetDownload').addClass('solo').on('click',function(){
			view.downloadAsset(files);
		});
		
		$('#previewActions, #previewDimensions').show();
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_assets.js');
};