/* ****************************************************************************
   * BEGIN-HELPER FUNCTIONS
   * ****************************************************************************
   */
var updateTimerEnabled=true;

function isFunction(x)        { return typeof x == 'function';	}
function isObject(x)          { return typeof x == 'object'; }
function isDefined(x)         { return typeof x !== 'undefined'; }
function notDefined(x)        { return typeof x == 'undefined';} ;
function isString(x)          { return typeof x === 'string'; }
function isArray(x)           { return Array.isArray(x) }
function hasJQueryResults(x)  { return x[0]; }

function stopUpdateTimer() {
   updateTimerEnabled=false;
   itmclient.debugMessage("stopUpdateTimer| updateTimerEnabled=[{0}]".format(updateTimerEnabled));
}

function startUpdateTimer() {
   updateTimerEnabled=true;
   itmclient.debugMessage("startUpdateTimer| updateTimerEnabled=[{0}]".format(updateTimerEnabled));
}

// function jsonParse(json) {
// safe JSON parse function, empty string returns empty object
function jsonParse(str) {
      var result={};
      try {
         result=JSON.parse(str.trim());
      }
      catch(exception) {
         result={}
      }
      return result;
}


// REFRESH_ITMOBJECT_FIELDS()
// return array of all ITMObject parts that will be loaded
function ALL_ITMOBJECT_FIELDS() {
   return [
      "className",   // get instance classname
      "status",      // get instance status
      "name",        // get instance name
      "displayName", // get instance displayname
      "description", // get instance description
      "instances",   // get instances
      "methods",     // get instance methods
      "properties"   // get instance properties
   ];
}

// REFRESH_ITMOBJECT_FIELDS()
// return array of ITMObject parts that will be loaded and refreshed upon timer
function REFRESH_ITMOBJECT_FIELDS() {
   return [
   //"instances",   // get instances
   "className",   // get instance classname
   "status",      // get instance status
   "methods"      // get instance methods
   ];
}

// INSTANCE_ITMOBJECT_FIELDS()
// return array of ITMObject instance parts
function INSTANCE_ITMOBJECT_FIELDS() {
   return [
   "className",   // get instance classname
   "status",      // get instance status
   "name",        // get instance name
   "displayName", // get instance displayname
   "methods"      // get instance methods
   ];
}



// JQUERY HELPER TO CHECK FOR RESULTS

function safeCallBack(callBackFunction, data) { 
   if (isFunction(callBackFunction)) return callBackFunction(data);
}

function removeChildElements(el) {
      if (el) {
         while (el.firstChild) {
            el.removeChild(el.firstChild);
         }
      }
}

String.prototype.format = function() {
      var formatted = this;
      for (var i = 0; i < arguments.length; i++) {
         var regexp = new RegExp('\\{' + i + '\\}', 'gi');
         formatted = formatted.replace(regexp, arguments[i]);
      }
      return formatted;
};

function instanceActiveTab() {
   var el=$("#itmobject-detailed li.active a");
   var activeTab="";
   if (hasJQueryResults(el)){
      activeTab=el.html().toLowerCase();
   }
   return activeTab;
}
function isInstanceTabActive() {
   return (instanceActiveTab == "instances");
}

function isPropertyTabActive() {
   return (instanceActiveTab == "properties");
}

/* ************************************************************************
   * function validateITMObject(obj)  {
   * - do basic check on ITMObject, cleanup object, before use
   *  1. if no instances, return an instances field undefined
   *  2. if no properties, return an properties field undefined
   */
function validateITMObject(obj) {
      // if this object is only link to a handler, change object to handler object
      if (obj.hasOwnProperty("handler")){
            obj=obj["handler"]._itmobject;
      }
 
      // if there are no instances for this ITMObject then remove 'instances' field
      if (isObject(obj.instances)) {
         var ikarr = Object.keys(obj.instances);
         if (ikarr.length == 0) {
            delete obj.instances;
         }
      }

   // if there are no properties for this ITMObject then remove 'properties' field
      if (isObject(obj.properties)) {
         var iparr = Object.keys(obj.properties);
         if (iparr.length == 0) {
            delete obj.properties;
         }
      }
      return obj;
}

