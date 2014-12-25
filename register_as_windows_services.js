var Service = require('node-windows').Service;

var svc = new Service({
  name:'alive service',
  description:'tjcc machine alive service',
  script:'D:\\alive_server\\server.js'
});

//svc.sudo.password = '';

svc.on('install', function() {
  svc.start();
});

svc.install();
