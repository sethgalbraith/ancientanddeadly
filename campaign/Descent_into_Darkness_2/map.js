var Animation = function(element) {
  this.x = element.getAttribute("x");
  this.y = element.getAttribute("y");
  this.frame = 0;
  this.frames = [];
  var frameElements = element.getElementsByTagName("frame");
  for (var i = 0; i < frameElements.length; i++) {
    var image = new Image();
    image.src = frameElements[i].textContent;
    this.frames.push(image);
  }
  this.image = new Image();
  this.image.src = this.frames[this.frame].src;
  this.image.style.position = "absolute";
  this.image.style.left = this.x + "px";
  this.image.style.top = this.y + "px";
  this.image.onmousedown = function (e) {
    if (!e) var e = window.event;
    e.preventDefault();
    return false;
  };
  document.body.appendChild(this.image);
  var self = this;
  setInterval(function() {
    self.frame++;
    if (self.frame == self.frames.length) self.frame = 0;
    self.image.src = self.frames[self.frame].src;
  }, 100);
};

Animation.animations = [];

addEventListener("load", function() {
  var ajax = new XMLHttpRequest();
  ajax.open("GET", "maps.xml", true);
  ajax.send(null);
  ajax.onreadystatechange = function() {
    if (ajax.readyState == 4 && ajax.status == 200) {
      var mapElements = ajax.responseXML.getElementsByTagName("map");
      var image = new Image();
      image.src = mapElements[0].getAttribute("background");
      document.body.appendChild(image);
      image.onmousedown = function (e) {
        if (!e) var e = window.event;
        e.preventDefault();
        return false;
      };
      var animationElements = mapElements[0].getElementsByTagName("animation");
      for (var i = 0; i < animationElements.length; i++) {
        Animation.animations.push(new Animation(animationElements[i]));
      }
    }
  };
}, false);

