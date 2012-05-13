define([
	'dojo/topic',
	'./lang'
], function(dojoTopic, lang){
	//	summary:
	//		A multi-featured version of dojo/topic, which allows for a context
	//		(this) to be passed and a stringified method. Also provides a way of
	//		subscribing to multiple topics. The handle is pauseable and resumable.
	//	note:
	//		dojo.topics are attached to this, so you can use this module and not
	//		miss any topics called from the traditional dojo/topic.publish
	//
	var topics = {};

	// TODO:
	//		Wire up groups
	//

	var topic = {

		sub: function(/*String*/channel, /*Object|Function*/ctx, /*String|Function*/method, /*String?*/group){
			//	summary:
			//		subscribe to a topic.
			//	returns:Object
			//		handle includes:
			//			remove
			//			pause
			//			resume
			//
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

		pub: function(/*String*/channel /*arguments*/){
			//	summary:
			//		Publish a topic. All arguments are passed. No arrays
			//		necessary.
			//
			if(!topics[channel]) return;
			var args = Array.prototype.slice.call(arguments);
			args.shift();
			for(var nm in topics[channel]){
				topics[channel][nm].apply(null, args);
			}
		}

	};

	topic.sub.multi = function(/*Object*/obj, /*Object?*/ctx, /*String?*/group){
		//	summary:
		//		Subscribe to multiple topics. The key-values in the object
		//		should match to the topic-method.
		//	note:
		//		If context is used, all methods should resolve to that one
		//		context.
		//	returns: Object
		//		Handle.
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
