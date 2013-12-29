A JavaScript implementation of John Conway's *Game of Life* Simulation
---

# summary
see: http://en.wikipedia.org/wiki/Conway's_Game_of_Life
demo: http://jwije.com/gol/index.html

This is a HTML5/Cavas reproduction of Conway's famous Game of Life experiment. The logic is all handled in JS whilst the results
are outputed to a HTML5 cavas element for viewing.


# setup & usage
Initialisation is easy. Your HTML markup will require a canvas element to output to after which the simulation object is initialised with the following bit of code.


A succesfully initialised Game of Life (GOL) simulation presents the following API:

start:

stop:

rebuild:

save:

dumpData:

getStats:

# known issues
The original GOL simulation was implimented on an infinite canvas space. This simply is not practical in a graphical browser environment, as such this reporduction limits the available 2d space that the simulation can operate in so as to save CPU and memory usage. Don't worry, you still get to see all the pretty shapes :)




