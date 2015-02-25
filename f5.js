F5 = {}

F5.nodeState = function(baseUrl, partition, nodeName) {
	var url = baseUrl + '/mgmt/tm/ltm/node/~' + partition + '~' + nodeName

	if(!Meteor.settings.f5) {
		throw new Meteor.Error(500, 'Please configure F5 settings.json')
	}

	var f5Auth = Meteor.settings.f5.user + ':' +  Meteor.settings.f5.password

	var f5Response = HTTP.call("GET", url, {
		timeout: 5000,
		auth: f5Auth
	})

	if(f5Response && f5Response.statusCode === 200) {
		return f5Response.data.state
	} else {
		throw new Meteor.Error(500, 'F5 call failed with error: ' + f5Response.status_txt)
	}
}

Meteor.methods({
	'f5NodeState': function(baseUrl, partition, nodeName) {
		return F5.nodeState(baseUrl, partition, nodeName)
	}
})
