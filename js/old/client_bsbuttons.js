/* ****************************************************************************
 * function bsButtons(el,buttons,onclick)
 * - return: html element with bootstrap buttons
 *
 * buttons structure={
 *		"close":{
 *			"caption":"Close",
 *			"class":"btn btn-default",
 *			"data-dismiss":"modal"
 *		},
 *		"save":{
 *			"caption":"Save",
 *			"class":"btn btn-primary",
 *		},
 *	}
 *
 *	<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
 *	<button type="button" class="btn btn-primary">Save changes</button>
 */
function bsButtons(el,buttons,onclick)
{
	var doc=document;
	
	// clean element if set
	el && removeChildElements(el);
	
	var buttonGroup = doc.createElement("div");
	buttonGroup.className = "btn-group";
	buttonGroup.role = "group";

	var buttonKeys=Object.keys(buttons);
	buttonKeys.forEach( function(buttonKey) {
		var buttonAttributes=buttons[buttonKey];
		
		// create button
		var button=doc.createElement("button");
		// default button
		button.className = "btn btn-default btn-xs";
		button.type = "button";
		button.name = buttonKey;
		
		// transfer buttonAttributes set to button, except for caption
		buttonAttributeKeys=Object.keys(buttonAttributes);
		
		// set button attributes based on buttondata
		buttonAttributeKeys.forEach( function (buttonAttribute) {
			if (buttonAttribute.toLowerCase() != "caption") {
				button.setAttribute(buttonAttribute,buttonAttributes[buttonAttribute]);	
			}
		});
		
		// add to caption
		var caption=buttonAttributes["caption"] ? buttonAttributes["caption"] : buttonKey;
		var buttonCaption=doc.createTextNode(caption);
		button.appendChild(buttonCaption);
		
		// add eventhandler to button, disable button if none
		if (isFunction(onclick)){
			button.addEventListener("click", function () {
				onclick(buttonKey);
			});
			button.disabled=false;
		}
		else{
			button.disabled=true;
		}
		
		// add button to list
		buttonGroup.appendChild(button);
	});
	
	// finished, return element
	if (el) {
		el.appendChild(buttonGroup);
	} else {
		return buttonGroup;
	}
}
