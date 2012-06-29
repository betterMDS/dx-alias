define([
	'dojo/parser',
	//'dojo/promise/instrumenting!report-unhandled-errors',
	'dojo/promise/instrumenting!report-unhandled-rejections',
	//'dojo/promise/instrumenting!report-rejections',
	'dojo/domReady!'
], function(parser){

	var complete = 0;
	var callback;

	console.log('dx-alias/parser');

	parser.parse().then(
		function(){
			console.log('completed parsing')
			complete = 1;
			if(!!callback) callback();
		},
		function(err){
		//	console.error('parse error:', err);
		})

	return {

		load: function(id, req, cb){
			if(complete){
				console.log('already completed parsing')
				setTimeout(cb, 1);
				//cb();
			}else{
				callback = function(){
					setTimeout(cb, 1);
					//cb();
				};
			}
			//return 0;

		},
		parse: function(){

		}
	}
});
