

var profile = (function(){

	// the tag tests...
	var test = function(filename, mid){
			return /tests\//.test(mid);
		},

		copyOnly = function(filename, mid){
			var list = {
				"dx-alias/package.json":1,
				"dx-alias/html5":1
			};
			return (mid in list) || /resources\/[^.]+\.(?!css)/.test(mid);
		},

		ignore = function(filename, mid){
			var list = {
				"dx-alias/ani":1, // broken
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