/* ************************************************************************
   * function getITMObject(obj,instance)  {
   * - get ITMClient based on given instance name 
   * obj: itmobject data structure
   * instance: selected instancename
   * returns: itmclient of selectedinstance
   */
function getITMObject(obj, instance, setobj) {
      
      // if handler defined for object, return handler instead of object reference
      if ((notDefined(instance)) || (instance=="")) {
            return obj;
      }

      var searchobj={};
      
      if (obj.hasOwnProperty("handler")) {
            var nextInstance = instance.substring(idx + 1);
            //searchobj=obj["handler"]._itmobject;
            searchobj=obj["handler"].getITMObject(obj["handler"]._itmobject,nextInstance);

      } else {
            searchobj=obj;
      }
      var idx = instance.indexOf("/");

      if (idx !== -1) { /* subobjects found */
         var name = instance.substring(0, idx);
         // do we have this instance? then passon
         if (searchobj.hasOwnProperty("instances")) {
            if (searchobj["instances"].hasOwnProperty(name)) {
                  var nextInstance = instance.substring(idx + 1);
                  var nextITMObject = searchobj["instances"][name];

                  return getITMObject(nextITMObject, nextInstance, setobj);
            }
         }
      } else { // return itmobject of this object
         if (searchobj.hasOwnProperty("instances")) {
            if (searchobj["instances"].hasOwnProperty(instance)) {
                  //this.debugMessage("result=",searchobj["instances"][instance]);
                  if (isDefined(setobj)) {
                     // going to set ITMObject, keep any existing data
                     for (var attrname in setobj) { searchobj["instances"][instance][attrname] = setobj[attrname]; }
                     // searchobj["instances"][instance] = setobj;
                  }
                  var resultITMObject = searchobj["instances"][instance];
                  return validateITMObject(resultITMObject);
            }
         }
      }

      // not found, return undefined
      return undefined;
};

function getInstanceArray(instance) {
   if (isString(instance)) {
      return instance.split("/");;	        
   }
   else {
      return [];
   }  
}

// get object property item, if not exist then return default value
function getObjectProperty(arr, item, defaultValue) {
   if (arr.hasOwnProperty(item)) {
      return arr[item];
   } else {
      if (defaultValue) {
         return defaultValue;
      } else {
         return "";
      }
   }
}

function ifBaseInstanceThenDo(instancename, instancebase, handlefunction, elsefunction) {
   var instanceArray = getInstanceArray(instancename);
   if (instanceArray[0] == instancebase) { // Instance base match
      instanceArray.shift();
      // rebuild new instancename without base
      instancename = instanceArray.join("/");
      safeCallBack(handlefunction, instancename);
   } else { // ELSE
      safeCallBack(elsefunction, instancename);
   }
}

function baseInstanceChild2InstanceName(baseInstance, childInstance) {
   if (baseInstance != "") {
      if (childInstance != "") {
         return "{0}/{1}".format(baseInstance, childInstance);
      } else {
         return "{0}".format(baseInstance, childInstance);
      }
   } else {
      return "{0}".format(childInstance);
   }
}

function instanceStatus2StatusClass(instanceStatus) {
   var statusParts=instanceStatus.split(",");
   var instanceStatusClass=statusParts[0];

   // replace invalid chars in status to create a 'status-css-class'
   // / = .  
   // + = - 
   // = = _
   //   = _
   instanceStatusClass=instanceStatusClass.replace(" ","_");
   instanceStatusClass=instanceStatusClass.replace("/",".");
   instanceStatusClass=instanceStatusClass.replace("+","-");
   instanceStatusClass=instanceStatusClass.replace("=","_");
   instanceStatusClass=instanceStatusClass.toLowerCase();
   instanceStatusClass="itmobject_status_{0}".format(instanceStatusClass);
      
   return instanceStatusClass
}

