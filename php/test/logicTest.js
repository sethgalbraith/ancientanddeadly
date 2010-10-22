// When the window is done loading...
addEventHandler("load", function () {

  // function to convert arguments into a URL string.
  var argumentObjectToUrlString = function (arguments) {
    var argumentPairs = [];
    for (argumentName in arguments) {
      var pairName = encodeURIComponent(argumentName);
      var pairValue = encodeURIComponent(arguments[argumentName]);
      argumentPairs.push(pairName + "=" + pairValue);
    }
    return argumentPairs.join("&");
  };

  // function to send an HTTP request and wait for a result.
  var synchronousHttpRequest = function (address, arguments, xml) {
    var url = address 
    if (arguments) {
      url += "?" + argumentObjectToUrlString(arguments);
    }
    var ajax = new XmlHttpRequest();
    ajax.open("GET", url, false);
    if (xml) {
      ajax.setRequestHeader("Content-Type", "text/xml");
      ajax.setRequestHeader("Content-Length", xml.length);
      ajax.send(xml);
    }
    else {
      ajax.send();
    }
    return ajax;
  };

  // When the start button is clicked...
  document.getElementById("start").addEventHandler("click", function () {

    // Get the location, database, username and password entered by the user.
    var location = document.getElementById("location").value;
    var database = document.getElementById("database").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Check whether Ancient & Deadly is already installed.
    var ajax = synchronousHttpRequest("../db_config.php");
    
  }, false);

}, false);
