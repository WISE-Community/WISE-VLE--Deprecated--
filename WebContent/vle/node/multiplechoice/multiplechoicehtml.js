var mc; // global variable so it can be accessed by other functions
      
function loadContent(params){
	xmlDoc = loadXMLString(params[0]);
	mc = new MC(xmlDoc);
	mc.render();
	mc.loadFromVLE(params[1], params[2]);
};
            
function checkAnswer(){
	mc.checkAnswer();
};

function tryAgain(){
	var isTryAgainDisabled = hasClass("tryAgainButton", "disabledLink");
               
	if (isTryAgainDisabled) {
		return;
	}
           
	mc.render();
};

var newWin = null;
function popUp(strURL, strType, strHeight, strWidth){
	if (newWin != null && !newWin.closed){
		newWin.close();
		var strOptions = "";
		if (strType == "console") strOptions = "resizable,height=" + strHeight + ",width=" + strWidth;
		if (strType == "fixed") strOptions = "status,height=" + strHeight + ",width=" + strWidth;
		if (strType == "elastic") strOptions = "toolbar,menubar,scrollbars," + "resizable,location,height=" + strHeight + ",width=" + strWidth;
	
		newWin = window.open(strURL, 'newWin', strOptions);
		newWin.focus();
	};
};

//used to notify scriptloader that this script has finished loading
if(scriptloader){
	scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/multiplechoice/multiplechoicehtml.js");
};