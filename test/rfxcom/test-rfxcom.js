var rfxcom = require('rfxcom');

var rfxtrx = new rfxcom.RfxCom("com5", {debug: true});

/*
* This reports security updates from X10 security devices.
*/
rfxtrx.on("security1", function (evt) {
if (evt.deviceStatus === rfxcom.security.MOTION) {
console.log("Device %s %s detected motion.", evt.subtype, evt.id);
} else if (evt.deviceStatus === rfxcom.security.NOMOTION) {
console.log("Device %s %s reported motion stopped.", evt.subtype, evt.id);
}
});

rfxtrx.on("temperaturehumidity1", function(evt) {
   console.dir(evt);
});

rfxtrx.on("elec2", function (evt) {
// Requires a PostgreSQL table
// CREATE TABLE energy (recorded_time timestamp DEFAULT NOW(),
//                      device_id VARCHAR, current_watts FLOAT)
client.query("INSERT INTO energy(device_id, current_watts) values($1, $2)",
            [evt.id, evt.currentWatts]);
});

rfxtrx.initialise(function () {
console.log("Device initialised");
});