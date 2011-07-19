NAME=WISE4 VLEWrapper
CLOSURE=build/tools/closure-compiler.jar
STEPS=STEP_OPENRESPONSE
STEP_DIR=WebContent/vle/node/

STEP_OPENRESPONSE:
	cd $(addprefix $(STEP_DIR), openresponse); make openresponse_core_min

# NOTE: Some files are not ready for the Closure compiler: (jquery)                                                                                                                                                                        
# NOTE: Our code safely compiles under SIMPLE_OPTIMIZATIONS                                                                                                                                                                                
# NOTE: Our code is *not* ready for ADVANCED_OPTIMIZATIONS                                                                                                                                                                                 
# NOTE: WHITESPACE_ONLY and --formatting PRETTY_PRINT is helpful for debugging.                  

##### ALL #####
# usage: make all

all: core_min grading_min studentwork_min annotations_min teacherXMPP_min maxscores_min $(STEPS)

##### VLE: EVERYTHING BUT THE STEPS #####
# usage: make vle
vle: core_min grading_min studentwork_min annotations_min teacherXMPP_min maxscores_min


##### JUST THE STEPS #####
# usage: make steps
steps: $(STEPS)

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
        

CORE_JS_INPUT_FILES=$(addprefix WebContent/vle/, $(CORE_JS_FILES))
CORE_CLOSURE_JS_ARGS=$(addprefix --js , $(CORE_JS_INPUT_FILES))
CORE_COMPILED_JS=WebContent/vle/minified/core_min.js


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


GRADING_JS_INPUT_FILES=$(addprefix WebContent/vle/, $(GRADING_JS_FILES))
GRADING_CLOSURE_JS_ARGS=$(addprefix --js , $(GRADING_JS_INPUT_FILES))
GRADING_COMPILED_JS=WebContent/vle/minified/grading_min.js


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

STUDENTWORK_JS_INPUT_FILES=$(addprefix WebContent/vle/, $(STUDENTWORK_JS_FILES))
STUDENTWORK_CLOSURE_JS_ARGS=$(addprefix --js , $(STUDENTWORK_JS_INPUT_FILES))
STUDENTWORK_COMPILED_JS=WebContent/vle/minified/studentwork_min.js


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

ANNOTATIONS_JS_INPUT_FILES=$(addprefix WebContent/vle/, $(ANNOTATIONS_JS_FILES))
ANNOTATIONS_CLOSURE_JS_ARGS=$(addprefix --js , $(ANNOTATIONS_JS_INPUT_FILES))
ANNOTATIONS_COMPILED_JS=WebContent/vle/minified/annotations_min.js


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

TEACHERXMPP_JS_INPUT_FILES=$(addprefix WebContent/vle/, $(TEACHERXMPP_JS_FILES))
TEACHERXMPP_CLOSURE_JS_ARGS=$(addprefix --js , $(TEACHERXMPP_JS_INPUT_FILES))
TEACHERXMPP_COMPILED_JS=WebContent/vle/minified/teacherXMPP_min.js


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
        
MAXSCORES_JS_INPUT_FILES=$(addprefix WebContent/vle/, $(MAXSCORES_JS_FILES))
MAXSCORES_CLOSURE_JS_ARGS=$(addprefix --js , $(MAXSCORES_JS_INPUT_FILES))
MAXSCORES_COMPILED_JS=WebContent/vle/minified/maxscores_min.js


maxscores_min:
	rm -rf $(MAXSCORES_COMPILED_JS)
	java -jar $(CLOSURE) \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		$(MAXSCORES_CLOSURE_JS_ARGS) \
		--js_output_file $(MAXSCORES_COMPILED_JS)
	echo "if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/minified/maxscores_min.js');}" >> $(MAXSCORES_COMPILED_JS)					