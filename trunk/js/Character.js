Game.Character = function (xmlElement) {

  // default variable values
  this.element = Game.createElement("div", {className:"character"});
  this.container = Game.createElement("div", {}, this.element);
  this._x = 0;
  this._y = 0;
  this.action = "stand";
  this.frame = 0;
  this.location = "start";
  this.path = null;
  this.pathStep = 0;
  this.speed = 10;
  this.sequences = {};
  this._facing = "right";

  // get settings from XML element
  this.x = parseInt(xmlElement.getAttribute("x"));
  this.y = parseInt(xmlElement.getAttribute("y"));
  var sequenceElements = xmlElement.getElementsByTagName("sequence");
  for (var i = 0; i < sequenceElements.length; i++) {
    var frameElements = sequenceElements[i].getElementsByTagName("frame");
    var actionName = sequenceElements[i].getAttribute("action");
    this.sequences[actionName] = [];
    for (var j = 0; j < frameElements.length; j++) {
      var url = frameElements[j].textContent;
      this.sequences[actionName].push(url);
      var image = new Image();
      image.src = url;
    }
  }
  var xOffset = xmlElement.getAttribute("xOffset");
  var yOffset = xmlElement.getAttribute("yOffset");

  // create character image
  var self = this;
  this.image = new Image();
  this.image.src = this.sequences[this.action][this.frame];
  this.image.onload = function () {
    var x = (xOffset ? parseInt(xOffset) : 0) + self.image.width / 2;
    var y = (yOffset ? parseInt(yOffset) : 0) + self.image.height / 2;
    self.image.style.marginLeft = -x + "px";
    self.image.style.marginTop = -y + "px";
  }
  this.container.appendChild(this.image);
};

Game.Character.prototype.__defineGetter__("x", function() {return this._x;});
Game.Character.prototype.__defineSetter__("x", function(value) {
  this.element.style.left = value + "px";
  this._x = value;
});

Game.Character.prototype.__defineGetter__("y", function() {return this._y;});
Game.Character.prototype.__defineSetter__("y", function(value) {
  this.element.style.top = value + "px";
  this._y = value;
});

Game.Character.prototype.__defineGetter__("facing", function() {return this._facing;});
Game.Character.prototype.__defineSetter__("facing", function(value) {
  var transform = (value == "right") ? "" : "scaleX(-1)";
  this.image.style.oTransform = transform;
  this.image.style.mozTransform = transform;
  this.image.style.webkitTransform = transform;
  this._facing = value;
});

Game.Character.prototype.animate = function () {
  var sequence = this.sequences[this.action];
  this.frame++;
  if (this.frame >= sequence.length) {
    this.frame = 0;
  }
  this.image.src = sequence[this.frame];
};

Game.Character.prototype.move = function () {
  if (this.path) {
    var goal = this.path.steps[this.pathStep];
    var deltaX = goal.x - this.x;
    var deltaY = goal.y - this.y;
    var distanceSquared = deltaX * deltaX + deltaY * deltaY;
    // if you can reach the destination this frame...
    if (distanceSquared <= this.speed * this.speed) {
      this.x = goal.x;
      this.y = goal.y;
      this.pathStep++;
      if (this.pathStep == this.path.steps.length) {
        this.location = this.path.to;
        this.path = null;
        this.pathStep = 0;
        this.element.className = "character";
      }
    }
    // if you cannot reach the destination this frame...
    else {
      distance = Math.sqrt(distanceSquared);
      this.x += this.speed * deltaX / distance;
      this.y += this.speed * deltaY / distance;
      this.element.className = "character moving";
    }
    // turn to face right if moving right
    // turn to face left if moving left
    // but do not turn if moving straight up or down
    if (deltaX > 0) {
      this.facing = "right";
    }
    if (deltaX < 0) {
      this.facing = "left";
    }
  }
//  this.image.style.left = this.x + "px";
//  this.image.style.top = this.y + "px";
};

