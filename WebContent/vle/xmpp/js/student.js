WISE = {
    // config
    
    rollcallURL: 'http://localhost:3000',
    xmppDomain: 'localhost',
    groupchatRoom: 's3@conference.localhost',
    
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
        // create custom event handlers for all WISE 'on' methods
        Sail.autobindEvents(WISE, {
            pre: function() {console.debug(arguments[0].type+'!',arguments)}
        })
        
        $('#play').click(function() {$(WISE).trigger('choseToPlay')})
        $('#watch').click(function() {$(WISE).trigger('choseToWatch')})
        
        $('#guess-form').submit(function() {WISE.submitGuess(); return false})
        
        $('#set-word-form').submit(function () {WISE.setNewWord(); return false})

        $('#connecting').show()
        
        WISE.authenticate()
        
        return this;
    },
   
    isEventFromTeacher: function(sev) {
    	var sender = sev.from.split('/')[1].split('@')[0];
    	var teacherWorkgroupId = view.getUserAndClassInfo().getTeacherWorkgroupId();
        return sender == teacherWorkgroupId;
    },    
    
    sendStudentToTeacherMessage: function(msg) {
        sev = new Sail.Event('studentToTeacherMsg', msg);        
        if (WISE.groupchat) {
        	WISE.groupchat.sendEvent(sev);    	
        }
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
    
    authenticate: function() {
    	/*
        WISE.rollcall = new Sail.Rollcall.Client(WISE.rollcallURL)
        WISE.token = WISE.rollcall.getCurrentToken()

        if (!WISE.token) {
            $(WISE).trigger('authenticating')
            WISE.rollcall.redirectToLogin()
            return
        }
        
        WISE.rollcall.fetchSessionForToken(WISE.token, function(data) {
            WISE.session = data.session
            $(WISE).trigger('authenticated')
        })
        */
        $(WISE).trigger('authenticated');
    },
    
    
    events: {
        // mapping of Sail events to local Javascript events
	
        sail: {
	    	'pause':'pause',
            'unPause':'unPause'
        },

        // local Javascript event handlers
        onAuthenticated: function() {
        	
            //session = WISE.session;
            //console.log("Authenticated as: ", session.account.login, session.account.encrypted_password)
        
            //$('#username').text(session.account.login)
        
            Sail.Strophe.bosh_url = 'http://localhost/http-bind/';
         	//Sail.Strophe.jid = view.userAndClassInfo.getWorkgroupId() + '@' + WISE.xmppDomain;
          	//Sail.Strophe.password = "wise";  //view.userAndClassInfo.getWorkgroupId();
      	
         	Sail.Strophe.jid =  view.userAndClassInfo.getWorkgroupId() + '@' + WISE.xmppDomain;
          	Sail.Strophe.password =  view.userAndClassInfo.getWorkgroupId();  //view.userAndClassInfo.getWorkgroupId();

            Sail.Strophe.onConnectSuccess = function() {
          	    sailHandler = Sail.generateSailEventHandler(WISE);
          	    Sail.Strophe.addHandler(sailHandler, null, null, 'chat');
      	    
          	    WISE.groupchat = Sail.Strophe.joinGroupchat(WISE.groupchatRoom);
          	    WISE.groupchat.addHandler(sailHandler);
      	    
          	    $('#connecting').hide();
          	    $(WISE).trigger('joined');
          	};
      	    
      	    Sail.Strophe.connect()

        	/*
            session = WISE.session;
            console.log("Authenticated as: ", session.account.login, session.account.encrypted_password)
        
            $('#username').text(session.account.login)
        
            Sail.Strophe.bosh_url = 'http://localhost/http-bind/'
         	Sail.Strophe.jid = session.account.login + '@' + WISE.xmppDomain
          	Sail.Strophe.password = session.account.encrypted_password
      	
          	Sail.Strophe.onConnectSuccess = function() {
          	    sailHandler = Sail.generateSailEventHandler(WISE)
          	    Sail.Strophe.addHandler(sailHandler, null, null, 'chat')
      	    
          	    WISE.groupchat = Sail.Strophe.joinGroupchat(WISE.groupchatRoom)
          	    WISE.groupchat.addHandler(sailHandler)
      	    
          	    $('#connecting').hide()
          	    $(WISE).trigger('joined')
          	}
      	    
      	    Sail.Strophe.connect()
      	    */
        },
        onPause: function(ev,sev) {            
            if(WISE.isEventFromTeacher(sev)) {            
            	eventManager.fire('lockScreenEvent', sev.payload.message);
            }
        },
        onUnPause:function(ev,sev) {
        	if(WISE.isEventFromTeacher(sev)) {
        		eventManager.fire('unlockScreenEvent');
        	}
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
	eventManager.fire('scriptLoaded', 'vle/xmpp/js/student.js');
}