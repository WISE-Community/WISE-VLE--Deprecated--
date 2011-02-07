var coreScripts = [
    /*
     * xTODO: rename template
     * xTODO: rename TemplateNode.js
     * 
     * For example if you are creating a quiz node you would change it to
     * 'vle/node/quiz/QuizNode.js'
     */
	'vle/node/explanationbuilder/ExplanationBuilderNode.js',
	/*
     * xTODO: rename template
     * xTODO: rename templateEvents.js
     * 
     * For example if you are creating a quiz node you would change it to
     * 'vle/node/quiz/QuizEvents.js'
	 */
	'vle/node/explanationbuilder/explanationBuilderEvents.js'
];

var studentVLEScripts = [
	'vle/jquery/js/jquery-1.4.4.min.js',
	'vle/jquery/js/jquery-ui-1.8.7.custom.min.js',
	'vle/jquery/js/jquery-validate/jquery.validate.pack.js',
	'vle/jquery/js/jquery.form.js',
	'vle/jquery/js/jsonplugin.js',
	'vle/jquery/js/jquery.tools.tooltip.min.js',
	'vle/ideaBasket/basket.js',
 	/*
     * xTODO: rename template
     * xTODO: rename template.js
     * 
     * For example if you are creating a quiz node you would change it to
     * 'vle/node/quiz/quiz.js'
	 */
	'vle/node/explanationbuilder/explanationBuilder.js',
	/*
     * xTODO: rename template
     * xTODO: rename templatestate.js
     * 
     * For example if you are creating a quiz node you would change it to
     * 'vle/node/quiz/quizstate.js'
	 */
	'vle/node/explanationbuilder/explanationbuilderstate.js'
];

var authorScripts = [
	/*
	 * xTODO: rename template
	 * xTODO: rename authorview_template.js
	 * 
	 * For example if you are creating a quiz node you would change it to
	 * 'vle/node/quiz/authorview_quiz.js'
	 */
	'vle/node/explanationbuilder/authorview_explanationbuilder.js'
];

var gradingScripts = [
  	/*
	 * xTODO: rename template
	 * xTODO: rename templatestate.js
	 * 
	 * For example if you are creating a quiz node you would change it to
	 * 'vle/node/quiz/quizstate.js'
	 */
	'vle/node/explanationbuilder/explanationbuilderstate.js',
	'vle/node/explanationbuilder/explanationBuilder.js'
];

var dependencies = [
  	/*
	 * xTODO: rename template
	 * xTODO: rename TemplateNode.js
	 * 
	 * For example if you are creating a quiz node you would change it to
	 * 'vle/node/quiz/QuizNode.js'
	 */
	{child:"vle/node/explanationbuilder/ExplanationBuilderNode.js", parent:["vle/node/Node.js"]}
];

var css = [
       	"vle/css/ideaManager/blue/style.css",
       	"vle/css/ideaManager/basket.css",
       	"vle/node/explanationbuilder/explanation.css",
       	"vle/jquery/css/custom-theme/jquery-ui-1.8.7.custom.css",
       	"vle/css/ideaManager/jquery-validate/cmxformTemplate.css"
];

var nodeClasses = [
	{nodeClass:'codeit', nodeClassText:'Explanation Builder'}
];

scriptloader.addScriptToComponent('core', coreScripts);

/*
 * xTODO: rename template
 * 
 * For example if you are creating a quiz node you would change it to
 * 'quiz'
 */
scriptloader.addScriptToComponent('explanationbuilder', studentVLEScripts);

scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('explanationbuilder', css);

componentloader.addNodeClasses('ExplanationBuilderNode', nodeClasses);
componentloader.addNodeTemplate('ExplanationBuilderNode', 'node/explanationbuilder/explanationBuilderTemplate.eb');
componentloader.addNodeExtension('ExplanationBuilderNode', 'eb');

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * xTODO: rename template to your new folder name
	 * 
	 * For example if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/setup.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/explanationbuilder/setup.js');
};