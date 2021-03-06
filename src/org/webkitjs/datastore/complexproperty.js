///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.BindingProperty');
goog.require('webkitjs.DataStoreManager');
// provide
goog.provide('webkitjs.ComplexProperty');

/**
 * The Complex Property class. This class overrides default functionality to
 * allow special treatment of values and formulas
 * 
 * *NOTE* Extend this class to implement your own logic
 * 
 * @event beforechange
 * @event change
 * 
 * @param {string=} val Optional initial value
 * @param {string=} name Optional name
 * @param {webkitjs.DataStore=} parent Optional parent for event propagation
 * 
 * @constructor
 * @extends {webkitjs.BindingProperty}
 */
webkitjs.ComplexProperty = function(val, name, parent) {

	this.callSuper(webkitjs.BindingProperty, val, name, parent);

	this.addListener('change', function(e) {

		this.updateValuesCache(e.binding);
	}, this);
	return this;
};
webkitjs.ComplexProperty.prototype = new webkitjs.BindingProperty;
webkitjs.extend(webkitjs.ComplexProperty, webkitjs.BindingProperty);

// TODO: register for an event on manager to flush cached values

/**
 * Access type.
 * 
 * @type {webkitjs.Property.access}
 */
webkitjs.ComplexProperty.prototype.access_ = webkitjs.Property.access.EXEC;

/**
 * @type {Array}
 */
webkitjs.ComplexProperty.prototype.arguments_ = [];

/**
 * Set up.
 * 
 * @param {*} o The content of the tag used to create this instance (in
 *            DataStore class)
 * @override
 */
webkitjs.ComplexProperty.prototype.setUp = function(o) {

	var parts = this.arguments_;

	var mgr = webkitjs.DataStoreManager.getInstance();
	var path = this.getGlobalPath();
	var localpath = this.localPath_ = path.slice(0, path.lastIndexOf(":")+1);
	var l = parts.length;
	var s;
	// if parameter contains ':', assume it's a global path, otherwise
	// assume it's local
	for ( var i = 0; i < l; i++) {
		if (parts[i].indexOf(':') !== -1)
			s = parts[i];
		else
			s = localpath + parts[i];

		mgr.addBinding(s, path);
	}
};

/**
 * Set value. Dispatches a <code>change</code> event
 * 
 * @param {*} val The value to set
 * @param {string=} origin Optional path of the setter
 */
webkitjs.ComplexProperty.prototype.set = function(val, origin) {

};

/**
 * Get value
 * 
 * @returns {*}
 */
webkitjs.ComplexProperty.prototype.get = function() {

};

/**
 * Cache value dependencies
 */
webkitjs.ComplexProperty.prototype.initValuesCache = function() {

	this.cache_ = {};
	var parts = this.arguments_;
	var mgr = webkitjs.DataStoreManager.getInstance();
	var l = parts.length;
	var val;
	var s;
	// if parameter contains ':', assume it's a global path, otherwise
	// assume it's local
	for ( var i = 0; i < l; i++) {
		if (parts[i].indexOf(':') !== -1)
			s = parts[i];
		else
			s = this.localPath_ + parts[i];
		val = mgr.getStore().getField(s).get();
		this.cache_[s] = this.format(val);
	}
};

webkitjs.ComplexProperty.prototype.format = function(val) {

	if (val) {
		if (isNaN(parseFloat(val))) {
			if ( typeof val == 'string') {
				if (val.indexOf('true') != - 1) {
					return true;
				}
				else if (val.indexOf('false') != - 1) {
					return false;
				}
			}
		}
		else {
			return val;
		}
	}
	return val;
};

/**
 * Update any value that triggered a change event
 * 
 * @param {string} origin
 */
webkitjs.ComplexProperty.prototype.updateValuesCache = function(origin) {

	if ( ! this.cache_)
		this.initValuesCache();

	if (origin) {
		var mgr = webkitjs.DataStoreManager.getInstance();
		var field = mgr.getStore().getField(origin);

		// if this is a self referring event, skip cache
		if (field === this)
			return;

		// cache the updated value
		this.cache_[origin] = this
		        .format(mgr.getStore().getField(origin).get());
	}
};
