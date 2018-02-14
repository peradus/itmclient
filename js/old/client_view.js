/* ****************************************************************************
 * BEGIN-ITMOBJECT VIEW (ITMV)
 * ****************************************************************************/
 function itmvButtons(el, buttons, onSelectFunction){
	var doc=document;
	
 // clean element if set
	el && removeChildElements(el);

	var buttonGroup = doc.createElement("div");
		buttonGroup.className = "btn-group";
		buttonGroup.role = "group";

	// get buttons
	if (buttons.length > 0) {
		buttons.forEach(function (buttonname) {
			// create button and textnode for caption
			var button = doc.createElement("button");
			var caption = doc.createTextNode(buttonname);
			
			// style button
			button.className = "btn btn-default btn-xs";
			button.type = "button";
			button.name = buttonname;

			// enabled button, attach onclick handler
			if (isFunction(onSelectFunction)){
				button.addEventListener("click", function () {
					onSelectFunction(buttonname);
				});
				button.disabled=false;
			}
			else{
				button.disabled=true;
			}
			
			// add caption to button
			button.appendChild(caption);

			// add button to buttongroup
			buttonGroup.appendChild(button);

			// return buttonGroup element
		});
	}

	if (el) {
		el.appendChild(buttonGroup);
	} else {
		return buttonGroup;
	}
}
/* ****************************************************************************
function itmvInstanceName(el,instance,canselect)
 * - output html elements to show instancename
 *          inside element(el), or if (el) undefined return new element
 *
 * eg.
 * <a href="#">Inbox <span class="badge">42</span></a>
 * ****************************************************************************/
function itmvInstanceName(el, instance, canselect) {
	var doc = document;
	var displayName=itmclient.getInstanceDisplayName(instance);
	var instanceName = itmclient.getInstanceName(instance);
	if (displayName!=""){
		instanceName=displayName;
	}
	var caption = doc.createTextNode(instanceName);
	var nameElement;
	
	// clean element if set
	el && removeChildElements(el);

	if((canselect)&&(canselect==true)){
		nameElement= doc.createElement("a");
		nameElement.href = "#";
		
		// attach onclick handler to select instance
		nameElement.addEventListener("click", function () {
			itmclient.selectedInstance(instance);
		});
	}
	else{
		nameElement= doc.createElement("span");
	}
	
	// add caption to button
	nameElement.appendChild(caption);

	if (el) {
		el.appendChild(nameElement);
	} else {
		return nameElement;
	}
}

/* ****************************************************************************
function itmvInstanceStatus(el,instance)
 * - html elements to show ITMObject status
 *          inside element(el), or if (el) undefined return new element
 *
 * eg.
 * <span class="label label-default">Default</span>
 * <span class="label label-primary">Primary</span>
 * <span class="label label-success">Success</span>
 * <span class="label label-info">Info</span>
 * <span class="label label-warning">Warning</span>
 * <span class="label label-danger">Danger</span>
 */
function itmvInstanceStatus(el, instance) {
	var doc = document;
	var instanceStatus = itmclient.getInstanceStatus(instance);
	// try to fetch instanceStatusClass, first word of status "Ok, this is all ok" == ok
	var instanceStatusClass = instanceStatus2StatusClass(instanceStatus);
	var statusElement = doc.createElement("div");
	var statusText = doc.createTextNode(instanceStatus);

	// clean element if set
	el && removeChildElements(el);

	//statusElement.className = "label label-success";
	statusElement.className = "label";

	// custom status:
	statusElement.className += " itmobject_status";
	statusElement.className += " itmobject_status_{0}".format(instanceStatusClass);

	// add caption to button
	statusElement.appendChild(statusText);

	if (el) {
		el.appendChild(statusElement);
	} else {
		return statusElement;
	}
}

/* ****************************************************************************
 * function doMethodModalDialog(method);
 * - do method in MethodModalDialog
 * doMethodModalDialog("login");
 */
