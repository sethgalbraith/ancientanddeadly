Game.Character = function (xmlElement) {

  // Set default variable values.
  this.element = Game.createElement("div", {className:"character"});
  this.container = Game.createElement("div", {}, this.element);
  this._x = 0;
  this._y = 0;
  this.action = "stand";
  this.frame = 0;
  this.location = "start";
  this.path = null;
  this.pathStep = 0;
  this.speed = 20;
  this.sequences = {};
  this._facing = "right";

  // Get settings from the XML element.
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

  // Create the character's image.
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

Game.Character.prototype.moveRecursive = function (distance) {
  if (this.path) {
    var goal = this.path.steps[this.pathStep];
    var x = goal.x - this.x;
    var y = goal.y - this.y;
    var r = Math.sqrt(x * x + y * y);
    if (r <= distance) {
      // if you can reach the destination this frame, move to the destination,
      // and start moving toward the next step on the path.
      this.x = goal.x;
      this.y = goal.y;
      this.pathStep++;
      if (this.pathStep == this.path.steps.length) {
        // If this is the last step on the path, update my location
        // and set my path to null.
        this.location = this.path.to;
        this.path = null;
        this.pathStep = 0;
        this.element.className = "character";
      }
      else {
        // If this is not the last step on the path, keep moving.
        this.moveRecursive(distance - r)
      }
    }
    else {
    // if you cannot reach the destination this frame, move as far as you can.
      this.x += distance * x / r;
      this.y += distance * y / r;
      this.element.className = "character moving";
    }
    // Face right if moving right, face left if moving left, but keep facing
    // whatever direction you faced previously if moving straight up or down.
    this.facing = (x > 0) ? "right" : (x < 0) ? "left" : this.facing;
  }
};

Game.Character.prototype.move = function () {
  this.moveRecursive(this.speed);
};

