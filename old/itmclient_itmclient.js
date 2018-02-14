/* ****************************************************************************
 *  ITMClient.js
 * ****************************************************************************
 * 
 * ****************************************************************************
 */

/* ****************************************************************************
 * BEGIN-ITMOBJECT CLIENT (ITMC)
 * ****************************************************************************
 */
function itmClient() {
	this._itmobject=itmobject_itmclient_itmclient();
	this._debugModule="itmclient_itmclient.js";

	this.connections=function(instance, method, callback){
		return "RETURN FROM CONNECTIONS";
	}
	
	// ************************************************************************
	// function ITMObject_base.doInstanceMethod(instance,method)
	// - do <instance> <method>
	this.doInstanceMethod = function (instance, method, callback) {
		var methodResult="";
		var instanceArray=getInstanceArray(instance);
		
		if (instanceArray.length>1){
			// do we have handler for this
			var handlerName=instanceArray[instanceArray.length-2].toLowerCase();
			console.log(handlerName);
			if (isFunction(this[handlerName])) {
				var handler=this[handlerName];
				methodResult=handler(instance,method,callback);
				this.debugMessage("doInstanceMethod [{0}] method:[{1}], result=[{2}]".format(instance,method,methodResult));
			}
		}
		else {
			this.debugMessage("doInstanceMethod: incorrect number of parameters, length=[{0}]".format(instanceArray.length));
		}
				
		return methodResult;
	};

}

/* inherits from ITMObject_base() */
itmClient.prototype=new ITMClient_base();
/*
 * ****************************************************************************
 * END-ITMCLIENT
* ****************************************************************************/

