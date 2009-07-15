var fi;   // global variable so it can be accessed by other functions
var states = [];  // array of FILLINSTATE objects

var currentTextEntryInteractionIndex = 0;

function edit() {
	fi.edit();
}

/**
 * Runs after the scripts for this page have been dynamically loaded
 */
function loadContent(params){
	  fi = new FILLIN(params[0]);
	  fi.render(currentTextEntryInteractionIndex);
	  fi.setVLE(params[1]);
	  afterScriptsLoad();
};

function checkAnswer() {
	fi.checkAnswer();
}

function tryAgain() {
	fi.tryAgain();
}

function next() {
	var isNextDisabled = hasClass("nextButton", "disabledLink");

	if (isNextDisabled) {
		return;
	}

	currentTextEntryInteractionIndex++;
	fi.render(currentTextEntryInteractionIndex);
};

var newWin = null;
function popUp(strURL, strType, strHeight, strWidth) {
 if (newWin != null && !newWin.closed)
   newWin.close();
 var strOptions="";
 if (strType=="console")
   strOptions="resizable,height="+
     strHeight+",width="+strWidth;
 if (strType=="fixed")
   strOptions="status,height="+
     strHeight+",width="+strWidth;
 if (strType=="elastic")
   strOptions="toolbar,menubar,scrollbars,"+
     "resizable,location,height="+
     strHeight+",width="+strWidth;
 newWin = window.open(strURL, 'newWin', strOptions);
 newWin.focus();
}

function afterScriptsLoad(){

}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/fillin/fillinhtml.js");