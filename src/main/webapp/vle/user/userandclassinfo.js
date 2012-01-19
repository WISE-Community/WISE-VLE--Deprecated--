
View.prototype.loadUserAndClassInfo = function(userAndClassInfoContentObject) {
	this.eventManager.fire('getUserAndClassInfoBegin');
	this.userAndClassInfo = this.parseUserAndClassInfo(userAndClassInfoContentObject);
	
	this.userAndClassInfoLoaded = true;
	this.eventManager.fire('getUserAndClassInfoComplete');
};

View.prototype.getUserAndClassInfo = function() {
	return this.userAndClassInfo;
};

View.prototype.createUserAndClassInfo = function(myUserInfo, classmateUserInfos, teacherUserInfo, sharedTeacherUserInfos) {
	return function(myUserInfoParam, classmateUserInfosParam, teacherUserInfoParam, sharedTeacherUserInfosParam) {
		var myUserInfo = myUserInfoParam;
		var classmateUserInfos = classmateUserInfosParam;
		var teacherUserInfo = teacherUserInfoParam;
		
		var getWorkgroupId = function() {
			if (myUserInfo != null) {
				return myUserInfo.workgroupId;
			}
		};
		
		var getUserName = function() {
			if (myUserInfo != null) {
				return myUserInfo.userName;
			}
		};
		
		/**
		 * Get the user login by extracting it from the userName
		 * field.
		 */
		var getUserLoginName = function() {
			var userLoginName = "";
			
			//use a regular expression to capture the text between the parens
			var captureLoginRegEx = /.*\((.*)\)/;
			
			//userName will be like "Geoffrey Kwan (GeoffreyKwan)"
			var regExMatch = captureLoginRegEx.exec(myUserInfo.userName);
			
			//check if there was a match
			if(regExMatch != null && regExMatch.length > 1) {
				/*
				 * 0th element is the whole string - "Geoffrey Kwan (GeoffreyKwan)"
				 * 1st element is the capture - "GeoffreyKwan"
				 */
				userLoginName = regExMatch[1];
			}
			
			//return the user login name
			return userLoginName;
		};
		
		var getPeriodId = function() {
			return myUserInfo.periodId;
		};
		
		var getPeriodName = function() {
			return myUserInfo.periodName;
		};
		
		var getClassmateUserInfos = function() {
			return classmateUserInfos;
		};
		
		var getTeacherUserInfo = function() {
			return teacherUserInfo;
		};
		
		var getSharedTeacherUserInfos = function() {
			return shareTeacherUserInfos;
		};
		
		var getUsersInClass = function() {
			var allStudentsArray = new Array();
			for (var i=0; i<classmateUserInfos.length; i++) {
				allStudentsArray.push(classmateUserInfos[i]);
			}
			allStudentsArray.push(myUserInfo);
			return allStudentsArray;
		};
		
		var getWorkgroupIdsInClass = function() {
			var usersInClass = getUsersInClass();
			var workgroupIdsInClass = [];
			
			for(var x=0; x<usersInClass.length; x++) {
				var user = usersInClass[x];
				
				workgroupIdsInClass.push(user.workgroupId);
			}
			
			return workgroupIdsInClass;
		};
		
		var getUserNameByUserId = function(userId) {
			//check the current logged in user
			if(userId == getWorkgroupId()) {
				return getUserName();
			}
			
			//check the class mates
			for(var x=0; x<classmateUserInfos.length; x++) {
				if(userId == classmateUserInfos[x].workgroupId) {
					return classmateUserInfos[x].userName;
				}
			}
			
			//return null if no one was found with the userId
			return null;
		};
		
		var getClassmateByWorkgroupId = function(workgroupId) {
			for (var i=0; i< classmateUserInfos.length; i++) {
				if (classmateUserInfos[i].workgroupId == workgroupId) {
					return classmateUserInfos[i];
				}
			}
			return null;
		};
		
		var getClassmateIdsByPeriodId = function(periodId) {
			var classmateIds = "";
			
			//loop through all the classmates
			for (var i=0; i< classmateUserInfos.length; i++) {
				//make sure the classmate is in the same period
				if(classmateUserInfos[i].periodId == periodId) {
					//add a : if necessary
					if(classmateIds != "") {
						classmateIds += ":";
					}
					
					//add the workgroup id
					classmateIds += classmateUserInfos[i].workgroupId;
				}
			}
			return classmateIds;
		};
		
		var getClassmatePeriodNameByWorkgroupId = function(workgroupId) {
			//loop through all the classmates
			for(var x=0; x<classmateUserInfos.length; x++) {
				//get a classmate
				var classmate = classmateUserInfos[x];
				
				//check if this is the classmate we're looking for
				if(classmate.workgroupId == workgroupId) {
					//return the period name/number
					return classmate.periodName;
				}
			}
			
			//return null if we did not find the workgroup id in our classmates
			return null;
		};
		
		var getTeacherWorkgroupId = function() {
			return teacherUserInfo.workgroupId;
		};
		
		/**
		 * Get the shared teacher workgroup ids in an array
		 * @return an array containing the teacher workgroup ids
		 */
		var getSharedTeacherWorkgroupIds = function() {
			var sharedTeacherWorkgroupIdsArray = [];
			
			//loop through all the shared teachers
			for(var x=0; x<sharedTeacherUserInfos.length; x++) {
				var sharedTeacherUserInfo = sharedTeacherUserInfos[x];
				
				sharedTeacherWorkgroupIdsArray.push(sharedTeacherUserInfo.workgroupId);
			}
			
			return sharedTeacherWorkgroupIdsArray;
		};
		
		/**
		 * Get the teacher workgroup id and all shared teacher workgroup
		 * ids in an array
		 * @return the teacher and shared teacher workgroup ids in an array
		 */
		var getAllTeacherWorkgroupIds = function() {
			//get the teacher workgroup id
			var teacherWorkgroupId = getTeacherWorkgroupId();
			
			//get the shared teacher workgroup ids
			var sharedTeacherWorkgroupIds = getSharedTeacherWorkgroupIds();
			
			//add the teacher workgroup to the array of shared teacher workgroup ids
			sharedTeacherWorkgroupIds.unshift(teacherWorkgroupId);
			
			return sharedTeacherWorkgroupIds;
		};
		
		var getClassmatesInAlphabeticalOrder = function() {
			
			var sortByUserName = function(a, b) {
				//get the user names from the vleStates
				var userNameA = a.userName.toLowerCase();
				var userNameB = b.userName.toLowerCase();
				
				//compare them
				return userNameA > userNameB;
			};
			
			return classmateUserInfos.sort(sortByUserName);
		};
		
		return {
			getWorkgroupId:function() {
				return getWorkgroupId();
			},
			getUserName:function() {
				return getUserName();
			},
			getPeriodId:function() {
				return getPeriodId();
			},
			getPeriodName:function() {
				return getPeriodName();
			},
			getUsersInClass:function() {
				return getUsersInClass();
			},
			getUserNameByUserId:function(userId) {
				return getUserNameByUserId(userId);
			},
			getClassmateByWorkgroupId:function(workgroupId) {
				return getClassmateByWorkgroupId(workgroupId);
			},
			getClassmateIdsByPeriodId:function(periodId) {
				return getClassmateIdsByPeriodId(periodId);
			},
			getClassmatePeriodNameByWorkgroupId:function(workgroupId) {
				return getClassmatePeriodNameByWorkgroupId(workgroupId);
			},
			getTeacherWorkgroupId:function() {
				return getTeacherWorkgroupId();
			},
			getClassmatesInAlphabeticalOrder:function() {
				return getClassmatesInAlphabeticalOrder();
			},
			getWorkgroupIdsInClass:function() {
				return getWorkgroupIdsInClass();
			},
			getClassmateUserInfos:function() {
				return getClassmateUserInfos();
			},
			getTeacherUserInfo:function() {
				return getTeacherUserInfo();
			},
			getSharedTeacherUserInfos:function() {
				return getSharedTeacherUserInfos();
			},
			getSharedTeacherWorkgroupIds:function() {
				return getSharedTeacherWorkgroupIds();
			},
			getAllTeacherWorkgroupIds:function() {
				return getAllTeacherWorkgroupIds();
			},
			getUserLoginName:function() {
				return getUserLoginName();
			}
		};
	}(myUserInfo, classmateUserInfos, teacherUserInfo, sharedTeacherUserInfos);
};

View.prototype.parseUserAndClassInfo = function(contentObject) {
	var contentObjectJSON = contentObject.getContentJSON();
	var classInfoJSON;
	var myUserInfo;
	var classmateUserInfos;
	var teacherUserInfo;
	var sharedTeacherUserInfos;
	
	if(contentObjectJSON.myUserInfo != null) {
		classInfoJSON = contentObjectJSON.myUserInfo.myClassInfo;	
		myUserInfo = contentObjectJSON.myUserInfo;
		
		if(classInfoJSON != null) {
			if(classInfoJSON.classmateUserInfos != null) {
				classmateUserInfos = classInfoJSON.classmateUserInfos;
			}
			
			if(classInfoJSON.teacherUserInfo != null) {
				teacherUserInfo = classInfoJSON.teacherUserInfo;
			}
			
			if(classInfoJSON.sharedTeacherUserInfos != null) {
				sharedTeacherUserInfos = classInfoJSON.sharedTeacherUserInfos;
			}
		}
	}
	
	return this.createUserAndClassInfo(myUserInfo, classmateUserInfos, teacherUserInfo, sharedTeacherUserInfos);
};


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/user/userandclassinfo.js');
};