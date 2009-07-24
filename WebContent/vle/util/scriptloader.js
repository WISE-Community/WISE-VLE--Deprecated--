/*****														******
 * 			Helper functions for the scriptloader				 *
 *****														*****/
function createAttribute(doc, node, type, val){
	var attribute = doc.createAttribute(type);
	attribute.nodeValue = val;
	node.setAttributeNode(attribute);
};

function createElement(doc, type, attrArgs){
	if(window.ActiveXObject){
		return createIEElement(doc, type, attrArgs);
	};
	var newElement = doc.createElement(type);
	if(attrArgs!=null){
		for(var option in attrArgs){
			createAttribute(doc, newElement, option, attrArgs[option]);
		};
	};
	return newElement;
};

function createIEElement(doc, type, attrArgs){
	var elString = '<' + type;
	
	for(var option in attrArgs){
		elString += ' ' + option + '=\'' + attrArgs[option] + '\'';
	};
	
	elString += '/>';
	
	return doc.createElement(elString);
};

if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            };
        };
        return -1;
    };
};
/**
 * Scriptloader is an object that dynamically loads scripts. The
 * javascripts and css .main variables have been pre-populated to load
 * the scripts for vle.html and the authoring tool. 
 *
 * The urls specified in the arrays for
 * javascripts and css should be relative to the root location of the 
 * server or servlet that scriptloader is to be called from. The full 
 * url is determined by scriptloader.
 *
 * NOTE: Every javascript that is loaded through scriptloader
 * must call scriptloader.scriptAvailable(url) at the very end of
 * its file (see any of the prepopulated scripts below for an example).
 */ 
