Game.Character = function (element) {

  // default variable values

  this.x = 0;
  this.y = 0;
  this.action = "stand";
  this.frame = 0;
  this.location = "start";
  this.path = null;
  this.pathStep = 0;
  this.speed = 10;
  this.sequences = {};
  this.facing = "right";

  // get settings from XML element

  this.x = parseInt(element.getAttribute("x"));
  this.y = parseInt(element.getAttribute("y"));

  var sequenceElements = element.getElementsByTagName("sequence");
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

  var xOffset = element.getAttribute("xOffset");
  var yOffset = element.getAttribute("yOffset");

  // create character image
  var self = this;
  this.image = new Image();
  this.image.src = this.sequences[this.action][this.frame];
  this.image.onload = function () {
    self.image.style.position = "absolute";
    self.image.style.left = self.x + "px";
    self.image.style.top = self.y + "px";
    var x = (xOffset ? parseInt(xOffset) : 0) + self.image.width / 2;
    var y = (yOffset ? parseInt(yOffset) : 0) + self.image.height / 2;
    self.image.style.marginLeft = -x + "px";
    self.image.style.marginTop = -y + "px";
  }

};

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
    if (distanceSquared <= this.speed * this.speed) {
      this.x = goal.x;
      this.y = goal.y;
      this.pathStep++;
      if (this.pathStep == this.path.steps.length) {
        this.location = this.path.to;
        this.path = null;
        this.pathStep = 0;
      }
    }
    else {
      distance = Math.sqrt(distanceSquared);
      this.x += this.speed * deltaX / distance;
      this.y += this.speed * deltaY / distance;
    }
    if (deltaX > 0) {
      this.facing = "right";
    }
    if (deltaX < 0) {
      this.facing = "left";
    }
    var transform = (this.facing == "right") ? "" : "scaleX(-1)";
    this.image.style.oTransform = transform;
    this.image.style.mozTransform = transform;
    this.image.style.webkitTransform = transform;
  }
  this.image.style.left = this.x + "px";
  this.image.style.top = this.y + "px";
};

