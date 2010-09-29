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
  }

};

// Attach a function to the window's "load" event, so that it will be called
// when the page is done loading. This is similar to onload = function() {...};
// except that addEventListener allows us to attach as many handlers as we want
// to the same event.

addEventListener('load', function() {

  // variables that point to elements of the user interface

  Game.container = document.getElementById("game");
  Game.userForm = document.getElementById("userForm");
  Game.menu = Game.createElement("div", {className: "menu"}, Game.container);

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

}, true);

  