function doMethodModalDialog(method) {
	var modalDialog=$("#MethodModalDialog");
	var instance=modalDialog.attr("data-instance");
	
	if (bsValidateFormGroups(modalDialog)){
		itmclient.debugMessage("doMethodModalDialog: method parameters are valid");
		
		var formGroups=$("#MethodModalDialog .form-group");
		var methodParameters={};
		formGroups.each( function() {
			var label=$(this).find("label");
			var input=$(this).find("input");
			var parameter=label.attr("for");
			var value=input.val();
			itmclient.debugMessage("doMethodModalDialog: parameter=[{0}], value=[{1}]".format(parameter,value));
			
			methodParameters[parameter]={};
			methodParameters[parameter]["value"]=value;
		});
		
		methodParametersJSON=JSON.stringify(methodParameters);
		itmclient.debugMessage("doMethodModalDialog: method=[{0}], parameters=[{1}]".format(method,methodParametersJSON));
		// do instancemethod with parameters
		itmclient.doInstanceMethod(instance, method+methodParametersJSON, function(methodResult){
			// succesfull, close dialog
			// alert("doInstanceMethod instance=[{0}], method=[{1}], result=[{2}]".format(instance, method+methodParametersJSON, methodResult));
			$('#MethodModalDialog').modal('hide');
		});
		
	}
	else {
		itmclient.debugMessage("doMethodModalDialog: method parameters are NOT valid");
	}
}

/* ****************************************************************************
 * function setupMethodModalDialog(instance,method,methoddata)
 * - setup MethodModalDialog with method parameters 
 *	 this modal is for instance <instance>
 * 	 this modal is for method <method> *(if method)
 *   inside element(el), or if (el) undefined return new element
 *
 * setupMethodModalDialog("method", "a/b/c",{"login");
 */
function setupMethodModalDialog(instance,method,methoddata) {
	var doc=document;
	var modalDialogData;
	var modalDialog=$("#MethodModalDialog");
	modalDialog.attr('data-instance', instance);
	var methodParameters=methoddata["parameters"];
	if (!methodParameters) { parameters={} }
	var methodParameterKeys=Object.keys(methodParameters);
	
	itmclient.debugMessage("setupMethodModalDialog: instance=[{0}], method=[{1}], methoddata=[{2}]".format(instance,method,methoddata));
	
	///////////
	// HEADER
	var header=modalDialog.find(".modal-header");
	header.empty();
	var caption=methoddata["hint"];
	var description=methoddata["description"];

	var headerTitle=doc.createElement("h4");
	headerTitle.className="header-title";
	headerTitle.appendChild(doc.createTextNode(caption));
	header.append(headerTitle);
	
	var headerDescription = doc.createElement("p");
	headerDescription.appendChild(doc.createTextNode(description));
	header.append(headerDescription);
	
	///////////
	// BODY
	var body=modalDialog.find(".modal-body");
	body.empty();
	
	if (methodParameterKeys.length > 0) {
		// foreach methodParameterKey
		methodParameterKeys.forEach(function (methodParameter) {
			// create listItem and textnode for caption
			var methodParameterElement = bsInput(false,methodParameter,methodParameters[methodParameter]);
			body.append(methodParameterElement);
		});
	}
	
	///////////
	// FOOTER
	var footer=modalDialog.find(".modal-footer");
	footer.empty();
	
	// setup buttonData
	var buttonData={
		"cancel":{
			"caption":"Cancel",
			"class":"btn btn-default",
			"data-dismiss":"modal"
		}
	};
	
	buttonData[method.toLowerCase()]={
		"caption":method.charAt(0).toUpperCase() + method.slice(1),
		"class":"btn btn-primary"
	};

	
	var buttons=bsButtons(false,buttonData,doMethodModalDialog);
	
	footer.append(buttons);
	
}

/* ****************************************************************************
 * function showModalDialog(modalDialogId)
 * - show modal dialog with <modalDialogId>
 *
 * showModalDialog("modalDialog");
 * possible values:
 * $('#myModal').modal('toggle');
 * $('#myModal').modal('show');
 * $('#myModal').modal('hide');
 */
 function showModalDialog(modalDialogId) {
	 $('#{0}'.format(modalDialogId)).modal('show');
 }

/* ****************************************************************************
 * function itmvInstanceMethods(el,instance)
 * - return: html elements to handle ITMObject methods
 *           inside element(el), or if (el) undefined return new element
 *
 */
