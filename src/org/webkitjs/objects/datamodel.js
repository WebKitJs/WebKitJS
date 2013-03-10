///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.EventTarget');
goog.require('webkitjs.DataStore');
// provide
goog.provide('webkitjs.DataModel');

/**
 * The base DataModel class. Implements an api for a plain object.
 *  
 * @constructor
 * @extends	{webkitjs.EventTarget}
 */
webkitjs.DataModel = function() {
	this.callSuper(webkitjs.EventTarget);
	this.store_ = {};
};
webkitjs.DataModel.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.DataModel, webkitjs.EventTarget);

/**
 * Add field
 * 
 * @param {string} name The name of the Field
 * @param {*} val Optional initial value
 */
webkitjs.DataModel.prototype.add = function (name, val) {
	this.store_[name] = val;
};

/**
 * Remove field
 * 
 * @param {string} name The name of the Field
 * 
 */
webkitjs.DataModel.prototype.remove = function (name) {
	this.store_[name] = null;
	delete this.store_[name];
};

/**
 * Set value
 *
 * @param {string}	name	The name of the field
 * @param {*}	val	The value to set
 */
webkitjs.DataModel.prototype.set = function(name, val) {
	this.store_[name] = val;
};

/**
 * Get value
 * 
 * @param {string}	name	The name of the field
 * @returns {*}
 */
webkitjs.DataModel.prototype.get = function(name) {
	return this.store_[name];
};


