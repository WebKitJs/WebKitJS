///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.DataModel');
goog.require('webkitjs.DataStore');
// provide
goog.provide('webkitjs.DataStoreDataModel');

/**
 * The DataStoreDataModel class. Implements a data model for use with
 * webkitjs.DataStore
 * 
 * @constructor
 * @extends {webkitjs.DataModel}
 * 
 * @param {webkitjs.DataStore} store The store to use for the model
 */
webkitjs.DataStoreDataModel = function(store) {

	this.callSuper(webkitjs.DataModel);
	this.store_ = store || new webkitjs.DataStore;
	this.store_.addListener('change', this.onDataChange_, this);
};
webkitjs.DataStoreDataModel.prototype = new webkitjs.DataModel;
webkitjs.extend(webkitjs.DataStoreDataModel, webkitjs.DataModel);

/**
 * Add field
 * 
 * @param {string} name The name of the Field
 * @param {Object|webkitjs.Property|undefined} val Optional initial value
 */
webkitjs.DataStoreDataModel.prototype.add = function(name, val) {

	this.store_.addField(name, val);
};

/**
 * Remove field
 * 
 * @param {string} name The name of the Field
 * 
 */
webkitjs.DataStoreDataModel.prototype.remove = function(name) {

	this.store_.removeField(name);
};

/**
 * Set value
 * 
 * @param {string} name The name of the field
 * @param {*} val The value to set
 */
webkitjs.DataStoreDataModel.prototype.set = function(name, val) {

	this.store_.getField(name).set(val);
};

/**
 * Get value
 * 
 * @param {string} name The name of the field
 * @returns {*}
 */
webkitjs.DataStoreDataModel.prototype.get = function(name) {

	return this.getFieldObject(name) && this.getFieldObject(name).get();
};

/**
 * Get field names
 * 
 * @returns {Array.<string>}
 */
webkitjs.DataStoreDataModel.prototype.getFieldNames = function() {

	return this.store_.getFieldNames();
};

/**
 * Get the field object *NOTE* This is to be used with care
 * 
 * @param {string} name The name of the field
 * @returns {webkitjs.Property|webkitjs.DataStore}
 */
webkitjs.DataStoreDataModel.prototype.getFieldObject = function(name) {

	return this.store_.getField(name);
};

/**
 * Handler for change events on the data store
 * 
 * @param {webkitjs.dom.event} e
 * 
 * Trigger a change event containing the path to the event target
 * @event {{ type: 'change', dataPath: {string} }}
 */
webkitjs.DataStoreDataModel.prototype.onDataChange_ = function(e) {

	var path = e.currentTarget.getEventPath(e.target);
	if (webkitjs.developerMode)
		webkitjs.log(webkitjs.log.mode.INFO, 'change event for "'
		        + path + ' : ' + e.target.parentNode.name_
		        + '" was triggered by ' + this.getId());

	this.triggerEvent({
	    type : 'change',
	    dataPath : path
	});
};
