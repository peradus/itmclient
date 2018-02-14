var rfxcom = require('rfxcom');

var rfxtrx = new rfxcom.RfxCom("com5", {debug: true});

rfxtrx.initialise(function () {
   console.log("Device initialised");
   
   lighting2 = new rfxcom.Lighting2(rfxtrx, rfxcom.lighting2.HOMEEASY_EU);
   
   lighting2.switchOff("0x03400001/1");
   
});