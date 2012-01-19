var coreScripts = [
	'vle/node/fillin/FillinNode.js',
	'vle/node/fillin/fillinEvents.js'
];

var coreMinScripts = [
  	'vle/node/fillin/fillin_core_min.js',
];

var studentVLEScripts = [
    'vle/jquery/js/jquery-1.6.1.min.js',
	'vle/jquery/js/jquery-ui-1.8.17.custom.min.js',
	'vle/jquery/js/jsonplugin.js',
	'vle/node/common/nodehelpers.js',
	'vle/node/fillin/textentryinteraction.js',
	'vle/node/fillin/fillinstate.js',
	'vle/node/fillin/fillin.js'
];

var authorScripts = [
	'vle/node/fillin/authorview_fillin.js'
];

var gradingScripts = [
	'vle/node/fillin/fillinstate.js'
];

var dependencies = [
	{child:"vle/node/fillin/FillinNode.js", parent:["vle/node/Node.js"]}
];

var css = [
	"vle/node/common/css/htmlAssessment.css",
	"vle/node/fillin/fillin.css",
	"vle/jquery/css/tels-theme/jquery-ui-1.8.14.custom.css"
];

var nodeClasses = [
	{nodeClass:'fillblank', nodeClassText:'Fill the Blank'}
];

var nodeIconPath = 'node/fillin/icons/';
componentloader.addNodeIconPath('FillinNode', nodeIconPath);

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('core_min', coreMinScripts);
scriptloader.addScriptToComponent('fillin', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addScriptToComponent('studentwork_min', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('fillin', css);

componentloader.addNodeClasses('FillinNode', nodeClasses);

var nodeTemplateParams = [
	{
		nodeTemplateFilePath:'node/fillin/fillinTemplate.fi',
		nodeExtension:'fi'
	}
];

componentloader.addNodeTemplateParams('FillinNode', nodeTemplateParams);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/fillin/setup.js');
};