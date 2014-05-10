/**
 * GOL Base
 * --------
 *
 * This object acts as the base of all others in this system. Shared methods
 * such as an API for handling web workers are all definened here.
 *
 * ----
 *
 * @author: Jason Wijegooneratne
 * @date: May 2013
 *
 **/

GolBase = function ( config ) {
    var a = {}, r = {},
    self = this,
    defaultConfig = {
	max_processes : 4,
	computation_method : 'asynchronous'
    },
    config = config || {};

   
    r.spawnAsyncProcess = function ( data, offset, fn, bubbleCallback ) {	
	fn( data, offset );
    };


    r.spawnWebWorker = function ( data, fn, bubbleCallback ) {

    };

    /**
     * Small abstraction method for spawning 'child' processes amongst obects
     ***/
    r.spawnParallelProcess = function ( data, offset, fn, bubbleCallback ) {
	if ( config.computation_method === 'asynchronous' ) {
	    r.spawnAsyncProcess( data, offset, fn, bubbleCallback );
	}
	else if ( config.computation_method === 'threaded' ) {
	    r.spawnWebWorker( data, fn, bubbleCallback );
	}
	else {
	    console.error("bad call to spawnParrallelProcess");
	}
    };
    
    /**
     * split array into 'maxProcesses' pieces and spawn that amount of
     * asyc or threaded processes supplying the 'fn' callback for each one.
     * once they are complete, reassemble them into one array and return them.
     */
    a.parallelProcessArray = function ( array, fn, callback ) {
	var 
	maxProcesses = config.computation_method == 'asynchronous' ? config.max_processes : 1,
	arraySplitInt = Math.round( array.length / maxProcesses ),
	parIt = 0,
	pData = null,
	results = [],
	reconstructResponse = [],
	reconstructData = function ( operationData, sortOrder ) {
	    results.push({ 
		'data' : operationData,
		'order' : sortOrder
	    });
	    
	    // only sort * reconstruct if all results have been gathered
	    if ( results.length === arraySplitInt ) {
		results.sort(function ( a, b ) {
		    return b.order - a.order;
		});

		for ( resultsIt = 0; resultsIt < results.length; resultsIt++ ) {
		    reconstructResponse.join( results[ resultsIt ].data );
		}
                 
		if ( callback != null ) {
		    callback( reconstructResponse );
		}
	    }

	};
		
	for ( parIt = 0; parIt < array.length; parIt += arraySplitInt ) {
	    pData = array.splice( parIt, parIt + arraySplitInt );
	    r.spawnParallelProcess( pData, parIt, fn, reconstructData );
	}
	
	
    };

    // objects initialisor fn. overwrites default config options if provide and sets up
    // the object.
    a.setConfig = function ( defaultConfig, configBuffer ) {
	// loop config properties
	var 
	prop;
	configBuffer = typeof configBuffer !== 'undefined' ? configBuffer : defaultConfig;
	
	for ( prop in defaultConfig ) {
	    if ( defaultConfig.hasOwnProperty( prop ) && !configBuffer.hasOwnProperty( prop ) ) {
		// overrite config defaults
		configBuffer[ prop ] = defaultConfig[ prop ];
	    }
	}
	
	return configBuffer;
    };


    // gets a 3x3 grid surrounding the given square.
    // @x (INT): The squares x position in the matrix
    // @y (INT): The squares y position in the matrix
    // @matrix (ARRAY): The matrix of pixel data represented as a multi-dimensional array structure
    a.extractGrid = function ( x, y, matrix ) {
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
    

    a.setConfig( defaultConfig, config );

    return a;
};
;/**
 *
 *	This simulation runs John Conway's *Game of Life* experiement in browser.
 *	It uses HTML5 canvas for output and web workers to handle parallel computation.
 *       I built this for fun, but also partly to see how far you could push browser performance.
 *
 *       - www
 *
 *	BROWSER DEPENDENCIES:
 *        Canvas, Web Workers.
 *
 *       LICENSE:
 *        MIT licensed. See LICENSE.md file distributed with this source code.
 *
 *       CHANGE LOG:
 *        0.0.2
 *         REPLACED: jQuery dependencies in favour of vanilla JS.
 *         EDITED: Refactored code to be more modular.
 *         ADDED: Support for parallel compution using web workers.
 *         ADDED: Basic instrumentation to better benchmark performace of specific functions
 *
 *        0.0.1
 *         ADDED: Source code and supporting files to repositiory.
 ****/


GolController = function ( config ) {
    // set ECMA Strict mode
    "use strict";
    // declare vars
    var 
    // restricted and available APIs
    r = {}, 
    a = {},
    // object for storing config defaults
    defaultConfig = {
	'canvas' : 'canvas',
	'display' : '',
	'width' : 300,
	'height' : 300,
	'master_timer' : 300,
	'colours' : {
	    'foreground' : '#C2FF85',
	    'background' : '#C2C2C2'
	},
	'seed_density' : 25
    },
    // the GOL Engine & Display objects. A 'self' reference to 'this' object.
    engine,
    display,
    self = this;

    /***********************
     ** AVAILABLE METHODS **
     ***********************/
    
    // call engine to run passing it the draw method of the display adapter
    a.run  = function () {
	engine.run( display.drawDisplay );
    };

    // pauses execution of the simulation. does not clear any data.
    a.pause = function () {
	engine.suspend();
    };

    // resets the simulation and rebuilds the seed matrix.
    a.rebuild = function () {
	engine.rebuild();
    };

    /***********************
     ** RESTRICTED METHODS **
     ************************/
    
    r.init = function () {
	config = self.setConfig( defaultConfig, config );
	engine = new GolEngine(config);
	display = eval("new GolDisplay" + config.display + "(" + JSON.stringify(config) +  ");");
    };

    r.init();

    // return public API
    return a;
};

// inherit base object methods
GolController.prototype = new GolBase();



;/**
 * GOL Display
 * --------
 *
 * This is the GOL Display HTML5 canvas display adapter. Inherit from this to create
 * new display adapters that use the GOL engine.
 * ----
 *
 * @author: Jason Wijegooneratne
 * @date: May 2013
 *
 **/

GolDisplay = function ( config ) {
    "use strict";
    var a = {}, r = {},
    self = this,
    defaultConfig = {
	'width' : 300,
	'height' : 300,
	'selector' : 'canvas',
	'colours' : {
	    background : "#FFFFFF",
	    foreground : "#C2FF85"
	}
    },
    canvasObject = null,
    ctx = null;

    /**
     * Sets up the html canvas element and performs all required JS loading of it.
     */
    r.setupDisplay = function () {
	canvasObject = document.getElementById( config.selector );
	canvasObject.style.width = config.width;
	canvasObject.style.height = config.height;
	ctx = canvas.getContext( "2d" );
    };

    
    /**
     * draws data matrix to the canvas
     * @matrix (ARRAY): The matrix of pixel data represented as a multi-dimensional array structure
     */
    a.drawDisplay = function ( matrix ) {
	var
	renderMatrixSegment = function ( segment, offset ) {
	    var
	    y_it,
	    x_it,
	    square;

	    // loop y
	    for ( y_it = 0; y_it < segment.length; y_it++ ) {

		// loop x;
		for ( x_it = 0; x_it < segment[ y_it ].length; x_it++ ) {
		    square = segment[y_it][x_it];

		    // filter square state and set colour
		    if ( square > 0 ) {
			// alive
			ctx.fillStyle = config.colours.foreground;
		    }
		    else {
			// dead
			ctx.fillStyle = config.colours.background;
		    }

		    ctx.fillRect( x_it, y_it + offset, 1, 1 );

		}	

	    }
	    return segment;
	};

	renderMatrixSegment( matrix, 0 );
	
    };
    
    /* 
     * This controller init function. sets up default config and the display.
     */
    r.init = function () {
	config = self.setConfig( defaultConfig, config );
	r.setupDisplay();
    };
    
    r.init();

    return a;
};

/* inherit base object methods */
GolDisplay.prototype = new GolBase();
;
GolDisplayHTML = function ( config ) {
    "use strict";
    var a = {}, r = {},
    self = this,
    defaultConfig = {
	'width' : 300,
	'height' : 300,
	'selector' : 'canvas',
	'colours' : {
	    background : "#FFFFFF",
	    foreground : "#C2FF85"
	}
    },
    canvasElement = null;

    /**
     * Sets up the html canvas element and performs all required JS loading of it.
     */
    r.setupDisplay = function () {
	canvasElement = document.getElementById( config.selector );
	canvasElement.style.background = config.colours.background;
	canvasElement.style.color = config.colours.foreground;
    };

    
    /**
     * draws data matrix to the canvas
     * @matrix (ARRAY): The matrix of pixel data represented as a multi-dimensional array structure
     */
    a.drawDisplay = function ( matrix ) {
	var strEffect = function ( str ) {	   
	    str = str.replace(/1/g, "<span class='alive'>1</span>");	    
	    return str;
	};
	canvasElement.innerHTML = strEffect( r.dumpDataString( matrix, " " ) );	
    };


    // returns the matrix as a CSV string.
    r.dumpDataString = function ( matrix, delimeter ) {
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
    
    /* 
     * This controller init function. sets up default config and the display.
     */
    r.init = function () {
	config = self.setConfig( defaultConfig, config );
	r.setupDisplay();
    };
    
    r.init();

    return a;

};


/* inherit base object methods */
GolDisplayHTML.prototype = new GolBase();
;/**
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


;/**
* Paste bin for general JavaScript language extensions to be compiled into the production
* and lexically scoped out via an anonomous function.
*/


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
