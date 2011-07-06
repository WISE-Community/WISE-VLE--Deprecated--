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
        console.log("Initializing WISE...")
        
        // get runId to use for chatroom
        WISE.groupchatRoom = view.config.getConfigParam("runId") + WISE.groupchatRoomBase;
        
        WISE.wiseXMPPAuthenticateUrl = view.config.getConfigParam("wiseXMPPAuthenticateUrl") + "&workgroupId=" + view.userAndClassInfo.getWorkgroupId();
        
        // create custom event handlers for all WISE 'on' methods
        Sail.autobindEvents(WISE, {
            pre: function() {console.debug(arguments[0].type+'!',arguments)}
        })

        WISE.authenticate();
        
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
    
    disconnect: function() {
    	Sail.Strophe.disconnect();
    },
   
    authenticate: function() {
    	// authenticate with WISE, 
    	// will create an account if necessary
    	// will get back a token for authenticating with XMPP.
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
            'unPause':'unPause'
        },

        // local Javascript event handlers
        onAuthenticated: function() {
        	// callback for when user is authenticated with the portal. user's xmpp username/password should be set in WISE.xmppUsername and WISE.xmppPassword.
            Sail.Strophe.bosh_url = 'http://localhost/http-bind/';
            Sail.Strophe.jid =  WISE.xmppUsername + '@' + WISE.xmppDomain;
          	Sail.Strophe.password = WISE.xmppPassword;  

            Sail.Strophe.onConnectSuccess = function() {
          	    sailHandler = Sail.generateSailEventHandler(WISE);
          	    Sail.Strophe.addHandler(sailHandler, null, null, 'chat');
      	    
          	    WISE.groupchat = new Sail.Strophe.Groupchat(WISE.groupchatRoom);
          	    WISE.groupchat.addHandler(sailHandler);
          	    WISE.groupchat.join();
          	};
      	    
          	// connect to XMPP server
      	    Sail.Strophe.connect();
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
        }
    }
};

//$(document).ready(WISE.init)

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/xmpp/js/student.js');
}