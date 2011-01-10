View.prototype.dropDownMenuDispatcher = function(type,args,obj){
	if(type=='showAllWork'){
		obj.showAllWork();
	} else if(type=='displayProgress'){
		obj.displayProgress(args[0], args[1]);
	} else if(type=='showFlaggedWork'){
		obj.showFlaggedWork();
	} else if (type == 'showNavigationTree') {
		obj.showNavigationTree();
	} else if (type == 'showStepHints') {
		// if hint is already open, do not open up another hint
		if ($("#hintsPanel") && 
				$("#hintsPanel").data("dialog") && 
				$("#hintsPanel").data("dialog").isOpen()) {
			return;
		}
		obj.showStepHints();
	} else if(type=='openAddAnIdeaDialog') {
		obj.openAddAnIdeaDialog();
	} else if(type=='openIdeaBasket') {
		obj.openIdeaBasket();
	} else if(type=='addIdeaToBasket') {
		obj.addIdeaToBasket();
	} else if(type=='moveIdeaToTrash') {
		obj.moveIdeaToTrash(args[0]);
	} else if(type=='moveIdeaOutOfTrash') {
		obj.moveIdeaOutOfTrash(args[0]);
	}
};

/**
 * Get the flags from the server
 * @return
 */
View.prototype.showFlaggedWork = function() {
	this.getShowFlaggedWorkData();
};

/**
 * Shows the NavigationPanel with tree view
 * @return
 */
View.prototype.showNavigationTree = function() {
	this.navigationPanel.showNavigationTree();
};

/**
 * Display hints for the current step.
 * Hints will popup in a dialog and each hint will
 * be in its own tab
 */
View.prototype.showStepHints = function() {
	//get the node the student is currently on
	var currentNode = this.getCurrentNode();

	if (currentNode.getHints() != null && currentNode.getHints().length > 0) {
		//check if the showflaggedwork div exists
	    if($('#hintsPanel').size()==0){
	    	//the show hintsDiv does not exist so we will create it
	    	$('<div id="hintsPanel" style="text-align:left"></div>').dialog(
	    			{	autoOpen:false,
	    				closeText:'',
	    				width:500,
	    				height:400,
	    				modal:false,
	    				title:'Hints',
	    				zindex:9999, 
	    				left:0, 
	    				position:["center","top"]
	    			}).bind( "dialogbeforeclose", {view:currentNode.view}, function(event, ui) {
	    			    // before the dialog closes, save hintstate
	    		    	if ($(this).data("dialog").isOpen()) {	    		    		
	    		    		var hintState = new HINTSTATE({"action":"hintclosed","nodeId":event.data.view.getCurrentNode().id});
	    		    		event.data.view.pushHintState(hintState);
	    		    		console.log('close hint');
	    		    	};
	    		    }).bind( "tabsselect", {view:currentNode.view}, function(event, ui) {
    		    		var hintState = new HINTSTATE({"action":"hintpartselected","nodeId":event.data.view.getCurrentNode().id,"partindex":ui.index});
    		    		event.data.view.pushHintState(hintState);
	    		    	console.log('tab selected'+ui.index);
	    		    });
	    };
	    
	    // append hints into one html string
	    var hintsStringPart1 = "";   // first part will be the <ul> for text on tabs
	    var hintsStringPart2 = "";   // second part will be the content within each tab
	    var hintsArr = currentNode.getHints();
	    for (var i=0; i< hintsArr.length; i++) {
	    	var currentHint = hintsArr[i];
	    	hintsStringPart1 += "<li><a href='#tabs-"+i+"'>Hint "+(i+1)+"</a></li>";
	    	hintsStringPart2 += "<div id='tabs-"+i+"'><p>"+currentHint+"</p></div>";
	    }
	    hintsStringPart1 = "<ul>" + hintsStringPart1 + "</ul>";

	    hintsString = "<div id='hintsTabs'>" + hintsStringPart1 + hintsStringPart2 + "</div>";
	    //set the html into the div
	    $('#hintsPanel').html(hintsString);
	    
	    //make the div visible
	    $('#hintsPanel').dialog('open');

	    // instantiate tabs 
		$("#hintsTabs").tabs();
		
		// log when hint was opened
    	var hintState = new HINTSTATE({action:"hintopened",nodeId:currentNode.id});
    	currentNode.view.pushHintState(hintState);
		console.log('open hint');
	};
};
/**
 * Display the flagged work for the project.
 */
