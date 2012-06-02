define(function(){
	//	summary:
	//		A shim to make older browsers behave more like modern browsers.
	//		While this obviously means IE, it also means not-so-old Webkit
	//		browsers that did not yet have Function.bind.
	//	returns: null
	//		This is not a module. It adds functionality to native JavaScript
	//		objects.
	//	description:
	//		The methods added are:
	//			Function.bind
	//			Array.forEach
	//			Array.some
	//			Array.indexOf
	//			Array.isArray
	//	TODO: Add remaining Array methods.
	//
	if(!Function.prototype.bind){
		Function.prototype.bind = function (oThis) {
			// from Mozilla
			if (typeof this !== "function") {
			  // closest thing possible to the ECMAScript 5 internal IsCallable function
			  throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var fSlice = Array.prototype.slice,
				aArgs = fSlice.call(arguments, 1),
				fToBind = this,
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP
										 ? this
										 : oThis || window,
									   aArgs.concat(fSlice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		}
	}

	if(!([]).forEach){

		Array.prototype.forEach = function(fn, ctx){
			ctx = ctx || window;
			var f = fn.bind(ctx);
			for(var i=0;i<this.length;i++){
				f(this[i], i, this);
			}
		}

		Array.prototype.some = function(fn, ctx){
			ctx = ctx || window;
			var f = fn.bind(ctx);
			var i, len = this.length;
			for(i=0;i<len;i++){
				if(f(this[i], i, this)) return true;
			}
			return false;
		}

		Array.prototype.indexOf = function(elem){
			var i, len = this.length;
			for(i=0;i<len;i++){
				if(this[i] == elem) return i;
			}
			return -1;
		}
	}

	if(!Array.isArray){
		Array.isArray = function(item){
			return item && typeof item == 'object' && item instanceof Array;
		}
	}

	require.argsToObject = function(mid){
		var module = require.modules[mid];
		var name;
		var args = {};
		console.dir(module.deps);
		for(var i=0; i<module.deps.length; i++){
			var m = module.deps[i].mid;
			name = m.substring(m.lastIndexOf('/')+1, m.length);
			args[name] = module.deps[i].result;
		}
		return args;
	}

	return null; // sets environmental helpers, does not return anything
});
