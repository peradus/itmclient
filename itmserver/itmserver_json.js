/* ****************************************************************************
 *  ITMServer_json.js
 *  itmserver json class, serving an ITMClient via HTTP/JSON protocol
 *
 * ****************************************************************************/

/* ****************************************************************************
 * DEPENDENCIES-BEGIN
 * link libraries, dynamic load javascripts, itmclient(s), itmobject(s) needed for this ITMServer
 * ****************************************************************************/
const util = require('util');

var jsDependencies=[
	"../js/itmclient_helpers.js",
	"../js/itmobject_itmclient_test.js",
	"../js/itmobject_itmclient_itmclient.js",
	"../js/itmclient_base.js",
	"../js/itmclient_test.js",
	"./itmserver_base.js"
];
loadDependencies(jsDependencies);

/* ****************************************************************************
 * DEPENDENCIES-END
 * ****************************************************************************/

/* ****************************************************************************
 * CONFIG-BEGIN
 * variabeles below can be changed to configure the itmserver
 * ****************************************************************************/

/* Enable debugging */
var _DEBUG=true;

/* ITMServer listens on port */
var _PORT=3000;

/* ITMServer serves this itmclient */
var _ITMCLIENT=new itmClient_test();

/* ****************************************************************************
 * CONFIG-END
 * ****************************************************************************/

/* ****************************************************************************
 * FUNCTIONS-BEGIN
 * ****************************************************************************/
function loadDependencies(dependencies) {
   var fs = require("fs");
   var vm = require('vm');

   dependencies.forEach(function (loadScript) { 
      console.log("loadDependencies: ["+loadScript+"]");
      vm.runInThisContext(fs.readFileSync(loadScript))
   });
}

/* ****************************************************************************
 * FUNCTIONS-END
 * ****************************************************************************/

/* ****************************************************************************
 * ITMSERVER_JSON OBJECT-BEGIN
 * ****************************************************************************/
function ITMServer_json(itmclient,listenport) {
	this._debug = true;
	this._debugModule="ITMServer_json";

	var thisITMServer=this;
	var thisITMClient=itmclient;
	
	this.debugMessage("Starting ITMServer");

	/* Setup itmclient, link itmclient debugging to itmserver debugging */
	itmclient._debug=this._debug;
	itmclient.debugMessage=function(msg){
		thisITMServer.debugMessage('ITMClient|'+msg);
	}

	/* Output ITMClient details  */
	this.debugMessage("Serving ITMClient:");
	this.debugMessage("ITMClient: [{0}]([{1}])".format(itmclient.getInstanceName(""),itmclient.getInstanceClassName("")));
	this.debugMessage("ITMClient: [{0}]".format(itmclient.getInstanceDisplayName("")));
	this.debugMessage("ITMClient: [{0}]".format(itmclient.getInstanceDescription("")));

	this.debugMessage("ITMServer listening at port [{0}]".format(_PORT));
	
	/* Start HTTP daemon */
	var http = require('http');
	
	http.createServer( function(request,response){
		if (request.method == 'POST') {
			/* Received HTTP/POST, start collecting JSON data */
			thisITMServer.debugMessage("=== HTTP-POST: REQUEST received, method=[{0}]".format(request.method));
			var jsonData = '';

			request.on('data', function (data) {
				jsonData += data;
			});

			request.on('end', function () {
				/* JSON data collected, let ITMClient getITMObjectData data */
				var responseITMObject=thisITMClient.getITMObjectData(
					JSON.parse(jsonData)
				);
				
				/* Prepare response */	
				response.writeHead(200,{
					"Access-Control-Allow-Origin":"*",
					"Content-Type":"application/json; charset=utf-8"
				});
				
				/* Send reponse */
				response.end(JSON.stringify(responseITMObject));
			
				/* Debug reponse */
				thisITMServer.debugMessage("=== HTTP-POST: RESPONSE");
				thisITMServer.debugMessage(JSON.stringify(responseITMObject));
				thisITMServer.debugMessage("=== HTTP-POST: END");
			});
		}
		else { 
			// NOT-POST METHOD RECEIVED
		}
	}).listen(listenport);
}

ITMServer_json.prototype=new ITMServer_base();

/* ****************************************************************************
 * ITMSERVER_JSON OBJECT-END
 * ****************************************************************************/

/* ****************************************************************************
 * EXECUTION-BEGIN
 * ****************************************************************************/

/* Start ITMServer with ITMClient listening on _PORT */
var ITMServer=new ITMServer_json(_ITMCLIENT,_PORT);

/* Start another ITMServer with ITMClient listening on _PORT */
/* #var ITMServer2=new ITMServer_json(_ITMCLIENT,3010); */

/* ****************************************************************************
 * EXECUTION-END
 * ****************************************************************************/
