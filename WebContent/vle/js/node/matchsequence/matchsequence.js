/*
 * Copyright (c) 2009 Regents of the University of California (Regents). Created
 * by TELS, Graduate School of Education, University of California at Berkeley.
 *
 * This software is distributed under the GNU Lesser General Public License, v2.
 *
 * Permission is hereby granted, without written agreement and without license
 * or royalty fees, to use, copy, modify, and distribute this software and its
 * documentation for any purpose, provided that the above copyright notice and
 * the following two paragraphs appear in all copies of this software.
 *
 * REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE. THE SOFTWAREAND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED
 * HEREUNDER IS PROVIDED "AS IS". REGENTS HAS NO OBLIGATION TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 *
 * IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,
 * SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS,
 * ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * REGENTS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author: Hiroki Terashima
 */
/**
 * MatchSequence (MS) object.
 * Given xmldocument, will create a new instance of the MatchSequence object and 
 * populate its attributes. Does not render anything on the screen (see MS.render() for rendering).
 */
function MS(xmlDoc, customCheck) {
    this.xmlDoc = xmlDoc;
    this.responseDeclarations = this.xmlDoc.getElementsByTagName('responseDeclaration');
    this.responseDeclaration = null;
    this.feedbacks = [];
    this.itemBody = this.xmlDoc.getElementsByTagName('itemBody')[0];
    this.isOrdered = this.itemBody.getElementsByTagName('gapMatchInteraction')[0].getAttribute('ordered') == 'true'; // true iff this is MatchSequence (ordering of choices in bucket matters)
    this.responseIdentifier = this.itemBody.getElementsByTagName('gapMatchInteraction')[0].getAttribute('responseIdentifier');
    this.promptText = this.itemBody.getElementsByTagName('prompt')[0].firstChild.nodeValue;
    this.followupFeedbackText = null;
    this.choices = [];
    this.sourceBucket = null;
    this.buckets = [];  // includes only targetbuckets
    this.correctState = this.getCorrectState();
    this.customCheck = null;
    
    if(customCheck!=null){
    	this.customCheck = new Function("state", customCheck);
    };
	
    if (this.itemBody.getElementsByTagName('followupFeedback').length > 0) {
    	this.followupFeedbackText = this.itemBody.getElementsByTagName('followupFeedback')[0].firstChild.nodeValue;
    }
    // instantiate sourcebucket
    var sourceBucket = new MSBUCKET();

    //instantiate choices
    var choicesDOM = this.itemBody.getElementsByTagName('gapText');
    for (var i=0; i < choicesDOM.length; i++) {
      var choice = new MSCHOICE(choicesDOM[i], sourceBucket);
      this.choices.push(choice);      
      sourceBucket.choices.push(choice);   // to start out, put all choices in sourcebucket
    }
    this.sourceBucket = sourceBucket;
    
    // instantiate target buckets
    var bucketsDOM = this.itemBody.getElementsByTagName('gapMultiple');
    for (var i=0; i < bucketsDOM.length; i++) {
      var bucket = new MSBUCKET(bucketsDOM[i]);
      this.buckets.push(bucket);
    }
}

/**
 * Adds orderings to choices within the targetbuckets
 * Iterates through all of the target buckets and adds
 * ordering to the choices. Iterates through all sourcebuckets and
 * removes ordering from the choices.
 */
MS.prototype.addOrderingToChoices = function() {
	if (!this.isOrdered) {
		return;
	}
	
	var state = ms.getState();
	// go through the sourcebucket and remove any ordering
	for (var i=0; i < state.sourceBucket.choices.length; i++) {
		addOrderToChoice(state.sourceBucket.choices[i].identifier, "");
	}
	
	// now go through the targetbuckets
	for (var i=0; i < state.buckets.length; i++) {
		var bucket = state.buckets[i];
		for (var j=0; j < bucket.choices.length; j++) {
			var choice = bucket.choices[j];
			addOrderToChoice(choice.identifier, j+1);
		}
	}
}

/**
 * It is implicitly assumed that
 * this function will only be called if this is. MatchSequence
 */
function addOrderToChoice(identifier, orderNumber) {
	YUI().use('node', function(Y) {
		var node = Y.get('#'+identifier+" .orderNumber");
		node.set('innerHTML', orderNumber);
	});
}
/**
 * Renders choices and buckets with DD abilities
 * MS must have been instantiated already (ie this.choices should be populated)
 */
