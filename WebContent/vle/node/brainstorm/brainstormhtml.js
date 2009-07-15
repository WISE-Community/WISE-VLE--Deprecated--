var brainstorm;

function loadContent(xmlDoc, nodeId, states, vle){
	brainstorm = new BRAINSTORM(xmlDoc, nodeId);
	
	if(states){
		brainstorm.loadState(states);
	};
	
	if(vle){
		brainstorm.loadVLE(vle);
	};
	
	brainstorm.render();
}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/node/brainstorm/brainstormhtml.js");