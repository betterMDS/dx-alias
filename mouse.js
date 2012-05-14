define([
	'dojo/sniff',
	'./lang',
	'./dom',
	'./on',
	'./log',
	'dx-timer/timer'
], function(has, lang, dom, on, logger, timer){
	//	summary:
	//		This module is used for tracking mouse movements.
	//	description:
	//		You can use this instead of dojo/dnd. Dojo/dnd assumes you have a
	//		node you wish to drag around, and this is not always the case.
	//		Think of a window scroll bar - you don't actually drag the handle
	//		because you can click on the bar and the handle goes to that spot.
	//	returns: Object
	//		Returns a handle with pause, resume and remove methods.
	//	event:Object
	//		This module will pass back the original DOMEvent with a mouse object
	//		attached. The mouse object contains:
	//		x/y: Float
	//			The mouse pos on the node
	// 		cx/cy: Float
	// 			The mouse pos on the node, constrained to not
	// 			be less than zero or greater than the width/height
	// 		px/py: Float
	// 			Percentage of x/y position across width/height of node
	// 		org: Object
	// 			Contains an x/y, which is always the original position of
	// 			the mousedown point.
	// 		dist: Object
	// 			Contains an x/y, which is the current distance from the
	// 			*original* point.
	// 		last: Object
	// 			Contains an x/y, which is the current distance from the
	// 			*last* point.
	//		type:String
	//			The type of event: zoom, down, up, move, dblclick, or click.
	// 		scale:Float
	// 			The amount of scale indicated by the touch gesture
	//		zoom:Boolean (or bit)
	//			A falsey switch of whether the touch event indicates a scale or
	//			zooming motion; from two fingers moving away from each other.
	//		move:Boolean (or bit)
	//			A falsey switch of whether the cursor moved
	//		down:Boolean (or bit)
	//			Whether or not the mouse is down.
	//		up:Boolean (or bit)
	//			Whether or not the mouse is up.
	//		click:Boolean (or bit)
	//			If this is a current click event (would only get fired once)
	//		dblclick:Boolean (or bit)
	//			A falsey switch of whether a double-click was detected.
	//	usage:
	//		| 	mouse.track(this.node, this, 'onMouse');
	//		| 	onMouse: function(evt){
	//		|		console.log(evt.mouse.dist.x);
	//		|	}
	//
	// TODO:
	// 		handle scroll
	// 		track "drag" and "move" seperately.
	//

	var log = logger('MSE', 0);

	var
		CLICKTIME = 400,
		DBLCLICKTIME = 400,
		trackers = {},
		org = {},
		last = {},

		Tracker = function(node, callback){

			this.uid = lang.uid('mouse');
			this.node = node;
			dom.selectable(node, false);
			this.begTime = 0;
			this.callback = callback;
			this.tmr = timer(true);

			this.init();

			on(this.node, 'scroll', function(evt){
				log('scroll', evt.scroll.x, evt.scroll.y)
			});

			this.handle = {
				pause: function(){
					this.dHandle.pause();
				},
				resume: function(){
					this.dHandle.resume();
				},
				remove: function(){
					this.dHandle.remove();
				}
			};
		};

		Tracker.prototype = {

			onEvent: function(evt, type){

				//log('type', type);

				var pos = this.getPos(evt, type);

				var x = pos.x - this.box.x;
				var y = pos.y - this.box.y;
				if(type == 'down'){
					org  = { x:x, y:y };
					last = { x:x, y:y };
				}

				var py = lang.minMax(y/this.box.h, 0, 1);
				var px = lang.minMax(x/this.box.w, 0, 1);

				var cx = this.box.w * px;
				var cy = this.box.h * py;

				evt.mouse = {
					// x/y: the mouse pos on the node
					x:x,
					y:y,

					// cx/cy: the mouse pos on the node, constrained to not
					// be less than zero or greater than the width/height
					cx: cx,
					cy: cy,

					// org: the original x/y that occurred on mousedown
					org:{
						x: org.x,
						y: org.y
					},

					// dist: the distance from the original point
					dist:{
						x: x - org.x,
						y: y - org.y
					},

					// last: distance from the last point
					last:{
						x: x - last.x,
						y: y - last.y
					},

					// px/py: percentage of x/y position across width/height of node
					px:     px,
					py:		py,

					scale:(type == 'zoom') ? evt.scale : 1,

					move:	type=='move',
					down:	type=='down',
					up:		type=='up',
					click:	type=='click',
					zoom:	type=='zoom',
					type:	type,

					dblclick:type=='dblclick'
				};

				if(type == 'move') last = { x:x, y:y };

				this.callback(evt);
			},

			onStart: function(evt){
				log('start', evt);
				var ping = this.tmr.ping();
				//log('beg ping:', ping);
				if(ping > 0 && ping < DBLCLICKTIME){
					this.onEvent(evt, 'dblclick');
					this.tmr.ping(true);
				}else if(ping > DBLCLICKTIME){
					this.tmr.ping(true);
				}
				this.started = 1;
				this.moved = 0;
				this.mHandle.resume();
				this.box = dom.pos(this.node);
				log('start', evt);
				this.onEvent(evt, 'down');
			},
			onMove: function(evt){
				log('move', evt);
				this.moved = 1;
				this.onEvent(evt, 'move');
			},
			onEnd: function(evt){
				if(!this.started) return; // iphone sends cancel without click
				this.started = 0;
				log('end', evt);
				this.mHandle.pause();
				this.onEvent(evt, 'up');

				var ping = this.tmr.ping();
				//log('end ping:', ping);
				if(!this.moved && ping < CLICKTIME){
					this.onEvent(evt, 'click');
				}

			},
			onGestureStart: function(evt){},
			onGestureEnd: 	function(evt){},
			onGesture:	 	function(evt){
				this.onEvent(evt, 'zoom');
			}
		};

		if(has('touch')){
			//
			// Mobile
			//
			Tracker.prototype.init = function(){

				this.dHandle = on.multi(this.node, {
					"touchstart":"onStart",
					"gesturechange":"onGesture",
					"gesturestart":"onGestureStart",
					"gestureend":"onGestureEnd"
				}, this);

				this.mHandle = on.multi(document, {
					"touchend":"onEnd",
					"touchcancel":"onEnd",
					"touchmove":"onMove"
				}, this);
				this.mHandle.pause();

				this.getPos = function(evt, type){
					// on touchend, there are no targetTouches
					if (type=='zoom' || evt.targetTouches.length < 1) return last;

					return {
						x:evt.targetTouches[0].clientX,
						y:evt.targetTouches[0].clientY
					};
				}
			};

		}else{
			//
			// Browser
			//
			Tracker.prototype.init = function(){
				this.dHandle = on(this.node, 'mousedown', this, 'onStart', this.uid);
				this.mHandle = on.multi(document, {
					'mousemove':'onMove',
					'mouseup':'onEnd'
				}, this, this.uid);
				this.mHandle.pause();

				this.getPos = function(evt){
					return {
						x:evt.clientX,
						y:evt.clientY
					};
				};


			};

		}



	var mouse = {
		track: function(node, ctx, scope){
			var callback = lang.bind(ctx, scope);
			var uid = lang.uid('mouse');
			trackers[uid] = new Tracker(node, callback);
			return trackers[uid].handle;
		}
	};

	return mouse;
});
