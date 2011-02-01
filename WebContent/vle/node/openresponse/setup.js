var nodeType = 'OpenResponseNode';

var coreScripts = [
	'vle/node/openresponse/OpenResponseNode.js',
	'vle/node/openresponse/NoteNode.js',
	'vle/node/openresponse/openResponseEvents.js',
	/* 
     * the following are needed here for the note nodes that now load
     * in a div of the main page of the vle, not in its own frame 
     */
	'vle/node/openresponse/openresponsestate.js',
    'vle/node/openresponse/openresponse.js'
];

var studentVLEScripts = [
	'vle/node/common/nodehelpers.js',
	'vle/common/helperfunctions.js',
	'vle/jquery/js/jquery-1.4.4.min.js',
	'vle/jquery/js/jquery-ui-1.8.7.custom.min.js',
	'vle/jquery/js/jsonplugin.js',
	'vle/node/openresponse/openresponsestate.js',
	'vle/node/openresponse/openresponse.js',
	'vle/grading/Annotation.js',
	'vle/grading/Annotations.js',
	'vle/data/nodevisit.js'
];

var authorScripts = [
	'vle/node/openresponse/authorview_openresponse.js'
];

var gradingScripts = [
	'vle/node/openresponse/openresponsestate.js'
];

var dependencies = [
	{child:"vle/node/openresponse/OpenResponseNode.js", parent:["vle/node/Node.js"]},
	{child:"vle/node/openresponse/NoteNode.js", parent:["vle/node/Node.js", "vle/node/openresponse/OpenResponseNode.js"]}
];

var css = [
	"vle/node/common/css/htmlAssessment.css",
	"vle/node/openresponse/openresponse.css",
	"vle/jquery/css/custom-theme/jquery-ui-1.8.7.custom.css"
];

var openResponseNodeClasses = [
	{nodeClass:'openresponse', nodeClassText:'Open Response'}
];

var noteNodeClasses = [
	{nodeClass:'note', nodeClassText:'Reflection Note (popup)'}
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('openresponse', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('openresponse', css);

scriptloader.addScriptToComponent('peerreviewhelper', 'vle/node/openresponse/openresponse.js');
scriptloader.addCssToComponent('core', 'vle/node/openresponse/openresponse.css');

componentloader.addNodeClasses('OpenResponseNode', openResponseNodeClasses);
componentloader.addNodeTemplate('OpenResponseNode', 'node/openresponse/openResponseTemplate.or');
componentloader.addNodeExtension('OpenResponseNode', 'or');

componentloader.addNodeClasses('NoteNode', noteNodeClasses);
componentloader.addNodeTemplate('NoteNode', 'node/openresponse/noteTemplate.or');
componentloader.addNodeExtension('NoteNode', 'or');

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/openresponse/setup.js');
};