MS.prototype.render = function() {
	// render the prompt
	var promptdiv = document.getElementById('promptDiv');
	promptdiv.innerHTML=this.promptText;
	  
    var bucketsHtml = "";
    document.getElementById('play').innerHTML = "";
    var choicesBucketHtml = this.getBucketHtml(this.sourceBucket);
    bucketsHtml += "<div id=\"choicesColumn\">"+ choicesBucketHtml +"</div>";
    bucketsHtml += "<div id=\"bucketsAndFeedbackColumn\">";
    for (var i=0; i < this.buckets.length; i++) {
        var currentBucket = this.buckets[i];
        var currentBucketHtml = this.getBucketHtml(currentBucket);
        bucketsHtml += currentBucketHtml;
    }
    bucketsHtml += "</div>";
    document.getElementById('play').innerHTML = bucketsHtml;
    renderYUI();   // calls YUI functions to make choices into draggables and buckets into dragtargets.
	//addClassToElement("resetWrongChoicesButton", "disabledLink");
    displayNumberAttempts("This is your", "attempt.");
}

/**
 * Given a MSBUCKET object, returns a HTML-representation of the bucket as a string.
 * All the choices in the buckets are list items <li>.
 */
MS.prototype.getBucketHtml = function(bucket) {
	var bucketHtml = "";	
	var choicesInBucketHtml = "";
	for (var j=0; j < bucket.choices.length; j++) {
		if (this.isOrdered) {
		    choicesInBucketHtml += "<li id="+ bucket.choices[j].identifier +" class=\"choice draggable\"><div class=\"orderNumber\"></div>" + bucket.choices[j].text +"</li>";			
		} else {
		    choicesInBucketHtml += "<li id="+ bucket.choices[j].identifier +" class=\"choice draggable\">" + bucket.choices[j].text +"</li>";
		}
	}

	bucketHtml = "<div class=\"bucketblock\"><div class=\"bucketlabel\" >"+ bucket.text + "</div>" +
	"<div class=\"bucket\"><ul name=\"bucket_ul\" class=\"bucket_ul\" id=" + bucket.identifier +">"+choicesInBucketHtml+"</ul></div><div id=\"feedbackdiv_"+ bucket.identifier +"\"></div></div>";

	return bucketHtml;
}

/**
 * Parses xmlDOM and returns a "correct" state
 */
MS.prototype.getCorrectState = function() {
    var correctState = new MSSTATE();
    var correctRD = null;  // correct ResponseDeclaration
    for (var i=0; i < this.responseDeclarations.length; i++) {
        if (this.responseDeclarations[i].getAttribute('identifier') == this.responseIdentifier) {
            this.responseDeclaration = this.responseDeclarations[i];
            var feedbackElements = this.responseDeclaration.getElementsByTagName('value');
            for (var j=0; j < feedbackElements.length; j++) {
                this.feedbacks.push(new MSFEEDBACK(feedbackElements[j]));
	    }
            correctRD = this.responseDeclarations[i];
        }
    }
    if (correctRD) {
    } else {
        return null;
    }

    return correctState;
}

/**
 * Returns current state of the MS
 */
MS.prototype.getState = function() {
	var state = new MSSTATE();
	var bucketElements = document.getElementsByName('bucket_ul');
	for (var i=0; i < bucketElements.length; i++) {
		var currentBucketIdentifier = bucketElements[i].getAttribute('id');
		var currentBucketCopy = this.getBucketCopy(currentBucketIdentifier);
		var choicesInCurrentBucket = bucketElements[i].getElementsByTagName('li');
		for (var j=0; j < choicesInCurrentBucket.length; j++) {
			currentBucketCopy.choices.push(this.getChoiceCopy(choicesInCurrentBucket[j].getAttribute('id')));
		}

		if (currentBucketIdentifier == 'sourceBucket') {
			state.sourceBucket = currentBucketCopy;
		} else {
			state.buckets.push(currentBucketCopy);
		}
	}
	return state;
}

/**
 * Gets the bucket with the specified identifier
 */
MS.prototype.getBucket = function(identifier) {
	if (this.sourceBucket.identifier == identifier) {
		return this.sourceBucket;
	}
    for (var i=0; i < this.buckets.length; i++) {
        if (this.buckets[i].identifier == identifier) {
            return this.buckets[i];
        }
    }
    return null;
}

/**
 * Gets the choice with the specified identifier
 */
MS.prototype.getChoice = function(identifier) {
    for (var i=0; i < this.choices.length; i++) {
        if (this.choices[i].identifier == identifier) {
            return this.choices[i];
        }
    }
    return null;
}

/**
 * Given an identifier string, returns a new MSCHOICE instance
 * of a MSCHOICE with the same identifier.
 */