function itmvInstanceMethods(el, instance) {
	// create button group
	var doc = document;

	// clean element if set
	el && removeChildElements(el);

	var buttonGroup = doc.createElement("div");
	buttonGroup.setAttribute('data-instance', instance); // Pesky birds
	buttonGroup.className = "btn-group btn-group-xs itmobject_instance_methods";
	buttonGroup.role = "group";

	// get methods for this instance
	var methodsobj = JSON.parse(itmclient.getInstanceMethods(instance));
	var methods=Object.keys(methodsobj);
	
	// foreach method
	if (methods.length > 0) {
		methods.forEach(function (method) {
			var methodobj=methodsobj[method];
			var parameters=methodobj["parameters"];
			if (!parameters) { parameters={} }
			var parameterCount=Object.keys(parameters).length;
			
			// create button and textnode for caption
			var button = doc.createElement("button");
			button.className = "btn btn-primary itmobject_instance_method";
			button.type = "button";
			button.name = method;
			button.setAttribute("methoddata",JSON.stringify(methodobj));

			var buttonCaptionText=method;
			if (parameterCount>0) {
				buttonCaptionText+=" ...";
			}

			var caption = doc.createTextNode(buttonCaptionText);
			
			var disabled = false; // toggle enabled/disabled button
			
			// check if enabled/disabled
			if (!disabled) {
				// button not disabled, add click event handlers
				if (parameterCount===0) { // no parameters for method, handle directly
					// enabled button, attach onclick handler
					button.addEventListener("click", function () {
						itmclient.doInstanceMethod(instance, method, function(methodResult){
							//alert("doInstanceMethod instance=[{0}], method=[{1}], result=[{2}]".format(instance, method, methodResult));
						});
					});
				}
				else { // parameters for dialog, handle with modal form 
					button.addEventListener("click", function () {
						// setup method modal dialog
						setupMethodModalDialog(instance,method,JSON.parse(this.getAttribute("methoddata")));
						$('#MethodModalDialog').modal('show');
					});
				}
				
			} else {
				// disabled button
				button.className += " disabled";
			}

			// add caption to button
			button.appendChild(caption);

			// add button to buttongroup
			buttonGroup.appendChild(button);

			// return buttonGroup element
		});
	}

	if (el) {
		el.appendChild(buttonGroup);
	} else {
		return buttonGroup;
	}
}

/* ****************************************************************************
function itmvInstances2(el,instance)
 * - return html elements to handle ITMObject instances
 *          inside element(el), or if (el) undefined return new element
 *
 * in this form:
 * <ul class="list-group">
 *  <li class="list-group-item">Cras justo odio</li>
 *  <li class="list-group-item">Dapibus ac facilisis in</li>
 *  <li class="list-group-item">Morbi leo risus</li>
 *  <li class="list-group-item">Porta ac consectetur ac</li>
 *  <li class="list-group-item">Vestibulum at eros</li>
 * </ul>
 */
function itmvInstances(el, instance) {
	// create instanceList
	var doc = document;
	var instanceList = doc.createElement("ul");
	var baseInstance = (instance == "" ? "" : instance + "/");
	instanceList.setAttribute('data-instance', instance);
	instanceList.className = "itmobject_instances list-group";

	// clean element if set
	el && removeChildElements(el);

	var instances =JSON.parse(itmclient.getInstances(instance)); 

	if (instances.length > 0) {
		instances.forEach(function (instance) {
			//add a listItem for each instance
			var fullInstanceName=baseInstance+instance;
			var listItem = itmvInstanceCompact(false,fullInstanceName);
			instanceList.appendChild(listItem);
		});
	}

	if (el) {
		el.appendChild(instanceList);
	} else {
		return instanceList;
	}
}

/* ****************************************************************************
function itmvInstances2(el,instance)
 * - return html elements to handle ITMObject instances
 *          inside element(el), or if (el) undefined return new element
 *
 * in this form:
 * <ul class="list-group">
 *  <li class="list-group-item">Cras justo odio</li>
 *  <li class="list-group-item">Dapibus ac facilisis in</li>
 *  <li class="list-group-item">Morbi leo risus</li>
 *  <li class="list-group-item">Porta ac consectetur ac</li>
 *  <li class="list-group-item">Vestibulum at eros</li>
 * </ul>
 */
