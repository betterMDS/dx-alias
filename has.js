define([
	'dojo/has'
], function(has){
	// summary:
	// 		Provides has() tests.
	// 	description:
	// 		This module pulls in dojo/has and any test it provides. It is
	// 		suggested that you pull in this module into your own has module
	// 		to provide additional tests.
	//
	var d = document;
	var el = document.createElement('bv');
	var vid = d.createElement('video');
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

	has.add('mp4', function(){
		if(!has('video')) return false;
		return vid.canPlayType('video/mp4; codecs="avc1.42E01E"');
	});
	has.add('video/mp4', function(){
		return has('mp4');
	});

	has.add('ogg', function(){
		if(!has('video')) return false;
		return vid.canPlayType('video/ogg; codecs="theora"');
	});
	has.add('video/ogg', function(){
		return has('ogg');
	});

	has.add('webm', function(){
		if(!has('video')) return false;
		return vid.canPlayType('video/webm; codecs="vp8, vorbis"');
	});
	has.add('video/webm', function(){
		return has('webm');
	});

	has.add('video', function(){
		return !!vid.canPlayType;
	});

	return has;

});
