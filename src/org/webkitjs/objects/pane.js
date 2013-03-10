// requires
goog.require('webkitjs.Component');
// provide
goog.provide('webkitjs.Pane');

/**
 * The base Pane class. A pane is a component that has sub-content, ie adding to
 * the pane adds to an element inside the pane.
 * 
 * @constructor
 * @extends {webkitjs.Component}
 * 
 * @param {webkitjs.dom|Element|string|undefined=} el An optional element to
 *            use for this pane
 */
webkitjs.Pane = function(el) {

	this.callSuper(webkitjs.Component, el);
	this.addListener('create', function() {

		this.rendered_ = true;
	}, this);
};
webkitjs.Pane.prototype = new webkitjs.Component;
webkitjs.extend(webkitjs.Pane, webkitjs.Component, 'webkitjs-pane');

/**
 * Identifier for the content area
 * 
 * @type {string}
 */
webkitjs.Pane.prototype.contentSelector_ = '.content-area';

/**
 * Default html for the class
 * 
 * @type {string}
 */
webkitjs.Pane.prototype.element_ = '<div><div class="content-area"></div></div>';

/**
 * Add a child to the content area.
 * 
 * @param {webkitjs.Component} o A component to add as child
 * @override
 */
webkitjs.Pane.prototype.add = function(o) {

	this.getElement().find(this.contentSelector_).first()
	        .append(o.getElement());
	o.parent_ = this;
};
/**
 * Remove a child from the content area.
 * 
 * @param {webkitjs.Component} o The component to remove as child
 * @override
 */
webkitjs.Pane.prototype.remove = function(o) {

	this.getElement().find(this.contentSelector_).remove(o.getElement());
};

// / Proxy functionality for Widgets that might be children of this pane:

/**
 * update children
 */
webkitjs.Pane.prototype.update = function() {

	var els = /** @type {webkitjs.dom} */
	this.getElement().find(this.contentSelector_).first().children();

	var comp = 'component_';
	// release the thread
	setTimeout(function() {

		els.each(function(i, o) {

			if (o[comp] && o[comp].update && o[comp].rendered_) {
				o[comp].update();
			}
		});
	}, 2);
};