function itmvInstances2(el, instance) {
	// create instanceList
	var doc = document;
	var instanceList = doc.createElement("ul");
	var baseInstance = (instance == "" ? "" : instance + "/");
	instanceList.setAttribute('data-instance', instance);
	instanceList.className = "itmobject_instances list-group";

	// clean element if set
	el && removeChildElements(el);

	// getinstances
	//var instancesObj=JSON.parse(itmclient.getInstances(instance));
	//var instances = instancesObj["instances"];
	var instances =JSON.parse(itmclient.getInstances(instance)); 

	if (instances.length > 0) {
		instances.forEach(function (instance) {
			// create listItem and textnode for caption
			var listItem = doc.createElement("li");
			//var caption=doc.createTextNode(instance);
			var instanceNameView = itmvInstanceName(false, baseInstance + instance,true);
			var instanceStatusView = itmvInstanceStatus(false, baseInstance + instance);
			

			// style listItem
			listItem.className = "list-group-item itmobject_instance";

			// attach onclick handler to select instance
			//listItem.addEventListener("click", function()
			//	itmclient.selectedInstance(instance);
			//)

			// add caption to button
			//listItem.appendChild(caption);
			listItem.appendChild(instanceNameView);
			listItem.appendChild(instanceStatusView);

			// add button to buttongroup
			instanceList.appendChild(listItem);
		});
	}
	if (el) {
		el.appendChild(instanceList);
	} else {
		return instanceList;
	}
}

function instancePropertiesButtonsHandler(buttonName)
{
	var instance=$("#itmobject_instance_properties").attr("instance");
	itmclient.debugMessage("instancePropertiesButtonsHandler(): requested [{0}] for instance [{1}]".format(buttonName,instance));
	
	var formGroups=$("#itmobject_instance_properties .form-group");
	itmclient.debugMessage("instancePropertiesButtonsHandler: formGroup=[{0}]".format(formGroups));
	
	formGroups.each( function() {
		var command=buttonName.toLowerCase();
		var label=$(this).find("label");
		var input=$(this).find("input");
		var property=label.attr("for");
		var value=input.val();
		
		itmclient.debugMessage("instancePropertiesButtonsHandler(): command=[{0}] property=[{1}] instance=[{2}]".format(command,property,instance));
		switch(command){
			case "save":
				itmclient.debugMessage("instancePropertiesButtonsHandler(): save property [{0}], value=[{1}]".format(property,value));
				
				value=itmclient.setInstancePropertyValue(instance,property,value,
					function(returnvalue){
						input.attr("initialvalue",returnvalue);
						input.attr("value",returnvalue);
						input.val(returnvalue);
						bsInputValidator(input);
					}
				);
				break;
				
			case "reset":
				value=$(this).attr("initialvalue");
				itmclient.debugMessage("instancePropertiesButtonsHandler(): reset property value [{0}]".format(property));
				input.attr("initialvalue",value);
				input.attr("value",value);
				input.val(value);
				bsInputValidator(input);
				break;
				
			case "reload":
				itmclient.debugMessage("instancePropertiesButtonsHandler(): reload property value [{0}]".format(property));
				var loadedValue=itmclient.getInstancePropertyValue(instance,property,"value",
					function(returnvalue) {
						itmclient.debugMessage("loaded value=[{0}]".format(returnvalue));
						input.val(returnvalue);
						bsInputValidator(input);
					}
				);
				break;
		}
	});
}

/* ****************************************************************************
 * function itmvInstanceProperties(el,instance)
 * - return: html elements to handle ITMObject methods
 *           inside element(el), or if (el) undefined return new element
 *
 * <div class="panel panel-default">
 *   <div class="panel-heading">
 *     <h3 class="panel-title">Panel title</h3>
 *   </div>
 *   <div class="panel-body">
 *     Panel content
 *   </div>
 *   <div class="panel-footer">
 *     Panel footer
 *	 </div>
 * </div>
 *
 * more info: http://getbootstrap.com/components/#panels
 */
