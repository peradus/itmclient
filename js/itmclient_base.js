/* ****************************************************************************
 *  ITMClient_base.js
 *  itmclient base class, base itmobject functionality
 *
 * ****************************************************************************/

/**
 * ITMCLIENT_BASE OBJECT-BEGIN
 * 
 */
function ITMClient_base() {
    this._debug = true;
    this._debugModule = "ITMClient_base";
    this._selectedInstance = "";
    this._itmobject = {};
    this._selectedITMObject = this._itmobject;

    /* ************************************************************************
     * function ITMObject_base.debugMessage(message)
     * if debugging enabled send message to console.log`
     */
    if (this._debug) { /* if debug defined, define function to handle message */
        this.debugMessage = function(message) {
            var dateTimeStampText = JSON.stringify(new Date());
            dateTimeStampText = dateTimeStampText.substring(1, dateTimeStampText.length - 1);

            var debugModuleText = this._debugModule ? this._debugModule : "";

            /* if message is object, translate to text */
            if (isObject(message)) {
                message = JSON.stringify(message);
            }

            var outMessage = "[{0}]|[{1}]|[{2}]".format(dateTimeStampText, debugModuleText, message);
            console.log(outMessage);
        };
    } else { /* if debug not defined, define empty function */
        this.debugMessage = function(message) {};
    }

    /************************************************************************
     * function ITMObject_base.load(actionfinished)
     * - load itmobject and after that fire event actionfinished
     */
    this.load = function(actionfinished) {
        /* base object does nothing on load */

        /* do actionfinished if function is defined */
        if (isFunction(actionfinished)) {
            actionfinished();
        }
    }
  
  /************************************************************************
     * function ITMObject_base.selectedInstance(setInstance)
     * - get selected instance, fire event if changed
     */
    this.selectedInstance = function(setInstance) {
        if ((!setInstance) && (setInstance != "")) {
            return this._selectedInstance;
        } else {
            var currentInstance = this.selectedInstance();
            var selectedInstanceChanged = (!(setInstance == currentInstance)) | (setInstance == "");

            if (selectedInstanceChanged) {
                this._selectedInstance = setInstance;
                this.debugMessage("selectedInstance: selectedInstance changed from [{0}] to [{1}]".format(currentInstance, setInstance));

                this._selectedITMObject = this.getITMObject(this._itmobject, setInstance);

                if (isFunction(this.onSelectedInstanceChanged)) {
                    this.onSelectedInstanceChanged(this, currentInstance, setInstance);
                }
            }
        };
    }

    /************************************************************************
     * function ITMObject_base.refreshView()
     * - get selected instance, fire event if changed
     */
    this.refreshView = function() {
        var currentInstance = this.selectedInstance();
        if (isFunction(this.onSelectedInstanceChanged)) {
            this.onSelectedInstanceChanged(this, currentInstance, currentInstance);
        }
    }

   /************************************************************************
     * function ITMObject_base.ITMObject()
     * - return ITMObject
     */
    this.ITMObject= function() {
      return this._itmobject;
     }

    /************************************************************************
     * function ITMObject_base._getInstanceData(instanceField,instance)
     * - get instanceData()
     */
    this._getInstanceData = function(instanceField, instance) {

      var obj = this.getITMObject(this._itmobject, instance);
      var result = undefined;
      
      // if itmobject has the field in object return that.
      if (obj) {
         if (obj.hasOwnProperty(instanceField)) {
               /* fetch data from property */
               result = obj[instanceField];

               /* if result function then execute it */
               if (isFunction(result)) {
                  result = result(instance);
               }
         }
      }

      /* final check of result, if undefined return empty value, not undefined */
      if (notDefined(result)) {
         switch (instanceField) {
               case "methods":
               case "properties":
                  return {};
               case "instances":
                  return [];

               default:
                  return "";
         }
      }
        return result;
    };

    /************************************************************************
     * function ITMObject_base.getInstanceData(instanceField,instance)
     * - get instanceData()
     */
    this.getInstanceData = function(instanceField, instance) {
        return this._getInstanceData(instanceField, instance);
    };

    /************************************************************************
     * function ITMObject_base.onSelectedInstanceChanged(itmclient, from,to)
     * - fired event if selected instance has changed, parameter from instancename to instancename
     */
    this.onSelectedInstanceChanged = function(itmclient, from, to) {};

    
    /************************************************************************
     * function ITMObject_base.getInstanceClassName(instance)
     * - get class name of instance
     */
    this.getInstanceClassName = function(instance) {
        var instanceClassName = this.getInstanceData("className", instance);
        // check for empty value, dont return this
        instanceClassName = (instanceClassName == "" ? "itmobject" : instanceClassName);
        return instanceClassName;
    };

    /************************************************************************
     * function ITMObject_base.getInstanceName(instance)
     * - get name of instance, key value
     */
    this.getInstanceName = function(instance) {
       return this._itmobject["name"];
    };

    /************************************************************************
     * function ITMObject_base.getInstanceDisplayName(instance)
     * - get short displayname of instance
     */
    this.getInstanceDisplayName = function(instance) {
        return this.getInstanceData("displayName", instance);
    };

    /************************************************************************
     * function ITMObject_base.getInstanceDescription(instance)
     * - get description of instance
     */
    this.getInstanceDescription = function(instance) {
        return this.getInstanceData("description", instance);
    };


    /************************************************************************
     * function ITMObject_base._getInstanceStatus(instance)
     * - get name of instance
     */
    this._getInstanceStatus = function(instance) {
        return this.getInstanceData("status", instance);
    };

    /************************************************************************
     * function ITMObject_base.getInstanceStatus(instance)
     * - get name of instance
     */
    this.getInstanceStatus = function(instance) {
        return this._getInstanceStatus(instance);
    };

    /************************************************************************
     * function ITMObject_base.getInstanceMethods(instance)
     * - get name of instance
     */
    this.getInstanceMethods = function(instance) {
        var methods = this.getInstanceData("methods", instance);
        return JSON.stringify(methods);
    };

    /************************************************************************
     * function ITMObject_base.getInstances(instance)
     * - get name of instance
     */
    this.getInstances = function(instance) {
        var instances = this.getInstanceData("instances", instance);

        if (instances) {
            //return JSON.stringify({"instances":Object.keys(instances)});
            return JSON.stringify(Object.keys(instances));
        } else {
            //return JSON.stringify({"instances":[]});
            return JSON.stringify([]);
        }
    };

    /************************************************************************
     * function ITMObject_base.getInstanceProperties(instance)
     * - get name of instance
     */
    this.getInstanceProperties = function(instance) {
        var properties = this.getInstanceData("properties", instance);
        if (properties) {
            return JSON.stringify(properties);
        } else {
            return JSON.stringify({});
        }
    };

    /************************************************************************
     * function ITMObject_base.getInstancePropertyValue(instance,property,value,callback)
     * - get instance property value
     * - optional callback can be used to set value when retrieved
     */
    this._getInstancePropertyValue = function(instance, property, getwhatvalue, callback) {
        var whatvalue = "value";
        if (getwhatvalue) {
            whatvalue = getwhatvalue
        };
        var obj = this.getITMObject(this._itmobject, instance)
        var result = "";
        if (obj) {
            if (obj.hasOwnProperty("properties")) {
                if (obj.properties.hasOwnProperty(property)) {
                    if (obj.properties[property].hasOwnProperty("value")) {
                        result = obj.properties[property][whatvalue];
                    }
                }
            }
        }
        if (!result) {
            result = "";
        };

        safeCallBack(callback, result);

        return result;
    }

    this.getInstancePropertyValue = function(instance, property, getwhatvalue, callback) {
        return this._getInstancePropertyValue(instance, property, getwhatvalue, callback);
    }

    /************************************************************************
     * function ITMObject_base.setInstancePropertyValue(instance,property,value)
     * - set Instance <instance> Property <property> Value to <value>
     * returns value if succesfull
     */
    this._setInstancePropertyValue = function(instance, property, value, callback) {
        var obj = this.getITMObject(this._itmobject, instance)
        var result = "";

        if (obj) {
            if (obj.hasOwnProperty("properties")) {
                if (obj.properties.hasOwnProperty(property)) {
                    var instanceProperty = obj.properties[property];
                    if (instanceProperty) {
                        // set default reset current propertyvalue
                        result = instanceProperty["value"];

                        // get match regexpr if exist
                        var match = instanceProperty["match"];
                        if (match) {
                            // check if value matches regexpr
                            if (value.search(match) === -1) {
                                // regexpr check failed
                                this.debugMessage("setInstancePropertyValue: FAILED: instance=[{0}], property=[{1}], value=[{2}], regexpr not match [{3}]".format(instance, property, value, match));
                            } else { // regexpr check successfull, set value
                                // set instance property value
                                result = value;
                                instanceProperty["value"] = value;
                                this.debugMessage("setInstancePropertyValue: instance=[{0}], property=[{1}], value=[{2}], regexpr match [{3}]".format(instance, property, value, match));
                            }
                        } else { // set propertyvalue with no regexpr check
                            result = value;
                            instanceProperty["value"] = value;
                            this.debugMessage("setInstancePropertyValue: instance=[{0}], property=[{1}], value=[{2}], no regexpr check set".format(instance, property, value));
                        }
                    }
                } else {
                    this.debugMessage("setInstancePropertyValue: FAILED: no property [{1}] for instance=[{0}], cannot set value=[{2}]".format(instance, property, value));
                }
            } else {
                this.debugMessage("setInstancePropertyValue: FAILED: no properties for instance instance=[{0}], cannot set property=[{1}], value=[{2}]".format(instance, property, value));
            }
        } else {
            this.debugMessage("setInstancePropertyValue: return null on getITMObject, instance=[{0}]".format(instance));

        }

        safeCallBack(callback, result);

        return result;
    }

    this.setInstancePropertyValue = function(instance, property, value, callback) {
            return this._setInstancePropertyValue(instance, property, value, callback);
        }
        /************************************************************************
         * function ITMObject_base.getITMObjectData=function(request)
         * - handle request from JSON data, specified in ITMClient JSON protocol
         * returns ITMObject if succesfull
         */
    this.getITMObjectData = function(json) {
        var responseITMObject = {};

        this.debugMessage("getITMObjectData: " + JSON.stringify(json));

        /* if selectedinstance is set as property then process JSON data */
        if ((json["selectedInstance"]) || (json["selectedInstance"] === "")) {

            /* fetch instance from JSON data */
            var instance = json.selectedInstance;
            this.debugMessage("getITMObjectData: instance [{0}] selected".format(json.selectedInstance));

            /* for each property in JSON request do 
             */
            for (var propertyName in json) {
               var propertyValue = json[propertyName];

               /* "selectedinstance":"<instance>" */
               if (propertyName.match(/^selectedInstance/i))  responseITMObject[propertyName] = instance;
               /* "instanceclassname":"" */
               if (propertyName.match(/^className/i))         responseITMObject[propertyName] = this.getInstanceClassName(instance);
               /* "instancename":"" */
               if (propertyName.match(/^name/i))              responseITMObject[propertyName] = this.getInstanceName(instance);
               /* "instancedisplayname":"" */
               if (propertyName.match(/^displayName/i))       responseITMObject[propertyName] = this.getInstanceDisplayName(instance);
               /* "instancedescription":"" */
               if (propertyName.match(/^description/i))       responseITMObject[propertyName] = this.getInstanceDescription(instance);
               /* "status":"" */
               if (propertyName.match(/^status/i))            responseITMObject[propertyName] = this.getInstanceStatus(instance);
               /* "instances":"" */
               if (propertyName.match(/^instances/i))         responseITMObject[propertyName] = this.getInstances(instance);
               /* "instancemethods":"" */
               if (propertyName.match(/^methods/i))           responseITMObject[propertyName] = this.getInstanceMethods(instance);
               /* "instanceproperties":"" */
               if (propertyName.match(/^properties/i))        responseITMObject[propertyName] = this.getInstanceProperties(instance);
               /* "domethod(<method>({json})":"" */
               if (propertyName.match(/^domethod/i)) {
                  var myRegexp = /^domethod\((.+)\)$/g;
                  var method = myRegexp.exec(propertyName);

                  if (method.length == 2) { /* valid doMethod received */
                     this.debugMessage("getITMObjectData: doInstanceMethod([{0}],[{1}])".format(instance, method[1]));
                     responseITMObject[propertyName] = this.doInstanceMethod(instance, method[1]);
                  } else { /* invalid doMethod received */
                     this.debugMessage("getITMObjectData: doInstanceMethod regexpr failed, not handling method");
                  }
               }
               /* "setpropertyvalue(<property>)":"<value>" */
               if (propertyName.match(/^setpropertyvalue/i)) {
                  var myRegexp = /^setpropertyvalue\((.+)\)$/g;
                  var property = myRegexp.exec(propertyName);

                  // this.debugMessage("getITMObjectData: setInstancePropertyValue : RegExpr length=[{0}]".format(property.length));
                  this.debugMessage("getITMObjectData: setInstancePropertyValue({0}) regexpr retrieved [{1}]".format(propertyName, property[1]));
                  if (property.length == 2) {
                     this.debugMessage("getITMObjectData: setInstancePropertyValue: instance=[{0}], property=[{1}], value=[{2}]".format(instance, property[1], propertyValue));
                     responseITMObject[propertyName] = this.setInstancePropertyValue(instance, property[1], propertyValue);
                  } else {
                     this.debugMessage("getITMObjectData: setInstancePropertyValue: regexpr failed, not handling");
                  }
               }
               /* "getpropertyvalue(<property>)":"" */
               if (propertyName.match(/^getpropertyvalue/i)) {
                  var myRegexp = /^getpropertyvalue\((.+)\)$/g;
                  var property = myRegexp.exec(propertyName);

                  // this.debugMessage("getITMObjectData: getpropertyvalue : RegExpr length=[{0}]".format(property.length));
                  this.debugMessage("getITMObjectData: getInstancePropertyValue({0}) regexpr retrieved [{1}]".format(propertyName, property[1]));
                  if (property.length == 2) {
                     responseITMObject[propertyName] = this.getInstancePropertyValue(instance, property[1]);
                     this.debugMessage("getITMObjectData: getInstancePropertyValue: instance=[{0}], property=[{1}], value=[{2}]".format(instance, property[1], propertyValue));
                  } else {
                     this.debugMessage("getITMObjectData: getInstancePropertyValue: regexpr failed, not handling");
                  }
               }
            }
        } else {
            this.debugMessage("getITMObjectData: Invalid request, no instance selected");
        }

        this.debugMessage("handleJSON: request handled, return responseITMObject=[{0}]".format(JSON.stringify(responseITMObject)));

        return responseITMObject;
    }
}

/**
 * getITMObject - get a selected ITMObject based on instance
 * @param {*} obj - base ITMObject 
 * @param {*} instance - selected instance to get
 * @param {*} setobj - leave undefined, set if need new ITMObject
 */
ITMClient_base.prototype.getITMObject = function(obj, instance, setobj) {
      return getITMObject(obj, instance, setobj);
};


/**
 * function ITMObject_base.doInstanceMethod(instance,method)
 * @param {*} instance - selected instance to get
 * @param {*} method - method to be execute
 * @param {*} callback - callback function after complete
 */
ITMClient_base.prototype.doInstanceMethod = function(instance, method, callback) {
   var methodResult = this.getInstanceStatus(instance);
   this.debugMessage("itmClient: doInstanceMethod [{0}] method:[{1}], result=[{2}]".format(instance, method, methodResult));
   if (isFunction(callback)) {
         callback(methodResult);
   }
   return methodResult;
};



/* ****************************************************************************
 * ITMCLIENT_BASE OBJECT-END
 * ****************************************************************************/