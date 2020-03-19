const { ipcRenderer } = require('electron');

let callbacks = {};

exports.requestData = function(arg, callback) {
  callbacks[arg] = callback;
  ipcRenderer.send('request-data', arg);
}

ipcRenderer.on('send-data', (event, arg) => {
  callbacks[arg['name']](arg['data']);
})

/*
ipcRenderer.send('chnl1', 'msg1');

ipcRenderer.on('chnl1', (event, arg) => {
  console.log(arg);
})
*/
