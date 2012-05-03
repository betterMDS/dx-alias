define([
	'dojo/topic',
	'./lang'
], function(dojoTopic, lang){

	var topics = {};

	// TODO:
	//		Wire up groups
	//

	var topic = {

		sub: function(channel, ctx, method, group){
			if(!topics[channel]){
				topics[channel] = {};
			}
			var cb = lang.bind(ctx, method);
			var uid = lang.uid("sub");
			topics[channel][uid] = cb;

			return {
				remove: function(){
					delete topics[channel][uid];
				},
				pause: function(){
					this.cb = topics[channel][uid];
					topics[channel][uid] = function(){};
				},
				resume: function(){
					if(!this.cb) return;
					topics[channel][uid] = this.cb;
				}
			};
		},

		pub: function(channel){
			if(!topics[channel]) return;
			var args = Array.prototype.slice.call(arguments);
			args.shift();
			for(var nm in topics[channel]){
				topics[channel][nm].apply(null, args);
			}
		}

	};

	topic.sub.multi = function(obj, ctx, group){
		var subs = [];
		for(var nm in obj){
			subs.push(topic.sub(nm, ctx, obj[nm]), group);
		}
		return {
			remove: function(){
				subs.forEach(function(s){ s.remove(); });
			},
			pause: function(){
				subs.forEach(function(s){ s.pause(); });
			},
			resume: function(){
				subs.forEach(function(s){ s.resume(); });
			}
		}
	}

	// Make Dojo Topics work with util pub/sub
	dojoTopic.publish = lang.bind(topic, "pub");
	dojoTopic.subscribe = lang.bind(topic, "sub");


	return topic;
});
