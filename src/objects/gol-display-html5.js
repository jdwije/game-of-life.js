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
	'scale' : 1,
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
	canvasObject.style.width = parseInt(config.width * config.scale, 10) + "px";
	canvasObject.style.height = parseInt(config.height * config.scale, 10) + "px";
	ctx = canvasObject.getContext( "2d" );
    };

    
    /**
     * draws data matrix to the canvas
     * @matrix (ARRAY): The matrix of pixel data represented as a multi-dimensional array structure
     */
    a.drawDisplay = function ( matrix ) {

	var renderMatrixSegment = function ( segment ) {
	    var
	    y_it,
	    x_it,
	    square,
	    x_axis_scaled,
	    y_axis_scaled;

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
		    
		    // if we are scaling calculate the scaled coordiantes of 
		    // this position in the matrix
		    x_axis_scaled = x_it * config.scale;
  		    y_axis_scaled =  y_it * config.scale;
		    ctx.fillRect( x_axis_scaled, y_axis_scaled, config.scale, config.scale );
		}	

	    }
	    return segment;
	};

	renderMatrixSegment( matrix );
	
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