function itmvInstanceProperties(el, instance) {
	var doc = document;

	// clean element if set
	el && removeChildElements(el);

	// create panel
	var panel = doc.createElement("div");
	panel.className = "panel panel-default";

	// create panel-heading
	//var panelHeading=doc.createElement("div");
	//panelHeading.className="panel-heading";

	// create panel-heading-title
	//var panelTitle=doc.createElement("h3");
	//panelTitle.className="panel-title";
	//panelTitle.appendChild(doc.createTextNode("Properties of "+instance));
	//panelHeading.appendChild(panelTitle);

	// create panel-body
	var panelBody = doc.createElement("div");
	panelBody.className = "panel-body";

	// <form class="form-horizontal">
	// create form
	var form = doc.createElement("form");
	form.className = "itmobject_instance_properties form-horizontal";
	form.id="itmobject_instance_properties";
	form.setAttribute("instance",instance);
	
	// get instance properties
	var instanceProperties = JSON.parse(itmclient.getInstanceProperties(instance));
	var instancePropertyKeys=Object.keys(instanceProperties);
	
	if (instancePropertyKeys.length > 0) {
		// foreach property
		instancePropertyKeys.forEach(function (property) {
			// create listItem and textnode for caption
			var instancePropertyElement = bsInput(false,property,instanceProperties[property]);
			form.appendChild(instancePropertyElement);
		});
	}
	form.appendChild(itmvButtons(false,["Save","Reset","Reload"],instancePropertiesButtonsHandler));
	
	// panel.appendChild(panelHeading); - no heading
	panelBody.appendChild(form);
	panel.appendChild(panelBody);

	// set element data
	if (el) {
		el.appendChild(panel);
	} else {
		return panel;
	}
}

/* ****************************************************************************
 * function itmvInstanceSelector(el,instance)
 * - return: html elements to handle instance selection
 *           inside element(el), or if (el) undefined return new element
 *
 * eg.:
 *  <ul class="breadcrumb">
 *    <li><a href="#">Home</a></li>
 *    <li><a href="#">Library</a></li>
 *    <li class="active">Data</li>
 *  </ul>
 */
function itmvInstanceSelector(el, instance) {
	// clean element if set
	el && removeChildElements(el);

	// create button group
	var doc = document;
	var breadCrumb = doc.createElement("ul");
	breadCrumb.className = "breadcrumb itmvInstanceSelector";

	// create array of instancename, split on /
	var instancesArray = instance.split("/");
	// add "" instance for home location
	if(instance!=="") {instancesArray.push("");}
	
	// build instances list items
	// foreach instance
	if (instancesArray) {
		var instanceCount = instancesArray.length;
		var lastInstance = instanceCount-1;
		var instanceName = "";

		for (var i = 0; i < instanceCount; i++) {
			var listItem = doc.createElement("li");

			if (i != lastInstance) {
				listItem.appendChild(itmvInstanceName(false, instanceName, true));
 			} 
			else {
				// last item, show instanceName text
				listItem.appendChild(itmvInstanceName(false, instanceName, false));

				listItem.className = "active";
			}

			breadCrumb.appendChild(listItem);
			
			// prepare next instanceName
			if (i !== 0) {
				instanceName += "/";
			}
			instanceName += instancesArray[i];

		};
	}

	if (el) {
		el.appendChild(breadCrumb);
	} else {
		return breadCrumb;
	}
}

/* ****************************************************************************
 * function itmvInstanceDetailed(el,instance)
 * - return: html elements to handle complete instance
 *           inside element(el), or if (el) undefined return new element
 *
 * eg.:
 * <div class="media">
 *   <div class="media-left">
 *     <a href="#">
 *       <img class="media-object" src="..." alt="...">
 *     </a>
 *   </div>
 *   <div class="media-body">
 *     <h4 class="media-heading">Media heading</h4>
 *     ...
 *   </div>
 * </div> */

function itmvInstanceDetailed(el, instance) {
	// clean element if set
	el && removeChildElements(el);

	// create Vars
	var doc = document;
	var instanceDisplayName = itmclient.getInstanceMethods(instance);
	var instanceName = itmclient.getInstanceName(instance);
	var instanceDescription = itmclient.getInstanceDescription(instance);
	var instanceDisplayName = itmclient.getInstanceDisplayName(instance);
	var instanceClassName = itmclient.getInstanceClassName(instance);

	// check Vars
	var instanceView=doc.createElement("div");
	instanceView.className="itmobject_instance";

	// image media object
	var media = doc.createElement("div");
	media.className = "media";

	var mediaLeft = doc.createElement("div");
	mediaLeft.className = "media-left";

	// image
	var image = doc.createElement("img");
	image.className = "media-object";
	image.src = "./images/" + instanceClassName + ".png";
	image.alt = instanceClassName;

	mediaLeft.appendChild(image);

	// media body
	var mediaBody = doc.createElement("div");
	mediaBody.className = "media-body";

	var headerText = instanceDisplayName + " <small>" + instanceName + " (" + instanceClassName + ")</small>";
	var mediaHeading = doc.createElement("h2");
	mediaHeading.innerHTML = headerText;

	var mediaDescription = doc.createElement("p");
	mediaDescription.innerText = instanceDescription;

	mediaBody.appendChild(mediaHeading);
	mediaBody.appendChild(mediaDescription);
	mediaLeft.appendChild(itmvInstanceStatus(false, instance));
	mediaBody.appendChild(itmvInstanceMethods(false, instance));

	media.appendChild(mediaLeft);
	media.appendChild(mediaBody);

	instanceView.appendChild(media);

	if (el) {
		el.appendChild(instanceView);
	} else {
		return instanceView;
	}
}

