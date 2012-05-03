define([
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-prop",
	"dojo/on"
], function(domDom, domCon, domGeom, domClass, domStyle, domProp, on){

	var
		dom = function(tag, atts, node, place){
			var n, nm, attCss, attOn, attHtml, attStyle, attValue, attSelectable;

			if(atts){
				if(typeof(atts)=="string"){
					atts = {className:atts};

				}else{
					if(atts.on){
						attOn = atts.on;
						delete atts.on;
					}
					for(nm in atts){
						if(nm == "on"){
							attOn = atts[nm];
							delete atts[nm];
						}else if(nm == "css"){
							atts.className = atts[nm];
							delete atts[nm];
						}else if(nm == "html"){
							atts.innerHTML = atts[nm];
							delete atts[nm];
						}else if(nm == "style"){
							attStyle = atts[nm];
							delete atts[nm];
						}else if(nm == "value"){
							attValue = atts[nm];
							delete atts[nm];
						}else if(nm == "selectable"){
							attSelectable = atts[nm];
							delete atts[nm];
						}
					}
				}
			}

			n = domCon.create(tag, atts, node, place);
			if(attStyle) domStyle.set(n, attStyle);
			if(attSelectable) domDom.setSelectable(n, attSelectable);
			if(attValue) n.value = attValue; // need this?
			if(attOn){
				for(nm in attOn){
					on(n, nm, attOn[nm]);
				}
			}

			return n;
		};

	dom.center = function(){
		//
		// experimental
		// - and TODO!
	};

	dom.fit = function(node){
		//
		// experimental
		//
		var a1 = arguments[1], a2 = arguments[2], w1, h1, w2, h2, m, nodebox = dom.box(node), w = nodebox.w, h = nodebox.h;
		if(typeof a1 ==="object" && a1.tagName){
			var box = dom.box(a1);
			w1 = box.w;
			h1 = box.h;
		}else{
			w1 = a1;
			h1 = a2;
		}

		var aspect = w1/w * h;
		var block = dom.style(this.domNode, 'display') == 'block';

		if(aspect > h1){
			h2 = h1;
			w2 = w * (h / h1);
			if(block){
				m = (-h2/2)+'px 0 0 '+(-w2/2)+'px';
			}else{
				m = '0px auto';
			}
			console.log('height', h, h1, h2, ' w', w);

		}else if(aspect < h1){
			console.log('width');
			w2 = w1;
			h2 = h * (w1 / w);
			if(block){
				m = (-h2/2)+'px 0 0 '+(-w2/2)+'px';
			}else{
				m = (h1-h2)+'px auto';
			}
		}else{
			console.log('SAME');
			w2 = w1; h2 = h1;
			m = '0';
		}

		console.log(dom.style(node, {
			width:w2+'px',
			height:h2+'px',
			margin:m
		}));

	};

	dom.byTag = function(tag, node, returnFirstOnly){
		if(!tag) return null;
		if(node === true){
			returnFirstOnly = true;
			node = document.body;
		}else{
			node = dom.byId(node);
		}
		var list = node.getElementsByTagName(tag);
		if(!list || !list.length) return [];
		if(returnFirstOnly) return list[0];
		return Array.prototype.slice.call(list);
		return list;
	};

	dom.show = function(node, opt){
		if(node && node instanceof Array){
			node.forEach(function(n){
				dom.show(n, opt);
			}, this);
			return;
		}
		if(opt===false){
			dom.hide(node); // allows for toggling
			return;
		}
		var display = typeof opt == 'string' ? opt : ''; // allows to reset to proper style, like inline-block
		node = dom.byId(node);
		node.style.display = display;
	};

	dom.hide = function(node){
		if(node && node instanceof Array){
			node.forEach(function(n){
				dom.hide(n);
			}, this);
			return;
		}
		node = dom.byId(node);
		node.style.display = 'none';
	};

	dom.box = function(node, options){
		// TODO: allow options to ask for margin, padding, border
		// TODO: optionally ask for position
		// See if there is a way to cache computedStyle for perf
		return domGeom.getContentBox(node);
	};

	dom.pos = function(node, includeScroll){
		return domGeom.position(node, includeScroll);
	};

	dom.css = function(node, className, conditional){
		if(conditional === false || conditional === 0) return domClass.remove(node, className);
		return domClass.add(node, className);
	};

	dom.css.remove = domClass.remove;
	dom.css.replace = domClass.replace;
	dom.css.toggle = domClass.toggle;

	dom.style = function(node, prop, value){
		if(value === undefined && typeof prop === 'string') return domStyle.get(node, prop);
		if(value === undefined) return domStyle.set(node, prop);
		return domStyle.set(node, prop, value);
	};

	dom.place = domCon.place;
	dom.selectable = domDom.setSelectable;
	dom.byId = domDom.byId; // resolve null
	dom.destroy = domCon.destroy;
	dom.set = domProp.set;
	dom.get = domProp.get;


	return dom;

});
