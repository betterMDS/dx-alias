define([

], function(){
	//	summary:

	var
		groups = {};

	return {
		add: function(groupId, handle){
			if(!groups[groupId]) groups[groupId] = [];
			groups[groupId].push(handle);
		},
		remove: function(groupId){
			groups[groupId].forEach(function(lis){ lis.remove(); });
		},
		pause: function(groupId){

			groups[groupId].forEach(function(lis){ lis.pause(); });
		},
		resume: function(groupId){
			groups[groupId].forEach(function(lis){ lis.resume(); });
		}
	}

});
