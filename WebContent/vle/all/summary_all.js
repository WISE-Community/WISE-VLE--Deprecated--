/**
 * Global helper functions
 */


function createAttribute(doc, node, type, val){
	var attribute = doc.createAttribute(type);
	attribute.nodeValue = val;
	node.setAttributeNode(attribute);
};

function createElement(doc, type, attrArgs){
	var newElement = doc.createElement(type);
	if(attrArgs!=null){
		for(var option in attrArgs){
			createAttribute(doc, newElement, option, attrArgs[option]);
		};
	};
	return newElement;
};

/**
 * returns a <br> element
 */
function createBreak(){
	return createElement(document, 'br', null);
};

/**
 * returns a space
 */
function createSpace(){
	return document.createTextNode(' ');
};

/**
 * Given a string, returns a URI encoded string.
 * 
 * @param String
 * @return String
 */
function encodeString(text){
	return encodeURIComponent(text);
};

/**
 * Returns the element(s) with the given attributeName. If the attributeValue
 * is specified, it will filter further.
 * @param attributeName
 * @param attributeValue
 * @return
 */
function getElementsByAttribute(attributeName, attributeValue, frameName) {
	notificationManager.notify('attributeName:' + attributeName + ", attributeValue:" + attributeValue, 4);
	var bodyNode = null;
	if (frameName != null) {
		notificationManager.notify('frameName:' + frameName, 4);
		bodyNode = yui.get(window.frames['ifrm'].frames[frameName].document.body);
	} else {
		bodyNode = yui.get(window.frames["ifrm"].document.body);
	}
	if (attributeValue != null) {
		var node = bodyNode.query('['+attributeName+'='+attributeValue+']');
		notificationManager.notify('audioNode:' + node, 4);
		return node;
	} else {
		var nodes = bodyNode.queryAll('['+attributeName+']');
		if (nodes != null) {
			notificationManager.notify('audioNodes.length:' + nodes.size(), 4);
			for (var i=0; i< nodes.size(); i++) {
				notificationManager.notify('audioNode textContent:' + nodes.item(i).get('textContent'), 4);
			}
		}
		return nodes;
	}
}

/**
 * returns true iff the URL returns a 200 OK message
 * @param url url to test
 * @return
 */
function checkAccessibility(url) {
	var callback = {
			success: function(o) {return true},
			failure: function(o) {return false}
	}
	var transaction = YAHOO.util.Connect.asyncRequest('HEAD', url, callback, null);
}

/**
 * Given an html string, removes all whitespace and returns that string
 * 
 * @param html String
 * @return html String without whitespace
 */
function normalizeHTML(html){
	return html.replace(/\s+/g,'');
};

/**
 * Finds and injects the vle url for any relative references
 * found in content.
 */
function injectVleUrl(content){
	var loc = window.location.toString();
	var vleLoc = loc.substring(0, loc.indexOf('/vle/')) + '/vle/';
	
	content = content.replace(/(src='|src="|href='|href=")(?!http|\/)/gi, '$1' + vleLoc);
	return content;
};

// define array.contains method, which returns true iff the array
//contains the element specified
if(!Array.contains){
	Array.prototype.contains = function(obj) {
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return true;
            }
        }
        return false;
	};
};

//IE 7 doesn't have indexOf method, so we need to define it........
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            };
        };
        return -1;
    };
};

/**
 * Array prototype that takes in a function which is passed
 * each element in the array and returns an array of the return
 * values of the function.
 */
if(!Array.map){
	 Array.prototype.map = function(fun){
		 var out = [];
		 for(var k=0;k<this.length;k++){
			 out.push(fun(this[i]));
		 };
		 return out;
	 };
};

/**
 * Adds a compare function to Array.prototype if one
 * does not exist
 */
if(!Array.compare){
	Array.prototype.compare = function(testArr) {
	    if (this.length != testArr.length) return false;
	    for (var i = 0; i < testArr.length; i++) {
	        if (this[i].compare) { 
	            if (!this[i].compare(testArr[i])) return false;
	        };
	        if (this[i] !== testArr[i]) return false;
	    };
	    return true;
	};
};

/**
 * Hides the element with the given id
 */
function hideElement(id){
	document.getElementById(id).style.display = 'none';
};

/**
 * Shows the element with the given id
 */
function showElement(id){
	document.getElementById(id).style.display = 'block';
};

/**
 * Given an html element obj, returns its absolute location
 * (left & top) in the page.
 * 
 * @param HTML Element
 * @return obj {left, top}
 */
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return {left: curleft, top: curtop};
};

/**
 * Returns the number of fields that the given object has.
 */
function objSize(obj){
	var count = 0;
	for(var field in obj){
		if(obj.hasOwnProperty(field)){
			count++;
		};
	};
	return count;
};


/**
 * Creates an xml doc object from the xml string
 * @param txt xml text
 * @return
 */
function loadXMLDocFromString(txt) {
	try //Internet Explorer
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(txt);
		return(xmlDoc); 
	}
	catch(e)
	{
		try //Firefox, Mozilla, Opera, etc.
		{
			parser=new DOMParser();
			xmlDoc=parser.parseFromString(txt,"text/xml");
			return(xmlDoc);
		}
		catch(e) {alert(e.message)}
	}
	return(null);
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/common/helperfunctions.js');
};
/**
 * The core that is common to all views
 */

/**
 * Loads a project into the view by creating a content object using the
 * given url and passing in the given contentBase and lazyLoading as
 * parameters to the project.
 * 
 * @param url
 * @param contentBase
 * @param lazyLoading
 */
View.prototype.loadProject = function(url, contentBase, lazyLoading){
	eventManager.fire('loadingProjectStart');
	this.project = createProject(createContent(url), contentBase, lazyLoading, this);
	eventManager.fire('loadingProjectComplete');
};

/**
 * @return the currently loaded project for this view if one exists
 */
View.prototype.getProject = function(){
	return this.project;
};

