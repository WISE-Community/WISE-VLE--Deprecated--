var coreScripts = [
	'vle/node/datagraph/DataGraphNode.js',
	'vle/node/datagraph/dataGraphEvents.js'
];

var coreMinScripts = [
   	'vle/node/datagraph/datagraph_core_min.js'
];


var studentVLEScripts = [
	'vle/common/helperfunctions.js',
    'vle/jquery/js/jquery-1.6.1.min.js',
	'vle/jquery/js/jquery-ui-1.8.7.custom.min.js',
	'vle/jquery/js/jsonplugin.js',
	'vle/jquery/flot/jquery.flot.min.js',
	'vle/node/datagraph/datagraph.js',
	'vle/node/datagraph/datagraphstate.js'
];

var authorScripts = [
	'vle/node/datagraph/authorview_datagraph.js'
];

var gradingScripts = [
	'vle/node/datagraph/datagraphstate.js'
];

var dependencies = [
	{child:"vle/node/datagraph/DataGraphNode.js", parent:["vle/node/Node.js"]}
];

var css = [
	"vle/node/common/css/htmlAssessment.css",
	"vle/node/datagraph/datagraph.css"
];

var nodeClasses = [
	{nodeClass:'datatable', nodeClassText:'Data Graph'}
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('core_min', coreMinScripts);
scriptloader.addScriptToComponent('datagraph', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addScriptToComponent('studentwork_min', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('datagraph', css);

componentloader.addNodeClasses('DataGraphNode', nodeClasses);

var nodeTemplateParams = [
	{
		nodeTemplateFilePath:'node/datagraph/dataGraphTemplate.dg',
		nodeExtension:'dg'
	}
];

componentloader.addNodeTemplateParams('DataGraphNode', nodeTemplateParams);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/datagraph/setup.js');
};