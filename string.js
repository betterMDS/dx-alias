define([], function(){

	return {

		urlToObj: function(url){
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

		strToObj: function(str){
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

		trim: function(str){
			return !str ?
				str :
				str.trim ?
					str.trim() :
					str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		},

		normalize: function(v, delim){
			//console.trace(); console.log("value:", v)
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

		urlEscape: function(s){
			// blocks unicode chars
			var t = "";
			for(var i=0;i<s.length;i++){
				if(s.charCodeAt(i) < 255) t+=s.charAt(i);
			}
			return escape(t);
		},

		urlEncode: function(str){
			return encodeURI(this.trim(str).replace(" ", "+"));
			//encodeURIComponent
		}
	};
});