View.prototype.injectVleUrl = function(content){
	var loc = window.location.toString();
	var vleLoc = loc.substring(0, loc.indexOf('/vle/')) + '/vle/';
	
	content = content.replace(/(src='|src="|href='|href=")(?!http|\/)/gi, '$1' + vleLoc);
	return content;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/coreview.js');
};
/**
 * The util object for this view
 * 
 * @author patrick lawler
 */
View.prototype.utils = {};

/**
 * Returns whether the content string contains an applet by searching for
 * an open and close applet tag in the content string.
 */
View.prototype.utils.containsApplet = function(content){
	/* check for open and close applet tags */
	var str = content.getContentString();
	if(str.indexOf("<applet") != -1 && str.indexOf("</applet>") != -1) {
		return true;
	} else {
		return false;
	};
};

/**
 * Inserts the applet param into the the given content
 * @param content the content in which to insert the param
 * @param name the name of the param
 * @param value the value of the param
 */
View.prototype.utils.insertAppletParam = function(content, name, value){
	/* get the content string */
	var str = content.getContentString();
	
	/* create the param string */
	var paramTag = '<param name="' + name + '" value="' + value + '">';
	
	/* check if the param already exists in the content */
	if(str.indexOf(paramTag) == -1) {
		/* add the param right before the closing applet tag */
		content.setContent(str.replace("</applet>", paramTag + "\n</applet>"));
	};
};


/**
 * Extracts the file servlet information from the given url and returns the result.
 */
View.prototype.utils.getContentPath = function(baseUrl, url){
	return url.substring(url.indexOf(baseUrl) + baseUrl.length, url.length);
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/view_utils.js');
};
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
			this.em.addEvent(endName);
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
			if ((o.responseText && !o.responseXML)  || (typeof ActiveXObject!='undefined')){
				o.responseXML = loadXMLString(o.responseText);
			}
			if (o.responseText !='undefined' && o.getResponseHeader["Content-Length"] < 10000 && o.responseText.match("login for portal") != null) {
				// this means that student has been idling too long and has been logged out of the session
				// so we should take them back to the homepage.
				//vle.doLogIn();
				if(notificationManager){
					notificationManager.notify("You have been inactive for too long and have been logged out. Please log back in to continue.",3);
				} else {
					alert("You have been inactive for too long and have been logged out. Please log back in to continue.");
				};
				vle.logout = true;  // we need to bypass any cleanup (ie saving work back to server) because user isn't authenticated any more
				window.location = "/webapp/j_spring_security_logout";
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
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/io/ConnectionManager.js');
};
/**
 * Global object to handle notifications for the VLE and 
 * authoring tool. There are 3 levels of messages plus a debug 
 * level; 1: information that will be printed to the firebug 
 * console, 2: warnings that will be printed to the firebug 
 * console, 3: alert/errors that popup an alert message, 4: 
 * debug which are messages that are only printed to the 
 * console when debugMode is set to true.
 *
 * The notificationManager has a notify function and a debugMode
 * field. The debugMode field defaults to false but can be set
 * to true using: notificationManager.debugMode = true
 *
 * The notify function takes two arguments: the message, the notify
 * level of the message (either 1, 2, 3 or 4). The message is the
 * message to be displayed and the notify level, in conjunction with
 * the debugMode value, controls how and where the message is displayed.
 *
 * Usage examples:
 *
 *		notificationManager.notify('what is it', 1);
 *		notificationManager.notify('when is it', 2);
 *		notificationManager.notify('how is it', 3);
 *		notificationManager.notify('debugging is fun', 4)
 *  will exhibit the following behavior
 * 		i what is it			-- printed to firebug console
 *		! when is it			-- printed to firebug console
 *		how is it				-- in a popup alert
 * 
 * the level 4 call is not displayed because debugMode is false.
 * 
 ****
 *		notificationManager.debugMode = true;
 *		notificationManager.notify('what is it', 1);
 *		notificationManager.notify('when is it', 2);
 *		notificationManager.notify('how is it', 3);
 *		notificationManager.notify('debugging is fun', 4)
 *  will exhibit the following behavior
 *		Notify debug: what is it			-- printed to firebug console
 *		Notify debug: when is it			-- printed to firebug console
 *		Notify debug: how is it				-- printed to firebug console
 *		Notify debug: debugging is fun		-- printed to firebug console
 *
 * when debugMode is set to true, all notify calls are printed to console.
 */
 
/**
 * notificationManager object
 */
var notificationManager = {
	init: function(){
		window.notificationEventManager = new EventManager();
		notificationEventManager.addEvent('removeMsg');
	}(),
	count: 0,
	debugMode: false,
	levels: {
		1: 'info',
		2: 'warn',
		3: 'alert',
		4: 'log',
		5: 'fatal'
	},
	notify: function(message, level){
		if(level){
			var notifyLevel = this.levels[level];
			if(this.debugMode){
				if(window.console){
					if(!notifyLevel){
						notifyLevel = 'log';
					};
					if(notifyLevel=='alert'){
						notifyLevel = 'error';
					};
					window.console[notifyLevel]('Notify debug: ' + message);
				} else {
					this.notifyAlert('Notify debug: ' + message);
				};
			} else {
				if(notifyLevel){
					if(notifyLevel=='alert'){
						this.notifyAlert('Notify message: ' + message);
					} else if(notifyLevel=='fatal'){
						eventManager.fire('fatalError', message);
					} else if(notifyLevel!='log'){
						if(window.console && window.console[notifyLevel]){
							window.console[notifyLevel](message);
						} else {
							// do nothing.
						};
					};
				};
			};
		} else {
			this.notifyAlert('Notify message: ' + message);
		};
	},
	notifyAlert: function(msg){
		var msgDiv = this.generateUniqueMessageDiv();
		document.body.appendChild(msgDiv);
		new AlertObject(msgDiv, msg);
	},
	generateUniqueMessageDiv: function(){
		var id = 'superSecretMessageDiv_' + this.count;
		if(document.getElementById(id)){
			this.count ++;
			return generateUniqueMessageDiv();
		} else {
			var el = createElement(document, 'div', {id: id, 'class':'messages', style:'display:none;'});
			this.count ++;
			return el;
		};
	}
};

/**
 * The Alert Object takes a html div element and a message, displays the given
 * message at the top of the page for the time specified in MSG_TIME and then
 * removes the element from the page.
 */
function AlertObject(el, msg){
	this.MSG_TIME = 3000;
	this.el = el;
	this.msg = msg;

	notificationEventManager.subscribe('removeMsg', this.removeMsg, this);
	
	el.style.display = 'block';
	el.innerHTML = msg;
	el.style.left = (document.body.clientWidth / 2) - 150;
	
	setTimeout('notificationEventManager.fire("removeMsg","' + el.id + '")', this.MSG_TIME);
};

/**
 * Removes the message that this object represents from the page.
 */
AlertObject.prototype.removeMsg = function(type,args,obj){
	if(args[0]==obj.el.id){
		document.body.removeChild(obj.el);
		obj = null;
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/util/NotificationManager.js');
};
function createContent(url){
	return function(url){
		var url = url;
		var contentString;
		var contentXML;
		var contentJSON;
		var contentLoaded = false;
		var MAX_TIME = 30000;
		var timer;
		
		/**
		 * Fires event alert if eventManager exists, alerts message otherwise
		 */
		var msg = function(text){
			if(typeof eventManager != 'undefined'){
				eventManager.fire('alert', text);
			} else {
				alert(text);
			};
		};
		
		/**
		 * If content has been previously loaded, returns the content
		 * in the format of the given type, otherwise, retrieves the
		 * content and then returns the content in the format of the 
		 * given type.
		 */
		var getContent = function(type){
			if(contentLoaded){
				return contentType(type);
			} else {
				return retrieveContent(type);
			};
		};
		
		/**
		 * returns the content in the format of the given type
		 */
		var contentType = function(type){
			if(type=='xml'){
				return contentXML;
			} else if(type=='json'){
				return contentJSON;
			} else if(type=='string'){
				return contentString;
			} else {
				return null;
			};
		};
		
		/**
		 * Makes a synchronous XHR request, parses the response as
		 * string, xml and json (when possible) and returns the content
		 * in the format of the given type.
		 */
		var retrieveContent = function(type){
			//make synchronous request
			timer = setTimeout('eventManager.fire("contentTimedOut","' + url + '")',MAX_TIME);
			var req = new XMLHttpRequest();
			req.open('GET', url, false);
			req.send(null);
			clearTimeout(timer);
			
			//parse the response in various formats if any response format has a value
			if(req.responseText || req.responseXML){
				//xml
				if(req.responseXML){
					contentXML = req.responseXML;
				} else {//create xmlDoc from string
					setContentXMLFromString(req.responseText);
				};
				
				//string
				if(req.responseText){
					contentString = req.responseText;
				} else {//serialize xml to string
					if(window.ActiveXObject){
						contentString = req.responseXML.xml;
					} else {
						contentString = (new XMLSerializer()).serializeToString(req.responseXML);
					};
				};
				
				//json
				try{
					contentJSON = yui.JSON.parse(contentString);
				} catch(e){
					contentJSON = undefined;
				};
				
				//set content loaded
				contentLoaded = true;
				
				//return appropriate response type
				return contentType(type);
			} else {
				msg('Error retrieving content for url: ' + url);
				return null;
			};
		};
		
		/**
		 * Sets and parses this content object's content
		 */
		var setContent = function(content){
			//check for different content types and parse to other types as appropriate
			if(typeof content=='string'){//string
				contentString = content;
				setContentXMLFromString(contentString);
				try{
					contentJSON = yui.JSON.parse(contentString);
				} catch(e){
					contentJSON = undefined;
				};
			} else {
				if(window.ActiveXObject){//IE
					if(content.xml){//xml Doc in IE
						contentXML = content;
						contentString = content.xml;
						try{
							contentJSON = yui.JSON.parse(contentString);
						} catch(e){
							contentJSON = undefined;
						};
					} else {//must be object
						contentJSON = content;
						try{
							contentString = yui.JSON.stringify(contentJSON);
							setContentXMLFromString(contentString);
						} catch(e){
							contentJSON = undefined;
						};
					};
				} else {//not ie
					if(content instanceof Document){//xmlDoc
						contentXML = content;
						contentString = (new XMLSerializer()).serializeToString(contentXML);
						try{
							contentJSON = yui.JSON.parse(contentString);
						} catch(e){
							contentJSON = undefined;
						};
					} else {//must be object
						contentJSON = content;
						try{
							contentString = yui.JSON.stringify(contentJSON);
							setContentXMLFromString(contentString);
						} catch(e){
							contentString = undefined;
						};
					};
				};
			};
			
			//set content loaded
			contentLoaded = true;
		};
		
		/**
		 * Returns true if the given xmlDoc does not contain any parsererror
		 * tag in non-IE browsers or the length of xmlDoc.xml is > 0 in IE
		 * browers, returns false otherwise.
		 */
		var validXML = function(xml){
			if(window.ActiveXObject){//IE
				if(xml.xml.length==0){
					return false;
				} else {
					return true;
				};
			} else {//not IE
				return xml.getElementsByTagName('parsererror').length < 1;
			};
		};
		
		/**
		 * Sets the contentXML variable
		 */
		var setContentXMLFromString = function(str){
			if(document.implementation && document.implementation.createDocument){
				contentXML = new DOMParser().parseFromString(str, "text/xml");
			} else if(window.ActiveXObject){
				contentXML = new ActiveXObject("Microsoft.XMLDOM")
				contentXML.loadXML(str);
			};
			
			if(!validXML(contentXML)){
				contentXML = undefined;
			};
		};
		
		/* Returns the filename for this content given the contentBaseUrl */
		var getFilename = function(contentBase){
			return url.substring(url.indexOf(contentBase) + contentBase.length + 1, url.length);
		};
		
		return {
			/* Returns this content as an xmlDoc if possible, else returns undefined */
			getContentXML:function(){return getContent('xml');},
			/* Returns this content as a JSON object if possible, else returns undefined */
			getContentJSON:function(){return getContent('json');},
			/* Returns this content as a string */
			getContentString:function(){return getContent('string');},
			/* Sets this content given any of: a string, json object, xmlDoc */
			setContent:function(content){setContent(content);},
			/* Retrieves the content but does not return it (for eager loading) */
			retrieveContent:function(){getContent('string');},
			/* Returns the url for this content */
			getContentUrl:function(){return url;},
			/* Returns the filename for this content given the contentBaseUrl */
			getFilename:function(contentBase){return getFilename(contentBase);}
		};
	}(url);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/content/content.js');
};
/**
 * Node specific helpers
 */

/* Array of nodes whose content comprises the page */
var SELF_RENDERING_NODES = ['BlueJNode', 'DrawNode', 'FlashNode', 'HtmlNode', 'MySystemNode', 'SVGDrawNode'];

/* Map of node types and their corresponding html page */
var HTML_MAP = {BrainstormNode:{server:'node/brainstorm/brainfull.html', serverless:'node/brainstorm/brainlite.html'}, 
		ChallengeQuestionNode:'node/challengequestion/challengequestion.html', DataGraphNode:'node/datagraph/datagraph.html',
		FillinNode:'node/fillin/fillin.html', GlueNode:'node/glue/glue.html', MatchSequenceNode:'node/matchsequence/matchsequence.html',
		MultipleChoiceNode:'node/multiplechoice/multiplechoice.html', NoteNode:'node/openresponse/note.html', 
		OpenResponseNode:'node/openresponse/openresponse.html', OutsideUrlNode:'node/outsideurl/outsideurl.html', 
		TickerNode:'node/ticker/ticker.html'};

function removeClassFromElement(identifier, classString) {
	YUI().use('node', function(Y) {
		var node = Y.get('#'+identifier);
		node.removeClass(classString);
	});
}

function addClassToElement(identifier, classString) {
	YUI().use('node', function(Y) {
		var node = Y.get('#'+identifier);
		node.addClass(classString);
	});
}

/**
 * returns true iff element with specified identifier has 
 * a class classString
 * @param identifier
 * @param classString
 * @return
 */
function hasClass(identifier, classString) {
	var classesStr = document.getElementById(identifier).getAttribute('class');
	return classesStr != null && (classesStr.indexOf(classString) != -1);
}

/**
 * Clears innerHTML of a div with id=feedbackDiv
 */
function clearFeedbackDiv() {
	document.getElementById("feedbackDiv").innerHTML = "";
}

/**
 * Clears value of an element with id=responseBox
 */
function clearResponseBox() {
	document.getElementById("responseBox").value = "";
}

/**
 * show tryagain button iff doShow == true
 * @param doShow
 * @return
 */
function setButtonVisible(buttonId, doShow) {
    var tryAgainButton = document.getElementById(buttonId);

	if (doShow) {
	    tryAgainButton.style.visibility = 'visible';
	} else {
	    tryAgainButton.style.visibility = 'hidden';		
	}
}

/**
 * enable checkAnswerButton
 * OR
 * disable checkAnswerButton
 */
function setCheckAnswerButtonEnabled(doEnable) {
  var checkAnswerButton = document.getElementById('checkAnswerButton');

  if (doEnable) {
    checkAnswerButton.removeAttribute('disabled');
  } else {
    checkAnswerButton.setAttribute('disabled', 'true');
  }
}

function setResponseBoxEnabled(doEnable) {
	var responseBox = document.getElementById('responseBox');
	if (doEnable) {
		responseBox.removeAttribute('disabled');
	} else {
		responseBox.setAttribute('disabled','disabled');
	};
};

/**
 * Updates text in div with id numberAttemptsDiv with info on number of
 * attempts. The text will generally follow the format:
 * This is your ___ attempt.  Or This is your ___ revision.
 * part1 example: This is your
 * part2 example: attempt
 * part2 example2: revision
 */
function displayNumberAttempts(part1, part2, states) {
	var nextAttemptNum = states.length + 1;
	var nextAttemptString = "";
	if (nextAttemptNum == 1) {
		nextAttemptString = "1st";		
	} else if (nextAttemptNum == 2) {
		nextAttemptString = "2nd";		
	} else if (nextAttemptNum == 3) {
		nextAttemptString = "3rd";		
	} else {
		nextAttemptString = nextAttemptNum + "th";		
	}
	var numAttemptsDiv = document.getElementById("numberAttemptsDiv");
	var numAttemptsDivHtml = part1 + " " + nextAttemptString + " " + part2 +".";
	numAttemptsDiv.innerHTML = numAttemptsDivHtml;
};

/**
 * Updates text in div with id lastAttemptDiv with info on
 * student's last attempt
 * javascript Date method reference:
 * http://www.w3schools.com/jsref/jsref_obj_date.asp
 */
function displayLastAttempt(states) {
	if (states.length > 0) {
	    var t = states[states.length - 1].timestamp;
	    var month = t.getMonth() + 1;
	    var hours = t.getHours();
	    var minutes = t.getMinutes();
	    var seconds = t.getSeconds();
	    var timeToDisplay = month + "/" + t.getDate() + "/" + t.getFullYear() +
	        " at " + hours + ":" + minutes + ":" + seconds;
		var lastAttemptDiv = document.getElementById("lastAttemptDiv");
		lastAttemptDiv.innerHTML = " Your last attempt was on " + timeToDisplay;
	};
};

/**
 * Replaces all the & with &amp; and escapes all " within the
 * given text and returns that text.
 * 
 * @param text
 * @return text
 */
function makeHtmlSafe(text){
	if(text){
		text =  text.replace(/\&/g, '&amp;'); //html friendly &
		text = text.replace(/\"/g, "&quot;"); //escape double quotes
		return text;
	} else {
		return '';
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/common/nodehelpers.js');
};
/* Modular Project Object */
function createProject(content, contentBaseUrl, lazyLoading, view){
	return function(content, cbu, ll, view){
		var content = content;
		var contentBaseUrl = cbu;
		var lazyLoading = ll;
		var allLeafNodes = [];
		var allSequenceNodes = [];
		var autoStep;
		var stepLevelNumbering;
		var title;
		var stepTerm;
		var rootNode;
		var view = view;
		var copyIds = [];
		
		/* Creates the nodes defined in this project's content */
		var generateProjectNodes = function(){
			var jsonNodes = content.getContentJSON().nodes;
			for (var i=0; i < jsonNodes.length; i++) {
				var currNode = jsonNodes[i];
				var thisNode = NodeFactory.createNode(currNode, view);
				if(thisNode == null) {
					/* unable to create the specified node type probably because it does not exist in wise4 */
					view.notificationManager.notify('null was returned from project factory for node: ' + currNode.identifier + ' \nSkipping node.', 2);
				} else {
					/* validate and set identifier attribute */
					if(!currNode.identifier || currNode.identifier ==''){
						view.notificationManager.notify('No identifier for node in project file.', 3);
					} else {
						thisNode.id = currNode.identifier;
						if(idExists(thisNode.id)){
							view.notificationManager.notify('Duplicate node id: ' + thisNode.id + ' found in project', 3);
						};
					};
					/* validate and set title attribute */
					if(!currNode.title || currNode.title==''){
						view.notificationManager.notify('No title attribute for node with id: ' + thisNode.id, 2);
					} else {
						thisNode.title = currNode.title;
					};
					/* validate and set class attribute */
					if(!currNode['class'] || currNode['class']==''){
						view.notificationManager.notify('No class attribute for node with id: ' + thisNode.id, 2);
					} else {
						thisNode.className = currNode['class'];
					};
					
					/* validate filename reference attribute */
					if(!currNode.ref || currNode.ref==''){
						view.notificationManager.notify('No filename specified for node with id: ' + thisNode.id + ' in the project file', 2);
					} else {
						thisNode.content = createContent(makeUrl(currNode.ref));
					};
					
					/* add to leaf nodes */
					allLeafNodes.push(thisNode);
					
					/* load content now if not lazy loading */
					if(!lazyLoading){
						thisNode.content.retrieveContent();
					};
					
					/* prep any Note Nodes */
					if(thisNode.type=='NoteNode'){
						thisNode.renderFrame();
					};
					
					/* get any previous work reference node ids and add it to node */
					thisNode.prevWorkNodeIds = currNode.previousWorkNodeIds;
					
					/* add events for node rendering */
					eventManager.subscribe('pageRenderComplete', thisNode.pageRenderComplete, thisNode);
					eventManager.subscribe('contentRenderComplete', thisNode.contentRenderComplete, thisNode);
					eventManager.subscribe('scriptsLoaded', thisNode.loadContentAfterScriptsLoad, thisNode);
				};
			};
		};
		
		/* Creates and validates the sequences defined in this project's content */
		var generateSequences = function(){
			var project = content.getContentJSON();
			
			/* create the sequence nodes */
			var sequences = project.sequences;
			for(var e=0;e<sequences.length;e++){
				var sequenceNode = NodeFactory.createNode(sequences[e], view);
				sequenceNode.json = sequences[e];
				/* validate id */
				if(idExists(sequenceNode.id)){
					view.notificationManager.notify('Duplicate sequence id: ' + sequenceNode.id + ' found in project.', 3);
				};
				allSequenceNodes.push(sequenceNode);
			};
			
			/* get starting sequence */
			if(project.startPoint){
				var startingSequence = getNodeById(project.startPoint);
			} else {
				view.notificationManager.notify('No starting sequence specified for this project', 3);
			};
			
			/* validate that there are no loops before setting root node */
			if(startingSequence){
				for(var s=0;s<allSequenceNodes.length;s++){
					var stack = [];
					if(validateNoLoops(allSequenceNodes[s].id, stack, 'file')){
						//All OK, add children to sequence
						populateSequences(allSequenceNodes[s].id);
					} else {
						view.notificationManager.notify('Infinite loop discovered in sequences, check sequence references', 3);
						return null;
					};
				};
				rootNode = startingSequence;
			};
		};
		
		/* Returns true if a node of the given id already exists in this project, false otherwise */
		var idExists = function(id){
			return getNodeById(id);
		};
		
		/* Returns the node with the given id if the node exists, returns null otherwise. */
		var getNodeById = function(nodeId){
			for(var t=0;t<allLeafNodes.length;t++){
				if(allLeafNodes[t].id==nodeId){
					return allLeafNodes[t];
				};
			};
			for(var p=0;p<allSequenceNodes.length;p++){
				if(allSequenceNodes[p].id==nodeId){
					return allSequenceNodes[p];
				};
			};
			return null;
		};
		
		/* Returns the node at the given position in the project if it exists, returns null otherwise */
		var getNodeByPosition = function(position){
			if(position){
				var locs = position.split('.');
				var parent = rootNode;
				var current;
	
				/* cycle through locs, getting the children each cycle */
				for(var u=0;u<locs.length;u++){
					current = parent.children[locs[u]];
					
					/* if not current, then the position is off, return null */
					if(!current){
						return null;
					} else if(u==locs.length-1){
						/* if this is last location return current*/
						return current;
					} else {
						/* otherwise set parent = current for next cycle */
						parent = current;
					};
				};
			} else {
				return null;
			};
		};
		
		/* Given the filename, returns the url to retrieve the file */
		var makeUrl = function(filename){
			if (contentBaseUrl != null) {
				if(contentBaseUrl.lastIndexOf('\\')!=-1){
					return contentBaseUrl + '\\' + filename;
				} else {
					return contentBaseUrl + '/' + filename;
				};
			};
			return filename;
		};
		
		/*
		 * Given the sequence id, a stack and where search is run from, returns true if
		 * there are no infinite loops starting from given id, otherwise returns false.
		 */
		var validateNoLoops = function(id, stack, from){
			if(stack.indexOf(id)==-1){ //id not found in stack - continue checking
				var childrenIds = getChildrenSequenceIds(id, from);
				if(childrenIds.length>0){ //sequence has 1 or more sequences as children - continue checking
					stack.push(id);
					for(var b=0;b<childrenIds.length;b++){ // check children
						if(!validateNoLoops(childrenIds[b], stack)){
							return false; //found loop or duplicate id
						};
					};
					stack.pop(id); //children OK
					return true;
				} else { // no children ids to check - this is last sequence node so no loops or duplicates
					return true;
				};
			} else { //id found in stack, infinite loop or duplicate id
				return false;
			};
		};
		
		/* Given the a sequence Id, populates all of it's children nodes */
		var populateSequences = function(id){
			var sequence = getNodeById(id);
			var children = sequence.json.refs;
			for(var j=0;j<children.length;j++){
				/* validate node was defined and add it to sequence if it is */
				var childNode = getNodeById(children[j]);
				if(!childNode){
					view.notificationManager.notify('Node reference ' + children[j] + ' exists in sequence node ' + id + ' but the node has not been defined and does not exist.', 2);
				} else {
					sequence.addChildNode(childNode);
				};
			};
		};
		
		/* Given a sequence ID and location from (file or project), returns an array of ids for any children sequences */
		var getChildrenSequenceIds = function(id, from){
			var sequence = getNodeById(id);
			/* validate sequence reference */
			if(!sequence){
				view.notificationManager.notify('Sequence with id: ' + id + ' is referenced but this sequence does not exist.', 2);
				return [];
			};
			
			/* populate childrenIds */
			var childrenIds = [];
			if(from=='file'){
				/* get child references from content */
				var refs = sequence.json.refs;
				for(var e=0;e<refs.length;e++){
					childrenIds.push(refs[e]);
				};
			} else {
				/* get child references from sequence */
				var children = sequence.children;
				for(var e=0;e<children.length;e++){
					if(children[e].type=='sequence'){
						childrenIds.push(children[e].id);
					};
				};
			};
			
			return childrenIds;
		};
		
		/* Returns the node with the given title if the node exists, returns null otherwise. */
		var getNodeByTitle = function(title){
			for(var y=0;y<allLeafNodes.length;y++){
				if(allLeafNodes[y].title==title){
						return allLeafNodes[y];
				};
			};
			for(var u=0;u<allSequenceNodes.length;u++){
				if(allSequenceNodes[u].title==title){
					return allSequenceNodes[u];
				};
			};
			return null;
		};
		

		/* Helper function for getStartNodeId() */
		var getFirstNonSequenceNodeId = function(node){
			if(node){
				if(node.type=='sequence'){
					for(var y=0;y<node.children.length;y++){
						var id = getFirstNonSequenceNodeId(node.children[y]);
						if(id!=null){
							return id;
						};
					};
				} else {
					return node.id;
				};
			} else {
				view.notificationManager.notify('Cannot get start node! Possibly no start sequence is specified or invalid node exists in project.', 2);
			};
		};
		
		/* Removes all references of the node with the given id from sequences in this project */
		var removeAllNodeReferences = function(id){
			for(var w=0;w<allSequenceNodes.length;w++){
				for(var e=0;e<allSequenceNodes[w].children.length;e++){
					if(allSequenceNodes[w].children[e].id==id){
						allSequenceNodes[w].children.splice(e, 1);
					};
				};
			};
		};
		
		/* Recursively searches for first non sequence node and returns that path */
		var getPathToFirstNonSequenceNode = function(node, path){
			if(node.type=='sequence'){
				for(var y=0;y<node.children.length;y++){
					var pos = getPathToFirstNonSequenceNode(node.children[y], path + '.'  + y);
					if(pos!=undefined && pos!=null){
						return pos;
					};
				};
			} else {
				return path;
			};
		};
		
		/* Recursively searches for the given id from the point of the node down and returns the path. */
		var getPathToNode = function(node, path, id){
			if(node.id==id){
				return path;
			} else if(node.type=='sequence'){
				for(var e=0;e<node.children.length;e++){
					var pos = getPathToNode(node.children[e], path + '.' + e, id);
					if(pos){
						return pos;
					};
				};
			};
		};

		/**
		 * Prints summary report to firebug console of: All Sequences and
		 * Nodes defined for this project, Sequences defined but not used,
		 * Nodes defined but not used, Sequences used twice and Nodes used
		 * twice in this project.
		 */
		var printSummaryReportsToConsole = function(){
			printSequencesDefinedReport();
			printNodesDefinedReport();
			printUnusedSequencesReport();
			printUnusedNodesReport();
			printDuplicateSequencesReport();
			printDuplicateNodesReport();
		};
		
		/**
		 * Prints a report of all sequences defined for this project
		 * to the firebug console
		 */
		var printSequencesDefinedReport = function(){
			var outStr = 'Sequences defined by Id: ';
			for(var z=0;z<allSequenceNodes.length;z++){
				if(z==allSequenceNodes.length - 1){
					outStr += ' ' + allSequenceNodes[z].id;
				} else {
					outStr += ' ' + allSequenceNodes[z].id + ',';
				};
			};
			view.notificationManager.notify(outStr, 1);
		};

		/**
		 * Prints a report of all nodes defined for this project
		 * to the firebug console
		 */
		var printNodesDefinedReport = function(){
			var outStr = 'Nodes defined by Id: ';
			for(var x=0;x<allLeafNodes.length;x++){
				if(x==allLeafNodes.length -1){
					outStr += ' ' + allLeafNodes[x].id;
				} else {
					outStr += ' ' + allLeafNodes[x].id + ',';
				};
			};
			
			view.notificationManager.notify(outStr, 1);
		};

		/**
		 * Prints a report of all unused sequences for this project
		 * to the firebug console
		 */
		var printUnusedSequencesReport = function(){
			var outStr = 'Sequence(s) with id(s): ';
			var found = false;
			
			for(var v=0;v<allSequenceNodes.length;v++){
				if(!referenced(allSequenceNodes[v].id) && allSequenceNodes[v].id!=rootNode.id){
					found = true;
					outStr += ' ' + allSequenceNodes[v].id;
				};
			};
			
			if(found){
				view.notificationManager.notify(outStr + " is/are never used in this project", 1);
			};
		};

		/**
		 * Prints a report of all unused nodes for this project
		 * to the firebug console
		 */
		var printUnusedNodesReport = function(){
			var outStr = 'Node(s) with id(s): ';
			var found = false;
			
			for(var b=0;b<allLeafNodes.length;b++){
				if(!referenced(allLeafNodes[b].id)){
					found = true;
					outStr += ' ' + allLeafNodes[b].id;
				};
			};

			if(found){
				view.notificationManager.notify(outStr + " is/are never used in this project", 1);
			};
		};

		/**
		 * Prints a report of all duplicate sequence ids to the
		 * firebug console
		 */
		var printDuplicateSequencesReport = function(){
			var outStr = 'Duplicate sequence Id(s) are: ';
			var found = false;
			
			for(var n=0;n<allSequenceNodes.length;n++){
				var count = 0;
				for(var m=0;m<allSequenceNodes.length;m++){
					if(allSequenceNodes[n].id==allSequenceNodes[m].id){
						count ++;
					};
				};
				
				if(count>1){
					found = true;
					outStr += allSequenceNodes[n].id + ' ';
				};
			};
			
			if(found){
				view.notificationManager.notify(outStr, 1);
			};
		};

		/**
		 * Prints a report of all duplicate node ids to the
		 * firebug console
		 */
		var printDuplicateNodesReport = function(){
			var outStr =  'Duplicate node Id(s) are: ';
			var found = false;
			
			for(var n=0;n<allLeafNodes.length;n++){
				var count = 0;
				for(var m=0;m<allLeafNodes.length;m++){
					if(allLeafNodes[n].id==allLeafNodes[m].id){
						count ++;
					};
				};
				
				if(count>1){
					found = true;
					outStr += allLeafNodes[n].id + ' ';
				};
			};
			
			if(found){
				view.notificationManager.notify(outStr, 1);
			};
		};

		/**
		 * Returns true if the given id is referenced by any
		 * sequence in the project, otherwise, returns false
		 */
		var referenced = function(id){
			for(var c=0;c<allSequenceNodes.length;c++){
				for(var v=0;v<allSequenceNodes[c].children.length;v++){
					if(allSequenceNodes[c].children[v].id==id){
						return true;
					};
				};
			};
			return false;
		};

		/**
		 * Returns a list of the given type (node or seq) that are not a child of any
		 * sequence (defined but not attached in the project).
		 */
		var getUnattached = function(type){
			var list = [];
			
			if(type=='node'){//find unattached nodes
				var children = allLeafNodes;
			} else {//find unattached sequences
				var children = allSequenceNodes;
			};
			
			//if not referenced, add to list
			for(var x=0;x<children.length;x++){
				if(!referenced(children[x].id) && !(rootNode==children[x])){
					list.push(children[x]);
				};
			};
			
			//return list
			return list;
		};
		
		/**
		 * Obtain a string delimited by : of all the node ids in the project
		 * except for the nodes that have a node type in the nodeTypesToExclude
		 * @param nodeTypesToExclude a string delimited by : of node types that
		 * 		we do not want to be returned
		 * @return a string delimited by : of node ids in the project that
		 * 		have a node types that we want
		 */
		var getNodeIds = function(nodeTypesToExclude){
			var nodeIds = "";
			
			//loop through all the leaf nodes
			for(var x=0; x<allLeafNodes.length; x++) {
				//obtain a leaf node
				var leafNode = allLeafNodes[x];
				
				//obtain the node id and node type
				var nodeId = leafNode.id;
				var nodeType = leafNode.type;
				
				//check if the node type is in the list of node types to exclude
				if(nodeTypesToExclude.indexOf(nodeType) == -1) {
					/* the node type is not in the list to exclude which means we want this node */
					
					//check if we need to add a :
					if(nodeIds != "") {
						nodeIds += ":";
					}
					
					//add the node id
					nodeIds += nodeId;
				}
			}
			
			return nodeIds;
		};
		
		/**
		 * Obtain a string delimited by : of all the node types in the project
		 * except for the nodes that have a node type in the nodeTypesToExclude
		 * @param nodeTypesToExclude a string delimited by : of node types that
		 * 		we do not want to be returned
		 * @return a string delimited by : of node ids in the project that
		 * 		have node types that we want
		 */
		var getNodeTypes = function(nodeTypesToExclude){
			var nodeTypes = "";
			
			//loop through all the leaf nodes
			for(var x=0; x<allLeafNodes.length; x++) {
				//obtain a leaf node
				var leafNode = allLeafNodes[x];
				
				//obtain the node type
				var nodeType = leafNode.type;
				
				//check if the node type is in the list of node types to exclude
				if(nodeTypesToExclude.indexOf(nodeType) == -1) {
					/* the node type is not in the list to exclude which means we want this node */
					
					//check if we need to add a :
					if(nodeTypes != "") {
						nodeTypes += ":";
					}
					
					//add the node id
					nodeTypes += nodeType;
				}
			}
			
			return nodeTypes;
		};
		
		/* Returns html showing all students work so far */
		var getShowAllWorkHtml = function(node,showGrades){
			var htmlSoFar = "";
			if (node.children.length > 0) {
				// this is a sequence node
				for (var i = 0; i < node.children.length; i++) {
					htmlSoFar += getShowAllWorkHtml(node.children[i], showGrades);
				}
			} else {
				// this is a leaf node
			    htmlSoFar += "<div id=\"showallStep\"><a href=\"#\" onclick=\"view.renderNode('" + getPositionById(node.id) + "'); YAHOO.example.container.showallwork.hide();\">" + node.title + "</a><div class=\"type\">"+node.getType(true)+"</div></div>";
			    if (showGrades) {
					htmlSoFar += "<div class=\"showallStatus\">Status: " + node.getShowAllWorkHtml(view) + "</div>";
					htmlSoFar += "<div><table id='teacherTable'>";
					var annotationsForThisNode = view.annotations.getAnnotationsByNodeId(node.id);
					if (annotationsForThisNode.length > 0) {
						for (var i=0; i < annotationsForThisNode.length; i++) {
							var annotation = annotationsForThisNode[i];
							if (annotation.type == "comment") {
								htmlSoFar += "<tr><td class='teachermsg1'>TEACHER FEEDBACK: " + annotation.value + "</td></tr>";
							}
							if (annotation.type == "score") {
								htmlSoFar += "<tr><td class='teachermsg2'>TEACHER SCORE: " + annotation.value + "</td></tr>";
							}
						}
					} else {
						htmlSoFar += "<td class='teachermsg3'>" + "Grading: Your Teacher hasn't graded this step yet." + "<td>";
					}
					htmlSoFar += "</table></div>";
			    } else {
					htmlSoFar += node.getShowAllWorkHtml(view);
			    }
				htmlSoFar += "";
			}
			return htmlSoFar;
		};
		
		/* Removes the node of the given id from the project */
		var removeNodeById = function(id){
			for(var o=0;o<allSequenceNodes.length;o++){
				if(allSequenceNodes[o].id==id){
					allSequenceNodes.splice(o,1);
					removeAllNodeReferences(id);
					return;
				};
			};
			for(var q=0;q<allLeafNodes.length;q++){
				if(allLeafNodes[q].id==id){
					allLeafNodes.splice(q,1);
					removeAllNodeReferences(id);
					return;
				};
			};
		};
		
		/* Removes the node at the given location from the sequence with the given id */
		var removeReferenceFromSequence = function(seqId, location){
			var seq = getNodeById(seqId);
			seq.children.splice(location,1);
		};
		
		/* Adds the node with the given id to the sequence with the given id at the given location */
		var addNodeToSequence = function(nodeId,seqId,location){
			var addNode = getNodeById(nodeId);
			var sequence = getNodeById(seqId);
			
			sequence.children.splice(location, 0, addNode); //inserts
			
			/* check to see if this changes causes infinite loop, if it does, take it out and notify user */
			var stack = [];
			if(!validateNoLoops(seqId, stack)){
				view.notificationManager.notify('This would cause an infinite loop! Undoing changes...', 3);
				sequence.children.splice(location, 1);
			};
		};
		
		/* Returns an object representation of this project */
		var projectJSON = function(){
			/* create project object with variables from this project */
			var project = {
					autoStep: autoStep,
					stepLevelNum: stepLevelNumbering,
					stepTerm: stepTerm,
					title: title,
					nodes: [],
					sequences: [],
					startPoint: ""
			};
			
			/* set start point */
			if(rootNode){
				project.startPoint = rootNode.id;
			};
			
			/* set node objects for each node in this project */
			for(var k=0;k<allLeafNodes.length;k++){
				project.nodes.push(allLeafNodes[k].nodeJSON(contentBaseUrl));
			};
			
			/* set sequence objects for each sequence in this project */
			for(var j=0;j<allSequenceNodes.length;j++){
				project.sequences.push(allSequenceNodes[j].nodeJSON());
			};
			
			/* return the project object */
			return project;
		};
		
		/* Returns the absolute position to the first renderable node in the project if one exists, returns undefined otherwise. */
		var getStartNodePosition = function(){
			for(var d=0;d<rootNode.children.length;d++){
				var path = getPathToFirstNonSequenceNode(rootNode.children[d], d);
				if(path!=undefined && path!=null){
					return path;
				};
			};
		};
		
		/* Returns the first position that the node with the given id exists in. Returns null if no node with id exists. */
		var getPositionById = function(id){
			for(var d=0;d<rootNode.children.length;d++){
				var path = getPathToNode(rootNode.children[d], d, id);
				if(path!=undefined && path!=null){
					return path;
				};
			};
		};
		
		/* Returns the filename for this project */
		var getProjectFilename = function(){
			var url = content.getContentUrl();
			return url.substring(url.indexOf(contentBaseUrl) + contentBaseUrl.length + 1, url.length);
		};
		
		/* Returns the filename for the content of the node with the given id */
		var getNodeFilename = function(nodeId){
			var node = getNodeById(nodeId);
			if(node){
				return node.content.getFilename(contentBaseUrl);
			} else {
				return null;
			};
		};
		
		/* Given a base title, returns a unique title in this project*/
		var generateUniqueTitle = function(base){
			var count = 1;
			while(true){
				var newTitle = base + ' ' + count;
				if(!getNodeByTitle(newTitle)){
					return newTitle;
				};
				count ++;
			};
		};
		
		/* Given a base title, returns a unique id in this project*/
		var generateUniqueId = function(base){
			var count = 1;
			while(true){
				var newId = base + '_' + count;
				if((!getNodeById(newId)) && (copyIds.indexOf(newId)==-1)){
					return newId;
				};
				count ++;
			};
		};

		/* Copies the nodes of the given array of node ids and fires the event of the given eventName when complete */
		var copyNodes = function(nodeIds, eventName){
			/* listener that listens for the copying of all the nodes and launches the next copy when previous is completed. 
			 * When all have completed fires the event of the given eventName */
			var listener = function(type,args,obj){
				var nodeCopiedId = args[0];
				var copiedToId = args[1];
				var copyInfo = obj;
				
				/* remove first nodeInfo in queue */
				var currentInfo = copyInfo.queue.shift();
				
				/* ensure that nodeId from queue matches nodeCopiedId */
				if(currentInfo.id!=nodeCopiedId){
					copyInfo.view.notificationManager('Copied node id and node id from queue do match, error when copying.', 3);
				};
				
				/* add to msg and add copied node id to copyIds and add to list of copied ids*/
				if(!copiedToId){
					copyInfo.msg += ' Failed copy of ' + nodeCopiedId;
				} else {
					copyInfo.msg += ' Copied ' + nodeCopiedId + ' to ' + copiedToId;
					copyInfo.view.getProject().addCopyId(copiedToId);
					copyInfo.copiedIds.push(copiedToId);
				};
				
				/* check queue, if more nodes, launch next, if not fire event with message and copiedIds as arguments */
				if(copyInfo.queue.length>0){
					/* launch next from queue */
					var nextInfo = copyInfo.queue[0];
					nextInfo.node.copy(nextInfo.eventName);
				} else {
					/* fire completed event */
					copyInfo.view.eventManager.fire(copyInfo.eventName, [copyInfo.copiedIds, copyInfo.msg]);
				};
			};
			
			/* custom object that holds information for the listener when individual copy events complete */
			var copyInfo = {
				view:view,
				queue:[],
				eventName:eventName,
				msg:'',
				copiedIds:[]
			};
			
			/* setup events for all of the node ids */
			for(var q=0;q<nodeIds.length;q++){
				var name = generateUniqueCopyEventName();
				copyInfo.queue.push({id:nodeIds[q],node:getNodeById(nodeIds[q]),eventName:name});
				view.eventManager.addEvent(name);
				view.eventManager.subscribe(name, listener, copyInfo);
			};
			
			/* launch the first node to copy if any exist in queue, otherwise, fire the event immediately */
			if(copyInfo.queue.length>0){
				var firstInfo = copyInfo.queue[0];
				firstInfo.node.copy(firstInfo.eventName);
			} else {
				view.eventManager.fire(eventName, [null, null]);
			};
		};
		
		/* Generates and returns a unique event for copying nodes and sequences */
		var generateUniqueCopyEventName = function(){
			return view.eventManager.generateUniqueEventName('copy_');
		};
		
		/* Adds the given id to the array of ids for nodes that are copied */
		var addCopyId = function(id){
			copyIds.push(id);
		};
		
		/*
		 * Retrieves the question/prompt the student reads for the step
		 * 
		 * this.getProject().getNodeById(nodeId).content.getContentJSON().assessmentItem.interaction.prompt
		 * 
		 * @param nodeId the id of the node
		 * @return a string containing the prompt (the string may be an
		 * html string)
		 */
		var getNodePromptByNodeId = function(nodeId) {
			//get the node
			var node = getNodeById(nodeId);
			
			//get the content for the node
			var content = node.content;
			var contentJSON = content.getContentJSON();
			
			var prompt = null;
			
			//see if the node content has an assessmentItem
			if(contentJSON.assessmentItem != null) {
				//obtain the prompt
				var assessmentItem = contentJSON.assessmentItem;
				var interaction = assessmentItem.interaction;
				prompt = interaction.prompt;	
			}
			
			//return the prompt
			return prompt;
		};
		
		/* parse the project content and set available attributes to variables */
		var project = content.getContentJSON();
		if(project){
			/* set auto step */
			autoStep = project.autoStep;
			
			/* set step level numbering */
			stepLevelNumbering = project.stepLevelNum;
			
			/* set step term */
			stepTerm = project.stepTerm;
			
			/* set title */
			title = project.title;
			
			/* create nodes for project and set rootNode*/
			generateProjectNodes();
			generateSequences();
			
			/* generate reports for console */
			printSummaryReportsToConsole();
		} else {
			view.notificationManager.notify('Unable to parse project content, check project.json file. Unable to continue.', 5);
		};
		
		
		return {
			/* returns true when autoStep should be used, false otherwise */
			useAutoStep:function(){return autoStep;},
			/* sets autoStep to the given boolean value */
			setAutoStep:function(bool){autoStep = bool;},
			/* returns true when stepLevelNumbering should be used, false otherwise */
			useStepLevelNumbering:function(){return stepLevelNumbering;},
			/* sets stepLevelNumbering to the given boolean value */
			setStepLevelNumbering:function(bool){stepLevelNumbering = bool;},
			/* returns the step term to be used when displaying nodes in the navigation for this project */
			getStepTerm:function(){return stepTerm;},
			/* sets the step term to be used when displaying nodes in this project */
			setStepTerm:function(term){stepTerm = term;},
			/* returns the title of this project */
			getTitle:function(){return title;},
			/* sets the title of this project */
			setTitle:function(t){title = t;},
			/* returns the node with the given id if it exists, null otherwise */
			getNodeById:function(nodeId){return getNodeById(nodeId);},
			/* given a sequence id, empty stack, and location, returns true if any infinite loops
			 * are discovered, returns false otherwise */
			validateNoLoops:function(id, stack, from){return validateNoLoops(id,stack,from);},
			/* Returns the node with the given title if the node exists, returns null otherwise. */
			getNodeByTitle:function(title){return getNodeByTitle(title);},
			/* Returns the node at the given position in the project if it exists, returns null otherwise */
			getNodeByPosition:function(pos){return getNodeByPosition(pos);},
			/* Returns a : delimited string of all node ids of types that are not included in the provided nodeTypesToExclude */
			getNodeIds:function(nodeTypesToExclude){return getNodeIds(nodeTypesToExclude);},
			/* Returns a : delimited string of all node types except for those given in nodeTypesToExclude */
			getNodeTypes:function(nodeTypesToExclude){return getNodeTypes(nodeTypesToExclude);},
			/* Returns html showing all students work so far */
			getShowAllWorkHtml:function(node,showGrades){return getShowAllWorkHtml(node,showGrades);},
			/* Returns the first renderable node Id for this project */
			getStartNodeId:function(){return getFirstNonSequenceNodeId(rootNode);},
			/* Removes the node of the given id from the project */
			removeNodeById:function(id){removeNodeById(id);},
			/* Removes the node at the given location from the sequence with the given id */
			removeReferenceFromSequence:function(seqId, location){removeReferenceFromSequence(seqId, location);},
			/* Adds the node with the given id to the sequence with the given id at the given location */
			addNodeToSequence:function(nodeId, seqId, location){addNodeToSequence(nodeId,seqId,location);},
			/* Copies the nodes of the given array of node ids and fires the event of the given eventName when complete */
			copyNodes:function(nodeIds, eventName){copyNodes(nodeIds, eventName);},
			/* Returns the absolute position to the first renderable node in the project if one exists, returns undefined otherwise. */
			getStartNodePosition:function(){return getStartNodePosition();},
			/* Returns the first position that the node with the given id exists in. Returns null if no node with id exists. */
			getPositionById:function(id){return getPositionById(id);},
			/* Returns the content base url for this project */
			getContentBase:function(){return contentBaseUrl;},
			/* Returns the filename for this project */
			getProjectFilename:function(){return getProjectFilename();},
			/* Returns the full url for this project's content */
			getUrl:function(){return content.getContentUrl();},
			/* Returns the leaf nodes array of this project */
			getLeafNodes:function(){return allLeafNodes;},
			/* Returns the sequence nodes array of this project */
			getSequenceNodes:function(){return allSequenceNodes;},
			/* Returns the root node for this project */
			getRootNode:function(){return rootNode;},
			/* Returns an array of nodes of the given type that are not a child node to any other node */
			getUnattached:function(type){return getUnattached(type);},
			/* Returns the filename for the content of the node with the given id */
			getNodeFilename:function(nodeId){return getNodeFilename(nodeId);},
			/* Given a base title, returns a unique title in this project*/
			generateUniqueTitle:function(base){return generateUniqueTitle(base);},
			/* Given a base title, returns a unique id in this project*/
			generateUniqueId:function(base){return generateUniqueId(base);},
			/* Generates and returns a unique event for copying nodes and sequences */
			generateUniqueCopyEventName:function(){return generateUniqueCopyEventName();},
			/* Adds the given id to the array of ids for nodes that are copied */
			addCopyId:function(id){addCopyId(id);},
			/* Returns an object representation of this project */
			projectJSON:function(){return projectJSON();},
			/* Given the filename, returns the url to retrieve the file */
			makeUrl:function(filename){return makeUrl(filename);},
			/* Given the nodeId, returns the prompt for that step */
			getNodePromptByNodeId:function(nodeId){return getNodePromptByNodeId(nodeId);}
		};
	}(content, contentBaseUrl, lazyLoading, view);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/project/Project.js');
};
function NodeFactory(){
};

NodeFactory.createNode = function(jsonNode, view){
	var acceptedTagNames = new Array("node", "HtmlNode", "MultipleChoiceNode", "sequence", "FillinNode", "MatchSequenceNode", "NoteNode", "JournalEntryNode", "OutsideUrlNode", "BrainstormNode", "GlueNode", "OpenResponseNode", "FlashNode", "BlueJNode", "DataGraphNode", "DrawNode", "MySystemNode", "SVGDrawNode");
	
	if(jsonNode.type){
		var nodeName = jsonNode.type;
	} else {
		var nodeName = null;
	};
	if (acceptedTagNames.indexOf(nodeName) > -1) {
		if (nodeName == "HtmlNode") {
			return new HtmlNode("HtmlNode", view);
		} else if (nodeName == "MultipleChoiceNode"){
			return new MultipleChoiceNode("MultipleChoiceNode", view);
		} else if(nodeName == 'FillinNode'){
			return new FillinNode('FillinNode', view);
		} else if (nodeName == 'NoteNode'){
			return new NoteNode('NoteNode', view);
		} else if (nodeName == 'JournalEntryNode'){
			return new JournalEntryNode('JournalEntryNode', view);
		} else if (nodeName == 'MatchSequenceNode'){
			return new MatchSequenceNode('MatchSequenceNode', view);
		} else if (nodeName == 'OutsideUrlNode'){
			return new OutsideUrlNode('OutsideUrlNode', view);
		} else if (nodeName == 'BrainstormNode'){
			return new BrainstormNode('BrainstormNode', view);
		} else if (nodeName == 'FlashNode') {
			return new FlashNode('FlashNode', view);
		} else if (nodeName == 'GlueNode'){
			return new GlueNode('GlueNode', view);
		} else if (nodeName == 'OpenResponseNode'){
			return new OpenResponseNode('OpenResponseNode', view);
		} else if (nodeName == 'BlueJNode'){
			return new BlueJNode('BlueJNode', view);
		} else if (nodeName == 'DataGraphNode'){
			return new DataGraphNode('DataGraphNode', view);
		} else if (nodeName == 'DrawNode') {
			return new DrawNode('DrawNode', view);
		} else if (nodeName == 'MySystemNode') {
			return new MySystemNode('MySystemNode', view);
		} else if (nodeName == 'SVGDrawNode') {
			return new SVGDrawNode('SVGDrawNode', view);
		} else if (nodeName == "sequence") {
			var sequenceNode = new Node("sequence", view);
			sequenceNode.id = jsonNode.identifier;
			sequenceNode.title = jsonNode.title;
			return sequenceNode;
		} else {
			return new Node(null, view);
		};
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/nodefactory.js');
};
/* Node */
function Node(nodeType, view){
	this.id;
	this.parent;
	this.children = [];
	this.type = nodeType;
	this.title;
	this.className;
	this.content;
	this.contentPanel;
	this.baseHtmlContent;
	
	this.prevWorkNodeIds = [];
	this.extraData;
	this.view = view;
};

Node.prototype.getNodeId = function() {
	return this.id;
};

Node.prototype.getTitle = function() {
	if (this.title != null) {
		return this.title;
	};
	
	return this.id;
};

/**
 * @return this node's content object
 */
Node.prototype.getContent = function(){
	return this.content;
};

/**
 * Sets this node's content object
 * @param content
 */
Node.prototype.setContent = function(content){
	this.content = content;
};

/**
 * returns this node's type. if humanReadable=true, return in human-readable format
 * e.g. HtmlNode=>{Display, Evidence}, NoteNode=>Note, etc.
 * If type is not defined, return an empty string.
 * @param humanReadable
 * @return
 */
Node.prototype.getType = function(humanReadable) {
	if (this.type) {
		if (!humanReadable) {
			return this.type;
		} else {
			// first get rid of the "Node" in the end of the type
			if (this.type.lastIndexOf("Node") > -1) {
				return this.type.substring(0, this.type.lastIndexOf("Node"));
			} else {
				return this.type;
			};
		};
	} else {
		return "";
	};
};

Node.prototype.addChildNode = function(childNode) {
	this.children.push(childNode);
	childNode.parent = this;
};

Node.prototype.getNodeById = function(nodeId) {
	if (this.id == nodeId) {
		return this;
	} else if (this.children.length == 0) {
		return null;
	} else {
		var soFar = false;
		for (var i=0; i < this.children.length; i++) {
			soFar = soFar || this.children[i].getNodeById(nodeId);
		};
		return soFar;
	};
};

//alerts vital information about this node
Node.prototype.alertNodeInfo = function(where) {
	notificationManager.notify('node.js, ' + where + '\nthis.id:' + this.id 
			+ '\nthis.title:' + this.title, 3);
};

/**
 * Renders itself to the specified content panel
 */
Node.prototype.render = function(contentPanel, studentWork) {
	this.studentWork = studentWork;
	this.contentPanel = contentPanel;
	
	/* if no content panel specified use default */
	if(contentPanel){
		/* make sure we use frame window and not frame element */
		this.contentPanel = window.frames[contentPanel.name];
		//this.contentPanel = contentPanel;
	} else if(contentPanel == null) {
		/* use default ifrm */
		if(this.type == 'NoteNode') {
			this.contentPanel = window.frames['noteiframe' + this.id];
			document['notePanel_' + this.id].cfg.setProperty('visible', true);
		} else {
			this.contentPanel = window.frames['ifrm'];			
		}
	};

	/* 
	 * if node is not self rendering which means it is a node that
	 * requires an html file and a content file
	 */
	if(SELF_RENDERING_NODES.indexOf(this.type)==-1){
		/* check to see if this contentpanel has already been rendered */
		if(this.contentPanel.nodeId!=this.id){
			/* render page html */
			var pageHtml = HTML_MAP[this.type];
			
			/* if this is brainstorm node, get sub-html page */
			if(this.type=='BrainstormNode'){
				if(this.isUsingServer()){
					pageHtml = pageHtml['server'];
				} else {
					pageHtml = pageHtml['serverless'];
				};
			};
			
			this.baseHtmlContent = createContent(pageHtml);
			/* make nodeId available to the content panel, and hence, the html */
			this.contentPanel.nodeId = this.id;
			
			/* inject urls and write html to content panel */
			this.contentPanel.document.open();
			this.contentPanel.document.write(this.injectBaseRef(this.view.injectVleUrl(this.baseHtmlContent.getContentString())));
			this.contentPanel.document.close();
		} else {
			/* already rendered, just load content */
			this.contentPanel.loadContentAfterScriptsLoad(this);
		};
	} else {
		/* if baseHtmlContent has not already been created, create it now */
		if(!this.baseHtmlContent){
			this.baseHtmlContent = createContent(this.view.getProject().makeUrl(this.content.getContentJSON().src));
			
			/* change filename url for the modules if this is a MySystemNode */
			if(this.type == 'MySystemNode'){
				this.baseHtmlContent.setContent(this.updateJSONContentPath(this.view.getConfig().getConfigParam('getContentBaseUrl'), this.baseHtmlContent.getContentString()));
			};
		};
		
		/*check if the user had clicked on an outside link in the previous step
		 */
		if(this.handlePreviousOutsideLink(this)) {
			/*
			 * the user was at an outside link so the function
			 * handlePreviousOutsideLink() has taken care of the
			 * rendering of this node
			 */
			return;
		};
		
		//write the content into the contentPanel, this will render the html in that panel
		this.contentPanel.document.open();
		this.contentPanel.document.write(this.injectBaseRef(this.baseHtmlContent.getContentString()));
		this.contentPanel.document.close();
		
		this.view.eventManager.fire('contentRenderComplete', this.id);
	};
	
	if(this.contentPanel != null) {
		//set the event manager into the content panel so the html has access to it
		this.contentPanel.eventManager = eventManager;
		this.contentPanel.nodeId = this.id;
		this.contentPanel.scriptloader = this.view.scriptloader;
		this.contentPanel.yui = yui;
		
		if(this.type == 'MySystemNode' || this.type == 'SVGDrawNode') {
			this.contentPanel.vle = this.view;
		};
	};
	
	/* if this is a blueJ step and the student work component is loaded, post current step */
	if(this.content.getContentJSON().blueJProjectPath && this.content.getContentJSON().blueJProjectPath!='' && this.view.postCurrentStep){
		this.extraData = this.content.getContentJSON.blueJProjectPath;
		this.view.postCurrentStep(this);
	};
};

/**
 * Listens for page rendered event: the html has been fully loaded
 * and the event is fired from the page's window.onload function.
 */
Node.prototype.pageRenderComplete = function(type, args, obj){
	/* args[0] is the id of node's page that has been rendered */
	if(obj.id==args[0]){
		obj.contentPanel.loadContent(obj);
		obj.insertPreviousWorkIntoPage(obj.contentPanel.document);
	};
};

Node.prototype.loadContentAfterScriptsLoad = function(type, args, obj){
	if(obj.id==args[0]) {
		obj.contentPanel.loadContentAfterScriptsLoad(obj);		
	}
};

/**
 * Listens for page content rendered complete event: the html has
 * been fully loaded as has the content and the event is fired from
 * the html's load content function.
 */
Node.prototype.contentRenderComplete = function(type, args, obj){
	/* args[0] is the id of node's page that has been rendered */
};

/**
 * This is called when a node is exited
 */
Node.prototype.onExit = function() {
	//this function should be overriden by child classes
};

/**
 * Get the view style if the node is a sequence. If this node
 * is a sequence and no view style is defined, the default will
 * be the 'normal' view style.
 * @return the view style of the sequence or null if this
 * 		node is not a sequence
 */
Node.prototype.getView = function() {
	/*
	 * check that this node is a sequence.
	 */
	if(this.isSequence()) {
		if(this.json.view == null) {
			//return the default view style if none was specified
			return 'normal';
		} else {
			//return the view style for the sequence
			return this.json.view;
		}
	} else {
		//this node is not a sequence so we will return null
		return null;
	}
};

/**
 * Returns whether this node is a sequence node.
 */
Node.prototype.isSequence = function() {
	return this.type == 'sequence';
};

/**
 * Returns the appropriate object representation of this node
 */
Node.prototype.nodeJSON = function(contentBase){
	if(this.type=='sequence'){
		/* create and return sequence object */
		var sequence = {
			type:'sequence',
			identifier:makeHtmlSafe(this.id),
			title:makeHtmlSafe(this.title),
			view:this.getView(),
			refs:[]
		};
		
		/* add children ids to refs */
		for(var l=0;l<this.children.length;l++){
			sequence.refs.push(this.children[l].id);
		};
		
		return sequence;
	} else {
		/* create and return node object */
		var node = {
			type:this.type,
			identifier:makeHtmlSafe(this.id),
			title:makeHtmlSafe(this.title),
			ref:this.content.getFilename(contentBase),
			previousWorkNodeIds:this.prevWorkNodeIds
		};
		
		/* set class */
		node['class'] = this.className;
		
		return node;
	}
};

/**
 * This function is for displaying student work in the ticker.
 * All node types that don't implement this method will inherit
 * this function that just returns null. If null is returned from
 * this method, the ticker will just skip over the node when
 * displaying student data in the ticker.
 */
Node.prototype.getLatestWork = function(vle, dataId) {
	return null;
};

/**
 * Translates students work into human readable form. Some nodes,
 * such as mc and mccb require translation from identifiers to 
 * values, while other nodes do not. Each node will implement
 * their own translateStudentWork() function and perform translation
 * if necessary. This is just a dummy parent implementation.
 * @param studentWork the student's work, could be a string or array
 * @return a string of the student's work in human readable form.
 */
Node.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * Injects base ref in the head of the html if base-ref is not found, and returns the result
 * @param content
 * @return
 */
Node.prototype.injectBaseRef = function(content) {
	if (content.search(/<base/i) > -1) {
		// no injection needed because base is already in the html
		return content;
	} else {		
		//get the content base url
		var contentBaseUrl = this.view.getConfig().getConfigParam('getContentBaseUrl');

		//create the base tag
		var baseRefTag = "<base href='" + contentBaseUrl + "'/>";

		//insert the base tag at the beginning of the head
		var newContent = content.replace("<head>", "<head>" + baseRefTag);
		
		//return the updated content
		return newContent;
	}
};

/**
 * Returns whether this node is a leaf node
 */
Node.prototype.isLeafNode = function() {
	return this.type != 'sequence';
};

/**
 * For each state in the given nodeStates, creates an xml state tag
 * with the corresponding data within that tag and returns a string
 * of all the state tags. Returns an empty string if nodeStates is of
 * 0 length.
 * 
 * @param nodeStates
 * @return xml string of states
 */
Node.prototype.getDataXML = function(nodeStates){
	var dataXML = "";
	for (var i=0; i < nodeStates.length; i++) {
		var state = nodeStates[i];
		dataXML += "<state>" + state.getDataXML() + "</state>";
	}
	return dataXML;
};

/**
 * Converts an xml object of a node and makes a real Node object
 * @param nodeXML an xml object of a node
 * @return a real Node object depending on the type specified in
 * 		the xml object
 */
Node.prototype.parseDataXML = function(nodeXML){
	var nodeType = nodeXML.getElementsByTagName("type")[0].textContent;
	var id = nodeXML.getElementsByTagName("id")[0].textContent;

	//create the correct type of node
	var nodeObject = NodeFactory.createNode(nodeType);
	nodeObject.id = id;
	return nodeObject;
};

/**
 * This handles the case when the previous step has an outside link and 
 * the student clicks on it to load a page from a different host within
 * the vle. Then the student clicks on the next step in the vle. This
 * caused a problem before because the iframe would contain a page
 * from a different host and we would no longer be able to call functions
 * from it.
 * @param thisObj the node object we are navigating to
 * @param thisContentPanel the content panel to load the content into
 * 		this may be null
 * @return true if the student was at an outside link, false otherwise
 */
Node.prototype.handlePreviousOutsideLink = function(thisObj, thisContentPanel) {
	//check for ifrm to see if this is running from vle.html or someplace
	//other (such as authoring tool which does not have ifrm).
	if(!window.frames['ifrm']){
		return false;
	} else {
		try {
			/*
			 * try to access the host attribute of the ifrm, if the content
			 * loaded in the ifrm is in our domain it will not complain,
			 * but if the content is from another domain it will throw an
			 * error 
			 */
			window.frames["ifrm"].host;
		} catch(err) {
			//content was from another domain
			
			/*
			 * call back() to navigate back to the htmlnode page that contained
			 * the link the student clicked on to access an outside page
			 */
			history.back();
			
			//call render to render the node we want to navigate to
			setTimeout(function() {thisObj.render(thisContentPanel)}, 500);
			
			/*
			 * tell the caller the student was at an outside link so
			 * they don't need to call render()
			 */
			return true;
		}
		
		//tell the caller the student was not at an outside link
		return false;
	};
};

/**
 * If this node has previous work nodes, grabs the latest student
 * data from that node and inserts it into this nodes page
 * for each referenced node id. Assumes that the html is already loaded
 * and has a div element with id of 'previousWorkDiv'.
 * 
 * @param doc
 */
Node.prototype.insertPreviousWorkIntoPage = function(doc){
	//only do anything if there is anything to do
	if(this.prevWorkNodeIds.length>0){
		var html = '';
		
		//loop through and add any previous work to html
		for(var n=0;n<this.prevWorkNodeIds.length;n++){
			var work = vle.getLatestWorkByNodeId(this.prevWorkNodeIds[n]);
			if(work){
				var node = vle.project.getNodeById(this.prevWorkNodeIds[n]);
				html += 'Remember, your response to step ' + node.title + ' was: ' + work.getStudentWork() + '</br></br>';
			};
		};
		
		//add reminders to this node's html if div exists
		var prevWorkDiv = doc.getElementById('previousWorkDiv');
		if(prevWorkDiv){
			prevWorkDiv.innerHTML = html;
		};
	};
};

/**
 * Given the full @param path to the project (including project filename), duplicates 
 * this node and updates project file on server. Upon successful completion, runs the 
 * given function @param done and notifies the user if the given @param silent is not true.
 * 
 * NOTE: It is up to the caller of this function to refresh the project after copying.
 * 
 * @param done - a callback function
 * @param silent - boolean, does not notify when complete if true
 * @param path - full project path including project filename
 */
Node.prototype.copy = function(eventName, project){
	/* success callback */
	var successCreateCallback = function(text,xml,o){
		/* fire event with arguments: event name, [initial node id, copied node id] */
		o[0].view.eventManager.fire(o[1],[o[0].id,text]);
	};
	
	/* failure callback */
	var failureCreateCallback = function(obj, o){
		/* fire event with initial node id as argument so that listener knows that copy failed */
		o[0].view.eventManager.fire(o[1],o[0].id);
	};
	
	if(this.type!='sequence'){
		/* copy node section */
		var project = this.view.getProject();
		var data = this.content.getContentString();
		if(this.type=='HtmlNode' || this.type=='DrawNode' || this.type=='MySystemNode'){
			var contentFile = this.content.getContentJSON().src;
		} else {
			var contentFile = '';
		};
		
		if(this.type=='MySystemNode'){
			this.view.notificationManager.notify('My System Nodes cannot be copied, ignoring', 3);
			this.view.eventManager.fire(eventName,[this.id, null]);
			return;
		};
		
		this.view.connectionManager.request('POST', 1, 'filemanager.html', {command:'copyNode', param1: this.view.utils.getContentPath(this.view.authoringBaseUrl,project.getUrl()), param2: this.content.getContentString(), param3: this.type, param4: project.generateUniqueTitle(this.title), param5: this.className, param6: contentFile}, successCreateCallback, [this,eventName], failureCreateCallback)
	} else {
		/* copy sequence section */
		
		/* listener that listens for the event when all of its children have finished copying 
		 * then copies itself and finally fires the event to let other listeners know that it
		 * has finished copying */
		var listener = function(type,args,obj){
			if(args[0]){
				var idList = args[0];
			} else {
				var idList = [];
			};
			
			if(args[1]){
				var  msg = args[1];
			} else {
				var msg = '';
			};
			
			var node = obj[0];
			var eventName = obj[1];
			var project = node.view.getProject();
			
			var seqJSON = {
				type:'sequence',
				identifier: project.generateUniqueId(node.id),
				title: project.generateUniqueTitle(node.title),
				view: node.getView(),
				refs:idList
			};
			
			node.view.connectionManager.request('POST', 1, 'filemanager.html', {command: 'createSequenceFromJSON', param1: node.view.utils.getContentPath(node.view.authoringBaseUrl,node.view.getProject().getUrl()), param2: yui.JSON.stringify(seqJSON)}, successCreateCallback, [node,eventName], failureCreateCallback);
		};
		
		/* set up event to listen for when this sequences children finish copying */
		var seqEventName = this.view.project.generateUniqueCopyEventName();
		this.view.eventManager.addEvent(seqEventName);
		this.view.eventManager.subscribe(seqEventName, listener, [this, eventName]);
		
		/* collect children ids in an array */
		var childIds = [];
		for(var w=0;w<this.children.length;w++){
			childIds.push(this.children[w].id);
		};
		
		/* process by passing childIds and created event name to copy in project */
		this.view.getProject().copyNodes(childIds, seqEventName);
	};
};

Node.prototype.getShowAllWorkHtml = function(vle){
	var showAllWorkHtmlSoFar = "";
    var nodeVisitArray = vle.state.getNodeVisitsByNodeId(this.id);
    if (nodeVisitArray.length > 0) {
        var states = [];
        var latestNodeVisit = nodeVisitArray[nodeVisitArray.length -1];
        for (var i = 0; i < nodeVisitArray.length; i++) {
            var nodeVisit = nodeVisitArray[i];
            for (var j = 0; j < nodeVisit.nodeStates.length; j++) {
                states.push(nodeVisit.nodeStates[j]);
            }
        }
        var latestState = states[states.length - 1];
        showAllWorkHtmlSoFar += "Last visited on ";
        
        if(latestNodeVisit!=null){
        	showAllWorkHtmlSoFar += "" + new Date(parseInt(latestNodeVisit.visitStartTime)).toLocaleString();
        	
        };
        
        if(latestState!=null){
        	showAllWorkHtmlSoFar += '<div class=\"showallLatest\">Latest Work:' + '</div>' + '<div class=\"showallLatestWork\">' + this.translateStudentWork(latestState.getStudentWork()) + '</div>';
        };
    }
    else {
        showAllWorkHtmlSoFar += "Step not visited yet.";
    }
    
    for (var i = 0; i < this.children.length; i++) {
        showAllWorkHtmlSoFar += this.children[i].getShowAllWorkHtml();
    }
    return showAllWorkHtmlSoFar;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/Node.js');
};
/**
 * An OpenResponseNode is a representation of an OpenResponse assessment item
 *
 */

OpenResponseNode.prototype = new Node();
OpenResponseNode.prototype.constructor = OpenResponseNode;
OpenResponseNode.prototype.parent = Node.prototype;
function OpenResponseNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
};

OpenResponseNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, orNode){			
			orNode.contentPanel.document.open();
			orNode.contentPanel.document.write(orNode.injectBaseRef(injectVleUrl(text)));
			orNode.contentPanel.document.close();
			if(orNode.contentPanel.name!='ifrm'){
				orNode.contentPanel.renderComplete = function(){
					orNode.load();
				};
			};
			orNode.contentPanel.renderLoadComplete = function(){
				orNode.onNodefullyloaded();
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/openresponse/openresponse.html', null,  renderAfterGet, this);	
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

OpenResponseNode.prototype.load = function() {
	var states = [];
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var nodeVisit = vle.state.visitedNodes[i];
		if (nodeVisit.getNodeId() == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			}
		}
	}
	
	if(this.contentPanel && this.contentPanel.loadContent) {
		this.contentPanel.loadContent([this.element, vle, states]);
	}
	if(this.contentPanel) {
		this.insertPreviousWorkIntoPage(this.contentPanel.document);		
	}
};

/**
 * Renders barebones open response
 */
OpenResponseNode.prototype.renderLite = function(state){
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	if(state){
		this.liteState = state;
	};
	
	var callbackFun = function(text, xml, orNode){
		orNode.contentPanel.document.open();
		orNode.contentPanel.document.write(orNode.injectBaseRef(injectVleUrl(text)));
		orNode.contentPanel.document.close();
		orNode.contentPanel.renderComplete = function(){
			orNode.loadLite();			
		};
	};
	
	var callback = {
		success: function(o){callbackFun(o.responseText, o.responseXML, o.argument);},
		failure: function(o){this.view.notificationManager.notify('failed to retrieve file', 3);},
		argument: this
	};
	
	YAHOO.util.Connect.asyncRequest('GET', 'node/openresponse/openresponselite.html', callback, null);
};

/**
 * Loads barebones open response
 */
OpenResponseNode.prototype.loadLite = function(){
	if(this.contentPanel && this.contentPanel.loadContent) {
		this.contentPanel.loadContent([this.element, this, vle, this.liteState]);		
	}
};


OpenResponseNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		statesArrayObject.push(OPENRESPONSESTATE.prototype.parseDataXML(stateXML));
	}
	
	return statesArrayObject;
}

OpenResponseNode.prototype.getDataXML = function(nodeStates) {
	return OpenResponseNode.prototype.parent.getDataXML(nodeStates);
};

/**
 * Takes in a state JSON object and returns an OPENRESPONSESTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return an OPENRESPONSESTATE object
 */
OpenResponseNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return OPENRESPONSESTATE.prototype.parseDataJSONObj(stateJSONObj);
}

OpenResponseNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * Given an xmlDoc of state information, returns a new state
 * @param stateXML
 * @return
 */
OpenResponseNode.prototype.parseStateXML = function(stateXML){
	return OPENRESPONSESTATE.prototype.parseDataXML(stateXML);
};

/**
 * Called when the step is exited. This is used for auto-saving.
 */
OpenResponseNode.prototype.onExit = function() {
	//check if the content panel exists
	if(this.contentPanel && this.contentPanel.save) {
		//tell the content panel to save
		this.contentPanel.save();
	}
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/OpenResponseNode.js');
};
/*
 * HtmlNode
 */

HtmlNode.prototype = new Node();
HtmlNode.prototype.constructor = HtmlNode;
HtmlNode.prototype.parent = Node.prototype;
function HtmlNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
}

