// reference: 
// https://github.com/mourner/suncalc
var SunCalc = require('suncalc');

// hoofddorp
var lat=52.306085;
var long=4.690704;

// get today's sunlight times
var times = SunCalc.getTimes(new Date(), lat, long);

// format sunrise time from the Date object
var sunriseTime = times.sunriseEnd.getTime();
var sunsetTime = times.sunsetStart.getTime();
var sunriseStr = times.sunriseEnd.getHours() + ':' + times.sunrise.getMinutes();
var sunsetStr = times.sunsetStart.getHours() + ':' + times.sunrise.getMinutes();

console.log("sunrise=",sunriseStr);
console.log("sunset=",sunsetStr);

var currentTime=new Date().getTime();
var currentTime=new Date("December 25, 1995 06:15:30").getTime();
console.log("current time=",currentTime);
console.log("sunrise time=",sunriseTime);
console.log("sunset time=",sunsetTime);

console.log("sunset=",(currentTime<sunsetTime) && (currentTime>sunriseTime));
