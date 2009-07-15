var saved = true;

/*
 * Called when 'keyup' event is received on sourceTextArea on this page.
 * gets the text in the textarea and re-renders the previewFrame
 */
function sourceUpdated() {
	saved = false;
	//retrieve the authored text
	var xmlString = document.getElementById('sourceTextArea').value;

	window.frames["previewFrame"].loadContent([xmlString]);
};

/**
 * Load the authoring view from the specified filename
 * filename points to a plain old file.
 */
function loadAuthoringFromFile(filename, projectName, projectPath, pathSeparator) {
	var callback =
	{
	  success: function(o) { 
	  var xmlDocToParse = o.responseXML;
	  
		/*
		 * display the xmlString to the user in the left area so they can
		 * edit and author it. 
		 */
		document.getElementById('sourceTextArea').value = o.responseText;
		
		window.frames["previewFrame"].loadContent([o.responseText]);
	  },
		  failure: function(o) { alert('failure');},
		  scope: this
	}
	
	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=retrieveFile&param1=' + projectPath + pathSeparator + filename);
}

function loaded(){
	//set frame source to blank and create page dynamically
	var callback = function(){
		var frm = window.frames['previewFrame'];
		var loadMultiple = function(){
			loadAuthoringFromFile(window.parent.filename, window.parent.projectName, window.parent.projectPath, window.parent.pathSeparator);
			window.parent.childSave = save;
			window.parent.getSaved = getSaved;
		};
		
		frm.scriptloader.initialize(frm.document, loadMultiple, 'multiplechoice');
	};
	
	window.allready = function(){
		pageBuilder.build(window.frames['previewFrame'].document, 'multiplechoice', callback);
	};
	
	window.frames['previewFrame'].location = '../blank.html';
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/multiplechoice_advanced.js");