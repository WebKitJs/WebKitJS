///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.Component');

// provides
goog.provide('webkitjs.Button');

/**
 * The Button class.
 * 
 * @constructor
 * @extends {webkitjs.Component}
 * 
 * @param {string} label Button label
 * @param {string} state the state to set
 */
webkitjs.Button = function(label, state) {

	this.callSuper(webkitjs.Component, '<span></span>');
	this.addListener('click', this.onAction_, this);
	this.state_ = state;
	this.getElement().html(label);

};
webkitjs.Button.prototype = new webkitjs.Component;
webkitjs.extend(webkitjs.Button, webkitjs.Component, 'webkitjs-button');

/**
 * @param {webkitjs.dom.event} e
 * @returns {boolean}
 */
webkitjs.Button.prototype.onAction_ = function(e) {

	this.triggerEvent({
	    type : 'statechange',
	    viewState : this.state_
	});
	return false;
};
