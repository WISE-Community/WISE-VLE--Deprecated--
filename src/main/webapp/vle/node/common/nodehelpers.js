/**
 * Node specific helpers
 */

function removeClassFromElement(identifier, classString) {
	$('#' + identifier).removeClass(classString);
};

function addClassToElement(identifier, classString) {
	$('#' + identifier).addClass(classString);
};

/**
 * returns true iff element with specified identifier has 
 * a class classString
 * @param identifier
 * @param classString
 * @return
 */
function hasClass(identifier, classString) {
	return $('#' + identifier).hasClass(classString);
};

/**
 * Clears innerHTML of a div with id=feedbackDiv
 */
function clearFeedbackDiv() {
	document.getElementById("feedbackDiv").innerHTML = "";
};

/**
 * Clears value of an element with id=responseBox
 */
function clearResponseBox() {
	document.getElementById("responseBox").value = "";
};

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
};

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
};

function setResponseBoxEnabled(doEnable) {
	var responseBox = document.getElementById('responseBox');
	if (doEnable) {
		responseBox.removeAttribute('disabled');
	} else {
		responseBox.setAttribute('disabled','disabled');
	}
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
 * Displays the number of attempts message e.g.
 * "This is your 2nd attempt."
 * @param part1 the beginning of the message e.g. "This is your"
 * @param part2 the end of the message e.g. "attempt"
 * @param numAttempts the number of attempts
 */
function displayNumberAttemptsMessage(part1, part2, numAttempts) {
	//get the message
	var numberAttemptsMessage = getNumberAttemptsMessage(part1, part2, numAttempts);
	
	//set the message in the div
	setNumberAttemptsMessage(numberAttemptsMessage);
}

/**
 * Make the number of attempts message e.g.
 * "This is your 2nd attempt."
 * @param part1 the beginning of the message e.g. "This is your"
 * @param part2 the end of the message e.g. "attempt"
 * @param numAttempts the number of attempts
 * @returns the number of attempts message string
 */
function getNumberAttemptsMessage(part1, part2, numAttempts) {
	var attemptsMessage = "";
	
	if(numAttempts == null) {
		
	} else if (numAttempts == 1) {
		attemptsMessage = "1st";		
	} else if (numAttempts == 2) {
		attemptsMessage = "2nd";		
	} else if (numAttempts == 3) {
		attemptsMessage = "3rd";		
	} else {
		attemptsMessage = numAttempts + "th";		
	}

	var numAttemptsDivHtml = part1 + " " + attemptsMessage + " " + part2 +".";
	return numAttemptsDivHtml;
};

/**
 * Display the number of attempts message in the div
 * @param numberAttemptsMessage the message string
 */
function setNumberAttemptsMessage(numberAttemptsMessage) {
	//get the div
	var numAttemptsDiv = document.getElementById("numberAttemptsDiv");
	
	//set the string in the div
	numAttemptsDiv.innerHTML = numberAttemptsMessage;
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
	}
};

/**
 * Replaces all the & with &amp; and escapes all " within the
 * given text and returns that text.
 * 
 * @param text
 * @return text
 */
function makeHtmlSafe(text){
	if(text && typeof text=='string'){
		text =  text.replace(/\&/g, '&amp;'); //html friendly &
		text = text.replace(/\"/g, "&quot;"); //escape double quotes
		return text;
	} else {
		return text;
	}
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/common/nodehelpers.js');
}