HtmlNode.prototype.setHtmlContent = function(htmlContent) {
	//update the htmlContent attribute that contains the html
	this.content.setContent(htmlContent);
};

HtmlNode.prototype.load = function() {
	this.prepareAudio();
	if (vle.audioManager != null) {
		vle.audioManager.setCurrentNode(this);
	}
};

/**
 * Lite rendering of html node for glue-type nodes
 */
HtmlNode.prototype.renderLite = function(frame){
	if(this.filename!=null && vle.project.lazyLoading){
		this.retrieveFile();
	};
};

/**
 * Lite loading of html node for glue-type nodes
 */
HtmlNode.prototype.loadLite = function(frame){
	if(!this.elementText){
		if(!this.htmlContent){
			this.elementText = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
			this.htmlContent = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
		} else {
			this.elementText = this.htmlContent;
		};
	};
	
	window.frames['ifrm'].frames[frame].document.open();
	window.frames['ifrm'].frames[frame].document.write(this.injectBaseRef(this.elementText));
	window.frames['ifrm'].frames[frame].document.close();
	
	//inject necessary glue functions into html document
	window.frames['ifrm'].frames[frame].getAnswered = function(){return true;};
	window.frames['ifrm'].frames[frame].checkAnswerLite = function(){return 'visited html: ' + this.id};
};


