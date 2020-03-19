const { ipcMain } = require('electron');

const dataLoader = require('./dataLoader/dataLoader.js');

let events = {};

ipcMain.on('request-data', (event, arg) => {
  console.log('request-data', arg);
  events[arg] = event;
  dataLoader.loadData(arg);
});

exports.sendData = function(name, data) {
  events[name].sender.send('send-data', {name: name, data: data});
}
/*
ipcMain.on('chnl1', (event, arg) => {
  console.log(arg);
  event.sender.send('chnl1', 'msg2');
})
*/
