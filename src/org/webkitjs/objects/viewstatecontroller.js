// requires
goog.require('webkitjs.EventTarget');
// provide
goog.provide('webkitjs.ViewStateController');

/**
 * This class manages view state by providing a registry for handling 
 * entering and leaving states
 * 
 * @constructor
 * @extends {webkitjs.EventTarget}
 * 
 * @param {webkitjs.ViewController=}	oView	the view to manage state for
 */
webkitjs.ViewStateController = function(oView) {
	this.callSuper(webkitjs.EventTarget);
	this.registry_ = webkitjs.dom({});
	this.viewInstance_ = oView;
};
webkitjs.ViewStateController.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.ViewStateController, webkitjs.EventTarget);


/**
 * The registry object – the actual object throwing events and keeping 
 * listeners for enter and leave events
 * 
 * @type {webkitjs.dom}
 */
webkitjs.ViewStateController.prototype.registry_;

/**
 * The view to manage state for
 * 
 * @type {webkitjs.ViewController|undefined}
 */
webkitjs.ViewStateController.prototype.viewInstance_;

/**
 * The currently active state
 * 
 * @type {string}
 */
webkitjs.ViewStateController.prototype.currentState_;

/**
 * The previously active state
 * 
 * @type {string}
 */
webkitjs.ViewStateController.prototype.previousState_;

/**
 * Strings for ViewStateController
 * 
 * @enum {string}
 */
webkitjs.ViewStateController.s = {
	DEFAULT : 'default',
	UNDERSCORE_ENTER : '_enter',
	UNDERSCORE_LEAVE : '_leave',
	EMPTY_STRING: '',
	SLASH: '/',
	DOUBLE_DOT: '..',
	DOT: '.'
	
};

/**
 * Handler function for state change. Sets states to all views in the parent 
 * chain as needed
 * 
 * @param {string} state
 */
webkitjs.ViewStateController.prototype.pushState = function(state) {
	
	// create an array of the chain to the root view
	var chain = [];
	var o = this.viewInstance_;
	while (o) {
		chain.push(o);
		o = o.view_;
	};
	chain.reverse();

	// create an array of the state string
	var states = state.split(webkitjs.ViewStateController.s.SLASH);
	// trim the arrays to what is actually supposed to be updated
	switch (states[0]) {
	
	case webkitjs.ViewStateController.s.EMPTY_STRING:
		// start from top level (or state was empty?)
		// TODO: should we really use root for empty states?
		states = states.slice(1);
		break;

	case webkitjs.ViewStateController.s.DOUBLE_DOT:
		// step up one level for each "../"
		var index = 0;
		states.forEach(function(v, i, a) {
			if (v == webkitjs.ViewStateController.s.DOUBLE_DOT) {
				index = i;
			}
		});
		var items = index+1;
		states = states.slice(items); // take away 
		chain = chain.slice(-items-1);
		break;

	default:
		states = states.slice(-1);
		chain = chain.slice(-1);
		break;

	};
	
	/*
	 *  Simple logic to set state throughout the parent chain. 
	 *  Override this for more advanced options
	 */
	var l = chain.length;
	for (var i = 0;i<l;i++) {
		chain[i].getStateController().updateState(states[i]||null);
	};
};

/**
 * Trigger state change listeners
 * 
 * @param {string} state
 */
webkitjs.ViewStateController.prototype.updateState = function(state) {

	if (this.currentState_ === state) {
		return;
	}
	this.previousState_ = this.currentState_;
	if (this.previousState_) {
		this.registry_.trigger(this.getEventType_(this.previousState_, true));
		this.registry_.trigger(this.getEventType_(
				webkitjs.ViewStateController.s.DEFAULT, true));
	};

	this.currentState_ = state;

	if (this.currentState_) {
		this.registry_.trigger(this.getEventType_(this.currentState_, false));
		this.registry_.trigger(this.getEventType_(
				webkitjs.ViewStateController.s.DEFAULT, false));
	};
};

/**
 * Add listener
 * 
 * @param {string} type event name
 * @param {Function} handler The handler function to invoke
 */
webkitjs.ViewStateController.prototype.addListener_ = function(type, handler) {

	if (handler) {
		this.registry_.on(type, handler);
	} else {
		throw new Error('Missing handler function');
	}
};

/**
 * Remove listener.
 * 
 * *NOTE* When called without handler argument, all handlers for the state are
 * removed
 * 
 * @param {string} type event name
 * @param {Function} handler The handler function to remove
 */
webkitjs.ViewStateController.prototype.removeListener_ = function(type, handler) {

	if (handler) {
		this.registry_.off(type, handler);
	} else {
		this.registry_.off(type);
	}
};

/**
 * Helper for state event type names.
 * 
 * @param {string} state State name, typically the section name
 * @param {boolean} leave Whether this is an leave event
 * @returns {string}
 */
webkitjs.ViewStateController.prototype.getEventType_ = function(state, leave) {
	var type = leave ? webkitjs.ViewStateController.s.UNDERSCORE_LEAVE
			: webkitjs.ViewStateController.s.UNDERSCORE_ENTER;
	return state ? state + type : type;
};

/**
 * Register enter and leave handlers for a state. When registering the special
 * state 'default', the handlers will be run for all enter and leave events
 * 
 * @param {string} state State name, typically the section name
 * @param {Function} enter The enter handler function
 * @param {Function} leave The leave handler function
 */
webkitjs.ViewStateController.prototype.register = function(state, enter, leave) {

	if (enter) {
		var type = this.getEventType_(state, false);
		this.addListener_(type, enter);
	}
	if (leave) {
		var type = this.getEventType_(state, true);
		this.addListener_(type, leave);
	}

};

/**
 * Clear enter and leave handlers for a state
 * 
 * @param {string} state State name, typically the section name
 * @param {Function} enter The enter handler function
 * @param {Function} leave The leave handler function
 */
webkitjs.ViewStateController.prototype.clear = function(state, enter, leave) {

	if (enter) {
		this.removeListener_(state, enter);
	}
	if (leave) {
		this.removeListener_(state, leave);
	}
};

/**
 * Get the current state
 * 
 * @returns {string}
 */
webkitjs.ViewStateController.prototype.getCurrentState = function() {
	return this.currentState_;
};
