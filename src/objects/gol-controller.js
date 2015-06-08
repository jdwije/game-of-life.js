/**
 *
 *	This simulation runs John Conway's *Game of Life* experiement in browser.
 *	It uses HTML5 canvas for output and web workers to handle parallel computation.
 *       I built this for fun, but also partly to see how far you could push browser performance.
 ****/


GolController = function ( config ) {
    "use strict";
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
    _self = this;
    r.engine = null;
    r.display = null;


    /***********************
     ** AVAILABLE METHODS **
     ***********************/
    
    // call r.engine to run passing it the draw method of the display adapter
    a.run  = function () {
	r.engine.run( r.display.drawDisplay );
    };

    // pauses execution of the simulation. does not clear any data.
    a.pause = function () {
	r.engine.suspend();
    };

    // resets the simulation and rebuilds the seed matrix.
    a.rebuild = function () {
	r.engine.rebuild();
    };

    /***********************
     ** RESTRICTED METHODS **
     ************************/
    
    r.init = function () {
	config = _self.setConfig( defaultConfig, config );
	r.engine = new GolEngine(config);
	r.display = eval("new GolDisplay" + config.display + "(" + JSON.stringify(config) +  ");");
    };

    r.init();

    // return public API
    return a;
};

// inherit base object methods
GolController.prototype = new GolBase();



