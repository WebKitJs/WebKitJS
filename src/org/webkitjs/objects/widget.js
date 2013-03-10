// requires
goog.require('webkitjs.Component');
goog.require('webkitjs.TemplateManager');
//provide
goog.provide('webkitjs.Widget');

/**
 * The base Widget class. A widget is a component that typically holds 
 * Elements that are defined in a template. The content is rendered
 * from this template along with a data object that holds texts etc.
 * 
 * The template should have placeholders that correspond with the field names
 * in the data object. Eg a dataObject = { myFieldName: 'some text' } and a
 * template = <div>${myFieldName}</div> would result in <div>some text</div>
 * 
 * Setting the data at any later time is possible using css class names that
 * match the field names of the data object. Given the example above, the 
 * template would need to look like this in order to be able to both render, 
 * and update the text: <div class="myFieldName">${myFieldName}</div>
 * 
 * A more refined mapping of field names with elements can be 
 * achieved by overriding <code>webkitjs.Widget.prototype.getElementsForField</code>
 * In order to map also attributes etc, you should also override 
 * <code>webkitjs.Widget.prototype.update</code>.
 *  
 * @constructor
 * @extends	{webkitjs.Component}
 * 
 * @param {Object=}	oData	Optional data to use for rendering this Widget
 * @param {string=}	sTemplate	Optional template to use for rendering this Widget
 */
webkitjs.Widget = function(oData, sTemplate) {

	this.callSuper(webkitjs.Component);
	if (oData) {
		this.setData(oData);
	};
	if (sTemplate)
		this.template_ = sTemplate;
	this.addListener('create', this.onCreate, this);
};
webkitjs.Widget.prototype = new webkitjs.Component;
webkitjs.extend(webkitjs.Widget, webkitjs.Component, 'webkitjs-widget');


/**
 * Override this method to implement your own handling of data mapping.
 * The default implementation looks up elements that have a class name
 * like "fieldname".
 * @param {string} sFieldName
 * @returns {webkitjs.dom|Array}
 */
webkitjs.Widget.prototype.getElementsForField = function(sFieldName) {
	return this.getElement().find('.' + sFieldName);
};


/**
 * The template to use as content of the widget
 * @type {string}
 */
webkitjs.Widget.prototype.template_;
webkitjs.Widget.prototype.setTemplate = function(s) {

	// mark as open for rendering
	this.rendered_ = false;
	webkitjs.Widget.prototype.template_ = s;
};
webkitjs.Widget.prototype.getTemplate = function() {

	return this.template_ || webkitjs.TemplateManager.getInstance().getTemplate(this.cssClassName_);
};


/**
 * Whether the Widget should automatically update when setting data 
 * @type {boolean}
 */
webkitjs.Widget.prototype.autoUpdate = true;


/**
 * The data used for populating the Widget
 * @type	{Object} oData
 */
webkitjs.Widget.prototype.data_;
webkitjs.Widget.prototype.getData = function() {

	return webkitjs.Widget.prototype.data_;
};
webkitjs.Widget.prototype.setData = function(oData) {

	this.data_ = oData;
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
 * Update the widget using the current data object. Override this method to 
 * implement your own handling, eg setting of attributes.
 */
webkitjs.Widget.prototype.update = function () {
	var o = this.data_;
	for (var field in o) {
		this.getElementsForField(field).html( o[field] );
	}
	this.triggerEvent('update');
};


/**
 * Whether the Widget content has been rendered yet
 * @type {boolean}
 */
webkitjs.Widget.prototype.rendered_ = false;


/**
 * Parse the template, populating it with data and set the HTML of this 
 * Widget to the result
 */
webkitjs.Widget.prototype.render = function() {

	var o = this.data_;
	var out = this.getTemplate().replace(/\${([^}]+)}/gm, function() {

		return o[arguments[1]] || '';
	});
	this.setHtml(out);
	this.rendered_ = true;
};


/**
 * This overrides the default behavior of webkitjs.Componentprototype.create by
 * calling <code>render</code> after creation.
 */
webkitjs.Widget.prototype.onCreate = function() {

	this.render();
};


/**
 * Set the value for a field
 * @param {string} sField
 * @param {*} oValue
 */
webkitjs.Widget.prototype.setValue = function (sField, oValue) {	
	if (this.created_) {
		if (this.rendered_ && this.autoUpdate) {
			this.getElementsForField(sField).html( oValue );
		}
	}
};


/**
 * Get the value for a field.
 * @param {string} sField
 * @returns {*}
 */
webkitjs.Widget.prototype.getValue = function (sField) {
	if (this.created_) {
		return this.getElementsForField(sField).text();
	}
};
