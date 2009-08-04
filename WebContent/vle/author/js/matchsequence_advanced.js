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
		var xmlString;
		var customCheck;
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
		};
		
		if(customCheck==undefined || customCheck==''){
			customCheck=null;
		};
		
		window.frames["previewFrame"].loadContent(xmlString, customCheck);
		
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

		if(customCheck==undefined || customCheck==''){
			customCheck=null;
		};
		
		window.frames["previewFrame"].loadContent(xmlString, customCheck);
};

function loaded(){
	//set frame source to blank and create page dynamically
	window.allReady = function(){
		var renderAfterGet = function(text, xml){
			var frm = window.frames["previewFrame"];
			
			frm.document.open();
			frm.document.write(window.parent.opener.injectVleUrl(text));
			frm.document.close();
			
			frm.loadAuthoring = function(){
				window.parent.childSave = save;
				window.parent.getSaved = getSaved;
				loadAuthoringFromFile(window.parent.filename, window.parent.projectName, window.parent.projectPath, window.parent.pathSeparator);
			};
		};
		
		window.parent.opener.connectionManager.request('GET', 1, 'node/matchsequence/matchsequence.html', null,  renderAfterGet);
	};
	
	window.frames['previewFrame'].location = '../blank.html';
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/matchsequence_advanced.js");