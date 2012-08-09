WISE = {
    // config
	wiseXMPPAuthenticateUrl: '',
    xmppDomain: 'localhost',
    groupchatRoom: '',
    groupchatRoomBase: '@conference.localhost',
    
    // WISE variables
    view:null,
    
    // private global vars
    ui: Sail.UI,
    groupchat: null,
    session: null,
    justWatching: false,
    
    
    // initialization (called in $(document).ready() at the bottom of this file)
    init: function(viewIn) {
		view=viewIn;
        //console.log("Initializing WISE...")

        WISE.wiseXMPPAuthenticateUrl = view.config.getConfigParam("wiseXMPPAuthenticateUrl") + "&workgroupId=" + view.userAndClassInfo.getWorkgroupId();
        WISE.xmppDomain = view.config.getConfigParam("hostName");
        WISE.groupchatRoomBase = "@conference." + WISE.xmppDomain;
        
        // get runId to use for chatroom
        WISE.groupchatRoom = view.config.getConfigParam("runId") + WISE.groupchatRoomBase;
        //console.log("chatroom:" + WISE.groupchatRoom);

        // create custom event handlers for all WISE 'on' methods
        Sail.autobindEvents(WISE, {
            pre: function() {
        		//console.debug(arguments[0].type+'!',arguments);
        	}
        });
        
        $('#pause-button').click(function() {WISE.doPause();  return false});

        $('#unPause-button').click(function() {WISE.doUnPause();  return false});
        
        $('#connecting').show();
        
        WISE.authenticate();
        
        return this;
    },
    
    getJabberId: function(userString) {
    	return userString.split('/')[1].split('@')[0];
    },
    
    isEventFromTeacher: function(sev) {
    	var sender = sev.from.split('/')[1].split('@')[0];
    	var teacherWorkgroupId = view.getUserAndClassInfo().getTeacherWorkgroupId();
        return sender == teacherWorkgroupId;
    },
    
    isEventFromStudent: function(sev) {
    	// todo implement me
    	return true;
    },
       
    doPause: function() {
    	//get the message the teacher has typed
    	var message = $('#pause-message').val();
    	
    	if (message == "") {
    		//teacher did not type any message so we will use a default one
    		message = "Your teacher has paused your screen.";
    	}
    	
    	//share the message with the class, this will also pause the student screens
    	this.shareWithClass('TeacherMessage', message);
    },

    doUnPause: function() {
    	//get the url for the chat log controller
    	var chatLogUrl = view.getConfig().getConfigParam('chatLogUrl');
    	var runId = view.getConfig().getConfigParam('runId');
    	
    	/*
    	 * send a message to the chat log controller so it can save this chat
    	 * message to the database
    	 */
    	$.ajax({
    		url:chatLogUrl,
    		type:"POST",
    		data:{"runId":runId,
    			"fromWorkgroupId":view.userAndClassInfo.getWorkgroupId(),
    			"fromWorkgroupName":view.userAndClassInfo.getUserName(),
    			"chatRoomId":"general",
    			"chatEventType":"unPause",
    			"dataType":"string",
    			"data":""},
    		success:function(data, text, xhr) {
    			//unpause the student screens
    	        sev = new Sail.Event('unPause');
    	        WISE.groupchat.sendEvent(sev);
    		},
    		error:function(xhr, text) {
    			
    		},
    		async:false
    	});
    	
    },

    authenticate: function() {
    	/*
    	 * retrieve the xmpp username and password to the ejabberd server
    	 */
    	WISE.wiseXMPPAuthenticate = new Sail.WiseXMPPAuthenticate.Client(WISE.wiseXMPPAuthenticateUrl);
        WISE.wiseXMPPAuthenticate.fetchXMPPAuthentication(function(data) {
        	WISE.xmppUsername = data.xmppUsername;
        	WISE.xmppPassword = data.xmppPassword;
            $(WISE).trigger('authenticated');
        });
    },

    sendTeacherToChatRoomMessage: function(msg) {    	
    	var chatLogUrl = view.getConfig().getConfigParam('chatLogUrl');
    	var runId = view.getConfig().getConfigParam('runId');
    	
    	message = msg;
    	
    	var data = {"runId":runId,
    			"fromWorkgroupId":view.userAndClassInfo.getWorkgroupId(),
    			"fromWorkgroupName":view.userAndClassInfo.getUserName(),
    			"chatRoomId":"general",
    			"chatEventType":"studentToChatRoomMessage",
    			"dataType":"string",
    			"data":message};

    	/*
    	 * send a message to the chat log controller so it can save this chat
    	 * message to the database
    	 */
    	$.ajax({
    		url:chatLogUrl,
    		type:"POST",
    		data:data,
    		success:function(callbackData, text, xhr) {
    			//send the message to the chat room
    	    	sev = new Sail.Event('teacherToChatRoomMsg', data);   
    	    	if (WISE.groupchat) {
    	    		WISE.groupchat.sendEvent(sev);
    	    	}
    		},
    		error:function(xhr, text) {
    			
    		},
    		async:false
    	});
    },
    
    /**
     * The teacher has shared something with the class
     * @param shareWithClassType the type of object that is shared
     * e.g.
     * "Html"
     * "NodeVisit"
     * "TeacherMessage"
     * @param value the object to share
     */
    shareWithClass: function(shareWithClassType, value) {
    	if (shareWithClassType == "NodeVisit") {
    		//the teacher is sharing a student node visit
        	var nodeVisitId = value;
        	if (realTimeNodeVisitIdToNodeVisit != null) {
        		var teacherShareWithClassObj = {};
        		teacherShareWithClassObj.shareType = "NodeVisit";
        		var nodeVisitShareObj = realTimeNodeVisitIdToNodeVisit[nodeVisitId];
        		if (nodeVisitShareObj != null) {
        			teacherShareWithClassObj.shareObject = nodeVisitShareObj;
        	    	sev = new Sail.Event('teacherShareWithClass', teacherShareWithClassObj);   
        	    	if (WISE.groupchat) {
        	    		WISE.groupchat.sendEvent(sev);
        	    	}    	    			
        		}
        	}
    	} else if (shareWithClassType == "Html" || shareWithClassType == "TeacherMessage") {
    		//the teacher is sharing html or a message
    		var teacherShareWithClassObj = {};
    		teacherShareWithClassObj.shareType = shareWithClassType;
    		teacherShareWithClassObj.shareObject = value;
	    	sev = new Sail.Event('teacherShareWithClass', teacherShareWithClassObj);   
	    	if (WISE.groupchat) {
	    		WISE.groupchat.sendEvent(sev);
	    	}    	    			
    	}
    },
        
    disconnect: function() {
    	// make sure that students' screens are unpaused when teacher logs out.
    	this.doUnPause();
    	Sail.Strophe.disconnect();
    },
    
    events: {
        // mapping of Sail events to local Javascript events
	
        sail: {
            'unPause':'unPause',
            'studentToTeacherMsg':'studentToTeacherMsg',
            'studentToChatRoomMsg':'studentToChatRoomMsg',
            'teacherToChatRoomMsg':'teacherToChatRoomMsg',
            'teacherShareWithClass':'teacherShareWithClass',
            'joinedGroupChat':'joinedGroupChat'
        },

        // local Javascript event handlers
        onAuthenticated: function() {
            Sail.Strophe.bosh_url = 'http://' + WISE.xmppDomain + '/http-bind/';
            var currentTimeInMillis = new Date().getTime();
         	Sail.Strophe.jid = WISE.xmppUsername + '@' + WISE.xmppDomain + "/" + currentTimeInMillis;
            Sail.Strophe.password = WISE.xmppPassword;
            
            Sail.Strophe.onConnectSuccess = function() {
          	    sailHandler = Sail.generateSailEventHandler(WISE);
          	    Sail.Strophe.addHandler(sailHandler, null, null, 'groupchat');
          	    Sail.Strophe.addHandler(sailHandler, null, null, 'chat');
      	    
          	    var joinedGroupChatSuccess = function() {
          	    	$(WISE).trigger('joinedGroupChat');
          	    }
          	    WISE.groupchat = new Sail.Strophe.Groupchat(WISE.groupchatRoom);
          	    WISE.groupchat.onParticipantJoin = function(who,pres) {
          	    	var newParticipantWorkgroupId = WISE.getJabberId(who);
          	    	$("#classroomMonitorWorkgroupRow_"+newParticipantWorkgroupId).css("background-color","white");
          	    };
          	    WISE.groupchat.onParticipantLeave = function(who,pres) {
          	    	var oldParticipantWorkgroupId = WISE.getJabberId(who);
          	    	$("#classroomMonitorWorkgroupRow_"+oldParticipantWorkgroupId).css("background-color","lightgrey");
          	    };
          	    WISE.groupchat.onSelfJoin = function(pres) {
                	//console.log('onSelfJoinedGroupChat');
                	eventManager.fire('classroomMonitorDisplayComplete');
              	    $('#connecting').hide();
          	    };
          	    WISE.groupchat.join();       	    
          	};
      	    
      	    Sail.Strophe.connect();
        },
        onTeacherShareWithClass:function(ev,sev) {
            if(WISE.isEventFromTeacher(sev)) {            
            	$("#studentScreenStatus").html("paused");
            	$("#studentScreenStatus").css("color","red");
            }
        },
        onUnPause:function(ev,sev) {
        	if(WISE.isEventFromTeacher(sev)) {
        		$("#studentScreenStatus").html("unpaused");
            	$("#studentScreenStatus").css("color","green");
        	}
        },
        onStudentToTeacherMsg:function(ev,sev) {
        	if(WISE.isEventFromStudent(sev)) {
        		var message = sev.payload;
        		
        		var workgroupId = message.workgroupId;
        		var messageType = message.type;
        		
        		if(messageType == "studentProgress") {
        			var stepNumberAndTitle = message.stepNumberAndTitle;
        			var projectCompletionPercentage = message.projectCompletionPercentage;
        			$('#teamCurrentStep_' + workgroupId).html(stepNumberAndTitle);
        			$('#teamPercentProjectCompleted_' + workgroupId).html(projectCompletionPercentage + "%" + "<hr size=3 color='black' width='" + projectCompletionPercentage + "%' align='left' noshade>");
        			$("#chooseTeamToGradeTable").trigger('update');  // tell tablesorter to re-read the data
        			var status = message.status;
        			if (status != null) {
        				//$('#teamStatus_' + workgroupId).html(status.type);
        				
        				
        				if(status.maxAlertLevel >= 0 && status.maxAlertLevel < 2) {
        					$('#teamStatus_' + workgroupId).html("<img src='/vlewrapper/vle/images/check16.gif' />");
        				} else if(status.maxAlertLevel >= 2 && status.maxAlertLevel < 4) { 
        					$('#teamStatus_' + workgroupId).html("warning");
        				} else if(status.maxAlertLevel >= 4) {
        					$('#teamStatus_' + workgroupId).html("<img src='/vlewrapper/vle/images/warn16.gif' />");
        				}
        				
    					$('#teamStatus_' + workgroupId).unbind('click');
    					$('#teamStatus_' + workgroupId).click(function() {
        					var readableMsg = "";
        					for (var i=0; i<status.alertables.length; i++) {
        						var alertable = status.alertables[i];
        						if (alertable != null && alertable.readableText != null) {
        							readableMsg += alertable.stepNumberAndTitle + " (" + alertable.nodeType + ")<br>";
        							readableMsg += alertable.readableText + "<br><br>";
        						}
        					}
    						//alert(readableMsg);
        					$('#teamStatusDialog').html(readableMsg);
        					$('#teamStatusDialog').dialog('open');
    					});
        			}
        		} else if(messageType == "NodeVisit") {
        			/*
        			 * the teacher has received work from the student so we will
        			 * display it in the student work stream
        			 */
        			var workgroupId = message.workgroupId;
        			var workgroupName = message.workgroupName;
        			var stepNumberAndTitle = message.stepNumberAndTitle;
        			var nodeVisit = NODE_VISIT.prototype.parseDataJSONObj(message.nodeVisit);
        			var nodeId = nodeVisit.nodeId;
        			var node = view.project.getNodeById(nodeId);
        			var divId = "realTimeStudentWork_" + nodeVisit.id + "_" + workgroupId;

        			/*
        			 * add this nodevisit object to local tally so we can access it
        			 * later when the teacher wants to share it with the class
        			 */
        			if (typeof realTimeNodeVisitIdToNodeVisit == "undefined") {
        				realTimeNodeVisitIdToNodeVisit = {};
        			}
        			realTimeNodeVisitIdToNodeVisit[nodeVisit.id] = {
        					"workgroupId":workgroupId,
        					"workgroupName":workgroupName,
        					"stepNumberAndTitle":stepNumberAndTitle,
        					"nodeId":nodeId,
        					"nodeVisit":nodeVisit
        			};
        			
        			var selectedWorkgroupIdValue = $('#realTimeMonitorSelectWorkgroupIdDropDown :selected').val();
        			var selectedNodeIdValue = $('#realTimeMonitorSelectStepDropDown :selected').val();
        			
        			var styleDisplay = 'style="display:none"';
        			
        			/*
        			 * determine if we need to display or hide this student work based
        			 * on the current drop down filters
        			 */
        			if (selectedWorkgroupIdValue == "all" && selectedNodeIdValue == "all") {
        				styleDisplay = '';
        			} else if (selectedNodeIdValue != "all" && selectedWorkgroupIdValue != "all") {
        				if(workgroupId == selectedWorkgroupIdValue && nodeId == selectedNodeIdValue) {
            				styleDisplay = '';
            			}
        			} else if (selectedWorkgroupIdValue != "all") {
        				if(workgroupId == selectedWorkgroupIdValue) {
        					styleDisplay = '';
        				}
        			} else if (selectedNodeIdValue != "all") {
        				if(nodeId == selectedNodeIdValue) {
        					styleDisplay = '';
        				}
        			} else {
        				//shouldn't reach here
        				console.log("shouldn't reach here");
        			}
        			
        			$("#realTimeMonitorStudentWorkDisplayDiv").append('<div id="' + divId + '" class="realTimeStudentWork workgroupId_' + workgroupId + ' nodeId_' + nodeId + '" ' + styleDisplay + '></div>');
        			
        			try {
        				//render the student grading view for the student work
        				node.renderGradingView(divId,nodeVisit,null,workgroupId);      
            			var currentTimestamp = new Date();
       
            			var studentWorkInfoDiv = "<div id='studentWorkInfoDiv_"+workgroupId+"' class='studentWorkInfoDiv nodeVisitId_"+nodeVisit.id+"'>"+workgroupName+" "+
            				stepNumberAndTitle+ "(" + currentTimestamp + ")<a class='shareWithClass' onclick='eventManager.fire(\"realTimeMonitorShareWithClassClicked\", [\"NodeVisit\","+nodeVisit.id+"])'>Share with class</a></div>";
        				$("#"+divId).prepend(studentWorkInfoDiv);
        				
        				if (node.type == "MultipleChoiceNode") {
            				// if the step for this work can be plotted in a histogram, add/update nodeIdToWork
        					if (typeof nodeIdToWork == "undefined") {
        						/*
        						 * an object that maps node id to objects that contain the work
        						 * for a specific step
        						 */
        						nodeIdToWork = {};
        					}
        					if (nodeIdToWork[nodeId] == null) {
        						nodeIdToWork[nodeId] = {};
        					}
        					if (nodeVisit.getLatestWork() && nodeVisit.getLatestWork().response.length > 0) {
        						//add this student work to the mapping
            					nodeIdToWork[nodeId][workgroupId] = nodeVisit.getLatestWork().response;        						
        					}
        					
        					var choiceToCount = {};
        					var workgroupIdToWork = nodeIdToWork[nodeId];
        					var workgroupIdsInClass = node.view.userAndClassInfo.getWorkgroupIdsInClass();
        					var mcChoices = [];
        					var mcContent = node.content.getContentJSON();
        					/* add each choice object from the content to the choices array */
        					for(var a=0;a<mcContent.assessmentItem.interaction.choices.length;a++){
        						mcChoices.push(mcContent.assessmentItem.interaction.choices[a].text);
        					}
        					
        					//loop through all the students in the class
        					for (var i=0; i<workgroupIdsInClass.length; i++) {
        						var workgroupIdInClass = workgroupIdsInClass[i];
        						
        						//get the choice the student answered
        						var workByWorkgroup = workgroupIdToWork[workgroupIdInClass];
        						
        						if (choiceToCount[workByWorkgroup] == null) {
        							choiceToCount[workByWorkgroup] = 0;
        						}
        						
        						//increment the choice
        						choiceToCount[workByWorkgroup] += 1;
        					}
        					var choicesCountArray = [];
        					var maxChoiceCountSoFar = 0;  // keep track of maximum count here
        					// now loop thru mcChoices and tally up 
        					for (var k=0; k<mcChoices.length; k++) {
        						var mcChoiceText = mcChoices[k];
        						
        						//get the total count for this choice
        						var finalCount = choiceToCount[mcChoiceText];
        						if (typeof finalCount == "undefined") {
        							finalCount = 0;
        						}
        						
        						/*
        						 * add the count for this choice so that the graphing utility
        						 * knows how many students chose this choice
        						 */
        						choicesCountArray.push(finalCount);
        						
        						if (finalCount > maxChoiceCountSoFar) {
        							/*
        							 * update the highest count for any choice to determine the
        							 * max y value
        							 */
        							maxChoiceCountSoFar = finalCount;
        						}
        					}

        					var xLabelStr = "|"+mcChoices.join("|");
      						var tallyStr = choicesCountArray.join(",");
      						
      						/*
      						 * construct googlecharts url and set realTimeMonitorGraphImg src.
      						 * e.g.
      						 * http://chart.apis.google.com/chart?chxl=0:|Oscar|Monkey|Oski|Dodo&chxr=1,0,5&chxt=x,y&chbh=a&chs=300x225&cht=bvg&chco=A2C180&chd=t:1,5,0,0&chds=0,5&chp=0&chma=|2&chtt=Student+Responses
      						 */
      						var realTimeMonitorGraphImgSrc = "http://chart.apis.google.com/chart?chxl=0:"+xLabelStr+"&chxr=1,0,"+(maxChoiceCountSoFar+1)+"&chxt=x,y&chbh=a&chs=300x225&cht=bvg&chco=A2C180&chd=t:"+tallyStr+"&chds=0,"+(maxChoiceCountSoFar+1)+"&chp=0&chma=|2&chtt=Student+Responses";
      						
      						//display the graph to the teacher
      						$("#realTimeMonitorGraphImg").attr("src",realTimeMonitorGraphImgSrc);
        				} else if (node.type == "OpenResponseNode" || node.type == "NoteNode") {
        					// allow teacher to sort incoming student work using drag and drop
        					var realTimeStudentWork =  nodeVisit.getLatestWork().response.toString();
        					var draggableStudentWorkSpan = $("<span>").html(realTimeStudentWork).css("border","1px solid").css("padding","3px");
        					$("#realTimeMonitorDraggableCanvasDiv").append(draggableStudentWorkSpan);
        					draggableStudentWorkSpan.draggable({ containment: "#realTimeMonitorDraggableCanvasDiv"});
        				}
        			} catch(e) {
        				console.log('exception thrown in realtime monitor' + e);
        			}
        			
        			$("#realTimeMonitorStudentWorkDisplayDiv").scrollTop(1000000);
        		}
        	}
        },

        onStudentToChatRoomMsg:function(ev,sev) {
        	if(WISE.isEventFromStudent(sev)) {
        		//an object containing the fromWorkgroupName and message
        		var data = sev.payload;
        		
        		var fromWorkgroupName = data.fromWorkgroupName;
        		var message = data.data;
        		
        		//display the message
        		$('#chatRoomTextDisplay').append(fromWorkgroupName + ": " + message + "<br>");
        		
        		//scroll the div to the bottom
        		$('#chatRoomTextDisplay').scrollTop(1000000);
        	}
        },
        onTeacherToChatRoomMsg:function(ev,sev) {
        	if(WISE.isEventFromStudent(sev)) {
        		//an object containing the fromWorkgroupName and message
        		var data = sev.payload;
        		
        		var fromWorkgroupName = data.fromWorkgroupName;
        		var message = data.data;
        		
        		//display the message
        		$('#chatRoomTextDisplay').append("<div style='font-weight:bold'>"+fromWorkgroupName + ": " + message + "</div>");
        		
        		//scroll the div to the bottom
        		$('#chatRoomTextDisplay').scrollTop(1000000);
        	}
        } 
        
    }
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/xmpp/js/teacher.js');
};