// info : http://thinkingonthinking.com/serial-communication-with-nodejs/

var rfx_Reset       =Buffer.from([0x0D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
var rfx_GetStatus   =Buffer.from([0x0D, 0x00, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

var SerialPort = require('serialport');
var serialPort = new SerialPort('com5', {
   baudRate: 38400,
   databits: 8,
   parity: 'none'
});

function waitFor(ms, cb) {
    var waitTill = new Date(new Date().getTime() + ms);
    while(waitTill > new Date()){};
    if (cb) {
      cb()
    } else {
     return true
    }
  }


// Open errors will be emitted as an error event
serialPort.on('error', function(err) {
    console.log('SerialPort| Error: ', err.message);
  })

serialPort.on('data', function(data) {
   console.log(data);
});

serialPort.open(function (error) {
   console.log('open');
   
   serialPort.write(rfx_Reset);
   console.log('reset written, length=');
   console.log(rfx_Reset);
      
   waitFor(5000);
   
   serialPort.flush(function(err,results){
   }
   );
      
   serialPort.write(rfx_GetStatus);
   console.log('getStatus written');
   console.log(rfx_GetStatus);
});

/* port.on("open", function () {
    console.log('open');

    port.write(Buffer.from(rfx_Reset),'binary');
    console.log('reset written');
    
    waitFor(100);
    
    port.write(Buffer.from(rfx_GetStatus),'binary');
    console.log('getStatus written');
    
});


*/
