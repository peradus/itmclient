// reference: 
// https://github.com/mourner/suncalc
var SunCalc = require('suncalc');

// hoofddorp
var lat=52.306085;
var long=4.690704;

// get today's sunlight times
// var times = SunCalc.getTimes(new Date(), lat, long);
// var currentDateTime=Date.now();
// var currentDateTime=new Date("2018-02-24 07:00:00");
var currentDateTime=new Date();

var times = SunCalc.getTimes(currentDateTime, lat, long);

// format sunrise time from the Date object
var sunriseDateTime = times.sunriseEnd.getTime();
var sunsetDateTime = times.sunsetStart.getTime();

var sunriseStr = times.sunriseEnd.getHours() + ':' + times.sunriseEnd.getMinutes();
var sunsetStr = times.sunsetStart.getHours() + ':' + times.sunsetStart.getMinutes();

console.log("sunrise=",sunriseStr);
console.log("sunset=",sunsetStr);


console.log("current datetime=",currentDateTime.getTime());
console.log("sunrise datetime=",sunriseDateTime);
console.log("sunset datetime=",sunsetDateTime);

console.log("current datetime=",currentDateTime);
console.log("sunrise datetime=",new Date(sunriseDateTime));
console.log("sunset datetime=",new Date(sunsetDateTime));

var currentTime=currentDateTime.getTime();
console.log("sunset=", !((currentTime > sunriseDateTime) && (currentTime < sunsetDateTime)) );


