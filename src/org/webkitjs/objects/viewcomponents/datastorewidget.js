///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.Widget');
goog.require('webkitjs.DataStore');
goog.require('webkitjs.DataStoreDataModel');
//provide
goog.provide('webkitjs.DataStoreWidget');

/**
 * The data store widget class. This class extends <code>webkitjs.widget</code> by 
 * adding support for connecting data to a data store rather than a simple 
 * object.
 * Templates should use a naming like this:
 * <code><div class="distance-value">${distance:value}</div></code>
 * 
 * Where <code>distance:value</code> equals the relative path from the store to
 * the field.
 *  
 * @constructor
 * @extends	{webkitjs.Widget}
 * 
 * @param {webkitjs.DataStore=}	oData	Optional data to use for rendering this Widget
 * @param {string=}	sTemplate	Optional template to use for rendering this Widget
 */
webkitjs.DataStoreWidget = function(oData, sTemplate) {

	this.callSuper(webkitjs.Widget, oData, sTemplate);

};
webkitjs.DataStoreWidget.prototype = new webkitjs.Widget;
webkitjs.extend(webkitjs.DataStoreWidget, webkitjs.Widget, 'webkitjs-data-widget');

/**
 * Strings for data store widget
 * 
 * @enum {string}
 */
webkitjs.DataStoreWidget.s = {
	DOT : '.',
	DASH:  '-',
	WHITESPACE: ' ',
	EMPTY_STRING: '',
	WHITESPACE_DOT: ' .'
};


/**
 * Override this method to implement your own handling of data mapping. The
 * default implementation looks up elements that have a class name like
 * "fieldname".
 * 
 * @param {string} sFieldName
 * @override
 * @returns {webkitjs.dom|Array}
 */
webkitjs.DataStoreWidget.prototype.getElementsForField = function(sFieldName) {

	/*
	 * use .foo-bar
	 */
	 var field = webkitjs.DataStoreWidget.s.DOT + sFieldName.replace(webkitjs.DataStore.REGEXP_PATH_DIVIDER, 
			webkitjs.DataStoreWidget.s.DASH);
	/*
	 * use .foo .bar
	 */
//	 var field = webkitjs.DataStoreWidget.s.DOT + sFieldName.replace(webkitjs.DataStore.REGEXP_PATH_DIVIDER, 
//				webkitjs.DataStoreWidget.s.WHITESPACE_DOT);
	return this.getElement().find(field);
};


/**
 * The data used for populating the Widget
 * @param	{webkitjs.DataStore} oData
 * 
 * @override
 */
webkitjs.DataStoreWidget.prototype.setData = function(oData) {

	if (this.data_ && this.data_.removeListener) {
		this.data_.removeListener('change', this.onDataChange);
	};
	var model = this.data_ = /** @type	{webkitjs.DataStoreDataModel}*/ new webkitjs.DataStoreDataModel(oData);
	if (oData) {
		model.addListener('change', this.onDataChange, this);
	};
	if (this.created_) {
		if (this.rendered_ && this.autoUpdate) {
			this.update();
		}
		else {
			this.render();
		}
	}
};


/**
 * Update the widget using the current data. Override this method to
 * implement your own handling, eg setting of attributes.
 * 
 * @override
 */
webkitjs.DataStoreWidget.prototype.update = function() {

	var fields = this.data_.getFieldNames();
	var l = fields.length;
	for ( var i = 0; i < l; i++) {
		this.setValue( fields[i], this.data_.get(fields[i]) );
	}
	// TODO: is this the right place for triggering event?
	this.triggerEvent('update');
};


/**
 * Parse the template, populating it with data and set the HTML of this Widget
 * to the result
 * 
 * @override
 */
webkitjs.DataStoreWidget.prototype.render = function() {

	var data = this.data_;
	var out = this.getTemplate().replace(/\${([^}]+)}/gm, function() {
		var s = arguments[1];
		var prop;
		if (prop = s.match(/([^\(]+)\(([^\)]+)\)$/)) { // *NOTE* only externalized properties can be called
			var obj = data.getFieldObject(prop[1]);
			return obj.getProperty(prop[2]);
		} else {
			return data.get(s) || webkitjs.DataStoreWidget.s.EMPTY_STRING;
		}
	});
	this.setHtml(out);
	this.rendered_ = true;
};


/**
 * Handler for model updates
 * 
 * @param {webkitjs.dom.event}	e
 */
webkitjs.DataStoreWidget.prototype.onDataChange = function(e) {

	/** @type {webkitjs.DataModel} */
	var model =  e.currentTarget;
	this.setValue(e.dataPath, model.get(e.dataPath));
};
