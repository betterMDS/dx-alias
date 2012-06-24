define([
], function(){
	//	summary:
	//		The export of this module contains some common language methods.
	//		A much more concise module compared to dojo.lang.
	//
	//	returns: Object
	//
	// TODO?: http://millermedeiros.github.com/amd-utils/math.html
	//
	var
		_uidMap = {},
		uid = function(str){
			str = str || "id";
			if(!_uidMap[str]) _uidMap[str] = 0;
			_uidMap[str]++;
			return str+"_"+_uidMap[str];

		},

		bind = function(ctx, func, dbg){
			if(typeof(func) == "string"){
				if(!func){ func = ctx; ctx = window; }
				return function(){
					ctx[func].apply(ctx, arguments); }
			}else{
				var method = !!func ? ctx.func || func : ctx;
				var scope = !!func ? ctx : window;
				return function(){ method.apply(scope, arguments); }
			}
		}

	return {

		uid:
			//	summary:
			//		Returns a unique ID. Accepts an optional string for a
			//		prefix.
			uid,

		bind:
			//	summary:
			//		Fixes the context of a function so "this" is correct.
			bind,

		hitch:
			//	summary:
			//		For those used to dojo.hitch.
			bind,

		last: function(/*Array*/array){
			// 	summary:
			// 		Returns the last element of an array.
			return array[array.length -1];
		},

		copy: function(o){
			//	summary:
			//		Makes a shallow copy of an object
			var o1 = {};
			for(var nm in o){
				if(typeof(o[nm]) == "object"){
					o1[nm] = this.copy(o[nm])
				}else{
					o1[nm] = o[nm]
				}
			}
			return o1;
		},

		isEmpty: function(o){
			//	summary:
			//		Check if an object has any properties,
			//		or if it's even there
			if(!o) return true;
			if(typeof o != 'object') return true;
			if(o.length) return !!obj.length;
			for(var nm in o) return false;
			return true;
		},

		mix: function(/*Object*/source1, /*Object*/source2, /*Object?*/opt){
			//	summary:
			//		Mixes two objects together.
			// 		Warning: not deep!
			// 	opt: Object
			// 			copy
			// 				Make a copy of source1 before mixing
			// 			notUndefined
			// 				Don't mix properties if undefined in source1
			opt = opt || {};
			if(opt.copy) source1 = this.copy(source1);
			var notUndefined = opt.notUndefined;
			for(var nm in source2){
				if(notUndefined && source1[nm] === undefined) continue;
				source1[nm] = source2[nm];
			}
			return source1;
		},

		clamp: function(/*Number*/num, /*Number*/n1, /*Number*/n2){
			//	summary:
			//		Returns the number if it is inbetween the min and the max.
			//		If it is over it returns the max, if under returns the min.
			//	Returns Number
			//
			//	TODO: May rename to clamp()
			//
			var min, max;
			if(n1 > n2){
				min = n2; max = n1;
			}else{
				min = n1; max = n2;
			}

			if(num < min) return min;
			if(num > max) return max;
			return num;

			return Math.max(num, Math.min(num, max));
		},

		timeCode: function(/*Number*/pos, /*String?*/format){
			// summary:
			// 		Converts a number into timecode, formatted as per the format
			// 		option.
			// 	NOTE:
			// 		This may get moved to a date module (if more date methods
			// 		are needed)
			//
			if (!isNaN(pos)){
				var tc, hh, mm, ss, mmss = ".0";
				if (Math.floor(pos) != pos){
					mmss = (((pos - Math.floor(pos)).toString()).substring(1, 3));
					pos = Math.floor(pos);
				}
				hh = Math.floor(pos / 3600);
				mm = Math.floor((pos - hh * 3600) / 60);
				ss = Math.floor(pos - (hh * 3600) - (mm * 60));

				if (hh < 10) hh = "0" + hh;
				if (mm < 10 && mm > 0) mm = "0" + mm;
				if (ss < 10) ss = "0" + ss;

				if(format == "h:m:s"){ // Silverlight madness
					return hh + ":" + mm + ":" + ss;
				}else if(format == "h:m:s.m"){
					return hh + ":" + mm + ":" + ss  + mmss;
				}

				// always return HH:MM:SS if greater than 1 hour.
				if (pos > 3600){
					tc = hh + ":" + mm + ":" + ss;// + mmss;
				}else if (format == 'ss_ms'){
					tc = mm + ":" + ss + mmss;
				}else if (format == "mm_ss"){
					tc = mm + ":" + ss;
				}else{
					tc = mm + ":" + ss + mmss;
				}
			}else{
				console.warn("toTimeCode failed: "+pos+" ::"+Number(pos))
				return "0:00";
			}
			return tc;
		}
	};

});