View.prototype.displayFlaggedWork = function() {
	var flaggedWorkHtml = "";
	
	//get the node the student is currently on
	var currentNode = this.getCurrentNode();
	var nodeId = currentNode.id;

	//get the node
	var node = this.getProject().getNodeById(nodeId);
	
	//get all the flags for the current node
	var flagsForNodeId = this.flags.getAnnotationsByNodeId(nodeId);
	
	//check if there were any flags for the current node
	if(flagsForNodeId.length > 0) {
		//get the position
		var position = this.getProject().getVLEPositionById(nodeId);
		
		//display the step position, title, and type
		flaggedWorkHtml += "<div><br><b><u>" + position + " " + node.title + " (" + node.type + ")" + "</u></b><br><br>";
		
		//display the prompt for the step
		flaggedWorkHtml += "Prompt:<br/>";
		flaggedWorkHtml += node.getPrompt() + "<br/><br/></div><hr size=4 noshade><br/>";
		
		var flaggedWorkAnswers = "";
		
		//loop through all the flags for the current node
		for(var y=0; y<flagsForNodeId.length; y++) {
			//get a flag
			var flagForNodeId = flagsForNodeId[y];
			
			//get the work that was flagged
			var flaggedWork = flagForNodeId.data.getLatestWork();
			var flaggedWorkPostTime = flagForNodeId.postTime;
			
			if(flaggedWorkAnswers != "") {
				//add line breaks to separate the multiple answers that were flagged
				flaggedWorkAnswers += "<br/><br/>";
			}
			
			flaggedWorkAnswers += "<div style='border-width:thin; border-style:solid'>";
			
			//display the flagged work/answer
			flaggedWorkAnswers += "<div>Answer (Team Anonymous " + (y + 1) + "):</div><br/>";
			if (node.type == "MySystemNode") {
				var contentBaseUrl = this.config.getConfigParam('getContentBaseUrl');
				var divId = "mysystemDiagram_"+flaggedWorkPostTime;
				flaggedWorkAnswers += "<div id='"+divId+"' contentBaseUrl='"+contentBaseUrl+"' class='mysystem' style=\"height:350px;\">" + flaggedWork + "</div>";
			} else if (node.type == "SVGDrawNode") {
        		var contentBaseUrl = this.config.getConfigParam('getContentBaseUrl');
				var divId = "svgDraw_"+flaggedWorkPostTime;
				flaggedWork = node.translateStudentWork(flaggedWork);
				var divStyle = "height:270px; width:360px; border:1px solid #aaa; background-color:#fff;";
				flaggedWorkAnswers += "<div id='"+divId+"' contentBaseUrl='"+contentBaseUrl+"' class='svgdraw2' style=\"" + divStyle + "\">" + flaggedWork + "</div>";
        	} else if(node.type == "SensorNode") {
        		flaggedWorkAnswers += "<div id='flaggedStudentWorkDiv_" + flagForNodeId.stepWorkId + "'></div>";
        	} else {
				flaggedWorkAnswers += "<div>"+flaggedWork+"</div>";
			}
			
			flaggedWorkAnswers += "</div>";
		}
		
		//add the answers to the html
		flaggedWorkHtml += flaggedWorkAnswers;
	} else {
		//there are no flagged items
		flaggedWorkHtml += "There are no flagged items for this step.";
	}
	
	//check if the showflaggedwork div exists
    if($('#showflaggedwork').size()==0){
    	//the show flaggedworkdiv does not exist so we will create it
    	$('<div id="showflaggedwork" style="text-align:left"></div>').dialog({autoOpen:false,closeText:'',width:990,height:(document.height - 20),modal:true,title:'Flagged Work',zindex:9999});
    }
    
    //set the html into the div
    $('#showflaggedwork').html(flaggedWorkHtml);
    
    // inject svgdrawings
    $('.svgdraw2').each(function(){
		var svgString = String($(this).html());
		var contentBaseUrl = $(this).attr("contentBaseUrl");
		svgString = Utils.decode64(svgString);
		// shrink svg image to fit
		svgString = svgString.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
		svgString = svgString.replace('<svg width="600" height="450"', '<svg width="360" height="270"');
		svgString = svgString.replace(/<g>/gmi,'<g transform="scale(0.6)">');
		var svgXml = Utils.text2xml(svgString); // convert to xml
		$(this).html('');
		$(this).append(document.importNode(svgXml.documentElement, true)); // add svg to cell
	});
    
    //make the div visible
    $('#showflaggedwork').dialog('open');
    
    // print mysystem...should happen after opening showflaggedwork dialog
	$(".mysystem").each(function() {
		var json_str = $(this).html();
		$(this).html("");
		var divId = $(this).attr("id");
		var contentBaseUrl = $(this).attr("contentBaseUrl");
		try {
			new MySystemPrint(json_str,divId,contentBaseUrl);
		} catch (err) {
			// do nothing
		}
	});
	
	//loop through all the flags for the current node
	for(var y=0; y<flagsForNodeId.length; y++) {
		//get a flag
		var flagForNodeId = flagsForNodeId[y];
		
		//only perform this for sensor nodes until we implement it for all other steps
		if(node.type == 'SensorNode') {

			//get the nodevisit from the flag
			var nodeVisit = flagForNodeId.data;
			
			if(nodeVisit != null) {
				/*
				 * get the step work id and set it into the nodevisit
				 * because for some reason it does not have its id set
				 */
				nodeVisit.id = flagForNodeId.stepWorkId;
				
				//render the work into the div to display it
				node.renderGradingView("flaggedStudentWorkDiv_" + nodeVisit.id, nodeVisit, "flag_");					
			}
		}
	}
};

