function ConnectionManager(em) {
	this.em = em;
	this.MAX = 5;
	this.queue = [];
	this.running = 0;
	this.counter = 0;
};

ConnectionManager.prototype.request = function(type, priority, url, cArgs, handler, hArgs){

	var connection;
	if(type=='GET'){
		connection = new GetConnection(priority, url, cArgs, handler, hArgs, this.em);
	} else if(type=='POST'){
		connection = new PostConnection(priority, url, cArgs, handler, hArgs, this.em);
	} else {
		alert('unknown connection type: ' + type + '\nExiting...');
		return;
	};
	
	this.queue.push(connection);
	this.launchNext();
};

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

ConnectionManager.prototype.orderByPriority = function(a, b){
	if(a.priority < b.priority){ return -1};
	if(a.priority > b.priority){ return 1};
	if(a.priority == b.priority) { return 0};
};

ConnectionManager.prototype.generateEventName = function(){
	while(true){
		var name = 'connectionEnded' + this.counter;
		if(!this.em.isEvent(name)){
			return name;
		};
		this.counter ++;
	};
};

function Connection(priority, url, cArgs, handler, hArgs, em){
	this.em = em;
};

Connection.prototype.startRequest = function(eventName){
	var en = eventName;
	
	var callback = {
		success: function(o){
			this.em.fire(en);
			this.handler(o.responseText, o.responseXML, this.hArgs);
		},
		failure: function(o){alert('connection request failed, please check parameters or if server is available');},
		scope:this
	};
	
	YAHOO.util.Connect.asyncRequest(this.type, this.url, callback, this.params);
};

GetConnection.prototype = new Connection();
GetConnection.prototype.constructor = GetConnection;
GetConnection.prototype.parent = Connection.prototype;
function GetConnection(priority, url, cArgs, handler, hArgs, em){
	this.type = 'GET';
	this.priority = priority;
	this.em = em;
	this.url = url;
	this.cArgs = cArgs,
	this.handler = handler;
	this.hArgs = hArgs;
	this.params = null;
	this.parseConnectionArgs();
};

GetConnection.prototype.parseConnectionArgs = function(){
	var first = true;
	if(this.cArgs && this.cArgs.length>0){
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

PostConnection.prototype = new Connection();
PostConnection.prototype.constructor = PostConnection;
PostConnection.prototype.parent = Connection.prototype;
function PostConnection(priority, url, cArgs, handler, hArgs, em){
	this.type = 'POST';
	this.priority = priority;
	this.em = em;
	this.url = url;
	this.cArgs = cArgs,
	this.handler = handler;
	this.hArgs = hArgs;
	this.params = null;
	this.parseConnectionArgs();
};

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