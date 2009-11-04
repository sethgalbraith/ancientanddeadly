// Exit, an invisible trigger that loads a URL when triggered
// Copyright (C) 2008  Seth Galbraith. See copying.txt for full copyright notice

function Exit(id, url) {
  this.url     = url
  this.element = document.getElementById(id)
  this.left    = parseInt(getStyle(this.element, "left"))
  this.top     = parseInt(getStyle(this.element, "top"))
  this.right   = parseInt(getStyle(this.element, "width"))  + this.left
  this.bottom  = parseInt(getStyle(this.element, "height")) + this.top
}
Exit.prototype.action = function () {
  window.location.href = this.url
}


