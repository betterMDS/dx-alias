define([
	'./has',
	'./dom',
	'./on',
	'./log'
], function(has, dom, on, logger){

	var log = logger('FX', 1);
	var fx = {

		flyout: function(btnNode, displayNode, options){

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

			switch(type){
				case 'fade':
					show = function(){
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
