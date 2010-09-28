// Missile, a deadly flying projectile
// Copyright (C) 2008  Seth Galbraith. See copying.txt for full copyright notice

var MISSILE_STEPS = 2 // number of steps moved by the missile each frame
var MISSILE_SPEED = 8 // distance the missile moves with each step
var MISSILE_RADIUS = 4 // half width of missile bounding box
var MISSILE_HEIGHT = 12 // height of missile above ground

preloadImages(["thrown-weapon-left.gif", "thrown-weapon-right.gif"])

function Missile(thrower) {
  // list of entities the missile should not hit
  this.ignore = [thrower, this]
  // set missile velocity based on thrower facing direction
  if (thrower.facing == "left")  this.xVel = -MISSILE_SPEED
  if (thrower.facing == "right") this.xVel =  MISSILE_SPEED
  this.yVel = 0
  // aim at mouse cursor if the thrower is controlled by a player
  // AND the player is using the mouse AND attacked using the midddle button
  if (thrower.player != null && thrower.player.mouse && Mouse.buttons[1]) {
    var x = Mouse.x - thrower.x
    var y = Mouse.y - thrower.y
    // actual distance = Math.sqrt(x * x + y * y)
    // quadruple (y * y) so missiles don't go up/down as fast as left/right
    var distance = Math.sqrt(x * x + (y * y) * 4)
    if (distance > 0) {
      this.xVel = MISSILE_SPEED * x / distance
      this.yVel = MISSILE_SPEED * y / distance
    }
  }
  // determine missile facing direction from velocity
  var angle = Math.atan2(-this.yVel, this.xVel) * 180 / Math.PI
  if (angle < -157.5 || angle > 157.5) this.facing = "left"
  else if (angle < -112.5) this.facing = "downleft"
  else if (angle <  -67.5) this.facing = "down"
  else if (angle <  -22.5) this.facing = "downright"
  else if (angle <   22.5) this.facing = "right"
  else if (angle <   67.5) this.facing = "upright"
  else if (angle <  112.5) this.facing = "up"
  else this.facing = "upleft"
  // image representing missile  
  this.element = new Image()
  this.element.src = thrower.template.name + "/missile" + this.facing + ".gif"
  this.element.style.position = "absolute"
  this.element.style.marginLeft = -thrower.template.missileWidth / 2
  this.element.style.marginTop = -thrower.template.missileHeight / 2 - MISSILE_HEIGHT
  // set this.x/y/l/t/r/b and position image
  this.setPosition(thrower.x, thrower.y)
  // add missile to entities list and show it's image
  entities.push(this)
  document.getElementById("playarea").appendChild(this.element)
  this.shooting = thrower.shooting 
}
Missile.prototype.update = function () {
  for (var i = 0; i < MISSILE_STEPS; i++) {
    // move, try to hit stuff and disappear if successful
    this.setPosition(this.x + this.xVel, this.y + this.yVel)
    if (this.checkCollision()) {this.remove(); return}
  }
}
Missile.prototype.setPosition = function (x, y) {
  this.x = x
  this.y = y
  this.l = x - MISSILE_RADIUS
  this.r = x + MISSILE_RADIUS
  this.t = y - MISSILE_RADIUS
  this.b = y + MISSILE_RADIUS
  this.element.style.left = x + "px"
  this.element.style.top = y + "px"
}
Missile.prototype.remove = function() {
  // remove the missile graphic from the document
  document.getElementById("playarea").removeChild(this.element)

  // remove this missile object from the entities list
  for (var i = 0; i < entities.length; i++) {
    if (entities[i] === this) {
      entities.splice(i, 1)
      break
    }
  }
}
Missile.prototype.checkCollision = function () {
  var hit = false
  for (var i = 0; i < entities.length; i++) {
    // entity is unable to take damage
    if (entities[i].takeDamage == undefined) continue
//    if (entities[i].fallTime > 0) continue

    // entity is in the missile's ignore list
    var ignore = false
    for (var j = 0; j < this.ignore.length; j++) 
      if (entities[i] === this.ignore[j])
        ignore = true
    if (ignore) continue

    // missile is not touching entity
    if (!boxesOverlap(this, entities[i])) continue
 
    // if roll succeeds, do damage and disappear 
    var defense = entities[i].defense()
    var d20roll = d20() + this.shooting 
    if (d20roll > defense) {
       entities[i].takeDamage(2)
       entities[i].hitSound.play()
       hit = true
    }
    // if the roll fails, ignore this entity in the future
    else {
       entities[i].missSound.play()
       this.ignore.push(entities[i])
    }
  }
  // if the missile is out of bounds, disappear
  if      (this.x < world.l) hit = true
  else if (this.x > world.r) hit = true
  else if (this.y < world.t) hit = true
  else if (this.y > world.b) hit = true

  return hit
}

