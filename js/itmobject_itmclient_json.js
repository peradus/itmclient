function itmobject_itmclient_json() {
	return {
		"className":"itmClientJSON",
		"name":"itmClientJSON",
		"displayName":"itmClientJSON",
		"description":"This ITMClient connects to remote ITMServer(s), specificy connection details in each connection",
		"properties":{
			"ITMClientJSON.ConnectTo":{
				"value":"http://127.0.0.1:3000/",
				"hint":"Type ITMServerJSON service URL, eg. http://remoteitmserver:1234",
				"description":"Enter remote URL to connect to JSON ITMServer",
				"match":"^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$"
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
			"Connect":{
				"description":"Connect to JSON Host"
			}, 
			"Disconnect":{
				"description":"Disconnect from a JSON Host"
			}
		},
		"status":"OK"
	}
}
