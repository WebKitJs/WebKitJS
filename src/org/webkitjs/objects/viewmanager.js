///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

// requires
goog.require('webkitjs.EventTarget');
goog.require('webkitjs.Application');
goog.require('webkitjs.ViewController');

// provide
goog.provide('webkitjs.ViewManager');

/**
 * The ViewManager singleton. 
 *  
 * @constructor
 * @extends	{webkitjs.EventTarget}
 * 
 * @param {webkitjs.DataStoreDataModel=}	oModel	the model that wraps the main data store
 */
webkitjs.ViewManager = function(oModel) {

	var singleton = webkitjs.ViewManager;
	if (singleton.instance_) {
		if(oModel)
			singleton.instance_.setModel(oModel);
		return singleton.instance_;
	}
	else {
		this.callSuper(webkitjs.EventTarget);
		this.bindings_ = {};
		
		// Model
		this.setModel(oModel);
		
		// Window
		this.applicationWindow_ = webkitjs.Application.getWindow();
		this.applicationWindow_.addListener('datachange', this.onViewDataChange_, this);
		this.applicationWindow_.addListener('statechange', this.onViewStateChange_, this);
		
		// View
		this.rootViewController_ = new webkitjs.ViewController;
		
		return singleton.instance_ = this;
	}
};
webkitjs.ViewManager.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.ViewManager, webkitjs.EventTarget);


/**
 * The ViewManager instance
 * 
 * @returns {webkitjs.ViewManager}
 */
webkitjs.ViewManager.getInstance = function() {
	return new webkitjs.ViewManager();
};

/**
 * The Data Model
 * 
 * @type {webkitjs.DataStoreDataModel}
 */
webkitjs.ViewManager.prototype.model_;
webkitjs.ViewManager.prototype.getModel = function() {
	return this.model_;
};
webkitjs.ViewManager.prototype.setModel = function(o) {
	this.model_ = o;
};

/**
 * The application window
 * @type {webkitjs.Component}
 */
webkitjs.ViewManager.prototype.applicationWindow_;

// Root View //

/**
 * The application root view.
 * All main views should be added to this one to use them in the application.
 * 
 * @type {webkitjs.ViewController}
 */
webkitjs.ViewManager.prototype.rootViewController_;

/**
 * Get the application root view
 * @returns {webkitjs.ViewController}
 */
webkitjs.ViewManager.prototype.getRootViewController = function () {
	return this.rootViewController_;
};

// Sub views //

/**
* Add a view to the application root view. If a state is passed, enable default
* handlers for show and hide of the view for that state.
* 
* @param {webkitjs.ViewController} view
* @param {string=} state
*/
webkitjs.ViewManager.prototype.addView = function(view,state) {
	// TODO: should we maintain a view registry?
	view.view_ = this.rootViewController_;
	if (state) {
		this.register(state, function() {
			view.show();
		}, function() {
			view.hide();
		});
	};
};


/**
* Remove a view from the application root view
* @param {webkitjs.ViewController} view
 * @param {string=} state
*/
webkitjs.ViewManager.prototype.removeView = function(view, state) {
	
	if (state) {
		this.clear(state, function() {
			view.show();
		}, function() {
			view.hide();
		});
	};
	
	view.view_ = null;
	delete view.view_;
};

// State //

/**
 * Register enter and leave handlers for a state. When registering the special
 * state 'default', the handlers will be run for all enter and leave events
 * 
 * @param {string} state State name, typically the section name
 * @param {Function} enter The enter handler function
 * @param {Function} leave The leave handler function
 */
webkitjs.ViewManager.prototype.register = function(state, enter, leave) {
	this.getRootViewController().getStateController().register(state, enter, leave);
};


/**
 * Clear enter and leave handlers for a state
 * 
 * @param {string} state State name, typically the section name
 * @param {Function} enter The enter handler function
 * @param {Function} leave The leave handler function
 */
webkitjs.ViewManager.prototype.clear = function(state, enter, leave) {
	this.getRootViewController().getStateController().clear(state, enter, leave);
};

/**
 * Get the current application view state
 * @returns {string}
 */
webkitjs.ViewManager.prototype.getState = function() {
	return this.getRootViewController().getState();
};

/**
 * Set the application view state
 * @param {string} state
 */
webkitjs.ViewManager.prototype.setState = function(state) {
	this.getRootViewController().setState(state);
};


// Event Handlers //

/**
 * Handler for data change events from the view
 * @param {webkitjs.dom.event} e
 */
webkitjs.ViewManager.prototype.onViewDataChange_ = function(e) {
	if (this.model_ && e && e.globalPath) {
		this.model_.set(e.globalPath, e.dataValue);
	}
};

/**
 * Handler for state change events from the view
 * @param {webkitjs.dom.event} e
 */
webkitjs.ViewManager.prototype.onViewStateChange_ = function(e) {
	var target = webkitjs.dom(e.target);
	var parents = target.parents();
	var view = null;

	if (target['component_']) {
		if (target['component_'].view_) {
			view = target['component_'].view_;
		}
	} else {
		parents.each(function() {
			if (this['component_']) {
				if (this['component_'].view_) {
					view = this['component_'].view_;
					// break out of the loop
					return false;
				}
			};
		});
	}

	if (view) {
		view.setState(e.viewState);
	}
	else {
		this.setState(e.viewState);
	}

};
