// HTML5 SHIV
// 	Important note:
// 		The dx-alias/shim version of this code doesn't load in time for the
//		DOM when using the async loader.
// 		During dev use this file loaded in a script tag.
// 		For prod, the built JS will load sync, and dx-alias/shim will work
//		in time.
//
var a = document.createElement('a');
a.innerHTML = '<xyz></xyz>';
if(!('hidden' in a)){
	try{
		var n = ("abbr,article,aside,audio,canvas,datalist,details," +
		"figure,footer,header,hgroup,mark,menu,meter,nav,output," +
		"progress,section,time,video").split(',');
		for (var i = 0; i < n.length; i++) {
			document.createElement(n[i]);
		}
	}catch(e){
		console.error("ERROR:", e);
	}
}
