///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

//requires
goog.require('webkitjs.extend');
// provides
goog.provide('webkitjs.Object');

/**
 * The Object class. This is the base for all other classes
 * 
 * @constructor
 * @extends {Object}
 */
webkitjs.Object = function() {

};
webkitjs.extend(webkitjs.Object, Object);
webkitjs.Object.prototype = new Object;

/**
 * @type {!number}
 */
webkitjs.Object.idCount_ = 0;

/**
 * The Id property. A unique number or string
 * 
 * @returns {Object}
 */
webkitjs.Object.prototype.getId = function() {
	return this.id_ = this.id_ || 'o_' + webkitjs.Object.idCount_++, this.id_;
};
webkitjs.Object.prototype.setId = function(o) {

	this.id_ = o;
};


/**
 * This method is used to call constructors in the inheritance chain.
 * 
 * @param {...}	args	The constructor to call, followed by any number of arguments.
 */
webkitjs.Object.prototype.callSuper = function(args) {

	if (webkitjs.inPrototype) {
		return;
	}
	else {
		var ary = Array.prototype.slice.call(arguments);
		var f = ary.shift();
		f.apply(this, ary);
	}
};

// TODO: you have to externalize every property you want to access by this method
/**
 * Get the value of any property by name
 * *NOTE* you have to externalize every property you want to access by this method 
 * 
 * @param {string} sName
 * @return {*}
 */
webkitjs.Object.prototype.getProperty = function(sName) {
	var getter = 'get' + sName.capitalize();
	if (this[getter]) {
		return this[getter]();
	} else {
		return this[sName + '_'];
	};
};
