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
		bodyNode = global_yui.get(window.frames['ifrm'].frames[frameName].document.body);
	} else {
		bodyNode = global_yui.get(window.frames["ifrm"].document.body);
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

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/common/helperfunctions.js");