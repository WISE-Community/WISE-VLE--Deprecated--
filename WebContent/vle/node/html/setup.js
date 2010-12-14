var coreScripts = [
	'vle/node/html/HtmlNode.js',
	'vle/node/html/htmlEvents.js'
];

var studentVLEScripts = [

];

var authorScripts = [
	'vle/node/html/authorview_html.js'
];

var gradingScripts = [
	'vle/node/html/htmlstate.js'
];

var dependencies = [
	{child:"vle/node/html/HtmlNode.js", parent:["vle/node/Node.js"]}
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('html', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/html/setup.js');
};