MS.prototype.getChoiceCopy = function(identifier) {
   var original = this.getChoice(identifier);
   var copy = new MSCHOICE(null, original.bucket);
   copy.identifier = original.identifier;
   copy.text = original.text;
   copy.dom = original.dom
   return copy;
}

/**
 * Given an identifier string, returns a new MSBUCKET instance
 * of a MSBUCKET with the same identifier.
 */
MS.prototype.getBucketCopy = function(identifier) {
    var original = this.getBucket(identifier);
    var copy = new MSBUCKET();
    copy.isTargetBucket = original.isTargetBucket;	
    copy.identifier = identifier;
    copy.choices = [];
    copy.text = original.text;
    return copy;
}

/**
 * Gets the current state of the MatchSequence and provides appropriate feedback.
 * If the sourcebucket is not empty, then the student is not considered to be finished and
 * does not check if the state is correct.
 */
MS.prototype.checkAnswer = function() {
	var isCheckAnswerDisabled = hasClass("checkAnswerButton", "disabledLink");

	if (isCheckAnswerDisabled) {
		return;
	}
	
	if(this.customCheck!=null){
		var feedback = this.customCheck(ms.getState());
		var message;
		if(feedback.getSuccess()){
			message = "<font color='008B00'>" + feedback.getMessage() + "</font>";
			this.setChoicesDraggable(false);
			document.getElementById('checkAnswerButton').className = 'disabledLink';
		} else {
			message = "<font color='8B0000'>" + feedback.getMessage() + "</font>";
		};
		document.getElementById("feedbackDiv").innerHTML = message;
		
	} else {
		var state = ms.getState();   // state is a MSSTATE instance
		// clean out old feedback
		for (var i=0; i < state.buckets.length; i++) {
			var bucket = state.buckets[i];
			var feedbackDivElement = document.getElementById('feedbackdiv_'+bucket.identifier);
			feedbackDivElement.innerHTML = "";  // clean out old feedback
		}
		
		if (state.sourceBucket.choices.length > 0) {
			// there are choices still in the sourceBucket, so the student is not done
			alert('Please move each Choice into a Target box before checking your results.');
		} else {
			//addClassToElement("checkAnswerButton", "disabledLink");
			//this.setChoicesDraggable(false);
			var numCorrectChoices = 0;
			var numWrongChoices = 0;
			for (var i=0; i < state.buckets.length; i++) {
				var bucket = state.buckets[i];
				var feedbackDivElement = document.getElementById('feedbackdiv_'+bucket.identifier);
				var feedbackHTMLString = "";
				for (var j=0; j < bucket.choices.length; j++) {
					// get feedback object for this choice in this bucket
					var feedback = this.getFeedback(bucket.identifier,bucket.choices[j].identifier,j);
	
					if (feedback) {
						if (feedback.isCorrect) {
							removeClassFromElement(bucket.choices[j].identifier, "incorrect");						
							removeClassFromElement(bucket.choices[j].identifier, "wrongorder");						
							addClassToElement(bucket.choices[j].identifier, "correct");
							feedbackHTMLString += "<li class=\"feedback_li correct\">"+ bucket.choices[j].text + ": " + feedback.feedbackText +"</li>";
							numCorrectChoices++;
						} else {
							removeClassFromElement(bucket.choices[j].identifier, "correct");
							removeClassFromElement(bucket.choices[j].identifier, "wrongorder");																			
							addClassToElement(bucket.choices[j].identifier, "incorrect");					
							//removeClassFromElement("resetWrongChoicesButton", "disabledLink");
							feedbackHTMLString += "<li class=\"feedback_li incorrect\">"+ bucket.choices[j].text + ": " + feedback.feedbackText +"</li>";
							numWrongChoices++;
						}
					} else {   // there was no feedback, which could mean that the choice was in right bucket but wrong order
						if (this.isOrdered && this.isInRightBucketButWrongOrder(bucket.identifier,bucket.choices[j].identifier,j)) {   // correct bucket, wrong order
							removeClassFromElement(bucket.choices[j].identifier, "correct");												
							removeClassFromElement(bucket.choices[j].identifier, "incorrect");												
							addClassToElement(bucket.choices[j].identifier, "wrongorder");						
							feedbackHTMLString += "<li class=\"feedback_li wrongorder\">"+ bucket.choices[j].text + ": Correct box but wrong order.</li>";
							numWrongChoices++;
						} else {
							removeClassFromElement(bucket.choices[j].identifier, "correct");												
							removeClassFromElement(bucket.choices[j].identifier, "wrongorder");												
							addClassToElement(bucket.choices[j].identifier, "incorrect");						
							feedbackHTMLString += "<li class=\"feedback_li incorrect\">"+ bucket.choices[j].text + ": " + "NO FEEDBACK" +"</li>";
							numWrongChoices++;
						}
					}
				}
				if (feedbackHTMLString != "") {
					feedbackDivElement.innerHTML = "<ul class=\"feedback_ul\">"+ feedbackHTMLString + "</ul>";
				}
			}
	
			// update feedback div
			var feedbackDiv = document.getElementById("feedbackDiv");
			if (numWrongChoices == 0) {
				feedbackDiv.innerHTML = "Congratulations! You've completed this question.";
				if (this.followupFeedbackText != null) {
					feedbackDiv.innerHTML += "<br/>";
					feedbackDiv.innerHTML += this.followupFeedbackText;
				}
				this.setChoicesDraggable(false);
			} else {
				var totalNumChoices = numCorrectChoices + numWrongChoices;
				feedbackDiv.innerHTML = "You have correctly placed "+ numCorrectChoices +" out of "+ totalNumChoices +" choices.";
				
			}
		}
	}
}