function setupITMClient(itmclient) {
   itmclient.onSelectedInstanceChanged=function(itmclient,from,to) { 
      // reload itmobject after selected instance changed
      itmclient.load(function(){
         renderAll();
      });
   }
   
   renderAll();
   
   // setup refresh timer
   setInterval(function() {
      if (updateTimerEnabled){
         itmclient.load(function(receivedITMObject){
            var instanceName=itmclient.selectedInstance();
                  refreshITMObject(instanceName, REFRESH_ITMOBJECT_FIELDS());
            
         }, REFRESH_ITMOBJECT_FIELDS());
      }
   },5000);
   
   startUpdateTimer();
}	

function refreshITMObject(instanceName,fieldsArray,refreshInstances=true) {
   if (isArray(fieldsArray)) {
      fieldsArray.forEach(function(view) {
         targetId=instanceNameViewId(instanceName,view);
      
         // get DOM element
         itmclient.debugMessage("refreshITMObject: trying to update instance=[{0}],  id=[{1}], view=[{2}]".format(instanceName, targetId,view));
         var el=$("#{0}".format(targetId));
         
         // if element found, then update this element, complete starting from parent with complete template
         if (hasJQueryResults(el)) {
            var renderOutput=renderITMObjectTemplate(instanceName, view);
               
            if (view=="methods"){
              var methods=jsonParse(itmclient.getInstanceMethods(instanceName));
              
              // vernieuw methods, geef object mee als parameter
               renderOutput=renderITMObjectTemplate(instanceName, view, {hash:{"methods":methods}});
            } else {
               renderOutput=renderITMObjectTemplate(instanceName, view);
            }

            el.replaceWith(renderOutput.toHTML());
            
         } else { // update failed, dom element not found
            itmclient.debugMessage("refreshITMObject: failed to update, dom element not found, instance=[{0}], id=[{1}], view=[{2}]".format(instanceName, targetId, view));
         }
      });
      // REFRESH INSTANCES
      if (refreshInstances) {
         var instances=JSON.parse(itmclient.getInstances(instanceName));
         if (instances.length > 0) {
            instances.forEach(function(childInstance){
               refreshITMObject("{0}/{1}".format(instanceName,childInstance), fieldsArray, false);
            })
         }
      }
   }
};

function renderAll() {
   renderClient();
   renderInstanceSelector("#itmclient-instanceselector");
   renderDetailed("#itmobject-detailed");
};


function renderClient() {
   var destination = "#itmclient-mainview";
   var themeName = "default";
   var itmobjectclass = "itmclient";
   var templateName = themeName + "/itmobjects/{0}/detailed".format(itmobjectclass);
   var template = Handlebars.templates[templateName];
   if (template) {
      var templateData = {
         "itmobject": itmclient.getITMObject(itmclient._itmobject, ""),
         "itmobjectInstanceName": ""
      };
      var output = template(templateData);
      $(destination).html(output);
   }
   else {
      console.log("Handlebars: got no template");
   }
}

function renderDetailed(destination) {
	var themeName = "default";
	var itmobjectclass = "itmobject";
	var templateName = themeName + "/itmobjects/{0}/detailed".format(itmobjectclass);

	var template = Handlebars.templates[templateName];
	if (template) {
		var templateData = {
			"itmobject": itmclient.getITMObject(itmclient._itmobject, itmclient.selectedInstance()),
			"itmobjectInstanceName": itmclient.selectedInstance()
		}
		var output = template(templateData);

		$(destination).html(output);
	} else {
		itmclient.debugMessage("Handlebars: got no template");
	}

};

function renderInstanceSelector(destination) {
	var selectedInstances = [];
	var selectedInstance = itmclient.selectedInstance();
	if (selectedInstance != "") {
		// build templatedata array
		var selectedInstanceArray = selectedInstance.split("/");
		var selectedInstanceName = "";

		for (index = 0; index < selectedInstanceArray.length; ++index) {
			var instance = selectedInstanceArray[index];
			var isActive = index == (selectedInstanceArray.length - 1);

			selectedInstanceName = selectedInstanceName + instance;
			selectedInstances.push({
				"instanceName": instance,
				"instanceSelect": selectedInstanceName,
				"active": isActive
			});
			if (!isActive) { // not last item, add / to instancename
				selectedInstanceName = selectedInstanceName + "/";
			}
		}
	}

	var themeName = "default";
	var templateName = themeName + "/itmobjects/itmclient/instanceselector";
	var template = Handlebars.templates[templateName];
	var templateData = {
		"instances": selectedInstances
	}
	itmclient.debugMessage("renderInstanceSelector: templateData=");
	itmclient.debugMessage(templateData);
	itmclient.debugMessage("template=");
	itmclient.debugMessage(template);
	var output = template(templateData);
	$(destination).html(output);
};

