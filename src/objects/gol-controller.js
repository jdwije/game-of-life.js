/**
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



