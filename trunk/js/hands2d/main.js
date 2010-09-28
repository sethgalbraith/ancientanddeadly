// WebBrawler, a beat-em-up style game written in javascript/DHTML
// Copyright (C) 2008  Seth Galbraith. See copying.txt for full copyright notice

// global structures visible to all modules
var triggers = []
var world = {"l": 0, "t": 0, "r": 0, "b": 0}
// templates & stats inherited from templates
var swordsman = new Template("sword",   [36, 20], [10, 4], 18, [9, 9])
swordsman.fighting = 2
var karateman = new Template("unarmed", [32, 20], [10, 4], 16, [7, 7])
karateman.wrestling = 2
var bowman = new Template("bow", [36, 24], [10, 4], 16, [15, 11])
bowman.shooting = 2
var horseman = new Template("horse", [60, 40], [20, 8], 25, [41, 21])
horseman.quickness = 2
horseman.toughness = 2

// initialization to be run after document is loaded
window.onload = function() {
  // initialize world
  world.l = 0
  world.t = 0
  world.r = world.l + parseInt(getStyle("playarea", "width"))
  world.b = world.t + parseInt(getStyle("playarea", "height"))

  // initialize player 1
  player1 = new Player(karateman)
  player1.esdfControl()

  // initialize player 2
  player2 = new Player(bowman)
  player2.arrowControl()
  player2.useMouse()
  // move to lower right corner, facing left
  player2.avatar.x = world.r - player2.avatar.template.r
  player2.avatar.y = world.b - player2.avatar.template.b
  player2.avatar.setGoal(player2.avatar.x, player2.avatar.y)
  player2.avatar.facing = "left"

  // initialize agent 1
  agent1 = new Agent(bowman)  agent1.avatar.x = world.r - agent1.avatar.template.r
  agent1.avatar.y = world.b - agent1.avatar.template.b
  agent1.avatar.setGoal(agent1.avatar.x, agent1.avatar.y)
  agent1.avatar.facing = "left"

  // initialize agent 2
  agent2 = new Agent(horseman)  agent2.avatar.x = world.r - agent2.avatar.template.r -500
  agent2.avatar.y = world.b - agent2.avatar.template.b
  agent2.avatar.setGoal(agent2.avatar.x, agent2.avatar.y)
  agent2.avatar.facing = "right"
  agent2.alignment = "good"
  agent2.avatar.setTitle("good")

  // initialize agent 3
  agent3 = new Agent(swordsman)  agent3.avatar.x = world.r - agent3.avatar.template.r -300
  agent3.avatar.y = world.b - agent3.avatar.template.b -100
  agent3.avatar.setGoal(agent3.avatar.x, agent3.avatar.y)
  agent3.avatar.facing = "left"


  // start main "loop" called every frame
  setInterval(think, 50)
}

// main "loop" function to be run every frame
function think() {
  // run each agent's think function
  for (var i = 0; i < agents.length; i++)
    agents[i].think()

  // run entity update methods
  for (var i = 0; i < entities.length; i++)
    entities[i].update()

  // sort entities
  for (var i = 0; i < entities.length; i++)
    entities[i].element.style.zIndex = "" + Math.floor(entities[i].y)
}

// give each player a chance to process key presses
document.onkeydown = function (event) {
  code = getKeyCode(event)
  for (var i = 0; i < players.length; i++)
    players[i].keyDown(code)
}

// give each player a chance to process key releases
document.onkeyup = function (event) {
  code = getKeyCode(event)
  for (var i = 0; i < players.length; i++)
    players[i].keyUp(code)
}

function addNewPlayerFromForm() {
  var templateName = document.getElementById("newPlayerTemplate").value
  var controlScheme = document.getElementById("newPlayerControls").value
  var useMouse = document.getElementById("newPlayerMouse").checked
  var playerOrAgent 

  if (templateName == "swordsman") var template = swordsman
  if (templateName == "bowman") var template = bowman
  if (templateName == "karateman") var template = karateman
  if (templateName == "horseman") var template = horseman

  if (controlScheme == "good") {
    playerOrAgent = new Agent(template)
    playerOrAgent.alignment = "good"
    playerOrAgent.avatar.setTitle("good")
    playerOrAgent.avatar.x = 500
    playerOrAgent.avatar.y = 50
    playerOrAgent.avatar.facing = "left"
  }
  else if (controlScheme == "evil") {
    playerOrAgent = new Agent(template)
    playerOrAgent.alignment = "evil"
    playerOrAgent.avatar.setTitle("evil")
  }
  else {
    playerOrAgent = new Player(template)
    if (useMouse) playerOrAgent.useMouse()
    if (controlScheme == "esdf") playerOrAgent.esdfControl()
    if (controlScheme == "wasd") playerOrAgent.wasdControl()
    if (controlScheme == "arrows") playerOrAgent.arrowControl()
    if (controlScheme == "numpad") playerOrAgent.numpadControl()
  }
}

