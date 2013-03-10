///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.EventTarget');
goog.require('goog.storage.mechanism.HTML5LocalStorage');
goog.require('goog.json');

// provide
goog.provide('webkitjs.LocalStorage');

/**
 * This class implements a singleton that wraps the local storage. getters and
 * setters assume that the data is JSON so all values will be automagically
 * parsed and serialized as JSON objects
 * 
 * 
 * @constructor
 * @extends {webkitjs.EventTarget}
 */
webkitjs.LocalStorage = function() {

	var singleton = webkitjs.LocalStorage;
	if (singleton.instance_) {
		return singleton.instance_;
	}
	else {
		this.callSuper(webkitjs.EventTarget);
		this.localStorage_ = new goog.storage.mechanism.HTML5LocalStorage;
		return singleton.instance_ = this;
	};
};
webkitjs.LocalStorage.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.LocalStorage, webkitjs.EventTarget);

/**
 * The LocalStorage instance
 * 
 * @returns {webkitjs.LocalStorage}
 */
webkitjs.LocalStorage.getInstance = function() {

	return new webkitjs.LocalStorage();
};

/**
 * Get the value of a property by name
 * 
 * @param {string} sName
 * @return {Object.<*>}
 */
webkitjs.LocalStorage.prototype.get = function(sName) {

	return goog.json.parse(this.localStorage_.get(sName));
};

/**
 * Set the value of a property by name
 * 
 * @param {string} sName
 * @param {Object.<*>} oValue
 */
webkitjs.LocalStorage.prototype.set = function(sName, oValue) {

	this.localStorage_.set(sName, goog.json.serialize(oValue));
};
