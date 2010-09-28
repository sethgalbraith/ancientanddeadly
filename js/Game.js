var Game = {

  // GAME STATE

  battleMaps: [],
  navigationMaps: [],
  currentNavigationMap: null,
  currentBattleMap: null,
  characters: [],
  turn: 0,
  selectedAction: null,
  selectedTargets: [],
  playerCharacters: [],
  currentSlide: [],

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
    var argumentlist = [];
    for (var argumentName in arguments) {
      var argumentValue = encodeURIComponent(arguments[argumentName]);
      argumentList.push(argumentName + "=" + argumentValue);
    }
    var argumentString = argumentList.join("&");
    // create and send ajax request
    var ajax = new XmlHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4) callback(ajax);
    };
    ajax.open("POST", url, TRUE);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.setRequestHeader("Content-length", argumentString.length);
    ajax.setRequestHeader("Connection", "close");
    ajax.send(argumentString);
  },

  dieRoll: function() {
    return Math.floor(20 * Math.random());
  },

  loadCampaign: function() {
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
    Game.loggedInMode();
  },
  
  logout: function() {
    Game.defaultMode();
  },

  changePassword: function(oldPassword, newPassword) {
  },
  
  deleteUser: function() {
  },

  clearLoginForm: function () {
    while (Game.loginForm.firstChild) {
      Game.loginForm.removeChild(Game.loginForm.firstChild);
    }
  },

  defaultMode: function () {
    Game.clearLoginForm();
    var login = Game.createElement("input", {type: "submit", value: "log in"}, Game.loginForm);
    login.onclick = function () {Game.loginMode();};
    var register = Game.createElement("input", {type: "submit", value: "register"}, Game.loginForm);
    register.onclick = function () {Game.registerMode();};
  },

  loginMode: function () {
    Game.clearLoginForm();
    var username = Game.createElement("input", {type: "text", placeholder: "username"}, Game.loginForm);
    var password = Game.createElement("input", {type: "password", placeholder: "password"}, Game.loginForm);
    var login = Game.createElement("input", {type: "submit", value: "log in"}, Game.loginForm);
    login.onclick = function () {Game.login(username.value, password.value);};
    var cancel = Game.createElement("input", {type: "submit", value: "cancel"}, Game.loginForm);
    cancel.onclick = function () {Game.defaultMode();};
  },

  registerMode: function () {
    Game.clearLoginForm();
    var username = Game.createElement("input", {type: "text", placeholder: "new username"}, Game.loginForm);
    var password = Game.createElement("input", {type: "password", placeholder: "new password"}, Game.loginForm);
    var retype = Game.createElement("input", {type: "password", placeholder: "type new password again"}, Game.loginForm);
    var register = Game.createElement("input", {type: "submit", value: "register"}, Game.loginForm);
    register.onclick = function () {
      if (password.value != retype.value) {
        alert("The passwords you typed do not match.");
      }
      else {
        Game.createUser(username.value, password.value);
      }
    };
    var cancel = Game.createElement("input", {type: "submit", value: "cancel"}, Game.loginForm);
    cancel.onclick = function () {Game.defaultMode();};
  },

  loggedInMode: function () {
    Game.clearLoginForm();
    var logout = Game.createElement("input", {type: "submit", value: "log out"}, Game.loginForm);
    logout.onclick = function () {Game.logout();};
    var options = Game.createElement("input", {type: "submit", value: "account options"}, Game.loginForm);
    options.onclick = function () {Game.optionsMode();};
  },

  optionsMode: function () {
    Game.clearLoginForm();
    var password = Game.createElement("input", {type: "submit", value: "change password"}, Game.loginForm);
    password.onclick = function () {Game.passwordMode();};
    var erase = Game.createElement("input", {type: "submit", value: "delete my account"}, Game.loginForm);
    erase.onclick = function () {Game.deleteMode();};
    var cancel = Game.createElement("input", {type: "submit", value: "cancel"}, Game.loginForm);
    cancel.onclick = function () {Game.loggedInMode();};
  },

  passwordMode: function () {
    Game.clearLoginForm();
    var old = Game.createElement("input", {type: "password", placeholder: "old password"}, Game.loginForm);
    var password = Game.createElement("input", {type: "password", placeholder: "new password"}, Game.loginForm);
    var retype = Game.createElement("input", {type: "password", placeholder: "type new password again"}, Game.loginForm);
    var change = Game.createElement("input", {type: "submit", value: "change password"}, Game.loginForm);
    change.onclick = function () {
      if (password.value != retype.value) {
        alert("The passwords you typed do not match.");
      }
      else {
        Game.createUser(old.value, password.value);
      }
    };
    var cancel = Game.createElement("input", {type: "submit", value: "cancel"}, Game.loginForm);
    cancel.onclick = function () {Game.optionsMode();};
  },

  deleteMode: function () {
    Game.clearLoginForm();
    Game.loginForm.appendChild(document.createTextNode(
      "Are you sure you want to delete your account? "
    + "This operation cannot be undone. All your saved games will be lost."));
    var erase = Game.createElement("input", {type: "submit", value: "delete my account"}, Game.loginForm);
    erase.onclick = function () {Game.deleteUser();};
    var cancel = Game.createElement("input", {type: "submit", value: "cancel"}, Game.loginForm);
    cancel.onclick = function () {Game.optionsMode();};
  }

};


// RUN SOME CODE AFTER THE PAGE LOADS:

addEventListener('load', function() {

  // USER INTERFACE

  Game.container = document.getElementById("game");
  Game.loginForm = document.getElementById("login");
  Game.menu = Game.createElement("div", {className: "menu"}, Game.container);
  Game.defaultMode();

}, true);

  


