// requires
goog.require('webkitjs.EventTarget');

// provide
goog.provide('webkitjs.DataStoreManager');

/**
 * The DataStoreManager singleton. 
 *  
 * @constructor
 * @extends	{webkitjs.EventTarget}
 * 
 * @param {webkitjs.DataStore=}	oStore	the main data store
 */
webkitjs.DataStoreManager = function(oStore) {

	var singleton = webkitjs.DataStoreManager;
	if (singleton.instance_) {
		if (oStore)
			singleton.instance_.setStore(oStore);
		return singleton.instance_;
	}
	else {
		this.callSuper(webkitjs.EventTarget);
		this.bindings_ = {};

		this.setStore(oStore);

		return singleton.instance_ = this;
	}
};
webkitjs.DataStoreManager.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.DataStoreManager, webkitjs.EventTarget);

/**
 * The DataStoreManager instance
 * @returns {webkitjs.DataStoreManager}
 */
webkitjs.DataStoreManager.getInstance = function() {

	return new webkitjs.DataStoreManager();
};

/**
 * The Data Store
 * @type {webkitjs.DataStore}
 */
webkitjs.DataStoreManager.prototype.store_;
webkitjs.DataStoreManager.prototype.getStore = function() {

	return this.store_;
};
webkitjs.DataStoreManager.prototype.setStore = function(oStore) {

	this.store_ = oStore;
	if (oStore) {
		oStore.addListener('change', this.onDataChange_, this);
	}
};

/**
 * The bindings container
 * @type {Object}
 */
webkitjs.DataStoreManager.prototype.bindings_;

/**
 * Add a binding
 * @param {!string}	target
 * @param {!string}	destination
 */
webkitjs.DataStoreManager.prototype.addBinding = function(target, destination) {

	this.bindings_[target] = this.bindings_[target] || {};
	this.bindings_[target][destination] = !0;
};

/**
 * Handler for data change events from the store
 * @param {webkitjs.dom.event}	e
 */
webkitjs.DataStoreManager.prototype.onDataChange_ = function(e) {

	var path = e.target.getGlobalPath();
	var bindings = this.bindings_[path];
	if (bindings) {
		for ( var dependency in bindings) {
			if (dependency != e.origin) { // stop loops and updates to self
				// dispatch update information on dependant properties
				this.getStore().getField(dependency).triggerChangeEvent(undefined, e.origin);
			}
		}
	}
};
