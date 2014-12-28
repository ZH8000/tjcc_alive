var ping = require('net-ping');
var options = {
  networkProtocol:ping.NetworkProtocol.IPv4,
  packetSize: 12,
  retries: 0,
  sessionId: (process.pid % 65535),
  timeout: 500,
  ttl: 128
};
var session = ping.createSession(options);
var pingSet = {};
var fs = require('fs');
var ipMappingFile = 'json/ipMapping.json';
var ipMappingData = {};

fs.readFile(ipMappingFile, 'utf8', function(err, data) {
  if(err) {
    console.log('read ipMappingFile error: ' + err);
    return;
  }
  ipMappingData = JSON.parse(data);
  //console.log("ipMappingData: " + ipMappingData);
  // var tmp = ipMappingData.filter(function(obj) {
  //   return obj.IP === '192.168.20.1';
  // });
  // console.log("________________________________>>> " + tmp[0].NAME);
});

process.on('message', function(msg) {
  if (msg == 'firstInit') {
    checkAliveResult(3);
    console.log('firstInit ping');
  }
});

function initIpArray(ipRange, upper, lower, ignoreIPs) {
  for (var x = parseInt(lower); x <= parseInt(upper); x++) {
    pingSet[ipRange+x] = 0;
  }
  for (var x = 0; x < ignoreIPs.length; x++) {
    delete pingSet[ipRange + ignoreIPs[x]];
  }
}

function queryHost(host) {
  // console.log('queryHost: ' + host);
  session.pingHost(host, function(err, ip) {
    if (err) {
      pingSet[ip] += 1;
    } else {
      pingSet[ip] = 0;
    }
    // console.log(ip + " : " + pingSet[ip]);
  });
}

function checkAlive() {
  // console.log('checkAlive');
  for (var ip in pingSet) {
    setTimeout(queryHost(ip), 5000);
  }
}
var failedIp = [];
function checkAliveResult(errorTimes) {
  for (var ip in pingSet) {
    if (pingSet[ip] >= errorTimes) {
      // console.log(ip + " is over " + errorTimes);
      var data = {};
      var tmp = ipMappingData.filter(function(obj) {
        return obj.IP === ip;
      });
      data["ID"] = tmp[0].ID;
      // data["IP"] = tmp[0].IP;
      // data["DATE"] = Date();
      failedIp.push(data);
      pingSet[ip] = parseInt(errorTimes);
    }
  }
  //console.log(failedIp);
  process.send(failedIp);
}

var iniRead = require('./iniRead.js')(function(iniData) {
  initIpArray(iniData.ipRange1.range, iniData.ipRange1.upper, iniData.ipRange1.lower, iniData.ipRange1.ignore);
  setInterval(checkAlive, iniData.pingTime);
  setInterval(checkAliveResult, iniData.checkTime, iniData.errorTimes);
});