/**
 * Gets the data xml format of the student data associated with this
 * step.
 * @param nodeStates an array of node states
 * @return an xml string containing the student work
 */
HtmlNode.prototype.getDataXML = function(nodeStates) {
	return HtmlNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * Creates an array of states from an xml object
 * @param nodeStatesXML an xml object that may contain multiple states
 * @return an array of state objects
 */
HtmlNode.prototype.parseDataXML = function(nodeStatesXML) {
	//obtain all the state xml elements
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	
	//the array to store the state objects
	var statesArrayObject = new Array();
	
	//loop through the state xml elements
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an HTMLSTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(HTMLSTATE.prototype.parseDataXML(stateXML));
	}
	return statesArrayObject;
}

/**
 * Takes in a state JSON object and returns an HTMLSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return an HTMLSTATE object
 */
HtmlNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return HTMLSTATE.prototype.parseDataJSONObj(stateJSONObj);
}


HtmlNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<content><![CDATA[";
	exportXML += this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	exportXML += "]]></content>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

HtmlNode.prototype.doNothing = function() {
	window.frames["ifrm"].document.open();
	window.frames["ifrm"].document.write(this.injectBaseRef(this.elementText));
	window.frames["ifrm"].document.close();
}

/**
 * This is called when the node is exited
 * @return
 */
HtmlNode.prototype.onExit = function() {
	//check if the content panel has been set
	if(this.contentPanel) {
		try {
			/*
			 * check if the onExit function has been implemented or if we
			 * can access attributes of this.contentPanel. if the user
			 * is currently at an outside link, this.contentPanel.onExit
			 * will throw an exception because we aren't permitted
			 * to access attributes of pages outside the context of our
			 * server.
			 */
			if(this.contentPanel.onExit) {
				try {
					//run the on exit cleanup
					this.contentPanel.onExit();					
				} catch(err) {
					//error when onExit() was called, e.g. mysystem editor undefined
				}
			}	
		} catch(err) {
			/*
			 * an exception was thrown because this.contentPanel is an
			 * outside link. we will need to go back in the history
			 * and then trying to render the original node.
			 */
			history.back();
			//setTimeout(function() {thisObj.render(this.ContentPanel)}, 500);
		}
	}
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/HtmlNode.js');
};

DrawNode.prototype = new HtmlNode();
DrawNode.prototype.constructor = DrawNode;
DrawNode.prototype.parent = HtmlNode.prototype;
function DrawNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/DrawNode.js');
};

MySystemNode.prototype = new HtmlNode();
MySystemNode.prototype.constructor = MySystemNode;
MySystemNode.prototype.parent = HtmlNode.prototype;
function MySystemNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
};

