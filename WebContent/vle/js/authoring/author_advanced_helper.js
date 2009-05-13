function save(){
	var htmlString = document.getElementById('sourceTextArea').value;
	
	var callback = {
		success: function(o){
			saved = true;
			if(o.responseText!='success'){
				alert('Failed save to server');
			};
		},
		failure: function(o){alert('Unable to save file to server');},
		scope:this
	};
	
	YAHOO.util.Connect.asyncRequest('POST', '../../filemanager.html', callback, 'command=updateFile&param1=' + parent.projectPath + '&param2=' + parent.filename + '&param3=' + encodeURIComponent(htmlString));
};

/**
 * Load the authoring view from the specified filename
 * filename points to a plain old file.
 */
function loadAuthoringFromFile(filename, projectName, projectPath) {
	var callback =
	{
	  success: function(o) { 
	  var xmlDocToParse = o.responseXML;
	
		/*
		 * display the xmlString to the user in the left area so they can
		 * edit and author it. 
		 */
		document.getElementById('sourceTextArea').value = o.responseText;
	
		//retrieve the xmlString from the mcObj
		var xmlString = "";
		if(window.ActiveXObject) {
			xmlString = xmlDocToParse.xml;
		} else {
			xmlString = (new XMLSerializer()).serializeToString(xmlDocToParse);
		}

		window.frames["previewFrame"].loadFromXMLString(xmlString);

		},
		failure: function(o) { alert('failure');},
		scope: this
	}

	YAHOO.util.Connect.asyncRequest('POST', '../../filemanager.html', callback, 'command=retrieveFile&param1=' + projectPath + '&param2=' + filename);
}

/*
 * Called when 'keyup' event is received on sourceTextArea on this page.
 * gets the text in the textarea and re-renders the previewFrame
 */
function sourceUpdated() {
	saved = false;
	//retrieve the authored text
	var xmlString = document.getElementById('sourceTextArea').value;

	window.frames["previewFrame"].loadFromXMLString(xmlString);
}