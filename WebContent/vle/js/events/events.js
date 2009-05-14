/**
 * A wrapper to YUI for managing custom events
 */
function EventManager(){
	this.eventObs = [];
	this.eventNames = [];
	this.eventSubscribers = [];
	this.loadingManager;
};

/**
 * Given an object (obj), the name of new event (event) and
 * optional arguments (args), creates a new custom event. The
 * given object will now have the necessary functions (subscribe,
 * fire, unsubscribe) to handle events.
 */
EventManager.prototype.addEvent = function(obj, event, args){
	var newEvent = new YAHOO.util.CustomEvent(event, obj);

	this.eventObs.push(newEvent);
	this.eventNames.push(event);
};

/**
 * Given an event name (event) and a function (fun) and a
 * custom object (co), adds that function as a listener to
 * the associated event, passing in the custom object
 */
EventManager.prototype.subscribe = function(event, fun, co){
	var index = this.eventNames.indexOf(event);
	var obj = this.eventObs[index];
	
	if(obj){
		obj.subscribe(fun, co);
	} else {
		alert('no event with name: ' + event + '  found');
	};
	
	var subs = this.eventSubscribers[index];
	if(subs){
		subs.push(fun);
	} else {
		this.eventSubscribers[index] = [];
		this.eventSubscribers[index].push(fun);
	};
};

/**
 * Fires the event of the given name (event) passing
 * in the Optional arguments
 */
EventManager.prototype.fire = function(event, args){
	var index = this.eventNames.indexOf(event);
	if(index==-1){
		alert('make sure the event you want to fire is named: ' + event + ' - or that the event has been created. Unable to find this event.');
	} else {
		this.eventObs[index].fire(args);
	};
};

/**
 * Given a subscribed function (fun), removes it
 * as a listener
 */
EventManager.prototype.unsubscribe = function(fun){
	for(var a=0;a<this.eventSubscribers.length;a++){
		for(var b=0;b<this.eventSubscribers[a].length;b++){
			if(this.eventSubscribers[a][b]==fun){
				this.eventSubscribers[a].splice(b,1);
				this.eventObs[a].unsubscribe(fun);
				return;
			};
		};	
	};
};


/**
 * Given a list of lists, creates and initializes a new LoadingManager
 */
EventManager.prototype.inititializeLoading = function(args){
	this.loadingManager = new LoadingManager(this);
	this.loadingManager.initialize(args);
};


/**
 * Loading Manager registers the specified events and
 * displays a loading screen when the start event is fired
 * and removes the screen when the end event is fired. It
 * displays which events are currently being loaded
 * while the loading screen is up
 */
function LoadingManager(em){
	this.loading;
	this.loads = [];
	this.unloads = [];
	this.messages = [];
	this.active = [];
	this.eventManager = em;
	
	this.initializeOverlay();
};

/**
 * Initializes the overlay that is to be used for the
 * loading messages. The html page must have a div element
 * with id=loading as well as 3 child div elements with ids = 
 * hd, bd, ft respectively
 */
LoadingManager.prototype.initializeOverlay = function(){
	this.loading = new YAHOO.widget.Panel('loading', {width:'300px', fixedcenter:true, close:false, draggable:false, modal:true, visible:false});
	this.loading.center();
	this.loading.setBody("<img src='./vle/images/loading.gif'/>");
	this.loading.render();
};

/**
 * Takes in args, which must be a list of lists. Each of the
 * internal lists must contain 3 arguments: the load event,
 * the unload event, and the message to display while the event
 * is loading.
 */
LoadingManager.prototype.initialize = function(args){
	var doLoad = function(type, args, obj){
		if(obj.loads.indexOf(type)==-1){
			alert('subscribed event ' + type + ' not found, unable to do load.');
		} else {
			obj.active.push(type);
			obj.changeLoading();
		};
	};
	
	var doUnload = function(type, args, obj){
		if(obj.unloads.indexOf(type)==-1){
			alert('subscribed event ' + type + ' not found, unable to do unload.');
		} else {
			obj.active.splice(obj.active.indexOf(obj.loads[obj.unloads.indexOf(type)]), 1);
			obj.changeLoading();
		};
	};
	
	for(var i=0;i<args.length;i++){
		this.loads.push(args[i][0]);
		this.unloads.push(args[i][1]);
		this.messages.push(args[i][2]);
		this.eventManager.subscribe(args[i][0], doLoad, this);
		this.eventManager.subscribe(args[i][1], doUnload, this);
	};
};

/**
 * changeLoading is called when either a start or end event
 * that it initialized has been fired. It determines which
 * event and whether it is beginning or ending and displays
 * or removes the loading screen and displays the appropriate
 * message
 */ 
LoadingManager.prototype.changeLoading = function(){
	if(this.active.length>0){
		var text = 'Loading: ';
		
		for(var h=0;h<this.active.length;h++){
			text += this.messages[this.loads.indexOf(this.active[h])];
			if(h!=this.active.length-1){
				text += ' & ';
			};
		};
		
		this.loading.setHeader(text);
		this.loading.show();
	} else {
		this.loading.setHeader('');
		this.loading.hide();
	};
};