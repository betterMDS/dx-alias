define([], function(){
	//	summary:
	//		Not an alias to any Dojo modules (except trim). This contains all
	//		unique functionality.
	//
	return {

		urlToObj: function(/*String?*/url){
			//	summary:
			//		Converts an URL into an object.
			//	url:String?
			//		Some kind of URL. If undefined, uses current document URL.
			//	returns: Object
			//		protocol: http or https, etc
			//		host: the entire domain (and sub-domain if available)
			//		href: The entire URL
			//		hash: Any text after the # sign (if available)
			//		query: Any text after the ? sign (if available)
			//		filename: Name of the file pointed to (handy for images)
			//		ext: Extension of the file pointed to (handy for images)
			//		folder: path, minus filename and domain
			//		sameDomain: Boolean, if a passed URL is not in the same
			//			domain as the current document
			//
			var loc = location, q;
			url = url || loc.href;
			if(/\?|\#/.test(url)){
				q = url.split(/\?|\#/);
				url = q[0];
				q = q[1];
			}
			var o = {
				protocol:loc.protocol,
				host:loc.host,
				href:url
			}, parts;

			o.query = q ? this.strToObj(q) : {};

			if(/\:/.test(url)){
				url = url.replace('://', '/');
				parts = url.split('/');
				o.protocol = parts.shift();
				o.host = parts.shift();
				o.sameDomain = o.host == loc.host;
			}else{
				parts = url.split('/');
				o.sameDomain = true;
			}
			o.filename = parts.pop();
			o.ext = o.filename.split('.')[1];
			o.folder = parts.join("/");
			return o;
		},

		strToObj: function(/*String*/str){
			//	summary:
			//		Converts a string to an object. Similar to Dojo's fromQuery,
			//		but more, uh... specific to my needs :)
			//		Notably, it will normalize values (into numbers or booleans)
			//		and trim file names.
			//
			if(!str) return {};
			var delim = /&/.test(str) ? "&" : ",",
				eq = /=/.test(str) ? "=" : ":",
				o = {},
				a = str.split(delim);
			for(var i=0; i<a.length;i++){
				if(!/=/.test(a[i]) && !/=/.test(a[i])) continue;
				var pr = this.trim(a[i]).split(eq);
				if (pr[0]=="file"){
					o[this.trim(pr[0])] = this.normalize(a[i].substring(a[i].indexOf(eq)+1));
				}else{
		            o[this.trim(pr[0])] = this.normalize(this.trim(pr[1]));
				}
			}
			return o;
		},

		last: function(/*String*/ str, /*String?*/delineator){
			//	summary:
			//		Gets the last section of a delineated string
			//		default tries ".", "/", "," as delineation
			var r = /\.|\,|\//;
			delineator = delineator || r.exec(str);
			if(!delineator) return null;
			if(Array.isArray(delineator)) delineator = delineator[0];
			var a = str.split(delineator);
			return a[a.length-1];
		},

		trim: function(/*String*/str){
			// summary:
			// 		Everyone knows what this is.
			return !str ?
				str :
				str.trim ?
					str.trim() :
					str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		},

		normalize: function(/*Something*/v, /*String?*/delim){
			//	summary:
			//		Normalizes a value. Converts strings into numbers or
			//		booleans if applicable. Tests for an optional delimeter,
			//		and also commas, which will convert into an Array.
			//
			if(v == "true") return true;
			if(v == "false") return false;
			if(v.substring(0,1) == "0") return v; // 001 id
			if(Number(v) == v) return Number(v);
			if(/,/.test(v) && delim == "&"){ // this looks like object parsing and should be a different function
				v = v.split(",");
				for(var i=0;i<v.length;i++){
					v[i] = this.normalize(v[i]);
				}
			}
			return v;
		},

		urlEscape: function(/*String*/s){
			//	summary:
			// 		Blocks unicode chars
			var t = "";
			for(var i=0;i<s.length;i++){
				if(s.charCodeAt(i) < 255) t+=s.charAt(i);
			}
			return escape(t);
		},

		urlEncode: function(/*String*/str){
			// summary:
			// 		Shortcut for encodeURI, because I never remember the name
			// 		of it. :(
			return encodeURI(this.trim(str).replace(" ", "+"));
			//encodeURIComponent
		}
	};
});