MySystemNode.prototype.updateJSONContentPath = function(base, contentString){
	this.filename = "modules.json";
	var rExp = new RegExp(this.filename);
	var contentString = contentString.replace(rExp, base + '/' + this.filename);
	return contentString;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/MySystemNode.js');
};
/*
 * MatchSequenceNode
 */

MatchSequenceNode.prototype = new Node();
MatchSequenceNode.prototype.constructor = MatchSequenceNode;
MatchSequenceNode.prototype.parent = Node.prototype;
function MatchSequenceNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
}

MatchSequenceNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, msNode){			
			msNode.contentPanel.document.open();
			msNode.contentPanel.document.write(msNode.injectBaseRef(injectVleUrl(text)));
			msNode.contentPanel.document.close();
			if(msNode.contentPanel.name!='ifrm'){
				msNode.contentPanel.renderComplete = function(){
					msNode.load();
				};
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/matchsequence/matchsequence.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};


MatchSequenceNode.prototype.load = function() {
	var xmlCustomCheck = this.element.getElementsByTagName("customCheck");
	if(xmlCustomCheck[0]!=null){
		xmlCustomCheck = xmlCustomCheck[0].firstChild.nodeValue;
	} else {
		xmlCustomCheck = null;
	};
	
	this.contentPanel.loadContent(this.getXMLString(), xmlCustomCheck);
	this.insertPreviousWorkIntoPage(this.contentPanel.document);
};

MatchSequenceNode.prototype.getDataXML = function(nodeStates) {
	return MatchSequenceNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
MatchSequenceNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an MSSTATE object and put it into the array that we will return
		 */
		var stateObject = MSSTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		}
	}
	
	return statesArrayObject;
}

