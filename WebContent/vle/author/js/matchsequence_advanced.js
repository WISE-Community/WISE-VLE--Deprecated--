var saved = true;

/**
 * Load the authoring view from the specified filename
 * filename points to a plain old file.
 */
function loadAuthoringFromFile(filename, projectName, projectPath, pathSeparator) {
	var callback =
	{
	  success: function(o) { 
		var xmlDoc=loadXMLDocFromString(o.responseText);
		
		/*
		 * display the xmlString to the user in the left area so they can
		 * edit and author it. 
		 */
		document.getElementById('sourceTextArea').value = o.responseText;
	
		//retrieve the xmlString from the mcObj
		var xmlString = "";
		var customCheck = "";
		if(window.ActiveXObject) {
			xmlString = xmlDoc.getElementsByTagName('assessmentItem')[0].xml;
			if(xmlDoc.getElementsByTagName('customCheck')[0]!=null){
				customCheck = xmlDoc.getElementsByTagName('customCheck')[0].firstChild.nodeValue;
			};
		} else {
			xmlString = (new XMLSerializer()).serializeToString(xmlDoc.getElementsByTagName('assessmentItem')[0]);
			if(xmlDoc.getElementsByTagName('customCheck')[0]!=null){
				customCheck = xmlDoc.getElementsByTagName('customCheck')[0].firstChild.nodeValue;
			};
		}

		if(customCheck != null && customCheck != ""){
			window.frames["previewFrame"].loadFromXMLString(xmlString, customCheck);
		} else {
			window.frames["previewFrame"].loadFromXMLString(xmlString);
		};

		  },
		  failure: function(o) { alert('failure');},
		  scope:this
	}

	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=retrieveFile&param1=' + projectPath + pathSeparator + filename);
}

/*
 * Called when 'keyup' event is received on sourceTextArea on this page.
 * gets the text in the textarea and re-renders the previewFrame
 */
function sourceUpdated() {
	saved = false;
	var xmlString = "";
	var customCheck = "";
	var xmlDoc=loadXMLDocFromString(document.getElementById('sourceTextArea').value);

		if(window.ActiveXObject) {
			xmlString = xmlDoc.getElementsByTagName('assessmentItem')[0].xml;
			if(xmlDoc.getElementsByTagName('customCheck')[0]!=null){
				customCheck = xmlDoc.getElementsByTagName('customCheck')[0].firstChild.nodeValue;
			};
		} else {
			xmlString = (new XMLSerializer()).serializeToString(xmlDoc.getElementsByTagName('assessmentItem')[0]);
			if(xmlDoc.getElementsByTagName('customCheck')[0]!=null){
				customCheck = xmlDoc.getElementsByTagName('customCheck')[0].firstChild.nodeValue;
			};
		}

		if(customCheck != null && customCheck != ""){
			window.frames["previewFrame"].loadFromXMLString(xmlString, customCheck);
		} else {
			window.frames["previewFrame"].loadFromXMLString(xmlString);
		};
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/matchsequence_advanced.js");