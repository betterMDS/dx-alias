define(function(){

	var ua = window.navigator.userAgent;

	window.bvConfig = {
		debug:1
	};

	var fixConsole = function(){
		if(window.bvConfig === undefined) window.bvConfig = {};
		if(bvConfig.nofixios) return;
		var dbg = window.debug || bvConfig.debug || /debug=true/.test(document.location.href) || false;
		bvConfig.loglimit = bvConfig.loglimit || 299;
		var count = bvConfig.loglimit;

		var common = "info,error,log,warn";
		var more = "debug,time,timeEnd,assert,count,trace,dir,dirxml,group,groupEnd,groupCollapsed,exception";

		var supportedBrowser = /Android/.test(ua);


		if(bvConfig.pageDebug || (supportedBrowser && bvConfig.androidDebug)){
			var loaded = false;

			if(!/Firefox/.test(ua)) window.console = {};
			var c = window.console;

			var node;

			var list = [];
			var cache = function(type, args){
				list.push({
					type:type,
					args:args
				});

			}
			var flush = function(){
				list.forEach(function(o){
					bv.dom('div', {css:"bvLog", innerHTML:o.type+":"+o.args}, node);
				});
				list = [];
			}

			common.split(",").forEach(function(n){
				(function(){
					var type = n;
					c[n] = function(){
						cache(type, Array.prototype.slice.call(arguments).join(" "));
					}
				})();

			});

			more.split(",").forEach(function(n){
				c[n] = function(){}
			});

			window.bvPageDebugger = function(){
				bv.ready(function(){
					node = bv.byId("bvDbg");
					flush();
				});
				bv.on("interval", function(){
					if(list.length) flush();
				}, 100);


			}


		}


		if(!window.console) {
			console = {};
			dbg = false;
		}

		var fixIE = function(){
			var calls = common.split(",");
			for(var i=0;i<calls.length;i++){
				var m = calls[i];
				var n = "_"+calls[i]
				console[n] = console[m];
				console[m] = (function(){
					var type = n;
					return function(){
						count--;
						if(count == 0){
							console.clear();
							count = bvConfig.loglimit;
						}//console._log("***LOG LIMIT OF "+bvConfig.loglimit+" HAS BEEN REACHED***");
						if(count < 1) return;
						try{
							console[type](Array.prototype.slice.call(arguments).join(" "));
						}catch(e){
							throw new Error("Error **consoleFix** Failed on log type "+type);
						}
					}
				})();
			}
			// clear the console on load. This is more than a convenience - too many logs crashes it.
			// (If closed it throws an error)
				try{ console.clear(); }catch(e){}
		}

		var fixMobile = function(){
			// iPad and iPhone use the crappy old Safari debugger.
			console._log = console.log;
			console.log = console.debug = console.info = console.warn = console.error = function(){
				var a = [];
				for(var i=0;i<arguments.length;i++){
					a.push(arguments[i])
				}
				console._log(a.join(" "));
			}
		}

		var hideCalls = function(str){
			var calls = str.split(",");
			for(var i=0;i<calls.length;i++){
				console[calls[i]] = function(){};
			}
		}


		if(dbg && /Trident/.test(ua)){
			fixIE();
			hideCalls(more);
		}else if(dbg && /iPad|iPhone/.test(ua)){
			fixMobile();
		}else if((/IE/.test(ua) && !/Trident/.test(ua)) || !dbg || !window.console){
			hideCalls(more+","+common);
		}
		//console.log("test log")
	}

	fixConsole();

	var hash = document.location.search+"#"+document.location.hash;
	var logit = /IE/.test(ua) ?
	function(args){
		console.log(Array.prototype.slice.call(args).join(" "));
	} :
	function(args){
		console.log.apply(console, args);
	};

	return function(name, enabled){
		var r = new RegExp(name);
		if(!r.test(hash) && (enabled === false || enabled === 0)) return function(){};
		return function(){
			var args = Array.prototype.slice.call(arguments);
			args.forEach(function(a,i){
				if(a && typeof a==="object" && a.tagName){
					args[i]=a.tagName.toLowerCase()+"#"+a.id;
				}
			}, this);
			args.unshift(" "+name+" ");
			logit(args);
		};
	};
});
