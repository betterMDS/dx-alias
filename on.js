define([
	'dojo/on',
	'dojo/aspect',
	'./has',
	'./lang'
], function(dojoOn, aspect, has, lang){
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

		groups = {},
		addGroup = function(groupId, handle){
			if(!groups[groupId]) groups[groupId] = [];
			groups[groupId].push(handle);
		},

		on =  function(/*DOMNode|Object|String*/target, /*String|Object*/event, /*Object|Function?*/ctx, /*Function|String*/scope, /*String*/group){
			//	summary:
			//		Combination dojo/on and dojo/aspect.
			//	target:DOMNode|Object|String
			//		If a string, the node is retrived via dojo.byId
			//		If an object, aspect will be used
			//	event:String|Object
			//		The event or function to listen to.
			//		If this argument is an object, the flow passes to on.multi
			//	ctx:Object|Function?
			//		Optionally pass the context (this). If no context is passed,
			//		this argument should be a Function.
			//	scope: Function|String?
			//		The callback function. If a string, resolves to the method
			//		name in the context.
			//	group: String?
			//		All connections using a unique group ID can be paused,
			//		removed, or resumed via on.group() methods:
			//		on.group.pause('MyGroupId');
			//

			if(typeof event == 'object'){
				return on.multi(target, event, ctx, scope);
			}

			// mandate that there is always a target and event
			// may not be ctx though
			var
				fn,
				handle,
				_once = 0;
			if(typeof ctx == 'function'){
				fn = ctx;
				group = scope;
			}else if(typeof ctx == 'string'){
				group = scope;
				scope = ctx;
				ctx = global;
			}
			fn = fn || lang.bind(ctx, scope);

			if(typeof target == 'string'){
				// race condition, no access to dx-alias/dom
				target = document.getElementById(target);

			}else if(!target.addEventListener && !target.attachEvent){
				// ASPECT
				// an object, not a node
				var paused = 0;
				handle = aspect.after(target, event, function(){
					if(paused) return;
					if(_once) handle.remove();
					fn.apply(null, arguments);
				}, true);
				handle.once = function(){
					_once = 1;
				};
				handle.pause = function(){
					paused = 1;
				}
				handle.resume = function(){
					paused = 0;
				}
				if(group) addGroup(group, handle);
				return handle;
			}

			if(event == 'scroll'){
				event = has('ff') ? "DOMMouseScroll" : "mousewheel";
				return dojoOn.pausable(target, event, function(evt){
					fn(normalizeScroll(evt));
				});
			}

			if(event == 'press'){
				return on.press(target, fn); // group?
			}

			// TODO:
			// on-mouseleave, mouseenter

			handle = dojoOn.pausable(target, event, function(){
				if(_once) handle.remove();
				fn.apply(null, arguments);
			});
			handle.once = function(){
				_once = 1;
			};
			if(group) addGroup(group, handle);
			return handle;
		};

		on.multi = function(/*DOMNode|String*/target, /*Object*/obj, /*Object?*/ctx, /*String*/group){
			//	summary:
			//		A way of making multiple connections with one call.
			//	note:
			//		If context is used, all methods will bind to it.
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
				},
				once: function(){
					console.error('once() cannot be applied to a multiple connection.');
				}
			};
		};

		on.press = function(node, ctx, method, arg, group){
			//	summary:
			//		A pseudo event. When used, the passed method continues to
			//		fire as long as the button remains pressed.
			//		on(button, 'press', this, fireMachinegun);
			//
			var fn = lang.bind(ctx, method);
			var passArg = arg;
			var tmr, offHandle, downHandle;
			var tch = 0; //bv.supports.touch();
			var fire = function(evt){
				tmr = setInterval(function(){
					fn(evt);
				}, 20);
			}
			var stop = function(evt){
				offHandle.pause();
				clearInterval(tmr);
			}
			downHandle = on(node, tch ? "touchstart" : "mousedown", function(evt){
				on.stopEvent(evt);
				offHandle.resume();
				fire(evt);
			});
			offHandle = on(document, tch ? "touchend" : "mouseup", function(evt){
				on.stopEvent(evt);
				stop();
			});
			stop();

			if(group) addGroup(group, downHandle);

			return downHandle;
		};

		on.once = function(target, event, ctx, method){
			//	summary:
			//		Connect, then disconnect after it's been called once.
			//
			var fn = lang.bind(ctx, method);
			var handle = on(target, event, function(){
				handle.remove();
				fn.apply(null, arguments);
			});

		};

		on.group = {
			remove: function(groupId){
				groups[groupId].forEach(function(lis){ lis.remove(); });
			},
			pause: function(groupId){
				groups[groupId].forEach(function(lis){ lis.pause(); });
			},
			resume: function(groupId){
				groups[groupId].forEach(function(lis){ lis.resume(); });
			}
		}

		on.selector = dojoOn.selector;

		on.stopEvent = function(evt){
			evt = evt || window.event;
			if(!evt) return false;
			if(evt.preventDefault){
				evt.preventDefault();
				evt.stopPropagation();
			}else{
				evt.cancelBubble = true;
				evt.returnValue = false;
			}
			return false;
		};
	return on;
});
