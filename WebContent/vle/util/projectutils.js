/**
 * Prints summary report to firebug console of: All Sequences and
 * Nodes defined for this project, Sequences defined but not used,
 * Nodes defined but not used, Sequences used twice and Nodes used
 * twice in this project.
 */
Project.prototype.printSummaryReportsToConsole = function(){
	this.printSequencesDefinedReport();
	this.printNodesDefinedReport();
	this.printUnusedSequencesReport();
	this.printUnusedNodesReport();
	this.printDuplicateSequencesReport();
	this.printDuplicateNodesReport();
};

/**
 * Prints a report of all sequences defined for this project
 * to the firebug console
 */
Project.prototype.printSequencesDefinedReport = function(){
	var outStr = 'Sequences defined by Id: ';
	for(var z=0;z<this.allSequenceNodes.length;z++){
		if(z==this.allSequenceNodes.length - 1){
			outStr += ' ' + this.allSequenceNodes[z].id;
		} else {
			outStr += ' ' + this.allSequenceNodes[z].id + ',';
		};
	};
	
	notificationManager.notify(outStr, 1);
};

/**
 * Prints a report of all nodes defined for this project
 * to the firebug console
 */
Project.prototype.printNodesDefinedReport = function(){
	var outStr = 'Nodes defined by Id: ';
	for(var x=0;x<this.allLeafNodes.length;x++){
		if(x==this.allLeafNodes.length -1){
			outStr += ' ' + this.allLeafNodes[x].id;
		} else {
			outStr += ' ' + this.allLeafNodes[x].id + ',';
		};
	};
	
	notificationManager.notify(outStr, 1);
};

/**
 * Prints a report of all unused sequences for this project
 * to the firebug console
 */
Project.prototype.printUnusedSequencesReport = function(){
	var outStr = 'Sequence(s) with id(s): ';
	var found = false;
	
	for(var v=0;v<this.allSequenceNodes.length;v++){
		if(!this.referenced(this.allSequenceNodes[v].id) && this.allSequenceNodes[v].id!=this.rootNode.id){
			found = true;
			outStr += ' ' + this.allSequenceNodes[v].id;
		};
	};
	
	if(found){
		notificationManager.notify(outStr + " is/are never used in this project", 1);
	};
};

/**
 * Prints a report of all unused nodes for this project
 * to the firebug console
 */
Project.prototype.printUnusedNodesReport = function(){
	var outStr = 'Node(s) with id(s): ';
	var found = false;
	
	for(var b=0;b<this.allLeafNodes.length;b++){
		if(!this.referenced(this.allLeafNodes[b].id)){
			found = true;
			outStr += ' ' + this.allLeafNodes[b].id;
		};
	};

	if(found){
		notificationManager.notify(outStr + " is/are never used in this project", 1);
	};
};

/**
 * Prints a report of all duplicate sequence ids to the
 * firebug console
 */
Project.prototype.printDuplicateSequencesReport = function(){
	var outStr = 'Duplicate sequence Id(s) are: ';
	var found = false;
	
	for(var n=0;n<this.allSequenceNodes.length;n++){
		var count = 0;
		for(var m=0;m<this.allSequenceNodes.length;m++){
			if(this.allSequenceNodes[n].id==this.allSequenceNodes[m].id){
				count ++;
			};
		};
		
		if(count>1){
			found = true;
			outStr += this.allSequenceNodes[n].id + ' ';
		};
	};
	
	if(found){
		notificationManager.notify(outStr, 1);
	};
};

/**
 * Prints a report of all duplicate node ids to the
 * firebug console
 */
Project.prototype.printDuplicateNodesReport = function(){
	var outStr =  'Duplicate node Id(s) are: ';
	var found = false;
	
	for(var n=0;n<this.allLeafNodes.length;n++){
		var count = 0;
		for(var m=0;m<this.allLeafNodes.length;m++){
			if(this.allLeafNodes[n].id==this.allLeafNodes[m].id){
				count ++;
			};
		};
		
		if(count>1){
			found = true;
			outStr += this.allLeafNodes[n].id + ' ';
		};
	};
	
	if(found){
		notificationManager.notify(outStr, 1);
	};
};

/**
 * Returns true if the given id is referenced by any
 * sequence in the project, otherwise, returns false
 */
Project.prototype.referenced = function(id){
	for(var c=0;c<this.allSequenceNodes.length;c++){
		for(var v=0;v<this.allSequenceNodes[c].children.length;v++){
			if(this.allSequenceNodes[c].children[v].id==id){
				return true;
			};
		};
	};
	return false;
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/util/projectutils.js");