// requires
goog.require('webkitjs.Object');
goog.require('webkitjs.dom');

// provide
goog.provide('webkitjs.TemplateManager');

/**
 * The Template Manager.
 * Populate this class with templates on the .templates_ member or pass a
 * selector to fetch them from the DOM.
 * 
 * Store templates in the DOM like this:
 * 	<div id="templates">
 *		<script class="vt-slider" type="text/html">
 *			<div></div>
 *		</script>
 *	</div>
 * 
 * 
 * @constructor
 * @extends {webkitjs.Object}
 * 
 * @param {string=} sSelector
 */
webkitjs.TemplateManager = function(sSelector) {

	var singleton = webkitjs.TemplateManager;
	if (singleton.instance_) {
		return singleton.instance_;
	} else {
		this.callSuper(webkitjs.Object);

		if (sSelector) {
			var templates = webkitjs.dom(sSelector || '#templates');
			var o = this.templates_ = {};
			templates.children().each(function() {
				o[this.className] = this.text;
			});
		}
		return singleton.instance_ = this;
	}
};
webkitjs.TemplateManager.prototype = new webkitjs.Object;
webkitjs.extend(webkitjs.TemplateManager, webkitjs.Object);


/**
 * The TemplateManager instance
 * 
 * @returns {webkitjs.TemplateManager}
 */
webkitjs.TemplateManager.getInstance = function() {
	return new webkitjs.TemplateManager;
};

/**
 * This should either be pre-populated with templates, or is populated from the
 * DOM if a selector is passed as an initial argument.
 * 
 * @type {Object}
 */
webkitjs.TemplateManager.prototype.templates_;

/**
 * Get a template by name
 * @param sName
 * @returns {string}
 */
webkitjs.TemplateManager.prototype.getTemplate = function (sName) {
	return this.templates_[sName];
};
