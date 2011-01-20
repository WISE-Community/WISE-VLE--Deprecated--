/*
 * This array specifies what step types will be available in the vle.
 * If you want a step type to be available in the vle, you must add
 * the path to the step's setup.js file to this array. 
 */
var setupFiles = [
	 "vle/node/assessmentlist/setup.js",
	 "vle/node/brainstorm/setup.js",
	 "vle/node/datagraph/setup.js",
	 "vle/node/draw/setup.js",
	 "vle/node/fillin/setup.js",
	 "vle/node/flash/setup.js",
	 "vle/node/html/setup.js",
	 "vle/node/matchsequence/setup.js",
	 "vle/node/multiplechoice/setup.js",
	 "vle/node/mw/setup.js",
	 "vle/node/mysystem/setup.js",
	 "vle/node/openresponse/setup.js",
	 "vle/node/outsideurl/setup.js",
	 "vle/node/sensor/setup.js",
	 "vle/node/template/setup.js",
	 "vle/node/explanationbuilder/setup.js"
];

/*
 * add the paths the the setup files into the scriptloader so that
 * they will all be loaded into the vle
 */
scriptloader.addScriptToComponent('setup', setupFiles);

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/setupNodes.js');
};