MatchSequenceNode.prototype.onExit = function() {
	
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/MatchSequenceNode.js');
};
/*
 * FillinNode
 */

FillinNode.prototype = new Node();
FillinNode.prototype.constructor = FillinNode;
FillinNode.prototype.parent = Node.prototype;
function FillinNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
}

FillinNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, fiNode){
			if(fiNode.filename!=null && vle.project.lazyLoading){ //load element from file
				fiNode.retrieveFile();
			};
			
			fiNode.contentPanel.document.open();
			fiNode.contentPanel.document.write(fiNode.injectBaseRef(injectVleUrl(text)));
			fiNode.contentPanel.document.close();
			
			if(fiNode.contentPanel.name!='ifrm'){
				fiNode.contentPanel.renderComplete = function(){
					fiNode.load();
				};
			};
		};
		
		/*
		 * check if the user had clicked on an outside link in the previous
		 * step
		 */
		if(this.handlePreviousOutsideLink(this)) {
			/*
			 * the user was at an outside link so the function
			 * handlePreviousOutsideLink() has taken care of the
			 * rendering of this node
			 */
			return;
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/fillin/fillin.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

FillinNode.prototype.load = function() {
	var load = function(event, args, fiNode){
		if(!fiNode){//Firefox only passes the obj
			fiNode = event;
		};
		
		fiNode.contentPanel.loadContent([fiNode.element, vle]);
		fiNode.insertPreviousWorkIntoPage(fiNode.contentPanel.document);
	};
	
	if(this.contentLoaded){
		load(this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, load, this);
	};
};

FillinNode.prototype.getDataXML = function(nodeStates) {
	return FillinNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
FillinNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an FILLINSTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(FILLINSTATE.prototype.parseDataXML(stateXML));
	}
	
	return statesArrayObject;
}

