var node; //an HtmlNode
var thisFilename = null;
var saved = true;


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
	
	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=updateFile&param1=' + parent.projectPath + '&param2=' + parent.filename + '&param3=' + encodeURIComponent(htmlString));
};

/**
 * Load the html authoring view from the specified filename
 * filename points to a plain old html file.
 */
function loadAuthoringFromFile(filename, projectName, projectPath, pathSeparator) {
	var callback =
	{
	  success: function(o) { 
		  var xmlDocObj = new LoadXMLDocObj();
		  xmlDocObj.xmlDoc = o.responseXML;   // o.responseXML is the OTML
		  //alert(o.responseXML);
		  htmlContent = o.responseText;
		  var xmlDocToParse = o.responseXML;
		  	  
		  node = new HtmlNode();
		  node.setContent(htmlContent);
		  node.contentBase = window.parent.project.contentBaseUrl;
		  document.getElementById('sourceTextArea').value = htmlContent;
		  node.render(window.frames["previewFrame"]);
	  },
	  failure: function(o) { alert('failure');},
	  scope: this
	}

	YAHOO.util.Connect.asyncRequest('POST', '../filemanager.html', callback, 'command=retrieveFile&param1=' + projectPath + pathSeparator + filename);
}

/*
 * Called to send the authored text back to the previewFrame so the
 * previewFrame can update itself and reflect the changes the author
 * has made.
 */
function sourceUpdated() {
	saved = false;
	//retrieve the authored text
	var htmlString = document.getElementById('sourceTextArea').value;

	//set the authored html into the HtmlNode
	node.setContent(htmlString);

	//tell the node to render itself in the previewFrame iframe
	node.render(window.frames["previewFrame"]);
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/js/html_easy.js");