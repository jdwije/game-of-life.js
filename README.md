A JavaScript implementation of John Conway's *Game of Life* Simulation
---

## summary
see: http://en.wikipedia.org/wiki/Conway's_Game_of_Life
demo: http://jwije.com/gol/index.html

This is a HTML5/Cavas reproduction of Conway's famous Game of Life experiment. The logic is all handled in JS whilst the results
are outputed to a HTML5 cavas element for viewing.


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
	mySim.save();
	

# known issues
The original GOL simulation was implimented on an infinite canvas space. This simply is not practical in a graphical browser environment, as such this reporduction limits the available 2d space that the simulation can operate in so as to save CPU and memory usage. Don't worry, you still get to see all the pretty shapes :)




