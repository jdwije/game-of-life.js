Game of Life [GOL]
---
John Conway's famous 1970 cellular automation. Create some shapes, watch them evolve.

## summary
see: http://en.wikipedia.org/wiki/Conway's_Game_of_Life

**demo:** http://jdwije.github.io/gol


## setup 
This script requires jQuery v1.10+, and browser support for HTML5 canvas to work.

Initialisation is easy. Your HTML markup will require a canvas element to output to so be sure to include one somewhere in your UI.The simulation is initialised with the following bit of code.

    var mySim = new GOL( settings... );

You can begin your simulation by calling

	mySim.run();

and stop it with

	mySim.stop()

## api
**start:** begins the simulation. usage

	mySim.start();

**stop:** stops running the simulation, does not destroy data and allows for resuming. usage

	mySim.stop();

**rebuild:** resets the simulation and feeds it a new seed matrix. usage

	mySim.rebuild();

**dumpData:** returns a CSV structure of the current simulation state. usage

	mySim.dumpData();
	
# known issues
The original GOL simulation was in an infinite canvas space. This simply is not practical in a graphical browser environment, as such this reporduction limits the available 2d space that the simulation can operate in. Don't worry, you still get to see all the pretty shapes :)




