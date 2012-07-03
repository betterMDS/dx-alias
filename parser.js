define([
	'dojo/parser',
	'dojo/promise/instrumenting!report-unhandled-rejections',
	//'dojo/promise/instrumenting!report-rejections',
	'dojo/domReady!'
], function(parser){

	var complete = 0;
	var callback;

	parser.parse().then(
		function(){
			//console.log('completed parsing')
			complete = 1;
			if(!!callback) callback();
		},
		function(err){
			// should be caught.
			//	console.error('parse error:', err);
		})

	return {

		load: function(id, req, cb){
			if(complete){
				//console.log('already completed parsing')
				setTimeout(cb, 1);
			}else{
				callback = function(){
					setTimeout(cb, 1);
				};
			}
		},
		parse: function(){
			console.error('You do not have to call parse() on this AMD plugin.');
		}
	}
});
