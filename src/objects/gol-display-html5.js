/**
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