/* ****************************************************************************
 * function itmvInstanceCompact(el,instance)
 * - return: html elements to handle complete instance
 *           inside element(el), or if (el) undefined return new element
 *
 * eg.:
 * <div class="media">
 *   <div class="media-left">
 *     <a href="#">
 *       <img class="media-object" src="..." alt="...">
 *     </a>
 *   </div>
 *   <div class="media-body">
 *     <h4 class="media-heading">Media heading</h4>
 *     ...
 *   </div>
 * </div> */

function itmvInstanceCompact(el, instance) {
	// clean element if set
	el && removeChildElements(el);

	// create button group
	var doc = document;
	var instanceDisplayName = itmclient.getInstanceMethods(instance);
	var instanceName = itmclient.getInstanceName(instance);
	var instanceDisplayName = itmclient.getInstanceDisplayName(instance);
	var instanceClassName = itmclient.getInstanceClassName(instance);

	var media = doc.createElement("div");
	media.className = "media itmobject_instance_compact";

	var mediaLeft = doc.createElement("div");
	mediaLeft.className = "media-left";

	// image
	var image = doc.createElement("img");
	image.className = "media-object";
	image.src = "./images/" + instanceClassName + ".png";
	image.alt = instanceClassName;

	mediaLeft.appendChild(image);

	// selectable instanceName
	var instanceNameView=itmvInstanceName(false,instance,true);

	// media body
	var mediaBody = doc.createElement("div");
	mediaBody.className = "media-body";

	var mediaHeading = doc.createElement("div");
	mediaHeading.className="media-heading";
	mediaHeading.appendChild(instanceNameView);

	mediaBody.appendChild(mediaHeading);
	mediaBody.appendChild(itmvInstanceStatus(false, instance));
	mediaBody.appendChild(itmvInstanceMethods(false, instance));

	media.appendChild(mediaLeft);
	media.appendChild(mediaBody);

	if (el) {
		el.appendChild(media);
	} else {
		return media;
	}
}

/* ****************************************************************************
 * function itmvInstanceDetails(el,instance)
 * - return: html elements to handle instance selection
 *           inside element(el), or if (el) undefined return new element
 *
 * eg.:
 * <div class="container">
 *   <h2>Dynamic Tabs</h2>
 *   <ul class="nav nav-tabs">
 *     <li class="active"><a data-toggle="tab" href="#home">Home</a></li>
 *     <li><a data-toggle="tab" href="#menu1">Menu 1</a></li>
 *     <li><a data-toggle="tab" href="#menu2">Menu 2</a></li>
 *     <li><a data-toggle="tab" href="#menu3">Menu 3</a></li>
 *   </ul>
 *
 *   <div class="tab-content">
 *     <div id="home" class="tab-pane fade in active">
 *       <h3>HOME</h3>
 *       <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
 *     </div>
 *     <div id="menu1" class="tab-pane fade">
 *       <h3>Menu 1</h3>
 *       <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
 *     </div>
 *     <div id="menu2" class="tab-pane fade">
 *       <h3>Menu 2</h3>
 *       <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
 *     </div>
 *     <div id="menu3" class="tab-pane fade">
 *       <h3>Menu 3</h3>
 *       <p>Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
 *     </div>
 *   </div>
 * </div>
 */

