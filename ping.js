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
  }
  // console.log(data);
  ipMappingData = JSON.parse(data);
});

process.on('message', function(msg) {
  if (msg == 'firstInit') {
    // checkAliveResult(10);
    console.log('firstInit');
  }
});

function queryHost(host) {
  // console.log('queryHost');
  session.pingHost(host, function(err, ip) {
    if (err) {
      pingSet[ip] += 1;
    } else {
      pingSet[ip] = 0;
    }
    console.log(ip + " : " + pingSet[ip]);
  });
}

function checkAlive() {
  // console.log('checkAlive');
  for (var ip in pingSet) {
    setTimeout(queryHost(ip), 5000);
  }
}

function checkAliveResult(errorTimes) {
  // console.log('checkAliveResult');
  var failedIp = [];
  for (var ip in pingSet) {
    if (pingSet[ip] >= errorTimes) {
      var tmp = ipMappingData.filter(function(obj) {
        return obj.IP === ip;
      });
console.log(tmp);
      var data = {};
      data["ID"] = tmp[0].ID;
      failedIp.push(data);
      pingSet[ip] = parseInt(errorTimes);
    }
  }
  process.send(failedIp);
}

function initIpArray(ipRange, upper, lower, ignoreIPs) {
  for (var x = parseInt(lower); x <= parseInt(upper); x++) {
    pingSet[ipRange+x] = 0;
  }
  for (var x = 0; x < ignoreIPs.length; x++) {
    delete pingSet[ipRange + ignoreIPs[x]];
;  }
}

var iniRead = require('./iniRead.js')(function(iniData) {
  initIpArray(iniData.ipRange1.range, iniData.ipRange1.upper, iniData.ipRange1.lower, iniData.ipRange1.ignore);
  setInterval(checkAlive, iniData.pingTime);
  setInterval(checkAliveResult, iniData.checkTime, iniData.errorTimes);
});
