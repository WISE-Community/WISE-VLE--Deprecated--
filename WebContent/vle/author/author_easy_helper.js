
function save(){
	var htmlString;
	
	if(window.ActiveXObject) {
		htmlString = xmlPage.xml;
	} else {
		htmlString = (new XMLSerializer()).serializeToString(xmlPage);
	};
	
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
	
	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=updateFile&param1=' + parent.projectPath + '&param2=' + parent.filename + '&param3=' + encodeURIComponent(htmlString));
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

		  /***						***|
		   * Extra work needed for IE *|
		   ***						***/
		  if(window.ActiveXObject){
		  	var ieXML = new ActiveXObject("Microsoft.XMLDOM");
		  	ieXML.async = "false";
		  	ieXML.loadXML(o.responseText);
		  	xmlDocToParse = ieXML;
		  };
		  /***						***|
		   * End extra work for IE	  *|
		   ***						***/
	  
		/**
		 * sets local xml and then generates the left panel
		 * of this page dynamically
		 */
		xmlPage = xmlDocToParse;
		generatePage();
	
		//retrieve the xmlString
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
	
	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=retrieveFile&param1=' + projectPath + pathSeparator + filename);
}

function updatePreview(){
	saved = false;
	var xmlString;
	if(window.ActiveXObject) {
		xmlString = xmlPage.xml;
	} else {
		xmlString = (new XMLSerializer()).serializeToString(xmlPage);
	};
	
	window.frames["previewFrame"].loadFromXMLString(xmlString);
};