/**
 * Retrieve all the data required to display the show all work. Perform
 * this retrieval every time the student opens Show All Work so that
 * they can get grades and comments the teacher made immediately.
 */
View.prototype.showAllWork = function(annotationsRetrieved, projectMetaDataRetrieved){
	//clear out these values so that the respective data will be retrieved again
	this.annotationsRetrieved = annotationsRetrieved;
	this.projectMetaDataRetrieved = projectMetaDataRetrieved;
	
	//get the annotation, project meta data, and run extras
	this.getShowAllWorkData();
};

/**
 * This function checks to make sure annotations, project meta data, and
 * run extras are retrieved before displaying Show All Work.
 * 
 * The dispatcher listens for the 3 events below and calls displayShowAllWork 
 * each time but only displays Show All Work after all 3 have been fired
 * by checking the *Retrieved flags
 * 
 * getAnnotationsComplete
 * getProjectMetaDataComplete
 * getRunExtrasComplete
 *
 */
View.prototype.displayShowAllWork = function() {
	//make sure annotations, project meta data, and run extras have been retrieved
	if(this.annotationsRetrieved && this.projectMetaDataRetrieved) {
	    var allWorkHtml = "";
	    
	    var workgroupId = this.getUserAndClassInfo().getWorkgroupId();
	    
	    //get all the ids for teacher and shared teachers
	    var teacherIds = this.getUserAndClassInfo().getAllTeacherWorkgroupIds();
	    
	    //get the scores given to the student by the teachers
	    var totalScoreAndTotalPossible = this.annotations.getTotalScoreAndTotalPossibleByToWorkgroupAndFromWorkgroups(workgroupId, teacherIds, this.maxScores);
	    
	    //get the total score for the workgroup
	    var totalScoreForWorkgroup = totalScoreAndTotalPossible.totalScore;
	    
	    //get the max total score for the steps that were graded for this workgroup
	    var totalPossibleForWorkgroup = totalScoreAndTotalPossible.totalPossible;
	    
	    var vleState = this.state;
	    
	    //get all the nodeIds in the projecte except HtmlNodes
	    var nodeIds = this.getProject().getNodeIds("HtmlNode");
	    
	    var numStepsCompleted = 0;
	    
		//loop through all the nodeIds
		for(var y=0; y<nodeIds.length; y++) {
			var nodeId = nodeIds[y];
			
			//get the latest work for the current workgroup 
			var latestNodeVisit = vleState.getLatestNodeVisitByNodeId(nodeId);
			var latestNodeVisitPostTime = null;
			
			//check if there was any work
			if (latestNodeVisit != null) {
				//student has completed this step so we will increment the counter
				numStepsCompleted++;
			}
		}
		
		//for the current team, calculate the percentage of the project they have completed
		var teamPercentProjectCompleted = Math.floor((numStepsCompleted / nodeIds.length) * 100) + "%";
	    
		// var closeButton1 = "<a href='#' class='container-close'>Close</a>";
		
	    var scoresDiv1 = "<table id='showAllWorkScoresTable'><tr><td class='scoreHeader' colspan='4'>Current Score & Progress</td></tr>";
	    
	    var scoresDiv2 = "<tr><td>Teacher Graded Score</td><td>Computer Graded Score</td><td>TOTAL SCORE</td><td>% of Project Completed</td></tr>";
	    	
	    var scoresDiv3 = "<tr><td class='scoreValue'>" + totalScoreForWorkgroup + "/" + totalPossibleForWorkgroup + "</td><td class='scoreValue'>not available</td><td class='scoreValue'>" + totalScoreForWorkgroup + "/" + totalPossibleForWorkgroup + "</td><td class='scoreValue'>" + teamPercentProjectCompleted + "</td></tr></table>";

	    
		allWorkHtml = "<div id=\"showWorkContainer\">" + scoresDiv1 + scoresDiv2 + scoresDiv3 + "<br><hr><br>" + this.project.getShowAllWorkHtml(this.project.getRootNode(), true) + "</div>";

	    if($('#showallwork').size()==0){
	    	$('<div id="showallwork"></div>').dialog({autoOpen:false,closeText:'',width:'94%',height:550,modal:true,title:'My Work (with Teacher Feedback and Scores)'});
	    }	    
	    
	    $('#showallwork').html(allWorkHtml);
	    
	    // inject svgdrawings
	    $('.svgdraw').each(function(){
			var svgString = String($(this).html());
			var contentBaseUrl = $(this).attr("contentBaseUrl");
			svgString = Utils.decode64(svgString);
			// shrink svg image to fit
			svgString = svgString.replace(/(<image.*xlink:href=)"(.*)"(.*\/>)/gmi, '$1'+'"'+contentBaseUrl+'$2'+'"'+'$3');
			svgString = svgString.replace('<svg width="600" height="450"', '<svg width="360" height="270"');
			svgString = svgString.replace(/<g>/gmi,'<g transform="scale(0.6)">');
			var svgXml = Utils.text2xml(svgString); // convert to xml
			$(this).html('');
			$(this).append(document.importNode(svgXml.documentElement, true)); // add svg to cell
		});
	    
	    $('#showallwork').dialog('open');
	    // print mysystem...should happen after opening showallworkdialog
		$(".mysystem").each(function() {
			var json_str = $(this).html();
			$(this).html("");
			var divId = $(this).attr("id");
			var contentBaseUrl = $(this).attr("contentBaseUrl");
			try {
				new MySystemPrint(json_str,divId,contentBaseUrl);
			} catch (err) {
				// do nothing
			}
		});
		
		//get all the node ids in the project
		var nodeIds = this.project.getNodeIds();
		
		//loop through all the node ids
		for(var x=0; x<nodeIds.length; x++) {
			//get a node object
			var node = this.project.getNodeById(nodeIds[x]);

			//only perform this for sensor nodes until we implement it for all other steps
			if(node.type == 'SensorNode') {
				//get the node id
				var nodeId = node.id;
				
				//get the latest node visit that contains student work for this step
				var nodeVisit = this.state.getLatestNodeVisitByNodeId(nodeId);
				
				//check if the student has any work for this step
				if(nodeVisit != null) {
					//render the work into the div to display it
					node.renderGradingView("latestWork_" + nodeVisit.id, nodeVisit);					
				}
			}
		}
		
		//check if there was any new feeback for the student
		if(this.project.hasNewFeedback()) {
			//display a popup to notify the student that there is new feedback
			alert('You have new feedback from your teacher.\n\nThe new feedback is labelled as [New].');
		}
	}
};

