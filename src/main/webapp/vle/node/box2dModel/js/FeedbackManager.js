(function (window)
{
    /**
    *   This constructor should be fed an array of feedback items from the imported json file, with the following form:
    *   [
            {
                "feedback":
                {
                    "type":"text", //[possibly other things later]
                    "body":"say something" //[body is associated with text, could be something else in the future],
                    "repetitionMax":0 //[How many times will this feedback be displayed after first time]
                },
                "root":
                {
                    "maxMisses":0, //[How many events can occur between items in the sequence?  If 0, they must come contiguously]    
                    "strictOrdering":true, //[Do the items in the sequence need to occur in the given order]
                    "matchItems": //[An array of objecs that must be matched in order to trigger this feedback]
                    [
                        { // a match item
                            "eventType":"my-event" ,//[name of event]
                            "ComputationalInputElement":{"label":"some-parameter-name", "value":0} //[A mapping from label to value for input parameters]
                            "ComputationalOutputElement":{"label":"some-parameter-name", "value":0} //[A mapping from label to value for output parameters]
                        },
                        { // a recursion item (branch), affords sequences within sequences
                              "maxMisses":1,
                             "strictOrdering":false,
                             "matchItems":
                             [
                                {
                                    "eventType":"my-event2"
                                }, //[could do further recursion]
                             ],
                            "breakItems":[]  
                        }
                    ]
                    "breakItems": //[An array of objects that if match current event, terminate this progress of this feedback, i.e. return to master array]
                    [] 
                }       

            }
        ]
    *
    *
    *
    */
    var FeedbackManager = function(initialFeedbackArray) {
         this.initialFeedbackArray = initialFeedbackArray;
         this.initialTimestamp = new Date().getTime();
         this.masterArray = initialFeedbackArray;
         this.processingArray = [];
          
         // place a boolean in each object to match to false
         var matchItem;
         for (var i = 0; i < this.masterArray.length; i++){
            this.masterArray[i].feedback.repetitionCount = -1;
            this.resetFeedbackEvent(this.masterArray[i]);
         }
    }
  
    var p = FeedbackManager.prototype;
    p.THRESHOLD = 0.0000001;

    /**
    *   When processing events call this function with event type and event arguments.
    *   Will first check the event against any currently processing feedback elements
    *       If a feedback item is fully-matched will present the feedback.
    *            If feedback item is repeatable, then add back to master list.
    *       If this event matches a break item, then remove item of currently processing array
    *      
    *   Will then check all feedback items on the master list.
    *       If there is a match, add feedback item to currently processing array.
    *       
    */
   p.checkEvent = function (eventType, state){
        
        if (this.processingArray.length > 0){
           for (var i = this.processingArray.length-1; i >= 0; i--){
                var sequenceHead = this.processingArray[i].root;
                var hitOrMissOrCompleteOrBreak = this.checkSequenceHead (eventType, state, sequenceHead);
                console.log("processing:", hitOrMissOrCompleteOrBreak, eventType, state, sequenceHead);
                if (hitOrMissOrCompleteOrBreak == "complete"){
                    var feedback = this.processingArray[i].feedback;
                    this.giveFeedback(feedback); 
                   feedback.repetitionCount++;
                    // Can we repeat this feedback, if yes place back on master
                    if (feedback.repetitionCount < feedback.repetitionMax){
                        this.resetFeedbackEvent(this.processingArray[i]);
                        this.masterArray.push(this.processingArray[i]);                        
                    } 
                    this.processingArray.splice(i, 1);
                    console.log("Processing Array:");this.prettyPrintArray(this.processingArray);
                    return true;
                }
                else if (hitOrMissOrCompleteOrBreak == "break"){
                    this.resetFeedbackEvent(this.processingArray[i]);
                    this.masterArray.push(this.processingArray[i]);
                    this.processingArray.splice(i, 1);
                } else if (hitOrMissOrCompleteOrBreak == "hit"){
                    // since this is a hit, we don't need to check anymore events on the array
                    console.log("Processing Array:");this.prettyPrintArray(this.processingArray);
                    return true;                   
                } else if (hitOrMissOrCompleteOrBreak == "miss"){
                    // the final miss (when the missCount equals maxMisses), is classified as a break
                    // so here we don't need to do anything, event stays on processing array
                }
            }
        }

        if (this.masterArray.length > 0){
            for (i = this.masterArray.length-1; i >= 0; i--){
                var sequenceHead = this.masterArray[i].root;
                var hitOrMissOrCompleteOrBreak = this.checkSequenceHead (eventType, state, sequenceHead);
                console.log("master:", hitOrMissOrCompleteOrBreak, eventType, state, sequenceHead);
                if (hitOrMissOrCompleteOrBreak == "complete"){
                    feedback = this.masterArray[i].feedback;
                    this.giveFeedback(feedback); 
                    feedback.repetitionCount++;
                    // Can we repeat this feedback, if yes place back on master
                    if (feedback.repetitionCount < feedback.repetitionMax){
                        this.resetFeedbackEvent(this.masterArray[i]);                     
                    } else {
                        this.masterArray.splice(i, 1);   
                    }
                    return true;
                }
                else if (hitOrMissOrCompleteOrBreak == "break"){
                    // do nothing
                } else if (hitOrMissOrCompleteOrBreak == "hit"){
                    // an "incomplete" hit - i.e., there is more to match - put on processing array.
                    this.processingArray.push(this.masterArray[i]);
                    this.masterArray.splice(i, 1);
                    return true;
                } else if (hitOrMissOrCompleteOrBreak == "miss"){
                    // do nothing 
                }
            }
        }
        console.log("Processing Array:");
        this.prettyPrintArray(this.processingArray);

        console.log("Master Array:");
        this.prettyPrintArray(this.masterArray);


        // got to this point without matching anything
        return false;
       
    }


   /**
    *   Searches through the break items and match items on this sequence head.
    *   If matches a break return "break".
    *   If matches the final match item return "complete".
    *   If matches a non-final match item return "hit"
    *   Else return "miss".
    */
   p.checkSequenceHead = function (eventType, state, sequenceHead)
   {
        if (this.checkBreakItems(eventType, state, sequenceHead) == "break" ){
            return "break";
        } else {
             var hitOrMissOrCompleteOrBreak = this.checkMatchItems(eventType, state, sequenceHead);
             return hitOrMissOrCompleteOrBreak;
        }
   }

   /**
   *    Returns "break" if any of the items in the breakArray match the current event. Else returns ""
   */
   p.checkBreakItems = function (eventType, state, sequenceHead){
        if (typeof sequenceHead.breakItems != "undefined"){
            for (var i = 0; i < sequenceHead.breakItems.length; i++){
                if (this.checkMatchItem(eventType, state, sequenceHead.breakItems[i]) == "hit"){
                    return "break";
                }            
            }
            return "";
        } else {
            return "";
        }
   }

   /**
   *    Searches through matchItems of sequence head, returns "hit", "complete", or "miss"
   */
   p.checkMatchItems = function (eventType, state, sequenceHead){
        var unmatchedItems = 0;
        var hitFound = false;
        var strictOrdering = sequenceHead.strictOrdering;
        for (var i = 0; i < sequenceHead.matchItems.length; i++){
            if (!sequenceHead.matchItems[i].matched){
                unmatchedItems++;
                // only allow processing if we haven't found a hit yet
                if (!hitFound){    
                    // is this a sequence head or a matchItem
                    if (this.isMatchItem(sequenceHead.matchItems[i])){
                        var hitOrMissOrCompleteOrBreak = this.checkMatchItem(eventType, state, sequenceHead.matchItems[i]);
                        if (hitOrMissOrCompleteOrBreak == "hit"){
                            sequenceHead.matchItems[i].matched = true;
                            hitFound = true;
                        } else if (hitOrMissOrCompleteOrBreak == "miss"){
                            if (strictOrdering){
                                sequenceHead.missCount ++;
                                if (sequenceHead.missCount > sequenceHead.maxMisses){
                                     return "break"; // since we missed the maximum number of times return break;     
                                } else {
                                    return "miss";
                                }                           
                            } else {
                                // if not strict ordering, allow it to continue looking for matches
                            }
                        }
                    } else if (this.isSequenceHead(sequenceHead.matchItems[i])) {
                        var i_old = i;
                        hitOrMissOrCompleteOrBreak = this.checkSequenceHead(eventType, state, sequenceHead.matchItems[i]);
                        i = i_old;
                        if (hitOrMissOrCompleteOrBreak == "hit"){
                            return "hit"; // since this is an "incomplete" hit, we can return "hit" right here, do not need to check other items
                        } else if (hitOrMissOrCompleteOrBreak == "complete"){
                            sequenceHead.matchItems[i].matched = "true";
                            hitFound = true; // could be the final hit.
                        }
                    }     
                }              
            }
        }
        if (unmatchedItems == 0 || (unmatchedItems == 1 && hitFound)) {
            return "complete";
        } else if (hitFound){
            return "hit";
        } else {
            return "miss";
        }
   }

   /**
    *   Checks a matchItem (leaf in tree).  Returns "hit" or "miss" only.
    */
   p.checkMatchItem = function (eventType, state, matchItem){
        if (this.isMatchItem(matchItem)){
            for (key in matchItem){
                if (key == "eventType"){
                    if (eventType != matchItem[key]){ 
                        return "miss"; 
                    }
                } else if (key == "computationalInputElement") {
                    var label = matchItem[key].label;
                    var eq = matchItem[key].value.substr(0,1);
                    var value = parseFloat(matchItem[key].value.substr(1));
                    var matchFound = false;
                    //iterate through computational inputs looking for label match
                    for (var i = 0; response.ModelDataDescriptions.ComputationalInputs.length; i++){
                        if (label == response.ModelDataDescriptions.ComputationalInputs[i].label){
                            if (eq == "="){
                                if (Math.abs(value - response.ModelDataDescriptions.ComputationalInputValues[i]) > THRESHOLD){
                                    return "miss";
                                } else {matchFound = true}
                            } else if (eq == "<="){
                                if (value - response.ModelDataDescriptions.ComputationalInputValues[i] > THRESHOLD){
                                    return "miss";
                                } else {matchFound = true}
                            } else if (eq == ">="){
                                if (value - response.ModelDataDescriptions.ComputationalInputValues[i] < -THRESHOLD){
                                    return "miss";
                                } else {matchFound = true}
                            } else if (eq == "<"){
                                if (value - response.ModelDataDescriptions.ComputationalInputValues[i] > -THRESHOLD){
                                    return "miss";
                                } else {matchFound = true}
                            } else if (eq == ">"){
                                if (value - response.ModelDataDescriptions.ComputationalInputValues[i] < THRESHOLD){
                                    return "miss";
                                } else {matchFound = true}
                            } else if (!isNan(eq)){
                                value = parseFloat(matchItem[key]);
                                if (Math.abs(value - response.ModelDataDescriptions.ComputationalInputValues[i]) > THRESHOLD){
                                    return "miss";
                                } else {matchFound = true}
                            } else {
                                //something wrong with the structure of the value
                                return "miss";
                            }
                        }
                   }
                   if (!matchFound){
                        return "miss";
                    }
               } else if (key == "computationalOutputElement") {
                    label = matchItem[key].label;
                    eq = matchItem[key].value.substr(0,1);
                    value = parseFloat(matchItem[key].value.substr(1));
                    matchFound = false;   
                   //iterate through computational outputs looking for label match
                    for (i = 0; response.ModelDataDescriptions.ComputationalOutputs.length; i++){
                        if (label == response.ModelDataDescriptions.ComputationalOutputs[i].label){
                            if (eq == "="){
                                if (Math.abs(value - response.ModelDataDescriptions.ComputationalOutputValues[i]) > THRESHOLD){
                                    return "miss";
                                } else {matchFound = true}
                            } else if (eq == "<="){
                                if (value - response.ModelDataDescriptions.ComputationalOutputValues[i] > THRESHOLD){
                                    return "miss";
                                } else {matchFound = true}
                            } else if (eq == ">="){
                                if (value - response.ModelDataDescriptions.ComputationalOutputValues[i] < -THRESHOLD){
                                    return "miss";
                                } else {matchFound = true}
                            } else if (eq == "<"){
                                if (value - response.ModelDataDescriptions.ComputationalOutputValues[i] > -THRESHOLD){
                                    return "miss";
                                } else {matchFound = true}
                            } else if (eq == ">"){
                                if (value - response.ModelDataDescriptions.ComputationalOutputValues[i] < THRESHOLD){
                                    return "miss";
                                }
                            } else if (!isNan(eq)){
                                value = parseFloat(matchItem[key]);
                                if (Math.abs(value - response.ModelDataDescriptions.ComputationalOutputValues[i]) > THRESHOLD){
                                     return "miss";
                                } else {matchFound = true}
                            }
                        }
                    }
                    if (!matchFound){
                        return "miss";
                    }
                }
            }    
            return "hit";
        } else {
            return "miss"; // this could be something like "null", but will cause problems up the hierarchy
        }
   };


    /**
    *   Given recursive patterns matchItems could be another recursive sequence head.
    *   This function checks to see whether the item is an match item.
    */
    p.isMatchItem = function (possibleMatchItem) {
        if (typeof possibleMatchItem.eventType != "undefined" || typeof possibleMatchItem.matchItems == "undefined"){
            return true
        } else {
            return false;
        }
    }
     /**
    *   Given recursive patterns matchItems could be another recursive sequence head.
    *   This function checks to see whether the item is actually a new sequenceHead
    */
    p.isSequenceHead = function (possibleSequenceHead) {
        if (typeof possibleSequenceHead.matchItems != "undefined" || typeof possibleSequenceHead.eventType == "undefined"){
            return true
        } else {
            return false;
        }
    }

    /**
    *   Recurses through the hierarchy of a feedback event and sets a field in all matchItems "matched" to false.  sets missCount in sequenceHead to zero 
    */
    p.resetFeedbackEvent = function (feedbackEvent){
        p.resetSequenceHead(feedbackEvent.root);
    }

    p.resetSequenceHead = function (sequenceHead){
        sequenceHead.matched = false;
        sequenceHead.missCount = 0;
        for (var i = 0; i < sequenceHead.matchItems.length; i++){
            if (this.isMatchItem(sequenceHead.matchItems[i])){
                sequenceHead.matchItems[i].matched = false;
            } else if (this.isSequenceHead(sequenceHead.matchItems[i])){
                var i_old = i;
                this.resetSequenceHead(sequenceHead.matchItems[i]);
                i = i_old;
            }
        }
    }

    
    /** Provides the feedback according to the specs provided in the .feedback field of the feedbackEvent */
    p.giveFeedback = function (feedback){
        if (feedback.type == "text"){
            alert(feedback.body);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////  TREE TRAVERSING FUNCTIONS /////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
    /**
    *   From the given sequenceHead, what is the first child?
    */
    p.getFirstChild = function (sequenceHead){
         if (typeof sequenceHead.matchItems != "undefined" && sequenceHead.matchItems.length > 0) {
            return sequenceHead.matchItems[0];
         } else {
            return null;
         }
    }

    /**
    *   From the given sequenceHead, what is the next child after the given matchItem?
    */
    p.getNextChild = function (curMatchItem, sequenceHead){
        // find the curMatchItem, this item's direct parent should be the sequenceHead
        var itemFound = false;
        for (var i = 0; i < sequenceHead.matchItems.length; i++){
            if (sequenceHead.matchItems[i] == curMatchItem){
                itemFound = true; break;
            }
        }

        if (itemFound){
            // is there another item in this sequence
            if (i < sequenceHead.matchItems.length - 1){
                if (this.isMatchItem(sequenceHead.matchItems[i+1])) {
                    return sequenceHead.matchItems[i+1];
                } else if (this.isSequenceHead(sequenceHead.matchItems[i+1])) {
                    return this.getFirstChild(sequenceHead.matchItems[i+1]);
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
        
    /**
    *   Given the current sequenceHead find the first matchItem.
    *   It is assumed that all sequence heads will have at least one matchItem (else it doesn't make sense to use a sequenceHead, duh)
    */
    p.getFirstMatchItem = function (sequenceHead){
        if (sequenceHead.matchItems.length > 0 ){
            if (this.isMatchItem(sequenceHead.matchItems[0])){
                return sequenceHead.matchItems[0];
            } else if (this.isSequenceHead(sequenceHead.matchItems[0])) {
                return this.getFirstMatchItem(sequenceHead.matchItems[0]);
            }
        } else
        {
            return null;
        }
    }
    /** 
    *   The getFirstMatchItem function may traverse down through several layers of sequence heads.
    *   This function follows the same path, but instead of returning the matchItem, it returns the local parent sequenceHead.
    */
    p.getFirstMatchItemsSequenceHead = function (sequenceHead){
        if (sequenceHead.matchItems.length > 0 ){
            if (this.isMatchItem(sequenceHead.matchItems[0])){
                return sequenceHead;
            } else if (this.isSequenceHead(sequenceHead.matchItems[0])) {
                return this.getFirstMatchItemsSequenceHead(sequenceHead.matchItems[0]);
            }
        } else
        {
            return null;
        }
    }

    /**
    *   Recurses through the sequence from the current matchItem within the given sequenceHead to the next available match item.
    */
    p.getNextMatchItem = function (curMatchItem, sequenceHead) {
        // find the curMatchItem, this item's direct parent should be the sequenceHead
        var matchItemFound = false;
        for (var i = 0; i < sequenceHead.matchItems.length; i++){
            if (this.isMatchItem(sequenceHead.matchItems[i]) && sequenceHead.matchItems[i] == curMatchItem){
                matchItemFound = true; break;
            }
        }

        if (matchItemFound){
            // is there another item in this sequence
            if (i < sequenceHead.matchItems.length - 1){
                if (this.isMatchItem(sequenceHead.matchItems[i+1])) {
                    return sequenceHead.matchItems[i+1];
                } else if (this.isSequenceHead(sequenceHead.matchItems[i+1])) {
                    return this.getFirstMatchItem(sequenceHead.matchItems[i+1]);
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
    *   Recurses through the sequence from the current matchItem within the given sequenceHead to the next available match item's sequence head (parent).
    */
     p.getNextMatchItemsSequenceHead = function (curMatchItem, sequenceHead) {
        // find the curMatchItem, this item's direct parent should be the sequenceHead
        var matchItemFound = false;
        for (var i = 0; i < sequenceHead.matchItems.length; i++){
            if (this.isMatchItem(sequenceHead.matchItems[i]) && sequenceHead.matchItems[i] == curMatchItem){
                matchItemFound = true; break;
            }
        }

        if (matchItemFound){
            // is there another item in this sequence
            if (i < sequenceHead.matchItems.length - 1){
                if (this.isMatchItem(sequenceHead.matchItems[i+1])) {
                    return sequenceHead;
                } else if (this.isSequenceHead(sequenceHead.matchItems[i+1])) {
                    return this.getFirstMatchItemsSequenceHead(sequenceHead.matchItems[i+1]);
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
     /**
    *   Recurses through the sequence from the current sequenceHead to the next available match item that has not been marked match.
    */
    p.getFirstUnmatchedItem = function (sequenceHead){
         var matchItem = this.getFirstMatchItem(sequenceHead);
         if (!matchItem.matched) {
            return matchItem;
         } else {
            return this.getNextUnmatchedItem(matchItem, this.getFirstMatchItemsSequenceHead(sequenceHead));
         }
    }
     /**
    *   Recurses through the sequence from the current sequenceHead to the next available match item that has not been marked match.
    */
    p.getFirstUnmatchedItemsSequenceHead = function (sequenceHead){
         var matchItem = this.getFirstMatchItem(sequenceHead);
         if (!matchItem.matched) {
            return sequenceHead;
         } else {
            return this.getNextUnmatchedItem(matchItem, this.getFirstMatchItemsSequenceHead(sequenceHead));
         }
    }
    /**
    *   Recurses through the sequence from the current matchItem within the given sequenceHead to the next available match item that has not been marked match.
    */
    p.getNextUnmatchedItem = function (curMatchItem, sequenceHead) {
        var matchItem = this.getNextMatchItem(curMatchItem, sequenceHead);
        if (!matchItem.matched){
            return matchItem;
        } else {
            return this.getNextUnmatchedItem(matchItem, this.getNextMatchItemsSequenceHead(curMatchItem, sequenceHead));
        }
    }
    /**
    *   Recurses through the sequence from the current matchItem within the given sequenceHead to the next available match item that has not been marked match and return its sequence head.
    */
    p.getNextUnmatchedItemsSequenceHead = function (curMatchItem, sequenceHead) {
        var matchItem = this.getNextMatchItem(curMatchItem, sequenceHead);
        if (!matchItem.matched){
            return this.getNextMatchItemsSequenceHead(curMatchItem, sequenceHead);
        } else {
            return this.getNextUnmatchedItemsSequenceHead(matchItem, this.getNextMatchItemsSequenceHead(curMatchItem, sequenceHead));
        }
    }

    p.prettyPrintArray = function (array){
        for (var i = 0; i < array.length; i++){
            this.prettyPrintSequenceHead(array[i].root, "|", 0);
        }
    }
    p.prettyPrintSequenceHead = function (sequenceHead, spacestr, printCount){
         printCount++;
        if (sequenceHead.matched){
            console.log(spacestr + "------ MATCHED");
        } else {
            console.log(spacestr + "------");
        }
        for (i = 0; i < sequenceHead.matchItems.length; i++){
            printCount++;
            if (this.isMatchItem(sequenceHead.matchItems[i])){
                if (sequenceHead.matchItems[i].matched){
                    console.log(spacestr + sequenceHead.matchItems[i].eventType + " MATCHED");
                } else {
                    console.log(spacestr + sequenceHead.matchItems[i].eventType);
                }                
            } else if (this.isSequenceHead(sequenceHead.matchItems[i])){
                var i_prev = i;
               if (printCount < 50) this.prettyPrintSequenceHead (sequenceHead.matchItems[i], spacestr + "|-----", printCount);
               i = i_prev;
            }
        }
    }

    
    window.FeedbackManager = FeedbackManager;
}(window));