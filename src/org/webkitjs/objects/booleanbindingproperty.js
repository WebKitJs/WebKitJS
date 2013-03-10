///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.BindingProperty');
goog.require('webkitjs.DataStoreManager');
// provide
goog.provide('webkitjs.BooleanBindingProperty');

/**
 * The Boolean BindingProperty class. This class sets and gets boolean values.
 * the getter transforms anything boolean-ish to boolean
 * 
 * @event beforechange
 * @event change
 * 
 * @param {string=} val Optional initial value
 * @param {string=} name Optional name
 * @param {webkitjs.DataStore=}	parent	Optional parent for event propagation
 * 
 * @constructor
 * @extends {webkitjs.BindingProperty}
 */
webkitjs.BooleanBindingProperty = function(val, name, parent) {
	this.callSuper(webkitjs.BindingProperty, val, name, parent);
	return this;
};
webkitjs.BooleanBindingProperty.prototype = new webkitjs.BindingProperty;
webkitjs.extend(webkitjs.BooleanBindingProperty, webkitjs.BindingProperty);

/**
 * @override
 */
webkitjs.BooleanBindingProperty.prototype.set = function(val, origin) {
	webkitjs.BindingProperty.prototype.set.apply(this, [this.toBoolean(val), origin]);
};


/**
 * @override
 */
webkitjs.BooleanBindingProperty.prototype.get = function(val) {
	var out = webkitjs.BindingProperty.prototype.get.apply(this, [val])
	return this.toBoolean( out );
};

/**
 * Transform a value into boolean
 * @param {*} o
 * @returns {boolean}
 */
webkitjs.BooleanBindingProperty.prototype.toBoolean = function (o) {
	if (typeof o == 'string')
		return o.toLowerCase() == 'true';
	else
		return !!o;
};