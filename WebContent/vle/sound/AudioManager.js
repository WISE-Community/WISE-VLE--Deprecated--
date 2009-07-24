/**
 * The AudioManager will loop through all of the audio associated with the currently-rendered node in sequence. It is assumed
 * that the node-to-audio(s) association has happened already at VLE start-up.
 * 
 * There are three main controls:
 * 1) play/pause button
 * 			Plays or pauses current sound.
 * 2) rewind button
 * 			Single Click: rewinds to the beginning of the currently-playing audio
 *   		Double Click: rewinds to the previous audio.  If this is the first audio in the sequence, 
 *   			it rewinds to the beginning of the currently-playing audio.
 * 			When there is no pre-associated audio for this step, this button is disabled.
 * 3) forward button
 * 			Single Click: plays the next audio in the sequence. If this is the last audio in the sequence, stops playing.
 * 			When there is no pre-associated audio for this step, this button is disabled.
 */
function AudioManager(isPlaying) {
	this.currentSound = null;
	this.isPlaying = false;
	this.isSoundManagerLoaded = false;
	this.currentNode = null;

	if (isPlaying != null) {
		if (isPlaying == "false") {
			this.isPlaying = false;
		} else {
			this.isPlaying = true;
		}
	}
}

/**
 * Prepares this to play audio associated with this node.
 * If this.isPlaying is true, starts playing
 */
AudioManager.prototype.setCurrentNode = function(node) {
	notificationManager.notify('audiomanager.setCurrentNode, node.id:' + node.id
			+ '\n' + vle.audioManager.isSoundManagerLoaded + '\n'
			+ 'audios.length:' + node.audios.length, 4);
	if (this.currentSound != null) { 
		// stop currently-playing audio
		this.currentSound.stop(); 
		this.currentSound = null; 
	}  
	this.currentNode = node;
	var soundId = this.id;
	var nodeAudioElements = node.audios;
	if (nodeAudioElements.length > 0) {
		for ( var i = 0; i < nodeAudioElements.length; i++) {
			var nodeAudioElement = nodeAudioElements[i];
			var sound = null;
			var md5sound = null;
			var backupSound = null;
			if (soundManager.canPlayURL(nodeAudioElement.url)) {
				sound = soundManager.createSound( {
						id : nodeAudioElement.id,
						url : nodeAudioElement.url,
						onplay : function() {onPlayCallBack(this,node);},
						whileplaying : function() {whilePlayingCallBack(this, node);},
						onpause : function() {onPauseCallBack(this, node);},
						onfinish : function() {onFinishCallBack(this,node);},
						onstop: function() {onStopCallBack(this,node);},
						onload: function(success) {
							if (!success) {  // couldn't find mp3 file. try to load md5 hash
								if (this.readyState == 3) {
									// sometimes flash mistakingly thinks load failed because it's loading mp3 from cache
									// see SoundObject's onload() on this page: http://www.schillmania.com/projects/soundmanager2/doc/#smsoundmethods
								} else {
									vle.audioManager.playMD5Audio(this,node);
								}
							}
						}
					});
				
				// MD5 audio
				md5sound = soundManager.createSound( {
					id : 'md5_' + nodeAudioElement.id,
					url : nodeAudioElement.md5url,
					onplay : function() {onPlayCallBack(this,node);},
					whileplaying : function() {whilePlayingCallBack(this, node);},
					onpause : function() {onPauseCallBack(this, node);},
					onfinish : function() {onFinishCallBack(this,node);},
					onstop: function() {onStopCallBack(this,node);},
					onload: function(success) {
						if (!success) {  // couldn't find mp3 file. try to load md5 hash
							if (this.readyState == 3) {
								// sometimes flash mistakingly thinks load failed because it's loading mp3 from cache
								// see SoundObject's onload() on this page: http://www.schillmania.com/projects/soundmanager2/doc/#smsoundmethods
							} else {
								vle.audioManager.playBackupAudio(this,node);
							}
						}
					}
				});
				
				// backup audio, in case all else fails
				backupSound = soundManager.createSound( {
					id : 'backup_md5_' + nodeAudioElement.id,
					url : 'sound/NoAudioAvailable.mp3',
					onplay : function() {onPlayCallBack(this,node);},
					whileplaying : function() {whilePlayingCallBack(this, node);},
					onpause : function() {onPauseCallBack(this, node);},
					onfinish : function() {onFinishCallBack(this,node);},
					onstop: function() {onStopCallBack(this,node);},
					onload: function(success) {
					}
				});
			} else {
			}
			sound.id = nodeAudioElement.id;
			sound.elementId = nodeAudioElement.elementId;
			md5sound.id = 'md5_' + nodeAudioElement.id;
			md5sound.elementId = nodeAudioElement.elementId;
			backupSound.id = 'backup_md5_' + nodeAudioElement.id;
			backupSound.elementId = nodeAudioElement.elementId;
			nodeAudioElement.audio = sound;
			nodeAudioElement.backupAudio = backupSound;
			if (i == 0) {
				// if this is the first sound in the sequence, set it to be the one to play first.
				this.currentSound = sound;
			} 
		}
		this.doEnableButtons(true);
	} else {  
		// no pre-associated audio exists for this node.
		notificationManager.notify("no pre-associated audio exists for this node", 4);
		var sound = soundManager.createSound( {
			id : 'NoAudioAvailable',
			url : 'sound/NoAudioAvailable.mp3',
			whileplaying : function() {whilePlayingCallBack(this, node);}
		});
		this.currentSound = sound;
		// disable forward/rewind buttons for this node.
		this.doEnableButtons(false);
	}	
	if (this.isPlaying) {
		this.currentSound.play();
	}
};