/**
 * Retrieve all the annotations for the currently-logged in user/workgroup
 * from the teacher.
 */
View.prototype.getAnnotations = function(callerId) {
	var processGetAnnotationResponse = function(responseText, responseXML, args) {
		var thisView = args[0];
		var callerId = args[1];
		
		//parse the xml annotations object that contains all the annotations
		thisView.annotations = Annotations.prototype.parseDataJSONString(responseText);

		thisView.annotationsRetrieved = true;
		eventManager.fire('getAnnotationsComplete', callerId);
	};

	var annotationsUrlParams = {
				runId: this.getConfig().getConfigParam('runId'),
				toWorkgroup: this.getUserAndClassInfo().getWorkgroupId(),
				fromWorkgroups: this.getUserAndClassInfo().getAllTeacherWorkgroupIds(),
				periodId:this.getUserAndClassInfo().getPeriodId()
			};
	
	this.connectionManager.request('GET', 3, this.getConfig().getConfigParam('getAnnotationsUrl'), annotationsUrlParams, processGetAnnotationResponse, [this, callerId]);
};

/**
 * Retrieve the flagged work and display it
 */
View.prototype.getFlaggedWork = function() {
	var processGetFlaggedWorkResponse = function(responseText, responseXML, args) {
		var thisView = args[0];
		var callerId = args[1];
		
		//parse the flags
		thisView.flags = Annotations.prototype.parseDataJSONString(responseText);
		
		//display the flagged work
		thisView.displayFlaggedWork();
	};

	var flaggedWorkUrlParams = {
				userId:this.getUserAndClassInfo().getWorkgroupId(),
				periodId:this.getUserAndClassInfo().getPeriodId(),
				nodeId:this.getCurrentNode().id,
				isStudent:true
	};
	
	this.connectionManager.request('GET', 3, this.getConfig().getConfigParam('getFlagsUrl'), flaggedWorkUrlParams, processGetFlaggedWorkResponse, [this]);

};

/**
 * Retrieve the flagged work
 */
View.prototype.getShowFlaggedWorkData = function() {
	this.getFlaggedWork();
};

/**
 * Makes sure all 3 sets of data are retrieved before
 * Show All Work is displayed.
 */
