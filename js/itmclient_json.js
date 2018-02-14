/* ****************************************************************************
 *  ITMClient_json.js
 *  JSON based ITM Client
 * ****************************************************************************
 * 
 * ****************************************************************************/

/* ****************************************************************************
 * BEGIN-itmClientJSON
 * ****************************************************************************/
function ITMClient_json() {
   this._debugModule = "ITMClient_json";
   this._itmobject = itmobject_itmclient_json();

    /* ************************************************************************
     * function ITMClient_json.doITMObjectJSONRequest(itmObjectRequest,onActionFinished){
     * send JSON request to JSON server, request in itmObjectRequest
     */
      this.doITMObjectJSONRequest = function(itmObjectRequest, onActionFinished) {
      // initialize receive itmobject
      var itmObjectReceived = {};
      var itmobjectRequestJSON = JSON.stringify(itmObjectRequest);
      var thisobject = this;

      // get connection host
      //var connectTo=this.getInstancePropertyValue("","ITMClientJSON.ConnectTo");
      this.getInstancePropertyValue("", "ITMClientJSON.ConnectTo", "value", function(connectTo) {

         thisobject.debugMessage("doITMObjectJSONRequest: itmobjectRequestJSON=[{0}]".format(itmobjectRequestJSON));

         var request = $.ajax({
            type: 'POST',
            dataType: 'json',
            url: connectTo,
            data: itmobjectRequestJSON,
            cache: false,
         });

         request.success(function(serverData) {
            thisobject.debugMessage("doITMObjectJSONRequest: request.success, post.received data=[{0}]".format(JSON.stringify(serverData)));

            /* get received ITMObject */
            itmObjectReceived = serverData;

            /* if itmobject data is a string and needed to convert to object, convert this */
            var convert = ["methods", "properties", "instances"];
            convert.forEach(function(data) {
                  if (itmObjectReceived[data]) {
                     thisobject.debugMessage("doITMObjectJSONRequest: convert data [{0}], JSON.Parse({1})".format(data, itmObjectReceived[data]));
                     itmObjectReceived[data] = JSON.parse(itmObjectReceived[data]);
                  }
            });

            /* convert json instances array to hashed key itmobject */
            if (isDefined(itmObjectReceived["instances"])) {
               var instanceArray = itmObjectReceived["instances"];
               itmObjectReceived["instances"] = {};
               instanceArray.forEach(function(instance) {
                     itmObjectReceived["instances"][instance] = {
                        "name": instance
                     };
               });
            }

            // received ITMObject, do Callback
            safeCallBack(onActionFinished, itmObjectReceived);
            thisobject.debugMessage("doITMObjectJSONRequest: returning itmObjectReceived=[{0}]".format(JSON.stringify(itmObjectReceived)));
            
            return itmObjectReceived;
         });

         request.fail(function(jqXHR, textStatus, error) {
            thisobject.debugMessage("doITMObjectJSONRequest: FAIL! textStatus=[{0}], error=[{1}], request=[{2}], request.getAllResponseHeaders=[{3}], itmObjectReceived=[{4}]".format(
               textStatus, error, request, request.getAllResponseHeaders(), itmObjectReceived
            ));

            var initialInstances = itmobject_itmclient_json();
            thisobject._itmobject["instances"]["instances"] = initialInstances["instances"]["instances"];
            thisobject._itmobject["instances"]["instances"]["status"] = "Error, failed to retrieve ITMObject";

            // thisobject.selectedInstance("");

            safeCallBack(onActionFinished, {});
         });
         return itmObjectReceived;
      },
      // ELSE- NO ConnectTO property
      function(connectTo) {
         var initialInstances = itmobject_itmclient_json();
         thisobject._itmobject["instances"]["instances"] = initialInstances["instances"]["instances"];
         thisobject._itmobject["instances"]["instances"]["status"] = "Warning, connectTo property invalid or not set";

         safeCallBack(onActionFinished, {});
         }
      );
   }

    // ************************************************************************
    // function itmClientJSON.load(actionfinished, requestFields)
    // - load itmobject via JSON protocol, do post request(JSON) and receive itmobject(JSON)
    // - requestFields, eg. ALL_ITMOBJECT_FIELDS() STATUS_ITMOBJECT_FIELDS() INSTANCE_ITMOBJECT_FIELDS()
    this.load = function(onActionFinished, requestFields=ALL_ITMOBJECT_FIELDS()) {
        var thisobject = this;
        var instance = this.selectedInstance();
        
        // check if load is for 'remote' instances\*
        ifBaseInstanceThenDo(instance, "instances",
            function(instance) { // instances
               // construct itmObjectReqest based on requestFields
               var itmObjectRequest = {};
               itmObjectRequest["selectedInstance"]=instance;
               requestFields.forEach(function(field){
                  itmObjectRequest[field]="";
               });

               // send JSON request
               thisobject.doITMObjectJSONRequest(itmObjectRequest,
                  function(receivedITMObject) {
                     // set loaded ITMObject
                     receivedITMObject = validateITMObject(receivedITMObject);

                     loadedInstance = baseInstanceChild2InstanceName("instances", instance);

                     var receivedInstance = receivedITMObject['selectedInstance'];
                     thisobject.getITMObject(thisobject._itmobject, loadedInstance, receivedITMObject);

                     // received ITMObject is set, do callback
                     safeCallBack(onActionFinished, receivedITMObject);
                                          
                     // load JSON ITMObject Instances
                     var childInstances = JSON.parse(thisobject.getInstances(loadedInstance));
                     thisobject.debugMessage("load: doITMObjectJSONRequest child instances of [{0}]".format(loadedInstance));

                     var baseInstance = instance;
                     var childInstanceCount = 0;
                     childInstances.forEach(function(childInstance) {
                           thisobject.debugMessage("load: doITMObjectJSONRequest child instance = [{0}]".format(childInstance));

                           var childInstanceName = baseInstanceChild2InstanceName(baseInstance, childInstance);

                           // construct itmObjectReqest based on requestFields
                           var itmObjectRequest = {};
                           var requestFields = ALL_ITMOBJECT_FIELDS();
                           itmObjectRequest["selectedInstance"]=childInstanceName;
                           requestFields.forEach(function(field){
                              itmObjectRequest[field]="";
                           });

                           thisobject.doITMObjectJSONRequest(itmObjectRequest,
                              function(receivedITMObject) {
                                 var receivedInstance = receivedITMObject['selectedInstance'];
                                 receivedInstance = "instances/{0}".format(receivedInstance);
                                 thisobject.getITMObject(thisobject._itmobject, receivedInstance, receivedITMObject);

                                 childInstanceCount = childInstanceCount + 1;
                                 thisobject.debugMessage("load: doITMObjectJSONRequest: childInstance update count=[{0}]".format(childInstanceCount));

                                 safeCallBack(onActionFinished, receivedITMObject);
                              });
                     });
                  }
               )
         }

            // ELSE: LOAD LOCAL instances
            ,
            function(instance) {
                safeCallBack(onActionFinished, "");
            })
    }

    // ************************************************************************
    // function itmClientJSON.doInstanceMethod(instance,method)
    // - do <instance> <method>
    this.doInstanceMethod = function(instance, method, callback) {
        var methodResult = "";

        // check if method is for remote instances
        var thisobject = this;
        ifBaseInstanceThenDo(instance, "instances",
            function(instance) { // instance=instances/*
                var itmobjectRequest = {
                    "selectedInstance": instance,
                };

                var doMethod = "domethod({0})".format(method);
                itmobjectRequest[doMethod] = "";

                thisobject.doITMObjectJSONRequest(itmobjectRequest,
                    function(returneditmobject) {
                        methodResult = returneditmobject[doMethod];

                        thisobject.debugMessage("itmClientJSON|REMOTE|doInstanceMethod instance=[{0}], method=[{1}], return=[{2}]".format(instance, method, methodResult));
                        safeCallBack(callback, methodResult);
                    }
                );
            },
            // ELSE instance<>instances
            function(instance) {
                thisobject.debugMessage("itmClientJSON|LOCAL|doInstanceMethod instance=[{0}], method=[{1}], return=[{2}]".format(instance, method, methodResult));

                if (method == 'Connect') {
                    thisobject.refreshView()
                };
                safeCallBack(callback, methodResult);
            }
        );
        return methodResult;
    };

    // ************************************************************************
    // function itmClientJSON.setInstancePropertyValue(instance,property,value)
    // - set Instance <instance> Property <property> Value to <value>
    // returns value if succesfull
    this.setInstancePropertyValue = function(instance, property, value, callback) {
        var propertyValue = "";
        var thisobject = this;

        ifBaseInstanceThenDo(instance, "instances",
            function(instance) { // instance=instances/*
                var itmobjectRequest = {
                    "selectedInstance": instance, // select instance
                };

                var setPropertyValue = "setpropertyvalue({0})".format(property);
                itmobjectRequest[setPropertyValue] = value;

                thisobject.doITMObjectJSONRequest(itmobjectRequest,
                    function(returneditmobject) {
                        propertyValue = returneditmobject[setPropertyValue];

                        thisobject.debugMessage("itmClientJSON|REMOTE|setInstancePropertyValue instance=[{0}], property=[{1}], value=[{2}], return=[{3}]".format(instance, property, value, propertyValue));

                        safeCallBack(callback, propertyValue);
                    })
            },
            // ELSE instance<>instances
            function(instance) {
                propertyvalue = thisobject._setInstancePropertyValue(instance, property, value, function(result) {
                    thisobject.debugMessage("itmClientJSON|LOCAL|setInstancePropertyValue instance=[{0}], property=[{1}], value=[{2}], return=[{3}]".format(instance, property, value, result));
                    safeCallBack(callback, result);
                });
            });
    }

    // ************************************************************************
    // function itmClientJSON.getInstancePropertyValue(instance,property)
    // - get Instance <instance> Property <property> Value
    // returns value if succesfull
    this.getInstancePropertyValue = function(instance, property, whatvalue, callback) {

        if (whatvalue === undefined) {
            whatvalue = "value"
        };
        var thisobject = this;
        var propertyValue = "";

        ifBaseInstanceThenDo(instance, "instances",
            function(instance) { // instance=instances/*
                if (whatvalue.toLowerCase() === "value") {
                    var getPropertyValue = "getpropertyvalue({0})".format(property);
                    var itmobjectRequest = {
                        "selectedInstance": instance, // select instance
                    };
                    itmobjectRequest[getPropertyValue] = "";

                    thisobject.doITMObjectJSONRequest(itmobjectRequest,
                        function(returneditmobject) {
                            var propertyValue = returneditmobject[getPropertyValue];
                            thisobject.debugMessage("itmClientJSON|REMOTE|getInstancePropertyValue instance=[{0}], property=[{1}], result=[{2}]".format(instance, property, propertyValue));

                            safeCallBack(callback, propertyValue);
                            return propertyValue;
                        }
                    );
                } else {
                    this.debugMessage("getInstancePropertyValue cant return [{0}]".format(whatvalue));
                }
            },
            // ELSE instance<>instances
            function(instance) {
                propertyvalue = thisobject._getInstancePropertyValue(instance, property, whatvalue, function(result) {
                    thisobject.debugMessage("itmClientJSON|LOCAL|getInstancePropertyValue instance=[{0}], property=[{1}], result=[{2}]".format(instance, property, result));
                    safeCallBack(callback, result);
                });
            }
        );
    }

}

/* inherits from ITMObject_base() */
ITMClient_json.prototype = new ITMClient_base();
/*
 * ****************************************************************************
 * END-itmClientJSON
 * ****************************************************************************/