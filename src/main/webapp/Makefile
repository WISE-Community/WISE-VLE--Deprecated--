# Makefile for WISE4. Currently it is used to script compiling/compressing javascript files
# that are used in WISE4 using Google's closure compiler:
# http://code.google.com/closure
# 
# Starting in WISE4 v5.0 (released in Aug. 2011), minified files are used to
# speed up startup time for the teacher gradingtool. running these scripts create
# minified versions of the dependencies that are used in WISE and significantly 
# reduces the number and size of files that are requested to render the tool.
# 
# In WISE, if you see &minified=true in the gradingtool url, you are using the minified gradingtool, e.g.
# http://wise4.berkeley.edu/webapp/teacher/grading/gradework.html?runId=12345&gradingType=step&getRevisions=false&minified=true.
#
# If you do not want to use the minified version of the gradingtool
# (for example, when you want to retrieve all individual files for debugging purposes),
# either remove the &minified=true query string or set &minified=false.
# 
# NOTE: Our code safely compiles under SIMPLE_OPTIMIZATIONS                                                                                                                                                                                
# NOTE: Our code is *not* ready for ADVANCED_OPTIMIZATIONS                                                                                                                                                                                 
# NOTE: WHITESPACE_ONLY and --formatting PRETTY_PRINT is helpful for debugging.    
#
# Usage:
# 1) run 'make all' to compile and compress everything
# 2) run 'make vle' to compile everything but the nodes
# 3) run 'make nodes' to compile all the nodes (but no vle files)
# 4) run 'make NODE_XYZ' to compile all files used for XYZ node.  
#   (see NODES definitions below for a list of supported node types)
#   alternatively, you can "cd" to the node folder and run 'make'

### Definitions ###
CLOSURE=WEB-INF/lib/closure-compiler.jar
NODES=NODE_ASSESSMENTLIST NODE_BRAINSTORM NODE_CARGRAPH NODE_DATAGRAPH NODE_EXPLANATIONBUILDER NODE_FILLIN NODE_HTML NODE_IDEABASKET NODE_OPENRESPONSE NODE_OUTSIDEURL NODE_MATCHSEQUENCE NODE_MULTIPLECHOICE NODE_MYSYSTEM NODE_SENSOR NODE_SURGE NODE_SVGDRAW NODE_TABLE
NODE_DIR=vle/node/
VLE_DIR=vle/

NODE_ASSESSMENTLIST:
	cd $(addprefix $(NODE_DIR), assessmentlist); make assessmentlist_core_min

NODE_BRAINSTORM:
	cd $(addprefix $(NODE_DIR), brainstorm); make brainstorm_core_min

NODE_CARGRAPH:
	cd $(addprefix $(NODE_DIR), cargraph); make cargraph_core_min

NODE_DATAGRAPH:
	cd $(addprefix $(NODE_DIR), datagraph); make datagraph_core_min

NODE_EXPLANATIONBUILDER:
	cd $(addprefix $(NODE_DIR), explanationbuilder); make explanationbuilder_core_min; make explanationbuilder_grading_min

NODE_FILLIN:
	cd $(addprefix $(NODE_DIR), fillin); make fillin_core_min

NODE_HTML:
	cd $(addprefix $(NODE_DIR), html); make html_core_min

NODE_IDEABASKET:
	cd $(addprefix $(NODE_DIR), ideabasket); make ideabasket_core_min

NODE_OPENRESPONSE:
	cd $(addprefix $(NODE_DIR), openresponse); make openresponse_core_min

NODE_OUTSIDEURL:
	cd $(addprefix $(NODE_DIR), outsideurl); make outsideurl_core_min

NODE_MATCHSEQUENCE:
	cd $(addprefix $(NODE_DIR), matchsequence); make matchsequence_core_min

NODE_MULTIPLECHOICE:
	cd $(addprefix $(NODE_DIR), multiplechoice); make multiplechoice_core_min; make multiplechoice_grading_min

NODE_MYSYSTEM:
	cd $(addprefix $(NODE_DIR), mysystem); make mysystem_core_min

NODE_SENSOR:
	cd $(addprefix $(NODE_DIR), sensor); make sensor_core_min

NODE_SURGE:
	cd $(addprefix $(NODE_DIR), surge); make surge_core_min

NODE_SVGDRAW:
	cd $(addprefix $(NODE_DIR), draw); make svgdraw_core_min; make svgdraw_grading_min

NODE_TABLE:
	cd $(addprefix $(NODE_DIR), table); make table_core_min; make table_grading_min

##### ALL #####
# usage: make all

