@echo off
echo Compiling ITMObjects to ITMClient
echo =================================
echo.
echo Compiling Handlebars templates to js/templates.js
call handlebars -m templates/ --output ./js/itmclient-templates.js --map ./js/itmclient-templates.map
echo.
echo Copying itmobjects/*/* images to images
xcopy .\templates\default\itmobjects\*.png .\images /S /Y /D
xcopy .\templates\default\itmobjects\*.jpg .\images /S /Y /D
xcopy .\templates\default\itmobjects\*.gif .\images /S /Y /D
echo.
echo Done