View.prototype.getShowAllWorkData = function() {
	//make sure annotations are retrieved
	if(this.annotationsRetrieved == null) {
		this.getAnnotations('displayShowAllWork');
	} else {
		/*
		 * the annotations were already retrieved so we will make sure
		 * the flag has been set and we will fire the event again
		 * so listeners will be notified 
		 */
		this.annotationsRetrieved = true;
		eventManager.fire('getAnnotationsComplete', 'displayShowAllWork');
	}
	
	//make sure project meta data is retrieved
	if(this.projectMetaDataRetrieved == null) {
		this.getProjectMetaData();
	} else {
		/*
		 * the annotations were already retrieved so we will make sure
		 * the flag has been set and we will fire the event again
		 * so listeners will be notified 
		 */
		this.projectMetaDataRetrieved = true;
		eventManager.fire('getProjectMetaDataComplete');
	}
};

/**
 * Get annotations so we can check if there are any new teacher annotations
 * to notify the student about
 */
View.prototype.getAnnotationsToCheckForNewTeacherAnnotations = function() {
	this.getAnnotations('checkForNewTeacherAnnotations');
};

/**
 * Check if there are any new teacher annotations since the student last
 * visited. If there are new annotations we will display a popup message
 * to the student and automatically open up show all work.
 * @return
 */
View.prototype.checkForNewTeacherAnnotations = function() {
	if(this.state != null) {
		//get the time they last visited in milliseconds
		var lastTimeVisited = this.state.getLastTimeVisited();
		
		if(this.annotations != null) {
			//check if there are any new annotations after the last time they visited
			var areNewAnnotations = this.annotations.annotationsAfterDate(lastTimeVisited);
			
			if(areNewAnnotations) {
				//there are new annotations so we will automatically open up the show all work
				this.showAllWork(true, null, null);
			}		
		}		
	}
};

/**
 * Opens the Add an Idea dialog popup so the student can create a new Idea
 */
View.prototype.openAddAnIdeaDialog = function() {
	//check if the addAnIdeaDiv exists
	if($('#addAnIdeaDiv').size()==0){
		//it does not already exist so we will create it
    	$('<div id="addAnIdeaDiv" style="text-align:left"></div>').dialog({autoOpen:false,closeText:'',width:400,height:200,modal:false,title:'Add an Idea',position:[300,40]});
    }
	
	//the html we will insert into the popup
	var addAnIdeaHtml = "";
	
	//get the node id, node name and vle position for the step
	var nodeId = this.getCurrentNode().id;
	var nodeName = this.getCurrentNode().getTitle();
	var vlePosition = this.getProject().getVLEPositionById(nodeId);
	
	nodeName = vlePosition + ": " + nodeName;
	
	//create the UI for creating an Idea
	addAnIdeaHtml += "<p>Your Idea (max 75 characters):</p>";
	addAnIdeaHtml += "<input id='ideaText' type='text' size='40' />";
	addAnIdeaHtml += "<br>";
	addAnIdeaHtml += "Source: <input id='ideaNodeName' type='text' size='30' value='" + nodeName + "' />";
	addAnIdeaHtml += "<input id='ideaNodeId' type='hidden' value='" + nodeId + "'/>";
	addAnIdeaHtml += "<br>";
	addAnIdeaHtml += "Tag/Category: <input id='ideaTag' type='text' size='30' />";
	addAnIdeaHtml += "<br>";
	addAnIdeaHtml += "Flag:";
	addAnIdeaHtml += "<select id='ideaFlag'>";
	addAnIdeaHtml += "<option>Question</option>";
	addAnIdeaHtml += "<option>Exclamation</option>";
	addAnIdeaHtml += "<option>Check</option>";
	addAnIdeaHtml += "<option>Star</option>";
	addAnIdeaHtml += "</select>";
	addAnIdeaHtml += "<br>";
	addAnIdeaHtml += "<input type='button' value='Add to Basket' onclick='eventManager.fire(\"addIdeaToBasket\")'/>";
	
	//insert the html into the popup
	$('#addAnIdeaDiv').html(addAnIdeaHtml);
	
	//make the popup visible
	$('#addAnIdeaDiv').dialog('open');
};

/**
 * Add the idea to the basket
 */
View.prototype.addIdeaToBasket = function() {
	//get the values the student has entered for the idea
	var text = $('#ideaText').val();
	var nodeName = $('#ideaNodeName').val();
	var nodeId = $('#ideaNodeId').val();
	var tag = $('#ideaTag').val();
	var flag = $('#ideaFlag').val();
	
	//set the params to post back to the server to save the idea
	var ideaBasketParams = {
		action:"addIdea",
		text:text,
		nodeName: nodeName,
		nodeId: nodeId,
		tag: tag,
		flag: flag
	};
	
	//save the idea to the server
	this.connectionManager.request('POST', 3, this.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, null, this);
	
	//close the create an idea popup
	$('#addAnIdeaDiv').dialog('close');
};

/**
 * Retrieve the idea basket from the server
 */
