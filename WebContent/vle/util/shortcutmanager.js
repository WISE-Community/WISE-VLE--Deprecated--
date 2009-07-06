/**
 * The shortcutManager is an Object that manages
 * keyboard shortcuts.
 *
 * Usage:
 *
 * shortcutManager.start();
 * starts the shortcutManager and activates its listener
 *
 * The shortcutManager can also be started with an array of
 * shortcuts that it should listen for:
 * shortcutManager.start([[38, 'helloFun', 'ctrl'], [38, 'worldFun', 'alt']])
 * The above would create two shortcut objects and the shortcutManager
 * would listen for the keystrokes: 38 + ctrl and 38 + alt and run the
 * associated functions respectively.
 *
 * If the functions live in a place other than the html that the shortcutManager
 * script loads (such as an object like the vle), than the optional
 * scope argument must be supplied. The above would then look like this if called from
 * within the vle:
 * shortcutManager.start([[38, 'helloFun', 'ctrl', this], [38, 'worldFun', 'alt', this]])
 *
 * or like this if the functions live in the vle but shortcutManager is started outside
 * the vle:
 * shortcutManager.start([[38, 'helloFun', 'ctrl', vle], [38, 'worldFun', 'alt', vle]])
 *
 * Shortcuts can also be added one at a time:
 * shortcutManager.addShortcut(keyCode, function, Array, scope)
 *
 * addShortcut takes four parameters: keyCode - the keyCode of
 * the key to listen for, function - the function to run when the
 * key specified in keycode is pressed (in conjunction with any specialKeys),
 * an optional Array which contains the special keys that are listened for
 * along with the keyCode, and optional scope - the place where the functions
 * live. 
 
 * If scope is not supplied, shortcutManager assumes the functions live in the
 * html that it was loaded into. Special keys are: 'ctrl', 'alt' and 'shift'.
 * More than one special key can be specified in the array. ['ctrl', 'alt']
 * If no Array is passed in, then the shortcutManager just listens for
 * the keystroke specified by keyCode. 
 *
 * Example (39 is the keyCode for the right arrow):
 *		var alone = function(){alert('I got called alone!');};
 *		var ctrl = function(){alert('I got called ctrl!');};
 *		var ctrlAlt = function(){alert('I got called ctrl + alt!');};
 *
 * 		shortcutManager.addShortcut(39, 'ctrl', ['ctrl']);
 * 		shortcutManager.addShortcut(39, 'ctrlAlt', ['ctrl', 'alt']);
 * 		shortcutManager.addShortcut(39, 'alone');
 * 		shortcutManager.start();
 *
 * 		When the right arrow key is pressed by itself 'I got called alone!' is alerted
 *		When the right arrow key is pressed in conjunction with the control key,
 *      	'I got called ctrl!' is alerted.
 *		When the right arrow key is pressed in conjunction with the control and alt
 *			keys 'I got called ctrl + alt!' is alerted.
 */
var shortcutManager = {
	scope: null,
	//empty object that will contain shortcut objects as they are added
	shortcuts: {},
	/**
	 * Adds any shortcuts specified in the optional shortcuts array and
	 * starts listener
	 *
	 * @param: shortcuts - an optional array of arrays that contain the same
	 *		shortcut arguments that would be used when calling addShortcut
	 */
	start: function(scope, shortcuts){
		if(shortcuts){
			for(var r=0;r<shortcuts.length;r++){
				this.addShortcut(shortcuts[r][0], shortcuts[r][1], shortcuts[r][2], shortcuts[r][3]);
			};
		};
		
		this.scope = scope;
		this._startListener();
	},
	//listens for keydown events
	_startListener: function(){
		window.onkeydown = this.processEvent;
	},
	processEvent: function(e){
		var shortcut = shortcutManager.shortcuts[e.keyCode];
		
		if(shortcut){//only continue processing if shortcut with that keyCode has been created
			//get any special keys that are currently being pressed
			var activeSpecials = [];
			if(e.ctrlKey){
				activeSpecials.push('ctrl');
			};
			if(e.altKey){
				activeSpecials.push('alt');
			};
			if(e.shiftKey){
				activeSpecials.push('shift');
			};
			
			for(var e=0;e<shortcut.special.length;e++){
				var special = shortcut.special[e];
				//if special keys exist, compare against active special keys
				//if match, run associated function
				if(special && special.length==activeSpecials.length){
					special.sort();
					activeSpecials.sort();
					if(special.compare(activeSpecials)){
						if(shortcut.scope[e]){
							shortcut.scope[e][shortcut.fun[e]]();
						} else {
							this[shortcut.fun[e]]();
						};
					};
				//if special keys do not exist and no active special keys
				//then run asssociated function
				} else if(!special && activeSpecials.length==0){
					if(shortcut.scope[e]){
						shortcut.scope[e][shortcut.fun[e]]();
					} else {
						this[shortcut.fun[e]]();
					};
				};
			};
		};
	},
	//stops listener
	stop: function(){
		window.onkeydown = null;
	},
	/**
	 * Adds a shortcut
	 *
	 * @param: keyCode - the keyCode of the key to listen for
	 * @param: fun - a function to run when the keys have been pressed
	 * @param: specialKeys - an optional array of special keys('alt', 'shift', 'ctrl')
	 *		to listen for, can be null
	 */
	addShortcut: function(keyCode, fun, specialKeys, scope){
		if(keyCode && fun){
			var shortcut =  this.shortcuts[keyCode];
			if(!shortcut){
				this.shortcuts[keyCode] = {
					special: [],
					fun: [],
					scope: []
				};
				shortcut = this.shortcuts[keyCode];
			};
			shortcut.special.push(specialKeys);
			shortcut.fun.push(fun);
			shortcut.scope.push(scope);
		} else {
			alert('unable to add shortcut, check the keyCode or specialKeys');
		};
	}
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

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/util/shortcutmanager.js");