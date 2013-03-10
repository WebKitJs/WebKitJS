// requires
goog.require('webkitjs.Property');
goog.require('webkitjs.DataStoreManager');
// provide
goog.provide('webkitjs.BindingProperty');

/**
 * The base BindingProperty class.
 * 
 * @event beforechange
 * @event change
 * 
 * @param {string=} val Optional initial value
 * @param {string=} name Optional name
 * @param {webkitjs.DataStore=}	parent	Optional parent for event propagation
 * 
 * @constructor
 * @extends {webkitjs.Property}
 */
webkitjs.BindingProperty = function(val, name, parent) {
	this.callSuper(webkitjs.Property, val, name, parent);
	return this;
};
webkitjs.BindingProperty.prototype = new webkitjs.Property;
webkitjs.extend(webkitjs.BindingProperty, webkitjs.Property);

// TODO: add validation
// TODO: add last modified


/**
 * The binded property
 * 
 * @type {string}
 */
webkitjs.Property.prototype.binding_;


/**
 * Set up the binding to a property.
 * 
 * @param {*} o
 * @override
 */
webkitjs.BindingProperty.prototype.setUp = function(o) {

	if (o) {
		// set a pointer to the binded property
		this.binding_ = /** @type {string} */ o;
		
		var mgr = webkitjs.DataStoreManager.getInstance();
		var path = this.getGlobalPath();
		mgr.addBinding(this.binding_, path);
	}
};


/**
 * Set value. events are dispatched by the binding manager if the binded 
 * property changes.
 * 
 * @param {*} val The value to set
 * @param {string=}	origin	Optional path of the setter
 */
webkitjs.BindingProperty.prototype.set = function(val, origin) {
	if (this.getAccess() & webkitjs.Property.access.WRITE) {
		var path = this.binding_;
		var mgr = webkitjs.DataStoreManager.getInstance();
		mgr.getStore().getField(path).set(val, origin || this.getGlobalPath());
	}
};

/**
 * Get value
 * 
 * @returns {*}
 */
webkitjs.BindingProperty.prototype.get = function() {
	if (this.getAccess() & webkitjs.Property.access.READ) {
		var path = this.binding_;
		var mgr = webkitjs.DataStoreManager.getInstance();
		return mgr.getStore().getField(path).get();
	}
};
