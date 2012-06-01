define([
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-prop",
	"dojo/on"
], function(domDom, domCon, domGeom, domClass, domStyle, domProp, on){
	//	summary:
	//		The export of this module is a collection of the most common Dojo DOM
	//		methods, making it less of a chore to look up wich AMD module needs
	//		to be pulled in to do a task, and also makes the AMD define more
	//		manageable. It shorter, finger-friendly names, and modified attributes
	//		to make things more versatile and easier to write.
	//
	//	returns: Function / Object
	//		Returns a module that is a function so that the oft-used
	//		dom-construct.create() can be shirtened to simply "dom()". Attached
	//		to the dom function are other methods such as dom.css.
	//
	//	description:
	//		The methods provided and their maps to the Dojo equivalents are:
	//			dom: dom-construct.create
	//			dom.center: none (TODO)
	//			dom.fit: none (TODOC)
	//			dom.byTag:none
	//			dom.show: none
	//			dom.hide: none
	//			dom.box: dom-geometry.getContentBox
	//			dom.pos: dom-geometry.position
	//			dom.css: dom-class.add and/or dom-class.remove
	//			dom.css.remove: dom-class.remove;
	//			dom.css.replace: dom-class.replace;
	//			dom.css.toggle: dom-class.toggle
	//			dom.style: dom-style.set and/or dom-style.get
	//			dom.place: dom-construct.place
	//			dom.selectable: dom.setSelectable;
	//			dom.byId: dom.byId;
	//			dom.destroy: dom-construct.destroy;
	//			dom.set = dom-prop.set;
	//			dom.get = dom-prop.get;

	var
		dom = function(/* String*/ tag, /*Object|String*/atts, /*DOMNode?*/node, /*String?*/place){
			//	summary:
			//		A more versatile and shorter way of creating nodes. It has
			//		a similar function signature to dom-construct.create, with
			//		the exception that if "atts" is a string, it is assumed to
			//		be a CSS className.
			//	tag: String
			//		The type of the node to create.
			//	atts: Object|String
			//		If a string, it will be assigned to the className. Else it
			//		should be an object with key-alue pairs that relate to the
			//		node's attributes.
			//		Shorter names can be used. 'css' can be used for 'className',
			//		and 'html' can be used for 'innerHTML'.
			//		Additional abilities are added to dx-alias.dom. If an 'on'
			//		key is passed, the value can be its own key values of
			//		event-methods. If 'selectable' is passed, the selectablity
			//		of the node can be controlled.
			//	node:DOMNode?
			//		The parent node to attach the new node to.
			//	place:String?
			//		The position to place the node
			//		Accepted string values are:
			//	|	* before
			//	|	* after
			//	|	* replace
			//	|	* only
			//	|	* first
			//	|	* last
			//
			var n, nm, attCss, attOn, attHtml, attStyle, attValue, attSelectable;

			if(atts){
				if(typeof(atts)=="string"){
					atts = {className:atts};

				}else{
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

	dom.byTag = function(/*String*/tag, /*DOMNode?*/node, /*Boolean?*/returnFirstOnly){
		//	summary:
		//		Essentially an alias for node.getElementsByTagName. Much easier
		//		to use than dojo.query which would be overkill for this task.
		//	returns: HTMLDOMCollection
		//
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

	dom.show = function(/*DOMNode|Array*/node, /*String|Boolean?*/opt){
		// summary:
		// 		Show a previously hidden node. Defaults to display:block
		// 	node:DOMNode|Array
		// 		The node to show. If an array, it should be an array of nodes to
		// 		show.
		// 	opt:String|Boolean?
		// 		Options. If a string, it is assumed to be the display type, such
		// 		as inline-block, or table-cell. If a Boolean, the node will be
		// 		shown or hidden - so that the display can be toggled. Note this
		// 		would only work for display:block. Other display types will have
		// 		to have a different toggle mechanism.
		//
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

	dom.hide = function(/*DOMNode|Array*/node){
		//	summary:
		//		Hide a node. Changes it to display:none. If an array of nodes
		//		are passed, they will all be hidden.
		//
		if(node && node instanceof Array){
			node.forEach(function(n){
				dom.hide(n);
			}, this);
			return;
		}
		node = dom.byId(node);
		node.style.display = 'none';
	};

	dom.box = function(/*DOMNode*/node, /*Object?*/options){
		//	summary:
		//		Shortcut to dom-geometry.getContentBox
		//	options: TODO
		//
		//	returns: Object
		//		Returns an object with width and height (w and h);
		//
		// 		TODO: allow options to ask for margin, padding, border
		// 		TODO: optionally ask for position
		// 		TODO: See if there is a way to cache computedStyle for perf
		//
		return domGeom.getContentBox(node);
	};

	dom.pos = function(/*DOMNode*/node, /*Boolean*/includeScroll){
		//	summary:
		//		Shortcut to dom-geometry.position
		//	returns: Object
		//		Returns width, height, and x and y coords.
		//
		return domGeom.position(node, includeScroll);
	};

	dom.css = function(/*DOMNode*/node, /*String*/className, /*Boolean?*/conditional){
		//	summary:
		//		Shortcut to dom-class.toggle
		//		Adds a className to a node. If the optional boolean is false
		//		or 0, the className will be removed from the node.
		//
		if(conditional === false || conditional === 0) return domClass.remove(node, className);
		return domClass.add(node, className);
	};

	dom.css.remove =
		//	summary:
		//		Shortcut to dom-class.remove
		domClass.remove;

	dom.css.replace =
		//	summary:
		//		Shortcut to dom-class.replace
		domClass.replace;
		
	dom.css.toggle =
		//	summary:
		//		Shortcut to dom-class.toggle
		domClass.toggle;

	dom.style = function(/*DOMNode*/node, /*Object|String*/prop, /*String|Number*/value){
		//	summary:
		//		Shortcut to dom-style.set and get
		//		Uses the Dojo pre 1.7 way of setting and getting a style.
		//
		if(value === undefined && typeof prop === 'string') return domStyle.get(node, prop);
		if(value === undefined) return domStyle.set(node, prop);
		return domStyle.set(node, prop, value);
	};

	dom.place =
		//	summary:
		//		Shortcut to dom-constr.place
		domCon.place;

	dom.selectable =
		//	summary:
		//		Shortcut to dom.setSelectable
		domDom.setSelectable;

	dom.byId =
		//	summary:
		//		Shortcut to dom.byId
		domDom.byId; // resolve null

	dom.destroy =
		//	summary:
		//		Shortcut to dom-constr.destroy
		domCon.destroy;

	dom.prop = function(/*DOMNode*/node, /*Object|String*/prop, /*String|Number?*/value){
		//	summary:
		//		Shortcut to dom-prop.set and get
		//		Uses the Dojo pre 1.7 way of setting and getting a node attribute.
		if(value === undefined && typeof prop === 'string') return domProp.get(node, prop);
		if(value === undefined){
			for(var nm in prop) domProp.set(node, nm, prop[nm]);
			return null;
		}
		return domStyle.set(node, prop, value);
	};


	return dom;

});
