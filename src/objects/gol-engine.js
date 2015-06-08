/**
 * GOL-Engine
 * ----------
 * 
 * This is the engine behind GOL. It is intended to be used in a separate thread,
 * passing back information to a display controller.
 * 
 * @author: Jason Wijegooneratne
 * @date: May 2013
 * @url: jwije.com
 *
 **/

GolEngine = function ( config ) {
    "use strict";
    /* Scoped variables available to this object */
    var 
    a = {}, r = {},
    self = this,
    active = false,
    matrix,
    simulationTimeout,
    defaultConfig = {
	'width' : 300,
	'height' : 300,
	'master_timer' : 300,
	'seed_density' : 50
    },
    live_on = 0,
    dies_out = 0,
    resed = 0;
    

    // returns the matrix as a CSV string.
    a.dumpDataString = function ( delimeter ) {
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
		    csv_str += delimeter;
		}
	    }
	    // append newline to the string for this row
	    csv_str += "\n";
	}

	return csv_str;
    };


    /**
     * Function returns true/false based on whether this engine is active or not.
     * @returns [BOOLEAN]: TRUE if active. FALSE if not.
     **/
    a.isActive = function () {
	return ( ( active === true ) ? true : false );
    };
    

    /**
     * Fn runs the engine.
     * @callback [FUNCTION]: a function which gets passed the matrix data.
     **/
    a.run = function ( callback ) {
	r.simLoopStart( callback );
    };

    /**
     * FN suspends the engine but does not clear any data.
     */
    a.suspend = function () {
	r.simLoopSuspend();
    };


    /**
     * function rebuilds the data matrix clearing the exisitng one
     */
    a.rebuild = function () {
	r.setupSimulation();
    };

    /**************************
     ** RESTRICTED FUNCTIONS **
     **************************/
    
    /**
     * sets the engine as active .
     */
    r.setObjectActive = function ( ) {
	active = true;
    };
    
    /** 
     * sets the engine inactive 
     */
    r.setObjectInactive = function () {
	active = false;
    };

    /**
     * kicks off the simulations loop. is passed a callback to which to pass the data too.
     * @callback [FUNCTION]: a function which is passed a copy of the matrix data.
     */
    r.simLoopStart = function ( callback ) {
	r.setObjectActive();
	console.log(matrix);
	simulationTimeout = setInterval( function () {
	    r.simStepForward();
	    callback( matrix );
	}, config.master_timer );
    };

    /**
     * suspends the simulation loop but does not reset the matrix or clear any data besides the
     * timers.
     */
    r.simLoopSuspend = function () {
	clearInterval( simulationTimeout );
	r.setObjectInactive();
    };

    /**
     *  fn handles applying rules to matrix data
     */
    r.simStepForward = function () {
	var 
	y_max = matrix.length,
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

	return matrix;
    };

    /**
     * checks against rules of life
     * @x (INT): The squares x position in the matrix
     * @y (INT): The squares y position in the matrix
     */
    r.checkRulez = function ( x, y ) {
	// 3x3 grid of surrounding matrix data. square in question is located dead center ie 9x9[1][1]
	var grid = self.extractGrid( x, y, matrix ),
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


/**
* setup the simulation matrix with some base seed data. calling this function on an active engine resets it's data.
*/
    r.setupSimulation = function () {
	var 
	y_max = config.height,
	x_max = config.width,
	seed_matrix = [],
	x_row,
	i, ii;

	// iterate y axis
	for ( i = 0; i < y_max; i++) {
	    x_row = [];

	    if ( (i > y_max / 2 - config.seed_density) && (i < y_max / 2 + config.seed_density) ) {
		// create some null matrix values
		for ( ii = 0; ii < x_max; ii++) {
		    if ( (ii > x_max / 2 - config.seed_density) && (ii < x_max / 2 + config.seed_density) ) {
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

	matrix = seed_matrix;

	return seed_matrix;
    };

    r.init = function () {
	config = self.setConfig( defaultConfig, config );
	r.setupSimulation();
    };

    r.init();

    return a;
};

// inherit base object methods
GolEngine.prototype = new GolBase();


