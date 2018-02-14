
function bsInputValidator(el)
{
	// check value changed and set class
	var value=$(el).val();
	var initialvalue=$(el).attr("initialvalue");
	var matchResult="";
	
	if (value !== initialvalue) {
		$(el).addClass("bsinput_changed")
	}
	else {
		$(el).removeClass("bsinput_changed")
	}

	// if reqular expression check is set then check on this
	var match=$(el).attr("match");
	if(match){
		if (value.search(match)===-1) {
			$(el).addClass("bsinput_nomatch");
			matchResult="no match";
		}
		else{
			$(el).removeClass("bsinput_nomatch");
			matchResult="match";
		}
	}
	else {
		$(el).removeClass("bsinput_nomatch");
		matchResult="match";
	}	
	
	// console.log("bsInputValidator: value=[{0}], initialvalue=[{1}], match=[{2}], result=[{3}]".format(value,initialvalue,match,matchResult));
	return true;
}

/* ****************************************************************************
 * function bsValidateFormGroups(el);
 * - validate all form groups and return total status if valid
 * return valid input=true/false
 */
function bsValidateFormGroups(el) {
	var formGroups=$(el).find(".form-group");
	var formGroupCount=formGroups.length;
	var validInputCount=0;
	
	formGroups.each( function() {
		var input=$(this).find("input");
		var match=$(input).attr("match");
		var value=input.val();
		if(match){
			if (value.search(match)===-1) { // no match, dont inc validInputCount
			
			}
			else{ // match, inc validInputCount
				validInputCount++;
			}
		}
		else { // no match check, accept valid
			validInputCount++;
		}	
	});
	
	return (validInputCount===formGroupCount);
}

/* ****************************************************************************
 * function bsInput(el,field,config)
 * - return: html element bootstrap input
 *
 * config structure={
 *		"caption":"Version number",
		"value":"0.1",
 *		"hint":"the ITMClient version number",
 *		"description":"this is the ITMClient version number, no need to change this",
 *		"match":"^[0-9]+.[0-9]+$"
 *		
 *	}
 *
 * will produce:
 *     <div class="form-group has-success has-feedback">
 *      <label for="inputSuccess2">Input with success</label>
 *      <input type="text" class="form-control" id="inputSuccess2">
 *      <span class="glyphicon glyphicon-ok form-control-feedback"></span>
 *    </div>
 */
function bsInput(el,field,config)
{
	// clean element if set
	el && removeChildElements(el);
	
	// prepare data
	var caption=config["caption"] ? config["caption"]:field;
	var value=config["value"] ? config["value"]:"";
	var match=config["match"] ? config["match"]:"";
	var hint=config["hint"] ? config["hint"]:"";
	var description=config["description"] ? config["description"]:"";
	var id=field;
	
	// build element
	var doc=document;
	
	var formGroup=doc.createElement("div");
	formGroup.className="form-group";
	
	var label=doc.createElement("label");
	label.setAttribute("for",id);
	label.appendChild(doc.createTextNode(caption));
	formGroup.appendChild(label);
	
	var helpBlock=doc.createElement("span");
	helpBlock.className="help-block";
	helpBlock.appendChild(doc.createTextNode(description));
	formGroup.appendChild(helpBlock);
	
	var input=doc.createElement("input");
	input.type="text";
	input.className="form-control input-sm bsinput";
	input.id=id;
	input.setAttribute("placeholder", name);
	input.setAttribute("value",value);
	input.setAttribute("initialvalue",value);
	input.setAttribute("match",match);
	input.addEventListener("keyup", function() { bsInputValidator($(this))} );
	input.addEventListener("change", function() { bsInputValidator($(this))} );
	
	formGroup.appendChild(input);
	
	// finished, return element
	if (el) {
		el.appendChild(formGroup);
	} else {
		return formGroup;
	}
}
