const { ipcMain } = require('electron');

const dataLoader = require('./dataLoader/dataLoader.js');

let events = {};

ipcMain.on('request-data', (event, reqInfo) => {
  console.log('request-data', reqInfo);
  events[reqInfo['name']] = event;
  dataLoader.loadData(reqInfo);
});

exports.sendData = function(reqInfo, data) {
  events[reqInfo['name']].sender.send('send-data', {name: reqInfo['name'], arg: reqInfo['arg'], data: data});
}
/*
ipcMain.on('chnl1', (event, arg) => {
  console.log(arg);
  event.sender.send('chnl1', 'msg2');
})
*/
