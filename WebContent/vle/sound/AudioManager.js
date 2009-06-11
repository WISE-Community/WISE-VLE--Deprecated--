soundManager.url = 'sound/soundmanager/swf/'; // directory where SM2 .SWFs live
var mySound = null;
soundManager.debugMode = false;
soundManager.onload = function(){
	//alert('autiodmanager.js, loaded');

	vle.audioManager.isSoundManagerLoaded=true;
	vle.audioManager.setCurrentNode(vle.getCurrentNode());
} 
// Note that SounndManager will determine and append the appropriate .SWF file to the URL.

/**
 * Object for controlling audio
 */
function AudioManager(isPlaying) {
	//alert('here');
	this.currentAudio = null;
    this.isPlaying = false;
	this.isSoundManagerLoaded = false;
	
	if (isPlaying != null) {
		this.isPlaying = isPlaying;
	}
}

/**
 * Prepares this to play audio associated with this node.
 * If this.isPlaying is true, starts playing
 */
AudioManager.prototype.setCurrentNode = function(node) {
	//alert('auiomanager.setCurrentNode, node.id:' + node.id + '\n' 
	//		+ vle.audioManager.isSoundManagerLoaded + '\n'
	//		+ 'audios.length:' + node.audios.length);
	soundManager.stopAll();
	//vle.getCurrentNode().audios = [];
	var soundId = this.id;
	var audio = null;
		if (true) {
			//alert('audiomanager.issoundmanagerloaded');
			var stepAudioElement = document.getElementById("stepAudio");
			//vle.audioManager.isPlaying = false;
			if (!vle.audioManager.isPlaying) {
				//alert('not playing');
				soundManager.stopAll();
			}
			
			
			
			// experimental start
			
			var nodeAudioElements = node.audios;
			//alert('audiomanager.js, nodeaudioelements.length:' + nodeAudioElements.length);
			if (nodeAudioElements.length > 0) {
				for (var i=0; i < nodeAudioElements.length; i++) {
					var nodeAudioElement = nodeAudioElements[i];
					if (i != nodeAudioElements.length - 1) {
						//alert('audiomanager, if, i:' + i + ", elementId: " + nodeAudioElement.getAttribute("elementId"));
						// this audio is not the last audio for this node, so upon finishing, it should move to the next audio in the sequence.
						var audio = soundManager.createSound({
							id: nodeAudioElement.id,
							url: nodeAudioElement.url,
							onplay: function() { 
							//alert('onplay');
							if (vle.getCurrentNode().type != null && 
									(vle.getCurrentNode().type == "HtmlNode" || vle.getCurrentNode().type == "OTBlueJ"))  {
								//alert('about to call highlight');
							    vle.contentPanel.highlightElement(this.elementId, "3px dotted #CC6633");
							}
							},
							whileplaying: function() {
								var playPauseAudioElement = document.getElementById("playPause");
								removeClassFromElement("playPause", "play");
								addClassToElement("playPause", "pause");
								vle.getCurrentNode().audio = this;
							},
							onpause: function() {
								var playPauseAudioElement = document.getElementById("playPause");
								removeClassFromElement("playPause", "pause");
								addClassToElement("playPause", "play");									
							},							
							onfinish: function() { 
								vle.contentPanel.highlightElement(this.elementId, "0px"); 
								vle.getCurrentNode().playAudioNextAudio(this.elementId);
							}
						});
						audio.elementId = nodeAudioElement.elementId;
						nodeAudioElement.audio = audio;
					} else {  
						// this is the last audio for this node, so upon finishing, don't need to go to the next audio.
						// upon finishing, remember to set currentnode.audio to be the first audio for the step.
						//alert('audiomanager, else, i:' + i + ", elementId: " + nodeAudioElement.getAttribute("elementId"));
						var audio = soundManager.createSound({
							id: nodeAudioElement.id,
							url: nodeAudioElement.url,
							onplay: function() { 
							if (vle.getCurrentNode().type != null && 
									(vle.getCurrentNode().type == "HtmlNode" || vle.getCurrentNode().type == "OTBlueJ")) {
								vle.contentPanel.highlightElement(this.elementId, "3px dotted #FFFF00");
							}},
							whileplaying: function() {
								var playPauseAudioElement = document.getElementById("playPause");
								removeClassFromElement("playPause", "play");
								addClassToElement("playPause", "pause");
								vle.getCurrentNode().audio = this;
							},
							onpause: function() {
								var playPauseAudioElement = document.getElementById("playPause");
								removeClassFromElement("playPause", "pause");
								addClassToElement("playPause", "play");									
							},
							onfinish: function() { 
								vle.contentPanel.highlightElement(this.elementId, "0px"); 
								var playPauseAudioElement = document.getElementById("playPause");
								removeClassFromElement("playPause", "pause");
								addClassToElement("playPause", "play");	
							}
						});
						audio.elementId = nodeAudioElement.elementId;
						nodeAudioElement.audio = audio;
					}
					//vle.getCurrentNode().audios.push(audio);
				}
				if (vle.audioManager.isPlaying) {
					vle.getCurrentNode().audios[0].play();
				}
			} else {
				audio = soundManager.createSound({
					id: 'NoAudioAvailable',
					url: 'assets/audio/NoAudioAvailable.mp3',
					whileplaying: function() {
						var playPauseAudioElement = document.getElementById("playPause");
						removeClassFromElement("playPause", "play");
						addClassToElement("playPause", "pause");
						vle.getCurrentNode().audio = this;
					}					
				});
			}
		}
}

AudioManager.prototype.playPauseStepAudio = function() {
	vle.getCurrentNode().audio.togglePause();
	var playPauseAudioElement = document.getElementById("playPause");
	if (this.isPlaying) {
		this.isPlaying = false;
		removeClassFromElement("playPause", "pause");
		addClassToElement("playPause", "play");
	} else {
		this.isPlaying = true;
		removeClassFromElement("playPause", "play");
		addClassToElement("playPause", "pause");
	}
}

AudioManager.prototype.rewindStepAudio = function() {
	var stepAudioElement = document.getElementById("stepAudio");
	vle.getCurrentNode().audio.stop();
	this.isPlaying = false;
	removeClassFromElement("playPause", "pause");
	addClassToElement("playPause", "play");

}

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/sound/AudioManager.js");