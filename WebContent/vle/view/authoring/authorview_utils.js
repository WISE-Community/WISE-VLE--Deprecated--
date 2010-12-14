/**
 * Util functions for the authoring view
 * 
 * @author patrick lawler
 */
/**
 * Returns the content base from the given full url to a file.
 */
View.prototype.utils.getContentBaseFromFullUrl = function(url){
	if(url.indexOf('\\')!=-1){
		return url.substring(0, url.lastIndexOf('\\'));
	} else {
		return url.substring(0, url.lastIndexOf('/'));
	};
};

/**
 * Returns the path separator used by the given url.
 */
View.prototype.utils.getSeparator = function(url){
	if(url.indexOf('\\')!=-1){
		return '\\';
	} else {
		return '/';
	};
};

/**
 * Given a nodeId, removes associated node content file from server.
 */
View.prototype.utils.removeNodeFileFromServer = function(view, nodeId){
	var filename = view.getProject().getNodeFilename(nodeId);
	
	var callback = function(text, xml, o){
		if(text!='success'){
			o.notificationManager.notify('failed request to remove file: ' + filename + '  from the server', 3);
		};
	};

	if(filename){
		view.connectionManager.request('POST', 1, view.requestUrl, {forward:'filemanager', projectId:view.portalProjectId, command: 'removeFile', param1: this.getContentPath(view.authoringBaseUrl,view.project.getContentBase()), param2: filename}, callback, view);
	};
};

/**
 * Returns the corresponding todo filename for the currently opened project.
 */
View.prototype.utils.getTODOFilename = function(projectFilename){
	if(projectFilename.indexOf('.project.json')!=-1){
		/* this is a raw project file */
		return projectFilename.replace('.project.json','.todo.text');
	} else {
		/* this is a versioned project file */
		return projectFilename.replace(/\.project\.(.*)\.json/,'.todo.$1.text');
	};
};

/**
 * Returns the corresponding project meta filename for the currently opened project.
 */
View.prototype.utils.getProjectMetaFilename = function(projectFilename){
	if(projectFilename.indexOf('.project.json')!=-1){
		/* this is raw project file */
		return projectFilename.replace('.project.json','.project-meta.json');
	} else {
		/* this is a versioned project file */
		return projectFilename.replace(/\.project\.(.*)\.json/, '.project-meta.$1.json');
	};
};

/**
 * Returns true if the given name is an allowed file type
 * to upload as asset, false otherwise.
 */
View.prototype.utils.fileFilter = function(extensions,name){
	return extensions.indexOf(this.getExtension(name).toLowerCase()) != -1;
};

/**
 * Given a filename, returns the extension of that filename
 * if it exists, null otherwise.
 */
View.prototype.utils.getExtension = function(text){
	var ndx = text.lastIndexOf('.');
	if(ndx){
		return text.substring(ndx + 1, text.length);
	};

	return null;
};

/**
 * Given a string of a number of bytes, returns a string of the size
 * in either: bytes, kilobytes or megabytes depending on the size.
 */
View.prototype.utils.appropriateSizeText = function(bytes){
	if(bytes>1048576){
		return this.roundToDecimal(((bytes/1024)/1024), 1) + ' mb';
	} else if(bytes>1024){
		return this.roundToDecimal((bytes/1024), 1) + ' kb';
	} else {
		return bytes + ' b';
	};
};

/**
 * Returns the given number @param num to the nearest
 * given decimal place @param decimal. (e.g if called 
 * roundToDecimal(4.556, 1) it will return 4.6.
 */
View.prototype.utils.roundToDecimal = function(num, decimal){
	var rounder = 1;
	if(decimal){
		rounder = Math.pow(10, decimal);
	};

	return Math.round(num*rounder)/rounder;
};

/**
 * Hides all nodes in the project
 */
View.prototype.utils.hideNodes = function(){
	//$('.projectNode.node').parent().parent().addClass('hidden');
	$('#hideNodesBtn').addClass('hidden');
	$('#showNodesBtn').removeClass('hidden');
	$('#showNodesBtn').removeAttr('disabled');
	$('.projectNode.node').parent().parent().fadeOut();
};

/**
 * Shows all nodes in the project
 */
View.prototype.utils.unhideNodes = function(){
	//$('.projectNode.node').parent().parent().removeClass('hidden');
	$('#showNodesBtn').addClass('hidden');
	$('#hideNodesBtn').removeClass('hidden');
	$('#hideNodesBtn').removeAttr('disabled');
	$('.projectNode.node').parent().parent().fadeIn();
};

/**
 * On browser resize, sets the authoringContainer to fit the remaining height of the browser window
 */
View.prototype.utils.resize = function(){
	var height = $(window).height()-($('#authorHeader').height()+$('#currentProjectContainer').height()+$('#projectTools').height()+46);
	$('#authoringContainer').height(height);
};

/*
 * Returns the current view mode (student, grading, authoring, etc.)
 */
View.prototype.getMode = function() {
	debugger;
	var mode = this.config.getConfigParam('mode');
	return mode;
};


// add indexOf functionality to js in ie6 and ie7
if (!Array.prototype.indexOf)  
{  
  Array.prototype.indexOf = function(elt /*, from*/)  
  {  
    var len = this.length >>> 0;  
  
    var from = Number(arguments[1]) || 0;  
    from = (from < 0)  
         ? Math.ceil(from)  
         : Math.floor(from);  
    if (from < 0)  
      from += len;  
  
    for (; from < len; from++)  
    {  
      if (from in this &&  
          this[from] === elt)  
        return from;  
    }  
    return -1;  
  };  
}  

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_utils.js');
};