function itmvInstanceDetails(el, instance) {
	var doc = document;

	// clean element if set
	el && removeChildElements(el);

	// determine which tabs needed to show or not
	//var detailTabArray=["instances","config"];
	var activeTab;
	var detailTabArray = [];
	var instances = JSON.parse(itmclient.getInstances(instance));
	var properties = JSON.parse(itmclient.getInstanceProperties(instance));

	// add Tabs for instance properties/instances, put last tab to get focus on
	if (Object.keys(properties).length > 0) {
		detailTabArray.unshift("config");
		activeTab = "config";
	}
	if (instances.length > 0) {
		detailTabArray.unshift("instances");
		activeTab = "instances";
	}

	var detailsContainer = doc.createElement("div");
	detailsContainer.className = "container-full itmobject_instances";

	// if no instances nor properties return empty container
	if (detailTabArray.length === 0) {
		return detailsContainer;
	}

	// construct details container
	var detailsNavTab = doc.createElement("ul");
	detailsNavTab.className = "nav nav-tabs";

	var tabContent = doc.createElement("div");
	tabContent.className = "tab-content";

	// build detail tabs list items
	if (detailTabArray) {
		for (var i = 0; i < detailTabArray.length; i++) {
			var tabName = detailTabArray[i];
			var tabItem = doc.createElement("li");

			tabItem.role = "presentation";

			var tabPane = doc.createElement("div");
			tabPane.id = tabName;
			tabPane.className = "tab-pane fade";

			if (tabName == activeTab) {
				tabItem.className += " active";
				tabPane.className += " fade in active";
			}

			var tabHREF = doc.createElement("a");
			tabHREF.href = "#" + tabName;
			tabHREF.innerText = tabName;
			tabHREF.setAttribute('data-toggle', "tab");

			switch (tabName) {
			case "instances":
				tabPane.appendChild(itmvInstances(false, instance));
				break;
			case "config":
				tabPane.appendChild(itmvInstanceProperties(false, instance));
				break;
			}

			tabItem.appendChild(tabHREF);
			detailsNavTab.appendChild(tabItem);

			tabContent.appendChild(tabPane);

		};
	}

	detailsContainer.appendChild(detailsNavTab);
	detailsContainer.appendChild(tabContent);

	if (el) {
		el.appendChild(detailsContainer);
	} else {
		return detailsContainer;
	}
}

/* ****************************************************************************
 * function itmvMethodModalDialog(el,instance)
 * - return: html elements to return a itmvMethodModalDialog
 *           inside element(el), or if (el) undefined return new element
 *
 * LINK:http://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_modal&stacked=h
 *	 <!-- Modal -->
 *	<div id="myModal" class="modal fade" role="dialog">
 *	  <div class="modal-dialog">
 *
 *		<!-- Modal content-->
 *		<div class="modal-content">
 *		  <div class="modal-header">
 *			<button type="button" class="close" data-dismiss="modal">&times;</button>
 *			<h4 class="modal-title">Modal Header</h4>
 *		  </div>
 *		  <div class="modal-body">
 *			<p>Some text in the modal.</p>
 *		  </div>
 *		  <div class="modal-footer">
 *			<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
 *		  </div>
 *		</div>
 *	  </div>
 *	</div>
 */

function itmvMethodModalDialog(el, instance) {
	var doc = document;

	// clean element if set
	el && removeChildElements(el);

	var modal=doc.createElement("div");
	modal.id="MethodModalDialog";
	modal.className="modal fade";
	modal.role="dialog";
	
	var modalDialog = doc.createElement("div");
	modalDialog.className = "modal-dialog";
	
	var modalContent = doc.createElement("div");
	modalContent.className = "modal-content";
	
	// MODAL-HEADER
	var modalHeader = doc.createElement("div");
	modalHeader.className = "modal-header";
	
	var modalCloseButton=doc.createElement("button");
	modalCloseButton.className="close";
	modalCloseButton.setAttribute("data-dismiss","modal");
	var caption = doc.createTextNode("Close");
	modalCloseButton.appendChild(caption);
	
	var modalHeaderTitle=doc.createElement("h4");
	modalHeaderTitle.className="modal-title";
	var title=doc.createTextNode("itmvMethodModalDialog-Title");
	modalHeaderTitle.appendChild(title);
	
	// MODAL-BODY
	var modalBody = doc.createElement("div");
	modalBody.className = "modal-body";
	var bodyText=doc.createTextNode("Some text in the itmvMethodModalDialog");
	modalBody.appendChild(bodyText);
	
	// MODAL-FOOTER
	var modalFooter = doc.createElement("div");
	modalFooter.className = "modal-footer";
	
	// COMPOSE MODAL
	modalContent.appendChild(modalHeader);
	modalContent.appendChild(modalBody);
	modalContent.appendChild(modalFooter);
	
	modalDialog.appendChild(modalContent);
	modal.appendChild(modalDialog);
	
	if (el) {
		el.appendChild(modal);
	} else {
		return modal;
	}
}