AudioManager.prototype.playMD5Audio = function(sound, node) {
	notificationManager.notify('playmd5audio, id:' + sound.id, 4);
	soundManager.stop(sound.id);
	//soundManager.stop(sound.id);
	var backupSound = soundManager.getSoundById('md5_'+sound.id);
	soundManager.play('md5_'+sound.id);
	
	this.currentSound = backupSound;
	
	// update node.audios
	for (var i=0; i<node.audios.length;i++) {
		if (node.audios[i].id == sound.id) {
			node.audios[i].id = backupSound.id;
			node.audios[i].audio = backupSound;
		}
	}
}

AudioManager.prototype.playBackupAudio = function(sound, node) {
	notificationManager.notify('playbackupaudio, id:' + sound.id, 4);
	soundManager.stop(sound.id);
	//soundManager.stop(sound.id);
	var backupSound = soundManager.getSoundById('backup_'+sound.id);
	soundManager.play('backup_'+sound.id);
	
	this.currentSound = backupSound;
	
	// update node.audios
	for (var i=0; i<node.audios.length;i++) {
		if (node.audios[i].id == sound.id) {
			node.audios[i].id = backupSound.id;
			node.audios[i].audio = backupSound;
		}
	}
}

/**
 * Enables or disables the rewind/forward buttons.
 * @param doEnable true iff the buttons should be enabled.
 */
AudioManager.prototype.doEnableButtons = function(doEnable) {
	if (doEnable) {
		notificationManager.notify("enabling buttons", 4);
	 	document.getElementById("rewindButton").onclick = function() {vle.rewindStepAudio();};
		document.getElementById("rewindButton").ondblclick = function() {vle.previousStepAudio();};
		document.getElementById("forwardButton").onclick = function() {vle.forwardStepAudio();};

	} else {
		notificationManager.notify("disabling buttons", 4);
	 	document.getElementById("rewindButton").onclick = "";
		document.getElementById("rewindButton").ondblclick = "";
		document.getElementById("forwardButton").onclick = "";
	};
};

/**
 * a call-back function triggered when the node's 'onplay' callback is called
 * @param sound currently-playing audio.
 * @param current node that is rendered
 */
var onPlayCallBack = function(sound, currentNode) {
	if (sound.readyState == 3) {
	} else {
		notificationManager.notify('file not ready, play backup', 4);
		//vle.audioManager.playBackupAudio(this,currentNode);
	}
}

