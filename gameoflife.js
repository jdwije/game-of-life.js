/**
*
*	This simulation runs John Conway *Game of Life* simulation.
*	It uses HTML5 Cavas for simulation output. Some info on this:
*		- max dimension, 8192px
*
*	DEPENDENCIES: jQuery, HTML5.
* 
****/

var GOL = function ( config ) {
	// set ECMA Strict mode
	"use strict";
	// declare vars
	var 
	// restricted and available APIs
	r = {}, 
	a = {},
	// object for storing config details
	cnf = {
		'canvas' : "canvas",
		'width' : 2000,
		'height' : 2000,
		'master_timer' : 150,
		'fill_alive' : "#C2FF85",
		'fill_dead' : "#FFFFFF",
		'seed_density' : 50
	},
	// canvas javascript handles
	canvas,
	ctx,
	// the simulation data matrix
	matrix,
	// the master Set Timeout and related control variables
	sim_timeout,
	active = false,
	live_on = 0,
	dies_out = 0,
	resed = 0;


	/**********************
	** AVAILABLE METHODS **
	***********************/
	
	// runs the simulations.
	a.run  = function () {
		if ( active === false ) {
			active = true;
			r.simLoop();
		}
	};

	// pauses execution of the simulation. does not clear any data.
	a.pause = function () {
		// set state to false and clear simulation timeout
		if ( active === true ) {
			active = false;
			clearTimeout( sim_timeout );
		}
	};

	a.stepForward = function () {
		a.pause();
		r.simLoop();
	};

	// resets the simulation and rebuilds the seed matrix.
	a.rebuild = function () {
		matrix = r.setupSimulation();
		r.drawCanvas();
	};

	// returns the matrix as a CSV string.
	a.dumpData = function () {
		var y_max = matrix.length,
			x_max,
			y_it, 
			x_it,
			csv_str = "";

		// iterate y axis
		for (y_it = 0; y_it < y_max; y_it++) {
			// set x max
			x_max = matrix[y_it].length;
			// iterate x axis
			for (x_it = 0; x_it < x_max; x_it++) {
				// add value to matrix
				csv_str += matrix[y_it][x_it];

				// if not last in the set add a comma after this value to conform with CSV spec
				if ( x_it !== x_max ) {
					csv_str += ",";
				}
			}
			// append newline to the string for this row
			csv_str += "\n";
		}

		return csv_str;
	};

	a.getStats = function () {
		return { 
			'resurrected' : resed,
			'survivors' : live_on, 
			'fatalities' : dies_out 
		};
	};

	/***********************
	** RESTRICTED METHODS **
	************************/

	// objects initialisor fn. overwrites default config options if provide and sets up
	// the object.
	r.init = function () {
		// loop config properties
		var prop;

		for ( prop in config ) {
			if ( config.hasOwnProperty( prop ) ) {
				// overrite config defaults
				cnf[ prop ] = config[ prop ];
			}
		}

		// do setup
		r.setupCanvas();

		// generate and set seed matrix
		matrix = r.setupSimulation();
	};

	// sets up the html canvas element and performs all required JS loading of it.
	r.setupCanvas = function () {
		canvas = $( '#' + cnf.canvas ).get(0);
	    canvas.width = cnf.width;
	    canvas.height = cnf.height;
	    ctx = canvas.getContext( "2d" );
	};

	r.setupSimulation = function () {
		var y_max = cnf.height,
			x_max = cnf.width,
			seed_matrix = [],
			x_row,
			i, ii;

		// iterate y axis
		for ( i = 0; i < y_max; i++) {
			x_row = [];

			if ( (i > y_max / 2 - cnf.seed_density) && (i < y_max / 2 + cnf.seed_density) ) {
				// create some null matrix values
				for ( ii = 0; ii < x_max; ii++) {
					if ( (ii > x_max / 2 - cnf.seed_density) && (ii < x_max / 2 + cnf.seed_density) ) {
						x_row.push( Math.round( Math.random() ) );		
					}
					else {
						x_row.push( 0 );			
					}
				}
			}
			else {
				// create some null matrix values
				for ( ii = 0; ii < x_max; ii++) {
					x_row.push( 0 );		
				}
			}

			// push row onto seed matrix
			seed_matrix.push( x_row );
		}


		return seed_matrix;
	};

	// draws data matrix to the canvas
	// @matrix (ARRAY): The matrix of pixel data represented as a multi-dimensional array structure
	r.drawCanvas = function () {
		var y_max = matrix.length,
		y_it,
		x_it,
		square;

		// loop y
		for ( y_it = 0; y_it < y_max; y_it++ ) {

			// loop x;
			for ( x_it = 0; x_it < matrix[ y_it ].length; x_it++ ) {
				square = matrix[y_it][x_it];

				// filter square state and set colour
				if ( square > 0 ) {
					// alive
					ctx.fillStyle = cnf.fill_alive;
				}
				else {
					// dead
					ctx.fillStyle = cnf.fill_dead;
				}

				ctx.fillRect( x_it, y_it, 1, 1 );

			}	

		}
	};

	// fn handles applying rules to matrix data
	// @matrix (ARRAY): The matrix of pixel data represented as a multi-dimensional array structure
	r.simLoop = function () {
		var y_max = matrix.length,
			x_max,
			y_it,
			x_it,
			werk_matrix = [],
			x_row;

		dies_out = 0;
		live_on = 0;
		resed = 0;

		// loop y
		for ( y_it = 0; y_it < y_max; y_it++ ) {
			// reset row array and current x matrix length
			x_row = [];
			x_max = matrix[ y_it ].length;

			// loop x and check rules for each square
			for ( x_it = 0; x_it < x_max; x_it++ ) {
				x_row.push( r.checkRulez( x_it, y_it ) );
			}

			// push row onto working matrix
			werk_matrix.push( x_row );
		}

		// reset matrix
		matrix = werk_matrix;

		// clear working matrix from memory
		werk_matrix = null;

		// do canvas draw
		r.drawCanvas();

		// only set timeout of simulator is active
		if ( active === true ) {
			sim_timeout = setTimeout( r.simLoop, cnf.master_timer );
		}
	};

	// checks against rules of life
	// @x (INT): The squares x position in the matrix
	// @y (INT): The squares y position in the matrix
	// @matrix (ARRAY): The matrix of pixel data represented as a multi-dimensional array structure
	r.checkRulez = function ( x, y ) {
		// 3x3 grid of surrounding matrix data. square in question is located dead center ie 9x9[1][1]
		var grid = r.extractGrid( x, y ),
			target = grid[1][1],
			grid_total = grid.sum() - target,
			response = 0;


			// check based on wether target is alive or dead
			if ( target > 0 ) {

				// switch grid total to determine outcome
				switch ( grid_total ) {
					case 2:
						// alive
						response = 1;
						live_on += 1;
						break;
					case 3:
						// alive
						response = 1;
						live_on += 1;
						break;
					default:
						// dead
						response = 0;
						dies_out += 1;
				}

			}
			else {
				if ( grid_total === 3 ) {
					response = 1;
					resed += 1;
				}
			}

			return response;
	};

	// gets a 3x3 grid surrounding the given square.
	// @x (INT): The squares x position in the matrix
	// @y (INT): The squares y position in the matrix
	// @matrix (ARRAY): The matrix of pixel data represented as a multi-dimensional array structure
	r.extractGrid = function ( x, y ) {
		var response = [],
			y_max = matrix.length,
			x_row,
			y_it,
			x_it;

		// start at y - 1 and end at y + 1
		for ( y_it = y - 1 ; y_it <= y + 1; y_it++ ) {
			// make sure we are operting on an actual row
			if ( (y - 1 < 0) || (y + 1 >= y_max) ) {
				// negative y value, push emtpy matrix
				response.push( [0,0,0] );
			}
			else {
				// positive y value, all good to iterate x
				x_row = [];

				// start at x - 1 and end at x + 1
				for (  x_it = x - 1; x_it <= x + 1; x_it++ ) {
					// make sure x is real
					if ( x - 1 < 0 ) {
						x_row.push( 0 );
					}
					else {
						// push x value onto x_row array
						x_row.push( matrix[y_it][x_it] );
					}
				}

				// push x row matrix onto response
				response.push( x_row );

				// performance boose??
				x_row = null;
			}
		}

		// return the result
		return response;
	};

	// call it fn for this object.
	r.init();

	// return public API
	return a;
};


// sum fn extension to the Array object can recursive sum up array values
Array.prototype.sum = function ( iterator ) {
	"use strict";
	var i = ( typeof iterator === "undefined" ) ?  0 : iterator,
		total = 0;

	// check for nested array structure
	if ( this[ i ] instanceof Array ) {
		for ( i; i < this.length; i++) {
			// now sum rows by recursing into this fn
			total += this[i].sum();
		}
	}
	else {
	// not a nested structure
		for (i = 0; i < this.length; i++) {
			total += this[i];
		}
	}

	return total;
};

Array.prototype.serialize = function () {

};


