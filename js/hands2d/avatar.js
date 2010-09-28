// Avatar, an animated fighting entity
// Copyright (C) 2008  Seth Galbraith. See copying.txt for full copyright notice

var AVATAR_RUN_DELAY = 5        // time to slide before turning
var AVATAR_ACTION_RECOVERY = 5  // time between actions
var AVATAR_ACTION_DURATION = 10 // duration of actions
var AVATAR_ACTION_HALFTIME = 5  // duration of double-fast actions
var AVATAR_PAIN_DURATION = 5    // time to show pain frame
var AVATAR_FALL_DURATION = 30   // time to stay knocked down
var AVATAR_BASE_SPEED = 2       // movement for 0 quickness
var AVATAR_SPEED_FACTOR = 0.5   // extra movement per quickness level
var AVATAR_HP_MULTIPLIER = 5    // hit points per toughness level

function Avatar(template, player) {
  this.player = player
  this.template = template

  // initialize timers
  this.runTime = AVATAR_RUN_DELAY
  this.fallTime = 0
  this.painTime = 0
  this.actionTime = 0

  this.element = document.createElement("div")
  this.element.className = "avatar"

  // animation
  this.action = ""
  this.actionResolved = true
  this.nextAction = "" // most recently selected action, if still wanted
  this.facing = "right"
  this.spinning = false // attack enemies on both sides
  this.img = new Image()
  this.img.style.position = "absolute"
  this.element.appendChild(this.img)
  this.template.center(this.img)
  this.oldImage = ""
  this.animate()

  // status area beneath avatar graphics
  var status = document.createElement("div")
  status.className = "status" // class for CSS styling
  this.element.appendChild(status)

  // hit point meter
  var maxHP = document.createElement("div")
  maxHP.className = "maxHP" // class for CSS styling
  status.appendChild(maxHP)
  this.hitPointMeter = document.createElement("div")
  this.hitPointMeter.className = "hp" // class for CSS styling
  maxHP.appendChild(this.hitPointMeter)

  // label showing who controls the avatar
  this.titleElement = document.createElement("div")
  status.appendChild(this.titleElement)

  // default position: upper-left corner of the map
  this.x = -this.template.l
  this.y = -this.template.t

  // default goal: current position
  this.goalX = this.x
  this.goalY = this.y

  // initialize this.xVel/yVel and place the image representing the avatar
  this.move()

  // initialize this.l/t/r/b and this.threatBoxLeft/Right/Both
  this.threatBoxLeft = {}
  this.threatBoxRight = {}
  this.threatBoxBoth = {}
  this.updateBoxes()

  // sounds
  this.hitSound  = new Sound("sounds/hit.wav")
  this.missSound = new Sound("sounds/miss.wav")

  // stats
  // because action happens about 10 x the speed of the Scratch RPS
  // character have 10 x as many HP in Hack and Slash 2D
  this.quickness = this.template.quickness
  this.fighting = this.template.fighting
  this.shooting = this.template.shooting
  this.wrestling = this.template.wrestling
  this.toughness = this.template.toughness
  this.maxHP = (2 + this.toughness) * AVATAR_HP_MULTIPLIER
  this.hitPoints = this.maxHP

  // set this.removed = true when removing this avatar from the entities list
  this.removed = false

  // add avatar to the world
  document.getElementById("playarea").appendChild(this.element)
  entities.push(this)
}
// called every frame to update the entity
Avatar.prototype.update = function () {
  this.move()            // move toward goal
  this.updateBoxes()     // update bounding box and melee attack areas
  this.autoFace()        // turn around if the only enemies near are behind you
  this.chooseAction()    // choose next action
  this.tryToHitTargets() // try to complete attack or wrestle action
  this.updateTimers()    // update animation timers
  this.animate()         // decide which image to show
  this.trigger(triggers) // activate triggers
}
// change location while staying in the play area
Avatar.prototype.move = function() {
  // move toward goal if you can
  if (this.fallTime <= 0) {
    // find ideal velocity
    this.xVel = this.goalX - this.x
    this.yVel = this.goalY - this.y
    // apply speed limits
    var xLimit = AVATAR_BASE_SPEED + AVATAR_SPEED_FACTOR * this.quickness
    var yLimit = xLimit / 2
    if (this.xVel >  xLimit) this.xVel =  xLimit
    if (this.xVel < -xLimit) this.xVel = -xLimit
    if (this.yVel >  yLimit) this.yVel =  yLimit
    if (this.yVel < -yLimit) this.yVel = -yLimit
    // update physical position
    this.x = this.x + this.xVel
    this.y = this.y + this.yVel
  }
  // stay inside the playable area
  if (this.x + this.template.l < world.l) this.x = world.l - this.template.l
  if (this.x + this.template.r > world.r) this.x = world.r + this.template.r
  if (this.y + this.template.t < world.t) this.y = world.t - this.template.t
  if (this.y + this.template.b > world.b) this.y = world.b + this.template.b
  // update position of image
  this.element.style.left = this.x + "px"
  this.element.style.top  = this.y + "px"

}
// choose next action
Avatar.prototype.chooseAction = function() {
  if (this.fallTime > 0) return // wait until standing
  if (this.actionTime > -AVATAR_ACTION_RECOVERY) return // wait after action
  if (this.nextAction == "") return // no action currently requested

  this.spinning = false

  // aim at mouse cursor if attacking with the mouse button
  if (this.targetMouse) {
    if (Mouse.x < this.x) this.facing = "left"
    if (Mouse.x > this.x) this.facing = "right"
  }
  else { // spin attack if you are moving backward
    if (this.xVel < 0 && this.facing == "right") {
      this.facing = "left"
      this.spinning = true
    }
    if (this.xVel > 0 && this.facing == "left") {
      this.facing = "left"
      this.spinning = true
    }
  }

  this.actionTime = AVATAR_ACTION_DURATION // set action timer
  this.action = this.nextAction            // remember action being performed

  // shooting fires a missile that resolves the action when it hits a target
  if (this.action == "shoot") new Missile(this)

  // wrestling actions have to be resolved by the avatar itself
  if (this.action == "wrestle") this.actionResolved = false

  // normal/fighting attacks have to be resolved by the avatar too
  if (this.action == "attack") {
    this.actionResolved = false
    // fighting is faster when you are healthy
    // in the Scratch RPS this means you can do 2 attacks per turn
    // in Hack and Slash 2D this means the attacks take half as long
    if (this.hitPoints > this.maxHP / 2)
      this.actionTime = AVATAR_ACTION_HALFTIME
  }
}
// activate triggers
Avatar.prototype.trigger = function() {
  for (var i = 0; i < triggers.length; i++) {
    if (boxesIntersect(this, triggers[i]))
      triggers[i].action()
  }
}
// update animation timers
Avatar.prototype.updateTimers = function () {
  this.painTime = this.painTime - 1
  this.actionTime = this.actionTime - 1
  this.runTime = this.runTime - 1
  if (this.hitPoints > 0) // don't get up if incapacitated
    this.fallTime = this.fallTime - 1
}
// decide which action image to show
Avatar.prototype.animate = function () {
  if (this.fallTime > 0) {                       // fallen
    pose = "fallen" + this.facing
  } else if (this.actionTime > 0) {              // attacking
    pose = this.action + this.facing
  } else if (this.painTime > 0) {
    pose = "pain" + this.facing
  } else if (this.xVel == 0 && this.yVel == 0) { // standing
    pose = "ready" + this.facing
    this.runTime = AVATAR_RUN_DELAY
  } else if (this.runTime > 0) {                 // moving but not running yet
    pose = "retreat" + this.facing
    if (this.facing == "left"  && this.xVel < 0) pose = "advanceleft"
    if (this.facing == "right" && this.xVel > 0) pose = "advanceright"
  } else {                                       // running
    if (this.xVel < 0) this.facing = "left"
    if (this.xVel > 0) this.facing = "right"
    // show animationn for running straight up or down instead of animation
    // for running left and right if moving more vertically than horizontally
    if (Math.abs(this.yVel) <= Math.abs(this.xVel)) pose = "run" + this.facing
    else if (this.yVel > 0) pose = "runup"
    else pose = "rundown"
  }
  this.setImage(this.template.name + "/" + pose + ".gif")
}
// if necessary, change the image representing the avatar
Avatar.prototype.setImage = function (newImage) {
  if (this.oldImage != newImage) {
    this.img.src  = newImage
    this.oldImage = newImage
  }
}
// turn around if there is a target in melee range behind you
// but no target in melee range in front of you
Avatar.prototype.autoFace = function () {
  if (this.fallTime   > 0) return // fallen
  if (this.actionTime > 0) return // attacking
  if (this.painTime   > 0) return // flinching
  // check for enemies in front of you
  if (this.facing == "left")  box = this.threatBoxLeft
  if (this.facing == "right") box = this.threatBoxRight
  for (var i = 0; i < entities.length; i++) {
    if (entities[i].takeDamage == undefined) continue // undamageable
    if (entities[i] === this)                continue // self
//    if (entities[i].fallTime > 0)            continue // on ground
    if (!boxesOverlap(box, entities[i]))     continue // out of reach
    // you have enemies in front of you, so don't turn around
    return
  }
  // check for enemies in behind of you
  if (this.facing == "left")  box = this.threatBoxRight
  if (this.facing == "right") box = this.threatBoxLeft
  for (var i = 0; i < entities.length; i++) {
    if (entities[i].takeDamage == undefined) continue // undamageable
    if (entities[i] === this)                continue // self
//    if (entities[i].fallTime > 0)            continue // on ground
    if (!boxesOverlap(box, entities[i]))     continue // out of reach
    // found one, so turn around
    if (this.facing == "left")  this.facing = "right"
    else this.facing = "left"
    return
  }
}
Avatar.prototype.defense = function() { //this is for the defense stat
  block = this.quickness + 12
  return block
}
// try to resolve an action by finding targets to hit
Avatar.prototype.tryToHitTargets = function () {
  // don't try to hit targets if the action is finished
  if (this.actionTime <= 0) this.actionResolved = true
  if (this.actionResolved) return

  // extents of area to be attacked
  if (this.facing == "left")  box = this.threatBoxLeft
  if (this.facing == "right") box = this.threatBoxRight
  if (this.spinning)          box = this.threatBoxBoth

  // figure out which targets got hit
  targets = []
  for (var i = 0; i < entities.length; i++) {
    if (entities[i].takeDamage == undefined) continue // undamageable
    if (entities[i] === this)                continue // self
//    if (entities[i].fallTime > 0)            continue // on ground
    if (!boxesOverlap(box, entities[i]))     continue // out of reach
    // this is the last time we need to look for targets
    // because we found at least one target in range
    this.actionResolved = true
    // Roll a d20
    var d20roll = d20()
    if (this.action == "attack") d20roll = d20() + this.fighting
    if (this.action == "wrestle") d20roll = d20() + this.wrestling
    // add the entity to hit list if roll succeeds 
    var defense = entities[i].defense()
    if (d20roll > defense) targets.push(entities[i])
    // display roll
    if (this.player !=  null) { 
      var score = document.getElementById("score" + this.player.id)
      score.innerHTML = "roll: " + d20roll + " vs. " + defense + "<br />\n"
    }
  }

  // if any targets were hit, play sound
  if (targets.length > 0) this.hitSound.play()
  else this.missSound.play()

  // affect targets
  for (var i = 0; i < targets.length; i++) {
    // fighting does damage
    if (this.action == "attack") targets[i].takeDamage(1)
    // wrestling knocks the target down
    if (this.action == "wrestle") {
      targets[i].fall()
      // wrestling also does damage when you are healthy
      if (this.hitPoints > this.maxHP / 2) targets[i].takeDamage(1)
    }
  }
}
// fall down when incapacitated or forced to skip a turn
Avatar.prototype.fall = function() {
  this.fallTime = AVATAR_FALL_DURATION
}
// lose hit points and show consequences
Avatar.prototype.takeDamage = function(damage) {

  // subtract damage from hit points
  this.hitPoints = this.hitPoints - damage
  if (this.hitPoints <= 0) {
    this.hitPoints = 0 // don't let hit points be negative
    this.fall()        // incapacitated
  }

  // show pain animation if it is at least 1 frame after last pain animation
  if (this.painTime < 0)
    this.painTime = AVATAR_PAIN_DURATION

  // Update health meter
    this.hitPointMeter.style.width = (100 * this.hitPoints / this.maxHP) + "%"
    if (this.hitPoints > (this.maxHP / 2))
      this.hitPointMeter.style.backgroundColor = "#0C0" // green if healthy
    else
      this.hitPointMeter.style.backgroundColor = "#F00" // red if injured
}
// begin an action or remember which action to start doing next
Avatar.prototype.beginAction = function (action) {
  this.nextAction = action
  // try to execute action immediately
  this.chooseAction()
  this.tryToHitTargets()
  this.animate()
}
// stop repeating an action
Avatar.prototype.finishAction = function (action) {
  if (this.nextAction == action)
      this.nextAction = ""
}
// set the goal the avatar will move toward
Avatar.prototype.setGoal = function (x, y) {
  this.goalX = x
  this.goalY = y
  // don't try to wander beyond the edge of the world
  // because it looks silly to run in place
  var template = this.template
  var l = world.l - template.l
  var r = world.r - template.r
  var t = world.t - template.t
  var b = world.b - template.b
  if (x < l) this.goalX = l
  if (x > r) this.goalX = r
  if (y < t) this.goalY = t
  if (y > b) this.goalY = b
}
Avatar.prototype.updateBoxes = function () {
  // use local variables to reduce repetition
  var x = this.x
  var y = this.y
  var template = this.template
  var xReach = template.reach
  var yReach = xReach / 2
  var l = x - xReach
  var r = x + xReach
  var t = y - yReach
  var b = y + yReach
  // physical bounding box
  this.l = x + template.l
  this.r = x + template.r
  this.t = y + template.t
  this.b = y + template.b
  // area threatened by melee attacks to the left
  this.threatBoxLeft.l = l
  this.threatBoxLeft.r = x
  this.threatBoxLeft.t = t
  this.threatBoxLeft.b = b
  // area threatened by melee attacks to the right
  this.threatBoxRight.l = x
  this.threatBoxRight.r = r
  this.threatBoxRight.t = t
  this.threatBoxRight.b = b
  // area threatened by melee attacks in both directions
  this.threatBoxBoth.l = l
  this.threatBoxBoth.r = r
  this.threatBoxBoth.t = t
  this.threatBoxBoth.b = b
}
// remove the avatar from the entities list
Avatar.prototype.remove = function () {
  // remove image of avatar so players don't see it anymore
  document.getElementById("playarea").removeChild(this.element)
  // let agents targetting this avatar know it has been removed
  this.removed = true
  // remove avatar from entities list
  for (var i = 0; i < entities.length; i++) {
    if (entities[i] === this) {
      entities.splice(i, 1)
      break
    }
  }
}
// change the label showing who controls the avatar
Avatar.prototype.setTitle = function (title) {
  this.titleElement.innerHTML = title
}