//a call-back function triggered when the node's 'onstop' callback is called
//@param sound currently-playing audio.
//@param current node that is rendered
var onStopCallBack = function(sound, currentNode) {
	highlightTextElement(sound.elementId, currentNode, false);
	showPlayPauseButton(false);
};

//a call-back function triggered when the node's 'onfinish' callback is called
//@param sound currently-playing audio.
//@param current node that is rendered
var onFinishCallBack = function(sound, currentNode) {
	highlightTextElement(sound.elementId, currentNode, false);
	showPlayPauseButton(false);
	vle.audioManager.nextStepAudio();
};

// a call-back function triggered when the node's 'whileplaying' callback is called
//@param sound currently-playing audio.
//@param current node that is rendered
var whilePlayingCallBack = function(sound, currentNode) {
	showPlayPauseButton(true);
	highlightTextElement(sound.elementId, currentNode, true);
	vle.audioManager.currentSound = sound;   // keep updating the currentsound
};

//a call-back function triggered when the node's 'onpause' callback is called
var onPauseCallBack = function(sound, currentNode) {
	showPlayPauseButton(false);
	//highlightTextElement(sound.elementId, currentNode, false);
};

// changes the play/pause button based on specified isPlaying parameter
// @param isPlaying if true, show the play button. else, show the pause button
function showPlayPauseButton(isPlaying) {
	var playPauseAudioElement = document.getElementById("playPause");
	if (isPlaying) {
		removeClassFromElement("playPause", "play");
		addClassToElement("playPause", "pause");
	} else {
		removeClassFromElement("playPause", "pause");
		addClassToElement("playPause", "play");
	};
};

// highlights the text that is associated with the currently-playing audio.
// @param elementId, id of element within the html page to highlight.
// @param current node that is rendered
// @param doHighlight true iff the specified element should be highlighted.
var highlightTextElement = function(elementId, currentNode, doHighlight) {
	if (currentNode != null	&& currentNode.isAudioSupported()) {
		// get element to highlight
		var elementToHighlight = null;
		if (currentNode.type == "BrainstormNode") {  // Brainstorm is special.. it makes another iframe within the ifrm...
			elementToHighlight = getElementsByAttribute("audio", elementId, "brainstormFrame");
		} else {
			elementToHighlight = getElementsByAttribute("audio", elementId);
		}

		if (doHighlight) {
			notificationManager.notify("highlighting elementId:" + elementId, 4);
			vle.contentPanel.highlightElement(elementToHighlight,"3px dotted #CC6633");
		} else {
			notificationManager.notify("unhighlighting elementId:" + elementId, 4);
			vle.contentPanel.highlightElement(elementToHighlight, "0px");		
		};
	};
};

// toggles play/pause for the entire AudioManager realm.
AudioManager.prototype.playPauseStepAudio = function() {
	if (this.isPlaying) {
		this.currentSound.pause();
		this.isPlaying = false;
	} else {
		if (this.currentSound != null) {
			this.currentSound.play();
			this.isPlaying = true;
		};
	};
};

/**
 * Gets the previous sound in the sequence, relative to the currently-playing sound.
 * If the currently-playing sound is the first sound in the sequence, return null
 */
AudioManager.prototype.getPreviousSound = function() {
	var currentSoundId = this.currentSound.sID;
	
	// if we're playing a backup, remove the backup_ from front to get original id
	/*
	if (currentSoundId.indexOf('backup_') > -1) {
		notificationManager.notify('playing backup:' + currentSoundId, 4);
		currentSoundId = currentSoundId.substring(7);
	}
	*/
	for (var i=0; i<this.currentNode.audios.length;i++) {
		if (this.currentNode.audios[i].id == currentSoundId) {
			if (i == 0) {   // the current sound is the first sound in the sequence
				return null;
			} else {
				return this.currentNode.audios[i-1].audio;
			};
		};
	};
};

/**
 * Rewinds the currently-playing audio to the beginning of the audio.
 * If the currentSound is already at position 0 (ie, at the beginning), go 
 * to previous audio.
 */
