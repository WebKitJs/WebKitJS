///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.EventTarget');
// provide
goog.provide('webkitjs.Component');

/**
 * The base Component class.
 * 
 * @constructor
 * @extends {webkitjs.EventTarget}
 * 
 * @param {webkitjs.dom|Element|string|undefined=} el An optional element to
 *            use for this component
 */
webkitjs.Component = function(el) {

	this.callSuper(webkitjs.EventTarget);
	if (el)
		this.element_ = el;
	this.initial_ = {
	    on : [],
	    state : []
	};
};
webkitjs.Component.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.Component, webkitjs.EventTarget,
        'webkitjs-component');

/**
 * Whether this Component has yet been created
 * 
 * @type {boolean}
 */
webkitjs.Component.prototype.created_ = false;

/**
 * HTML tag name to use as base for this Component
 * 
 * @type {string}
 */
webkitjs.Component.prototype.tagName_ = 'DIV';

/**
 * The actual object to fire and listen for events.
 * 
 * @returns {webkitjs.dom}
 * @override
 */
webkitjs.Component.prototype.getTarget = function() {

	return this.getElement();
};

/**
 * @override
 */
webkitjs.Component.prototype.addListener = function(sType, fHandler, oScope) {

	if (this.created_)
		webkitjs.EventTarget.prototype.addListener.call(this, sType,
		        fHandler, oScope);
	else {
		this.initial_.on.push({
		    type : sType,
		    handler : fHandler,
		    scope : oScope
		});
	}
};
// TODO: implement addDelegatedEvenListener, similar to jQuery .delegate!

/**
 * An optional default scope to run event handlers in.
 * 
 * @return {webkitjs.Component|Object|Element|undefined}
 * @override;
 */
webkitjs.Component.prototype.getDefaultHandlerScope = function() {

	return this;
};

/**
 * Css class name
 * 
 * @type {string}
 */
webkitjs.Component.prototype.cssClassName_;
// TODO: extend this to handle css inheritance
webkitjs.Component.prototype.getCssClassName = function() {

	return this.cssClassName_;
};

/**
 * The element associated with this component. This method always returns a
 * webkitjs.dom instance or undefined. This means that it exposes the full
 * jQuery API.
 * 
 * @returns {webkitjs.dom}
 */
webkitjs.Component.prototype.getElement = function() {

	if ( ! this.created_) {
		this.create();
	}
	/** @type {webkitjs.dom} */
	return this.element_;
};
webkitjs.Component.prototype.setElement = function(el) {

	el.prop('component_', this);
	this.element_ = el;
};

/**
 * Get the parent DOM element of this component if any
 * 
 * @returns {webkitjs.dom}
 */
webkitjs.Component.prototype.getParentElement = function() {

	return this.getElement().get(0).parent || undefined;
};

/**
 * Get the parent component
 * 
 * @returns {webkitjs.Component}
 */
webkitjs.Component.prototype.getParent = function() {

	return this.parent_;
};

/**
 * Add a component as a child of this one.
 * 
 * @param {webkitjs.Component} o A component to add as child of this one
 */
webkitjs.Component.prototype.add = function(o) {

	this.getElement().append(o.getElement());
	o.parent_ = this;
};

/**
 * Remove a child component from this one.
 * 
 * @param {webkitjs.Component} o The component to remove as child
 */
webkitjs.Component.prototype.remove = function(o) {

	this.getElement().remove(o.getElement());
};

/**
 * Create the component
 * 
 * @param {webkitjs.Component=} p optional parent
 * 
 */
webkitjs.Component.prototype.create = function(p) {

	if (this.created_)
		return;

	var el;

	if (this.element_) { // create from a fragment
		el = webkitjs.dom(this.element_);
	}
	else { // or, create from tag name
		el = webkitjs.dom(document.createElement(this.tagName_));
	}

	if ( ! el.hasClass(this.getCssClassName()))
		el.addClass(this.getCssClassName());

	this.setElement(el);
	this.created_ = true;
	this.create_();
	this.triggerEvent('create');
};

/**
 * Set initial properties
 * 
 * @private
 */
webkitjs.Component.prototype.create_ = function() {

	for ( var field in this.initial_) {
		switch (field) {
			case 'on' :
				this.addListeners_(this.initial_.on);
				break;
			case 'state' :
				this.addStates_(this.initial_.state);
				break;
			default :
				break;
		}
	}
};

/**
 * Set initial properties
 * 
 * @private
 * @param {Array} aListeners
 */
webkitjs.Component.prototype.addListeners_ = function(aListeners) {

	aListeners.forEach(function(o) {

		webkitjs.EventTarget.prototype.addListener.call(this, o.type,
		        o.handler, o.scope);
	}, this);

};

/**
 * Append this component to an element. This is used to insert a component in
 * the DOM tree.
 * 
 * @param {webkitjs.dom|Element|String} s The webkitjs.dom object to
 *            append to
 */
webkitjs.Component.prototype.appendTo = function(s) {

	webkitjs.dom(s).append(this.getElement());
};

/**
 * The text in the element
 * 
 * @returns {string}
 */
webkitjs.Component.prototype.getText = function() {

	return this.created_ && this.element_ && this.element_.text();
};
webkitjs.Component.prototype.setText = function(sText) {

	this.element_.text(sText);
};

/**
 * The HTML in the element
 * 
 * @returns {string}
 */
webkitjs.Component.prototype.getHtml = function() {

	return this.created_ && this.element_ && this.element_.html();
};
webkitjs.Component.prototype.setHtml = function(sHtml) {

	this.element_.html(sHtml);
};

/**
 * Inline CSS style for the element. An object of name-value pairs, eg. {
 * 'border','1px solid red' }
 * 
 * @param {Object} oStyle
 */
webkitjs.Component.prototype.setStyle = function(oStyle) {

	this.element_.css(oStyle);
};

/**
 * Add a visual state which for now really just adds to the CSS class names
 * 
 * @param {string} sState
 */
webkitjs.Component.prototype.addVisualState = function(sState) {

	if (this.created_) {
		this.element_.toggleClass(sState, true);
	}
	else {
		this.initial_.state.push(sState);
	}
};
/**
 * Add visual states
 * 
 * @param {Array.<string>} aState
 */
webkitjs.Component.prototype.addStates_ = function(aState) {

	aState.forEach(function(o) {

		this.addVisualState(o);
	}, this);
};
/**
 * Remove a visual state
 * 
 * @param {string} sState
 */
webkitjs.Component.prototype.removeState = function(sState) {

	this.element_.toggleClass(sState, false);
};

/**
 * Show the component *NOTE* override this method to implement transitions etc
 */
webkitjs.Component.prototype.show = function() {

	this.getElement().show();
};

/**
 * Hide the component *NOTE* override this method to implement transitions etc
 */
webkitjs.Component.prototype.hide = function() {

	this.getElement().hide();
};