/**
 * Takes in a state JSON object and returns a FILLINSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return a FILLINSTATE object
 */
FillinNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return FILLINSTATE.prototype.parseDataJSONObj(stateJSONObj);
}

FillinNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<jaxbXML><![CDATA[";
	exportXML += this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	exportXML += "]]></jaxbXML>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

FillinNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/FillinNode.js');
};
/*
 * FlashNode
 * interfaces VLE and Flash via javascript
 * Flash can invoke javascript and javascript can invoke Flash via specific interfaces
 * see here for interface API: link_goes_here
 */

FlashNode.prototype = new Node();
FlashNode.prototype.constructor = FlashNode;
FlashNode.prototype.parent = Node.prototype;
function FlashNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
}

FlashNode.prototype.setContent = function(content) {
	//update the content attribute that contains the html
	this.content = content;
}


FlashNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if (this.elementText != null) {
		this.content = this.elementText;
	} else if (this.filename != null) {
		if(window.ActiveXObject) {
			this.content = this.element.xml;
		} else {
			this.content = (new XMLSerializer()).serializeToString(this.element);
		};
	} else if(this.content == null) {
		this.content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	};
	
	if(contentPanel == null) {
		this.contentPanel = window.frames["ifrm"];
	} else {
		this.contentPanel = window.frames[contentPanel.name];
	};
	
	if (this.contentPanel.document) {
		this.writeHTML(this.contentPanel.document);
	} else {
		this.writeHTML(window.frames["ifrm"].document);
	};
};

FlashNode.prototype.writeHTML = function(doc){
	this.replaceVars(doc);
	doc.open();
	doc.write(this.content);
	doc.close();
};

FlashNode.prototype.replaceVars = function(){
	var objSrchStrStart = '<param name="movie" value="';
	var objSrchStrEnd = '"/>';
	var base = vle.project.contentBaseUrl;
	if(base){
		base = base + '/';
	} else {
		base = "";
	};
	
	var obs = this.content.match(/<object.*>(.|\n|\r)*<\/object.*>/i);
	for(var z=0;z<obs.length;z++){
		if(obs[z] && obs[z]!="" && obs[z]!='\n' && obs[z]!='\r' && obs[z]!='\t' && obs[z]!= " "){
			var startIndex = obs[z].indexOf(objSrchStrStart) + objSrchStrStart.length;
			var endIndex = obs[z].indexOf('"', startIndex);
			var filename = obs[z].substring(startIndex, endIndex);
			var exp = new RegExp(filename, 'g');
			this.content = this.content.replace(exp, base + filename);
		};
	};
};

FlashNode.prototype.load = function() {
	this.createFlashJSInterface();
		
	document.getElementById('topStepTitle').innerHTML = this.title;
};

FlashNode.prototype.getDataXML = function(nodeStates) {
	return "";
}

FlashNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesArrayObject = new Array();
	return statesArrayObject;
}


FlashNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<content><![CDATA[";
	exportXML += this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	exportXML += "]]></content>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

FlashNode.prototype.createFlashJSInterface = function(){
	window.frames["ifrm"].showJsAlert = function(){alert('calling js from flash');};
	window.frames["ifrm"].callToFlash = function(flashObjId){
		if(navigator.appName.indexOf("Microsoft")!=-1){
			window.frames["ifrm"].window[flashObjId].callToFlash();
		} else {
			window.frames["ifrm"].document[flashObjId].callToFlash();
		};
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/FlashNode.js');
};
/*
 * NoteNode is a child of openresponse
 */

NoteNode.prototype = new OpenResponseNode();
NoteNode.prototype.constructor = NoteNode;
NoteNode.prototype.parent = OpenResponseNode.prototype;
function NoteNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
};

NoteNode.prototype.renderFrame = function(){
	/*
	 * check if the notePanel has already been created, if not we will
	 * create it. we also need to check if the element 'noteiframe' is
	 * null because safari 4.0 has some bug which causes the notePanel
	 * to be not null but the 'noteiframe' to be null.
	 */
	if (document['notePanel_' + this.id] == null || document.getElementById('noteiframe' + this.id) == null) {
		var panelDiv = createElement(document, 'div', {id: 'notePanelDiv_' + this.id});
		var headDiv = createElement(document, 'div', {'class': 'noteHead'});
		var bodyDiv = createElement(document, 'div', {'class': 'noteBody'});
		var footDiv = createElement(document, 'div', {'class': 'noteFooter'});
		
		document.getElementById('centeredDiv').appendChild(panelDiv);
		panelDiv.appendChild(headDiv);
		panelDiv.appendChild(bodyDiv);
		panelDiv.appendChild(footDiv);	
		
		//The second argument passed to the
	    //constructor is a configuration object:
		document['notePanel_' + this.id] = new YAHOO.widget.Panel("notePanelDiv_" + this.id, {
			width: "650px",
			height: "625px",
			fixedcenter: false,
			constraintoviewport: true,
			underlay: "shadow",
			y:55,
			close: true,
			visible: false,
			draggable: true
		});
		
		document['notePanel_' + this.id].setHeader("Reflection Note");
		document['notePanel_' + this.id].setBody("<iframe name=\"noteiframe" + this.id + "\" id=\"noteiframe" + this.id + "\" frameborder=\"0\" width=\"100%\" height=\"100%\" src=\"node/openresponse/note.html\"><iframe>");
		

		document['notePanel_' + this.id].cfg.setProperty("underlay", "matte");
		document['notePanel_' + this.id].render();
	};
};

NoteNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){//content is available, proceed with render
		var renderAfterGet = function(text, xml, orNode){			
			orNode.contentPanel.document.open();
			text = text.replace(/(\.\.\/\.\.\/)/gi, ''); //remove '../../' in any references because this should not be the note panel
			orNode.contentPanel.document.write(orNode.injectBaseRef(text));
			orNode.contentPanel.document.close();
			if(orNode.contentPanel.name!='noteiframe' + this.id){
				orNode.contentPanel.renderComplete = function(){
					orNode.load();
				};
			};
		};
		
		var nodeVisits = vle.state.getNodeVisitsByNodeId(this.id);
		var states = [];
		for (var i=0; i < vle.state.visitedNodes.length; i++) {
			var nodeVisit = vle.state.visitedNodes[i];
			if (nodeVisit.getNodeId() == this.id) {
				for (var j=0; j<nodeVisit.nodeStates.length; j++) {
					states.push(nodeVisit.nodeStates[j]);
				}
			}
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {//using YUI panel, load content into panel and return
			this.contentPanel = window.frames['noteiframe' + this.id];
			this.contentPanel.loadContent([this.element, vle, states]);
			document['notePanel_' + this.id].cfg.setProperty('visible', true);
			this.insertPreviousWorkIntoPage(this.contentPanel.document);
			return;
		};
		
		vle.connectionManager.request('GET', 1, 'node/openresponse/note.html', null,  renderAfterGet, this);
	} else {
		//content is not available, wait for content loading event
		//to complete, then call render again
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

NoteNode.prototype.load = function() {
	var nodeVisits = vle.state.getNodeVisitsByNodeId(this.id);
	var states = [];
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var nodeVisit = vle.state.visitedNodes[i];
		if (nodeVisit.getNodeId() == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			};
		};
	};
		
	this.contentPanel.loadContent([this.element, vle, states]);
	
	this.insertPreviousWorkIntoPage(this.contentPanel.document);
};

/**
 * Called when the step is exited. This is used for auto-saving.
 */
NoteNode.prototype.onExit = function() {
	//check if the content panel exists
	if(this.contentPanel && this.contentPanel.save) {
		//tell the content panel to save
		this.contentPanel.save();
	}
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/NoteNode.js');
};
/*
 * OutsideUrlNode
 */

OutsideUrlNode.prototype = new Node();
OutsideUrlNode.prototype.constructor = OutsideUrlNode;
OutsideUrlNode.prototype.parent = Node.prototype;
function OutsideUrlNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
};

