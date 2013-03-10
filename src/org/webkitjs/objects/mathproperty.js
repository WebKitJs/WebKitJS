///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.BindingProperty');
goog.require('webkitjs.DataStoreManager');
// provide
goog.provide('webkitjs.MathProperty');

/**
 * The base MathProperty class. This class takes a val in the form 
 * [ P101,P103, P103+P101 ] with a maximum of 21 values
 * the last one is treated as an expression based on the others that is to be
 * returned. The current implementation matches names in the main store like:
 * data:[parameter name] container.
 * 
 * [ P101,P103, P103+P101 ] would return the sum of {data:P103} and {data:P101}
 * 
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
webkitjs.MathProperty = function(val, name, parent) {
	this.callSuper(webkitjs.BindingProperty, val, name, parent);
	return this;
};
webkitjs.MathProperty.prototype = new webkitjs.BindingProperty;
webkitjs.extend(webkitjs.MathProperty, webkitjs.BindingProperty);

//TODO: use a path based on the current store?

/**
 * Access type.
 * 
 * @type {webkitjs.Property.access}
 */
webkitjs.MathProperty.prototype.access_ = webkitjs.Property.access.EXEC;

/**
 * Set up the binding to a property.
 * 
 * @param {*} o
 * @override
 */
webkitjs.MathProperty.prototype.setUp = function(o) {

	var parts = o.split(',');
	var fbody = parts.pop(); // take away the function body

	var mgr = webkitjs.DataStoreManager.getInstance();
	var path = this.getGlobalPath();
	var localpath = this.localPath_ = path.slice(0, path.lastIndexOf(":")+1);
	var l = parts.length;
	var s;
	
	// If parameter strats with 'P', assume it's in the 'P' store
	// otherwise, default to being at the same path as this property
	for ( var i = 0; i < l; i++) {
		if (parts[i].indexOf('P') == 0)
			s = 'P:' + parts[i];
		else
			s = localpath + parts[i];
		mgr.addBinding(s, path);
	}

	// set a pointer to the binded property
	this.math_ = /** @type {Function} */
		new Function(parts, 'var sum =' + fbody + ';return sum || ""' );
	this.arguments_ = parts;
};

/**
 * Get value
 * 
 * @returns {*}
 */
webkitjs.MathProperty.prototype.get = function() {
	if (this.getAccess() & webkitjs.Property.access.EXEC) {

		var mgr = webkitjs.DataStoreManager.getInstance();
		var parts = this.arguments_;
		var arg = [];
		var l = parts.length;
		var s;
		
		// If parameter starts with 'P', assume it's in the 'P' store
		// otherwise, default to being at the same path as this property
		for ( var i = 0; i < l; i++) {
			if (parts[i].indexOf('P') == 0)
				s = 'P:' + parts[i];
			else
				s = this.localPath_ + parts[i];
			
			arg[i] = mgr.getStore().getField(s).get();
		}
		return this.math_(arg[0], arg[1], arg[2], arg[3], arg[4], arg[5],
				arg[6], arg[7], arg[8], arg[9], arg[10], arg[11], arg[12],
				arg[13], arg[14], arg[15], arg[16], arg[17], arg[18], arg[19],
				arg[20]);
	}
};

