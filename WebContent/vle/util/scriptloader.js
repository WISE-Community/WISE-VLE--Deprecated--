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
		main: ["vle/sound/soundmanager/script/soundmanager2.js",
				   "vle/sound/AudioManager.js",
				   "vle/yui/yui_3.0.0pr2/build/yui/yui-min.js", 
                   "vle/yui/yui_2.7.0b/build/yahoo/yahoo-min.js", 
                   "vle/yui/yui_2.7.0b/build/event/event-min.js", 
                   "vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js", 
                   "vle/yui/yui_2.7.0b/build/animation/animation-min.js", 
                   "vle/yui/yui_2.7.0b/build/dragdrop/dragdrop-min.js", 
                   "vle/yui/yui_2.7.0b/build/container/container-min.js", 
                   "vle/yui/yui_2.7.0b/build/connection/connection-min.js", 
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
                   "vle/node/fillin/fillinstate.js",
                   "vle/node/FlashNode.js",
                   "vle/node/NoteNode.js",
                   "vle/node/JournalNode.js",
                   "vle/node/JournalEntryNode.js",
                   "vle/node/OutsideUrlNode.js", 
                   "vle/node/BlueJNode.js", 
                   "vle/node/MultipleChoiceNode.js",
                   "vle/node/multiplechoice/mc.js",
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
                   "vle/grading/Annotation.js",
                   "vle/grading/Annotations.js",
                   "vle/grading/Flag.js",
                   "vle/grading/Flags.js"],
        	brain: ["vle/node/common/js/loadxmldoc.js",
        				"vle/yui/yui_3.0.0pr2/build/yui/yui-min.js",
        				"vle/node/common/js/helperfunctions.js"],
        	brainstorm: ["vle/yui/yui_2.7.0b/build/yahoo/yahoo-min.js",
        				"vle/yui/yui_2.7.0b/build/event/event-min.js",
        				"vle/yui/yui_2.7.0b/build/connection/connection-min.js",
        				"vle/node/common/js/loadxmldoc.js",
        				"vle/yui/yui_3.0.0pr2/build/yui/yui-min.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/node/brainstorm/brainstorm.js",
        				"vle/node/brainstorm/brainstormstate.js"],
        	fillin: ["vle/node/common/js/loadxmldoc.js",
        				"vle/yui/yui_3.0.0pr2/build/yui/yui-min.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/node/fillin/textentryinteraction.js",
        				"vle/node/fillin/fillinstate.js",
        				"vle/node/fillin/fillin.js",
        				"vle/node/common/js/niftycube.js"],
        	info_box: ["vle/node/common/js/niftycube.js"],
        	glue: ["vle/node/common/js/loadxmldoc.js",
        				"vle/yui/yui_3.0.0pr2/build/yui/yui-min.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/node/glue/glue.js",
        				"vle/node/glue/gluestate.js",
        				"vle/node/common/js/niftycube.js"],
        	matchsequence: ["vle/node/common/js/loadxmldoc.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/yui/yui_3.0.0pr2/build/yui/yui-min.js",
        				"vle/node/common/js/niftycube.js",
        				"vle/node/matchsequence/matchsequenceyui.js",
        				"vle/node/matchsequence/matchsequencefeedback.js",
        				"vle/node/matchsequence/matchsequencebucket.js",
        				"vle/node/matchsequence/matchsequencechoice.js",
        				"vle/node/matchsequence/matchsequencestate.js",
        				"vle/node/matchsequence/matchsequence.js"],
        	multiplechoice: ["vle/node/common/js/loadxmldoc.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/yui/yui_3.0.0pr2/build/yui/yui-min.js",
        				"vle/node/common/js/niftycube.js",
        				"vle/node/multiplechoice/multiplechoicestate.js",
        				"vle/node/multiplechoice/mc.js"],
        	openresponse: ["vle/node/common/js/loadxmldoc.js",
        				"vle/node/common/js/helperfunctions.js",
        				"vle/yui/yui_3.0.0pr2/build/yui/yui-min.js",
        				"vle/node/common/js/niftycube.js",
        				"vle/node/openresponse/openresponsestate.js",
        				"vle/node/openresponse/openresponse.js",
        				"vle/node/openresponse/customjournalentrystate.js"],
        	author_framed: ["vle/common/helperfunctions.js"],
        	author_easy: ["vle/yui/yui_2.7.0b/build/yahoo/yahoo-min.js",
        				"vle/yui/yui_2.7.0b/build/event/event-min.js",
        				"vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js",
        				"vle/yui/yui_2.7.0b/build/animation/animation-min.js",
        				"vle/yui/yui_2.7.0b/build/dragdrop/dragdrop-min.js",
        				"vle/yui/yui_2.7.0b/build/container/container-min.js",
        				"vle/yui/yui_2.7.0b/build/connection/connection-min.js",
        				"vle/common/loadxmldoc.js",
        				"vle/common/helperfunctions.js",
        				"vle/node/Node.js",
        				"vle/node/BrainstormNode.js",
        				"author_helper.js",
        				"author_easy_helper.js",
        				"vle/node/common/js/loadxmldoc.js"]
    },
    css: {
    	main: ["vle/yui/yui_2.7.0b/build/container/assets/skins/sam/container.css", 
	           "vle/css/authoring/authoring.css",
	           "vle/css/niftyCube.css", 
	           "vle/css/navigation.css",
	           "vle/css/sdmenu.css"],
	    brain: ["vle/node/brainstorm/brainstorm.css"],
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
	    author_easy: ["vle/yui/yui_2.7.0b/build/container/assets/skins/sam/container.css",
        				"vle/css/authoring/authoring.css"]
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
	//initializes scriptloader with provided document and function
	//to run once script loading complete. Generates the script
	//objects based on the javascripts and css' specfied by @param: name
	initialize: function(doc, fun, name, params){
		this.doc = doc;
		this.afterLoad = fun;
		this.params = params;
		var loc = this.doc.location.toString();
		this.baseUrl = loc.split('//')[0] + '//' +  loc.split('//')[1].split('/')[0] + '/' + loc.split('//')[1].split('/')[1] + '/';
		this.scripts = {};
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
		this.scripts[script].loaded = true;
		if(this.listener){
			this.listener();
		};
	},
	//loads the javascript specfied by the given javascript url (@param script)
	//into this.doc
	loadScript: function(script){
		var s = this.scripts[script];
		if(s && s.loaded==false){
			this.doc.getElementsByTagName('head')[0].appendChild(createElement(this.doc, 'script', {type: 'text/javascript', src: s.url}));
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
		var s = this.scripts[css];
		if(s && s.loaded==false){
			this.doc.getElementsByTagName('head')[0].appendChild(createElement(this.doc, 'link', {rel: 'stylesheet', type: 'text/css', href: css}));
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
				scripts[p] = this.baseUrl + scripts[p];
				this.createScript(scripts[p]);
			};
		};
		
		if(css){
			for(var q=0;q<css.length;q++){
				css[q] = this.baseUrl + css[q];
				this.createScript(css[q]);
			};
		};
	},
	//Creates the script object specified by the given urlStr
	createScript: function(urlStr){
		this.scripts[urlStr] = {
			url: urlStr,
			loaded: false
		};
	}
};