define([
	'dojo/_base/lang'
], function(lang){
	//	summary:
	//		The export of this module contains some common Dojo lang methods,
	//		generally using shorter names. It also contains some unique methods.
	//	returns: Object
	//
	//	description:
	//		The methods provided and their maps to the Dojo equivalents are:
	//			lang.bind: lang.hitch
	//			lang.mix: lang.mixin
	var
		_uidMap = {},
		uid = function(str){
			str = str || "id";
			if(!_uidMap[str]) _uidMap[str] = 0;
			_uidMap[str]++;
			return str+"_"+_uidMap[str];

		};

	return {

		uid:
			//	summary:
			//		Returns a unique ID. Accepts and optional string for a
			//		prefix.
			uid,

		bind:
			//	summary:
			//		Renames dojo.hitch.
			lang.hitch,

		hitch:
			//	summary:
			//		Shortcut to dojo.hitch.
			lang.hitch,

		mix:
			//	summary:
			//		Shortened name for dojo.mixin.
			lang.mixin,

		last: function(/*Array*/array){
			// 	summary:
			// 		Returns the last element of an array.
			return array[array.length -1];
		},

		minMax: function(/*Number*/num, /*Number*/n1, /*Number*/n2){
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
		}
	};

});