AudioManager.prototype.rewindStepAudio = function() {
	notificationManager.notify("Rewind. CurrentSound:" + vle.audioManager.currentSound.sID + "," + vle.audioManager.currentSound.position, 4);
	if (vle.audioManager.currentSound.position == 0 && vle.audioManager.getPreviousSound() != null) {
		this.previousStepAudio();
	} else {
		vle.audioManager.currentSound.setPosition(0);
	};
};

/**
 * Sets the currentSound to the currentSound's previous sound in sequence.
 * If currentSound is the first sound in the sequence, simply rewind to the beginning of the audio
 */
AudioManager.prototype.previousStepAudio = function() {
	notificationManager.notify("Previous step audio. CurrentSound:" + vle.audioManager.currentSound.sID + "," + vle.audioManager.currentSound.position, 4);
	soundManager.stopAll(); // first, stop currently-playing audio and remove all highlights
	this.removeAllHighlights();
	var previousSound = this.getPreviousSound();
	if (previousSound == null && this.currentSound != null) {
		this.currentSound.setPosition(0);
		highlightTextElement(this.currentSound.elementId, this.currentNode, true);
		if (this.isPlaying) {
			this.playCurrentSound();
		};
	} else {
		this.currentSound = previousSound;
		if (this.isPlaying) {
			this.playCurrentSound();
		} else {
			highlightTextElement(this.currentSound.elementId, this.currentNode, true);
		};
	};
};

/**
 * Gets the next sound in the sequence, relative to the currently-playing sound.
 * If the currently-playing sound is the last sound in the sequence, return null
 */
AudioManager.prototype.getNextSound = function() {
	var currentSoundId = this.currentSound.sID;
	
	// if we're playing a backup, remove the backup_ from front to get original id
	/*
	if (currentSoundId.indexOf('backup_') > -1) {
		notificationManager.notify('playing backup:' + currentSoundId, 4);
		currentSoundId = currentSoundId.substring(7);
	}
	*/
	notificationManager.notify("getNextSound currentSoundId:" + currentSoundId, 4);
	for (var i=0; i<this.currentNode.audios.length;i++) {
		if (this.currentNode.audios[i].id == currentSoundId) {
			if (i == this.currentNode.audios.length - 1) {   // the current sound is the first sound in the sequence
				return null;
			} else {
				return this.currentNode.audios[i+1].audio;
			};
		};
	};
};

/**
 * Sets the currentSound to the currentSound's next sound in sequence.
 * If currentSound is the last sound in the sequence, forward to the first audio in the sequence, and do not play the audio.
 */
AudioManager.prototype.nextStepAudio = function() {
	soundManager.stopAll(); // first, stop currently-playing audio
	this.removeAllHighlights();
	notificationManager.notify("Next step audio. CurrentSound:" + this.currentSound.sID + "," + this.currentSound.position, 4);
	var nextSound = this.getNextSound();
	notificationManager.notify("nextSound:" + nextSound, 4);
	if (nextSound == null && this.currentNode.audios.length > 0) {
		this.currentSound = this.currentNode.audios[0].audio;		
	} else {
		this.currentSound = nextSound;
		if (this.isPlaying) {
			this.playCurrentSound();
		} else {
			highlightTextElement(this.currentSound.elementId, this.currentNode, true);
		};
	};
};

/**
 * Plays the currentSound iff the currentSound exits.
 */
AudioManager.prototype.playCurrentSound = function() {
	if (this.currentSound != null) {
		this.currentSound.play();
	};
};

/**
 * Removes all the highlights from the page.
 */
AudioManager.prototype.removeAllHighlights = function() {
	for (var i=0; i<this.currentNode.audios.length;i++) {
		var nodeAudio = this.currentNode.audios[i];
		highlightTextElement(nodeAudio.elementId, this.currentNode, false);
	};
};

//used to notify scriptloader that this script has finished loading
scriptloader.scriptAvailable(scriptloader.baseUrl + "vle/sound/AudioManager.js");