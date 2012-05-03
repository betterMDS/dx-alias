

var profile = (function(){

	// the tag tests...
	var test = function(filename, mid){
			return /tests\//.test(mid);
		},

		copyOnly = function(filename, mid){
			return 0;
		},

		ignore = function(filename, mid){
			var list = {
				"dx-alias/timer.profile":1,
				"dx-alias/package.json":1,
				"dx-alias/README.md":1
			};
			var isIgnored = mid in list;
			//console.log('      isIgnored', isIgnored, mid);
			return isIgnored;
		},

		amd = function(filename, mid){
			var isAMD = !copyOnly(filename, mid) && !ignore(filename, mid) && /\.js$/.test(filename);
			//console.log(isAMD ? 'is AMD' :  'not AMD:', mid)
			return isAMD;
		};

	return {

		newlineFilter: function(s){
		   // convert all DOS-style newlines to Unix-style newlines
		   return s.replace(/\r\n/g, "\n").replace(/\n\r/g, "\n");
		},

		resourceTags:{
			ignore:ignore,
			test:test,
			copyOnly:copyOnly,
			amd:amd
		},

		// relative to this file
		basePath:".",

		// relative to basePath
		releaseDir:"./alias-deploy",

		packages:[
			{
				name:"dx-alias",
				location:"."
			}
		],

		layers:{
			"dx-alias/layer":{
				include:[
				]
			}
		}
	};

})();