function validateITMObjectPropertyElement(element, instance) {
	var propertyName = $(element).attr("id");
	var match = $(element).attr("match");
	var value = $(element).val();
	var initialValue=$(element).attr("initialvalue");
	var inputType = $(element).attr("type");
	var validatedOk= false;
	var valueChanged=(value != initialValue);

	if (isDefined(match)) { // matching a value has been set
		if (value.search(match) !== -1) { // a match
			validatedOk = true;
		}
	} else { // set validation true of no regexpr set
		validatedOk=true;
	}
	
	$(element).next('.help-block')[0].innerHTML="";
	// set CSS class based on validation OK yes/no
	if (validatedOk) {
		$(element).closest('.form-group').addClass('has-success');
		$(element).closest('.form-group').removeClass('has-error');
		$(element).removeClass('itmobject_instance_property_nomatch');
		$(element).addClass('itmobject_instance_property_match');
		$(element).next('.help-block')[0].innerHTML="";
	} else {
		$(element).closest('.form-group').removeClass('has-success');
		$(element).closest('.form-group').addClass('has-error');
		$(element).removeClass('itmobject_instance_property_match');
		$(element).addClass('itmobject_instance_property_nomatch');
		$(element).next('.help-block')[0].innerHTML="Incorrect Input";
	}
	
	// set CSS class based on value changed yes / no
	if (valueChanged) {
		$(element).addClass('itmobject_instance_property_changed');
		$(element).next('.help-block')[0].innerHTML+=" changed";
		
	} else {
		$(element).removeClass('itmobject_instance_property_changed');
	}

	var validatedOkStr = validatedOk ? "True" : "False";
	itmclient.debugMessage("validateITMObjectPropertyElement: propertyname=[{0}], match=[{1}], value=[{2}], initalvalue=[{3}], inputType=[{4}], validatedOk=[{5}]".format(
		propertyName, match, value, initialValue, inputType, validatedOkStr));

	return validatedOk;
}

function closeAllDropDownMethods(element)
{
	$(".dropdown").removeClass("open");
	$(".dropdown-menu").attr("style","none");
}

function formInputElements(element)
{
	var formElement=$(element).closest("form");
   var inputElements=$(formElement).find(":input[id]");
   return inputElements;
}

function formInstance(element)
{
   var formElement=$(element).closest("form");
   var instance=formElement.attr("data-instance");
   return instance;
}
function validateITMObjectProperties(element) {

   var instance= formInstance(element);
   var allInputs = formInputElements(element);
	var validatedInputCount = 0;

	allInputs.each(function(idx, item) {
		if (validateITMObjectPropertyElement(item, instance)) {
			validatedInputCount++;
		}
	});

   itmclient.debugMessage("validateITMObjectProperties:Input [{0}] Valid!".format( validatedInputCount === allInputs.length ? "" : "NOT"  ));

   return (validatedInputCount === allInputs.length);
}

function saveITMObjectProperties(element) {
   // if all properties are validated OK, start setting properties
   if (validateITMObjectProperties(element)) {

      var instance= formInstance(element);
      var allInputs = formInputElements(element);

		itmclient.debugMessage("saveITMObjectProperties: Called for instance=[{0}], element=".format(instance));

		allInputs.each(function(idx, inputElement) {
			var inputType = $(inputElement).attr("type");
			if (inputType !== "button") {
				var propertyName = $(inputElement).attr("id");
				var value = $(inputElement).val();

				itmclient.setInstancePropertyValue(instance, propertyName, value, function(returnValue) {
					$(inputElement).val(returnValue);
               $(inputElement).attr("initialvalue",returnValue);
               // refresh input element
					validateITMObjectPropertyElement(inputElement);
				});
				
			}
		});
	}
	// form not submitted, failed to validate
	return false;
}

