var coreScripts = [
	'vle/node/outsideurl/OutsideUrlNode.js',
	'vle/node/outsideurl/outsideUrlEvents.js'
];

var studentVLEScripts = [

];

var authorScripts = [
	'vle/node/outsideurl/authorview_outsideurl.js'
];

var gradingScripts = [
	
];

var dependencies = [
	{child:"vle/node/outsideurl/OutsideUrlNode.js", parent:["vle/node/Node.js"]}
];


scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('outsideurl', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/outsideurl/setup.js');
};