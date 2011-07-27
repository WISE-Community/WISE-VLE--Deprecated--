var coreScripts = [
	'vle/node/mw/MWNode.js',
	'vle/node/mw/mwEvents.js'
];

var studentVLEScripts = [
	'vle/jquery/js/jquery-1.6.1.min.js',
	'vle/node/mw/mw.js'
];

var authorScripts = [

];

var gradingScripts = [
	'vle/node/mw/mwstate.js'
];

var dependencies = [
	{child:"vle/node/mw/MWNode.js", parent:["vle/node/Node.js"]}
];

var css = [
	"vle/node/mw/mw.css"
];

var nodeClasses = [
	{nodeClass:'simulation', nodeClassText:'Molecular Workbench'}
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('core_min', coreScripts);
scriptloader.addScriptToComponent('mw', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addScriptToComponent('studentwork_min', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('mw', css);

componentloader.addNodeClasses('MWNode', nodeClasses);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/mw/setup.js');
};