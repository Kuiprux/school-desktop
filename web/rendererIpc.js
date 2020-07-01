const { ipcRenderer } = require('electron');

let callbacks = {};

exports.requestData = function(name, callback) {
  console.log('reqing ' + name);
  exports.requestDataWithArg({name: name}, callback);
}

exports.requestDataWithArg = function(arg, callback) {
  callbacks[arg['name']] = callback;
  ipcRenderer.send('request-data', arg);
}

ipcRenderer.on('send-data', (event, arg) => {
  console.log('resing ' + arg['name']);
  callbacks[arg['name']]({arg: arg['arg'], data: arg['data']});
})

/*
ipcRenderer.send('chnl1', 'msg1');

ipcRenderer.on('chnl1', (event, arg) => {
  console.log(arg);
})
*/
