var coreScripts = [
	'vle/node/draw/SVGDrawNode.js',
	'vle/node/draw/svgDrawEvents.js'
];

var coreMinScripts = [
   	'vle/node/draw/svgdraw_core_min.js',
];

var studentVLEScripts = [
	/*'vle/node/draw/svg-edit/jquery-1.4.2.min.js',
	'vle/jquery/js/jsonplugin.js',
	'vle/node/draw/svg-edit/jquery-ui/jquery-ui-1.7.2.custom.min.js',
	'vle/node/draw/svg-edit/jgraduate/jpicker-1.0.12.min.js',
	'vle/node/draw/svg-edit/js-hotkeys/jquery.hotkeys.min.js',
	'vle/node/draw/svg-edit/jgraduate/jquery.jgraduate.js',
	'vle/node/draw/svg-edit/jquerybbq/jquery.bbq.min.js',
	'vle/node/draw/svg-edit/spinbtn/JQuerySpinBtn.js',
	'vle/node/draw/svg-edit/extensions/jquery-rscp/jquery.colorPicker.js',
	'vle/node/draw/svg-edit/lz77.js',
	'vle/node/draw/svg-edit/utils.js',
	'vle/node/draw/svg-edit/jquery.timers-1.2.js',
	'vle/node/draw/svg-edit/svgicons/jquery.svgicons.js',
	'vle/node/draw/svg-edit/svgcanvas.js',
	'vle/node/draw/svg-edit/svg-editor.js',
	'vle/node/draw/svg-edit/locale/locale.js',*/
	'vle/node/draw/svg-edit/svgdraw.js'
];

var authorScripts = [
	'vle/node/draw/authorview_svgdraw.js'
];

var gradingScripts = [
	'vle/node/draw/svg-edit/lz77.js',
	'vle/node/draw/svg-edit/utils.js',
	'vle/node/draw/svg-edit/svgdrawstate.js'
];

var gradingMinScripts = [
    'vle/node/draw/svgdraw_grading_min.js'
];

var dependencies = [
	{child:"vle/node/draw/SVGDrawNode.js", parent:["vle/node/Node.js"]},
	{child:'vle/node/draw/svg-edit/svgdraw.js', parent:[scriptloader.jquerySrc]}
];

var css = [
	scriptloader.jqueryUICss,
	'vle/node/draw/svg-edit/jgraduate/css/jPicker-1.0.12.css',
	'vle/node/draw/svg-edit/jgraduate/css/jgraduate.css',
	'vle/node/draw/svg-edit/svg-editor.css',
	'vle/node/draw/svg-edit/spinbtn/JQuerySpinBtn.css'
];

var nodeClasses = [
	{nodeClass:'quickdraw', nodeClassText:'Drawing'}
];

var nodeIconPath = 'node/draw/icons/';
componentloader.addNodeIconPath('SVGDrawNode', nodeIconPath);

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('core_min', coreMinScripts);
scriptloader.addScriptToComponent('svgdraw', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addScriptToComponent('studentwork_min', gradingMinScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('svgdraw', css);

componentloader.addNodeClasses('SVGDrawNode', nodeClasses);

var nodeTemplateParams = [
	{
		nodeTemplateFilePath:'node/draw/svgDrawTemplate.sd',
		nodeExtension:'sd'
	}
];

componentloader.addNodeTemplateParams('SVGDrawNode', nodeTemplateParams);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/draw/setup.js');
};