OutsideUrlNode.prototype.getUrl = function(){
	return this.content.getContentJSON().url;
};

OutsideUrlNode.prototype.getDataXML = function(nodeStates) {
	return OutsideUrlNode.prototype.parent.getDataXML(nodeStates);
};


OutsideUrlNode.prototype.parseDataXML = function(nodeStatesXML) {
	return new Array();
}

OutsideUrlNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<url>";
	exportXML += this.element.getElementsByTagName("url")[0].firstChild.nodeValue;
	exportXML += "</url>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/OutsideUrlNode.js');
};
/*
 * MultipleChoiceNode
 */

MultipleChoiceNode.prototype = new Node();
MultipleChoiceNode.prototype.constructor = MultipleChoiceNode;
MultipleChoiceNode.prototype.parent = Node.prototype;
function MultipleChoiceNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	
	//mainly used for the ticker
	this.mc = null;
	this.contentBase;
	this.contentPanel;
	this.audioSupported = true;
	this.prevWorkNodeIds = [];
}

MultipleChoiceNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, mcNode){			
			mcNode.contentPanel.document.open();
			mcNode.contentPanel.document.write(mcNode.injectBaseRef(injectVleUrl(text)));
			mcNode.contentPanel.document.close();
			if(mcNode.contentPanel.name!='ifrm'){
				mcNode.contentPanel.renderComplete = function(){
					mcNode.load();
				};
			};
			mcNode.contentPanel.renderLoadComplete = function(){
				mcNode.onNodefullyloaded();
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/multiplechoice/multiplechoice.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

MultipleChoiceNode.prototype.load = function() {
	this.contentPanel.loadContent([this.elementText, this, vle]);
	this.insertPreviousWorkIntoPage(this.contentPanel.document);
};

/**
 * Renders barebones mc by entity other than VLE
 */
MultipleChoiceNode.prototype.renderLite = function(state){
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(state){
		this.liteState = state;
	};
	
	var callbackFun = function(text, xml, mcNode){
		mcNode.contentPanel.document.open();
		mcNode.contentPanel.document.write(mcNode.injectBaseRef(injectVleUrl(text)));
		mcNode.contentPanel.document.close();
		mcNode.contentPanel.renderComplete = function(){
			mcNode.loadLite();			
		};
	};
	
	var callback = {
		success: function(o){callbackFun(o.responseText, o.responseXML, o.argument);},
		failure: function(o){this.view.notificationManager.notify('failed to retrieve file', 3);},
		argument: this
	};
	
	YAHOO.util.Connect.asyncRequest('GET', 'node/multiplechoice/multiplechoicelite.html', callback, null);
};

/**
 * Loads barebones mc by entity other than VLE
 */
MultipleChoiceNode.prototype.loadLite = function(){
	this.contentPanel.loadContent([this.element, this, vle, this.liteState]);
};

/**
 * @return an xml string that represents the current state of this
 * node which includes the student's submitted data
 */
MultipleChoiceNode.prototype.getDataXML = function(nodeStates) {
	return MultipleChoiceNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with real state object instances
 */
MultipleChoiceNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an MCSTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(MCSTATE.prototype.parseDataXML(stateXML));
	}
	return statesArrayObject;
}

/**
 * Takes in a state JSON object and converts it into an MCSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return an MCSTATE object
 */
MultipleChoiceNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return MCSTATE.prototype.parseDataJSONObj(stateJSONObj);
}

/**
 * Creates XML string representation of this node
 * @return an XML MultipleChoiceNode string that includes the content
 * of the node. this is for authoring when we want to convert the
 * project back from the authored object into an xml representation 
 * for saving.
 */
MultipleChoiceNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<jaxbXML><![CDATA[";
	exportXML += this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	exportXML += "]]></jaxbXML>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

/**
 * Retrieves the latest student work for this node and returns it in
 * a query entry object
 * @param vle the vle that this node has been loaded into, this vle
 * 		is related to a specific student, so all the work in this vle
 * 		is for just one student
 * @return a MultipleChoiceQueryEntry that contains the latest student
 * 		work for this node. return null if this student has not accessed
 * 		this step yet.
 */
MultipleChoiceNode.prototype.getLatestWork = function(vle) {
	var latestState = null;
	
	//setup the mc object by loading in the content of the step
	this.mc = new MC(loadXMLString(this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue));
	
	//load the states from the vle into the mc object
	this.mc.loadForTicker(this, vle);
	
	//get the most recent student work for this step
	latestState = this.mc.getLatestState(this.id);
	
	if(latestState == null) {
		//the student has not accessed or completed this step yet
		return null;
	}
	
	//create and return a query entry object
	return new MultipleChoiceQueryEntry(vle.getWorkgroupId(), vle.getUserName(), this.id, this.mc.promptText, latestState.getIdentifier(), this.mc.getCHOICEByIdentifier(latestState.getIdentifier()).text);
}

/**
 * Returns the prompt for this node by loading the MC content and then
 * obtaining it from the MC
 * @return the prompt for this node
 */
MultipleChoiceNode.prototype.getPrompt = function() {
	var xmlDoc=loadXMLString(this.getXMLString());
	this.mc = new MC(xmlDoc);
	
	//return the prompt as a string
	return this.mc.promptText;
}

/**
 * Create a query container that will contain all the query entries
 * @param vle the vle that this node has been loaded into, this vle
 * 		is related to a specific student, so all the work in this vle
 * 		is for just one student
 * @return a MultipleChoiceQueryContainer that will contain all the
 * 		query entries for a specific nodeId as well as accumulated 
 * 		metadata about all those entries such as count totals, etc.
 */
MultipleChoiceNode.prototype.makeQueryContainer = function(vle) {
	//setup the mc object by loading in the content of the step
	this.mc = new MC(loadXMLString(this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue));
	
	//load the states from the vle into the mc object
	this.mc.loadForTicker(this, vle);
	
	//create and return a query container object
	return new MultipleChoiceQueryContainer(this.id, this.mc.promptText, this.mc.choiceToValueArray);
}

/**
 * Translate an identifier to the corresponding value such as
 * choice1 to "The fish was swimming"
 * We need to create an MC object in order to look up the identifiers
 * @param identifier the id of the choice
 * @return the string value of the choice
 */
MultipleChoiceNode.prototype.translateStudentWork = function(identifier) {
	//create an MC object so we can look up the value corresponding to an identifier
	this.mc = new MC(loadXMLString(this.getXMLString()));
	
	//return the value as a string
	return this.mc.getCHOICEByIdentifier(identifier).text;
}
/**
 * Given an xmlDoc of state information, returns a new state
 * @param stateXML
 * @return
 */
MultipleChoiceNode.prototype.parseStateXML = function(stateXML){
	return MCSTATE.prototype.parseDataXML(stateXML);
};


MultipleChoiceNode.prototype.onExit = function() {
	
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/MultipleChoiceNode.js');
};
/**
 * BrainstormNode
 *
 * @author: patrick lawler
 */

BrainstormNode.prototype = new Node();
BrainstormNode.prototype.constructor = BrainstormNode;
BrainstormNode.prototype.parent = Node.prototype;
function BrainstormNode(nodeType, view) {
	this.view = view
	this.type = nodeType;
	this.audioSupported = true;
	this.serverless = true;
	this.prevWorkNodeIds = [];
};

/**
 * Determines if the this step is using a server back end.
 * @return
 */
BrainstormNode.prototype.isUsingServer = function() {
	if(this.content.getContentJSON().useServer) {
		//we are using a server back end
		this.serverless = false;
		return true;
	} else {
		//we are not using a server back end
		this.serverless = true;
		return false;
	}
};

BrainstormNode.prototype.getDataXML = function(nodeStates) {
	return BrainstormNode.prototype.parent.getDataXML(nodeStates);
};

BrainstormNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		var stateObject = BRAINSTORMSTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		};
	};
	
	return statesArrayObject;
};

/**
 * Takes in a state JSON object and returns a BRAINSTORMSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return a BRAINSTORMSTATE object
 */
BrainstormNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return BRAINSTORMSTATE.prototype.parseDataJSONObj(stateJSONObj);
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/BrainstormNode.js');
};
/**
 * A GlueNode is a node that renders 1 or more children in a single page
 *
 * @author: patrick lawler
 */

GlueNode.prototype = new Node();
GlueNode.prototype.constructor = GlueNode;
GlueNode.prototype.parent = Node.prototype;
function GlueNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
};

GlueNode.prototype.renderPrev = function(){
	this.contentPanel.renderPrev();
};

GlueNode.prototype.renderNext = function(){
	this.contentPanel.renderNext();
};

GlueNode.prototype.getDataXML = function(nodeStates) {
	return GlueNode.prototype.parent.getDataXML(nodeStates);
};

GlueNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		var stateObject = GLUESTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		};
	};
	
	return statesArrayObject;
};


/**
 * Takes in a state JSON object and converts it into an GLUESTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return an GLUESTATE object
 */
GlueNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return GLUESTATE.prototype.parseDataJSONObj(stateJSONObj);
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/GlueNode.js');
};
DataGraphNode.prototype = new Node();
DataGraphNode.prototype.constructor = DataGraphNode;
DataGraphNode.prototype.parent = Node.prototype;
function DataGraphNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.contentPanel;
	this.prevWorkNodeIds = [];
};

DataGraphNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, dgNode){			
			dgNode.contentPanel.document.open();
			dgNode.contentPanel.document.write(dgNode.injectBaseRef(injectVleUrl(text)));
			dgNode.contentPanel.document.close();
			if(dgNode.contentPanel.name!='ifrm'){
				dgNode.contentPanel.renderComplete = function(){
					dgNode.load();
				};
			};
			
			dgNode.contentPanel.renderLoadComplete = function(){
				dgNode.onNodefullyloaded();
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/datagraph/datagraph.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

DataGraphNode.prototype.load = function() {
	var load = function(event, args, dgNode){
		if(!dgNode){//Firefox only passes the obj
			dgNode = event;
		};
		
		var state;
		for (var i=0; i < vle.state.visitedNodes.length; i++) {
			var nodeVisit = vle.state.visitedNodes[i];
			if (nodeVisit.getNodeId() == dgNode.id) {
				if(nodeVisit.nodeStates.length>0){
					state = nodeVisit.nodeStates[nodeVisit.nodeStates.length -1];
				};
			};
		};
		
		dgNode.contentPanel.loadContent([dgNode.element, vle, state]);
		dgNode.insertPreviousWorkIntoPage(dgNode.contentPanel.document);
	};
	
	if(this.contentLoaded){
		load(this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, load, this);
	};
};

DataGraphNode.prototype.getDataXML = function(nodeStates) {
	return DataGraphNode.prototype.parent.getDataXML(nodeStates);
};

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
DataGraphNode.prototype.parseDataXML = function(nodeStatesXML) {
	//TODO implement me
};

/**
 * Takes in a state JSON object and returns a DATAGRAPHSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return a DATAGRAPHSTATE object
 */
DataGraphNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	//TODO implement me
};

DataGraphNode.prototype.exportNode = function() {
	//TODO implement me
};

DataGraphNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/DataGraphNode.js');
};

SVGDrawNode.prototype = new HtmlNode();
SVGDrawNode.prototype.constructor = SVGDrawNode;
SVGDrawNode.prototype.parent = HtmlNode.prototype;
function SVGDrawNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
};

SVGDrawNode.prototype.updateJSONContentPath = function(base){
	var rExp = new RegExp(this.filename);
	this.content.replace(rExp, base + '/' + this.filename);
};


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/SVGDrawNode.js');
};
