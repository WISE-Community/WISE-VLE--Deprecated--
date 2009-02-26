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
	alert('here');
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
			
			//alert('ho');
			//stepAudioElement.innerHTML = "Play";		
			//alert('soundManager != null');
			var nodeAudioElement = vle.getCurrentNode().getNodeAudioElement();
			
			if (vle.audioManager != null &&
			vle.getCurrentNode().audio == null) {
				if (nodeAudioElement == null) {
						audio = soundManager.createSound({
							id: 'NoAudioAvailable',
							url: 'assets/audio/NoAudioAvailable.mp3',
						})
						vle.getCurrentNode().audio = audio;
				}
				else {
						audio = soundManager.createSound({
							id: nodeAudioElement.getAttribute("id"),
							url: nodeAudioElement.getAttribute("url"),
						})
						vle.getCurrentNode().audio = audio;
				}
				//alert('audio' + audio);
			}
			
			alert('Node: ' + vle.audioManager.isPlaying + ",:" + nodeAudioElement);
			if (vle.audioManager.isPlaying) {
				//alert('play' + vle.getCurrentNode().audio);
				if (vle.getCurrentNode().audio != null) {
					vle.getCurrentNode().audio.play();
					alert('highlight:' + nodeAudioElement.getAttribute("id"));
					vle.contentPanel.highlight(nodeAudioElement.getAttribute("id"));
					var playPauseAudioElement = document.getElementById("playPause");
					removeClassFromElement("playPause", "play");
					addClassToElement("playPause", "pause");					
				}
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
