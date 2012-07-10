// under development. This code currently is not functioning.


(function(){

	var defaults = {
		dur:500
	};




	var JsAni = {
		increment:30,
		reversed:null,
		isForward:false,
		isReversed:true,
		init: function(){
			var o = this.options;
			//console.warn("JS ANIID:", this.id, this.shyid)
			this.to = {};
			this.from = {};
			//console.warn("CSS ANI", o.props);
			for(var nm in o.props){
				var u = o.props[nm].units;
				u = u===undefined?"px":u;
				if(nm == "opacity" || nm == "color") u = "";
				o.props[nm].units = u; // fix it if undefined
				this.to[nm] = o.props[nm].end + u;
				this.from[nm] = o.props[nm].beg + u;
			}
			//b.style(this.node, this.from);

			var ease = this.ease();
			var rease = this.reverseEase();
			var ms;

			this.handle //= b.timer(this, function(){


				this._currTime = new Date().getTime();
				ms = this.reversed ? this._endTime - this._currTime : this._currTime - this._begTime;
				var p = o.beg>o.end ? 1-(ms / this.duration) : ms / this.duration;
				p = b.minMax(p, 0, 1);

				this.update(this.reversed ? rease(p) : ease(p), ms);

				if(this._currTime >= this._endTime) {
					//log(o.props.bottom.beg, o.props.bottom.end, this)
					this.stop();
					b.style(this.node, this.reversed ? this.from : this.to); // ensure animated all the way\
					this.onEnd();
					o.onEnd && o.onEnd();
				}
			}, 10000, this.increment);
			log("JsAni", this)
			this.handle.pause();
		},
		update: function(p, ms){
			var o = this.options, num, s, e;
			obj = {};
			for(var nm in o.props){
				num = b.minMax(o.props[nm].beg+((o.props[nm].end-o.props[nm].beg)*p), o.props[nm].beg, o.props[nm].end);
				obj[nm] = num + "" + o.props[nm].units;
				//log("Ani.update:", num, "/", obj[nm]);
			}
			b.style(o.node, obj);
		},

		onEnd: function(){},


		play: function(){
			var handle = {
				then: function(cb){
					cb && cb();
				}
			};
			b.once(this, 'onEnd', handle, 'then');
			if(!this.playing){
				this.isReversed = false;
				this.isForward = false;
				this._begTime = new Date().getTime();
				this._endTime = this.duration+this._begTime;
				this.handle.resume();
			}
			return handle;
		},
		stop: function(){
			this.handle.pause();
			this.isReversed = this.reversed;
			this.isForward = !this.reversed;
			log("stop: rev:", this.isReversed, "for", this.isForward, "reveresed:", this.reversed)
			this.playing = false;
		},

		forward: function(){
			log("forward:", this.isForward)
			if(this.isForward) return null;
			this.reversed = false;
			return this.play();
		},
		reverse: function(){
			log("reverse:", this.isReversed);
			if(this.isReversed) return null;
			this.reversed = true;
			return this.play();
		},
		toggle: function(){
			this.reversed = !this.reversed;
			this.play();
			/*
			 UNTESTED!

			 return;

			if(this.reversed === null){
				this.reversed = false;
				if(!this.playing) this.handle.resume();
				return;
			}
			this.reversed = !this.reversed;
			var c = this._currTime;
			var s = this._begTime;
			var e = this._endTime;
			this._begTime = c - (e-c);
			this._endTime = c + (c-s);
			if(!this.playing) this.play();
			*/
		},

		easeTypes: {
			linear: function(n){
				return n;
			},
			easeIn: function(n){
				return Math.pow(n, 5);
			},
			easeOut:function(n){
				return n * (n - 5) * -1;
			},
			easeInOut: function(n){
				n = n * 2;
				if(n < 1){ return Math.pow(n, 3) / 2; };
				n -= 2;
				return (Math.pow(n, 3) + 2) / 2;
			}
		},
		easeType:"easeInOut",
		ease: function(t){
			this.easeType = t || "easeInOut";
			return this.easeTypes[this.easeType];
		},
		reverseEase: function(){
			switch(this.easeType){
				case "easeInOut": return this.easeTypes["easeInOut"];
				case "easeIn": return this.easeTypes["easeOut"];
				case "easeOut": return this.easeTypes["easeIn"];
			}
			return false;
		}
	};


	var CssAni = {
		init: function(){
			var o = this.options;
			//console.warn("CSS ANIID:", this.id, this.shyid)
			var transName = b.supports.transition();

			var properties = [];
			this.to = {};
			this.from = {};

			for(var nm in o.props){
				var u = o.props[nm].units;
				u = u===undefined?"px":u;
				if(nm == "opacity" || nm == "color") u = "";

				properties.push(nm);
				this.to[nm] = o.props[nm].end + u;
				this.from[nm] = o.props[nm].beg + u;
			}

			b.style(this.node, transName+"Property", properties.join(","));
			b.style(this.node, transName+"Duration", this.duration+"ms");

			b.on(this.node, b.supports.transitionevent(), this, function(){
				//console.warn("ON-ENDED!");
				this.playing = false;
				this.onEnd();
				o.onEnd && o.onEnd();
			});

			log("CssAni trans:", transName, b.supports.transitionevent(), this);
		},
		onEnd: function(){

		},
		stop: function(){
			// TODO!
			b.style(this.node, b.supports.transition()+"Duration", "0ms");
			b.style(this.node, 'left', b.style(this.node, 'left') + 'px');
		},
		play: function(delay, propObj){
			clearTimeout(this._delayHandle);
			if(delay && !this.playing){
				this._delayHandle = setTimeout(b.bind(this, function(){
					b.style(this.node, propObj);
				}), delay);
			}else{
				//console.log('set prop:', propObj)
				b.style(this.node, propObj);
			}
			this.playing = true;
			log("SET ANI STYLE", propObj);

			var dur = this.duration;
			var handle = {
				then: function(callback){
					if(callback){
						b.timer(callback, dur);
					}
				}
			};
			b.once(this, 'onEnd', handle, 'then');
			return handle;
		},
		forward: function(delay){
			log("forward");
			return this.play(delay || this._toDelay, this.to);
		},
		reverse: function(delay){
			log("reverse");
			return this.play(delay || this._fromDelay, this.from);
		}
	};



	var Sub = b.supports.transition() ? CssAni : JsAni;

	b.Ani = b.def({
		shyid:"",
		handle:0,
		_delayHandle:0,
		_endTime:0,
		_begTime:0,
		_currTime:0,
		_fromDelay:0,
		_toDelay:0,
		playing: false,
		duration:500,

		Ani: function(options){
			var o = this.options = options;//b.mix(defaults, options, true); <- yikes! mixin messed with IE and caused new instance overwrites! why??
			this.id = b.uid("ani");

			var nm;
			// deleting props! May mess up the non-copy!
			this.node = o.node = b.byId(o.node);
			if(options.duration){
				this.duration = options.duration;
				delete options.duration;
			}
			if(options.to && options.to.delay){
				this._toDelay = options.to.delay;
				delete options.to.delay;
			}
			if(options.from && options.from.delay){
				this._fromDelay = options.from.delay;
				delete options.from.delay;
			}

			// Careful!
			// Webkit might not derive the "from" style itself - you may need to set it.

			if(options.to){
				o.props = {};
				for(nm in options.to){
					if(nm == "units") continue;
					if(nm == "delay") continue;
					o.props[nm] = {};
					o.props[nm].end = options.to[nm];
					if(options.from && options.from[nm] !== undefined){
						o.props[nm].beg = options.from[nm];
					}else{
						o.props[nm].beg = b.style(o.node, nm);
					}
				}
			}else{
				for(nm in o.props){
					if(o.props[nm].beg === undefined){
						o.props[nm].beg = b.style(o.node, nm);
					}
				}
			}

			log("Ani.props:", o.props); // opacity units is good here

			this.init();
		}
	}, Sub);


	bv.mix({
		ani: function(o){
			return new b.Ani(o);
		}
	});

	/*
	 USAGE
	 this.ani = b.ani({
		node:this.node,
		dur:300
	});

	 this.ani.to({
		onEnd:onEnd,
		init:this.initialize,
		left:x,
		top: listHeight - getImageContainer().h - options.bottom,
		width:this.cBox.w*p,
		height:this.cBox.h*p,
		marginTop:(this.cBox.h-(this.cBox.h*p))
	});
	*/

})();
