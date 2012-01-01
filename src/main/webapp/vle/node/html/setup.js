var coreScripts = [
	'vle/node/html/HtmlNode.js',
	'vle/node/html/htmlEvents.js'
];

var coreMinScripts = [
   	'vle/node/html/html_core_min.js'
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

var nodeClasses = [
	{nodeClass:'intro', nodeClassText:'Introductory Page'},
	{nodeClass:'curriculum', nodeClassText:'Curriculum Page'},
	{nodeClass:'display', nodeClassText:'Display Page'},
	{nodeClass:'cartoon', nodeClassText:'Cartoon Page'},
	{nodeClass:'codeit', nodeClassText:'Coding Page'},
	{nodeClass:'simulation', nodeClassText:'Simulation Page'},
	{nodeClass:'movie', nodeClassText:'Movie Page'},
	{nodeClass:'homework', nodeClassText:'Homework Page'},
	{nodeClass:'summary', nodeClassText:'Summary Page'}
];

var nodeIconPath = 'node/html/icons/';
componentloader.addNodeIconPath('HtmlNode', nodeIconPath);

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('core_min', coreMinScripts);
scriptloader.addScriptToComponent('html', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addScriptToComponent('studentwork_min', gradingScripts);
scriptloader.addDependencies(dependencies);

componentloader.addNodeClasses('HtmlNode', nodeClasses);

var nodeTemplateParams = [
   {
	   nodeTemplateFilePath:'node/html/htmlTemplate.ht',
	   nodeExtension:'ht',
	   mainNodeFile:true
   },
   {
	   nodeTemplateFilePath:'node/html/htmlTemplate.html',
	   nodeExtension:'html',
	   mainNodeFile:false
   }
];

componentloader.addNodeTemplateParams('HtmlNode', nodeTemplateParams);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/html/setup.js');
};