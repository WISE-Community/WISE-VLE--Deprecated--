/*
 * the scripts that are always necessary regardless of whether the
 * user is using the vle, authoring tool, or grading tool
 */
var coreScripts = [
	'vle/node/epigame/EpigameNode.js',
	'vle/node/epigame/epigameEvents.js'
];

var coreMinScripts = ['vle/node/epigame/epigame_core_min.js'];

//the scripts used in the vle
var studentVLEScripts = [
	scriptloader.jquerySrc,
	scriptloader.jqueryUISrc,
	'vle/node/common/nodehelpers.js',
	'vle/node/epigame/epigame.js',
	'vle/node/epigame/epigameState.js'
];

//the scripts used in the authoring tool
var authorScripts = [
	'vle/node/epigame/authorview_epigame.js'
];

//the scripts used in the grading tool
var gradingScripts = [
	'vle/node/epigame/epigameState.js'
];

//dependencies when a file requires another file to be loaded before it
var dependencies = [
	{child:"vle/node/epigame/EpigameNode.js", parent:["vle/node/Node.js"]}
];

var nodeClasses = [
	{nodeClass:'mission', nodeClassText:'Generic Mission'},
	{nodeClass:'bronze', nodeClassText:'Easy Mission'},
	{nodeClass:'silver', nodeClassText:'Medium Mission'},
	{nodeClass:'gold', nodeClassText:'Hard Mission'}
];

var nodeIconPath = 'node/epigame/icons/';
componentloader.addNodeIconPath('EpigameNode', nodeIconPath);

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('core_min', coreMinScripts);
scriptloader.addScriptToComponent('epigame', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addScriptToComponent('studentwork_min', gradingScripts);
scriptloader.addDependencies(dependencies);

componentloader.addNodeClasses('EpigameNode', nodeClasses);

var css = [
	"vle/node/epigame/epigame.css"
];

scriptloader.addCssToComponent('epigame', css);

var nodeTemplateParams = [
	{
		nodeTemplateFilePath:'node/epigame/epigameTemplate.ep',
		nodeExtension:'ep'
	}
];

componentloader.addNodeTemplateParams('EpigameNode', nodeTemplateParams);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/epigame/setup.js');
};