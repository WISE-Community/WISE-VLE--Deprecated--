soundManager.url = 'js/sound/soundmanager/swf/'; // directory where SM2 .SWFs live
var mySound = null;
soundManager.debugMode = false;
soundManager.onload = function(){
	//alert('loaded');
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
	//alert('auiomanager.setCurrentNode' + vle.audioManager.isSoundManagerLoaded);
	soundManager.stopAll();

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
			
			var nodeAudioElements = vle.getCurrentNode().getNodeAudioElements();
			if (nodeAudioElements.length > 0) {
				for (var i=0; i < nodeAudioElements.length; i++) {
					var nodeAudioElement = nodeAudioElements[i];
					if (i != nodeAudioElements.length - 1) {
						//alert('audiomanager, if, i:' + i + ", elementId: " + nodeAudioElement.getAttribute("elementId"));
						// this audio is not the last audio for this node, so upon finishing, it should move to the next audio in the sequence.
						var audio = soundManager.createSound({
							id: nodeAudioElement.getAttribute("id"),
							url: nodeAudioElement.getAttribute("url"),
							onplay: function() { 
							//alert('onplay');
							if (vle.getCurrentNode().type != null && vle.getCurrentNode().type == "HtmlNode") {
								//alert('about to call highlight');
							    vle.contentPanel.highlightElement(this.elementId, "3px dotted #FFFF00");
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
					} else {  // this is the last audio for this node, so upon finishing, don't need to go to the next audio.
						//alert('audiomanager, else, i:' + i + ", elementId: " + nodeAudioElement.getAttribute("elementId"));
						var audio = soundManager.createSound({
							id: nodeAudioElement.getAttribute("id"),
							url: nodeAudioElement.getAttribute("url"),
							onplay: function() { 
							if (vle.getCurrentNode().type != null && vle.getCurrentNode().type == "HtmlNode") {
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
					}
					audio.elementId = nodeAudioElement.getAttribute("elementId");
					if (node.type != null && node.type == "outsideurl") {
						//alert('outsideurl!');
						//audio.originalBGColor = window.frames["ifrm"].document.getElementById("outsideurliframe").document.getElementById(audio.elementId).style.backgroundColor;
					} else {
						//alert('not outsideurl');
						//audio.originalBGColor = window.frames["ifrm"].document.getElementById(audio.elementId).style.backgroundColor;
					}
					vle.getCurrentNode().audios.push(audio);
					
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
				if (vle.audioManager.isPlaying) {
					//audio.play();
				}
			}
			
			
			
			// experimental end
			
			
			/*
			//alert('ho');
			//stepAudioElement.innerHTML = "Play";		
			//alert('soundManager != null');
			var nodeAudioElement = vle.getCurrentNode().getNodeAudioElements();
			
			if (vle.audioManager != null &&
			vle.getCurrentNode().audio == null) {
				if (nodeAudioElement == null) {
						audio = soundManager.createSound({
							id: 'NoAudioAvailable',
							url: 'assets/audio/NoAudioAvailable.mp3'
						})
						vle.getCurrentNode().audio = audio;
				}
				else {
						audio = soundManager.createSound({
							id: nodeAudioElement.getAttribute("id"),
							url: nodeAudioElement.getAttribute("url"),
							onplay: function() { vle.contentPanel.highlightElement(nodeAudioElement.getAttribute("elementId"), true);},
							onfinish: function() { vle.contentPanel.highlightElement(nodeAudioElement.getAttribute("elementId"), false);	}
						})
						vle.getCurrentNode().audio = audio;
						
				}
				//alert('audio' + audio);
			}
			
			//alert('Audiomanager.js. vle.audiomanager.isplaying: ' + vle.audioManager.isPlaying + ", nodeaudioelement:" + nodeAudioElement);
			if (vle.audioManager.isPlaying) {
				//alert('play' + vle.getCurrentNode().audio);
				if (vle.getCurrentNode().audio != null) {
					vle.getCurrentNode().audio.play();
					if (nodeAudioElement != null) {
						//alert('highlight:' + nodeAudioElement.getAttribute("elementId"));
						var playPauseAudioElement = document.getElementById("playPause");
						removeClassFromElement("playPause", "play");
						addClassToElement("playPause", "pause");					
					} else {
						// this can be reached if the nodeaudio is not defined, but it's still trying to
						// play a 'no audio exists' mp3.
					}
				}
			}
			*/
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