/**
 * Returns true if the choice is in the right bucket but is in wrong order
 * in that bucket.
 */
MS.prototype.isInRightBucketButWrongOrder = function(bucketIdentifier, choiceIdentifier, choiceOrderInBucket) {
	var isInRightBucketAndRightOrder = false;
	var isInRightBucket = false;
	for (var i=0; i < this.feedbacks.length; i++) {
		if (this.isOrdered) {
			if (this.feedbacks[i].bucketIdentifier == bucketIdentifier &&
					this.feedbacks[i].choiceIdentifier == choiceIdentifier &&
					this.feedbacks[i].order == choiceOrderInBucket && 
					this.feedbacks[i].isCorrect) {
				isInRightBucketAndRightOrder = true;
			} else if (this.feedbacks[i].bucketIdentifier == bucketIdentifier &&
					this.feedbacks[i].choiceIdentifier == choiceIdentifier &&
					this.feedbacks[i].isCorrect &&
					this.feedbacks[i].order != choiceOrderInBucket) {
				isInRightBucket = true;
			}
		}
	}
	return isInRightBucket && !isInRightBucketAndRightOrder;
}

/**
 * Returns FEEDBACK object based for the specified choice in the
 * specified bucket
 * choiceOrderInBuckets is integer representing which order the choice is in
 * within its bucket.
 */
MS.prototype.getFeedback = function(bucketIdentifier, choiceIdentifier,choiceOrderInBucket) {
	for (var i=0; i < this.feedbacks.length; i++) {
		if (this.isOrdered) {
			if (this.feedbacks[i].bucketIdentifier == bucketIdentifier &&
					this.feedbacks[i].choiceIdentifier == choiceIdentifier &&
					this.feedbacks[i].order == choiceOrderInBucket) {
				return this.feedbacks[i];
			} else if (this.feedbacks[i].bucketIdentifier == bucketIdentifier &&
					this.feedbacks[i].choiceIdentifier == choiceIdentifier &&
					!this.feedbacks[i].isCorrect) {
				return this.feedbacks[i];
			}
		} else {
			if (this.feedbacks[i].bucketIdentifier == bucketIdentifier &&
					this.feedbacks[i].choiceIdentifier == choiceIdentifier) {
				return this.feedbacks[i];
			}
		}
    }
    return null;
}

/**
 * enables or disables dragging of all choices
 */
MS.prototype.setChoicesDraggable = function(setDraggable) {
	if (setDraggable) {
		for (var i = 0; i < ddList.length; i++) {
			ddList[i].set("lock", false);
		}
	} else {
		for (var i = 0; i < ddList.length; i++) {
			ddList[i].set("lock", true);
		}
	}
}

/**
 * Resets to original state
 */
MS.prototype.reset = function() {
	removeClassFromElement("checkAnswerButton", "disabledLink");
	//addClassToElement("resetWrongChoicesButton", "disabledLink");
	this.render();
}

/**
 * Resets to original state
 */
MS.prototype.resetWrongChoices = function() {
	var isResetWrongChoicesDisabled = hasClass("resetWrongChoicesButton", "disabledLink");

	if (isResetWrongChoicesDisabled) {
		return;
	}
	
	removeClassFromElement("checkAnswerButton", "disabledLink");
	alert('not implemented yet, will reset all answers for now');
	this.render();
}