var ipMappingFile = 'json/ipMapping.json';
var ipMappingData = {};
var folder = "/tcjcc/errorMachine/";
var file = "errorMachine.txt";
var fs = require('fs');

fs.readFile(ipMappingFile, 'utf8', function(err, data) {
  if(err) {
    console.log('read ipMappingFile error: ' + err);
    return;
  }
  ipMappingData = JSON.parse(data);
});

var fsmonitor = require('fsmonitor');

console.log("start to monitor folder: /tcjcc/errorMachine");

fsmonitor.watch(folder, null, function(change) {
  if (change.modifiedFiles.indexOf("errorMachine.txt") > -1) {
    console.log("errorMachine.txt changed!");
    var failedMachine = [];
    var array = fs.readFileSync(folder + file).toString().split("\r\n");
    for (var x in array) {
      // console.log("file content: " + array[x]);
      var data = {};
	  //var tmp = null;
      var tmp = ipMappingData.filter(function(obj) {
        return obj.NAME === array[x];
      });
	  console.log("tmp:" + tmp);
	  if (tmp != "") {
        data["ID"] = tmp[0].ID
        // data["NAME"] = tmp[0];
        // data["DATE"] = Date();
        failedMachine.push(data);
	  }
    }
    process.send(failedMachine);
    // console.log(failedMachine);
  }
});
