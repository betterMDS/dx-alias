define([
	'dojo/on',
	'dojo/aspect',
	'dojo/sniff',
	'dojo/_base/lang',
	'dojo/_base/event'
], function(dojoOn, aspect, has, lang, event){

	var
		WKADJUST = -20, // chrome still seems to scroll faster than Safari

		global = window,

		normalizeScroll = function(evt){
			var o = {
				type:"scroll",
				horizontal:0,
				vertical:0,
				x:0,
				y:0
			};
			if(evt.wheelDelta){
				// Safari
				if(evt.wheelDeltaX){
					o.horizontal = 1;
					o.x = Math.ceil(evt.wheelDeltaX/WKADJUST);
					o.wheelDeltaX = evt.wheelDeltaX;
				}else{
					o.vertical = 1;
					o.y = evt.wheelDeltaY/WKADJUST;
				}
			}else{
				if(evt.axis == evt.HORIZONTAL_AXIS){
					o.horizontal = 1;
					o.x = evt.detail;
				}else{
					o.vertical = 1;
					o.y = evt.detail;
				}
			}
			evt.scroll = o;
			return evt;
		},

		on =  function(target, event, ctx, scope, group){

			// mandating that there is always a target and event
			// may not be ctx though
			var fn;
			if(typeof ctx == 'function'){
				fn = ctx;
				group = scope;
			}else if(typeof ctx == 'string'){
				group = scope;
				scope = ctx;
				ctx = global;
			}
			fn = fn || lang.hitch(ctx, scope);

			if(typeof target == 'string'){
				target = document.getElementById(target); // race condition with dx-alias/dom

			}else if(!target.addEventListener && !target.attachEvent){ // need better checking here (emtters, objects with addEventListener)
				// an object, not a node
				return aspect.after(target, event, fn, true);
			}

			if(event == 'scroll'){
				event = has('ff') ? "DOMMouseScroll" : "mousewheel";
				return dojoOn.pausable(target, event, function(evt){
					fn(normalizeScroll(evt));
				});
			}

			if(event == 'press'){
				// TO PORT!
			}

			// TODO:
			// 	group
			// on-press
			// on-mouseleave, mouseenter
			return dojoOn.pausable(target, event, fn);
		};

		on.multi = function(target, obj, ctx, group){
			// example
			// 	|	on.multi(node, {
			// 	|		'mousedown':'onMouseDown',
			// 	|		'mouseup':this.onMouseUp
			// 	|	}, this);
			//
			var listeners = [];
			ctx = ctx || null;
			for(var nm in obj){
				listeners.push(on(target, nm, !!ctx?ctx:obj[nm], !!ctx?obj[nm]:null, group));
			}
			return {
				remove: function(){
					listeners.forEach(function(lis){ lis.remove(); });
				},
				pause: function(){
					listeners.forEach(function(lis){ lis.pause(); });
				},
				resume: function(){
					listeners.forEach(function(lis){ lis.resume(); });
				}
			};
		};

		on.once = function(target, event, ctx, method){
			var fn = lang.hitch(ctx, method);
			var handle = on(target, event, function(){
				handle.remove();
				fn.apply(null, arguments);
			});

		};

		on.selector = dojoOn.selector;
		on.stopEvent = event.stop; // move to dx-event?

		// on.group = {
		//		pause
		//		resume
		//}

	return on;
});
