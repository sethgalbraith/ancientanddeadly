// agent, handles input for a single user
// Copyright (C) 2008  Seth Galbraith. See copying.txt for full copyright notice

var agents  = [] // agents will automatically add themselves to this list

function Agent(template) {
  this.avatar = new Avatar(template, null) // avatar controlled by the agent
  agents.push(this) // add this new Agent to the global agents array
  this.attackTime = 0 // delay between attempts to attack
  this.target = null // avatar selected for targeting by the AI
  this.moveTime = 0 // delay between course changes to avoid spastic chases
  this.action = "attack"
  this.verticalPaces = 15 // vertical distance that triggers an attack
  this.horizontalPaces = 30 // horizontal distance that triggers an attack

  this.alignment = "evil"
  this.avatar.setTitle("evil")

  // set action variable based on avatar.template
  if (this.avatar.shooting > 0) {
    this.action = "shoot"
    this.verticalPaces = 5
    this.horizontalPaces = 400
  }
  else if (this.avatar.wrestling > 0) {
    this.action = "wrestle"
  }
  else {
    this.action = "attack"
  }

}

// called every frame to give the agent a chance to change plans
Agent.prototype.think = function () {
  var target = this.target // just to make the next line simpler
  if (target != null && target.hitPoints > 0 && target.removed == false) {
    this.chooseGoal()   // move toward the target
    this.chooseAction() // attack the target
  }
  else {
    // the agent has no target or a dead or removed target, so pick a new one
    this.chooseTarget() // no good targets, so pick a new one
  }
}

// find a new target
Agent.prototype.chooseTarget = function () {
  if (this.alignment == "evil") {
    this.target = null // no target unless a living agent is found
    for (var i = 0; i < agents.length; i++) { // loop through the agents
      if (agents[i].alignment == "good") { // if target is good
        if (agents[i].avatar.hitPoints > 0) { // if their avatar is not dead
          this.target = agents[i].avatar // the avatar is the new target
          agents[i].target = this.avatar
          break // don't check any more agents, stick with the first target found
        }
      }
    }
    if (this.target == null) {
      for (var i = 0; i < players.length; i++) { // loop through the players
        if (players[i].avatar.hitPoints > 0) { // if their avatar is not dead
          this.target = players[i].avatar // the avatar is the new target
          break // don't check any more players, stick with the first target found
        }
      }
    }
  }
  else {
    this.target = null // no target unless a living PC is found
    for (var i = 0; i < agents.length; i++) { // loop through the agents
      if (agents[i].alignment == "evil") { // if target is evil
        if (agents[i].avatar.hitPoints > 0) { // if their avatar is not dead
          this.target = agents[i].avatar // the avatar is the new target
          agents[i].target = this.avatar
          break // don't check any more agents, stick with the first target found
        }
      }
    }
  }
}

// movement logic
Agent.prototype.chooseGoal = function () {
  if (this.moveTime == 0) { // stay the course until this.moveTime frames pass
    var x = this.target.x
    var y = this.target.y
    if (this.avatar.facing == "left") {
      x = x + 20 // facing left, so stay to the target's right
    }
    else {
      x = x - 20 // facing right, so stay to the target's left
    }
    this.avatar.setGoal(x, y)
    this.moveTime = 15 // don't change course for 15 more frames
  }
  this.moveTime = this.moveTime - 1 // count down frames to next course change
}




// action logic
Agent.prototype.chooseAction = function () {
  var distanceX = this.target.x - this.avatar.x
  var distanceY = this.target.y - this.avatar.y
  if (Math.abs(distanceY) < this.verticalPaces) { // vertical distance that triggers an attack
    if (Math.abs(distanceX) < this.horizontalPaces) { // horizontal distance that triggers an attack
      if (this.attackTime == 0) {
        this.attackTime = 2 // wait 2 frames before attacking again
        this.avatar.beginAction(this.action) // like pressing the attack button
        this.avatar.finishAction(this.action) // like releasing the attack button
      }
      this.attackTime = this.attackTime - 1 // count down frames to next attack
    }
  }
}

