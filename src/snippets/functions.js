/**
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
