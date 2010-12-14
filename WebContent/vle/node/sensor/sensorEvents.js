
/**
 * Handles events triggered when a user is authoring a sensor step
 */
View.prototype.sensorDispatcher = function(type,args,obj){
	if(type=='sensorUpdateSensorType'){
		obj.SensorNode.updateSensorType();
	} else if(type=='sensorUpdateXUnits'){
		obj.SensorNode.updateXUnits();
	} else if(type=='sensorUpdateXMin'){
		obj.SensorNode.updateXMin();
	} else if(type=='sensorUpdateXMax'){
		obj.SensorNode.updateXMax();
	} else if(type=='sensorUpdateYUnits'){
		obj.SensorNode.updateYUnits();
	} else if(type=='sensorUpdateYMin'){
		obj.SensorNode.updateYMin();
	} else if(type=='sensorUpdateYMax'){
		obj.SensorNode.updateYMax();
	}
};

//this list of events
var events = [
	'sensorUpdateSensorType',
	'sensorUpdateXUnits',
	'sensorUpdateXMin',
	'sensorUpdateXMax',
	'sensorUpdateYUnits',
	'sensorUpdateYMin',
	'sensorUpdateYMax'
];

/*
 * add all the events to the vle so the vle will listen for these events
 * and call the dispatcher function when the event is fired
 */
for(var x=0; x<events.length; x++) {
	componentloader.addEvent(events[x], 'sensorDispatcher');
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/sensor/sensorEvents.js');
};