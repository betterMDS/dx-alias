define([
	'dojo/_base/declare',
	'dijit/registry',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dx-alias/dom',
	'dx-alias/on'
],function(declare, registry, _WidgetBase, _TemplatedMixin, dom, on){

	return declare('dx-alias.Widget', [_WidgetBase, _TemplatedMixin], {
		templateString:'<div></div>', //to be overwritten

		show: function(){
			dom.show(this.domNode);
		},

		hide: function(){
			dom.hide(this.domNode);
		},

		connectEvents: function(){
			this._connections.forEach(function(handle){ handle.resume(); }, this);
		},

		disconnectEvents: function(){
			this._connections.forEach(function(handle){ handle.pause(); }, this);
		},

		getObject: function(obj){
			return typeof obj == 'string' ? registry.byId(obj) : obj;
		},

		on: function(obj, event, ctx, method){
			this._connections = this._connections || [];
			var h = on(obj, event, ctx, method);
			this._connections.push(h);
			return h;
		},
		destroy: function(){
			this._connections.forEach(function(h){
				h.remove();
			})
			this.inherited(arguments);
		}

	});
});
