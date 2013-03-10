// requires
goog.require('webkitjs.EventTarget');
// provide
goog.provide('webkitjs.ApplicationCacheManager');

/**
 * This class implements a singleton that
 * wraps the native application cache API
 *  
 * @constructor
 * @extends	{webkitjs.EventTarget}
 */
webkitjs.ApplicationCacheManager = function() {
	var singleton = webkitjs.ApplicationCacheManager;
	if (singleton.instance_) {
		return singleton.instance_;
	}
	else {
		this.callSuper(webkitjs.EventTarget);
		return singleton.instance_ = this;
	};
};
webkitjs.ApplicationCacheManager.prototype = new webkitjs.EventTarget;
webkitjs.extend(webkitjs.ApplicationCacheManager, webkitjs.EventTarget);

// TODO: implement actual class

/**
* The ApplicationCacheManager instance
* @returns {webkitjs.ApplicationCacheManager}
*/
webkitjs.ApplicationCacheManager.getInstance = function() {
	return new webkitjs.ApplicationCacheManager();
};