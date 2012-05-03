define([
	'dojo/_base/lang'
], function(lang){

	var
		_uidMap = {},
		uid = function(str){
			str = str || "id";
			if(!_uidMap[str]) _uidMap[str] = 0;
			_uidMap[str]++;
			return str+"_"+_uidMap[str];

		};

	return {

		uid:uid,
		bind:lang.hitch,
		hitch:lang.hitch,
		mix:lang.mixin,

		last: function(array){
			return array[array.length -1];
		},

		minMax: function(num, n1, n2){
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
