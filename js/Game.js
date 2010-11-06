// Game is a singleton object - meaning there is only one Game object.
// We create Game using literal object notation. For example we can create
// an object named point with x and y properties using the literal notation:
// var point = {x: 3, y: 10};

var Game = {

  // GAME STATE

  battleMaps: [],
  navigationMaps: [],
  currentNavigationMap: null,
  currentBattleMap: null,
  characters: [],
  party: [],
  turn: 0,
  selectedAction: null,
  selectedTargets: [],
  currentSlide: [],
  mode: "map",
  animationInterval: null,
  movementInterval: null,


  // FUNCTIONS

  createElement: function(tagName, attributes, parentElement) {
    var newElement = document.createElement(tagName);
    for (attributeName in attributes) {
       newElement[attributeName] = attributes[attributeName];
    }
    if (parentElement) {
      parentElement.appendChild(newElement);
    }
    return newElement;
  },

  ajaxRequest: function(url, arguments, callback) {
    // combine arguments into urlencoded string
    var argumentList = [];
    for (var argumentName in arguments) {
      var argumentValue = encodeURIComponent(arguments[argumentName]);
      argumentList.push(argumentName + "=" + argumentValue);
    }
    var argumentString = argumentList.join("&");
    // create and send ajax request
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4) callback(ajax);
    };
    ajax.open("POST", url, true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.setRequestHeader("Content-length", argumentString.length);
    ajax.setRequestHeader("Connection", "close");
    ajax.send(argumentString);
  },

  dieRoll: function() {
    return Math.floor(20 * Math.random());
  },

  loadBackground: function(fileName) {
    var background = new Image();
    background.src = fileName;
    background.onload = function () {
      // change the game frame to match the background
      var body = Game.frame.contentDocument.body;
      body.style.backgroundImage = "url(" + background.src + ")";
      body.style.width = background.width + "px";
      body.style.height = background.height + "px";
      body.style.margin = "0";
    };
  },

  loadCampaign: function(campaignName) {
    Game.ajaxRequest(campaignName, {}, function (ajax) {
      var maps = ajax.responseXML.getElementsByTagName("map");
      var map = maps[0]; // use the first map in the the map list
      Game.loadBackground(map.getAttribute("background"));
      Game.extractXMLPaths(map);
      Game.extractXMLCharacters(map);
      Game.party = [Game.characters[0]];
      Game.createMovementButtons(Game.characters[0]);
      Game.startAnimation();
      Game.startMovement();
    });
  },

  extractXMLCharacters: function (mapElement) {
    Game.characters = [];
    var characterElements = mapElement.getElementsByTagName("character");
    for (var i = 0; i < characterElements.length; i++) {
      var character = new Game.Character(characterElements[i]);
      Game.characters.push(character);
      Game.frame.contentDocument.body.appendChild(character.element);
    }
  },

  extractXMLPaths: function (mapElement) {
    Game.paths = {};
    var pathElements = mapElement.getElementsByTagName("path");
    for (var j = 0; j < pathElements.length; j++) {
      var path = new Game.Path(pathElements[j]);
      // Make sure that Game.paths has a variable named for the path origin,
      // and that the value of the variable is an object. This object can have
      // up to four variables: one named after each direction.
      if (!Game.paths[path.from]) {
        Game.paths[path.from] = {};
      }
      // Make the path the official path in this direction from that origin.
      Game.paths[path.from][path.direction] = path;
    }
  },

  startAnimation: function() {
    if (Game.animationInterval == null) {
      Game.animationInterval = setInterval(Game.animateCharacters, 100);
    }
  },

  stopAnimation: function() {
    if (Game.animationInterval != null) {
      clearInterval(Game.animationInterval);
      Game.animationInterval = null;
    }
  },

  startMovement: function() {
    if (Game.movementInterval == null) {
      Game.movementInterval = setInterval(Game.moveCharacters, 50);
    }
  },

  stopMovement: function() {
    if (Game.movementInterval != null) {
      clearInterval(Game.movementInterval);
      Game.movementInterval = null;
    }
  },

  pause: function() {
    Game.stopMovement();
    Game.stopAnimation();
  },

  resume: function() {
    Game.startMovement();
    Game.startAnimation();
  },

  createPlayerCharacters: function() {
  },
  
  beginCampaign: function() {
  },
  
  saveGame: function() {
  },
  
  listSavedGames: function() {
  },
  
  loadGame: function() {
  },
  
  deleteSavedGame: function() {
  },
  
  createUser: function(username, password) {
  },
  
  login: function(username, password) {
    Game.setUserForm("loggedInUserForm");
  },
  
  logout: function() {
    Game.setUserForm("defaultUserForm");
  },

  changePassword: function(oldPassword, newPassword) {
  },
  
  deleteUser: function() {
  },

  setUserForm: function(formId) {
    var node = Game.userForm.firstChild;
    while (node) {
      if (node.nodeType == document.ELEMENT_NODE) {
        node.style.display = "none";
      }
      node = node.nextSibling;
    }
    document.getElementById(formId).style.display = "inline";
  },

  initializeUserForm: function() {
    // hide everything but the default account management menu features
    Game.setUserForm("defaultUserForm");

    // attach event handlers to the account management menu buttons

    // default mode (not logged in) buttons: log in, register
    document.getElementById("showLogin").onclick = function () {
      Game.setUserForm("loginUserForm");};
    document.getElementById("showRegister").onclick = function () {
      Game.setUserForm("registerUserForm");};

    // login mode buttons: log in, cancel
    document.getElementById("login").onclick = function () {
      var username = document.getElementById("loginUserName").value;
      var password = document.getElementById("loginPassword").value;
      Game.login(username, password);
    };
    document.getElementById("cancelLogin").onclick = function () {
      Game.setUserForm("defaultUserForm");};

    // register mode buttons: register, cancel
    document.getElementById("register").onclick = function () {
      var username = document.getElementById("registerUserName").value;
      var password = document.getElementById("registerPassword").value;
      var retype = document.getElementById("registerRetype").value;
      if (password != retype) alert("The passwords you typed do not match.");
      else Game.createUser(username, password);
    };
    document.getElementById("cancelRegister").onclick = function () {
      Game.setUserForm("defaultUserForm");};

    // logged in mode buttons: log out, account options
    document.getElementById("logout").onclick = function () {
      Game.logout();};
    document.getElementById("showAccountOptions").onclick = function () {
      Game.setUserForm("optionsUserForm");};

    // account options mode buttons: change password, delete user, cancel
    document.getElementById("showChangePassword").onclick = function () {
      Game.setUserForm("passwordUserForm");};
    document.getElementById("showDeleteUser").onclick = function () {
      Game.setUserForm("deleteUserForm");};
    document.getElementById("cancelAccountOptions").onclick = function () {
      Game.setUserForm("loggedInUserForm");};

    // change password mode buttons: change password, cancel
    document.getElementById("changePassword").onclick = function () {
      var oldPassword = document.getElementById("passwordOld").value;
      var newPassword = document.getElementById("passwordNew").value;
      var retype = document.getElementById("passwordRetype").value;
      if (newPassword != retype) alert("The new passwords you typed do not match.");
      else Game.createUser(oldPassword, newPassword);
    };
    document.getElementById("cancelChangePassword").onclick = function () {
      Game.setUserForm("optionsUserForm");};

    // delete user mode buttons: delete user, cancel
    document.getElementById("deleteUser").onclick = function () {
      Game.deleteUser();};
    document.getElementById("cancelDeleteUser").onclick = function () {
      Game.setUserForm("optionsUserForm");};
  },

  animateCharacters: function() {
    for (var i = 0; i < Game.characters.length; i++) {
      Game.characters[i].animate();
    }
  },

  moveCharacters: function() {
    for (var i = 0; i < Game.characters.length; i++) {
      Game.characters[i].move();
    }
    var body = Game.frame.contentDocument.body;
    body.scrollLeft = Game.party[0].x - Game.width / 2;
    body.scrollTop = Game.party[0].y - Game.height / 2;
    Game.showHideMovementButtons(Game.party[0]);
  },

  choosePath: function(direction) {
    var pc = Game.party[0];
    if (!pc.path) {
      var path = Game.paths[pc.location][direction]
      if (path) {
        pc.path = path;
        pc.pathStep = 0;
      }
    }
  },

  createMovementButtons: function(character) {
    var up = Game.createElement("div", {id:"up"}, character.container);
    var down = Game.createElement("div", {id:"down"}, character.container);
    var left = Game.createElement("div", {id:"left"}, character.container);
    var right = Game.createElement("div", {id:"right"}, character.container);
    up.onmousedown = function() {Game.choosePath("north");};
    down.onmousedown = function() {Game.choosePath("south");};
    left.onmousedown = function() {Game.choosePath("west");};
    right.onmousedown = function() {Game.choosePath("east");};
  },

  showHideMovementButtons: function(character) {
    var up = Game.frame.contentDocument.getElementById("up");
    var down = Game.frame.contentDocument.getElementById("down");
    var left = Game.frame.contentDocument.getElementById("left");
    var right = Game.frame.contentDocument.getElementById("right");
    if (character.path) {
      up.style.visibility = "hidden";
      down.style.visibility = "hidden";
      left.style.visibility = "hidden";
      right.style.visibility = "hidden";
    }
    else {
      var paths = Game.paths[character.location];
      up.style.visibility = paths["north"] ? "visible" : "hidden";
      down.style.visibility = paths["south"] ? "visible" : "hidden";
      left.style.visibility = paths["west"] ? "visible" : "hidden";
      right.style.visibility = paths["east"] ? "visible" : "hidden";
    }
  },

  keyDown: function(e) {
    if (!e) e = window.event;
    var keyMap = {37: "west", 38: "north", 39: "east", 40: "south"};
    var direction = keyMap[e.keyCode];
    if (direction) {
      Game.choosePath(direction);
      e.preventDefault();
    }
  },
};

