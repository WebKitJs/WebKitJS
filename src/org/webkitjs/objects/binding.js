///////////////////////////////////////////////////////////////////////////////
// WebkitJs Objects - Copyright (c) 2013 Niclas Norgren - niclas@n3g.net
// Released under the MIT license.
// http://opensource.org/licenses/MIT
///////////////////////////////////////////////////////////////////////////////

goog.provide('webkitjs.Binding');

/**
 * Data Binding
 * @typedef {{
 * 		obj: webkitjs.EventTarget,
 * 		model: webkitjs.DataModel,
 * 		field: String
 * }}
 */
webkitjs.Binding;


//////
// webkitjs.Widget
//

/**
* The data binding descriptor
* @type {webkitjs.Binding}	
*/
webkitjs.Widget.prototype.binding_;

webkitjs.Widget.prototype.setBinding = function (oBinding) {
	var mgr = webkitjs.DataStoreManager.getInstance();
	mgr.add(oBinding);
	this.binding_ = oBinding;
};

webkitjs.Widget.prototype.getBinding = function () {
	return this.binding_;
};

/**
* Add data binding for this instance
* @param	{webkitjs.DataModel}	oModel	The data model to bind to
* @param	{String}	sField	The field name to bind to in the data model
*/
webkitjs.Widget.prototype.addBinding = function(oModel, sField) {
	this.setBinding(/** @type {webkitjs.Binding} */
	{
		access : webkitjs.Property.access.READ_WRITE,
		obj : this,
		model : oModel,
		field : sField
	});
};




/**
 * Add Binding
 * 
 * @param {webkitjs.Binding}	oBinding	The data binding to add
 */
webkitjs.DataStoreManager.prototype.add = function(oBinding) {
	var access = oBinding.access;
	var obj = oBinding.obj;
	var model = oBinding.model;

	if (access & webkitjs.Property.access.WRITE) {
		obj.addListener('datachange', webkitjs.DataStoreManager.onDataChange_,
				oBinding);
	}
	if (access & webkitjs.Property.access.READ) {
		model.addListener('update', webkitjs.DataStoreManager.onModelDataChange_,
				oBinding);
	}
};

///**
// * Remove field
// * 
// * @param {String} name The name of the Field
// * 
// */
//webkitjs.DataStoreManager.prototype.remove = function (name, val) {
//	this.store_.removeField(name);
//};
/**
 * The handler for update events on binded components. The method should always
 * be run in the scope of the binding object
 * @param {object}	e	The event
 */
webkitjs.DataStoreManager.onDataChange_ = function (e) {
	var oThis = this;
	var o = oThis.obj;
	var val = o.getValue();
	var model = oThis.model;
	model.set(oThis.field, val);
};
/**
 * The handler for update events on binded data model. The method should always
 * be run in the scope of the binding object
 * @param {object}	e	The event
 */
webkitjs.DataStoreManager.onModelDataChange_ = function (e) {
	var val = e.dataValue;
	var field = e.dataField;
	var oThis = this;
	if (field == oThis.field) {
		var o = oThis.obj;
		o.setValue(val);	
	}
};

/**
 * The handler for update events
 * @param {object}	e	The event
 */
webkitjs.DataStoreManager.prototype.onDataChange_ = function (e) {
	var target = e.target;
	if (target instanceof webkitjs.EventTarget) {
		if (target.getBinding) {
			var binding = target.getBinding();
			var value = target.getValue();
			if (binding && binding.updateValue(value)) {
				target.setState('success');
			}
			else {
				target.setState('error');
			}
		}
		//console.log(e.dataValue + ' : ' + (e.lastDataMod - 0));
	}
	else {
		
	}
};