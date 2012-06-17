define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dx-alias/dom',
	'dx-alias/on'
],function(declare, _WidgetBase, _TemplatedMixin, dom, on){

	return declare('dx-alias.Widget', [_WidgetBase, _TemplatedMixin], {
		templateString:'<div></div>', //should be overwritten

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
