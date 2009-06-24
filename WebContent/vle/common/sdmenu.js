function SDMenu(id) {
	if (!document.getElementById || !document.getElementsByTagName)
		return false;
	this.menu = document.getElementById(id);
	this.submenus = this.menu.getElementsByTagName("div");
	this.remember = true;
	this.speed = 5;
	this.markCurrent = true;
	this.oneSmOnly = false;
}
SDMenu.prototype.init = function() {
	var mainInstance = this;
	for (var i = 0; i < this.submenus.length; i++)
		this.submenus[i].getElementsByTagName("span")[0].onclick = function() {
			mainInstance.toggleMenu(this.parentNode);
		};
	if (this.markCurrent) {
		var links = this.menu.getElementsByTagName("a");
		for (var i = 0; i < links.length; i++)
			if (links[i].href == document.location.href) {
				//links[i].className = "current";
				this.addClass(links[i], "current");
				break;
			}
	}
	
	//open first menu, collapse all others
	for(var k=0;k<this.submenus.length;k++){
		if(k==0){
			//this.submenus[k].className = "";
			this.removeClass(this.submenus[k], "collapsed");
		} else {
			//this.submenus[k].className = "collapsed";
			this.addClass(this.submenus[k], "collapsed");
		};
	};
};
SDMenu.prototype.toggleMenu = function(submenu) {
	//if (submenu.className == "collapsed")
	if (this.containsClass(submenu,"collapsed")) {
		this.expandMenu(submenu);
	} else {
		this.collapseMenu(submenu);
	}
};
SDMenu.prototype.expandMenu = function(submenu) {
	var fullHeight = submenu.getElementsByTagName("span")[0].offsetHeight;
	var links = submenu.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++)
		fullHeight += links[i].offsetHeight;
	var moveBy = Math.round(this.speed * links.length);
	
	var mainInstance = this;
	var intId = setInterval(function() {
		var curHeight = submenu.offsetHeight;
		var newHeight = curHeight + moveBy;
		if (newHeight < fullHeight)
			submenu.style.height = newHeight + "px";
		else {
			clearInterval(intId);
			submenu.style.height = "";
			//submenu.className = "";
			SDMenu.prototype.removeClass(submenu, "collapsed");
			mainInstance.memorize();
		}
	}, 30);
	this.collapseOthers(submenu);
};
SDMenu.prototype.collapseMenu = function(submenu) {
	var minHeight = submenu.getElementsByTagName("span")[0].offsetHeight;
	var moveBy = Math.round(this.speed * submenu.getElementsByTagName("a").length);
	var mainInstance = this;
	var intId = setInterval(function() {
		var curHeight = submenu.offsetHeight;
		var newHeight = curHeight - moveBy;
		if (newHeight > minHeight)
			submenu.style.height = newHeight + "px";
		else {
			clearInterval(intId);
			submenu.style.height = "";
			//submenu.className = "collapsed";
			SDMenu.prototype.addClass(submenu, "collapsed");
			mainInstance.memorize();
		}
	}, 30);
};
SDMenu.prototype.collapseOthers = function(submenu) {
	if (this.oneSmOnly) {
		for (var i = 0; i < this.submenus.length; i++){
			//if (this.submenus[i] != submenu && this.submenus[i].className != "collapsed"){
			if (this.submenus[i] != submenu && !this.containsClass(this.submenus[i], "collapsed")) {
				this.collapseMenu(this.submenus[i]);
			};
		};
	};
};
SDMenu.prototype.forceCollapseOthers = function(submenu){
	for (var i = 0; i < this.submenus.length; i++){
		//if (this.submenus[i] != submenu && this.submenus[i].className != "collapsed"){
		if (this.submenus[i] != submenu && !this.containsClass(this.submenus[i], "collapsed")) {
			this.collapseMenu(this.submenus[i]);
		};
	};
};

/**
 * Collapse all items in the nav except for the ones in the argument
 * array
 * @param submenuArray an array containing DOM elements to keep open
 */
SDMenu.prototype.forceCollapseOthersNDeep = function(submenuArray){
	//loop through all the elements in the nav menu
	for (var i = 0; i < this.submenus.length; i++){
		/*
		 * boolean variable to keep track if the current element
		 * was found in the argument array
		 */
		var menuInParent = false;
		
		//loop through all the elements to keep open
		for(var x=0; x<submenuArray.length; x++) {
			if(submenuArray[x] == this.submenus[i]) {
				/*
				 * the nav element was found in the argument array so
				 * we will keep expand it to open it
				 */
				this.expandMenu(this.submenus[i]);
				menuInParent = true;
			}
		}

		/*
		 * if the nav menu item was not found in the argument array
		 * we will collapse it
		 */
		if(!menuInParent) {
			this.collapseMenu(this.submenus[i]);
		}
	};
};

SDMenu.prototype.expandAll = function() {
	var oldOneSmOnly = this.oneSmOnly;
	this.oneSmOnly = false;
	for (var i = 0; i < this.submenus.length; i++)
		//if (this.submenus[i].className == "collapsed")
		if(this.containsClass(this.submenus[i], "collapsed"))
			this.expandMenu(this.submenus[i]);
	this.oneSmOnly = oldOneSmOnly;
};
SDMenu.prototype.collapseAll = function() {
	for (var i = 0; i < this.submenus.length; i++)
		//if (this.submenus[i].className != "collapsed")
		if (this.containsClass(this.submenus[i], "collapsed"))
			this.collapseMenu(this.submenus[i]);
};
SDMenu.prototype.memorize = function() {
	if (this.remember) {
		var states = new Array();
		for (var i = 0; i < this.submenus.length; i++) {
			//states.push(this.submenus[i].className == "collapsed" ? 0 : 1);
			if(this.containsClass(this.submenus[i], "collapsed")) {
				states.push(0);
			} else {
				states.push(1);
			}
		}
		var d = new Date();
		d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
		document.cookie = "sdmenu_" + encodeURIComponent(this.menu.id) + "=" + states.join("") + "; expires=" + d.toGMTString() + "; path=/";
	}
};

/**
 * Adds a class to the element so it can be styled
 * @param element the DOM element
 * @param className the class to add
 */
SDMenu.prototype.addClass = function(element, className) {
	//check if the className is already set in the element
	if(element.className.indexOf(className) == -1) {
		//add the className since it isn't there
		element.className = element.className + " " + className;
	}
}

/**
 * Remove a class from the element
 * @param element the DOM element
 * @param className the class to remove
 */
SDMenu.prototype.removeClass = function(element, className) {
	//remove the className
	element.className = element.className.replace(className, "");
}

/**
 * See if the element currently has the className 
 * @param element the DOM element
 * @param className the class
 */
SDMenu.prototype.containsClass = function(element, className) {
	//check if the className string is in the element's class
	if(element.className.indexOf(className) != -1) {
		return true;
	} else {
		return false;
	}
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/common/sdmenu.js");