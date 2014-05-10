Game of Life [GOL]
---
John Conway's famous 1970 cellular automation. Create some shapes, watch them evolve.

**[DEMO](http://jdwije.github.io/gol)**


This is a reproduction of Conway's famous Game of Life simulation. It currently supports HTML and HTML5 Canvas canvas output - maybe I will add desktop support through GNUGuile or NodeJS at a later date.

For more information on the original experiment see here http://en.wikipedia.org/wiki/Conway's_Game_of_Life.

## Setup In-Browser
For clarities sake I will talk you through how I setup the demo page for this script available [here](https://github.com/jdwije/game-of-life.js/blob/master/index.html).

First include the ```dist/game-of-life-min.js``` in your webpages' body.

```
	<script type="text/javascript" src="../dist/game-of-life.js"></script>
```

Initialisation is easy however this script supports two output types in browser and we need to choose one. For this example we will setup both vanilla HTML and HTML5 canvas output. In your webpage below where you linked the above script insert something like this.

```
<script type="text/javascript">
		var HTML, HTML5;
		// wrap init in window load funtion
		$(window).load(function () {
			// setup simulator for canvas output.
			simHTML5 = new GolController({
				'canvas' : 'canvas',
				'width' : 100,
				'height' : 100,
				'seed_density' : 20
			}),
			// setup simulator for HTML output. note the 'display' : 'HTML' property.
		    simHTML =  new GolController({
				'canvas' : 'pre',
				'selector' : 'pre',
		        'display' : 'HTML',
				'width' : 70,
				'height' : 70,
				'seed_density' : 30
			});
		});
	</script>
```
For a full list of the available settings see ```src/objects/gol-controller.js``` and look at the ```configDefaults``` variable.


You will need to link the controller we just intialised to a user interface using the functions it provides.

You can begin your simulation by calling

```
	simHTML.run();
```

and stop it with

```
	simHTML5.stop()
```

The script doesn't make you use any particular frameworks to build up your UI with. It will work with jQuery, Dojo, etc. The example uses the jQuery ```click()``` event functions to bind some buttons to the controllers' API.

## API
#### start
*begins the simulation.*
Usage:

```
	mySim.start();
```

#### suspend
*suspends a running simulation, does not destroy data and allows for resuming.*
Usage:

```
	mySim.suspend();
```

#### rebuild
*resets the simulation and feeds it a new seed matrix.*
Usage:

```
	mySim.rebuild();
```
## Building & Contributing
If you would like to build this project you will need to have the following installed:

1. [NodeJS](http://nodejs.org/)
2. [NPM](https://www.npmjs.org/)

Follow the links to get started. NPM comes installed with NodeJS these days but check it out anyway in case you're unfamilier. Once you're ready, open up a terminal in your project folder:

```
# clone repo

# make direcotry for local project and clone remote repo
mkdir gol
cd gol
git clone git@github.com:jdwije/game-of-life.js.git .

# install node dependencies via NPM
npm install

# build with grunt
grunt --force

```

After you can make a build you can edit the source code files in the ```src/``` directory. The ```src/objects``` directory contains all the core JS objects you will be wanting to edit and prototype.

The ```tests``` directory contains some modularised in browser tests of the various objects that might be useful.

## Known Issues
The original GOL simulation was run in a pottentially infinite canvas space. This is not practical in a graphical browser environment as there are hard limits on resources, as such the engine in this software enforces a height/width limit for it's calculations.

The HTML5 canvas display adapter suffers from some performance issues.

There seems to be a lot of idle time in the program. I might split this up in future versions by refactoring in more asynchronous methods or threaded processes when available.

The build is a bit crappy. Currently needs the ```--force``` flag to complete, I'll fix this when I get around to some unit tests.

----

## Change Log
A history of changes from version to version.

#### 0.1.1
FIXED: readme file

ADDED: better documentation of build and other things

#### 0.1.0
REMOVED: jQuery dependencies dropped in favour of vanilla JS.

EDITED: Refactored code to be more modular.

ADDED: Grunt build system.

EDITIED: Directory/source code structure to support the project better and make things clearer.


#### 0.0.1
ADDED: beta source code and supporting files to repositiory.

---

## License
MIT licensed. See LICENSE.md file distributed with this source code.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jdwije/gol/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

