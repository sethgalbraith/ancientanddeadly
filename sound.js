// Sound, a javascript audio system
// Copyright (C) 2008  Seth Galbraith. See copying.txt for full copyright notice


// constants
var SOUND_DISABLED = 0
var SOUND_SLOW = 1
var SOUND_FAST = 2

/**
 * Indicates whether sounds are currently allowed to play,
 * and whether sounds are played with the Play() and Stop() commands.
 * This is a global variable which should only be set by the Sound class.
 * Use disableSound(), enableSlowSound() or enableFastSound() to change it.
 */
var sound_state = SOUND_DISABLED

/**
 * Keeps track of the Sounds created so they can be muted.
 * This is a global variable which should only be used by the Sound class.
 */
var sound_clips = new Array()

/**
 * Allows sounds to be played with broader compatibility but a long delay.
 */
function enableSlowSound() {
  sound_state = SOUND_SLOW
  for (var i = 0; i < sound_clips.length; i++)
    sound_clips[i].plugin.setAttribute("autostart", true)
}

/**
 * Allows sounds to be played immediately but only works with some plugins.
 */
function enableFastSound() {
  sound_state = SOUND_FAST
  for (var i = 0; i < sound_clips.length; i++) {
    sound_clips[i].plugin.setAttribute("autostart", false)
    if (!sound_clips[i].plugin_appended) {
      document.body.appendChild(sound_clips[i].plugin)
      sound_clips[i].plugin_appended = true
	}
  }
}

/**
 * Stops all currently playing sounds and prevents new sounds from being played.
 */
function disableSound() {
  for (var i = 0; i < sound_clips.length; i++) sound_clips[i].stop()
  sound_state = SOUND_DISABLED
}

/**
 * Allows sounds to be played with the Play() and Stop() commands.
 * Not all plugins respond correctly to these commands.
 */
function enableFastSounds() {
  for (var i = 0; i < sound_clips.length; i++) {
    sound_clips[i].plugin.setAttribute("autostart", false)
    if (!sound_clips[i].plugin_appended) {
      document.body.appendChild(sound_clips[i].plugin)
      sound_clips[i].plugin_appended = true
	}
  }
}

/**
 * A playable sound clip.
 * Playing the clip more than once will restart the clip.
 * To play more than one copy of the sound simultaneously,
 * create another Sound object.
 */
function Sound(the_file_name) {
  this.plugin = document.createElement("embed")
  this.plugin.setAttribute("src", the_file_name)
  this.plugin.setAttribute("hidden", true)
  this.plugin.setAttribute("enablejavascript", true)
  this.plugin_appended = false
  sound_clips[sound_clips.length] = this
}

/**
 * Start playing the sound clip, or restart the clip if it is already playing.
 */
Sound.prototype.play = function () {
  if (sound_state == SOUND_FAST) {
    this.plugin.Stop()
    this.plugin.Play()
  } else if (sound_state == SOUND_SLOW) {
    if (this.plugin_appended) document.body.removeChild(this.plugin)
    document.body.appendChild(this.plugin)
    this.plugin_appended = true
  }
}

/**
 * Stop playing the sound clip, or do nothing if it is not playing.
 */
Sound.prototype.stop = function () {
  if (sound_state == SOUND_FAST) {
    this.plugin.Stop()
  } else if (sound_state == SOUND_SLOW) {
    if (this.plugin_appended) document.body.removeChild(this.plugin)
    this.plugin_appended = false
  }
}

