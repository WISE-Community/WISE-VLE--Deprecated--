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

var nodeClasses = [
	{nodeClass:'simulation', nodeClassText:'Flash'}
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('core_min', coreScripts);
scriptloader.addScriptToComponent('flash', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);

componentloader.addNodeClasses('FlashNode', nodeClasses);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/flash/setup.js');
};