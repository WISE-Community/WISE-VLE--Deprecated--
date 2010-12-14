var coreScripts = [
	'vle/node/draw/SVGDrawNode.js',
	'vle/node/draw/svgDrawEvents.js'
];

var studentVLEScripts = [
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

var dependencies = [
	{child:"vle/node/draw/SVGDrawNode.js", parent:["vle/node/Node.js"]},
	{child:'vle/node/draw/svg-edit/svgdraw.js', parent:['vle/jquery/js/jquery-1.4.2.min.js']}
];

var css = [
	'vle/node/draw/svg-edit/jquery-ui/jquery-ui-1.7.2.custom.css',
	'vle/node/draw/svg-edit/jgraduate/css/jPicker-1.0.12.css',
	'vle/node/draw/svg-edit/jgraduate/css/jgraduate.css',
	'vle/node/draw/svg-edit/svg-editor.css',
	'vle/node/draw/svg-edit/spinbtn/JQuerySpinBtn.css'
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('svgdraw', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('svgdraw', css);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/draw/setup.js');
};