function itmobject_itmclient_itmclient_instance_connections() {
	return {
		"connections" : {
			"name":"connections",
			"displayName":"Connections",
			"methods":{
				"new":{}
			},
			"instances":{
				"testJSONserver":{
					"name":"testJSONserver",
					"className":"itmClientJSON",
					"displayName":"JSON Host",
					"description":"Connect to JSON ITMServer",

					"methods":{
						"connect":{},
						"disconnect":{}
					},
					// Properties
					"properties": {
						"itmclient": {
							"value":"itmClientJSON"
						},
						"host":{
							"value":"127.0.0.1"
						},
						"port":{
							"value":"3000"
						}
					},
					"instances":{
						"instances":{
							"name":"instances",
							"className":"itmClientJSON",
							"displayName":"itmClient JSON instances",
							"description":"instances of itmClientJSON"
						}
					}
				}
			}
		}
	};
}

function itmobject_itmclient_itmclient_instance_configuration() {
	return {
		"configuration" : {
			"name":"configuration",
			"displayName":"Configuration"
		}
	};
}
function itmobject_itmclient_itmclient() {

	return {
		"className":"itmanagerclass",
		"name":"ITMClient",
		"displayName":"ITM Client",
		"description":"Welcome to this ITMClient",

		// Properties
		"properties":{
			"version":{
				"value":"0.1",
				"hint":"the ITMClient version number",
				"description":"this is the ITMClient version number, no need to change this",
				"match":"^[0-9]+.[0-9]+$"
			},
			"itmclientname":{
				"value":"SelfServicePortal",
				"hint":"the ITMClient product name",
				"description":"this is the ITMClient product name, can be something like SelfServicePortal",
				"match":"^[a-zA-Z]+$"
			},
			"selectedinstance":{
				"value":"a/b/c/d/e/f",
				"description":"this is a selected instancename",
				"match":"^[a-zA-Z/]+$"
			}
		},
	
		// Instances
		"instances":itmobject_itmclient_instance_connections(),

		"methods": {
			"login":{
				"hint":"Login Dialog",
				"description":"please enter your credentials",
				"parameters":{
					"username":{
						"value":"",
						"hint":"hint: type your username",
						"description":"enter your username",
						"match":"^[a-zA-Z]+$"
					},
					"password":{
						"value":"",
						"hint":"hint: type your password",
						"description":"enter your password",
						"match":"^[a-zA-Z]+$"
					},
					"token":{
						"value":"",
						"hint":"hint: MD5 security token",
						"description":"enter MD5 security token",
						"match":"^[a-zA-Z]+$"
					}
				}
			},
			"ClickMe":{
				"hint":"just a test button"
			}
		},
		"status": function(instance) { return "OK"+new Date().toLocaleString()}
	}
	
}
