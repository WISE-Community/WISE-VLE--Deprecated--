var saved = true;

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

		window.frames["previewFrame"].loadFromXMLString(xmlDocToParse);
		},
		failure: function(o) { alert('failure');},
		scope: this
	}

	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=retrieveFile&param1=' + projectPath + pathSeparator + filename);
}

/*
 * Called when 'keyup' event is received on sourceTextArea on this page.
 * gets the text in the textarea and re-renders the previewFrame
 */
function sourceUpdated() {
	saved = false;
	//retrieve the authored text
	var xmlString = document.getElementById('sourceTextArea').value;
	
	var xmlDoc = loadXMLDocFromString(xmlString);
	window.frames["previewFrame"].loadFromXMLString(xmlDoc);
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/fillin_advanced.js");