/* ****************************************************************************
 *  ITMServer_base.js
 *  itmserver base class, base itmobject functionality
 *
 *
 * good example of objects in javascript
 http://stackoverflow.com/questions/2064731/good-example-of-javascripts-prototype-based-inheritance
 *
 + itmclient_base
 + itmserver_base
 * ****************************************************************************
 */

/* ****************************************************************************
 * BEGIN-ITMSERVER_BASE OBJECT
 * ****************************************************************************
 */
function ITMServer_base() {
	this._debug = true;
	this._debugModule="ITMServer_base";
	
}
/* inherits from ITMObject_base() */
ITMServer_base.prototype=new ITMClient_base();

/*
 * ****************************************************************************
 * END-ITMSERVER-BASE
* ****************************************************************************/

