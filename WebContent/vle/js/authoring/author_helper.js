function getSaved(){
	return saved;
};

function loaded(){
	if(window.parent){
		loadAuthoringFromFile(window.parent.filename, window.parent.projectName, window.parent.projectPath);
		window.parent.childSave = save;
		window.parent.getSaved = getSaved;
	};
};

/**
 * returns a <br> element
 */
function createBreak(){
	return createElement(document, 'br', null);
};

/**
 * returns a space
 */
function createSpace(){
	return document.createTextNode(' ');
};