// Attach a function to the window's "load" event, so that it will be called
// when the page is done loading. This is similar to onload = function() {...};
// except that addEventListener allows us to attach as many handlers as we want
// to the same event.

addEventListener('load', function() {

  // variables that point to elements of the user interface
  Game.userForm = document.getElementById("userForm");
  Game.menu = Game.createElement("div", {className: "menu"}, Game.frame);
  Game.frame = document.getElementById("game");
  var style = getComputedStyle(Game.frame, null);
  Game.width = parseInt(style.width);
  Game.height = parseInt(style.height);

  // initialize account management menu
  Game.initializeUserForm();

  // load the first campaign in the campaign list
  Game.ajaxRequest("campaigns.xml", {}, function (ajax) {
    var campaigns = ajax.responseXML.getElementsByTagName("campaign");
    var campaign = campaigns[0];
    document.title = campaign.getAttribute("name");
    Game.loadCampaign(campaign.getAttribute("src"));
  });

  // listen for keyboard events in the main window and game frame
  addEventListener("keydown", Game.keyDown, false);
  Game.frame.contentWindow.addEventListener("keydown", Game.keyDown, false);

  // pause the game when the window loses focus
  addEventListener("blur", Game.pause, false);
  addEventListener("focus", Game.resume, false);
  Game.frame.contentWindow.addEventListener("blur", Game.pause, false);
  Game.frame.contentWindow.addEventListener("focus", Game.resume, false);

  // add a stylesheet to the frame:
  var head = Game.frame.contentDocument.getElementsByTagName("head")[0];
  Game.createElement("link", {rel:"stylesheet", type:"text/css", href:"style.css"}, head);

}, true);

  

