Jabberdy = {
    // config
    
    rollcallURL: 'http://localhost:3000',
    xmppDomain: 'localhost',
    groupchatRoom: 's3@conference.localhost',
    
    
    // private global vars
    
    ui: Sail.UI,
    groupchat: null,
    session: null,
    justWatching: false,
    
    
    // initialization (called in $(document).ready() at the bottom of this file)
    
    init: function() {
        console.log("Initializing Jabberdy...")
        
        // create custom event handlers for all Jabberdy 'on' methods
        Sail.autobindEvents(Jabberdy, {
            pre: function() {console.debug(arguments[0].type+'!',arguments)}
        })
        
        $('#play').click(function() {$(Jabberdy).trigger('choseToPlay')})
        $('#watch').click(function() {$(Jabberdy).trigger('choseToWatch')})
        
        $('#guess-form').submit(function() {Jabberdy.submitGuess(); return false})
        
        $('#set-word-form').submit(function () {Jabberdy.setNewWord(); return false})

        $('#pause-button').click(function() {Jabberdy.doPause();  return false})

        $('#unPause-button').click(function() {Jabberdy.doUnPause();  return false})
        
        $('#connecting').show()
        
        Jabberdy.authenticate()
    },
    
    askForNewWord: function() {
        $(Jabberdy).trigger('enteringNewWord')
        Jabberdy.ui.showDialog('#set-word-panel')
        
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
        Jabberdy.ui.dismissDialog('#set-word-panel')
        $('#winner').hide()
        $('#definition').show()
        $('#guess').removeClass('in-progress')
        
        $('#guess').attr('disabled', false) // just in case...
        
        if (!Jabberdy.justWatching && !$('#guess-panel').is(':visible')) {
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
        Jabberdy.groupchat.sendEvent(sev)
        $(Jabberdy).trigger('submittedGuess')
    },
    
    setNewWord: function() {
        $('#set-word').addClass('in-progress')
        word = $('#set-word').val()
        sev = new Sail.Event('set_word', {word: word})
        Jabberdy.groupchat.sendEvent(sev)
        $(Jabberdy).trigger('submittedNewWord')
    },
    
    doPause: function() {
        sev = new Sail.Event('pause')
        Jabberdy.groupchat.sendEvent(sev)
    },

    doUnPause: function() {
        sev = new Sail.Event('unPause')
        Jabberdy.groupchat.sendEvent(sev)
    },

    authenticate: function() {
        Jabberdy.rollcall = new Sail.Rollcall.Client(Jabberdy.rollcallURL)
        Jabberdy.token = Jabberdy.rollcall.getCurrentToken()

        if (!Jabberdy.token) {
            $(Jabberdy).trigger('authenticating')
            Jabberdy.rollcall.redirectToLogin()
            return
        }
        
        Jabberdy.rollcall.fetchSessionForToken(Jabberdy.token, function(data) {
            Jabberdy.session = data.session
            $(Jabberdy).trigger('authenticated')
        })
    },
    
    
    events: {
        // mapping of Sail events to local Javascript events
	/*
        sail: {
            'guess': 'gotGuess',
            'set_definition': 'gotNewDefinition',
            'wrong': 'gotWrongGuess',
            'bad_word': 'gotBadWord',
            'win': 'gotWinner'
        },
        */
	
        sail: {
	    'pause':'pause',
            'unPause':'unPause'
        },

        // local Javascript event handlers
        onAuthenticated: function() {
            session = Jabberdy.session
            console.log("Authenticated as: ", session.account.login, session.account.encrypted_password)
        
            $('#username').text(session.account.login)
        
            Sail.Strophe.bosh_url = '/http-bind/'
         	Sail.Strophe.jid = session.account.login + '@' + Jabberdy.xmppDomain
          	Sail.Strophe.password = session.account.encrypted_password
      	
          	Sail.Strophe.onConnectSuccess = function() {
          	    sailHandler = Sail.generateSailEventHandler(Jabberdy)
          	    Sail.Strophe.addHandler(sailHandler, null, null, 'chat')
      	    
          	    Jabberdy.groupchat = Sail.Strophe.joinGroupchat(Jabberdy.groupchatRoom)
          	    Jabberdy.groupchat.addHandler(sailHandler)
      	    
          	    $('#connecting').hide()
          	    $(Jabberdy).trigger('joined')
          	}
      	    
      	    Sail.Strophe.connect()
        },
        onPause: function() {
	    $("#status").html("paused");
        },
        onUnPause:function() {
	    $("#status").html("unpaused");
        },
        onJoined: function() {
            $(Jabberdy).trigger('choosingWhetherToWatchOrPlay')
            Jabberdy.ui.showDialog('#join-dialog')
        },
    
        onChoseToPlay: function() {
            Jabberdy.justWatching = false
            Jabberdy.askForNewWord()
        },
    
        onChoseToWatch: function() {
           Jabberdy.justWatching = true 
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
            Jabberdy.switchToGuessingMode()
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
            if (sev.payload.winner == Jabberdy.groupchat.jid()) {
                // you are the winner!
                Jabberdy.askForNewWord()
            }
        },
    },
    
    
}

$(document).ready(Jabberdy.init)

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/xmpp/js/teacher.js');
}