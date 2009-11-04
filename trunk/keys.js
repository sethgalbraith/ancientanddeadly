// KEY_CODES gives a key code for a given key name
// i.e. KEY_CODES["spacebar"] == 32
KEY_CODES = {
  // control keys
  "backspace": 8, "tab": 9, "enter": 13, "shift": 16, "ctrl": 17, "alt": 18,
  "pause": 19, "caps lock": 20, "escape": 27, "spacebar": 32, "page up": 33,
  "page down": 34, "end": 35, "home": 36, "left": 37, "up": 38, "right": 39,
  "down": 40, "print screen": 44, "insert": 45, "delete": 46, 
  // top row numbers
  "0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55,
  "8": 56, "9": 57,
  // letters A - Z
  "A": 65, "B": 66, "C": 67, "D": 68, "E": 69, "F": 70, "G": 71, "H": 72,
  "I": 73, "J": 74, "K": 75, "L": 76, "M": 77, "N": 78, "O": 79, "P": 80,
  "Q": 81, "R": 82, "S": 83, "T": 84, "U": 85, "V": 86, "W": 87, "X": 88,
  "Y": 89, "Z": 90,
  // winKeys and application key
  // "left system": 91, "right system": 92, "menu": 93,
  // 10-key number pad
  "pad 0": 96, "pad 1": 97, "pad 2": 98, "pad 3": 99, "pad 4": 100,
  "pad 5": 101, "pad 6": 102, "pad 7": 103, "pad 8": 104, "pad 9": 105,
  "pad *": 106, "pad +": 107, "pad -": 109, "pad .": 110, "pad /": 111,
  // function keys
  "f1": 112, "f2": 113, "f3": 114, "f4": 115, "f5": 116, "f6": 117, "f7": 118, 
  "f8": 119, "f9": 120, "f10": 121, "f11": 122, "f12": 123,
  // other keys
  "num lock": 144, "scroll lock": 145,
  //"my computer": 182, "my calculator": 183,
  ";": 186, "=": 187, ",": 188, "-": 189, ".": 190, "/": 191, "`": 192,
  "[": 219, "\\": 220, "]": 221, "'": 222}

// KEY_NAMES gives a key name for a given key code
// i.e. KEY_NAMES[32] == "spacebar"
KEY_NAMES = {}
// generate automatically from KEY_CODES
for (keyName in KEY_CODES) {
  keyCode = KEY_CODES[keyName]
  KEY_NAMES[keyCode] = keyName
}

