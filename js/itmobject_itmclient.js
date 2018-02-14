function itmobject_itmclient() {

	return {
		"className":"itmclient",
		"name":"ITMClient",
		"displayName":"ITMClient v0.1",
		"description":"Client to use, interact and retrieve status with ITMObjects,The Solution to control and manage anything with IT! ",
		"properties":{
		},
		"instances":{
         "connections":{
            "name" : "Connections",
            "className" : "ITMClientConnections",
            "displayName" : "Connections",
            "description" : "Client connections",
            "status" : "OK",
            "instances": {
               "itmserver-local":{
                  "handler":new ITMClient_json()
               }
            }
      }

		},
		"methods" : {
		}, 
		"status":"OK"
	}
}
