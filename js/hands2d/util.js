/*
This file contains a collection of useful functions
which might be useful for many different classes
but are too simple to warrant their own class:

Copyright (C) 2008  Seth Galbraith.
See copying.txt for full copyright notice

  getStyle()
  getKeyCode()
  indexIfLocal()
  preloadImages()
  toggleVisible()
*/

/**
 * Get a CSS property of the given element.
 * This is the computed style, including values inherited from stylesheets
 * blocks of style in the HTML, and the element's style attribute. 
 * @param the_element an element or a string equal to an element's id
 * @param the_property the name of a CSS property
 * @return the value of the property for that element
 */
function getStyle(the_element, the_property) {
  if (typeof(the_element) == "string") the_element = document.getElementById(the_element)
  // Try IE and standard methods of getting an element's style
  if (the_element.currentStyle) return the_element.currentStyle[the_property]
  else return window.getComputedStyle(the_element, null).getPropertyValue(the_property)
}

/**
 * returns the unicode value of a the key pressed or released
 * @param the_event a keyboard event like the paramaeter to an onkeydown event.
 * @return a unicode representation of the key pressed.
 */ 
function getKeyCode(the_event) {
	// firefox uses the_event.charCode, but
	// internet explorer uses the_event.keyCode
	return the_event.keyCode ? the_event.keyCode : the_event.charCode
	// we could also write that code this way:
	//   if (the_event.keyCode) return the_event.keyCode
	//   else return the_event.charCode
	// or this way: return the_event.keyCode || the_event.charCode
}

/**
 * Gives a suffix that can be appended to links to directories so they will
 * work more like web pages viewed online.
 * @return "/index.html" if the page is viewed with the file:// protocol.
 */
function indexIfLocal() {
  if (window.location.href.substr(0,4) == "file") return "/index.html"
  else return ""
}

/**
 * Stores images preloaded by the preloadImage function.
 * This variable should only be used by that function.
 */
var preloaded_images = new Array()

/**
 * Starts loading images you may want to use later.
 * To preload a single image, put the image's file name in an array by itself.
 * For example: preloadImages(["../graphics/victoria.jpg"])
 * @param the_image_array an array of one or more image file names.
 */
function preloadImages(the_file_names) {
  var j = preloaded_images.length
  for (var i = 0; i < the_file_names.length; i++, j++) {
    preloaded_images[j] = new Image()
    preloaded_images[j].src = the_file_names[i]
  }
}

/**
 * Makes a hidden element visible or a visible element hidden.
 * @param the_id id attribute of the element
 */
function toggleVisible(the_id) {
  element = document.getElementById(the_id);
  if (getStyle(element, "visibility") == "hidden")
    element.style.visibility = "visible"
  else element.style.visibility = "hidden"
}

/**
 * Roll a 20-sided die
 * @return random integer from 1 to 20
 */
function d20() {
  return Math.floor(Math.random() * 20 + 1);
}

/**
 * Determine whether two bounding boxes overlap.
 * @param a a bounding box with properties a.l, a.r, a.t, a.b
 * @param b a bounding box with properties b.l, b.r, b.t, b.b
 * @return true if the boxes overlap, otherwise false
 */
function boxesOverlap(a, b) {
  return (a.l <= b.r) && (a.r >= b.l) && (a.t <= b.b) && (a.b >= b.t)
}


