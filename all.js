define([
	'./shim',
	'./dom',
	'./lang',
	'./log',
	'./mouse',
	'./on',
	'./string',
	'./fx',
	'./topic'
], function(){

	var dj = require.argsToObject('dx-alias/all');

	var log = dj.log('ALL', 1);

	//log('test dom:', dj.dom);
	log('test lang:', dj.lang);
	log('test mouse:', dj.mouse);
	//log('test on:', dj.on);
	log('test string:', dj.string);
	log('test fx:', dj.fx);
	log('test topic:', dj.topic);

	return dj;
});