View.prototype.openIdeaBasket = function() {
	//set the params we will use in the request to the server
	var ideaBasketParams = {
		action:"getIdeaBasket"	
	};
	
	//request the idea basket from the server
	this.connectionManager.request('GET', 3, this.getConfig().getConfigParam('getIdeaBasketUrl'), ideaBasketParams, this.displayIdeaBasket, {thisView:this});
};

View.prototype.displayIdeaBasket = function(responseText, responseXML, args) {
	var thisView = args.thisView;
	
	//check if the ideaBasketDiv exists
	if($('#ideaBasketDiv').size()==0){
		//it does not exist so we will create it
		$('#w4_vle').append('<div id="ideaBasketDiv""></div>');
		$('#ideaBasketDiv').html('<iframe id="ideaBasketIfrm" name="ideaBasket" width="95%" height="95%"></iframe>');
		$('#ideaBasketDiv').dialog({autoOpen:false,closeText:'',width:800,height:600,modal:false,title:'Idea Basket',position:[300,40],close:thisView.ideaBasketDivClose});
		//$('#ideaBasketDiv').bind('dialogclose', {thisView:thisView}, this);
    }
	
	$('#ideaBasketDiv').dialog('open');
	
	if(window.frames['ideaBasket'].thisView == null) {
		window.frames['ideaBasket'].thisView = thisView;
	}
	
	if(window.frames['ideaBasket'].eventManager == null) {
		window.frames['ideaBasket'].eventManager = eventManager;		
	}
	
	if($('#ideaBasketIfrm').attr('src') == null) {
		$('#ideaBasketIfrm').attr('src', "ideaManager.html");		
	} else {
		window.frames['ideaBasket'].retrieveIdeaBasket();
	}
};

View.prototype.ideaBasketDivClose = function() {
	window.frames['ideaBasket'].basket.saveOrder();
};

/**
 * The callback function for when we receive the idea basket from the server
 * @param responseText the idea basket as a JSON string
 * @param responseXML
 * @param args contains the view so we can have access to it if necessary
 */
