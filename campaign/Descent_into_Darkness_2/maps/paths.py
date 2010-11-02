STROKE = {
  "ffffff": ("ruins", "windmill", "north", "south"),
  "eeeeee": ("tent", "ruins", "east", "west"),
  "dddddd": ("ruins", "shop", "south", "west"),
  "cccccc": ("shop", "start", "east", "south"),
  "bbbbbb": ("beacon", "start", "south", "north"),
  "aaaaaa": ("cellar", "fort", "north", "south"),
  "999999": ("camp", "well", "south", "east"),
  "888888": ("cemetery", "hills", "east", "west"),
  "777777": ("cabin", "mine", "west", "east"),
  "666666": ("cemetery", "cabin", "west", "east"),
  "555555": ("ford", "cemetery", "north", "south"),
  "444444": ("fort", "ford", "north", "south"),
  "333333": ("fort", "camp", "east", "west"),
  "222222": ("start", "fort", "east", "west"),
  "111111": ("start", "ruins", "west", "east")}
STYLE = "       style=\"fill:none;stroke:#"
PATH = "       d=\"M "
FILENAME = "Parthyn.svg"

def xmlPath(points, orig, dest, direction):
  print '    <path from="%s" to="%s" direction="%s">' % (orig, dest, direction)
  for p in points:
    print '      <p x="%s" y="%s" />' % tuple(p)
  print '    </path>'

for line in open(FILENAME):
  if line[:len(STYLE)] == STYLE:
    color = line[len(STYLE):len(STYLE) + 6]
    origin, destination, direction1, direction2 = STROKE[color]
  if line[:len(PATH)] == PATH:
    coordinates = line[len(PATH):-2]
    points = [point.split(",") for point in coordinates.split(" ")]
    xmlPath(points, origin, destination, direction1)
    xmlPath(reversed(points), destination, origin, direction2)



