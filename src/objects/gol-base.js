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
