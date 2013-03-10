// provides
goog.provide('webkitjs.dom');
goog.provide('webkitjs.dom.event');
goog.provide('webkitjs.extend');

/*
 * WebkitJs - An OOP framework for use as a base in projects
 * 
 * The main browser abstraction is done using jQuery
 * Code in general is tailored to work with the Google Closure Compiler
 * 
 * Conventions, Patterns, Tools etc:
 * MVC				- http://en.wikipedia.org/wiki/Model-view-controller
 * OOP				- http://en.wikipedia.org/wiki/Object-oriented_programming
 * Observer Pattern	- http://en.wikipedia.org/wiki/Observer_Pattern
 * 
 * JsDoc			- http://code.google.com/p/jsdoc-toolkit/
 * jQuery			- http://api.jquery.com/
 * 
 * Google Closure Tools:	https://developers.google.com/closure/
 * 
 * Closure Compiler:
 * http://code.google.com/p/closure-compiler/
 * http://code.google.com/p/closure-compiler/wiki/CompilerAssumptions
 * https://developers.google.com/closure/compiler/docs/js-for-compiler
 */

/// Developer tools for performance and logging ///////////////////////////////
/**
 * Enable developer mode, ie do console logging etc
 * @type {webkitjs.log.mode}
 */
webkitjs.developerMode;

/**
 * Generic logging
 * 
 * @param {...*} var_args
 */
webkitjs.log = function(var_args) {

	if (!webkitjs.developerMode)
		return;

	if (window.console && window.console.log) {
		var s;
		var type;
		if (arguments[1]) {
			s =  arguments[1];  
			type = arguments[0];
		}
		else {
			s = arguments[0];
			type = webkitjs.log.mode.INFO;
		}
		if (webkitjs.developerMode & type) {
			
			window.console.log(webkitjs.log.string[type] + s);
		}
	}
};

/**
 * LOG types
 * 
 * @enum {number}
 */
 webkitjs.log.mode = {
	NONE : 0,		// 0x000
	ERROR : 1,		// 0x001
	WARNING : 2,		// 0x010
	ERROR_WARNING : 3,	// 0x011
	WARNING_ERROR : 3,	// 0x011
	INFO : 4,		// 0x100
	
	ERROR_INFO : 5,	// 0x101
	INFO_ERROR : 5,	// 0x101
	
	WARNING_INFO : 6,	// 0x110
	INFO_WARNING : 6,	// 0x110
	
	ERROR_WARNING_INFO : 7, // 0x111
	ERROR_INFO_WARNING : 7, // 0x111
	WARNING_ERROR_INFO : 7, // 0x111
	WARNING_INFO_ERROR : 7, // 0x111
	INFO_WARNING_ERROR : 7, // 0x111
	INFO_ERROR_WARNING : 7 // 0x111
};

 /**
 * LOG strings
 * 
 * @enum {string}
 */
webkitjs.log.string = {
	'1' : 'ERROR: ',
	'2' : 'WARNING: ',
	'4' : 'INFO: '
};
 
/**
 * Performance logging
 * 
 * @param {string} s message to put before the timing section
 */
webkitjs.clockLog = function(s) {
	if (!webkitjs.developerMode)
		return;

	if (window.console && window.console.log) {
		var now = (new Date) - 0;
		var t = (new Date) - webkitjs.t_ || 0;
		webkitjs.tot_ = t + webkitjs.tot_;

		webkitjs.log(s + ': ' + t + 'ms ( total:' + webkitjs.tot_ + 'ms )');
		webkitjs.t_ = now;
	}
};
/**
 * time placeholder for the clock log
 * 
 * @type {number}
 */
webkitjs.t_;

/**
 * total time for the clock log
 * 
 * @type {number}
 */
webkitjs.tot_ = 0;

// Pseudo Classical Inheritance ///////////////////////////////////////////////
/**
 * When defining inheritance, jump out of constructor. 
 * @see webkitjs.Object.prototype.callSuper
 * @type {boolean}
 */
webkitjs.inPrototype = false;

/**
 * The general class extension method
 * 
 * @param {Function}	fConstructor	The class constructor
 * @param {Function}	fProto	The prototype constructor
 * @param {string|null|undefined=}		sCssClassName The optional css class name. This should be set for
 *            			Components.
 * 
 * @returns {Object}
 */
webkitjs.extend = function(fConstructor, fProto, sCssClassName) {

	/*
	 * Set prototype, but hold off calling it's constructor until creating an
	 * instance.
	 */
	webkitjs.inPrototype = true;
	var p = new fProto;
	webkitjs.inPrototype = false;
	fConstructor.prototype = p;

	/*
	 * set a reference to the superclass constructor on the prototype so that we
	 * can access it when creating an instance
	 */
	p.super_ = fProto;

	// css class name
	if (sCssClassName)
		p.cssClassName_ = sCssClassName;

	return p;
};


// Browser abstraction ////////////////////////////////////////////////////////

/**
 * This is the DOM and browser abstraction layer. For now, we use jQuery, so
 * webkitjs.dom equals the jQery API: http://api.jquery.com/
 * 
 * @type {?}
 */
//TODO: look into using Sizzle directly and adding only what's needed
webkitjs.dom = function() {};
webkitjs.dom.event = jQuery.event;
webkitjs.dom.prototype = {};
webkitjs.dom = jQuery;


// Improve native objects  ////////////////////////////////////////////////////
/*
 * Function
 */
// TODO: decide whether to implement addProperty etc
/*
 * String
 */
if (!String.prototype.capitalize) {
	String.prototype.capitalize = function() {

		return this.charAt(0).toUpperCase() + this.slice(1);
	};
};

/*
 * Array
 */
// TODO: add map, remove etc
// Add foreach if it doesnt exist
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(f, obj) {

		var l = this.length;
		for ( var i = 0; i < l; i++) {
			f.call(obj, this[i], i, this);
		}
	};
};
