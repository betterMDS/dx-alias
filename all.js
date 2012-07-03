define([

	'./shim',
	'./dom',
	'./fx',
	'./groups',
	'./has',
	'./lang',
	'./log',
	'./mouse',
	'./on',
	'./string',
	'./topic'

	// './parser!',	// plugin. Pull this in on your own.
	// './ani',		//under development
	// './Widget',	//if you use Widget, pull it in specifically.

], function(){ // look ma! No args!

	return require.argsToObject('dx-alias/all');

});
