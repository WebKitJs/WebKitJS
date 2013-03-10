// requires
goog.require('webkitjs.EventTarget');
goog.require('webkitjs.ViewStateController');

// provide
goog.provide('webkitjs.ViewController');

/**
 * The View Controller class. Implements an API for a view that is the logical 
 * grouping of a set of Components which are not necessarily children of the 
 * same parent.
 *  
 * @constructor
 * @extends	{webkitjs.EventTarget}
 */
webkitjs.ViewController = function() {
	this.callSuper(webkitjs.EventTarget);
	this.data_ = {};
	this.stateController_ = new webkitjs.ViewStateController(this);
};
webkitjs.ViewController.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.ViewController, webkitjs.EventTarget);

/**
 * The view state manager
 * @type {webkitjs.ViewStateController}
 */
webkitjs.ViewController.prototype.stateController_;
webkitjs.ViewController.prototype.getStateController = function () {
	return this.stateController_;
};

/**
 * Get the current application view state
 * @returns {string}
 */
webkitjs.ViewController.prototype.getState = function() {
	return this.getStateController().getCurrentState();
};

/**
 * Set the application view state
 * @param {string} state
 */
webkitjs.ViewController.prototype.setState = function(state) {
	this.getStateController().pushState(state);
};


/**
 * Add a component to the view
 * 
 * @param {!webkitjs.Component|webkitjs.ViewController} component
 * @param {webkitjs.Component=}	parent Optional parent element for lazy creation
 * @param {boolean=}	bHide Optionally hide the member. Defaults to true
 */
webkitjs.ViewController.prototype.add = function(component, parent, bHide) {

	var id = component.getId();
	component.view_ = this;
	this.data_[id] = {
	    component : component,
	    parent : parent,
	    show: !bHide
	};
};

/**
 * Remove a component from the view
 * @param {webkitjs.Component} c
 */
webkitjs.ViewController.prototype.remove = function (c) {
	var id = c.getId();
	this.data_[id].component.view_ = null;
	delete this.data_[id].component.view_;
	this.data_[id].component = null;
	delete 	this.data_[id].component;
	this.data_[id].parent = null;
	delete 	this.data_[id].parent;
	this.data_[id] = null;
	delete this.data_[id];
};

/**
 * Show view
 */
webkitjs.ViewController.prototype.show = function() {

	var obj;
	for ( var c in this.data_) {

		obj = this.data_[c];
		if (obj.parent && obj.component instanceof webkitjs.Component) {
			obj.parent.add(obj.component);
		}
		if (obj.show) {
			obj.component.show();
			this.triggerEvent('showview');
			this.created_ = true;
			
		}
		else {
			obj.component.hide();
			this.triggerEvent('hideview');
		}
	};
};

/**
 * Hide view
 */
webkitjs.ViewController.prototype.hide = function () {
	for (var c in this.data_){
		this.data_[c].component.hide();
		this.triggerEvent('hideview');
	};
};

