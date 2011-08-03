/**
 * SessionManager manages sessions
 * Will warn the user when they are about to be kicked out. User can choose to ignore
 * the warning or renew the session.
 * Will close the vle and take user back if session does time out.
 */
function SessionManager(em, view) {
	this.em = em;
	this.view = view;

	this.sessionTimeoutInterval = 1200000;   // session timeout limit, in millieconds (20 min = 20*60*1000 = 1200000 milliseconds)  (15 min = 15*60*1000 = 900000 milliseconds) (10 min = 10*60*1000 = 600000 milliseconds)
	
	// override with config params, if specified
	if (view.config && view.config.getConfigParam("sessionTimeoutInterval")) {
		this.sessionTimeoutInterval = view.config.getConfigParam("sessionTimeoutInterval");
	}
	
	this.sessionTimeoutCheckInterval = 60000; // how often session should be checked, in milliseconds
	
	// override with config params, if specified
	if (view.config && view.config.getConfigParam("sessionTimeoutCheckInterval")) {
		this.sessionTimeoutCheckInterval = view.config.getConfigParam("sessionTimeoutCheckInterval");
	}
	this.sessionTimeoutWarning = this.sessionTimeoutInterval*.75;  // when session timeout warning should be made. 
	this.lastSuccessfulRequest = Date.parse(new Date());  // timestamp of last successful request

	setInterval('eventManager.fire("checkSession")', this.sessionTimeoutCheckInterval);  
};

/**
 * updates lastSuccessfulRequest timestamp
 */
SessionManager.prototype.maintainConnection = function(){
	this.lastSuccessfulRequest = Date.parse(new Date());
};

/**
 * Checks if the session is still valid. If it's close to the timeout limit,
 * warns the user and allows them to renew
 */
SessionManager.prototype.checkSession = function() {
	if(this.view.config.getConfigParam("mode") == "portalpreview") {
		// no session for preview
		return;
	}
	
	if(this.view.gradingType != null && this.view.gradingType == "monitor") {
		// classroom monitor should not log out indefinitely
		eventManager.fire('renewSession');
		return;
	}
	
	if (this.lastSuccessfulRequest != null) {
		if ((Date.parse(new Date()) - this.lastSuccessfulRequest) +this.sessionTimeoutCheckInterval*1.5 >= this.sessionTimeoutInterval) {
			// "+this.sessionTimeoutCheckInterval*1.5" => force logout sooner than actual sessionTimeoutInterval to avoid data loss.
			// this means that student has been idling too long and has been logged out of the session
			// so we should take them back to the homepage.
			if(notificationManager){
				notificationManager.notify("You have been inactive for too long and have been logged out. Please log back in to continue.",3);
			} else {
				alert("You have been inactive for too long and have been logged out. Please log back in to continue.");
			}
			this.view.onWindowUnload(true);
		} else if ((Date.parse(new Date()) - this.lastSuccessfulRequest) > this.sessionTimeoutWarning) {
			// if 75% of the timeout has been elapsed, warn them
			var renewSessionSubmit = function(){
				// renewSession was requested
				eventManager.fire('renewSession');
				$('#sessionMessageDiv').dialog('close');
			};
			var renewSessionClose = function(){
				// renewSession was requested
				eventManager.fire('renewSession');
			};
			$('#sessionMessageDiv').html("You have been inactive for a long time. If you do not renew your session now, you will be logged out of WISE.");
			$('#sessionMessageDiv').dialog(
					{autoOpen:true, draggable:true, modal:true, title:'Session Timeout', width:400, position:['center','top'], buttons: {'STAY LOGGED IN!':renewSessionSubmit}, close:renewSessionClose}
			);
		} else {
			// they're fine
		}
	};
	
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/session/SessionManager.js');
};