View.prototype.displayIdeaBasket2 = function(responseText, responseXML, args) {
	var thisView = args.thisView;
	
	//check if the ideaBasketDiv exists
	if($('#ideaBasketDiv').size()==0){
		//it does not exist so we will create it
    	//$('<div id="ideaBasketDiv" style="text-align:left"></div>').dialog({autoOpen:false,closeText:'',width:600,height:400,modal:false,title:'Idea Basket',position:[300,40]});
		$('<div id="ideaBasketDiv" style="text-align:left"><ifrm id="ideaBasketIfrm" width="100%"></ifrm></div>').dialog({autoOpen:false,closeText:'',width:600,height:400,modal:false,title:'Idea Basket',position:[300,40]});
    }
	
	//parse the idea basket
	var ideaBasket = $.parseJSON(responseText);
	var ideas = [];
	var trash = [];
	
	if(ideaBasket != null) {
		//retrieve the ideas and trash arrays
		ideas = ideaBasket.ideas;
		trash = ideaBasket.trash;
	}
	
	var ideaBasketHtml = "";
	
	//create the table that will display the header columns
	ideaBasketHtml += "<table border='1'>";
	ideaBasketHtml += "<tr>";
	ideaBasketHtml += "<td width='200'>Your Ideas</td>";
	ideaBasketHtml += "<td width='100'>Sources</td>";
	ideaBasketHtml += "<td width='100'>Tag</td>";
	ideaBasketHtml += "<td width='100'>Flag</td>";
	ideaBasketHtml += "<td width='100'>Send to Trash</td>";
	ideaBasketHtml += "</tr>";
	ideaBasketHtml += "</table>";
	
	//create the sortable ul for the ideas
	ideaBasketHtml += "<ul id='ideaBasketList'>";
	
	/*
	 * loop through all the ideas backwards because we want the newer
	 * ideas at the top and the older ideas at the bottom
	 */
	for(var x=ideas.length - 1; x>=0; x--) {
		//get an idea
		var idea = ideas[x];
		
		//get the values for the idea
		var ideaId = idea.id;
		var text = idea.text;
		var nodeName = idea.nodeName;
		var tag = idea.tag;
		var flag = idea.flag;
		
		//create the li for the idea
		ideaBasketHtml += "<li id='ideaLI_" + ideaId + "'>";
		ideaBasketHtml += "<table border='1'>";
		ideaBasketHtml += "<tr>";
		ideaBasketHtml += "<td width='200'><p id='ideaText_" + ideaId + "' class='ideaText'> " + text + "</p></td>";
		ideaBasketHtml += "<td width='100'>" + nodeName + "</td>";
		ideaBasketHtml += "<td width='100'><p id='ideaTag_" + ideaId + "' class='ideaTag'>" + tag + "</p></td>";
		ideaBasketHtml += "<td width='100'><p id='ideaFlag_" + ideaId + "' class='ideaFlag'>" + flag + "</p></td>";
		ideaBasketHtml += "<td width='100' id='ideaTrashTd_" + ideaId +"'><input id='ideaTrash_" + ideaId + "' type='button' value='Trash' onclick='eventManager.fire(\"moveIdeaToTrash\", [" + ideaId + "])' /></td>";
		ideaBasketHtml += "</tr>";
		ideaBasketHtml += "</table>";
		ideaBasketHtml += "</li>";
	}
	
	//close the ul for the ideas
	ideaBasketHtml += "</ul>";
	
	//a label for the trash list
	ideaBasketHtml += "<p>Trash</p>";
	
	//create the sortable ul for the trash
	ideaBasketHtml += "<ul id='ideaBasketTrash'>";
	
	/*
	 * loop through all the ideas in the trash backwards so that the
	 * newer ones show up at the top
	 */
	for(var y=trash.length - 1; y>=0; y--) {
		//get an idea
		var idea = trash[y];
		
		//get the values for the idea
		var ideaId = idea.id;
		var text = idea.text;
		var nodeName = idea.nodeName;
		var tag = idea.tag;
		var flag = idea.flag;
		
		//create the li for the idea
		ideaBasketHtml += "<li id='ideaLI_" + ideaId + "'>";
		ideaBasketHtml += "<table border='1'>";
		ideaBasketHtml += "<tr>";
		ideaBasketHtml += "<td width='200'><p id='ideaText_" + ideaId + "' class='ideaText'> " + text + "</p></td>";
		ideaBasketHtml += "<td width='100'>" + nodeName + "</td>";
		ideaBasketHtml += "<td width='100'><p id='ideaTag_" + ideaId + "' class='ideaTag'>" + tag + "</p></td>";
		ideaBasketHtml += "<td width='100'><p id='ideaFlag_" + ideaId + "' class='ideaFlag'>" + flag + "</p></td>";
		ideaBasketHtml += "<td width='100' id='ideaTrashTd_" + ideaId +"'><input id='ideaTrash_" + ideaId + "' type='button' value='Untrash' onclick='eventManager.fire(\"moveIdeaOutOfTrash\", [" + ideaId + "])' /></td>";
		ideaBasketHtml += "</tr>";
		ideaBasketHtml += "</table>";
		ideaBasketHtml += "</li>";
	}
	
	//close the ul for the trash
	ideaBasketHtml += "</ul>";

	//set the html into the basket div
	$('#ideaBasketDiv').html(ideaBasketHtml);
	
	//make the ideas sortable
	$('#ideaBasketList').sortable();
	
	//bind a function call to be called whenever the student changes the order
	$('#ideaBasketList').bind('sortupdate', {thisView:thisView}, thisView.ideaBasketListChanged);
	
	//make the fields editable
	$('.ideaText').editInPlace({callback:thisView.editIdea, params:[thisView, 'updateText']});
	$('.ideaTag').editInPlace({callback:thisView.editIdea, params:[thisView, 'updateTag']});
	$('.ideaFlag').editInPlace({callback:thisView.editIdea, params:[thisView, 'updateFlag'], field_type:'select', select_options:'Question, Exclamation, Check, Star'});
	
	//display the basket
	$('#ideaBasketDiv').dialog('open');
};

/**
 * The function that's called when the order of ideas is changed
 * @param event
 * @param ui
 */
View.prototype.ideaBasketListChanged = function(event, ui) {
	//get the view
	var thisView = event.data.thisView;
	
	/*
	 * get list of idea LI elements as an array containing the DOM ids in the order
	 * they are displayed in the UI
	 */
	var ideaList = $('#ideaBasketList').sortable('toArray');
	
	//an array that we will use to store the order of the ideaIds
	var basketOrder = [];
	
	//loop through all the ids
	for(var x=0; x<ideaList.length; x++) {
		//get the idea LI id (e.g. ideaLI_5)
		var ideaLI = ideaList[x];
		
		//get the ideaId from the DOM id
		var ideaId = ideaLI.replace('ideaLI_', '');
		
		//add the ideaId to the array
		basketOrder.push(parseInt(ideaId));
	}
	
	/*
	 * reverse the array because we want the ideas at the top of
	 * the UI to be at the end of the array
	 */
	basketOrder.reverse();
	
	//turn the basket order into a JSON string
	basketOrder = $.stringify(basketOrder);
	
	var action = "reOrderBasket";
	
	var ideaBasketParams = {
			action:action,
			basketOrder:basketOrder 
	};
	
	//post the basket order to the server
	thisView.connectionManager.request('POST', 3, thisView.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, thisView.reOrderBasketDone, {thisView:thisView});
};

