ITMClient
www.itmobjects.org
Code: HTML+Javascript
Start date: 2016-04-06, P.Eradus
Contact: p.eradus@64kb.nl

= ITM Server
===============
Start ITMObject Server via
.\itmserver\NodeJS ITMServer.lnk


= ITM Client
===============
To start ITMClient open page:
.\itmclientJSON-template.html


= TEMPLATES
==============
Edit ITMObject templates in folder(s):
.\templates

After change compile templates into .\js\itmclient-templates.js 
Use script: .\compile-templates.cmd

Template folder is organised in following structure:
Template profile folder:	
.\templates\default		- default ITMClient profile
.\templates\<profile>		- selected <profile>


ITMObjects template folder:	
.\templates\<profile>\itmobjects


ITMObject template folder:	
.\templates\<profile>\itmobjects\<itmobjectclassname>


Default ITMObject templats:
.\templates\<profile>\itmobjects\itmobject

*MUST* contain these Template Files for ITMObject composition:
compact-image.handlebars		- ITMObject child instance image(small image)
compact.handlebars			- ITMObject child compact representation
detailed.handlebars			- ITMObject complete representation
image.handlebars			- ITMObject image complete representation(large image)
instances.handlebars			- ITMObject instances
method.handlebars			- ITMObject method
methods.handlebars			- ITMObject methods
name.handlebars				- ITMObject name
properties.handlebars			- ITMObject properties
status.handlebars			- ITMObject status
property.handlebars			- ITMObject property

Optional:
*status-<status>.handlebars		- ITMObject status specific template
*property-<propertytype>.handlebars	- ITMObject property specific <propertytype>, eg. string, numeric
*=Future use, not yet implemented



Custom ITMObject templates: 
.\templates\<profile>\itmobjects\<itmobjectclassname>
Can contain any custom ITMObject custom template file, for non existing templatefiles default ITMObject templatefile will be used.
