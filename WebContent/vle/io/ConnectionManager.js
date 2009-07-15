/**
 * ConnectionManager manages and prioritizes GET and POST requests
 */
function ConnectionManager(em) {
	this.em = em;
	this.MAX = 5;
	this.queue = [];
	this.running = 0;
	this.counter = 0;
};

/**
 * Creates a connection object based on type, queues and starts a request depending
 * on how many are in queue.
 * 
 * @param type - POST or GET
 * @param priority - the lower the number the sooner the request gets started
 * @param url - the url
 * @param cArgs - the connection arguments, generally, the parameters and values in a url request
 * @param handler - success handler function which takes 3 params: Text, xmlDoc and args (the hArgs gets passed in)
 * 		run when connectionManager receives a successful response from server.
 * @param hArgs - args that are needed by the success and/or failure handler
 * @param fHandler - failure handler function with takes 2 params: o (the yui response object), and args (the
 * 		hArgs that gets passed in
 * @return
 */
ConnectionManager.prototype.request = function(type, priority, url, cArgs, handler, hArgs, fHandler){

	var connection;
	if(type=='GET'){
		connection = new GetConnection(priority, url, cArgs, handler, hArgs, this.em, fHandler);
	} else if(type=='POST'){
		connection = new PostConnection(priority, url, cArgs, handler, hArgs, this.em, fHandler);
	} else {
		alert('unknown connection type: ' + type + '\nExiting...');
		return;
	};
	
	this.queue.push(connection);
	this.launchNext();
};

/**
 * Sorts the queue according to priority and if the number of
 * requests does not exceed this.MAX, launches the next request
 */
ConnectionManager.prototype.launchNext = function(){
	if(this.queue.length>0){
		if(this.running<this.MAX){
			this.queue.sort(this.orderByPriority);
			var connection = this.queue.shift();
			
			var endName = this.generateEventName();
			var launchNextRequest = function(type, args, obj){obj.running --; obj.launchNext();};
			this.em.addEvent(this, endName);
			this.em.subscribe(endName, launchNextRequest, this);
			
			this.running ++;
			connection.startRequest(endName);
		};
	};
};

/**
 * Function used by array.sort to order by priority
 */
ConnectionManager.prototype.orderByPriority = function(a, b){
	if(a.priority < b.priority){ return -1};
	if(a.priority > b.priority){ return 1};
	if(a.priority == b.priority) { return 0};
};

/**
 * Generates a unique event name
 */
ConnectionManager.prototype.generateEventName = function(){
	while(true){
		var name = 'connectionEnded' + this.counter;
		if(!this.em.isEvent(name)){
			return name;
		};
		this.counter ++;
	};
};

/**
 * A Connection object encapsulates all of the necessary variables
 * to make an async request to an url
 */
function Connection(priority, url, cArgs, handler, hArgs, em){
	this.em = em;
};

/**
 * Launches the request that this connection represents
 */
Connection.prototype.startRequest = function(eventName){
	var en = eventName;
	
	var callback = {
		success: function(o){
			this.em.fire(en);
			if (o.responseText && !o.responseXML) {
				o.responseXML = loadXMLString(o.responseText);
			}
			this.handler(o.responseText, o.responseXML, this.hArgs);
		},
		failure: function(o){
			this.em.fire(en);
			if(this.fHandler){
				this.fHandler(o, this.hArgs);
			} else {
				var msg = 'Connection request failed: transactionId=' + o.tId + '  TEXT=' + o.statusText;
				if(notificationManager){
					notificationManager.notify(msg, 2);
				} else {
					alert(msg);
				};
			};
		},
		scope:this
	};
	
	YAHOO.util.Connect.asyncRequest(this.type, this.url, callback, this.params);
};

/**
 * a Child of Connection, a GetConnection Object represents a GET
 * async request
 */
GetConnection.prototype = new Connection();
GetConnection.prototype.constructor = GetConnection;
GetConnection.prototype.parent = Connection.prototype;
function GetConnection(priority, url, cArgs, handler, hArgs, em, fHandler){
	this.type = 'GET';
	this.priority = priority;
	this.em = em;
	this.url = url;
	this.cArgs = cArgs,
	this.handler = handler;
	this.hArgs = hArgs;
	this.fHandler = fHandler;
	this.params = null;
	this.parseConnectionArgs();
};

/**
 * parses the connection arguments and appends them to the URL
 */
GetConnection.prototype.parseConnectionArgs = function(){
	var first = true;
	if (this.url.indexOf("?") > -1) {
		first = false;
	}
	if(this.cArgs){
		for(var p in this.cArgs){
			if(first){
				first = false;
				this.url += '?'
			} else {
				this.url += '&'
			};
			this.url += p + '=' + this.cArgs[p];
		};
	};
};

/**
 * A child of Connection, a PostConnection object represents
 * an async POST request
 */
PostConnection.prototype = new Connection();
PostConnection.prototype.constructor = PostConnection;
PostConnection.prototype.parent = Connection.prototype;
function PostConnection(priority, url, cArgs, handler, hArgs, em, fHandler){
	this.type = 'POST';
	this.priority = priority;
	this.em = em;
	this.url = url;
	this.cArgs = cArgs,
	this.handler = handler;
	this.hArgs = hArgs;
	this.fHandler = fHandler;
	this.params = null;
	this.parseConnectionArgs();
};

/**
 * parses and sets the necessary parameters for a POST request
 */
PostConnection.prototype.parseConnectionArgs = function(){
	var first = true;
	if(this.cArgs){
		this.params = '';
		for(var p in this.cArgs){
			if(first){
				first = false;
			} else {
				this.params += '&';
			};
			this.params += p + '=' + this.cArgs[p];
		};
	};
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/io/ConnectionManager.js");