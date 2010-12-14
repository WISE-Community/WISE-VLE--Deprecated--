var coreScripts = [
	'vle/node/flash/FlashNode.js'
];

var studentVLEScripts = [

];

var authorScripts = [

];

var gradingScripts = [
	
];

var dependencies = [
	{child:"vle/node/flash/FlashNode.js", parent:["vle/node/Node.js"]}
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('flash', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/flash/setup.js');
};