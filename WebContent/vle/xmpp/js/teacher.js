WISE = {
    // config
	wiseXMPPAuthenticateUrl: '',
    rollcallURL: 'http://localhost:3000',
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
        console.log("Initializing WISE...")
        
        // get runId to use for chatroom
        WISE.groupchatRoom = view.config.getConfigParam("runId") + WISE.groupchatRoomBase;
        console.log("chatroom:" + WISE.groupchatRoom);

        WISE.wiseXMPPAuthenticateUrl = view.config.getConfigParam("wiseXMPPAuthenticateUrl") + "&workgroupId=" + view.userAndClassInfo.getWorkgroupId();
        
        // create custom event handlers for all WISE 'on' methods
        Sail.autobindEvents(WISE, {
            pre: function() {console.debug(arguments[0].type+'!',arguments)}
        })
        
        $('#play').click(function() {$(WISE).trigger('choseToPlay')})
        $('#watch').click(function() {$(WISE).trigger('choseToWatch')})
        
        $('#guess-form').submit(function() {WISE.submitGuess(); return false})
        
        $('#set-word-form').submit(function () {WISE.setNewWord(); return false})

        $('#pause-button').click(function() {WISE.doPause();  return false})

        $('#unPause-button').click(function() {WISE.doUnPause();  return false})
        
        $('#connecting').show()
        
        WISE.authenticate()
        
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
    
    askForNewWord: function() {
        $(WISE).trigger('enteringNewWord')
        WISE.ui.showDialog('#set-word-panel')
        
        $('#set-word').attr('disabled', false)
        $('#guess-panel').hide()
        $('#set-word-panel').show('puff',
            { easing: 'swing' },
            'slow',
            function() { $('#set-word').val('').focus() }
        )
    },
    
    switchToGuessingMode: function() {
        $('.guess-baloon').remove()
        WISE.ui.dismissDialog('#set-word-panel')
        $('#winner').hide()
        $('#definition').show()
        $('#guess').removeClass('in-progress')
        
        $('#guess').attr('disabled', false) // just in case...
        
        if (!WISE.justWatching && !$('#guess-panel').is(':visible')) {
            $('#guess-panel').show('slide', 
                { easing: 'easeOutBounce',  direction: 'down'}, 
                'slow',
                function() {$('#guess').val('').focus()}
            )
        }
    },
    
    submitGuess: function() {
        $('#guess').addClass('in-progress')
        word = $('#guess').val()
        sev = new Sail.Event('guess', {word: word})
        WISE.groupchat.sendEvent(sev)
        $(WISE).trigger('submittedGuess')
    },
    
    setNewWord: function() {
        $('#set-word').addClass('in-progress')
        word = $('#set-word').val()
        sev = new Sail.Event('set_word', {word: word})
        WISE.groupchat.sendEvent(sev)
        $(WISE).trigger('submittedNewWord')
    },
    
    doPause: function() {
    	message = $('#pause-message').val();
        sev = new Sail.Event('pause', {message:message});
        WISE.groupchat.sendEvent(sev);
    },

    doUnPause: function() {
        sev = new Sail.Event('unPause')
        WISE.groupchat.sendEvent(sev)
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
    
    
    events: {
        // mapping of Sail events to local Javascript events
	
        sail: {
	    	'pause':'pause',
            'unPause':'unPause',
            'studentToTeacherMsg':'studentToTeacherMsg',
            'joinedGroupChat':'joinedGroupChat'
        },

        // local Javascript event handlers
        onAuthenticated: function() {
            Sail.Strophe.bosh_url = 'http://localhost/http-bind/';
         	Sail.Strophe.jid = WISE.xmppUsername + '@' + WISE.xmppDomain;
            Sail.Strophe.password = WISE.xmppPassword;
            
            Sail.Strophe.onConnectSuccess = function() {
          	    sailHandler = Sail.generateSailEventHandler(WISE);
          	    Sail.Strophe.addHandler(sailHandler, null, null, 'groupchat');
      	    
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
                	console.log('onSelfJoinedGroupChat');
                	eventManager.fire('classroomMonitorDisplayComplete');
              	    $('#connecting').hide();
          	    };
          	    WISE.groupchat.join();       	    
          	};
      	    
      	    Sail.Strophe.connect()
        },
        onPause: function(ev,sev) {            
            if(WISE.isEventFromTeacher(sev)) {            
            	$("#status").html("paused");
            }
        },
        onUnPause:function(ev,sev) {
        	if(WISE.isEventFromTeacher(sev)) {
        		$("#status").html("unpaused");
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
        		}
        	}
        },
        onJoinedGroupChat:function() {
        	console.log('onJoinedGroupChat');
        },
        onJoined: function() {
            $(WISE).trigger('choosingWhetherToWatchOrPlay')
            WISE.ui.showDialog('#join-dialog')
        },
    
        onChoseToPlay: function() {
            WISE.justWatching = false
            WISE.askForNewWord()
        },
    
        onChoseToWatch: function() {
           WISE.justWatching = true 
        },
    
        onSubmittedGuess: function() {
            $('#guess').attr('disabled', true)
        },
    
        onSubmittedNewWord: function() {
            $('#set-word').attr('disabled', true)
            $('#winner').hide()
        },
    
        onGotNewDefinition: function(ev, sev) {
            definition = sev.payload.definition
            $('#set-word').removeClass('in-progress')
            $('#definition').text(definition)
            WISE.switchToGuessingMode()
        },
    
        onGotWrongGuess: function(ev, sev) {
            definition = sev.payload.definition
            $('#guess').removeClass('in-progress')
            $('#guess-container').effect('shake', {duration: 50, distance: 5}, function() {
                $('#guess').val('').attr('disabled', false).focus()
            })
        },
    
        onGotBadWord: function(ev, sev) {
            message = sev.payload.message
            $('#set-word').removeClass('in-progress')
            alert(message)
            $('#set-word').val('').attr('disabled', false).focus()
        },
    
        onGotGuess: function(ev, sev) {
            word = sev.payload.word
            player = sev.from.split('/')[1].split('@')[0]
            baloon = $("<div class='guess-baloon'><div class='word'>"+word+"</div><div class='player'>"+player+"</div></div>")
            baloon.hide()
            field_height = $("#field").height()
            field_width = $("#field").width()
            baloon.css('left', (Math.random() * (field_width - 100) + 'px'))
            baloon.css('top', (Math.random() * (field_height - 100) + 'px'))
            $("#field").append(baloon)
            baloon.show('puff', 'fast')
            baloon.draggable()
        },
    
        onGotWinner: function(ev, sev) {
            winner = sev.payload.winner.split('/')[1].split('@')[0]
            word = sev.payload.word
            $('.guess-baloon').remove()
            $('#guess-panel').hide('slide',
                        {easing: 'swing', direction: 'down'},
                        'fast')
            $('#definition').hide('puff', 'fast')
            $('#winning-word').text(word)
            $('#winner-username').text(winner)
            $('#winner').show('pulsate', 'normal')//'drop', {easing: 'easyOutBounce'}, 'fast')
            if (sev.payload.winner == WISE.groupchat.jid()) {
                // you are the winner!
                WISE.askForNewWord()
            }
        },
    },
    
    
}

//$(document).ready(WISE.init)


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/xmpp/js/teacher.js');
}