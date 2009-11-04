// mouse input code

var Mouse = {
  "x": 0,
  "y": 0,
  "buttons": [false, false, false], // left/middle/right mouse button states
  "player": null}

// capture mouse events

document.onmousedown = function (event) {
  if (Mouse.player == null) return

  // ignore clicks on input widgets
  var tag = event.target.tagName.toUpperCase()
  if (tag == "INPUT" || tag == "A" || tag == "SELECT" || tag == "SUBMIT")
    return true // allows default behavior

  // remember which buttons were pressed
  Mouse.buttons[event.button] = true

  // left mouse button moves avatar
  if (event.button == 0)
    Mouse.player.avatar.setGoal(Mouse.x, Mouse.y)

  // middle mouse button performs action
  if (event.button == 1) {
    Mouse.player.avatar.targetMouse = true
    Mouse.player.avatar.beginAction(Mouse.player.mouseAction)
  }
  return false // prevents built-in image dragging
}

document.onmouseup = function (event) {
  if (Mouse.player == null) return

  // remember which buttons were released
  Mouse.buttons[event.button] = false

  // releasing middle mouse button stops ANY actions from repeating
  // in case the selected action has changed since the button was pressed
  if (event.button == 1) {
    Mouse.player.avatar.finishAction(Mouse.player.avatar.nextAction)
    Mouse.player.avatar.targetMouse = false
  }
}

document.onmousemove = function (e) {
  if (Mouse.player == null) return

  // remember mouse coordinates relative to play area 
  var a = document.getElementById("playarea")
  Mouse.x = e.pageX - a.offsetLeft
  Mouse.y = e.pageY - a.offsetTop

  // move toward the new mouse position when the left mouse button is down
  if (Mouse.buttons[0]) Mouse.player.avatar.setGoal(Mouse.x, Mouse.y)
}

// mouse wheel selects action
// based on code from http://adomas.org/javascript-mouse-wheel/
wheel = function (event) {
  if (Mouse.player == null) return

  // derive delta from browser-specific event properties
  var delta = 0
  if (event.wheelDelta) { // IE/Opera
    delta = event.wheelDelta / 120 
    if (window.opera) delta = -delta
  } else if (event.detail) delta = -event.detail / 3

  // respond to mouse wheel movement
  var select = document.getElementById("wheel" + Mouse.player.id)
  if (delta > 0) { // scroll up
    if (select.selectedIndex == 0)
      select.selectedIndex = PLAYER_ACTIONS.length - 1
    else select.selectedIndex -= 1
    Mouse.player.mouseAction = select.value
  }
  if (delta < 0) { // scroll down
    if (select.selectedIndex == PLAYER_ACTIONS.length - 1)
      select.selectedIndex = 0
    else select.selectedIndex += 1
    Mouse.player.mouseAction = select.value
  }

  // Prevent default actions caused by mouse wheel
  if (event.preventDefault) event.preventDefault()
  event.returnValue = false
}
if (window.addEventListener) // mozilla
  window.addEventListener('DOMMouseScroll', wheel, false)
window.onmousewheel = document.onmousewheel = wheel // IE/Opera