all: bootstrap_min core_min grading_min studentwork_min annotations_min teacherXMPP_min maxscores_min $(NODES)

##### VLE: EVERYTHING BUT THE NODES #####
# usage: make vle
vle: core_min grading_min studentwork_min annotations_min teacherXMPP_min maxscores_min


##### JUST THE NODES #####
# usage: make nodes
nodes: $(NODES)


##### BOOTSTRAP #####
# usage: make bootstrap_min

# All bootstrap files that will be compiled by the Closure compiler.                                                                                                                                                                                 
BOOTSTRAP_JS_FILES=\
	    util/componentloader.js \
        view/view.js \
        node/nodefactory.js \
        environment/environment.js \
        jquery/js/jquery-1.6.1.min.js \
  		jquery/js/jquery-ui-1.8.7.custom.min.js \
  		jquery/js/jsonplugin.js \
  		jquery/js/jqueryhelper.js \
 		node/Node.js \
  		node/setupNodes.js
        

BOOTSTRAP_JS_INPUT_FILES=$(addprefix $(VLE_DIR), $(BOOTSTRAP_JS_FILES))
BOOTSTRAP_CLOSURE_JS_ARGS=$(addprefix --js , $(BOOTSTRAP_JS_INPUT_FILES))
BOOTSTRAP_COMPILED_JS=$(addprefix $(VLE_DIR), minified/bootstrap_min.js)


bootstrap_min:
	rm -rf $(BOOTSTRAP_COMPILED_JS)
	java -jar $(CLOSURE) \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		$(BOOTSTRAP_CLOSURE_JS_ARGS) \
		--js_output_file $(BOOTSTRAP_COMPILED_JS)
	echo "if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/minified/bootstrap_min.js');}" >> $(BOOTSTRAP_COMPILED_JS)	                                                                                                                                          


##### CORE #####
# usage: make core_min

# All core files that will be compiled by the Closure compiler.                                                                                                                                                                                 
CORE_JS_FILES=\
        project/Project.js \
        common/helperfunctions.js \
        view/coreview.js \
        view/view_utils.js \
        view/i18n/view_i18n.js \
        io/ConnectionManager.js \
        session/SessionManager.js \
        util/NotificationManager.js \
        content/content.js \
        node/common/nodehelpers.js \
        grading/Annotation.js \
        grading/Annotations.js \
        data/nodevisit.js \
        hint/hintstate.js \
        data/StudentStatus.js \
        node/NodeUtils.js
        

CORE_JS_INPUT_FILES=$(addprefix $(VLE_DIR), $(CORE_JS_FILES))
CORE_CLOSURE_JS_ARGS=$(addprefix --js , $(CORE_JS_INPUT_FILES))
CORE_COMPILED_JS=$(addprefix $(VLE_DIR), minified/core_min.js)


core_min:
	rm -rf $(CORE_COMPILED_JS)
	java -jar $(CLOSURE) \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		$(CORE_CLOSURE_JS_ARGS) \
		--js_output_file $(CORE_COMPILED_JS)
	echo "if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/minified/core_min.js');}" >> $(CORE_COMPILED_JS)	                                                                                                                                          



##### GRADING #####
# usage: make grading_min

# All grading files that will be compiled by the Closure compiler.                                                                                                                                                                                 
GRADING_JS_FILES=\
        view/grading/gradingview_dispatcher.js \
        view/grading/gradingview_export.js \
        view/grading/gradingview_startup.js \
        view/grading/gradingview_annotations.js \
        view/grading/gradingview_display.js \
        view/grading/gradingview_premadecomments.js \
        view/grading/gradingview_studentwork.js 


GRADING_JS_INPUT_FILES=$(addprefix $(VLE_DIR), $(GRADING_JS_FILES))
GRADING_CLOSURE_JS_ARGS=$(addprefix --js , $(GRADING_JS_INPUT_FILES))
GRADING_COMPILED_JS=$(addprefix $(VLE_DIR), minified/grading_min.js)


grading_min:
	rm -rf $(GRADING_COMPILED_JS)
	java -jar $(CLOSURE) \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		$(GRADING_CLOSURE_JS_ARGS) \
		--js_output_file $(GRADING_COMPILED_JS)
	echo "if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/minified/grading_min.js');}" >> $(GRADING_COMPILED_JS)		
	


##### STUDENTWORK #####
# usage: make studentwork_min

# All studentwork files that will be compiled by the Closure compiler.                                                                                                                                                                                 
STUDENTWORK_JS_FILES=\
        data/vlestate.js \
        data/nodevisit.js

