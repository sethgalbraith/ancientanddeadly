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

  var self = this;

  // create character image

  this.image = new Image();
  this.image.src = this.sequences[this.action][this.frame];
  this.image.onload = function () {
    self.image.style.position = "absolute";
    self.image.style.left = self.x + "px";
    self.image.style.top = self.y + "px";
    self.image.style.marginLeft = -self.image.width / 2 + "px";
    self.image.style.marginTop = -self.image.height / 2 + "px";
    document.getElementById("game").contentDocument.body.appendChild(self.image)
  }

  // start animation and movement

  setInterval(function () {self.animate();}, 100);
  setInterval(function () {self.move();}, 50);
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
        this.location = this.path.destination;
        this.path = null;
        this.pathStep = 0;
      }
    }
    else {
      distance = Math.sqrt(distanceSquared);
      this.x += this.speed * deltaX / distance;
      this.y += this.speed * deltaY / distance;
    }
    this.image.style.left = this.x + "px";
    this.image.style.top = this.y + "px";

    // TODO: fix this hack
    if (this == Game.characters[0]) {
      var body = document.getElementById("game").contentDocument.body;
      body.scrollTop = this.y - 200;
      body.scrollLeft = this.x - 300;
    }
  }
};

