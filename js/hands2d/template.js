// Template, defines a type of Avatar with unique graphics and dimensions
// Copyright (C) 2008  Seth Galbraith. See copying.txt for full copyright notice

function Template(name, imageSize, size, reach, missileSize) {
  // graphics
  this.name = name      // folder containing images
  this.w = imageSize[0] // image width
  this.h = imageSize[1] // image height
  this.missileWidth  = missileSize[0]
  this.missileHeight = missileSize[1]
  preloadImages([
    this.name + "/missileleft.gif", this.name + "/missileright.gif",
    this.name + "/missileupleft.gif", this.name + "/missileupright.gif",
    this.name + "/missiledownleft.gif", this.name + "/missiledownright.gif",
    this.name + "/missiledown.gif", this.name + "/missileup.gif",
    this.name + "/readyleft.gif",   this.name + "/readyright.gif",
    this.name + "/advanceleft.gif", this.name + "/advanceright.gif",
    this.name + "/retreatleft.gif", this.name + "/retreatright.gif",
    this.name + "/attackleft.gif",  this.name + "/attackright.gif",
    this.name + "/wrestleleft.gif", this.name + "/wrestleright.gif",
    this.name + "/shootleft.gif",   this.name + "/shootright.gif",
    this.name + "/painleft.gif",    this.name + "/painright.gif",
    this.name + "/fallenleft.gif",  this.name + "/fallenright.gif",
    this.name + "/runleft.gif",     this.name + "/runright.gif",
    this.name + "/runup.gif",       this.name + "/rundown.gif"])
  // physical dimensions
  this.l = -size[0] / 2 // left margin
  this.r =  size[0] / 2 // right margin
  this.t = -size[1] / 2 // top margin
  this.b =  size[1] / 2 // bottom margin
  this.reach = reach    // melee attack range
  // Abilities
  this.quickness = 0
  this.fighting = 0
  this.shooting = 0
  this.wrestling = 0
  this.toughness = 0
}
// center the image element to fit the template
Template.prototype.center = function (element) {
  element.style.width  = this.w
  element.style.height = this.h
  // x = the center of the image
  element.style.marginLeft   = -this.w / 2
  element.style.marginRight  = -this.w / 2
  // y = height of the bottom margin above the image bottom
  element.style.marginTop    = -this.h + this.b
  element.style.marginBottom = -this.h + this.b
}

