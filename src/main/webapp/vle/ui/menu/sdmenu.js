function SDMenu(id) {
	if (!document.getElementById || !document.getElementsByTagName)
		return false;
	this.menu = document.getElementById(id);
	this.submenus = $('.sequence',this.menu);
	this.remember = true;
	this.oneSmOnly = false;
}
SDMenu.prototype.init = function() {
	//show/expand first menu, hide/collapse all others
	for(var k=0;k<this.submenus.length;k++){
		var submenu = this.submenus[k];
		if(k==0){
			$(submenu).addClass('inactive');
			this.expandMenu(submenu);
		} else {
			$(submenu).addClass('active');
			this.collapseMenu(submenu);
		};
	};
	
	eventManager.fire('navigationMenuCreated');
};

SDMenu.prototype.toggleSequence = function(submenu) {
	if ($(submenu).hasClass('inactive')) {
		this.expandMenu(submenu);
	} else {
		this.collapseMenu(submenu);
	}
};

SDMenu.prototype.expandMenu = function(submenu) {
	if ($(submenu).hasClass('inactive')){
		$(submenu).removeClass('inactive').addClass('active');
		$(submenu).children('.step').removeClass('inactive').addClass('active');
		$(submenu).children('.nested').removeClass('hide').addClass('show');
		this.collapseOthers(submenu);
		eventManager.fire('navSequenceOpened',submenu);
	}
};

SDMenu.prototype.collapseMenu = function(submenu) {
	if ($(submenu).hasClass('active')){
		$(submenu).addClass('inactive').removeClass('active');
		$(submenu).children('.step').addClass('inactive').removeClass('active');
		$(submenu).children('.nested').addClass('hide').removeClass('show');
		eventManager.fire('navSequenceClosed',submenu);
		this.memorize();
	}
};

SDMenu.prototype.collapseOthers = function(submenu) {
	if (this.oneSmOnly) {
		for (var i = 0; i < this.submenus.length; i++){
			//if (this.submenus[i] != submenu && this.submenus[i].className != "collapsed"){
			if (this.submenus[i] != submenu) {
				this.collapseMenu(this.submenus[i]);
			};
		};
	};
};

SDMenu.prototype.forceCollapseOthers = function(submenu){
	for (var i = 0; i < this.submenus.length; i++){
		//if (this.submenus[i] != submenu && this.submenus[i].className != "collapsed"){
		if (this.submenus[i] != submenu) {
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
	for (var i = 0; i < this.submenus.length; i++){
		this.expandMenu(this.submenus[i]);
	}
	this.oneSmOnly = oldOneSmOnly;
};

SDMenu.prototype.collapseAll = function() {
	eventManager.fire('menuCollapseAllNonImmediate');
};

SDMenu.prototype.memorize = function() {
	if (this.remember) {
		var states = new Array();
		for (var i = 0; i < this.submenus.length; i++) {
			//states.push(this.submenus[i].className == "collapsed" ? 0 : 1);
			//if(this.containsClass(this.submenus[i], "collapsed")) {
			if($(this.submenus[i]).hasClass('inactive')) {
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

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/ui/menu/sdmenu.js');
}