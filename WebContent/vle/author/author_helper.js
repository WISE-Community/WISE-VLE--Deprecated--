var iconUrl = 'images/stepIcons/UCCP/';
var nodeTypes = ['HtmlNode', 'BrainstormNode', 'FillinNode', 'MatchSequenceNode', 'MultipleChoiceNode', 
		'NoteNode', 'JournalEntryNode', 'OutsideUrlNode', 'GlueNode', 'OpenResponseNode', 'BlueJNode'];
var nodeClasses = [['intro', 'curriculum', 'display', 'cartoon', 'codeit', 'simulation', 'movie', 'homework', 'summary'],
			['brainstorm', 'qadiscuss'],
			['fillblank'],
			['matchsequence'],
			['multiplechoice'],
			['note'],
			['journal'],
			['www'],
			['instantquiz', 'teacherquiz'],
			['openresponse'],
			['codeit']];
var nodeClassText = [['Introductory Page', 'Curriculum Page', 'Display Page', 'Cartoon Page', 'Coding Page', 'Simulation Page', 'Movie Page', 'Homework Page', 'Summary Page'],
			['Brainstorm session', 'Q&A Discussion'],
			['Fill the Blank'],
			['Match & Sequence'],
			['Multiple Choice'],
			['Reflection Note (popup)'],
			['Journal Question'],
			['WWW Page'],
			['Instant Quiz', 'Teacher Quiz'],
			['Open Response'],
			['Code it']];
			
function getSaved(){
	return saved;
};

function loaded(){
	if(window.parent){
		loadAuthoringFromFile(window.parent.filename, window.parent.projectName, window.parent.projectPath, window.parent.pathSeparator);
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


//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/author/author_helper.js");