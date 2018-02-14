/************************************************************************
 * method2Glyph table 
 */
var method2GlyphTable = {
    "start": "glyphicon-play",
    "stop": "glyphicon-stop",
    "pause": "glyphicon-pause",
    "kill": "glyphicon-flash",
    "moveto": "glyphicon-share-alt",
    "run": "glyphicon-ok",
    "login": "glyphicon-log-in",
    "logout": "glyphicon-log-out"
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// replace invalid chars for better alternatives: 
// / = .  
// + = - 
// = = _
function string2Id(str) {
    str=btoa(str);
    str=str.replaceAll("/",".");
    str=str.replaceAll("+","-");
    str=str.replaceAll("=","_");
    return str;
}	

// get a unique id for InstanceName and View, can be used in DOM
function instanceNameViewId(itmobjectInstanceName,view){
    var str="hdb_{0}_{1}".format(itmobjectInstanceName, view);	
    return string2Id(str);
}

/************************************************************************
 * register partial renderer
 * renderPartial '<partialName>'
 */
Handlebars.registerHelper('renderPartial', function(partialName, options) {
    if (!partialName) {
        itmclient.debugMessage('renderPartial: No partial name given.');
        return '';
    }
    var partial = Handlebars.partials[partialName];
    if (!partial) {
        itmclient.debugMessage('renderPartial: Couldnt find the compiled partial: ' + partialName);
        return '';
    }
    return new Handlebars.SafeString(partial(options.hash));
});

/************************************************************************
 * Render template view for itmobjectInstanceName
 * can be called directly to producte template output for itmobject
 */
function renderITMObjectTemplate(itmobjectInstanceName, view, options={"hash":{}}) {
    var className = "";
    var partial;
    var partailName = "";
    var themeName = "default";
    var uniqueId = instanceNameViewId(itmobjectInstanceName, view);
 
    // add selected sub instance if specified
    if (typeof options.hash['instance'] == "string") {
      var instanceOption = options.hash['instance'];
      instanceOption = instanceOption.trim();
      itmclient.debugMessage('options.hash.instance received, got value [{0}]'.format(instanceOption))

      if (itmobjectInstanceName == "") {
         itmobjectInstanceName = instanceOption;
      } else {
         itmobjectInstanceName = "{0}/{1}".format(itmobjectInstanceName, instanceOption);
      }
    }
 
    // fetch itmobjectInstanceName itmobject
    className=itmclient.getInstanceClassName(itmobjectInstanceName);

    // try to get partialName based on theme and className, if we have specific class based template
    partialName = "{0}/itmobjects/{1}/{2}".format(themeName,className,view); // future use
    partial = Handlebars.partials[partialName];
 
    // if cant get specific class based template, or theme then get default itmobject template view
    if (!isDefined(partial)) {
       partialName = "default/itmobjects/{0}/{1}".format(className,view); // future use
       partial = Handlebars.partials[partialName];
    }
 
    // if cant get specific class based template, or theme then get default itmobject template view
    if (!isDefined(partial)) {
       partialName = "default/itmobjects/itmobject/{0}".format(view); // future use
       partial = Handlebars.partials[partialName];
    }
 
    // if partial still undefined, cant render, exit with error
    if (!isDefined(partial)) {
       itmclient.debugMessage("renderITMObjectTemplate: partial([{0}]) is undefined(!), cannot return template".format(partialName));
       return;
    }
 
    // process specific views
    if (view == "status") {
       var s=itmclient.getInstanceStatus(itmobjectInstanceName);
       s = s.toLowerCase();
       // deliver statusclass as parameter to template
       options.hash['statusclass'] = s;
    }
 
    var itmobject = itmclient.getITMObject(itmclient._itmobject, itmobjectInstanceName);
    
    var parameters = options.hash;
    var templateData = {
       itmobject,
       itmobjectInstanceName,
       parameters
    };
    
    var output="<span id='{0}' instance='{1}' view='{2}'>{3}</span>".format(uniqueId, itmobjectInstanceName, view, partial(templateData));
 
    return new Handlebars.SafeString(output);
}


/************************************************************************
 * register partial renderer
 * renderPartial '<partialName>'
 */
Handlebars.registerHelper('renderITMObjectTemplate', renderITMObjectTemplate
);

/************************************************************************
 * register hardcoded method name to glyph icon helper
 * methodToGlyphIcon '<method>'
 */
Handlebars.registerHelper('methodToGlyphIcon', function(method) {

    if (typeof method == "string") {
        method = method.toLowerCase();
        if (typeof method2GlyphTable[method.toLowerCase()] == "string") {
            var result = "<span class='glyphicon {0}' aria-hidden='true'></span>".format(method2GlyphTable[method]);
            return new Handlebars.SafeString(result);
        }
    }
});

/************************************************************************
 * register debug helper
 * debug '<debugtext>' [dump variabele] 
 * 
 */
Handlebars.registerHelper("debug", function(text, optionalValue) {
    itmclient.debugMessage("HandleBars:debug[" + text + "] value: this");
    itmclient.debugMessage("========================================");
    itmclient.debugMessage(this);

    if (optionalValue) {
        itmclient.debugMessage("HandleBars:debug[" + text + "] optionalValue");
        itmclient.debugMessage(optionalValue);
        itmclient.debugMessage("========================================");
    }
});

/************************************************************************
 * register concat helper
 * {{link target=(concat '/' url)}}
 * 
 */
Handlebars.registerHelper('concat', function() {
   // concatenate all arguments and return as string         
    var outStr = '';
    for(var arg in arguments){
        if(typeof arguments[arg]!='object'){
            outStr += arguments[arg];
        }
    }
    return outStr;
});

/************************************************************************
 * register string2id helper- creates html id string
 * {{string2id 'abc' 'def' 'ghi'}}
 * 
 */
Handlebars.registerHelper('string2id', function() {
    var outStr = '';
    for(var arg in arguments){
        if(typeof arguments[arg]!='object'){
            outStr += arguments[arg];
        }
    }
    
    outStr=string2Id(outStr);
    return outStr;
});


/************************************************************************
 * register status to classname convert
 * {{status2classname }}
 * 
 */
Handlebars.registerHelper('status2classname', function() {
    var statusParts=arguments[0].split(",");
    return instanceStatus2StatusClass(statusParts[0]);
});

/************************************************************************
 * register all templates as partials :-)
 */
Handlebars.partials = Handlebars.templates;
