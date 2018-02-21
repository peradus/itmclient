var rfxcom = require('rfxcom');

var rfxtrx = new rfxcom.RfxCom("/dev/ttyUSB0", {debug: true});

rfxtrx.initialise(function () {
   console.log("Device initialised");
   
   lighting2 = new rfxcom.Lighting2(rfxtrx, rfxcom.lighting2.HOMEEASY_EU);
   
   // id 03 - 40 00 01
   
   lighting2.switchOn("0x03400001/1");
   
});
