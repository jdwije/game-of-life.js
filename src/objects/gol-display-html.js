
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
