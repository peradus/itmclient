/* ****************************************************************************
 *  ITMClient_script.js
 *  JSON based ITM Client
 * ****************************************************************************
 * 
 * ****************************************************************************/

/* ****************************************************************************
 * BEGIN-ITMClient_script
 * ****************************************************************************/
function ITMClient_script() {
	this._debugModule="ITMClient_script";
	this._itmobject={};
	this._itmobject=itmobject_itmclientscript();

}

/* inherits from ITMObject_base() */
ITMClient_script.prototype=new ITMClient_base();
/*
 * ****************************************************************************
 * END-itmClientJSON
* ****************************************************************************/