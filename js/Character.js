Game.Character = function (xmlElement) {

  // Set default variable values.
  this.element = Game.createElement("div", {className:"character"});
  this.container = Game.createElement("div", {}, this.element);
  this._x = 0;
  this._y = 0;
  this._action = "stand";
  this._frame = 0;
  this.location = "start";
  this.path = null;
  this.pathStep = 0;
  this.speed = 20;
  this.sequences = {};
  this._facing = "right";
  this.idleMin = 10;
  this.idleMax = 50;
  this.nextIdleFrame = -1;

  // Get settings from the XML element.
  this.x = parseInt(xmlElement.getAttribute("x"));
  this.y = parseInt(xmlElement.getAttribute("y"));
  this.location = xmlElement.getAttribute("location");
  var xOffsetAttribute = xmlElement.getAttribute("xOffset");
  var yOffsetAttribute = xmlElement.getAttribute("yOffset");
  xOffset = xOffsetAttribute ? parseInt(xOffsetAttribute) : 0;
  yOffset = yOffsetAttribute ? parseInt(yOffsetAttribute) : 0;

  // Load images.
  var sequenceElements = xmlElement.getElementsByTagName("sequence");
  for (var i = 0; i < sequenceElements.length; i++) {
    var frameElements = sequenceElements[i].getElementsByTagName("frame");
    var actionName = sequenceElements[i].getAttribute("action");
    this.sequences[actionName] = [];
    for (var j = 0; j < frameElements.length; j++) {
      var url = frameElements[j].textContent
      this._loadImage(url, xOffset, yOffset, actionName);
    }
  }

  this.scheduleIdleAnimation();
};

Game.Character.prototype._loadImage = function (url, xOffset, yOffset, actionName) {
  var image = new Image();
  image.src = url;
  image.onload = function () {
    image.style.marginLeft = -(xOffset + image.width / 2) + "px";
    image.style.marginTop = -(yOffset + image.height / 2) + "px";
  }
  this.sequences[actionName].push(image);
  this.container.appendChild(image);
  image.style.visibility = "hidden";
};

Game.Character.prototype.scheduleIdleAnimation = function () {
  var range = this.idleMax - this.idleMin;
  this.nextIdleFrame = this.idleMin + Math.floor(range * Math.random());
}

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
  this.container.className = value;
  this._facing = value;
});

Game.Character.prototype.__defineGetter__("frame", function() {return this._frame;});
Game.Character.prototype.__defineSetter__("frame", function(value) {
  this._hideCurrentFrame();
  // Set the frame to 0 in case the sequence does not exist
  // or does not contain enough frames.
  this._frame = 0;
  // Set the frame to value only when the sequence exists
  // and the sequence contains enough frames.
  if (this.sequences[this._action]) {
    if (value < this.sequences[this._action].length) {
      this._frame = value;
    }
  }
  this._showCurrentFrame();
});

Game.Character.prototype.__defineGetter__("action", function() {return this._action;});
Game.Character.prototype.__defineSetter__("action", function(value) {
  this._hideCurrentFrame();
  this._action = value;
  // Set the frame to 0 if the sequence does not exist
  // or does not contain enough frames.
  if (!this.sequences[this._action]) {
    this._frame = 0;
  }
  else if (this._frame >= this.sequences[this._action].length) {
    this._frame = 0;
  }
  this._showCurrentFrame();
});

Game.Character.prototype._hideCurrentFrame = function () {
  if (this.sequences[this._action]) {
    this.sequences[this._action][this._frame].style.visibility = "hidden";
  }
}

Game.Character.prototype._showCurrentFrame = function () {
  if (this.sequences[this._action]) {
    this.sequences[this._action][this._frame].style.visibility = "visible";
  }
}

Game.Character.prototype.animate = function () {
  this.frame++;
  if (this.action == "idle" && this.frame == 0) {
    this.action = "stand";
    this.scheduleIdleAnimation();
  }
  if (this.action == "stand" && this.sequences["idle"]) {
    this.nextIdleFrame--;
    if (this.nextIdleFrame == 0) {
      this.action = "idle";
      this.frame = 0;
    }
  }
};

Game.Character.prototype.moveRecursive = function (distance) {
  if (this.path) {
    var goal = this.path.steps[this.pathStep];
    var x = goal.x - this.x;
    var y = goal.y - this.y;
    var r = Math.sqrt(x * x + y * y);
    if (r <= distance) {
      // If you can reach the destination this frame, move to the destination,
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
        this.action = "stand";
      }
      else {
        // If this is not the last step on the path, keep moving.
        this.moveRecursive(distance - r)
      }
    }
    else {
      // If you cannot reach the destination this frame, move as far as you can.
      this.x += distance * x / r;
      this.y += distance * y / r;
      this.element.className = "character moving";
      this.action = "move";
    }
    // Face right if moving right, face left if moving left, but keep facing
    // whatever direction you faced previously if moving straight up or down.
    this.facing = (x > 0) ? "right" : (x < 0) ? "left" : this.facing;
  }
};

Game.Character.prototype.move = function () {
  this.moveRecursive(this.speed);
};

