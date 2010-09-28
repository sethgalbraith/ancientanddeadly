// Entity, a generic middle ground prop which can be sorted by depth
// Copyright (C) 2008  Seth Galbraith. See copying.txt for full copyright notice

var entities = [] // entities will automatically add themselves to this list

function Entity(id) {
  this.element = document.getElementById(id)
  this.x = parseInt(getStyle(this.element, "left"))
  this.y = parseInt(getStyle(this.element, "top"))
  this.l = x
  this.r = x
  this.t = y
  this.b = y
  entities.push(this)
}
Entity.prototype.update = function () {
}

