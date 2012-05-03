define([
	'dojo/has'
], function(has){

	var d = document;
	var el = document.createElement('bv');
	var test_style = el.style;
	var cap = function(word){
		return word.charAt(0).toUpperCase() + word.substr(1);
	}
	var testcss = function(prop){
		var uc = cap(prop);
		var props = [
			prop,
			'Webkit' + uc,
			'Moz' + uc,
			'O' + uc,
			'ms' + uc,
			'Khtml' + uc
		];
		for(var nm in props){
			if(test_style[props[nm]] !== undefined) return props[nm];
		}
		return false;
	}


	has.add('transition', function(){
		return testcss('transition');
	});

	has.add('transform', function(){
		return testcss('transform');
	});

	has.add('transitionevent', function(){
			// don't know if testing for an event is very reliable. Sniff!
			if(has('opera')){
				return "OTransitionEnd";
			}else if(has('ff')){
				return "transitionend";
			}else if(has('webkit')){
				return "webkitTransitionEnd"; // small w? wTF!
			}
			return false;
	});

	return has;

});
