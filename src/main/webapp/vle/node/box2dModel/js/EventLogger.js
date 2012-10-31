(function (window)
{
    var EventLogger = function() {
         this.eventArray = [];
         this.initialTimestamp = new Date().getTime();
    }
  
    var p = EventLogger.prototype;

    /** This function is used to add a generic event to the array 
    * type: make, delete, duplicate, place, remove, rest, [objects1], [objects2] 
    * what (a secondary, possibly empty characteristic of type): init, make, delete, duplicate: "", 
        place: beaker-world, beaker, beaker-spilloff, balance-world, balance-leftPan, balance-rightPan
        remove: (same as place)
        rest (object comes to rest): beaker-liquid, balance 
      objects1, objects2 (an optional array for objects that were part of this event)
    */
    p.addEvent = function (type, what, objects1, objects2)
    {
        var evt = {};
        evt.timestamp = new Date().getTime() - this.initialTimestamp;
        evt.type = type;
        evt.what = typeof what === "undefined" ? "" : what;
        evt.objects1 = typeof objects1 === "undefined" ? [] : objects1;
        evt.objects2 = typeof objects2 === "undefined" ? [] : objects2;
        console.log(evt.type, evt.what, evt.objects1, evt.objects2);
        this.eventArray.push(evt);
        // save when a new object is created or deleted
        if (type == "make" || "delete")
        {
            save();
        }
    }

    window.EventLogger = EventLogger;
}(window));