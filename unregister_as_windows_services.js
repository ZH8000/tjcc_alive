var Service = require('node-windows').Service;

var svc = new Service({
  name:'alive service',
  description:'tjcc machine alive service',
  script:'D:\\alive_server\\server.js'
});

//svc.sudo.password = '';

svc.on('uninstall', function() {
  console.log('uninstall complete.');
  console.log('the service exists: ' + svc.exists);
});

svc.uninstall();
