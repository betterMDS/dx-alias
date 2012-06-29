define([
	'./has',
	'./dom',
	'./on',
	'./log'
], function(has, dom, on, logger){
	//	summary:
	//		A module designed to contain unique effects. the only useful method
	//		is "flyout"; otherwise this is under development.
	//
	var log = logger('FX', 0);
	var fx = {

		flyout: function(/*DOMNode*/btnNode, /*DOMNode*/displayNode, /*Object*/options){
			//	summary:
			//		A helper method to control a flyout node via a button or
			//		other node. Think of a volume slider popping up when you
			//		mouse over the volume button.
			//	returns: undefined
			//
			//	btnNode:DOMNode
			//		The button that controls the flyout node.
			//	displayNode:DOMNode
			//		The node that appears when the button activates it.
			//	options:Object (all optional)
			//		onHide:Function
			//			The function to call when the mouseout or click-off
			//			resolves. If not passed, a native hide() is used.
			//		onShow:Function
			//			The function to call when the mouseover or click
			//			resolves. If not passed, a native show() is used.
			//		onover:Boolean?
			//			If true, the flyout shows on mouseover. If falsey, the
			//			flyout shows on click, and hides on click-off.
			//
			var onover = options.onover;

			var displayNodeIsOver = false, btnIsOver = false, tmr, showing = false;

			var hideIt = function(){
				showing = false;
				if(!!options.onHide){
					options.onHide();
				}else{
					dom.hide(displayNode);
				}

			}
			var showIt = function(){
				showing = true;
				if(!!options.onShow){
					options.onShow();
				}else{
					dom.show(displayNode);
				}
			}

			if(onover){
				on(displayNode, "mouseover", function(){
					displayNodeIsOver = true;
					showIt(displayNode);
					clearTimeout(tmr);
				});

				on(displayNode, "mouseout", function(){
					displayNodeIsOver = false;
					if(btnIsOver) return;
					tmr = setTimeout(function(){ hideIt(displayNode); }, 500);
				});


				on(btnNode, "mouseover", function(){
					btnIsOver = true;
					showIt(displayNode);
					clearTimeout(tmr);
				});

				on(btnNode, "mouseout", function(){
					btnIsOver = false;
					if(displayNodeIsOver) return;
					tmr = setTimeout(function(){ hideIt(displayNode); }, 500);

				});
			}else{

				on.multi(displayNode, {
					"mouseover": function(){
						displayNodeIsOver = true;
					},
					"mouseout": function(){
						displayNodeIsOver = false;
					}
				});

				on.multi(btnNode, {
					"click":function(){
						log('BTN CLK', displayNodeIsOver, showing)
						btnIsOver = true;
						if(displayNodeIsOver) return;
						if(showing){
							hideIt();
						}else{
							showIt();
						}

					},
					"mouseover": function(){
						btnIsOver = true;
					},
					"mouseout": function(){
						btnIsOver = false;
					}
				});

				on(document, "click", function(){
					if(!displayNodeIsOver && !btnIsOver){
						hideIt();
					}
				});
			}
		},

		transistion: function(node, type, options){
			//
			// under construction. Not ready for use.
			//
			options = options || {};
			var show, hide;
			var transition = has('transition');
			var duration = options.duration || 500;
			if(has('ie') && has('ie') < 9){
				type = 'ie';
			}
			switch(type){
				case 'fade':
					show = function(){
						log('show fade')
						dom.style(node, 'opacity', 1);
					};
					hide = function(){
						dom.style(node, 'opacity', 0);
					};
					if(options.hidden) hide();
					setTimeout(function(){
						dom.style(node, transition+"Property", 'opacity');
						dom.style(node, transition+"Duration", duration+"ms");
					}, 30);
					break;
				case 'ie':
					show = function(){
						log('show ie')
						dom.style(node, 'display', 'block');
					};
					hide = function(){
						dom.style(node, 'display', 'none');
					};
					if(options.hidden) hide();
					break;
			}

			return {
				show: function(){
					log('trans fade show', transition);
					show();
				},
				hide: function(){
					log('trans fade hide');
					hide();
				}
			}
		}
	};

	return fx;

});
