var coreScripts = [
	'vle/node/mw/MWNode.js',
	'vle/node/mw/mwEvents.js'
];

var studentVLEScripts = [
	'vle/jquery/js/jquery-1.4.2.min.js',
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

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('mw', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('mw', css);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/mw/setup.js');
};