function reloadITMObjectPropertyElement(element) {
	// get all input Elements
	var propertyElement=$(element).closest(".itmobject_property");
	var instance=propertyElement.attr("data-instance")
	var property=propertyElement.attr("property")
	itmclient.debugMessage("reloadITMObjectPropertyElement: Called for instance=[{0}], propertyname=".format(instance,property));

	var inputType = $(element).attr("type");

	if (inputType !== "button") {
		
		itmclient.getInstancePropertyValue(instance, property, "value", function(returnValue) {
			$(element).val(returnValue);
			$(element).attr("initialvalue",returnValue);
			validateITMObjectPropertyElement(element);
		});
	}
	
	// do not submit form
	return false;
}

function reloadITMObjectProperties(element) {
   var allInputs = formInputElements(element);
	
   allInputs.each(function(idx, item) {
		reloadITMObjectPropertyElement(item);
	});
	
	// do not submit form
	return false;
}


function doModalDialogInstanceMethodParameters(element)
{
   // if all input elements can be validated
   if (validateITMObjectProperties(element)) {
   
		var formElement=$(element).closest("form");
		var instance=formElement.attr("data-instance");
		var method=formElement.attr("data-method");
		var allInputs = $(formElement).find(":input[id]");
		var inputCount = allInputs.length;
		var validatedInputCount = 0;

		itmclient.debugMessage("doModalDialogInstanceMethodParameters: Called for instance=[{0}], inputCount=[{1}]".format(instance,inputCount));

		var methodParameters={};
		allInputs.each(function(idx, item) {
			var inputType = $(item).attr("type");

			if (inputType !== "button") {
				var propertyName = $(item).attr("id");
				var match = $(item).attr("match");
				var value = $(item).val();

				methodParameters[propertyName]={};
				methodParameters[propertyName]["value"]=value;

				itmclient.debugMessage("doModalDialogInstanceMethodParameters: propertyName=[{0}], match=[{1}], value=[{2}]".format(propertyName, match, value));
			}
		});
		methodParametersJSON=JSON.stringify(methodParameters);
		itmclient.debugMessage("doModalDialogInstanceMethodParameters: method=[{0}], parameters=[{1}]".format(method,methodParametersJSON));
		// do instancemethod with parameters
		itmclient.doInstanceMethod(instance, method+methodParametersJSON, function(methodResult){
			// succesfull, close dialog
			alert("doModalDialogInstanceMethodParameters: itmclient.doInstanceMethod instance=[{0}], method=[{1}], result=[{2}]".format(instance, method+methodParametersJSON, methodResult));
			// $('#MethodModalDialog').modal('hide');
		});

	}
	else {
		itmclient.debugMessage("doModalDialogInstanceMethodParameters: parameters invalid, cant process invoke method");
	}
	
	// do not submit form
	return false;
}

function buildModalDialogInstanceMethodParameters(element)
{
	var modalBody=$(element).find(".modal-body");
   var formElement=$(element).find("form");
   var instance=formElement.attr("data-instance");
   var method=formElement.attr("data-method");

   // get ITMObject to build Dialog for
   var itmobject=itmclient.getITMObject(itmclient._itmobject,instance);
      
   // get method parameters to build Dialog for
   var methodParameters=itmobject.methods[method].parameters;
   
   // construct modal dialog body from method parameters, generate template per property
   var modalBodyHtml="";
   for (var key in methodParameters){
      modalBodyHtml += Handlebars.helpers.renderITMObjectTemplate(
         instance, 'property', { "hash": {"instance":"", "propertyName":key, "property":methodParameters[key]}} 
      );
   };
      
   // place modal dialog body into modal-body element
   modalBody.html(modalBodyHtml);
}

/*** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** 
	END - HELPER FUNCTIONS *
** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** */