STUDENTWORK_JS_INPUT_FILES=$(addprefix $(VLE_DIR), $(STUDENTWORK_JS_FILES))
STUDENTWORK_CLOSURE_JS_ARGS=$(addprefix --js , $(STUDENTWORK_JS_INPUT_FILES))
STUDENTWORK_COMPILED_JS=$(addprefix $(VLE_DIR), minified/studentwork_min.js)


studentwork_min:
	rm -rf $(STUDENTWORK_COMPILED_JS)
	java -jar $(CLOSURE) \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		$(STUDENTWORK_CLOSURE_JS_ARGS) \
		--js_output_file $(STUDENTWORK_COMPILED_JS)
	echo "if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/minified/studentwork_min.js');}" >> $(STUDENTWORK_COMPILED_JS)			
	



##### ANNOTATIONS #####
# usage: make annotations_min

# All annotations files that will be compiled by the Closure compiler.                                                                                                                                                                                 
ANNOTATIONS_JS_FILES=\
        grading/Annotations.js \
        grading/Annotation.js

ANNOTATIONS_JS_INPUT_FILES=$(addprefix $(VLE_DIR), $(ANNOTATIONS_JS_FILES))
ANNOTATIONS_CLOSURE_JS_ARGS=$(addprefix --js , $(ANNOTATIONS_JS_INPUT_FILES))
ANNOTATIONS_COMPILED_JS=$(addprefix $(VLE_DIR), minified/annotations_min.js)


annotations_min:
	rm -rf $(ANNOTATIONS_COMPILED_JS)
	java -jar $(CLOSURE) \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		$(ANNOTATIONS_CLOSURE_JS_ARGS) \
		--js_output_file $(ANNOTATIONS_COMPILED_JS)
	echo "if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/minified/annotations_min.js');}" >> $(ANNOTATIONS_COMPILED_JS)				
	
	

##### TEACHERXMPP #####
# usage: make teacherXMPP_min

# All teacher XMPP files that will be compiled by the Closure compiler.                                                                                                                                                                                 
TEACHERXMPP_JS_FILES=\
        xmpp/js/sail.js/deps/base64.js \
        xmpp/js/sail.js/deps/jquery.cookie.js \
        xmpp/js/sail.js/deps/jquery.url.js \
        xmpp/js/sail.js/deps/load.js \
        xmpp/js/sail.js/deps/md5.js \
        xmpp/js/sail.js/deps/strophe.js \
        xmpp/js/sail.js/sail.js \
        xmpp/js/sail.js/sail.rollcall.js \
        xmpp/js/sail.js/sail.wiseauthenticate.js \
        xmpp/js/sail.js/sail.strophe.js \
        xmpp/js/teacher.js \
        xmpp/js/sail.js/sail.ui.js

TEACHERXMPP_JS_INPUT_FILES=$(addprefix $(VLE_DIR), $(TEACHERXMPP_JS_FILES))
TEACHERXMPP_CLOSURE_JS_ARGS=$(addprefix --js , $(TEACHERXMPP_JS_INPUT_FILES))
TEACHERXMPP_COMPILED_JS=$(addprefix $(VLE_DIR), minified/teacherXMPP_min.js)


teacherXMPP_min:
	rm -rf $(TEACHERXMPP_COMPILED_JS)
	java -jar $(CLOSURE) \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		$(TEACHERXMPP_CLOSURE_JS_ARGS) \
		--js_output_file $(TEACHERXMPP_COMPILED_JS)
	echo "if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/minified/teacherXMPP_min.js');}" >> $(TEACHERXMPP_COMPILED_JS)					
	
	
	
##### MAXSCORES #####
# usage: make maxscores_min

# All maxscores files that will be compiled by the Closure compiler.                                                                                                                                                                                 
MAXSCORES_JS_FILES=\
	grading/MaxScores.js \
	grading/MaxScore.js
        
MAXSCORES_JS_INPUT_FILES=$(addprefix $(VLE_DIR), $(MAXSCORES_JS_FILES))
MAXSCORES_CLOSURE_JS_ARGS=$(addprefix --js , $(MAXSCORES_JS_INPUT_FILES))
MAXSCORES_COMPILED_JS=$(addprefix $(VLE_DIR), minified/maxscores_min.js)


maxscores_min:
	rm -rf $(MAXSCORES_COMPILED_JS)
	java -jar $(CLOSURE) \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		$(MAXSCORES_CLOSURE_JS_ARGS) \
		--js_output_file $(MAXSCORES_COMPILED_JS)
	echo "if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/minified/maxscores_min.js');}" >> $(MAXSCORES_COMPILED_JS)					