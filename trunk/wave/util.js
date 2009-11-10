// Some functions in this library use regular expressions:
// the regular expression /abc/  means "an occurence of 'abc'"
// the regular expression /abc/g means "each occurence of 'abc'"
// the regular expression /\t/   means "a tab character"
// the regular expression /\t/g  means "each tab character"

// Convert a javascript object, array, function or other value
// into a form that can be saved in a string, such as a wave state.
// This is less strict than orthodox JSON, so it can encode values other 
// than arrays, objects, numbers and strings, including some functions.
function jsonEncode(value) {
  // if the value is not defined, return the string "undefined"
  if (typeof(value) == "undefined") {
    return "undefined"
  }
  // if the value is null, return the string "null"
  else if (value === null) {
    return "null"
  }
  // if the value is an Object (dictionary/map/associative array)
  // return a string containing an object literal. 
  // for example: {string_property:"some text",number_property:10}
  else if (value.constructor == Object) {
    // copy the object's properties to an array
    // as strings in "key:value" format
    var copy = []
    for (var key in value) {
      // convert the key and value to strings
      // by calling this function recursively
      copy.push(jsonEncode(key) + ":" + jsonEncode(value[key]))
    }
    // join the "key:value" strings with commas and add curly brackets
    return "{" + copy.join(",") + "}"
  }
  // if the value is an Array, return a string containing an array literal
  // for example: [1,2,3,"apple","orange",3.14]
  else if (value.constructor == Array) {
    // copy the array's contents into an array
    var copy = []
    for (var i = 0; i < value.length; i++) {
      // convert each item in the array to a string
      // by calling this function recursively
      copy.push(jsonEncode(value[i]))
    }
    // join the strings with commas and add the square brackets
    return "[" + copy.join(",") + "]"
  }
  // if the value is a String, convert special characters
  // into a special "escaped" form using regular expressions
  else if (value.constructor == String) {
    value = value.replace(/\\/g, "\\\\") // replace \ with \\ 
    value = value.replace(/\n/g, "\\n") // replace newline with \n
    value = value.replace(/\t/g, "\\t") // replace tab with \t
    value = value.replace(/\r/g, "\\r") // replace carriage return with \r
    value = value.replace(/"/g, "\\\"") // replace " with \"
    return '"' + value + '"' // return result between double quotes (")
  }
  // if the value is anything else, convert it to a string
  else {
    // adding any value to a string converts it to a string
    // representing that value, often in a way that can be
    // converted back into a string with the eval() function
    return "" + value
  }
}

// convert a JSON string to a javascript value by evaluating it
// this executes the string as javascript code, so it is not
// safe to use on strings from sources you don't trust.
function jsonDecode(json) {
  eval("value = " + json)
  return value
}

// convert HTML or XML code to a form that can be displayed in a web page
// by using regular expressions to replace special characters
function escapeXML(xml) {
  xml = xml.replace(/&/g, "&amp;")
  xml = xml.replace(/</g, "&lt;")
  xml = xml.replace(/>/g, "&gt;")
  xml = xml.replace(/"/g, "&quot;")
  xml = xml.replace(/'/g, "&apos;")
  return xml
}

// convert escaped HTML or XML code that can be displayed in a web page
// back to raw HTML or XML code using regular expressions
function unescapeXML(xml) {
  xml = xml.replace(/&lt;/g, "<")
  xml = xml.replace(/&gt;/g, ">")
  xml = xml.replace(/&quot;/g, '"')
  xml = xml.replace(/&apos;/g, "'")
  xml = xml.replace(/&amp;/g, "&")
  return xml
}

// Get any type of value from a wave state, interpreted as a JSON string
function load(key, default_value) {
  var state = wave.getState()
  if (state) {
    var value = state.get(key)
    // load can be called with one or two parameters
    // load("key") will return the value of the state called key
    // load("key", "default value") returns "default value"
    // if the state does not exist
    if (value === null && typeof(default_value) != "undefined")
      return default_value
    else
      return jsonDecode(value)
  }
}

// Save a value encoded as a JSON string in a wave state.
function save(key, value) {
  var state = wave.getState()
  if (state) state.submitValue(key, jsonEncode(value))
}

// Save all the properties of an object as separate wave states
// this allows you to change a bunch of states as a single operation
// so the changes don't get jumbled up with other state changes.
// This is not guaranteed to work, especially if two viewers try
// to change the same state at the same time.
function saveAll(values) {
  var state = wave.getState()
  if (state) {
    // copy the properties of the values object to a new object
    var delta = {}
    for (key in values) {
      // convert each property to a JSON string
      delta[key] = jsonEncode(values[key])
    }
    state.submitDelta(delta)
  }
}

