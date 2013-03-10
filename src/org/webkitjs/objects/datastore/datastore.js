///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.EventTarget');
goog.require('webkitjs.Property');
goog.require('webkitjs.BindingProperty');
goog.require('webkitjs.BooleanBindingProperty');
goog.require('webkitjs.MathProperty');
goog.require('webkitjs.ComplexProperty');

// provide
goog.provide('webkitjs.DataStore');

/**
 * The DataStore class. This class implements a data store structure. When
 * passing a JSON object as the first argument, it is interpreted
 * 
 * @param {Object.<*>=}	o	Optional JSON object containing values to use for the store
 * @param {string|undefined=}	name	Optional name for the store
 * @param {webkitjs.DataStore=}	parent	Optional parent for event propagation
 *  
 * @constructor
 * @extends {webkitjs.EventTarget}
 */
webkitjs.DataStore = function(o, name, parent) {
	this.callSuper(webkitjs.EventTarget);
	this.data_ = {};
	this.name_ = name;
	this.parentNode = parent;
	if (o) {
		this.setData(o);
	};
};
webkitjs.DataStore.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.DataStore, webkitjs.EventTarget);

/**
 * Strings for data store
 * 
 * @enum {string}
 */
webkitjs.DataStore.s = {
	PATH_DIVIDER : ':',
	PATH_SELECTION : '*'
};

/**
 * Matching strings for data store
 * 
 * @type {RegExp}
 */
webkitjs.DataStore.REGEXP_PATH_DIVIDER = new RegExp(webkitjs.DataStore.s.PATH_DIVIDER,'g');

/**
 * Set store data from JSON object
 * @param {Object.<*>=} o
 */
webkitjs.DataStore.prototype.setData = function (o) {
	for (var name in o) {
		this.addField(name, o[name]);
	}
};

/**
 * The selected field
 * 
 * @type {string}
 */
webkitjs.DataStore.prototype.selection_;
webkitjs.DataStore.prototype.getSelection = function () {
	// default to first field
	return this.getField(this.selection_) || this.getField(this.getFieldNames()[0]);
};
webkitjs.DataStore.prototype.setSelection = function (sName) {
	this.selection_ = sName;
};

/**
 * Add a field to the store
 * 
 * @param {string} name The name of the Field
 * @param {*=} val Optional 
 * 			initial value or an instance of <code>webkitjs.Property</code>for 
 * 			the field
 */
webkitjs.DataStore.prototype.addField = function(name, val) {

	// TODO: Add support for import of objects from the server 
	
	// if we get an instance, use that
	if (val && ( val instanceof webkitjs.DataStore || val instanceof webkitjs.Property)) {
		this.add_(name, val);
	}
	else {
		var node;
		if (typeof val == 'function') {
			node = new val(name, name, this);
		}
		else if (typeof val == 'object') {
			
			if (val.hasOwnProperty('value_')) { // this is a Property
				node = new webkitjs.Property(val['value_'], name, this);
				if (val['lastMod_'])
					node.setLastMod(val['lastMod_']);
			}
			else { // This is a DataStore
				val = /** @type {Object.<*>} */ val;
				node = new webkitjs.DataStore(val, name, this);
			}
		}
		else {
			if (typeof val == 'string') {
				var exp;
				if (exp = val.match(/\${math:{([^}]+)}}/mi)) {
					node = new webkitjs.MathProperty(exp[1], name, this);
				}
				else if (exp = val.match(/\${bool:{([^}]+)}}/mi)) {
					node = new webkitjs.BooleanBindingProperty(exp[1], name, this);
				}
				else if (exp = val.match(/\${([^}]+)}/mi)) {
					node =  new webkitjs.BindingProperty(exp[1], name, this);	
				}
				else {
					node = new webkitjs.Property(val, name, this);
				}
			}
			else { // default to webkitjs.Property
				node = new webkitjs.Property(val, name, this);
			}
		}
		this.add_(name, node);
	}
};

/**
 * Check whether the store contains a given field
 * 
 * @param {string}	name
 * @returns {boolean}
 */
webkitjs.DataStore.prototype.hasField = function(name) {
	return this.data_.hasOwnProperty(name);
};

/**
 * Internal add method for values
 * 
 * @param {string}	name
 * @param {*}	o
 */
webkitjs.DataStore.prototype.add_ = function(name, o) {
	o.parentNode = this;
	this.data_[name] = o;
};
	


/**
 * Remove a field by name
 * 
 * @param {string} name The name of the field
 */
webkitjs.DataStore.prototype.removeField = function(name) {
	// TODO: also kill listeners etc
	this.data_[name].parentNode = null;
	this.data_[name] = null;
	delete this.data_[name];
};

/**
 * Get the name of the fields contained in this store
 * 
 * @returns {Array.<string>}
 */
webkitjs.DataStore.prototype.getFieldNames = function() {

	var keys = [];
	var data = this.data_;
	for ( var name in data) {
		if (Object.prototype.hasOwnProperty.call(data, name)) {
			keys.push(name);
		}
	}
	return keys;
};

/**
 * Convert store to JSON
 * 
 * @returns {Object.<*>}
 */
webkitjs.DataStore.prototype.toJson = function () {
	var o = {};
	for (var field in this.data_) {
		o[field] = this.data_[field].toJson();
	};
	return o;
};

/**
 * Get a field by name
 * 
 * @param {string}
 *            name The name of the field
 * @param {*=}
 *            oCreateValue This is used as the value if field need to be created
 *            (eg, to create a missing store in .getSelection)
 * @private
 * @returns {webkitjs.Property|webkitjs.DataStore}
 */
webkitjs.DataStore.prototype.getField = function(name, oCreateValue) {
	
	if (name == webkitjs.DataStore.s.PATH_SELECTION) {
		return this.getSelection();
	}
	else if (webkitjs.DataStore.REGEXP_PATH_DIVIDER.test(name)) {
		return this.findByPath(name);
	}
	else {
		var field = this.data_[name];
		if (field) {
			return field;
		}
		else {
			this.addField(name, oCreateValue);
			if (webkitjs.developerMode) // check to minimize impact of string concatenations and lookups when not in developer mode
				webkitjs.log(webkitjs.log.mode.INFO, 'Missing field "' + (this.parentNode && this.parentNode.name_ ? this.parentNode.name_+':': '') + this.name_ +':'+ name + '" was created with value: ' + oCreateValue); 
			return this.data_[name];
		}
	}
};

/**
 * Find a child field by path. A path is described as: 'foo:bar' or '*:bar' 
 * where * represents selection field
 * 
 * @param {string}	sPath
 * @returns {webkitjs.Property|webkitjs.DataStore}
 */
webkitjs.DataStore.prototype.findByPath = function (sPath) {
	var path = sPath.split(webkitjs.DataStore.s.PATH_DIVIDER).reverse();
	var o = this;
	while (o && path.length > 0) {
		o = o.getField(path.pop());
	}
	return o;
};

/**
 * Get the path to a child node. This method is used in events chain to figure
 * out the path to the node that triggered an event
 * 
 * @param {webkitjs.Property|webkitjs.DataStore}	o
 * @returns {Array.<webkitjs.Property|webkitjs.DataStore>}
 */
webkitjs.DataStore.prototype.getEventPath = function(o) {

	var sb = [ o.name_ ];
	while (o.parentNode && o.parentNode !== this) {
		sb.push(o.parentNode.name_);
		o = o.parentNode;
	}
	return sb.reverse().join(webkitjs.DataStore.s.PATH_DIVIDER);
};
