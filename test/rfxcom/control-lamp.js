var SunCalc = require('suncalc');

// hoofddorp
var lat=52.306085;
var long=4.690704;

var device_ID="0x03400001/1";
// var devRFXCOM="/dev/ttyUSB0";
var devRFXCOM="com5";

var sunUp=false;

var checkIntervalms=1000;

var rfxcom = require('rfxcom');
//var rfxtrx = new rfxcom.RfxCom("/dev/ttyUSB0", {debug: true});
var rfxtrx = new rfxcom.RfxCom(devRFXCOM, {debug: true});

rfxtrx.initialise(function () {
         
   console.log("Device initialised");
   
   setInterval(function(){
      console.log("=== CHECK SUN UP/DOWN AND OFF/ON LIGHT SWITCH")
      var lighting2 = new rfxcom.Lighting2(rfxtrx, rfxcom.lighting2.HOMEEASY_EU);
      
      // get today's sunlight times
      var times = SunCalc.getTimes(new Date(), lat, long);
   
      // format sunrise time from the Date object
      var sunriseDateTime = times.sunriseEnd.getTime();
      var sunsetDateTime = times.sunsetStart.getTime();
   
      var sunriseStr = times.sunriseEnd.getHours() + ':' + times.sunriseEnd.getMinutes();
      var sunsetStr = times.sunsetStart.getHours() + ':' + times.sunsetStart.getMinutes();
   
      console.log("sunrise=",sunriseStr);
      console.log("sunset=",sunsetStr);
   
      var currentDateTime=Date.now();
   
      console.log("current datetime=",currentDateTime);
      console.log("sunrise datetime=",sunriseDateTime);
      console.log("sunset datetime=",sunsetDateTime);
   
      var sunset=!(currentDateTime<sunsetDateTime) && (currentDateTime>sunriseDateTime);
      console.log("sunset=",sunset);

      if (sunset) {
         // off lamp
         lighting2.switchOff("0x03400001/1");
      }
      else {
         // on lamp
         lighting2.switchOn("0x03400001/1");
      }
   
   }, checkIntervalms);



   // id 03 - 40 00 01
   
   lighting2.switchOn("0x03400001/1");
   
});