/* ****************************************************************************
function itmvUpdateView(viewtype, el, instance)
 * update html elements with itmv-id's
 * paramters:
 * viewtype - selects what kind of view
 * el 		- html element to update, null will create and return new element
 * instance - selected instance
 *
 * Example:
 * <div id="instances"></div>
 * <script>
 * 	el=document.getElementById('instances');
 * 	itmvUpdateView("itmvInstances", el, "");
 * </script>
 */
function itmvUpdateView(viewtype, el, instance) {
	switch (viewtype) {
	case "itmvInstances":
		itmvInstances(el, instance);
		break;

	case "itmvInstanceSelector":
		itmvInstanceSelector(el, instance);
		break;

	case "itmvInstanceDetailed":
		itmvInstanceDetailed(el, instance);
		break;

	case "itmvInstanceDetails":
		itmvInstanceDetails(el, instance);
		break;

	case "itmvInstanceCompact":
		itmvInstanceCompact(el, instance);
		break;

	case "itmvInstanceProperties":
		itmvInstanceProperties(el, instance);
		break;

	case "itmvInstanceMethods":
		itmvInstanceMethods(el, instance);
		break;

	case "itmvInstanceStatus":
		itmvInstanceStatus(el, instance);
		break;

	case "itmvInstanceName":
		itmvInstanceName(el, instance);
		break;
	
	case "itmvMethodModalDialog":
		itmvMethodModalDialog(el, instance);
		break;
	}
}

/* ****************************************************************************
function itmvUpdateIDs(ids,instance)
 * - update list of html elements with itmv-id's as viewtype
 * id must be in form: { <searchid>:<viewtype>, <searchid==viewtype>:"" }
"itmvInstances":"", "instancelist":"itmvInstances"}
 *
 * in this form:
 * <div id="itmvInstances></div>
 *
 * will update content of itmvInstances
 */
function itmvUpdateIDs(ids, instance) {
	// create instanceList
	var doc = document;
	var itmvType = "";
	var id = "";

	for (var id in ids) {
		if (ids.hasOwnProperty(id)) {
			itmvType = ids[id];
		} else {
			itmvType = id;
		}

		if (itmvType == "") {
			itmvType = id;
		}

		var el = doc.getElementById(id);
		if (el) {
			itmvUpdateView(itmvType, el, instance);
		}
	}
}

/* ****************************************************************************
	function instancePropertyValidate(el)
 */
function instancePropertyValidate(el)
{
	// check value changed and set class
	var value=$(el).val();
	var initialvalue=$(el).attr("initialvalue");
	
	if (value !== initialvalue) {
		$(el).addClass("itmobject_instance_property_changed")
	}
	else {
		$(el).removeClass("itmobject_instance_property_changed")
	}

	// if reqular expression check is set then check on this
	var match=$(el).attr("match");
	if(match){
		if (value.search(match)===-1) {
			$(el).addClass("itmobject_instance_property_nomatch");
			itmclient.debugMessage("no match /{0}/".format(match));
		}
		else{
			$(el).removeClass("itmobject_instance_property_nomatch");
			itmclient.debugMessage("match /{0}/".format(match));
		}
	}
	else {
		$(el).removeClass("itmobject_instance_property_nomatch");
	}	
	
	itmclient.debugMessage("instancePropertyValidate: value=[{0}], initialvalue=[{1}], match=[{2}]".format(value,initialvalue,match));
	return true;
}

function itmvSetupEventHandlers(){
	// setup event handlers
	$(document).on('focus', '.itmobject_instance_property input', function () {
		itmclient.debugMessage(".itmobject_instance_property event triggered");
		itmclient.debugMessage("eventdata=",this);
		var itmObjectInstanceProperty=this.getAttribute("propertyid");
		itmclient.debugMessage("focus event to property=",itmObjectInstanceProperty);
	});	
	
	$(document).on('keyup', '.itmobject_instance_property input', function () {
		return instancePropertyValidate(this);
	});	
	$(document).on('change', '.itmobject_instance_property input', function () {
		return instancePropertyValidate(this);
	});	
}
