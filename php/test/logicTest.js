// When the window is done loading...
addEventListener("load", function () {

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

  var output = document.getElementById("output");
  var arguments = document.location.search.slice(1).split("&");
  var argumentMap = {};
  for (i = 0; i < arguments.length; i++) {
    var parts = arguments[i].split("=");
    var argumentName = parts[0];
    var argumentValue = parts[1];
    argumentMap[argumentName] = argumentValue;
  }
  output.appendChild(document.createTextNode(argumentMap.location));
  output.appendChild(document.createTextNode(argumentMap.database));
  output.appendChild(document.createTextNode(argumentMap.username));
  output.appendChild(document.createTextNode(argumentMap.password));

}, false);
