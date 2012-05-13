define([
	'dojo/on',
	'dojo/aspect',
	'dojo/sniff',
	'dojo/_base/lang',
	'dojo/_base/event'
], function(dojoOn, aspect, has, lang, event){
	//	summary:
	//		The export of this module is a function, which also has other
	//		methods attached to it. This is a major combination of dojo.on and
	//		dojo.aspect. By default it also returns a pause-able handle. It also
	//		provides the following additional features:
	//
	//			There is a psuedo-scroll event. By passing 'scroll' as an
	//			event name, a normalized event will be passed for scrolling a
	//			node.
	//
	//			This module provides for a multiple connection, by passing an
	//			object with key-values that match up to event-functions.
	//
	//			Allows for a stringified method to be used with a context.
	//
	//			Allows for a string to be passed as an ID for a node.
	//
	//	description:
	//		The methods provided and their maps to the Dojo equivalents are:
	//			stopEvent: dojo/event.stop
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

		on =  function(/*DOMNode|String*/target, /*String*/event, /*Object|Function?*/ctx, /*Function|String*/scope, /*String*/group){
			//	summary:
			//		Combination dojo/on and dojo/aspect.
			//	target:DOMNode|String
			//		If a string, the node is retrived via dojo.byId
			//	event:String
			//		The event to listen to.
			//	ctx:Object|Function?
			//		Optionally pass the context (this). If no context is passed,
			//		this argument should be a Function.
			//	scope: Function|String
			//		The callback function. If a string, resolves to the method
			//		name in the context.
			//	group: TODO
			//
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

		on.multi = function(/*DOMNode|String*/target, /*Object*/obj, /*Object?*/ctx, /*String*/group){
			//	summary:
			//		A way of making multiple connections with one call.
			//	note:
			//		If context is used, all methods should resolve to that one
			//		context.
			// 	example
			// 		|	on.multi(node, {
			// 		|		'mousedown':'onMouseDown',
			// 		|		'mouseup':this.onMouseUp
			// 		|	}, this);
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
			//	summary:
			//		Connect then disconnect after it's been called once.
			//		
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
