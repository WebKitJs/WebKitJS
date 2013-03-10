// requires
goog.require('webkitjs.EventTarget');
goog.require('webkitjs.Component');
// provide
goog.provide('webkitjs.Application');

/**
 * The Application singleton. 
 *  
 * @constructor
 * @extends	{webkitjs.EventTarget}
 */
webkitjs.Application = function () {
	var singleton = webkitjs.Application;
	if (singleton.instance_) {
		return singleton.instance_;
	}
	else {
		this.callSuper(webkitjs.EventTarget);
		var win = /** @type {Element}*/ window;
		this.window_ = new webkitjs.Component(win);
		this.window_.create();
		return singleton.instance_ = this;
	}
};
webkitjs.Application.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.Application, webkitjs.EventTarget);

/**
 * The application instance
 * @returns {webkitjs.Application}
 */
webkitjs.Application.getInstance = function () {
	return new webkitjs.Application();
};

/**
 * The init method that is called as soon as all document resources are ready.
 * 
 * Override this method to define your own application start
 * 
 * @returns {?}
 */
webkitjs.Application.prototype.init = function () {
	return this;
};

/**
 * The current window
 * @type {webkitjs.Component}
 */
webkitjs.Application.prototype.window_;

/**
 * The current window
 * @returns {webkitjs.Component}
 */
webkitjs.Application.getWindow = function () {
	return webkitjs.Application.getInstance().window_;
};

/*
 * Set a documentready handler to call init
 */
webkitjs.dom(function() {
	
	var instance = new webkitjs.Application();
	// Call init in the scope of the application instance
	instance.init();
	instance.initiated_ = true;
});