F5 = {}

var f5Initialize = function() {
	if(!Meteor.settings.f5) {
		console.log('Cannot find settings.json')
		throw new Meteor.Error(500, 'Please configure F5 settings.json')
	}
	if(!Meteor.settings.f5.user)
		console.log('Missing user parameter in settings.json')
	if(!Meteor.settings.f5.password)
		console.log('Missing password parameter in settings.json')

	return (Meteor.settings.f5.user + ':' +  Meteor.settings.f5.password)
}

F5.getNodeStats = function(baseUrl, partition, nodeName) {
	var url = baseUrl + '/mgmt/tm/ltm/node/~' + partition + '~' + nodeName + '/stats'
  var f5Auth = f5Initialize()
  var f5Response = HTTP.call("GET", url, {
		timeout: 5000,
		auth: f5Auth
	})

	if(f5Response && f5Response.statusCode === 200) {
    var entries = f5Response.data.entries
    return entries
	} else {
		console.log('F5 call failed with error: ', f5Response.status_txt)
		throw new Meteor.Error(500, 'F5 call failed with error: ' + f5Response.status_txt)
	}
}

F5.forceOffline = function(baseUrl, partition, nodeName) {
  var url = baseUrl + '/mgmt/tm/ltm/node/~' + partition + '~' + nodeName
  var f5Auth = f5Initialize()

  var f5Response = HTTP.call("PUT", url, {
    timeout: 5000,
    auth: f5Auth,
    data: {
      state: "user-down",
      session: "user-disabled"
    }
  })

  if(f5Response && f5Response.statusCode === 200) {
    console.log(f5Response)
  } else {
    console.log('F5 PUT failed with error: ', f5Response.status_txt)
    throw new Meteor.Error(500, 'F5 PUT failed with error: ', f5Response.status_txt)
  }
}

F5.enable = function(baseUrl, partition, nodeName) {
  var url = baseUrl + '/mgmt/tm/ltm/node/~' + partition + '~' + nodeName
  var f5Auth = f5Initialize()

  var f5Response = HTTP.call("PUT", url, {
    timeout: 5000,
    auth: f5Auth,
    data: {
      state: "user-up",
      session: "user-enabled"
    }
  })

  if(f5Response && f5Response.statusCode === 200) {
    console.log(f5Response)
  } else {
    console.log('F5 PUT failed with error: ', f5Response.status_txt)
    throw new Meteor.Error(500, 'F5 PUT failed with error: ', f5Response.status_txt)
  }
}

F5.getPoolStats = function(baseUrl, partition, poolName) {
  
}

// curl -sk -u admin:admin https://192.168.6.5/mgmt/tm/ltm/pool/testpool/members/~Common~192.168.101.11:8000/ \
// -H "Content-Type: application/json" -X PUT -d '{"state": "user-down", "session": "user-disabled"}'
