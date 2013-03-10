///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.ViewController');

// provide
goog.provide('webkitjs.ModalView');

/**
 * A Modal View.
 * 
 * @constructor
 * @extends {webkitjs.ViewController}
 * 
 * @param {webkitjs.Component=} comp
 * @param {string=} state
 */
webkitjs.ModalView = function(comp, state) {

	this.callSuper(webkitjs.ViewController);

	var body = new webkitjs.Component(webkitjs.dom('body'));

	var gp = this.glassPane_ = new webkitjs.Component;
	gp.addVisualState('webkitjs-glass-pane');
	this.add(gp, body);

	var win = this.window_ = new webkitjs.Pane;
	var closebutton = new webkitjs.Button('X', 'CLOSED');
	closebutton.addVisualState('close-button');
	win.add(closebutton);
	win.addVisualState('webkitjs-modal-window');
	this.add(win, body);

	if (comp)
		this.addContent(comp);

	if (state)
		this.handleState(state);
};
webkitjs.ModalView.prototype = new webkitjs.ViewController;
webkitjs.extend(webkitjs.ModalView, webkitjs.ViewController);

/**
 * The z index to use for modals
 * 
 * @type {number}
 */
webkitjs.ModalView.lastZ_ = 1000;

/**
 * 
 * @param {webkitjs.Component} comp
 */
webkitjs.ModalView.prototype.addContent = function(comp) {

	this.window_.add(comp);
};

/**
 * Set the state that should trigger showing the modal
 * 
 * @param {string} sState
 */
webkitjs.ModalView.prototype.handleState = function(sState) {

	var oThis = this;
	this.getStateController().register('OPEN', function() {

		oThis.show();
	}, function() {

		oThis.hide();
	});
};
/**
 * @override Extends the default behavior by setting an incrementing z-index to
 *           each component before showing it
 * 
 * *NOTE* To animate show/hide, create own classes for window and glasspane and
 * override show/hide on them
 * 
 */
webkitjs.ModalView.prototype.show = function() {

	for ( var c in this.data_) {
		this.data_[c].component.getElement().css({
			zIndex : webkitjs.ModalView.lastZ_++
		});
	}
	webkitjs.ViewController.prototype.show.call(this);
};