View.prototype.reOrderBasketDone = function() {
	//TODO: make sure data was saved, if data not saved we need to revert value in student display
};

/**
 * The student has edited an idea so we will save the changes back to the server
 * @param idOfEditor the id of the element that was changed
 * @param enteredText the new text the student has entered
 * @param originalText
 * @param args contains the view and the action
 */
View.prototype.editIdea = function(idOfEditor, enteredText, originalText, args) {
	var thisView = args[0];
	var action = args[1];
	var ideaId = "";
	var text = "";
	var nodeName = "";
	var nodeId = "";
	var tag = "";
	var flag = "";
	
	if(action == 'updateText') {
		//student has edited the text
		ideaId = idOfEditor.replace('ideaText_', '');
		text = enteredText;
	} else if(action == 'updateNodeName') {
		
	} else if(action == 'updateNodeId') {
		
	} else if(action == 'updateNodeName') {
		
	} else if(action == 'updateTag') {
		//student has edited the tag
		ideaId = idOfEditor.replace('ideaTag_', '');
		tag = enteredText;
	} else if(action == 'updateFlag') {
		//student has edited the flag
		ideaId = idOfEditor.replace('ideaFlag_', '');
		flag = enteredText;
	}
	
	//set the params to post back to the server to save the changes to the idea
	var ideaBasketParams = {
			ideaId:ideaId,
			action:action,
			text:text,
			nodeName: nodeName,
			nodeId: nodeId,
			tag: tag,
			flag: flag
	};
	
	//post the change back to the server
	thisView.connectionManager.request('POST', 3, thisView.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, thisView.editIdeaDone, {thisView:thisView});
	
	//return the new text the student entered
	return enteredText;
};

View.prototype.editIdeaDone = function(responseText, responseXML, args) {
	//TODO: make sure data was saved, if data not saved we need to revert value in student display
};

/**
 * The student has moved an idea to the trash so we will
 * save the change back to the server
 * @param ideaId the id of the idea that was moved to the trash
 */
View.prototype.moveIdeaToTrash = function(ideaId) {
	var action = "trashIdea";
	
	var ideaBasketParams = {
			action:action,
			ideaId:ideaId
	};
	
	//tell the server to put the idea in the trash
	this.connectionManager.request('POST', 3, this.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, this.moveIdeaToTrashDone, {thisView:this, ideaId:ideaId});
};

/**
 * Callback for after the server has put an idea into the trash
 * @param responseText
 * @param responseXML
 * @param args
 */
View.prototype.moveIdeaToTrashDone = function(responseText, responseXML, args) {
	var ideaId = args.ideaId;

	//get the LI for the idea
	var ideaLI = $('#ideaLI_' + ideaId);
	
	//remove it from the ideas list and put it into the trash list in the UI
	$('#ideaBasketList').remove($('#ideaLI_' + ideaId));
	$('#ideaBasketTrash').prepend($('#ideaLI_' + ideaId));
	
	//change the button so that when it is clicked, it will move the idea out of the trash and back into the ideas
	$('#ideaTrashTd_' + ideaId).html("<input id='ideaTrash_" + ideaId + "' type='button' value='Untrash' onclick='eventManager.fire(\"moveIdeaOutOfTrash\", [" + ideaId + "])' />");
};

/**
 * The student has moved an idea out of the trash and into the ideas
 * @param ideaId the id of the idea
 */
View.prototype.moveIdeaOutOfTrash = function(ideaId) {
	var action = "unTrashIdea";
	
	var ideaBasketParams = {
			action:action,
			ideaId:ideaId
	};

	//tell the server to take the idea out of the trash and back into the ideas
	this.connectionManager.request('POST', 3, this.getConfig().getConfigParam('postIdeaBasketUrl'), ideaBasketParams, this.moveIdeaOutOfTrashDone, {thisView:this, ideaId:ideaId});
};

/**
 * Callback for after the server has moved the idea out of the trash
 * and into the ideas
 * @param responseText
 * @param responseXML
 * @param args
 */
View.prototype.moveIdeaOutOfTrashDone = function(responseText, responseXML, args) {
	var ideaId = args.ideaId;
	
	//get the LI for the idea
	var ideaLI = $('#ideaLI_' + ideaId);
	
	//remove it from the trash and put it into the ideas list in the UI
	$('#ideaBasketTrash').remove($('#ideaLI_' + ideaId));
	$('#ideaBasketList').prepend($('#ideaLI_' + ideaId));

	//change the button so that when it is clicked, it will move the idea to the trash
	$('#ideaTrashTd_' + ideaId).html("<input id='ideaTrash_" + ideaId + "' type='button' value='Trash' onclick='eventManager.fire(\"moveIdeaToTrash\", [" + ideaId + "])' />");
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_topmenu.js');
}