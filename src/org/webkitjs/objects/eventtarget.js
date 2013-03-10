///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.dom');
goog.require('webkitjs.Object');
//provides
goog.provide('webkitjs.EventTarget');

/**
 * The EventTarget class. Implements W3C style event listeners wrapping jQuery
 * event handling.
 *  
 * @constructor
 * @extends	{webkitjs.Object}
 */
webkitjs.EventTarget = function() {

	this.callSuper(webkitjs.Object);
};
webkitjs.EventTarget.prototype = new webkitjs.Object;
webkitjs.extend(webkitjs.EventTarget, webkitjs.Object);


/**
 * The actual object to fire and listen for events. Override the getter for
 * eg Components
 * @return {webkitjs.EventTarget}
 */
webkitjs.EventTarget.prototype.getTarget = function () {
	return this;
};

/**
 * An optional default scope to run event handlers in. Override the getter for
 * eg Components
 * @returns {*}
 */
webkitjs.EventTarget.prototype.getDefaultHandlerScope = function () {
	return;
};

/// Methods ///

/*
 * NOTE: addEventListener, removeEventListener and dispatchEvent are renamed as
 * jQuery confuses objects with elements otherwise
 */

/**
 * Add event listener. 
 * @param	{string|Array}	sType	The type of event to listen for. 
 * 											eg'click'. Can be either string or 
 * 											an array of strings
 * @param	{Function}	fHandler	The handler function to call 
 * @param	{webkitjs.EventTarget|Object|Element|undefined=}	oScope	Optional scope for handler
 */
webkitjs.EventTarget.prototype.addListener = function(sType, fHandler, oScope) {
	
	var scope = oScope || this.getDefaultHandlerScope();
	if (scope) {
		fHandler = webkitjs.dom.proxy(fHandler, scope);
	}
	webkitjs.dom(this.getTarget()).on(sType, fHandler);
};

/**
 * Remove event listener
 * @param	{string|Array}	sType	The type of event to stop listening for.
 * @param	{Function}	fHandler	The handler function to remove
 */
webkitjs.EventTarget.prototype.removeListener = function(sType, fHandler) {
	// TODO: manage scope bound functions as well
	webkitjs.dom(this.getTarget()).off(sType, fHandler);
};

/**
 * Dispatch event.
 * @param	{?}	sType	The type of event to dispatch.
 */
webkitjs.EventTarget.prototype.triggerEvent = function(sType) {

	if (this.getTarget() instanceof webkitjs.Object) {
		
		webkitjs.dom(this.getTarget()).trigger(sType);
	
	}
	else
		webkitjs.dom(this.getTarget()).trigger(sType);
};
