/*
 * TODO: COMMENT ME
 */
function USER_INFO(workgroupId, userName) {
	this.workgroupId = workgroupId;
	this.userName = userName;
}

/**
 * Takes an xml object and returns a real USER_INFO object.
 * @param userInfoXML an xml object containing workgroupId and userName
 * @return a new USER_INFO object with populated workgropuId and userName
 */
USER_INFO.prototype.parseUserInfo = function(userInfoXML) {
	var userInfo = new USER_INFO();
	userInfo.workgroupId = userInfoXML.getElementsByTagName("workgroupId")[0].firstChild.nodeValue;
	userInfo.userName = userInfoXML.getElementsByTagName("userName")[0].firstChild.nodeValue;
	return userInfo;
}

function CLASS_INFO() {
	this.teacher = null;
	
	//an array of USER_INFO objects
	this.classmates = new Array();
}

/**
 * 
 * @param classmate a USER_INFO object
 * @return
 */
CLASS_INFO.prototype.addClassmate = function(classmate) {
	this.classmates.push(classmate);
};

/**
 * Returns the classmate specified by his/her workgroupId
 * If none is found, return null.
 * @param workgroupId
 * @return
 */
CLASS_INFO.prototype.getClassmate = function(workgroupId) {
	for (var i=0; i< this.classmates.length; i++) {
		if (this.classmates[i].workgroupId == workgroupId) {
			return this.classmates[i];
		}
	}
	return null;
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/user/user.js");
