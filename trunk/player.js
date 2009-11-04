// Player, handles input for a single user
// Copyright (C) 2008  Seth Galbraith. See copying.txt for full copyright notice

var PLAYER_ACTIONS = ["attack", "shoot", "wrestle"]
var PLAYER_CONTROLS = ["attack", "shoot", "wrestle", "up", "down", "left", "right"]
var PLAYER_BIG_DISTANCE = 10000

var players  = [] // players will automatically add themselves to this list
function Player(template) {

  players.push(this) // add this new player to the array

  // if this is the only player in the array, set his id to 1
  if (players.length == 1) this.id = 1
  // otherwise set his id to 1 + the id of the previous player
  // this is a unique id as long as the players do not change order
  else this.id = players[players.length - 2].id + 1

  this.avatar = new Avatar(template, this)
  this.avatar.setTitle("P" + this.id)

  this.mouse = false // true if this player has mouse control
  this.actions = {}  // maps keycodes to action names

  // current state of direction buttons
  this.north = false
  this.south = false
  this.east = false
  this.west = false

  this.createMenu()
  this.showControls()
}
Player.prototype.createMenu = function() {
  var self = this // we can use self in event handlers, but not this
  var menu = document.createElement("div")
  menu.className = "inventory" // class for CSS styling
  menu.id = "inventory" + this.id
  document.getElementById("menus").appendChild(menu)
  menu.innerHTML = "<b>Player " + this.id + "</b>"
  // place to show controls
  element = document.createElement("div")
  element.id = "controls" + this.id
  menu.appendChild(element)
  // select action
  element = document.createElement("select")
  element.id = "selectAction" + this.id
  for (var i = 0; i < PLAYER_CONTROLS.length; i++) {
    var option = document.createElement("option")
    option.text = PLAYER_CONTROLS[i]
    element.add(option, null)
  }
  menu.appendChild(element)
  menu.appendChild(document.createTextNode(" action"))
  menu.appendChild(document.createElement("br"))
  // select key
  element = document.createElement("select")
  element.id = "selectKey" + this.id
  for (var keyCode in KEY_NAMES) {
    var option = document.createElement("option")
    option.text = KEY_NAMES[keyCode]
    element.add(option, null)
  }
  menu.appendChild(element)
  menu.appendChild(document.createTextNode(" key"))
  menu.appendChild(document.createElement("br"))
  // assign key to perform action
  element = document.createElement("a")
  element.href = "#"
  element.onclick = function () {
    keyName = document.getElementById("selectKey" + self.id).value
    action = document.getElementById("selectAction" + self.id).value
    self.addControl(keyName, action)
  }
  element.innerHTML = "use key for action"
  menu.appendChild(element)
  menu.appendChild(document.createElement("br"))
  // remove key assignment
  element = document.createElement("a")
  element.href = "#"
  element.onclick = function () {
    keyName = document.getElementById("selectKey" + self.id).value
    self.removeControl(keyName)
  }
  element.innerHTML = "do not use key"
  menu.appendChild(element)
  menu.appendChild(document.createElement("br"))
  // use mouse
  element = document.createElement("input")
  element.type = "checkbox"
  element.id = "mouse" + this.id
  element.onclick = function (event) {
    if (event.currentTarget.checked) self.useMouse()
    else self.stopUsingMouse()
  }
  menu.appendChild(element)
  menu.appendChild(document.createTextNode(" use mouse"))
  menu.appendChild(document.createElement("br"))
  // middle mouse button
  element = document.createElement("select")
  element.id = "wheel" + this.id
  for (var i = 0; i < PLAYER_ACTIONS.length; i++) {
    var option = document.createElement("option")
    option.text = PLAYER_ACTIONS[i]
    element.add(option, null)
  }
  element.onchange = function (event) {
    self.mouseAction = event.currentTarget.value
  }
  menu.appendChild(element)
  menu.appendChild(document.createTextNode(" button"))
  menu.appendChild(document.createElement("br"))
  // quit
  element = document.createElement("a")
  element.href = "#"
  element.innerHTML = "quit"
  element.onclick = function (event) {
    if (confirm("do you really want to quit?"))
      self.remove()
  }
  menu.appendChild(element)
  // "score" is mainly used for debug output at this time
  element = document.createElement("div")
  element.className = "score" // class for CSS styling
  element.id = "score" + this.id
  menu.appendChild(element)
}
Player.prototype.showControls = function () {
  // create a new object containing an empty array for each action
  var controls = {}
  for (var i = 0; i < PLAYER_CONTROLS.length; i++) {
    var action = PLAYER_CONTROLS[i]
    controls[action] = []
  }
  // add names of each assigned key to it's action's array
  for (var keyCode in this.actions) {
    var action = this.actions[keyCode]
    var keyName = KEY_NAMES[keyCode]
    controls[action].push(keyName)
  }
  // create an HTML representation of the controls
  var html = ""
  for (var i = 0; i < PLAYER_CONTROLS.length; i++) {
    var action = PLAYER_CONTROLS[i]
    html += action + ": " + controls[action].join(", ") + "<br />\n"
  }
  // insert it into the player's menu
  document.getElementById("controls" + this.id).innerHTML = html
}
Player.prototype.addControl = function (keyName, action) {
  keyCode = KEY_CODES[keyName]
  this.actions[keyCode] = action
  this.showControls()
}
Player.prototype.removeControl = function (keyName) {
  keyCode = KEY_CODES[keyName]
  delete this.actions[keyCode]
  this.showControls()
}
Player.prototype.keyDown = function (code) {
  if (!(code in this.actions)) return // ignore unassigned keys
  var action = this.actions[code]
  if      (action == "left")  {this.west  = true; this.direction()}
  else if (action == "right") {this.east  = true; this.direction()}
  else if (action == "up")    {this.north = true; this.direction()}
  else if (action == "down")  {this.south = true; this.direction()}
  else this.avatar.beginAction(action)
}
Player.prototype.keyUp = function (code) {
  if (!(code in this.actions)) return // ignore unassigned keys
  var action = this.actions[code]
  if      (action == "left")  {this.west  = false; this.direction()}
  else if (action == "right") {this.east  = false; this.direction()}
  else if (action == "up")    {this.north = false; this.direction()}
  else if (action == "down")  {this.south = false; this.direction()}
  else this.avatar.finishAction(action)
}
Player.prototype.direction = function () {
  if (this.mouseMove) return
  var x = this.avatar.x
  var y = this.avatar.y
  if (this.north) y = y - PLAYER_BIG_DISTANCE
  if (this.south) y = y + PLAYER_BIG_DISTANCE
  if (this.east)  x = x + PLAYER_BIG_DISTANCE
  if (this.west)  x = x - PLAYER_BIG_DISTANCE
  this.avatar.setGoal(x, y)
}
Player.prototype.stopUsingMouse = function () {
  Mouse.player = null
  this.mouse = false
  document.getElementById("mouse" + this.id).checked = false
  // stop avatar's movement and actions
  this.avatar.setGoal(this.avatar.x, this.avatar.y)
  for (var j = 0; j < PLAYER_ACTIONS.length; j++)
    this.avatar.finishAction(PLAYER_ACTIONS[j])
}
Player.prototype.useMouse = function () {
  // stop other players from using mouse
  for (var i = 0; i < players.length; i++)
    if (players[i].mouse) players[i].stopUsingMouse()
  Mouse.player = this
  this.mouse = true
  this.mouseAction = document.getElementById("wheel" + this.id).value
  document.getElementById("mouse" + this.id).checked = true
}
Player.prototype.esdfControl = function () {
  this.actions = {} // clear controls
  this.addControl("S", "left")
  this.addControl("F", "right")
  this.addControl("E", "up")
  this.addControl("D", "down")
  this.addControl("R", "shoot")
  this.addControl("W", "wrestle")
  this.addControl("spacebar", "attack")
   // let the Z button also activate wrestling for AZERTY keyboards
  this.addControl("Z", "wrestle")
}
Player.prototype.wasdControl = function () {
  this.actions = {} // clear controls
  this.addControl("A", "left")
  this.addControl("D", "right")
  this.addControl("W", "up")
  this.addControl("S", "down")
  this.addControl("E", "shoot")
  this.addControl("Q", "wrestle")
  this.addControl("spacebar", "attack")
}
Player.prototype.arrowControl = function () {
  this.actions = {} // clear controls
  this.addControl("left", "left")
  this.addControl("right", "right")
  this.addControl("up", "up")
  this.addControl("down", "down")
  this.addControl("P", "shoot")
  this.addControl("O", "wrestle")
  this.addControl("I", "attack")
}
Player.prototype.numpadControl = function () {
  this.actions = {} // clear controls
  this.addControl("pad 4", "left")
  this.addControl("pad 6", "right")
  this.addControl("pad 8", "up")
  this.addControl("pad 2", "down")
  this.addControl("pad +", "shoot")
  this.addControl("pad .", "wrestle")
  this.addControl("pad 0", "attack")
}
Player.prototype.remove = function () {
  // remove avatar
  ths.avatar.remove()

  // remove self from players list
  for (var i = 0; i < players.length; i++) {
    if (players[i] === this) {
      players.splice(i, 1)
      break
    }
  }
  // remove player menu
  var menu = document.getElementById("inventory" + this.id)
  document.getElementById("menus").removeChild(menu)
}

