F5 = {}

var init = function(url, method, data) {
	if(!Meteor.settings.f5) {
		console.log('Cannot find settings.json')
		throw new Meteor.Error(500, 'Please configure F5 settings.json')
	}

  console.log(url, method, data)

	if(!Meteor.settings.f5.user)
		console.log('Missing user parameter in settings.json')
	if(!Meteor.settings.f5.password)
		console.log('Missing password parameter in settings.json')

  var auth = Meteor.settings.f5.user + ':' +  Meteor.settings.f5.password
  var response = HTTP.call(method, 'https://'+url, {
    timeout: 5000,
    auth: auth,
    data: data
  })

  if(response && response.statusCode === 200) {
    return response
  }
  else {
    return 'down' 
  }
}

F5.trafficGroupStats = function(instance) {
  var url = instance + '/mgmt/tm/cm/traffic-group/stats'
  var response = init(url, 'GET')
  if (response === 'down')
    return {status: 'down'}
  var entries = response.data.entries
  var keyArray = Object.keys(entries)

  for(var i=0; i < keyArray.length; i++) {
    var tg = keyArray[i].toLowerCase().split('/')[7].split('~')[4]
    if (instance == tg) {
      return {
        status: 'up',
        failoverState: entries[keyArray[i]].nestedStats.entries.failoverState.description
      }
    }
  }
}

F5.getInstanceStatus = function(instance) {
  var url = instance + '/mgmt/tm/ltm'
  var response = init(url, 'GET')
  //console.log('response: ', response)
}

F5.getAllNodesStats = function(instance) {
  var url = instance+ '/mgmt/tm/ltm/node/stats'
  var response = init(url, 'GET')
  //console.log('response: ', response)
  return response
}

F5.getNodeStats = function(instance, partition, nodeName) {
	var url = instance + '/mgmt/tm/ltm/node/~' + partition + '~' + nodeName + '/stats'
  var auth = init()
  var response = init(url, 'GET')
  //console.log('response: ', response)
  return response.data.entries
}

F5.forceOffline = function(instance, partition, nodeName) {
  var url = instance + '/mgmt/tm/ltm/node/~' + partition + '~' + nodeName
  var data = {
    state: "user-down",
    session: "user-disabled"
  }
  var response = init(url, 'PUT', data)
  //console.log('response: ', response)
  return response
}

F5.enable = function(instance, partition, nodeName) {
  var url = instance + '/mgmt/tm/ltm/node/~' + partition + '~' + nodeName
  var data = {
    state: "user-up",
    session: "user-enabled"
  }
  var response = init(url, 'PUT', data)
  //console.log('response: ', response)
  return response
}


