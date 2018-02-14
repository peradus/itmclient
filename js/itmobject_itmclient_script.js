function itmobject_itmclientjson() {

	return {
		"className":"itmClientJSON",
		"name":"itmClientJSON",
		"displayName":"itmClientJSON",
		"description":"This ITMClient connects to remote ITMServer(s), specificy connection details in each connection",
		"properties":{
			"ITMClientJSON.ConnectTo":{
				"value":"http://127.0.0.1:3000/",
				"hint":"Type ITMServerJSON service URL",
				"description":"enter remote URL to connect to JSON ITMServer",
				"match":""
			}
		},
		"instances":{
				"instances":{
					"name":"instances",
					"className":"itmClientJSON",
					"displayName":"instances",
					"description":"remote instances"
				}
		},
		"methods" : {
			"Connect":{}, 
			"Disconnect":{}
		},
	}
}
