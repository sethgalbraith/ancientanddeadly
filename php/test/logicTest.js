// When the window is done loading...
addEventListener("load", function () {


  // Function to convert arguments into a URL string.
  // The only parameter (arguments) is an object containing
  // variables that will be appended to a URL as arguments.
  // The return value is a string in the same form as
  // document.location.search, but without the question mark.
  // We will not need to call this directly.
  // It is used by the synchronousHTTPRequest function.
  var argumentObjectToUrlString = function (arguments) {
    // Join the names and values of each variable in arguments
    // with an equals sign.
    var argumentPairs = [];
    for (argumentName in arguments) {
      var pairName = encodeURIComponent(argumentName);
      var pairValue = encodeURIComponent(arguments[argumentName]);
      argumentPairs.push(pairName + "=" + pairValue);
    }
    // Join the name=value pairs with ampersands.
    return argumentPairs.join("&");
  };

  // Function to send an HTTP request and wait for a result.
  // The 1st parameter (address) is the URL that will recieve the request.
  // The 2nd parameter (arguments), if present, is a javascript object.
  // Each variable in that object will be sent as arguments
  // to the recieving URL, like submitted form data.
  // The 3rd parameter (xml), if present, is a string to send 
  // in the request body, usually XML data.
  var synchronousHttpRequest = function (address, arguments, xml) {
    // Build the URL from the address, optionally adding arguments.
    var url = address 
    if (arguments) {
      url += "?" + argumentObjectToUrlString(arguments);
    }
    // Start an HTTP request using the GET method.
    // The last argument to XMLHttpRequest.open is false, so the request
    // will be sent synchronously, meaning the browser will freeze the page
    // while waiting for the HTTP request to finish.
    // Freezing the page is a bad idea for a live web application, 
    // but convenient for running one test at a time.  
    var ajax = new XMLHttpRequest();
    ajax.open("GET", url, false);
    if (xml) {
      // If we have XML data, set the appropriate headers before sending.
      ajax.setRequestHeader("Content-Type", "text/xml");
      ajax.setRequestHeader("Content-Length", xml.length);
      ajax.send(xml);
    }
    else {
      // If we do not have XML data, send the request with an empty body.
      ajax.send();
    }
    // Return the request object when the request is finished.
    return ajax;
  };

  // The HTML element which will recieve test output.
  var output = document.getElementById("output");

  // Function to print messages by appending elements to the output element.
  // The 1st parameter (text) is the message that will be printed.
  // The 2nd parameter (className), if present, is a CSS class
  // which will be applied to the printed message.
  // Usually we will call the pass or fail functions below instead of calling
  // this function directly.
  var echo = function (text, className) {
    // Create a new message element.
    var element = document.createElement("div");
    // In javascript, the "class" attribute of an element is called "className"
    // because the language designers decided to reserve the "class" keyword
    // for future use.
    if (className) {
      element.className = className;
    }
    // Fill the message element with the message text.
    element.innerText = text;
    // Attach the message element to the page's output element.
    output.appendChild(element);
  };

  // Function to print PASS messages.
  var pass = function (text) {
    echo ("[PASS] " + text, "pass");
  };

  // Function to print FAIL messages.
  var fail = function (text) {
    echo ("[FAIL] " + text, "fail");
  };

  // Function which determines whether the returned page is blank.
  // The text of a blank page might be an empty string, or it might
  // contain whitespace characters like spaces, tabs and newlines.
  var returnedBlankPage = function (request) {
    // Get whatever text the server returned in response to our request.
    var text = request.responseText;
    // Trim the whitespace characters (spaces, tabs and newlines)
    // from the response text. We use the short, fast way to do this in
    // javascript by using a regular expression, but it is not pretty.
    // An alternative would be looping through every character
    // of the response text and checking whether it was whitespace.
    var trimmedText = request.replace(/^\s+|\s+$/g, "");
    // Return true if the trimmed text is an empty string.  
    if (trimmedText == "") {
      return true;
    }
    // Return false if the trimmed text is not an empty string.
    else {
      return false;
    }
  };

  // Function which determines whether the returned page is XML.
  var returnedXML = function (request) {
    // The XMLHttpRequest variable responseXML will be an XML DOM object 
    // if the response text can be successfully parsed as XML. 
    // The XMLHttpRequest variable responseXML will be null or undefined
    // if the response text is not well-formed XML.
    // Return true if the response text was successfully parsed as XML.
    if (request.responseXML) {
      return true;
    }
    // Return false if the response text was not successfully parsed as XML.
    else {
      return false;
    }
  };

  // Function which determines whether the retunred page is an error message.
  var returnedErrorMessage = function (request) {
     // Assume that the returned page is an error message
     // if it is not well-formed XML or a blank page.
     if (returnedXML(request)) {
       return false;
     }
     else if (returnedBlankPage(request)) {
       return false;
     }
     else {
       return true;
     }
  };

  // Convert the arguments to this page into a javascript object.
  var arguments = document.location.search.slice(1).split("&");
  var argumentMap = {};
  for (i = 0; i < arguments.length; i++) {
    var parts = arguments[i].split("=");
    var argumentName = parts[0];
    var argumentValue = parts[1];
    argumentMap[argumentName] = argumentValue;
  }

  // TESTS START HERE

  var request = synchronousHttpRequest("../install.php", argumentMap);

}, false);
