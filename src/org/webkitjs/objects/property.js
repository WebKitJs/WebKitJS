// requires
goog.require('webkitjs.EventTarget');
// provide
goog.provide('webkitjs.Property');

/**
 * The base Property class.
 * 
 * @event beforechange
 * @event change
 * 
 * @param {*=} val	Optional initial value
 * @param {string|undefined=}	name	Optional name
 * @param {webkitjs.DataStore=}	parent	Optional parent for event propagation
 *  
 * @constructor
 * @extends {webkitjs.EventTarget}
 */
webkitjs.Property = function(val, name, parent) {
	this.callSuper(webkitjs.EventTarget);
	this.name_ = name;
	this.value_ = null;
	this.parentNode = parent;
	this.setUp(val);
	return this;
};
webkitjs.Property.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.Property, webkitjs.EventTarget);


// TODO: add validation
// TODO: add last modified

/**
 * Access types
 * 
 * @enum {number}
 */
webkitjs.Property.access = {
	NONE : 0,		// 0x000
	READ : 1,		// 0x001
	WRITE : 2,		// 0x010
	READ_WRITE : 3,	// 0x011
	EXEC : 4,		// 0x100
	READ_EXEC : 5,	// 0x101
	WRITE_EXEC : 6,	// 0x110
	READ_WRITE_EXEC : 7	// 0x111
};


/**
 * Access type. Defaults to 0x011
 * 
 * @type {webkitjs.Property.access}
 */
webkitjs.Property.prototype.access_ = webkitjs.Property.access.READ_WRITE;
webkitjs.Property.prototype.setAccess = function (v) {
	this.access_ = v;
};
webkitjs.Property.prototype.getAccess = function () {
	return this.access_;
};


/**
 * The name if this property
 * 
 * @type {string|undefined}
 */
webkitjs.Property.prototype.name_;
webkitjs.Property.prototype.setName = function (s) {
	this.name_ = s;
};
webkitjs.Property.prototype.getName = function () {
	return this.name_;
};


/**
 * Last modification time stamp
 * 
 * @type {number}
 */
webkitjs.Property.prototype.lastMod_;
webkitjs.Property.prototype.setLastMod = function (v) {
	this.lastMod_ = v;
};
webkitjs.Property.prototype.getLastMod = function () {
	return this.lastMod_;
};


/**
 * The value of the property
 * 
 * @type {*}
 */
webkitjs.Property.prototype.value_;

/**
 * Set up value.
 * 
 * @param {*} val 
 */
webkitjs.Property.prototype.setUp = function(val) {
		this.value_ = val;
};

/**
 * Convert property to JSON
 * 
 * @returns {Object.<*>}
 */
webkitjs.Property.prototype.toJson = function () {
	var o = { 'value_': this.get() };
	if (this.lastMod_)
		o['lastMod_'] = this.lastMod_;
	return o;
};

/**
 * Set value. Dispatches a <code>change</code> event
 * 
 * @param {*} val The value to set
 * @param {string=}	origin	Optional path of the setter
 */
webkitjs.Property.prototype.set = function(val, origin) {

	if (this.getAccess() & webkitjs.Property.access.WRITE) {
		if (!this.lastMod_) {
			if (webkitjs.developerMode)
				webkitjs.log(webkitjs.log.mode.INFO, 'the value "' + this.name_
				        + '" was initially defined and set to: "' + val + '"');
		};

		this.lastMod_ = (new Date) - 0;

		if (this.value_ != val) {
			this.value_ = val;
			this.triggerChangeEvent(origin);
			if (webkitjs.developerMode)
				webkitjs.log(webkitjs.log.mode.INFO, 'the value "' + this.name_
				        + '" was set to: "' + val + '"');
		}
	}
};

/**
 * Get value
 * 
 * @returns {*}
 */
webkitjs.Property.prototype.get = function() {
	if (this.getAccess() & webkitjs.Property.access.READ)
		return this.value_;
};


/**
 * Trigger a change event
 * 
 * @event {webkitjs.dom.event}
 *
 * @param {string=} origin Optional path of the setter
 * @param {string=} binding Optional path of a binding that triggered the value
 */
webkitjs.Property.prototype.triggerChangeEvent = function(origin, binding) {

	this.triggerEvent({
		type : 'change',
		origin : origin || this.getGlobalPath(),
		binding : binding
	});
};

/**
 * Get the path to from the top node. If the current node (this property) is
 * part of a selection, '*' is returned instead of that selection name. This is
 * to indicate that the value is part of a path that might change
 * 
 * *NOTE* This method is "externalized", ie it is set by it's string name to
 * preserve it for lookup also after compiling
 * 
 * @returns {string}
 */
webkitjs.Property.prototype.getGlobalPath = function() {
	if (true || !this.globalPath_) { // We always do this for now
		var o = this;
		var name;
		var parent = o.parentNode;
		if (parent && parent.selection_ && o.name_ == parent.selection_)
			name = webkitjs.DataStore.s.PATH_SELECTION;
		else
			name = o.name_;

		var sb = [ name ];
		var grandParent;
		while (o.parentNode && o.parentNode.name_) {
			grandParent = o.parentNode.parentNode;
			if (grandParent && grandParent.getSelection()
					&& o.parentNode.name_ == grandParent.getSelection().name_)
				name = webkitjs.DataStore.s.PATH_SELECTION;
			else
				name = o.parentNode.name_;
			sb.push(name);
			o = o.parentNode;
		}
		this.globalPath_ = sb.reverse().join(webkitjs.DataStore.s.PATH_DIVIDER);
	}
	// TODO: this path might change due to selections. Should we skip cache? 
	return this.globalPath_;
};
webkitjs.Property.prototype['getGlobalPath'] = webkitjs.Property.prototype.getGlobalPath;