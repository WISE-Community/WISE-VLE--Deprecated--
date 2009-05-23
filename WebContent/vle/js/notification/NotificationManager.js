function NotificationManager(isDebugMode) {
	this.debugMode = isDebugMode;
	this.DEFAULT_ALERT_PREFIX = "VLE ALERT: ";
	this.DEFAULT_ERROR_PREFIX = "VLE ERROR: ";
}

NotificationManager.prototype.alert = function(message, type) {
	if (type == null) {
		alert(message);
		return;
	}
	if (type == "debug") {
		if (this.debugMode) {
			alert(this.DEFAULT_ALERT_PREFIX + message);
		}
	} else if (type == "error") {
		alert(this.DEFAULT_ERROR_PREFIX + message);
	} else {
		alert("vle alert type: " + type + "\nmessage: " + message);
	}
}

NotificationManager.prototype.error = function(message) {
	this.alert(message, "error");
}
