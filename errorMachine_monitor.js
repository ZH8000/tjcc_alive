var folder = "/tcjcc/errorMachine/";
var file = "errorMachine.txt";

var fs = require('fs');
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
      data["NAME"] = array[x];
      data["DATE"] = Date();
      failedMachine.push(data);
    }
    process.send(failedMachine);
    // console.log(failedMachine);
    /*
    fs.readFile(folder + file, 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }

    });
    */
  }
});
