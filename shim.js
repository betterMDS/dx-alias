define(function(){

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

	return null; // sets environmental helpers, does not return anything
});
