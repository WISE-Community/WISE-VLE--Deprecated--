/**
 * WISE project navigation menu (WMenu)
 * (Originally based on the Slashdot Menu by DimX: http://www.dynamicdrive.com/dynamicindex1/slashdot.htm)
 * Visual layout and styling of navigation menu is handled by the WISE theme architecture (see 'navigation'
 * directory in each WISE theme folder)
 */

function WMenu(id) {
	if (!document.getElementById || !document.getElementsByTagName)
		return false;
	this.menu = document.getElementById(id);
	this.submenus = $('.sequence',this.menu);
	this.oneSmOnly = false;
}
WMenu.prototype.init = function() {
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
	
	setTimeout(function(){ // temporary kludge to fix problem with menu not resizing properly (in default WISE theme)
		eventManager.fire('navigationMenuCreated');
	},1000);
};

WMenu.prototype.toggleSequence = function(submenu) {
	if ($(submenu).hasClass('inactive')) {
		this.expandMenu(submenu);
	} else {
		this.collapseMenu(submenu);
	}
};

WMenu.prototype.expandMenu = function(submenu) {
	if ($(submenu).hasClass('inactive')){
		$(submenu).removeClass('inactive').addClass('active');
		$(submenu).children('.step').removeClass('inactive').addClass('active');
		$(submenu).children('.nested').removeClass('hide').addClass('show');
		this.collapseOthers(submenu);
		eventManager.fire('navSequenceOpened',submenu);
	}
};

WMenu.prototype.collapseMenu = function(submenu) {
	if ($(submenu).hasClass('active')){
		$(submenu).addClass('inactive').removeClass('active');
		$(submenu).children('.step').addClass('inactive').removeClass('active');
		$(submenu).children('.nested').addClass('hide').removeClass('show');
		eventManager.fire('navSequenceClosed',submenu);
	}
};

WMenu.prototype.collapseOthers = function(submenu) {
	if (this.oneSmOnly) {
		for (var i = 0; i < this.submenus.length; i++){
			//if (this.submenus[i] != submenu && this.submenus[i].className != "collapsed"){
			if (this.submenus[i] != submenu) {
				this.collapseMenu(this.submenus[i]);
			};
		};
	};
};

WMenu.prototype.forceCollapseOthers = function(submenu){
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
WMenu.prototype.forceCollapseOthersNDeep = function(submenuArray){
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

WMenu.prototype.expandAll = function() {
	var oldOneSmOnly = this.oneSmOnly;
	this.oneSmOnly = false;
	for (var i = 0; i < this.submenus.length; i++){
		this.expandMenu(this.submenus[i]);
	}
	this.oneSmOnly = oldOneSmOnly;
};

WMenu.prototype.collapseAll = function() {
	eventManager.fire('menuCollapseAllNonImmediate');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/ui/menu/wmenu.js');
}