var scriptloader = {
	javascripts: {
		main: ["vle/sound/AudioManager.js", 
                   "vle/yui/yui_2.7.0b/build/yahoo/yahoo-min.js", 
                   "vle/yui/yui_2.7.0b/build/event/event-min.js", 
                   "vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js",
                   "vle/yui/yui_2.7.0b/build/animation/animation-min.js", 
                   "vle/yui/yui_2.7.0b/build/dragdrop/dragdrop-min.js", 
                   "vle/yui/yui_2.7.0b/build/utilities/utilities.js",
                   "vle/yui/yui_2.7.0b/build/container/container.js",
                   "vle/yui/yui_2.7.0b/build/resize/resize.js",
                   "vle/yui/yui_2.7.0b/build/connection/connection-min.js",
                   "vle/util/shortcutmanager.js",
                   "vle/author/authoring.js",
                   "vle/VLE.js", 
                   "vle/data/vlestate.js", 
                   "vle/data/nodevisit.js",
                   "vle/config/vleconfig.js",
                   "vle/user/user.js",
                   "vle/ui/vleui.js",
                   "vle/util/vleutils.js",
                   "vle/ui/contentpanel/ContentPanel.js", 
                   "vle/navigation/NavigationLogic.js", 
                   "vle/navigation/DFS.js", 
                   "vle/ui/navigationpanel/NavigationPanel.js", 
                   "vle/common/loadxmldoc.js",
                   "vle/visibility/VisibilityLogic.js",
                   "vle/visibility/CorrectnessBranchingVisibility.js",
                   "vle/visibility/OnlyShowLeafNode.js",
                   "vle/visibility/OnlyShowSelectedNodes.js",
                   "vle/visibility/BranchingVisibility.js",
                   "vle/node/Node.js", 
                   "vle/node/OpenResponseNode.js",
                   "vle/node/openresponse/openresponsestate.js",
                   "vle/node/HtmlNode.js", 
                   "vle/node/CustomNode.js",
                   "vle/node/MatchSequenceNode.js",
                   "vle/node/FillinNode.js",
                   "vle/node/FlashNode.js",
                   "vle/node/NoteNode.js",
                   "vle/node/JournalNode.js",
                   "vle/node/JournalEntryNode.js",
                   "vle/node/OutsideUrlNode.js", 
                   "vle/node/BlueJNode.js", 
                   "vle/node/MultipleChoiceNode.js",
                   "vle/node/BrainstormNode.js",
                   "vle/node/GlueNode.js", 
                   "vle/project/Project.js", 
                   "vle/io/ConnectionManager.js",
                   "vle/events/events.js",
                   "vle/notification/NotificationManager.js",
                   "vle/run/RunManager.js", 
                   "vle/grading/Flag.js", 
                   "vle/grading/Flags.js", 
                   "vle/common/niftycube.js",
                   "vle/common/sdmenu.js", 
                   "vle/common/dropdown.js",
                   "vle/author/author_helper.js",
                   "vle/util/projectutils.js",
                   "vle/grading/Annotation.js",
                   "vle/grading/Annotations.js",
                   "vle/grading/Flag.js",
                   "vle/grading/Flags.js",
      				"vle/node/common/js/helperfunctions.js",
      				"vle/node/common/js/md5.js",
       				"vle/node/brainstorm/brainstorm.js",
       				"vle/node/brainstorm/brainstormstate.js",
    				"vle/node/fillin/textentryinteraction.js",
    				"vle/node/fillin/fillinstate.js",
    				"vle/node/fillin/fillin.js",
    				"vle/node/glue/glue.js",
    				"vle/node/glue/gluestate.js",
    				"vle/node/matchsequence/matchsequenceyui.js",
    				"vle/node/matchsequence/matchsequencefeedback.js",
    				"vle/node/matchsequence/matchsequencebucket.js",
    				"vle/node/matchsequence/matchsequencechoice.js",
    				"vle/node/matchsequence/matchsequencestate.js",
    				"vle/node/matchsequence/matchsequence.js",
    				"vle/node/multiplechoice/multiplechoicestate.js",
    				"vle/node/multiplechoice/mc.js",
    				"vle/node/openresponse/openresponsestate.js",
    				"vle/node/openresponse/openresponse.js",
    				"vle/node/openresponse/customjournalentrystate.js",
    				"vle/journal/Journal.js"],
        	brainlite: ["vle/node/common/js/loadxmldoc.js",
        				"vle/yui/yui_3.0.0b1/build/yui/yui-min.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/node/brainstorm/brainlitehtml.js",
        				"vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js",
                        "vle/yui/yui_2.7.0b/build/element/element-min.js",
                        "vle/yui/yui_2.7.0b/build/container/container_core-min.js",
                        "vle/yui/yui_2.7.0b/build/menu/menu-min.js",
                        "vle/yui/yui_2.7.0b/build/button/button-min.js",
                        "vle/yui/yui_2.7.0b/build/editor/editor-min.js"],
           brainfull: ["vle/node/common/js/loadxmldoc.js",
                    	"vle/yui/yui_3.0.0b1/build/yui/yui-min.js",
                    	"vle/node/common/js/helperfunctions.js",
                    	"vle/node/brainstorm/brainfullhtml.js",
                    	"vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js",
                        "vle/yui/yui_2.7.0b/build/element/element-min.js",
                        "vle/yui/yui_2.7.0b/build/container/container_core-min.js",
                        "vle/yui/yui_2.7.0b/build/menu/menu-min.js",
                        "vle/yui/yui_2.7.0b/build/button/button-min.js",
                        "vle/yui/yui_2.7.0b/build/editor/editor-min.js"],
        	brainstorm: ["vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js",
        	            "vle/yui/yui_2.7.0b/build/yahoo/yahoo-min.js",
        				"vle/yui/yui_2.7.0b/build/event/event-min.js",
        				"vle/yui/yui_2.7.0b/build/connection/connection-min.js",
        				"vle/node/common/js/loadxmldoc.js",
        				"vle/yui/yui_3.0.0b1/build/yui/yui-min.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/node/brainstorm/brainstorm.js",
        				"vle/node/brainstorm/brainstormstate.js",
        				"vle/node/brainstorm/brainstormhtml.js",
                        "vle/yui/yui_2.7.0b/build/element/element-min.js",
                        "vle/yui/yui_2.7.0b/build/container/container_core-min.js",
                        "vle/yui/yui_2.7.0b/build/menu/menu-min.js",
                        "vle/yui/yui_2.7.0b/build/button/button-min.js",
                        "vle/yui/yui_2.7.0b/build/editor/editor-min.js"],
        	fillin: ["vle/node/common/js/loadxmldoc.js",
        				"vle/yui/yui_3.0.0b1/build/yui/yui-min.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/node/fillin/textentryinteraction.js",
        				"vle/node/fillin/fillinstate.js",
        				"vle/node/fillin/fillin.js",
        				"vle/node/common/js/niftycube.js",
        				"vle/node/fillin/fillinhtml.js"],
        	info_box: ["vle/node/common/js/niftycube.js"],
        	glue: ["vle/node/common/js/loadxmldoc.js",
        				"vle/yui/yui_3.0.0b1/build/yui/yui-min.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/node/glue/glue.js",
        				"vle/node/glue/gluestate.js",
        				"vle/node/common/js/niftycube.js"],
        	matchsequence: ["vle/node/common/js/loadxmldoc.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/yui/yui_3.0.0b1/build/yui/yui-min.js",
        				"vle/node/common/js/niftycube.js",
        				"vle/node/matchsequence/matchsequenceyui.js",
        				"vle/node/matchsequence/matchsequencefeedback.js",
        				"vle/node/matchsequence/matchsequencebucket.js",
        				"vle/node/matchsequence/matchsequencechoice.js",
        				"vle/node/matchsequence/matchsequencestate.js",
        				"vle/node/matchsequence/matchsequence.js"],
        	multiplechoice: ["vle/node/common/js/loadxmldoc.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/yui/yui_3.0.0b1/build/yui/yui-min.js",
        				"vle/node/common/js/niftycube.js",
        				"vle/node/multiplechoice/multiplechoicestate.js",
        				"vle/node/multiplechoice/mc.js",
        				"vle/node/multiplechoice/multiplechoicehtml.js"],
        	openresponse: ["vle/node/common/js/loadxmldoc.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/yui/yui_3.0.0b1/build/yui/yui-min.js",
        				"vle/node/common/js/niftycube.js",
        				"vle/node/openresponse/openresponsestate.js",
        				"vle/node/openresponse/openresponse.js",
        				"vle/node/openresponse/customjournalentrystate.js"],
        	author_framed: ["vle/common/helperfunctions.js"],
        	author: ["vle/yui/yui_2.7.0b/build/yahoo/yahoo-min.js",
        				"vle/yui/yui_2.7.0b/build/event/event-min.js",
        				"vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js",
        				"vle/yui/yui_2.7.0b/build/animation/animation-min.js",
        				"vle/yui/yui_2.7.0b/build/dragdrop/dragdrop-min.js",
        				"vle/yui/yui_2.7.0b/build/container/container-min.js",
        				"vle/yui/yui_2.7.0b/build/connection/connection-min.js",
        				"vle/pagebuilder/pagebuilder.js",
        				"vle/common/loadxmldoc.js",
        				"vle/common/helperfunctions.js",
        				"vle/node/common/js/md5.js",
        				"vle/author/author_helper.js",
        				"vle/node/common/js/loadxmldoc.js"],
        	author_matchsequence_easy: ["vle/author/author_easy_helper.js",
        				"vle/author/js/matchsequence_easy.js"],
        	author_matchsequence_advanced: ["vle/author/author_advanced_helper.js",
        				"vle/author/js/matchsequence_advanced.js"],
        	author_brainstorm_easy: ["vle/author/author_easy_helper.js",
        				"vle/author/js/brainstorm_easy.js"],
        	author_brainstorm_advanced: ["vle/author/author_advanced_helper.js",
        				"vle/author/js/brainstorm_advanced.js"],
        	author_fillin_easy: ["vle/author/author_easy_helper.js",
        				"vle/node/common/js/niftycube.js",
        				"vle/author/js/fillin_easy.js"],
        	author_fillin_advanced: ["vle/author/author_advanced_helper.js",
        				"vle/node/common/js/niftycube.js",
        				"vle/author/js/fillin_advanced.js"],
        	author_html_easy: ["vle/node/Node.js",
        				"vle/node/HtmlNode.js",
        				"vle/author/author_easy_helper.js",
        				"vle/author/js/html_easy.js"],
        	author_html_advanced: ["vle/node/Node.js",
        				"vle/node/HtmlNode.js",
        				"vle/author/author_advanced_helper.js",
        				"vle/author/js/html_advanced.js"],
        	author_glue_easy: ["vle/yui/yui_3.0.0b1/build/yui/yui-min.js",
        				"vle/author/author_glue.js",
        				"vle/author/author_easy_helper.js",
        				"vle/author/js/glue_easy.js"],
        	author_glue_advanced: ["vle/author/author_glue.js",
        				"vle/author/author_advanced_helper.js",
        				"vle/author/js/glue_advanced.js"],
        	author_multiplechoice_easy: ["vle/yui/yui_3.0.0b1/build/yui/yui-min.js",
        				"vle/author/author_easy_helper.js",
        				"vle/author/js/multiplechoice_easy.js"],
        	author_multiplechoice_advanced: ["vle/author/author_advanced_helper.js",
        				"vle/author/js/multiplechoice_advanced.js"],
        	author_openresponse_easy: ["vle/author/author_easy_helper.js",
        				"vle/author/js/openresponse_easy.js"],
        	author_openresponse_advanced: ["vle/author/author_advanced_helper.js",
        				"vle/author/js/openresponse_advanced.js"],
        	author_outsideurl_easy: ["vle/author/author_easy_helper.js",
        				"vle/author/js/outsideurl_easy.js"],
        	author_outsideurl_advanced: ["vle/author/author_advanced_helper.js",
        				"vle/author/js/outsideurl_advanced.js"],
        	feedback: ["vle/common/helperfunctions.js"],
        	journal: ["vle/journal/Journal.js",
        	          "vle/journal/JournalPage.js",
        	          "vle/journal/JournalPageRevision.js"]
    },
    css: {
    	main: ["vle/yui/yui_2.7.0b/build/container/assets/skins/sam/container.css", 
    	       "vle/yui/yui_2.7.0b/build/resize/assets/skins/sam/resize.css",
	           "vle/css/authoring/authoring.css",
	           "vle/css/niftycube.css", 
	           "vle/css/navigation.css",
	           "vle/css/sdmenu.css"],
	    wise: ["vle/css/wise/WISE_styles.css"],
	    uccp: ["vle/css/uccp/UCCP_styles.css"],
	    brainlite: ["vle/node/common/css/htmlAssessment.css",
				 "vle/node/brainstorm/brainstorm.css",
				 "vle/node/common/css/niftyCorners.css",
				 "vle/yui/yui_2.7.0b/build/assets/skins/sam/skin.css"],
		brainfull: ["vle/node/common/css/htmlAssessment.css",
				 "vle/node/brainstorm/brainstorm.css",
				 "vle/node/common/css/niftyCorners.css",
				 "vle/yui/yui_2.7.0b/build/assets/skins/sam/skin.css"],
	    fillin: ["vle/node/common/css/htmlAssessment.css",
	    		"vle/node/fillin/fillin.css",
	    		"vle/node/common/css/niftyCorners.css"],
	    info_box: ["vle/node/common/css/htmlAssessment.css",
	    		"vle/node/common/css/niftyCorners.css"],
	    matchsequence: ["vle/node/common/css/htmlAssessment.css",
	    		"vle/node/matchsequence/matchstyles.css",
	    		"vle/node/common/css/niftyCorners.css"],
	    multiplechoice: ["vle/node/common/css/htmlAssessment.css",
	    		"vle/node/multiplechoice/mcstyles.css",
	    		"vle/node/common/css/niftyCorners.css"],
	    openresponse: ["vle/node/common/css/htmlAssessment.css",
	    		"vle/node/openresponse/openresponse.css",
	    		"vle/node/common/css/niftyCorners.css"],
	    author_framed: ["vle/css/authoring/authoring.css"],
	    author: ["vle/yui/yui_2.7.0b/build/container/assets/skins/sam/container.css",
        				"vle/css/authoring/authoring.css"],
        author_multiplechoice_easy: ["vle/css/authoring/author_multiplechoice.css"],
       	feedback: ["vle/css/authoring/authoring.css"]
    },
    dependencies: {
    	"vle/node/Node.js": ["vle/yui/yui_2.7.0b/build/event/event-min.js"],
    	"vle/project/Project.js": ["vle/node/Node.js"],
    	"vle/node/OpenResponseNode.js": ["vle/node/Node.js"],
    	"vle/node/HtmlNode.js": ["vle/node/Node.js"], 
        "vle/node/CustomNode.js": ["vle/node/Node.js"],
        "vle/node/MatchSequenceNode.js": ["vle/node/Node.js"],
        "vle/node/FillinNode.js": ["vle/node/Node.js"],
        "vle/node/FlashNode.js": ["vle/node/Node.js"],
        "vle/node/NoteNode.js": ["vle/node/Node.js", "vle/node/OpenResponseNode.js"],
        "vle/node/JournalNode.js": ["vle/node/Node.js"],
        "vle/node/JournalEntryNode.js": ["vle/node/Node.js", "vle/node/OpenResponseNode.js"],
        "vle/node/OutsideUrlNode.js": ["vle/node/Node.js"], 
        "vle/node/BlueJNode.js": ["vle/node/Node.js"], 
        "vle/node/MultipleChoiceNode.js": ["vle/node/Node.js"],
        "vle/node/BrainstormNode.js": ["vle/node/Node.js"],
        "vle/node/GlueNode.js": ["vle/node/Node.js"],
        "vle/util/vleutils.js": ["vle/VLE.js"],
        "vle/ui/vleui.js": ["vle/VLE.js"],
        "vle/util/projectutils.js": ["vle/project/Project.js"],
        "vle/yui/yui_2.7.0b/build/container/container-min.js": ["vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js"],
        "vle/yui/yui_2.7.0b/build/event/event-min.js": ["vle/yui/yui_2.7.0b/build/yahoo/yahoo-min.js"],
        "vle/yui/yui_2.7.0b/build/animation/animation-min.js": ["vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js"],
        "vle/yui/yui_2.7.0b/build/dragdrop/dragdrop-min.js": ["vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js"],
        "vle/yui/yui_2.7.0b/build/connection/connection-min.js": ["vle/yui/yui_2.7.0b/build/event/event-min.js", "vle/yui/yui_2.7.0b/build/yahoo/yahoo-min.js"],
        "vle/yui/yui_2.7.0b/build/editor/editor-min.js": ["vle/yui/yui_2.7.0b/build/button/button-min.js", "vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js", "vle/yui/yui_2.7.0b/build/element/element-min.js"],
        "vle/yui/yui_2.7.0b/build/element/element-min.js": ["vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js"],
        "vle/yui/yui_2.7.0b/build/yahoo/yahoo-min.js": ["vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js"],
        "vle/yui/yui_2.7.0b/build/button/button-min.js": ["vle/yui/yui_2.7.0b/build/menu/menu-min.js", "vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js"],
        "vle/yui/yui_2.7.0b/build/container/container_core-min.js": ["vle/yui/yui_2.7.0b/build/element/element-min.js"],
        "vle/yui/yui_2.7.0b/build/menu/menu-min.js": ["vle/yui/yui_2.7.0b/build/container/container_core-min.js"],
        "vle/yui/yui_2.7.0b/build/resize/resize.js": ["vle/yui/yui_2.7.0b/build/element/element-min.js", "vle/yui/yui_2.7.0b/build/dragdrop/dragdrop-min.js", "vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js"],
        "vle/yui/yui_2.7.0b/build/container/container.js": ["vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js"]
    },
    //scripts holds all of the script objects that are created
    //dynamically from the javascripts and css' specified
	scripts: {},
	//keeps track of how many scripts have completed loading
	count: 0,
	//name of current scripts and css to load
	name: '',
	//params to be run with custom function after scripts load
	params: null,
	//initializes scriptloader with provided document, function and params
	//to run once script loading complete. Generates the script
	//objects based on the javascripts and css' specfied by given name
	initialize: function(doc, fun, name, params){
		this.doc = doc;
		this.afterLoad = fun;
		this.params = params;
		var loc = this.doc.location.toString();
		this.baseUrl = loc.substring(0, loc.lastIndexOf('/vle/') + 1);
		this.count = 0;
		this.name = name;
		this.generateScripts(this.javascripts[name], this.css[name]);
		this.loadScripts(this.javascripts[name]);
		this.loadCsss(this.css[name]);
	},
	//should be called when a javascript or css that is specified
	//in the javascript or css array has completed loading. Keeps
	//track of total finished scripts and runs provided function
	//when all are done loading.
	listener: function(){
		this.count ++;
		if(this.count==this.javascripts[this.name].length){
			if(this.afterLoad){
				this.afterLoad(this.params);
			};
		};
	},
	//called from individual script or css files when they have
	//completed loading.
	//@param script is url path to script
	scriptAvailable: function(script){
		this.scripts[script].setLoaded(true);
		if(this.scripts[script].hasDependents()){
			var dep = this.scripts[script].getDependent();
			for(var w=0;w<dep.length;w++){
				this._loadIfDependenciesLoaded(dep[w]);
			};
		};
		if(this.listener){
			this.listener();
		};
	},
	//checks all the dependencies of the provided script and if all are loaded,
	//loads this script, if not, adds this script as dependent to any of the
	//dependency scripts if not already added
	_loadIfDependenciesLoaded: function(script){
		var s = this.scripts[this.baseUrl + script];
		var deps = s.getDependencies();
		
		var allLoaded = true;
		for(var q=0;q<deps.length;q++){
			var j = this.scripts[this.baseUrl + deps[q]];
			if(j && j.getLoaded()==false){
				allLoaded = false;
				if(j.getDependent().indexOf(script)==-1){ //add script as a dependent script if not already there
					j.addDependent(script);
				};
			};
		};
		
		if(allLoaded){
			this.doc.getElementsByTagName('head')[0].appendChild(createElement(this.doc, 'script', {type: 'text/javascript', src: s.url}));
		};
	},
	//loads the javascript specified by the given javascript url (@param script)
	//into this.doc
	loadScript: function(script){
		var s = this.scripts[this.baseUrl + script];
		if(s && s.getLoaded()==false){
			if(s.hasDependencies()){
				this._loadIfDependenciesLoaded(script);
			} else {
				this.doc.getElementsByTagName('head')[0].appendChild(createElement(this.doc, 'script', {type: 'text/javascript', src: s.url}));
			};
		} else if(s && s.getLoaded()==true){
			this.listener();
		};
	},
	//loads all of the javascripts specified in the given
	//scripts array into this.doc
	loadScripts: function(scripts){
		if(scripts){
			for(var w=0;w<scripts.length;w++){
				this.loadScript(scripts[w]);
			};
		};
	},
	//loads the css specfied by the given css url
	//into this.doc
	loadCss: function(css){
		var s = this.scripts[this.baseUrl + css];
		if(s && s.getLoaded()==false){
			this.doc.getElementsByTagName('head')[0].appendChild(createElement(this.doc, 'link', {rel: 'stylesheet', type: 'text/css', href: s.url}));
		};
	},
	//loads all of the css' specified in the given
	//csss array into this.doc
	loadCsss: function(csss){
		if(csss){
			for(var e=0;e<csss.length;e++){
				this.loadCss(csss[e]);
			};
		};
	},
	//Generates the script objects specified in the scripts
	//and css variables
	generateScripts: function(scripts, css){
		if(scripts){
			for(var p=0;p<scripts.length;p++){
				this.createScript(scripts[p], this.dependencies[scripts[p]]);
			};
		};
		
		if(css){
			for(var q=0;q<css.length;q++){
				this.createScript(css[q]);
			};
		};
	},
	//Creates the script object specified by the given urlStr
	//if it does not already exist
	createScript: function(urlStr, deps){
		if(!this.scripts[this.baseUrl + urlStr]){
			this.scripts[this.baseUrl + urlStr] = {
				url: this.baseUrl + urlStr, //location of this script
				_loaded: false,	//boolean true iff this script has been loaded into given html
				_dependent: [], //any scripts that need this script to be completely loaded before loading
				_dependencies: deps, //any scripts that need to load before this script loads
				getLoaded: function(){return this._loaded;},
				setLoaded: function(bool){this._loaded=bool;},
				getDependent: function(){return this._dependent;},
				addDependent: function(s){this._dependent.push(s)},
				getDependencies: function(){return this._dependencies;},
				setDependencies: function(arr){this._dependencies = arr;},
				hasDependencies: function(){
					if(this._dependencies){
						return this._dependencies.length > 0;
					} else {
						return false;
					};
				},
				hasDependents: function(){return this._dependent.length > 0;}
			};
		};
	}
};


if(typeof pageBuilder!='undefined'){
	pageBuilder.listener();
} else if(window.parent && (typeof window.parent.pageBuilder!='undefined')){
	window.parent.pageBuilder.listener();
};