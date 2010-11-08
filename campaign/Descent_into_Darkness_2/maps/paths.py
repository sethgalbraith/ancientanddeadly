import sys

STROKE = {
  # Emetria
  "ff0000": ("circle", "ruin", "east", "west"),
  "ee0000": ("fortress", "market", "east", "west"),
  "dd0000": ("market", "ruin", "south", "east"),
  "cc0000": ("market", "castle", "east", "west"),
  "bb0000": ("castle", "house1", "south", "west"),
  "aa0000": ("castle", "fork", "north", "south"),
  "990000": ("fork", "house2", "east", "west"),
  "880000": ("fork", "snow", "west", "south"),
  "770000": ("fortress", "circle", "west", "west"),
  # Lair of Mal Keshar
  "00ff00": ("entrance", "throne", "south", "north"),
  "00ee00": ("entrance", "bridge", "west", "east"),
  "00dd00": ("bridge", "throne", "south", "west"),
  "00cc00": ("throne", "cliff", "east", "north"),
  "00bb00": ("cliff", "intersection", "west", "east"),
  "00aa00": ("intersection", "altar", "south", "east"),
  "009900": ("intersection", "lake", "west", "south"),
  "008800": ("intersection", "lava", "north", "south"),
  "007700": ("lake", "fork", "north", "south"),
  "006600": ("lava", "fork", "north", "east"),
  "005500": ("throne", "fork", "south", "north"),
  # Parthyn
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
POINTS = "       d=\"M "
PATH = "    <path\n"

def xmlPath(points, orig, dest, direction):
  print '    <path from="%s" to="%s" direction="%s">' % (orig, dest, direction)
  for p in points:
    print '      <p x="%s" y="%s" />' % tuple(p)
  print '    </path>'

for filename in ("Parthyn.svg", "Emetria.svg", "Lair_of_Mal_Keshar.svg"):
  print '  <map background="%s">' % (filename)
  points, color = None, None
  for line in open(filename):
    if line[:len(PATH)] == PATH:
      points, color = None, None
    if line[:len(STYLE)] == STYLE:
      color = line[len(STYLE):len(STYLE) + 6]
      origin, destination, direction1, direction2 = STROKE[color]
    if line[:len(POINTS)] == POINTS:
      coordinates = line[len(POINTS):-2]
      points = [point.split(",") for point in coordinates.split(" ")]
    if (points and color):
      xmlPath(points, origin, destination, direction1)
      xmlPath(reversed(points), destination, origin, direction2)
      points, color = None, None
  print '  </map>'



